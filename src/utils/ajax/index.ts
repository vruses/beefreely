import ajaxHooker, { type Ajax } from '@/utils/ajax/ajax-hooker'

/**
 * ajaxhooker 钩子函数类型
 * @template Type - 请求类型，支持 `'xhr'` 或 `'fetch'`
 * @template Payload - 请求参数类型，默认为 `unknown`
 * @template Result - 响应数据类型，默认为 `unknown`
 */
export type RequestFn<Type = unknown, Payload = unknown, Result = unknown> = (
  request: Type extends 'xhr' | 'fetch' ? Ajax.Request<Type, Payload, Result> : Ajax.BaseRequest
) => unknown

/**
 * @example
 * 请求钩子管理类，中间维护一份 hooks 缓存并让 ajaxHooker.hook 只执行一次
 * 提供更方便的 api 如清空所有hook
 */
class RequestHooker {
  private static instance: RequestHooker | null = null
  private hooks: Set<RequestFn> = new Set()
  private isHooked = false

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): RequestHooker {
    if (!RequestHooker.instance) {
      RequestHooker.instance = new RequestHooker()
    }
    return RequestHooker.instance
  }

  /**
   * 添加请求钩子函数
   * @param fns 一个或多个请求处理函数
   */
  add(...fns: RequestFn[]): void {
    fns.forEach((fn) => {
      this.hooks.add(fn)
    })
    this.ensureHooked()
  }

  /**
   * 移除请求钩子函数
   * @param fn 要移除的函数
   */
  remove(fn: RequestFn): void {
    this.hooks.delete(fn)
  }

  /**
   * 清空所有钩子函数
   */
  clear(): void {
    this.hooks.clear()
    // 彻底移除拦截可能带来的副作用
    ajaxHooker.unhook()
  }

  /**
   * ajaxHooker.hook 只执行一次就行
   */
  private ensureHooked(): void {
    if (this.isHooked) return
    this.isHooked = true
    ajaxHooker.hook((request) => {
      this.hooks.forEach((hook) => {
        hook(request)
      })
    })
  }
}

/**
 * 简化请求 hooker 的使用
 * @example
 * onRequest(fn1, fn2, fn3)
 */
export default function onRequest(...args: RequestFn[]): void {
  RequestHooker.getInstance().add(...args)
}

/**
 * 移除指定的请求钩子函数
 */
export function offRequest(fn: RequestFn): void {
  RequestHooker.getInstance().remove(fn)
}

/**
 * 清空所有请求钩子函数
 */
export function clearRequestHooks(): void {
  RequestHooker.getInstance().clear()
}
