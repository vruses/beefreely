import { useBangumiLogin } from './hooks'
import playHistory from './hooks/plugin/playHistory'

export default [useBangumiLogin, ...playHistory]
