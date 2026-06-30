import live from '@/bilibili/live'
import search from '@/bilibili/search'
import shared from '@/bilibili/shared'
import space from '@/bilibili/space'
import www from '@/bilibili/www'
import { start as startDmIntercept } from '@/utils/websocket/intercept'

/** 用于控制二级域名下应该执行的 request hook */
export const domainConfig = {
  /** 不应该被任何钩子拦截的页面 */
  blackList: ['passport'],
  /** 共享 request hook */
  sharedHook: [...shared],
  /** 各二级域名对应的 request hook */
  children: [
    {
      name: 'www',
      hook: [...www],
      action: [
        () => {
          // Prevent the player from retrieving the correct playback information
          Object.defineProperty(window, '__playinfo__', {
            get: () => null,
            configurable: true,
          })
          const script = document.createElement('script')
          script.textContent = `const playurlSSRData = {}`
          document.documentElement.appendChild(script)
        },
      ],
    },
    // 搜索页
    {
      name: 'search',
      hook: [...search],
    },
    // 用户空间
    {
      name: 'space',
      hook: [...space],
    },
    // 直播页
    {
      name: 'live',
      hook: [...live],
      action: [startDmIntercept],
    },
  ],
}
