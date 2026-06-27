import { toRaw } from '@vue/reactivity'
import { historyDB, playerMetaStore } from '@/store/playHistory'
import type { RequestFn } from '@/utils/ajax'

/**
 * @description 视频观看进度心跳上报
 */
export const useHeartbeat: RequestFn = (request) => {
  if (!request.url.includes('/x/click-interface/web/heartbeat')) return
  const payload = new URLSearchParams(request.data as string)
  if (!payload) return

  const meta = toRaw(playerMetaStore.currentVideoMeta)

  historyDB.upsert({
    ...meta,
    progress: Number(payload.get('played_time') ?? 0),
    duration: Number(payload.get('video_duration') ?? 0),
    last_play_time: Number(payload.get('played_time') ?? 0) * 1000,
  })
}
