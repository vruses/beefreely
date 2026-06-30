import { playerMetaStore } from '@/store/playHistory'
import type { VideoDetailView } from '@/types/window'
import { onResponse, type RequestFn } from '@/utils/ajax'

/**
 * @description 视频详细数据获取
 */
export const useVideoDetail: RequestFn<'xhr'> = (request) => {
  if (!request.url.includes('/x/web-interface/wbi/view/detail')) return

  onResponse(request, async (res) => {
    const detailData = JSON.parse(res.responseText)
    const view = detailData.data.View as VideoDetailView
    if (!view) return

    const meta = playerMetaStore.currentVideoMeta
    meta.kid = view.aid

    meta.history = {
      ...meta.history,
      oid: view.aid,
      bvid: view.bvid,
      cid: view.cid,
      business: 'archive',
    }
    meta.title = view.title
    meta.cover = view.pic
    meta.author_name = view.owner.name
    meta.author_mid = view.owner.mid
    meta.author_face = view.owner.face
    meta.duration = view.duration
    meta.videos = view.videos
  })
}
