import { camelCase, mapKeys } from 'lodash-es'
import type { CamelCasedPropertiesDeep } from 'type-fest'
import { onDocInteractive } from '@/core/lifecycle'
import type { ResultType } from '@/types/response'
import type { Subtitles } from '../model/types'

/**
 *
 * @param aid 视频稿件级唯一标识
 * @param cid 视频内容级唯一标识
 * @returns 不同语种的字幕信息，字幕内容以url形式
 */
export async function fetchSubtitle(aid: number, cid: number) {
  const url = `https://api.bilibili.com/x/v2/dm/view?aid=${aid}&oid=${cid}&type=1`
  return await fetch(url)
    .then((result) => {
      return result.json()
    })
    .then((result: ResultType<Subtitles>) => {
      return result.data.subtitle
    })
    .catch(() => null)
}

type SubtitleCache = Subtitles['subtitle'] | null
type CamelizedSubtitle = CamelCasedPropertiesDeep<Subtitles['subtitle']>

/**
 * subtitle缓存与更新subtitle
 */
export default function useSubtitle() {
  const subtitleCache = {
    current: new Promise<SubtitleCache>((resolve) => {
      onDocInteractive(() => {
        // window.vd挂载完成后至player请求之前立即先获取一次字幕
        const { aid, cid } = window.vd ?? {}
        aid && cid ? resolve(fetchSubtitle(aid, cid)) : resolve(null)
      })
    }),
  }

  // 动态更新
  function setSubtitle(aid?: number, cid?: number) {
    if (aid && cid) {
      subtitleCache.current = fetchSubtitle(aid, cid)
    } else {
      subtitleCache.current = Promise.resolve(null)
    }
  }
  /** subtitle 接口返回的对象字段为下划线命名，转换为 protobuf 格式所需的驼峰命名 */
  function camelizeSubtitle(subtitle: Subtitles['subtitle']) {
    const camelizedSubtitle = mapKeys(subtitle, (_v, k) => camelCase(k)) as any
    // 字幕列表也需要转换
    const camelizedSubtitles = subtitle.subtitles
      ? subtitle.subtitles.map((subtitle) => {
          return {
            ...mapKeys(subtitle, (_v, k) => camelCase(k)),
          }
        })
      : null
    camelizedSubtitle.subtitles = camelizedSubtitles
    return camelizedSubtitle as CamelizedSubtitle
  }

  return {
    subtitleCache,
    setSubtitle,
    camelizeSubtitle,
  }
}
