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
    const { view_at, ps, type } = params
    // 索引过滤：view_at < 指定时间，倒序
    let collection = db.history
      .where('view_at')
      .below(view_at || Infinity)
      .reverse()
      .limit(ps)

    // 业务类型过滤下推
    collection = collection.and((item) => {
      if (type !== 'all' && type !== item.history.business) return false
      return true
    })

    const records = await collection.toArray()

    // 计算游标标记：下一页的截止时间
    const lastItem = records.at(-1)
    const nextViewAt = lastItem ? lastItem.view_at : 0

    return {
      list: records,
      cursor: {
        business: type,
        max: 0,
        ps: records.length ? ps : 0,
        view_at: nextViewAt,
      },
    }
  },

  async search(params: SearchParam) {
    const pageSize = 20
    const { pn, keyword, business, add_time_start, add_time_end, arc_min_duration, arc_max_duration, device_type } =
      params
    const kw = keyword.toLowerCase()
    const skip = (pn - 1) * pageSize

    // 观看时间段，结束时间段为 0 时则返回全部时间段的记录
    let collection = db.history
      .where('view_at')
      .between(add_time_start, add_time_end || Infinity, true, true)
      .reverse()

    // 叠加可下推的过滤条件，减少原始行数
    collection = collection.and((item) => {
      // 业务类型筛选，直播、视频、文章还是全部
      if (business !== 'all' && item.history.business !== business) return false
      // 设备类型筛选
      if (device_type && item.history.dt !== device_type) return false
      // 根据视频长度筛选，min=max=0 说明不需要筛选, min>(max=0),则说明 max 为 infinity
      if (arc_min_duration || arc_max_duration) {
        return item.duration >= arc_min_duration && item.duration <= (arc_max_duration || Infinity)
      }
      return true
    })

    // 无关键词时，直接 offset + limit 分页
    if (!kw) {
      const total = await collection.count()
      const list = await collection.offset(skip).limit(pageSize).toArray()
      return {
        list,
        total,
        hasMore: skip + pageSize < total,
      }
    }
    // 有关键词模糊匹配：游标遍历收集，不加载全量数据
    const matchedList: HistoryRecord[] = []
    let skipped = 0

    await collection.each((r) => {
      const title = r.title.toLowerCase()
      const author = r.author_name.toLowerCase()
      const match = title.includes(kw) || author.includes(kw)

      if (match) {
        if (skipped < skip) {
          skipped++
        } else if (matchedList.length < pageSize) {
          matchedList.push(r)
        } else {
          // 凑够一页，停止游标遍历
          return false
        }
      }
      // 继续下一条
      return true
    })

    // 统计总匹配条数
    const total = await collection
      .and((item) => {
        const title = item.title.toLowerCase()
        const author = item.author_name.toLowerCase()
        return title.includes(kw) || author.includes(kw)
      })
      .count()

    return {
      list: matchedList,
      total,
      hasMore: skip + pageSize < total,
    }
  },

  async delete(kids: number[]): Promise<void> {
    await db.history.bulkDelete(kids)
  },

  async clear(): Promise<void> {
    await db.history.clear()
  },
}

const defaultHistoryRecord: HistoryRecord = {
  kid: 0,
  history: {
    bvid: '',
    oid: 0,
    cid: 0,
    part: '',
    business: 'archive',
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
