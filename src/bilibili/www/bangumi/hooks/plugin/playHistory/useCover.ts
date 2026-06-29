import type { BangumiMedia } from '@/bilibili/www/bangumi/model/types'
import { playerMetaStore } from '@/store/playHistory'
import { onResponse, type RequestFn } from '@/utils/ajax'

/**
 * 获取番剧封面
 * @description 一个番剧封面图获取较为稳定的接口
 */
export const useCover: RequestFn<'xhr'> = (request) => {
  if (!request.url.includes('/pgc/review/user')) return

  onResponse(request, async (res) => {
    const result = JSON.parse(res.responseText) as { result: { media: BangumiMedia } }
    playerMetaStore.currentVideoMeta.cover = result.result.media.horizontal_picture
    playerMetaStore.currentVideoMeta.title = result.result.media.title
  })
}
