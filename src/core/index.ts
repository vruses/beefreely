import { random } from 'lodash-es'
import { domainConfig } from '@/core/config'
import onRequest, { clearRequestHooks } from '@/utils/ajax'
import { stop as stopDmIntercept } from '@/utils/websocket/intercept'

// 避免在 iframe 多次执行逻辑
if (window.top === window.self) {
  // DedeUserID__ckMd5 字段判断登录
  if (!document.cookie.match(/DedeUserID__ckMd5=([^;]+)/)?.[1]) {
    // player 判断用户登录的另一种方式，用于尽早执行某些需要登录状态的逻辑
    // biome-ignore lint: <修改document.cookie的唯一方法>
    document.cookie = `DedeUserID=${random(2 ** 53)}; path=/; domain=.bilibili.com`
  } else {
    // 已登录，清除可能设置的拦截钩子
    // 暂时保留 useNav 接口的登录判断
    queueMicrotask(() => {
      // 清除所有请求钩子
      clearRequestHooks()
      // 移除弹幕 ws 拦截
      stopDmIntercept()
    })
  }
}

const subdomain = location.host.split('.').shift()
if (subdomain && !domainConfig.blackList.includes(subdomain)) {
  // 注入共享钩子
  domainConfig.sharedHook.forEach((hook) => {
    onRequest(hook)
  })
  // 注入对应二级域名钩子
  const domainItem = domainConfig.children.find((item) => item.name === subdomain)
  if (domainItem) {
    domainItem.hook.forEach((hook) => {
      onRequest(hook)
    })
    // 执行对应二级域名动作
    domainItem.action?.forEach((action) => {
      action()
    })
  }
}

export default {}
