import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import monkey, { cdn } from 'vite-plugin-monkey'
import packageJSON from './package.json'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 最终产物是否压缩
  const isMinify = mode === 'minify'
  const fileExt = isMinify ? '.min.user.js' : '.user.js'

  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      minify: isMinify,
      // Overwrite files instead of deleting them for easier debugging in Violentmonkey
      emptyOutDir: false,
    },
    plugins: [
      monkey({
        entry: 'src/main.ts',
        userscript: {
          name: '哔哩免登录看评论+1080p视频+免弹窗',
          version: packageJSON.version,
          description:
            'bilibili免登录，看高清直播，看高清视频，随时看所有评论。观看历史记录，收藏功能正在支持中，欢迎来给项目star和pr！通过拦截一些特定 Bilibili 接口请求或响应，让你的体验能够像登录用户一样丝滑!',
          homepage: 'https://github.com/vruses/beefreely',
          supportURL: 'https://github.com/vruses/beefreely',
          grant: 'none',
          icon: 'data:image/jpeg;base64,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',
          namespace: 'vruses',
          match: ['*://*.bilibili.com/*'],
          'run-at': 'document-start',
        },
        server: { open: false },
        build: {
          fileName: packageJSON.name + fileExt,
          externalGlobals: {
            protobufjs: cdn.jsdelivr('protobuf', 'dist/protobuf.min.js'),
            '@vue/reactivity': cdn.jsdelivr('VueReactivity', 'dist/reactivity.global.min.js'),
            dexie: cdn.jsdelivr('Dexie', 'dist/dexie.min.js'),
          },
        },
      }),
    ],
  }
})
