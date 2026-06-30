/**
 * @description 用户观看历史记录相关接口
 */

import { useHeartbeat } from './useHeartbeat'
import { usePlayHistory } from './usePlayHistory'
import { useVideoDetail } from './useVideoDetail'

export default [useHeartbeat, usePlayHistory, useVideoDetail]
