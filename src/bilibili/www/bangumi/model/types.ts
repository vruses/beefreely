/** playview 响应体，主要用于获取 bangumi cdn */
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
  /** 除 cdn 一些额外的信息 */
  supplement: {
    ogv_episode_info: {
      episode_id: number
      episode_status: number
      index_title: string
      /** 同 show_title */
      long_title: string
    }
    ogv_pay_tip: unknown
    ogv_season_info: {
      season_id: number
      season_type: number
    }
    record_number: unknown
  }
  user_status: {
    is_login: boolean
    vip_info: unknown
  }
  video_extra: unknown
  video_info: unknown
  watch_progress: unknown
}

/** 番剧部分信息 */
export interface BangumiMedia {
  areas: { id: number; name: string }[]
  cover: string
  horizontal_picture: string
  media_id: number
  new_ep: { id: number; index: string; index_show: string }
  rating: { count: number; score: number }
  season_id: number
  share_url: string
  title: string
  type: number
  type_name: string
}
