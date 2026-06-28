export interface Playview {
  arc: {
    biz_type: number
    aid: number
    cid: number
    bvid: string
  }
  exp_info: unknown
  play_video_type: string
  plugins: unknown[]
  supplement: unknown
  user_status: {
    is_login: boolean
    vip_info: unknown
  }
  video_extra: unknown
  video_info: unknown
  watch_progress: unknown
}
