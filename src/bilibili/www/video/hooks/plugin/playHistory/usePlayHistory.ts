import { historyDB } from '@/store/playHistory'
import { onResponse, type RequestFn } from '@/utils/ajax'

/**
 * @description 返回上次播放进度
 */
export const usePlayHistory: RequestFn<'xhr'> = (request) => {
  if (!request.url.includes('/x/player/wbi/playurl')) return

  // 从请求 URL 中获取相关参数
  const qs = request.url.split('?')[1]
  if (!qs) return
  const searchParams = new URLSearchParams(qs)
  const aid = Number(searchParams.get('avid'))
  const cid = Number(searchParams.get('cid'))
  if (!aid || !cid) return

  // 该 url 的响应被多次 hook，包装一下避免回调被后者覆盖
  onResponse(request, async (res) => {
    const history = await historyDB.get(aid)
    if (!history) return
    const playerData = JSON.parse(res.responseText)
    playerData.data.last_play_time = history.last_play_time
    playerData.data.last_play_cid = history.cid
    res.responseText = JSON.stringify(playerData)
  })
}
