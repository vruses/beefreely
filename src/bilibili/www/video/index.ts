import { useArchiveRelation, useDmView, usePlayer, usePlayurl, usePlayurl2, useRelation } from './hooks'
import playHistory from './hooks/plugin/playHistory'

// 解决未登录情况下：评论只展示三条，播放器显示未登录且画质低的问题
export default [usePlayer, usePlayurl, usePlayurl2, useRelation, useArchiveRelation, useDmView(), ...playHistory]
