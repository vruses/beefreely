import protobuf from 'protobufjs'
import { img_key, sub_key } from '@/constants'
import type { ResultType } from '@/types/response'
import type { RequestFn } from '@/utils/ajax'
import { encWbi } from '@/utils/wbi-sign'
import { archiveRelationResult, relationResult } from '../model/constants'
import { DmWebView } from '../model/DmWebView'
import type { PlayerUserInfo } from '../model/types'
import { getEncryptSubtitle } from './useCrypt'
import useSubtitle from './useSubtitle'

/**
 * @description 控制播放器请求的用户信息始终为登录状态
 */
export const usePlayer: RequestFn<'xhr'> = (request) => {
  if (!request.url.includes('/x/player/wbi/v2')) return
  request.response = async (res) => {
    const playerResponse: ResultType<PlayerUserInfo> = JSON.parse(res.responseText)
    // 认定登录状态的字段
    playerResponse.data.login_mid = Math.floor(Math.random() * 100000)
    // 不需要登录即可使用字幕功能，此字段控制字幕功能 ui 显示
    playerResponse.data.need_login_subtitle = false
    // 等级不同ui显示不同
    playerResponse.data.level_info.current_level = 6
    res.responseText = JSON.stringify(playerResponse)
  }
}

/**
 * @description 获取更高质量视频的cdn地址
 */
export const usePlayurl: RequestFn<'xhr'> = (request) => {
  // inject custom qsParams to fetch higher-quality CDN video
  if (!request.url.includes('api.bilibili.com/x/player/wbi/playurl')) return
  // Remove w_rid & wts, set try_look=1 and qn=80, then re-WbiSign
  const qsParams = Object.fromEntries(new URLSearchParams(request.url.split(/\?|&w_rid/)[1]).entries())
  Reflect.set(qsParams, 'qn', 80) // qualityNumber->1080p
  Reflect.set(qsParams, 'try_look', 1)
  const query = encWbi(qsParams, img_key, sub_key)
  request.url = `//api.bilibili.com/x/player/wbi/playurl?${query}`
  // 还原window.__playinfo__对象
  request.response = (res) => {
    Object.defineProperty(window, '__playinfo__', {
      get() {
        return JSON.parse(res.responseText ?? '{}')
      },
      configurable: true,
    })
  }
}

/**
 * @description 返回与视频up主的关系，用于显示粉丝数
 */
export const useRelation: RequestFn<'xhr'> = (request) => {
  if (!request.url.includes('/x/web-interface/relation')) return
  request.response = (res) => {
    res.responseText = JSON.stringify(relationResult)
  }
}

/**
 * @description 返回用户与该视频的互动数据，用于去除某些未登录提示
 */
export const useArchiveRelation: RequestFn<'xhr'> = (request) => {
  if (!request.url.includes('/x/web-interface/archive/relation')) return
  request.response = (res) => {
    res.responseText = JSON.stringify(archiveRelationResult)
  }
}

/**
 * @description 修改弹幕元数据，并添加混淆后的弹幕 URL, 前端反序列化时便能获取字幕数据
 * @param subtitleCache 页面首次加载时或者每次请求时等待的字幕接口
 * @returns 请求拦截函数
 */
export const useDmView: () => RequestFn<'xhr', unknown, ArrayBuffer> = () => {
  // 大部分用户只会在视频首次加载观看后就关闭页面，除了分p视频的场景会有切换需求，这个速度优化是有意义的
  let isFirstRequest = true
  const { subtitleCache, setSubtitle, camelizeSubtitle } = useSubtitle()

  return (request) => {
    if (!request.url.includes('/x/v2/dm/web/view')) return
    // get请求从url里获取请求参数
    const payload = Object.fromEntries(new URL('https:' + request.url).searchParams.entries()) as unknown as {
      oid: number
      pid: number
    }
    // 更新字幕数据
    if (!isFirstRequest) setSubtitle(payload.pid, payload.oid)
    isFirstRequest = false

    request.response = async (res) => {
      // 获取 弹幕元信息 protobuf 类型
      const root = protobuf.Root.fromJSON(DmWebView)
      const DmWebViewReply = root.lookupType('bilibili.community.service.dm.v1.DmWebViewReply')
      // 反序列化为 meta 对象
      const message = DmWebViewReply.decode(new Uint8Array(res.response))
      const dmMetaData = DmWebViewReply.toObject(message, {
        defaults: false,
      })

      // 处理为指定格式的字幕
      const subtitle = await subtitleCache.current
      const camelizedSubtitle = subtitle ? camelizeSubtitle(subtitle) : null
      if (camelizedSubtitle) {
        const camelizedSubtitles = camelizedSubtitle.subtitles.map((subtitle) => {
          return {
            ...subtitle,
            // 字幕 URI 加密
            subtitleUrl: getEncryptSubtitle(subtitle.subtitleUrl),
          }
        })
        camelizedSubtitle.subtitles = camelizedSubtitles
      }

      // 修改 meta 中的字幕对象, 序列化为二进制数据
      dmMetaData.subtitle = camelizedSubtitle
      const encodedMessage = DmWebViewReply.create(dmMetaData)
      const encodedBuffer = DmWebViewReply.encode(encodedMessage).finish()
      res.response = encodedBuffer as unknown as ArrayBuffer
    }
  }
}
