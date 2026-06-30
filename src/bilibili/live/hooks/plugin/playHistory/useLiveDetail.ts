import { playerMetaStore } from '@/store/playHistory'
import type { ResultType } from '@/types/response'
import type { LiveDetail } from '@/types/window'
import { onResponse, type RequestFn } from '@/utils/ajax'

/**
 * 返回直播详细信息
 * @description 少数直播间如赛事等直播间才从接口获取详细信息，绝大部分还是通过首屏 ssr
 */
export const useLiveDetail: RequestFn<'fetch', unknown, ResultType<LiveDetail>> = (request) => {
  if (!request.url.includes('/xlive/web-room/v1/index/getInfoByRoom')) return

  onResponse(request, async (res) => {
    const roomInfo = res.json.data.room_info
    const anchorInfo = res.json.data.anchor_info
    playerMetaStore.currentVideoMeta.kid = roomInfo.room_id
    playerMetaStore.currentVideoMeta.history.oid = roomInfo.room_id
    playerMetaStore.currentVideoMeta.title = roomInfo.title
    playerMetaStore.currentVideoMeta.cover = roomInfo.cover
    playerMetaStore.currentVideoMeta.author_name = anchorInfo.base_info.uname
    playerMetaStore.currentVideoMeta.author_face = anchorInfo.base_info.face
    playerMetaStore.currentVideoMeta.author_mid = roomInfo.uid
    playerMetaStore.currentVideoMeta.live_status = roomInfo.live_status
  })
}
