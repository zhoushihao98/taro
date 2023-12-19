import Taro from '@tarojs/api'

import { findDOM } from '../../../utils'
import { LivePusherContext } from './LivePusherContext'

export const createLivePusherContext: typeof Taro.createLivePusherContext = () => {
  const el = findDOM() as HTMLElement
  const LivePusher = el?.querySelector(`taro-live-pusher-core`) as unknown as Taro.LivePusherContext
  const context = new LivePusherContext(LivePusher)
  return context
}