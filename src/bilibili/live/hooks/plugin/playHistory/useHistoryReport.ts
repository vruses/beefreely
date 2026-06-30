import { toRaw } from '@vue/reactivity'
import { playerMetaStore } from '@/store/playHistory'
import { onResponse, type RequestFn } from '@/utils/ajax'

/**
 * 上报观看直播历史
 * @description 一个较为稳定且位于 liveDetail 请求之后的接口
 */
export const useHistoryReport: RequestFn<'fetch'> = (request) => {
  if (!request.url.includes('/xlive/web-room/v1/index/getInfoByUser')) return

  onResponse(request, async () => {
    const liveStatus = playerMetaStore.currentVideoMeta.live_status
    playerMetaStore.currentVideoMeta.badge = liveStatus ? '直播中' : '未开播'
    playerMetaStore.currentVideoMeta.history.business = 'live'
    //@ts-expect-error
    const _meta = toRaw(playerMetaStore.currentVideoMeta)

    // if (meta.kid)
    //   historyDB.upsert({
    //     ...meta,
    //   })
  })
}
