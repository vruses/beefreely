import { useArchiveRelation, useDmView, usePlayer, usePlayurl, useRelation } from './hooks'

// 解决未登录情况下：评论只展示三条，播放器显示未登录且画质低的问题
export default [usePlayer, usePlayurl, useRelation, useArchiveRelation, useDmView()]
