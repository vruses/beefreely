/**
 * 历史记录列表项
 */
export interface HistoryRecord {
  /**
   * archive: 同 aid
   * ogc: 同 season_id
   * live: 同 id
   */
  kid: number
  /** 标签，如直播、番剧、课堂，细分具体的 archive 种类 */
  badge: string
  title: string
  // 视频封面
  cover: string
  history: {
    oid: number
    bvid: string
    cid: number
    // 分p视频集数
    page: number
    part: string

    /** 业务类型，对应标签，记录筛选条件之一 */
    business: 'archive' | 'live' | 'article' | ''
    /** 使用的观看设备，这里应恒为 1，也就是 PC */
    dt: number

    // bangumi 专属
    epid?: number
  }
  /** uploader 信息 */
  author_name: string
  author_mid: number
  author_face: string
  /** 观看时间 */
  view_at: number
  /** 播放进度 */
  progress: number
  /** 视频时长 */
  duration: number
  /** 视频标签 */
  tag_name: string
  /** 视频集数 */
  videos: number

  // bangumi 专属
  /** 章节标题代替 author_name 的显示 */
  show_title?: string
  /** 通过 uri 而非 bvid 跳转至番剧 */
  uri?: string

  // live 专属
  live_status: number
  // 多余的字段也直接并入一起方便处理

  /** 上次播放时间 */
  last_play_time: number
}

/** 历史记录瀑布流传参 */
export interface CursorParam {
  max: number
  view_at: number
  // 被 type 替代
  business: ''
  ps: number
  type: 'all' | 'article' | 'live' | 'archive'
}

/** 历史记录组合筛选参数 */
export interface SearchParam {
  pn: number
  /** 视频标题，up 主名字 */
  keyword: string
  /** 视频，直播，文章 */
  business: 'all' | 'archive' | 'live' | 'article'
  add_time_start: number
  add_time_end: number
  // 非 archive 为 0
  arc_max_duration: number
  arc_min_duration: number
  /** 同 dt */
  device_type: number
}

/** 历史记录瀑布流 */
export interface HistoryCursor {
  cursor: {
    business: string
    max: number
    ps: number
    view_at: number
  }
  list: HistoryRecord[]
  tab: Array<{ type: string; name: string }>
}

/** 历史记录组合筛选 */
export interface HistorySearch {
  has_more: boolean
  list: HistoryRecord[]
  page: {
    pn: number
    total: number
  }
}
