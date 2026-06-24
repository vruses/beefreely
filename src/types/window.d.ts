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

declare global {
  interface Window {
    player?: unknown // Use a more specific type if you know it
    __INITIAL_STATE__?: { videoData: VideoDetailView }
    /**
     * 视频页首次加载的视频信息，后续切换视频不再变更
     * 从 __INITIAL_STATE__.videoData 读取
     */
    vd?: { aid: number; cid: number }
  }
}
