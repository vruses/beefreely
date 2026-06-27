import { toResult } from '@/constants/utils'
import { historyDB } from '@/store/playHistory'
import type { RequestFn } from '@/utils/ajax'
import parseParams, { type ParamSchema } from '@/utils/parseParams'
import type { CursorParam, HistoryCursor, HistorySearch, SearchParam } from './model/types'

/**
 * @description 历史观看记录瀑布流
 */
export const useHistoryCursor: RequestFn<'fetch'> = (request) => {
  if (!request.url.includes('/x/web-interface/history/cursor')) return

  const qs = request.url.split('?')[1] ?? ''
  const cursorParamSchema: ParamSchema<CursorParam> = {
    max: 'number',
    view_at: 'number',
    ps: 'number',
    type: 'string',
    business: 'string',
  }
  const params = parseParams<CursorParam>(qs, cursorParamSchema)

  request.response = async (res) => {
    const { list, cursor } = await historyDB.getCursor(params)

    const result = toResult<HistoryCursor>({
      cursor,
      tab: [
        { type: 'archive', name: '视频' },
        { type: 'live', name: '直播' },
        { type: 'article', name: '专栏' },
      ],
      list,
    })

    res.json = result
  }
}

/**
 * @description 历史观看记录条件检索
 */
export const useHistorySearch: RequestFn<'fetch'> = (request) => {
  if (!request.url.includes('/x/web-interface/history/search')) return

  const qs = request.url.split('?')[1] ?? ''
  const searchParamSchema: ParamSchema<SearchParam> = {
    pn: 'number',
    keyword: 'string',
    business: 'string',
    add_time_start: 'number',
    add_time_end: 'number',
    arc_max_duration: 'number',
    arc_min_duration: 'number',
    device_type: 'number',
  }
  const params = parseParams<SearchParam>(qs, searchParamSchema)

  request.response = async (res) => {
    const { list, total, hasMore } = await historyDB.search(params)

    const result = toResult<HistorySearch>({
      has_more: hasMore,
      list: list,
      page: {
        pn: params.pn,
        total,
      },
    })

    res.json = result
  }
}
