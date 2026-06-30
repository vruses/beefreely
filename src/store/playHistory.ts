import { reactive, ref } from '@vue/reactivity'
import Dexie, { type EntityTable } from 'dexie'
import type { CursorParam, HistoryRecord, SearchParam } from '@/bilibili/www/history/model/types'

const db = new Dexie('BEEFREELY') as Dexie & { history: EntityTable<HistoryRecord, 'kid'> }

db.version(1).stores({
  history: 'kid, view_at',
})

export const historyDB = {
  get(kid: number): Promise<HistoryRecord | undefined> {
    return db.history.get(kid)
  },

  async upsert(record: Partial<HistoryRecord> & { kid: number }): Promise<void> {
    const existing = await db.history.get(record.kid)
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

const defaultHistoryRecord: HistoryRecord = {
  kid: 0,
  history: {
    bvid: '',
    oid: 0,
    cid: 0,
    part: '',
    business: '',
    dt: 1,
    epid: 0,
  },
  title: '',
  cover: '',
  author_name: '',
  author_mid: 0,
  author_face: '',
  videos: 1,
  tag_name: '',
  show_title: '',
  uri: '',
  badge: '',
  view_at: 0,
  live_status: 0,
  // these data will update in useHeartbeat hook
  duration: 0,
  progress: 0,
  last_play_time: 0,
}

/**
 * @description 将视频或文章 detail 转化成 historyRecord
 */
function getSSRDetail(): HistoryRecord {
  // hydration, 仅首屏 ssr
  const videoData = window?.__INITIAL_STATE__?.videoData
  // pure ssr
  const articleData = window?.__INITIAL_STATE__?.detail
  // 绝大部分 pure ssr，少部分官方直播间 采用 csr 如赛事
  const liveData = window?.__NEPTUNE_IS_MY_WAIFU__?.roomInfoRes.data

  if (!videoData && !articleData && !liveData) {
    return defaultHistoryRecord
  }

  return {
    ...defaultHistoryRecord,
    kid: videoData?.aid ?? liveData?.room_info?.room_id ?? Number(articleData?.basic?.rid_str ?? 0) ?? 0,
    history: {
      ...defaultHistoryRecord.history,
      bvid: videoData?.bvid ?? '',
      oid: videoData?.aid ?? liveData?.room_info.room_id ?? Number(articleData?.basic?.rid_str ?? 0) ?? 0,
      cid: videoData?.cid ?? 0,
    },
    title: videoData?.title ?? articleData?.basic?.title ?? liveData?.room_info.title ?? '',
    cover: videoData?.pic ?? liveData?.room_info.cover ?? '',
    author_name:
      videoData?.owner?.name ??
      articleData?.modules?.[1].module_author?.name ??
      liveData?.anchor_info.base_info.uname ??
      '',
    author_mid: videoData?.owner?.mid ?? liveData?.room_info.uid ?? Number(articleData?.basic?.uid ?? 0) ?? 0,
    author_face: videoData?.owner?.face ?? liveData?.anchor_info.base_info.face ?? '',
    videos: videoData?.videos ?? 1,
    tag_name: videoData?.tag_name ?? '',
    live_status: liveData?.room_info.live_status ?? 0,
  }
}

export function usePlayerMetaStore() {
  const currentVideoMeta = ref<HistoryRecord>()
  // ssr 数据挂载需要一定时间，这里让 meta 信息被调用时才初始化
  return {
    get currentVideoMeta() {
      currentVideoMeta.value ??= reactive(getSSRDetail())
      return currentVideoMeta.value
    },
  }
}
export const playerMetaStore = usePlayerMetaStore()
