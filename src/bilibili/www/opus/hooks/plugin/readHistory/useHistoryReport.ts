import { toRaw } from '@vue/reactivity'
import { historyDB, playerMetaStore } from '@/store/playHistory'
import { onResponse, type RequestFn } from '@/utils/ajax'

/**
 * 用于上报专栏阅读历史
 */
export const useHistoryReport: RequestFn<'fetch'> = (request) => {
  if (!request.url.includes('/x/v2/history/report')) return

  onResponse(request, async () => {
    playerMetaStore.currentVideoMeta.badge = '专栏'
    playerMetaStore.currentVideoMeta.history.business = 'article'
    const meta = toRaw(playerMetaStore.currentVideoMeta)
    if (meta.kid)
      historyDB.upsert({
        ...meta,
      })
  })
}
