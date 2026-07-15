# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.0.0-alpha.3](https://github.com/vruses/beefreely/compare/v3.0.0-alpha.2...v3.0.0-alpha.3) (2026-07-15)


### Bug Fixes

* **video:** fix wrong page ([657a031](https://github.com/vruses/beefreely/commit/657a031aa781bd07072d9bcf521401d04dfc592f))

## [3.0.0-alpha.2](https://github.com/vruses/beefreely/compare/v3.0.0-alpha.1...v3.0.0-alpha.2) (2026-07-03)


### Bug Fixes

* **video:** fix watch history did not restore the correct episode for video selection ([1304ee5](https://github.com/vruses/beefreely/commit/1304ee5d5dfebed9b55a2080d3b7a6749f541260))

## [3.0.0-alpha.1](https://github.com/vruses/beefreely/compare/v3.0.0-alpha.0...v3.0.0-alpha.1) (2026-07-01)


### Features

* **video:** add third-party video download tool cdn support ([ec08249](https://github.com/vruses/beefreely/commit/ec08249fa4fcd55102b83a8611b1e420799185e1))


### Bug Fixes

* **utils:** fix ts error ([3111a11](https://github.com/vruses/beefreely/commit/3111a114f7726d3d4744fd6c305812e37b2f1fda))

## [3.0.0-alpha.0](https://github.com/vruses/beefreely/compare/v2.2.6...v3.0.0-alpha.0) (2026-06-30)


### Features

* add AGENTS.md for project context ([b1643e4](https://github.com/vruses/beefreely/commit/b1643e4123ff2f04de83bbc98b3723eed939fc3d))
* add bangumi module ([e483a80](https://github.com/vruses/beefreely/commit/e483a808a390e0e2cc3383edf5c05d02919eb5cc))
* add playback progress tracking ([7ad6351](https://github.com/vruses/beefreely/commit/7ad6351fe5ac2d3bac187aeb00cb870809ef0854))
* **core:** skip playurlSSRData initialization for Bangumi ([bbecf10](https://github.com/vruses/beefreely/commit/bbecf10ed6a3da1d4fa9d90727f80ebdee72bc38))
* **history:** support deleting and clearing history records ([472b9af](https://github.com/vruses/beefreely/commit/472b9aff23a153f2f07a748337f50895d8067804))
* implement  video watch history with infinite scroll and search ([295a726](https://github.com/vruses/beefreely/commit/295a72607745f70025614eec1154ae5bf575ba0b))
* **live:** support live play records ([25bdc03](https://github.com/vruses/beefreely/commit/25bdc03acfbb050724f100f7a1f20e2b2f75d74e))
* **opus:** add article read history support ([6d7c2d9](https://github.com/vruses/beefreely/commit/6d7c2d9a8e34dab2372c42898ec5335343b60f71))
* **play-history:** support bangumi play records, refactor DB primary key to kid ([641c335](https://github.com/vruses/beefreely/commit/641c33534603224cc548ca859ddc3889f8f544f4))


### Bug Fixes

* chain response handlers for hooks with same url ([45f3c68](https://github.com/vruses/beefreely/commit/45f3c68663bbbc829fb6edfcfdfe2e2612570b29))
* fix type inference ([5cc05f1](https://github.com/vruses/beefreely/commit/5cc05f1e002d61137c3174349bad0a52f9a220ca))
* fix typo ([1cd2626](https://github.com/vruses/beefreely/commit/1cd26264f312060b91d847ab6fcb1657fe2d85c7))
* fix unsafe subtitle processing ([17a2bb8](https://github.com/vruses/beefreely/commit/17a2bb8f0527607b99506f11dc73d955ed059e99))
* **tsconfig:** update lib version to ES2022 ([2767148](https://github.com/vruses/beefreely/commit/27671484cabb45120389033990ae2df5b47de8f6))
* update default types in RequestFn ([d6e4292](https://github.com/vruses/beefreely/commit/d6e42926934b6becbd42a49e6f4b7a677b4acba8))

### [2.2.6](https://github.com/vruses/beefreely/compare/v2.2.5...v2.2.6) (2026-05-12)


### Features

* remove not logged in tooltip ([5e707c1](https://github.com/vruses/beefreely/commit/5e707c1499ea86bb81c6329eff83222566861362)), closes [#8](https://github.com/vruses/beefreely/issues/8)

### [2.2.5](https://github.com/vruses/beefreely/compare/v2.2.4...v2.2.5) (2026-03-11)


### Features

* 将复制评论链接的链接生成方式根据类型进行判断 ([9246c1f](https://github.com/vruses/beefreely/commit/9246c1f60a30fd0fcd191a1b5c61d98604d267b9)), closes [/github.com/vruses/beefreely/issues/7#issuecomment-4020969803](https://github.com/vruses//github.com/vruses/beefreely/issues/7/issues/issuecomment-4020969803)


### Bug Fixes

* 复制评论链接使用原逻辑时排除空间页 ([0a699da](https://github.com/vruses/beefreely/commit/0a699dad242ca27945a445ee671f1263d8e91a29))
* 复制评论链接无法根据类型进行判断时使用原逻辑 ([0372781](https://github.com/vruses/beefreely/commit/03727819233e2b960bd3a49d78302bd19226ef48))

### [2.2.4](https://github.com/vruses/beefreely/compare/v2.2.3...v2.2.4) (2026-03-08)


### Bug Fixes

* determine login status accurately ([c00f6d9](https://github.com/vruses/beefreely/commit/c00f6d9ff4e4464d68c90b96937f21c4e5701781))

### [2.2.3](https://github.com/vruses/beefreely/compare/v2.2.2...v2.2.3) (2026-03-04)


### Bug Fixes

* **core:** update document.cookie to include domain to avoid 412 precondition failed risk ([09a64d6](https://github.com/vruses/beefreely/commit/09a64d689be4cd0f36bb800f55805446b83dc70b))

### [2.2.2](https://github.com/vruses/beefreely/compare/v2.2.1...v2.2.2) (2026-02-02)


### Bug Fixes

* fix typo ([0ead587](https://github.com/vruses/beefreely/commit/0ead58791f57852cd52cc2655ff9f7675dc827d8))

### [2.2.1](https://github.com/vruses/bili-api-interceptor/compare/v2.2.0...v2.2.1) (2026-01-30)


### Bug Fixes

* relocate useReply to fix comments on some pages not being hooked ([49a7d9b](https://github.com/vruses/bili-api-interceptor/commit/49a7d9bc4ccbb4bbf46164ab5374814280695207))

## [2.2.0](https://github.com/vruses/bili-api-interceptor/compare/v2.1.0...v2.2.0) (2026-01-30)


### Features

* add userStore with login status watch to clean up hooks and stop WS intercept ([22751c2](https://github.com/vruses/bili-api-interceptor/commit/22751c2e1e3445f0e3bb2277c121ae025e8eae65)), closes [#2](https://github.com/vruses/bili-api-interceptor/issues/2)
* check login state from response and clear request hooks when logged in ([ddacf25](https://github.com/vruses/bili-api-interceptor/commit/ddacf256773ff69b17e74be367f869e0a910afc8))

## [2.1.0](https://github.com/vruses/bili-api-interceptor/compare/v2.0.4...v2.1.0) (2026-01-29)


### Features

* add protobuf support for subtitle handling and deobfuscate subtitle URLs ([79c5dd3](https://github.com/vruses/bili-api-interceptor/commit/79c5dd302764ae275f2f39ced13796683a285229))
* update request hook usage ([25b7558](https://github.com/vruses/bili-api-interceptor/commit/25b755849ead899726f6ffff65885a39be319d0f))
* XOR encryption and decryption for subtitle URI paths ([a14bf72](https://github.com/vruses/bili-api-interceptor/commit/a14bf72812a48f9045f15c6d88144eeecdb10dcb))


### Bug Fixes

* 修复字幕功能不显示的问题, refs [#5](https://github.com/vruses/bili-api-interceptor/issues/5) ([c98c5c6](https://github.com/vruses/bili-api-interceptor/commit/c98c5c64893939456dd4e6565f7a088c0cb76b20))
* **subtitle:** fix deserialization failure that sometimes occurs after serialization ([761c173](https://github.com/vruses/bili-api-interceptor/commit/761c173b6c22949e5e0c663e5c6b78e6c014c4e5))

### [2.0.4](https://github.com/vruses/bili-api-interceptor/compare/v2.0.3...v2.0.4) (2025-12-06)

### [2.0.3](https://github.com/vruses/bili-api-interceptor/compare/v2.0.2...v2.0.3) (2025-11-23)


### Bug Fixes

* add missing space module import ([4e079f1](https://github.com/vruses/bili-api-interceptor/commit/4e079f116be2fa4c3c3fa07e15d7225dbd0e9ad7))

### [2.0.2](https://github.com/vruses/bili-api-interceptor/compare/v2.0.1...v2.0.2) (2025-11-23)


### Bug Fixes

* fix typecheck ([931777d](https://github.com/vruses/bili-api-interceptor/commit/931777d97ec9aea720c9d6d780db0023bb4978af))

### [2.0.1](https://github.com/vruses/bili-api-interceptor/compare/v2.0.0...v2.0.1) (2025-11-23)


### Bug Fixes

* 修复进入 up 主动态无限刷新的 bug ([890bfa5](https://github.com/vruses/bili-api-interceptor/commit/890bfa56602a5bb67df70bf76edf1c4ad5f47e0b)), closes [#1](https://github.com/vruses/bili-api-interceptor/issues/1)
* display follower's number ([079511a](https://github.com/vruses/bili-api-interceptor/commit/079511aa0489075c57d71fe9bb2315fad100cb34))
* fix subtitle type ([c04be7e](https://github.com/vruses/bili-api-interceptor/commit/c04be7e784478ccf043599cf41aea6cf7b7bb265))

## [2.0.0](https://github.com/vruses/bili-api-interceptor/compare/v1.2.6...v2.0.0) (2025-10-25)


### ⚠ BREAKING CHANGES

* write hooks for search, navigation, history, and video
* code structure

### Features

* support subtitles on initial and subsequent video loads ([f146c85](https://github.com/vruses/bili-api-interceptor/commit/f146c85923875745761bfe6a9027934b62c637f9))


### Bug Fixes

* correct conditional checks in useNav and useHistory hooks ([f4e3b2c](https://github.com/vruses/bili-api-interceptor/commit/f4e3b2c3b5cb086f755c776489f291d993c3b3e6))
* resolve type inference issue in ajax hooker ([cf134b9](https://github.com/vruses/bili-api-interceptor/commit/cf134b9ed3ab838ae7d18e40a1b8d928cb8bae5f))


* code structure ([873de61](https://github.com/vruses/bili-api-interceptor/commit/873de61a79a8f0be01ab8fd5859d0080aefd87f6))
* write hooks for search, navigation, history, and video ([efdd81c](https://github.com/vruses/bili-api-interceptor/commit/efdd81c22f54357bc111b27f4b7d4dc6616404bb))

### [1.2.6](https://github.com/vruses/bili-api-interceptor/compare/v1.2.5...v1.2.6) (2025-10-19)


### Bug Fixes

* trigger github release ([898bbe2](https://github.com/vruses/bili-api-interceptor/commit/898bbe2e4ad98eacf67a99d21b28889e0854ec54))

### [1.2.5](https://github.com/vruses/bili-api-interceptor/compare/v1.2.4...v1.2.5) (2025-10-19)


### Features

* 首次视频加载字幕 ([268c5a2](https://github.com/vruses/bili-api-interceptor/commit/268c5a2283d135b1b5071a890284c3e8d551560b))

### 1.2.4 (2025-10-17)


### ⚠ BREAKING CHANGES

* add CI and release workflows

### Features

* 纠正b站搜索页热搜接口损坏，获取不到数据的问题 ([6f4a317](https://github.com/vruses/bili-api-interceptor/commit/6f4a317d7e9dbd76840684e913dcef8426d0fcfa))
* 实现伪登录状态下的直播弹幕获取 ([ccea114](https://github.com/vruses/bili-api-interceptor/commit/ccea114da5d87d2d940c0d8cd6c6b967b95e49af))
* 首次获取视频CDN时，直接使用记忆分辨率而无需手动调整 ([4c6fba0](https://github.com/vruses/bili-api-interceptor/commit/4c6fba00a6c1704303bf0276e079411128bf12fa))
* 移除不必要的响应信息，还原全局的playinfo ([4750404](https://github.com/vruses/bili-api-interceptor/commit/4750404dcfc2393ef75af4def7f66660d689c1fd))
* add ajaxHooker with request and response handling ([002792f](https://github.com/vruses/bili-api-interceptor/commit/002792f79328ee0ba846286709ad9f5bd17370ec))
* add types ([8f70f57](https://github.com/vruses/bili-api-interceptor/commit/8f70f5736118444d0b1f01e3e28b9e88b212e7fa))
* script main logic ([ec638d1](https://github.com/vruses/bili-api-interceptor/commit/ec638d189d0c1adbe3970cded9827bfe8db76652))
* update credentials property to AjaxRequest interface for authentication handling ([0c7296b](https://github.com/vruses/bili-api-interceptor/commit/0c7296b9a856ce599a65dae4fd216969f923f7d0))
* Wbi signature utility in ts ([b627ce6](https://github.com/vruses/bili-api-interceptor/commit/b627ce672ca800e82735389d37cf042ae01d79d7))


### Bug Fixes

* 修复历史播放页循环刷新的问题，修复移动页未能登录的问题 ([5c0a8d2](https://github.com/vruses/bili-api-interceptor/commit/5c0a8d22e8f3bab7225b57d32ecdc0038c257f62))
* 修复fetch请求携带错误credentials的bug ([c7efc2c](https://github.com/vruses/bili-api-interceptor/commit/c7efc2c4f5df5ca892c7cc0787ea05a8f1a8519e))


* add CI and release workflows ([7906d7c](https://github.com/vruses/bili-api-interceptor/commit/7906d7c18f19f2b20516530c2e5258f11771486e))
