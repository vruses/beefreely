# beefreely

[![build status](https://github.com/vruses/beefreely/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/vruses/beefreely/actions/workflows/ci.yml) [![GreasyFork Downloads](https://img.shields.io/greasyfork/dt/533339?color=900)](https://greasyfork.org/zh-CN/scripts/533339) [![GitHub Repo stars](https://img.shields.io/github/stars/vruses/beefreely)](https://github.com/vruses/beefreely)

通过拦截部分 Bilibili 关键接口的请求与响应，在**未登录状态下**获得接近登录用户的完整体验。

---

## 功能特性

- 判断登录状态
  已登录时不进行任何请求拦截，避免干扰原有体验

- 默认高清画质
  视频打开即加载 1080P，有着比自动画质试用更好的体验

- 视频字幕与翻译支持

- 完整评论区展示

- 所有可能触发登录弹窗的操作均不会弹窗

- 支持记录番剧、专栏、视频稿件的观看历史，数据存放于浏览器本地 IndexdDB/BEEFREELY 数据库，由于跨域问题，直播观看历史暂不支持。

- 对部分视频下载工具提供接口支持

- 收藏功能正在开发中...

## 下载使用

前往 **[GreasyFork](https://greasyfork.org/zh-CN/scripts/533339)**

或者 **[GitHub Release](https://github.com/vruses/beefreely/releases)**

- 未压缩版本(遵循 GreasyFork 规则)
  https://github.com/vruses/beefreely/releases/latest/download/beefreely.user.js
- 压缩版本(更小的源码体积)
  https://github.com/vruses/beefreely/releases/latest/download/beefreely.min.user.js

## 构建

```bash
pnpm build
```
```bash
# 压缩产物
pnpm build:min
```

## 开发调试

`fetch` 与 `XMLHttpRequest` 的拦截必须发生在 `document-start` 阶段，因此开发不直接执行 `pnpm dev`，而是采用以下流程：

<img src="https://github.com/user-attachments/assets/e49d4cb0-176a-42a0-8886-ad11a3cf1b46" width = "30%" align='right'>

- 通过 **Violentmonkey** 插件追踪构建产物变化（这里用 Live Server 给脚本产物启用了本地服务）

- 在 `vite.config.ts` 中配置 build.emptyOutDir=false，选择覆盖而不是删除产物，这样插件才能实时响应文件的变化，还能同时存在压缩与未压缩构建产物

```js
build: {
  emptyOutDir: false
}
```

该方式可以确保拦截逻辑在浏览器生命周期的最早阶段生效同时保证一定开发体验

## 实现原理

项目具体实现原理可以看 [dev_motes](dev_notes.md) 与部分 issue

## 核心工具

[vite-plugin-monkey](https://github.com/lisonge/vite-plugin-monkey): 实用的 vite 油猴脚本构建插件

[ajaxHooker](https://bbs.tampermonkey.net.cn/thread-3284-1-1.html): 实用的请求拦截库，项目在此库基础上添加.d.ts 类型定义，并遵循原作者 GNU LGPL-3.0 协议

## Stargazers over Time

[![Stargazers over time](https://starchart.cc/vruses/beefreely.svg?variant=adaptive)](https://starchart.cc/vruses/beefreely)
