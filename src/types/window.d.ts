import type { ResultType } from '@/types/response'

/** 视频详细信息 */
export interface VideoDetailView {
  aid: number
  bvid: string
  cid: number
  title: string
  pic: string
  duration: number
  videos: number
  tag_name: string
  /** 视频作者信息 */
  owner: {
    face: string
    mid: number
    name: string
  }
  pages: Array<unknown>
}

/** 文章详细信息 */
export interface OpusDetail {
  /** aid */
  id_str: string
  type: number
  basic: {
    comment_type: number
    comment_id_str: string
    title: string
    uid: string
    tribee: unknown
    like_icon: {
      id: string
      start_url: string
      action_url: string
      end_url: string
    }
    editable: boolean
    aigc: boolean
    open_app_extra: string
    /** cvid */
    rid_str: string
    article_type: number
    is_only_fans: boolean
  }
  modules: {
    1: {
      module_author: {
        name: string
      }
    }
  }
}

/** 直播详细信息 */
export interface LiveDetail {
  room_info: {
    cover: string
    live_id: number
    live_status: number
    uid: number
    room_id: number
    title: string
  }
  anchor_info: {
    base_info: {
      uname: string
      face: string
    }
  }
}

declare global {
  interface Window {
    player?: unknown // Use a more specific type if you know it
    __INITIAL_STATE__?: { videoData: VideoDetailView; detail: OpusDetail }
    __NEPTUNE_IS_MY_WAIFU__?: { roomInfoRes: ResultType<LiveDetail> }
    /**
     * 视频页首次加载的视频信息，后续切换视频不再变更
     * 从 __INITIAL_STATE__.videoData 读取
     */
    vd?: { aid: number; cid: number }
  }
}
