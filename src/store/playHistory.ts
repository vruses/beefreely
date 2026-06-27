import { reactive, ref } from '@vue/reactivity'
import Dexie, { type EntityTable } from 'dexie'
import type { CursorParam, HistoryRecord, SearchParam } from '@/bilibili/www/history/model/types'

const db = new Dexie('beefreely_history') as Dexie & { history: EntityTable<HistoryRecord, 'aid'> }

db.version(2).stores({
  history: 'aid, view_at',
})

export const historyDB = {
  get(aid: number): Promise<HistoryRecord | undefined> {
    return db.history.get(aid)
  },

  async upsert(record: Partial<HistoryRecord> & { aid: number }): Promise<void> {
    const existing = await db.history.get(record.aid)
    const merged = { ...existing, ...record, view_at: Math.floor(Date.now() / 1000) } as HistoryRecord
    await db.history.put(merged)
  },

  async getCursor(params: CursorParam) {
    const collection = db.history
      .where('view_at')
      .below(params.view_at || Infinity)
      .reverse()
    let records = await collection.toArray()
    if (params.type !== 'all') records = records.filter((r) => r.history.business === params.type)
    return {
      list: records,
      cursor: {
        business: params.type,
        max: 0,
        ps: records.length !== 0 ? params.ps : 0,
        view_at: records.length !== 0 ? records[records.length - 1].view_at : 0,
      },
    }
  },

  async search(params: SearchParam) {
    const ps = 20
    const kw = params.keyword.toLowerCase()
    // 观看时间段，结束时间段为 0 时则返回全部时间段的记录
    const collection = db.history
      .where('view_at')
      .between(params.add_time_start, params.add_time_end || Infinity, true, true)
      .reverse()

    let records = await collection.toArray()
    // 直播、视频、文章还是全部
    if (params.business !== 'all') records = records.filter((r) => r.history.business === params.business)
    // 筛选标题和作者名
    if (params.keyword)
      records = records.filter((r) => r.title.toLowerCase().includes(kw) || r.author_name.toLowerCase().includes(kw))
    // 根据视频长度筛选，min=max=0 说明不需要筛选, min>(max=0),则说明 max 为 infinity
    if (params.arc_min_duration || params.arc_max_duration) {
      records = records.filter(
        (r) => r.duration >= params.arc_min_duration && r.duration <= (params.arc_max_duration | Infinity)
      )
    }
    // 根据观看设备筛选
    if (params.device_type) records = records.filter((r) => r.history.dt === params.device_type)
    const start = (params.pn - 1) * ps
    return {
      list: records.slice(start, start + ps),
      total: records.length,
      hasMore: start + ps <= records.length,
    }
  },
}

/**
 * @description 将视频 detail 转化成 historyRecord
 */
function getSSRVideoMeta(): HistoryRecord {
  try {
    // TODO:
    // 直播页面：window.__SSR_INITIAL_STATE__
    // 番剧页面：window.__NEXT_DATA__,list 请求
    // 稿件页面：window.__INITIAL_STATE__,detail 请求
    const videoData = window?.__INITIAL_STATE__?.videoData
    if (!videoData) throw new Error('No video data in SSR state')
    const owner = videoData.owner
    return {
      aid: videoData.aid ?? 0,
      history: {
        bvid: videoData.bvid ?? '',
        oid: videoData.aid ?? 0,
        cid: videoData.cid ?? 0,
        part: '',
        business: '',
        dt: 1,
      },
      title: videoData.title ?? '',
      cover: videoData.pic ?? '',
      author_name: owner.name ?? '',
      author_mid: owner.mid ?? 0,
      author_face: owner.face ?? '',
      duration: videoData.duration ?? 0,
      videos: videoData.videos ?? 1,
      tag_name: videoData.tag_name ?? '',
      // these data will update in useHeartbeat hook
      badge: '',
      view_at: 0,
      progress: 0,
      last_play_time: 0,
    }
  } catch {
    return {} as unknown as HistoryRecord
  }
}

export function usePlayerMetaStore() {
  const currentVideoMeta = ref<HistoryRecord>()
  // ssr 数据挂载需要一定时间，这里让 meta 信息被调用时才初始化
  return {
    get currentVideoMeta() {
      currentVideoMeta.value ??= reactive(getSSRVideoMeta())
      return currentVideoMeta.value
    },
  }
}
export const playerMetaStore = usePlayerMetaStore()
