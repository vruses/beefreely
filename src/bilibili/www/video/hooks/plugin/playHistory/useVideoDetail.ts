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
    // 分p视频集数,客户端处于第几集似乎只在 url 中的 p 参数中体现
    const page = view.videos > 1 ? Number(new URLSearchParams(location.search).get('p') ?? 1) : 1
    // 分p视频中，view.cid 仅为第一集的 cid，其他集的 cid 需要从 view.pages 中查找
    const cid = view.videos > 1 ? (view.pages.find((p) => p.page === page)?.cid ?? view.cid) : view.cid
    meta.history = {
      ...meta.history,
      oid: view.aid,
      bvid: view.bvid,
      cid,
      business: 'archive',
      page,
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
