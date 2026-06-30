import { playerMetaStore } from '@/store/playHistory'
import type { ResultType } from '@/types/response'
import { onResponse, type RequestFn } from '@/utils/ajax'
import type { Playview } from '../../../model/types'

/**
 * 获取 Bangumi 详细信息
 */
export const useBangumiDetail: RequestFn<'fetch', unknown, ResultType<Playview>> = (request) => {
  if (!request.url.includes('/ogv/player/playview')) return

  onResponse(request, async (res) => {
    const data = res.json.data
    playerMetaStore.currentVideoMeta.badge = '番剧'
    playerMetaStore.currentVideoMeta.history.oid = data.arc.aid
    playerMetaStore.currentVideoMeta.history.bvid = data.arc.bvid
    playerMetaStore.currentVideoMeta.history.cid = data.arc.cid
    // 方便分类，pgc 统一为 archive
    playerMetaStore.currentVideoMeta.history.business = 'archive'

    const supplement = data.supplement
    playerMetaStore.currentVideoMeta.history.epid = supplement.ogv_episode_info.episode_id
    playerMetaStore.currentVideoMeta.show_title = supplement.ogv_episode_info.long_title
    // kid = season_id in Bangumi
    playerMetaStore.currentVideoMeta.kid = supplement.ogv_season_info.season_id
    playerMetaStore.currentVideoMeta.uri = `https://www.bilibili.com/bangumi/play/ep${supplement.ogv_episode_info.episode_id ?? 0}`
  })
}
