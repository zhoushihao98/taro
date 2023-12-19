import './live-pusher.scss'
import React from 'react'
import { View, LivePusher } from '@tarojs/components'

import Header from '../../../components/head/head'
import ComponentState from '../../../components/component_state/component_state'

export default class PageView extends React.Component {
  render() {
    return (
      <View className='components-page'>
        <View className='components-page__header'>
          <Header title='Live-pusher'></Header>
          <ComponentState platform='H5' rate='50'>
            {' '} 
          </ComponentState>
        </View>
        <View className='components-page__body' style={{ marginTop: '100px' }}>
          <View className='components-page__body-example example'>
            <View className='example-body'>
               <LivePusher mode='RTC' autopush enableCamera={true} enableMic={true} url='rtmp://191986.push.tlivecloud.com/live/file?txSecret=ef5535067422c27c25ce5e6da2cfa21c&txTime=658FC08D'></LivePusher>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
