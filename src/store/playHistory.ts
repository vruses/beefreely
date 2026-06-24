import { reactive, ref } from '@vue/reactivity'
import Dexie, { type EntityTable } from 'dexie'
import type { HistoryRecord, VideoMeta } from './playHistory.type'

const db = new Dexie('beefreely_history') as Dexie & { history: EntityTable<HistoryRecord, 'aid'> }

db.version(1).stores({
  history: 'aid',
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

  getAll(): Promise<HistoryRecord[]> {
    return db.history.toArray()
  },
}

function getSSRVideoMeta() {
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
      bvid: videoData.bvid ?? '',
      cid: videoData.cid ?? 0,
      title: videoData.title ?? '',
      cover: videoData.pic ?? '',
      author_name: owner.name ?? '',
      author_mid: owner.mid ?? 0,
      author_face: owner.face ?? '',
      duration: videoData.duration ?? 0,
      videos: videoData.videos ?? 1,
    }
  } catch {
    return {} as unknown as VideoMeta
  }
}

export function usePlayerMetaStore() {
  const currentVideoMeta = ref<VideoMeta>()
  // ssr 数据挂载需要一定时间，这里让 meta 信息被调用时才初始化
  return {
    get currentVideoMeta() {
      currentVideoMeta.value ??= reactive(getSSRVideoMeta())
      return currentVideoMeta.value
    },
  }
}
export const playerMetaStore = usePlayerMetaStore()
