import type { ResultType } from '@/types/response'
import { onResponse, type RequestFn } from '@/utils/ajax'
import type { Playview } from '../model/types'

/**
 * @description 获取番剧 cdn 和少部分相关信息，此 hook 用于同步登录状态
 */
export const usePlayHistory: RequestFn<'fetch', unknown, ResultType<Playview>> = (request) => {
  if (!request.url.includes('/ogv/player/playview')) return

  onResponse(request, async (res) => {
    res.json.data.user_status.is_login = true
  })
}
