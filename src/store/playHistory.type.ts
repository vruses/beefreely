/** 用于记录观看历史的一些重要属性 */
export interface HistoryRecord {
  aid: number
  bvid: string
  cid: number
  title: string
  /** 视频封面 */
  cover: string
  author_name: string
  author_mid: number
  author_face: string
  /** 播放进度 */
  progress: number
  duration: number
  /** 观看时间 */
  view_at: number
  /** 上次播放时间 */
  last_play_time: number
  /** 视频集数 */
  videos: number
  /** 标签，如直播、番剧、课堂 */
  badge: string
  /** 业务类型，对应标签，记录筛选条件之一 */
  bussiness: string
  /** 使用的观看设备，这里应恒为 2，也就是 PC */
  dt: number
}

/** partial & flattened video detail data*/
export interface VideoMeta {
  aid: number
  bvid: string
  cid: number
  title: string
  cover: string
  author_name: string
  author_mid: number
  author_face: string
  duration: number
  videos: number
}
