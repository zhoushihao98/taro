import React from 'react'
import Taro from '@tarojs/taro'
<<<<<<< HEAD
import { View, Button, Text, ScrollView, LivePusher, LivePlayer } from '@tarojs/components'
=======
import { View, Button,  LivePlayer } from '@tarojs/components'
>>>>>>> 42beeeda083c732d4bc478f79c16d13b4cf147b6
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 媒体-实时音视频
 * @returns
 */
let LivePusherContext
let LivePlayerContext
export default class Index extends React.Component {
  pusherRef: any
  state = {
    list: [
      //创建LivePusherContext 实例
      {
        id: 'createLivePusherContext',
        func: (apiIndex) => {
          TestConsole.consoleTest('createLivePusherContext')
          LivePusherContext = Taro.createLivePusherContext()
          // LivePusherContext = this.pusherRef
          TestConsole.consoleNormal('createLivePusherContext ', LivePusherContext)
        },
      },
      {
        id: 'createLivePlayerContext',
        func: (apiIndex) => {
          TestConsole.consoleTest('createLivePlayerContext')
          LivePlayerContext = Taro.createLivePlayerContext('LivePlayer')
          TestConsole.consoleNormal('createLivePlayerContext ', LivePlayerContext)
        },
      },
      {
        id: 'LivePlayer_mute',
        func: (apiIndex) => {
          TestConsole.consoleTest('LivePlayer_mute')
          if (LivePlayerContext) {
            LivePlayerContext.mute({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              },
            })
          } else {
            TestConsole.consoleNormal('LivePlayerContext还未创建')
          }
        },
      },
      {
        id: 'LivePlayer_pause',
        func: (apiIndex) => {
          TestConsole.consoleTest('LivePlayer_pause')
          if (LivePlayerContext) {
            LivePlayerContext.pause({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              },
            })
          } else {
            TestConsole.consoleNormal('LivePlayerContext还未创建')
          }
        },
      },
      {
        id: 'LivePlayer_stop',
        func: (apiIndex) => {
          TestConsole.consoleTest('videoContext_stop')
          if (LivePlayerContext) {
            LivePlayerContext.stop({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              },
            })
          } else {
            TestConsole.consoleNormal('LivePlayerContext还未创建')
          }
        },
      },
      {
        id: 'LivePlayer_play',
        func: (apiIndex) => {
          TestConsole.consoleTest('LivePlayer_play')
          if (LivePlayerContext) {
            LivePlayerContext.play({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              },
            })
          } else {
            TestConsole.consoleNormal('LivePlayerContext还未创建')
          }
        },
      },
      {
        id: 'LivePlayer_requestFullScreen',
        inputData: {
          direction: 0,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('LivePlayerContext_requestFullScreen')
          if (LivePlayerContext) {
            LivePlayerContext.requestFullScreen({
              ...data,
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              },
            })
            setTimeout(() => {
              LivePlayerContext.exitFullScreen()
              TestConsole.consoleNormal('exitFullScreen')
            }, 8000)
          } else {
            TestConsole.consoleNormal('LivePlayerContext还未创建')
          }
        },
      },
      {
        id: 'LivePlayer_resume',
        func: (apiIndex) => {
          TestConsole.consoleTest('LivePlayerContext_resume')
          if (LivePlayerContext) {
            LivePlayerContext.resume({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              },
            })
          } else {
            TestConsole.consoleNormal('LivePlayerContext还未创建')
          }
        },
      },
      {
        id: 'LivePlayer_snapshot',
        inputData: {
          quality: 'raw',
          sourceType: 'stream',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('LivePlayerContext_snapshot')
          if (LivePlayerContext) {
            LivePlayerContext.snapshot({
              ...data,
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
                Taro.saveImageToPhotosAlbum({
                  filePath: res.tempImagePath,
                  success: (res) => {
                    TestConsole.consoleSuccess.call(this, res, apiIndex)
                  },
                  fail: (res) => {
                    TestConsole.consoleFail.call(this, res, apiIndex)
                  },
                  complete: (res) => {
                    TestConsole.consoleComplete.call(this, res, apiIndex)
                  },
                }).then((res) => {
                  TestConsole.consoleResult.call(this, res, apiIndex)
                })
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              },
            })
          } else {
            TestConsole.consoleNormal('LivePlayerContext还未创建')
          }
        },
      },
      {
        id: 'LivePlayer_requestPictureInPicture_H5暂不支持',
        func: (apiIndex) => {
          TestConsole.consoleTest('LivePlayerContext_requestPictureInPicture')
          if (LivePlayerContext) {
            LivePlayerContext.requestPictureInPicture({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              },
            })
          } else {
            TestConsole.consoleNormal('LivePlayerContext还未创建')
          }
        },
      },
      {
        id: 'LivePlayer_exitPictureInPicture_H5暂不支持',
        func: (apiIndex) => {
          TestConsole.consoleTest('LivePlayerContext_exitPictureInPicture')
          if (LivePlayerContext) {
            LivePlayerContext.exitPictureInPicture({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              },
            })
          } else {
            TestConsole.consoleNormal('LivePlayerContext还未创建')
          }
        },
      },
      // 开始推流
      {
        id: 'LivePusher_start',
        func: (apiIndex) => {
          if (LivePusherContext) {
            TestConsole.consoleTest('start');
            LivePusherContext.start({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
                TestConsole.consoleResult.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              }
            })
          } else {
            TestConsole.consoleTest('------LivePusherContext未创建------')
          }
        },
      },
      // 暂停推流
      {
        id: 'LivePusher_pause',
        func: (apiIndex) => {
          if (LivePusherContext) {
            TestConsole.consoleTest('pause');
            LivePusherContext.pause({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
                TestConsole.consoleResult.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              }
            })
          } else {
            TestConsole.consoleTest('------LivePusherContext未创建------')
          }
        },
      },
      // 恢复推流
      {
        id: 'LivePusher_resume',
        func: (apiIndex) => {
          if (LivePusherContext) {
            TestConsole.consoleTest('resume');
            LivePusherContext.resume({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
                TestConsole.consoleResult.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              }
            })
          } else {
            TestConsole.consoleTest('------LivePusherContext未创建------')
          }
        },
      },
      // 停止推流
      {
        id: 'LivePusher_stop',
        func: (apiIndex) => {
          if (LivePusherContext) {
            TestConsole.consoleTest('stop');
            LivePusherContext.stop({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
                TestConsole.consoleResult.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              }
            })
          } else {
            TestConsole.consoleTest('------LivePusherContext未创建------')
          }
        },
      },
      // 设置麦克风音量大小
      {
        id: 'LivePusher_setMICVolume',
        inputData: {
          MICVolume: 0.5
        },
        func: (apiIndex, data: { MICVolume: any }) => {
          if (LivePusherContext) {
            TestConsole.consoleTest('setMICVolume');
            LivePusherContext.setMICVolume(
              {
                ...data,
                success: (res) => {
                  TestConsole.consoleSuccess.call(this, res, apiIndex)
                  TestConsole.consoleResult.call(this, res, apiIndex)
                },
                fail: (res) => {
                  TestConsole.consoleFail.call(this, res, apiIndex)
                },
                complete: (res) => {
                  TestConsole.consoleComplete.call(this, res, apiIndex)
                }
              })
          } else {
            TestConsole.consoleTest('------LivePusherContext未创建------')
          }
        },
      },
      // 播放背景音
      {
        id: 'LivePusher_playBGM',
        inputData: {
          src: 'https://storage.360buyimg.com/jdrd-blog/27.mp3',
        },
        func: (apiIndex, data) => {
          if (LivePusherContext) {
            TestConsole.consoleTest('playBGM');
            LivePusherContext.playBGM({
                ...data,
                success: (res) => {
                  TestConsole.consoleSuccess.call(this, res, apiIndex)
                  TestConsole.consoleResult.call(this, res, apiIndex)
                },
                fail: (res) => {
                  TestConsole.consoleFail.call(this, res, apiIndex)
                },
                complete: (res) => {
                  TestConsole.consoleComplete.call(this, res, apiIndex)
                }
              })
          } else {
            TestConsole.consoleTest('------LivePusherContext未创建------')
          }
        },
      },
      // 设置背景音音量
      {
        id: 'LivePusher_setBGMVolume',
        inputData: {
          Volume: 0.5,
        },
        func: (apiIndex, data) => {
          if (LivePusherContext) {
            TestConsole.consoleTest('setBGMVolume');
            LivePusherContext.setBGMVolume({
              ...data,
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
                TestConsole.consoleResult.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              }
            })
          } else {
            TestConsole.consoleTest('------LivePusherContext未创建------')
          }
        },
      },
      // 暂停播放背景音
      {
        id: 'LivePusher_pauseBGM',
        func: (apiIndex) => {
          if (LivePusherContext) {
            TestConsole.consoleTest('pauseBGM');
            LivePusherContext.pauseBGM({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
                TestConsole.consoleResult.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              }
            })
          } else {
            TestConsole.consoleTest('------LivePusherContext未创建------')
          }
        },
      },
      // 恢复播放背景音
      {
        id: 'LivePusher_resumeBGM',
        func: (apiIndex) => {
          if (LivePusherContext) {
            TestConsole.consoleTest('resumeBGM');
            LivePusherContext.resumeBGM({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
                TestConsole.consoleResult.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              }
            })
          } else {
            TestConsole.consoleTest('------LivePusherContext未创建------')
          }
        },
      },
      // 停止播放背景音
      {
        id: 'LivePusher_stopBGM',
        func: (apiIndex) => {
          if (LivePusherContext) {
            TestConsole.consoleTest('stopBGM');
            LivePusherContext.stopBGM({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
                TestConsole.consoleResult.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              }
            })
          } else {
            TestConsole.consoleTest('------LivePusherContext未创建------')
          }
        },
      },
      // 开启摄像头预览
      {
        id: 'LivePusher_startPreview',
        func: (apiIndex) => {
          if (LivePusherContext) {
            TestConsole.consoleTest('startPreview');
            LivePusherContext.startPreview({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
                TestConsole.consoleResult.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              }
            })
          } else {
            TestConsole.consoleTest('------LivePusherContext未创建------')
          }
        },
      },
      // 关闭摄像头预览
      {
        id: 'LivePusher_stopPreview',
        func: (apiIndex) => {
          if (LivePusherContext) {
            TestConsole.consoleTest('stopPreview');
            LivePusherContext.stopPreview({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
                TestConsole.consoleResult.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              }
            })
          } else {
            TestConsole.consoleTest('------LivePusherContext未创建------')
          }
        },
      },
      // 切换前后置摄像头
      {
        id: 'LivePusher_switchCamera',
        func: (apiIndex) => {
          if (LivePusherContext) {
            TestConsole.consoleTest('switchCamera');
            LivePusherContext.switchCamera({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
                TestConsole.consoleResult.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              }
            })
          } else {
            TestConsole.consoleTest('------LivePusherContext未创建------')
          }
        },
      },
      // 切换手电筒
      {
        id: 'LivePusher_toggleTorch',
        func: (apiIndex) => {
          if (LivePusherContext) {
            TestConsole.consoleTest('toggleTorch');
            LivePusherContext.toggleTorch({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
                TestConsole.consoleResult.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              }
            })
          } else {
            TestConsole.consoleTest('------LivePusherContext未创建------')
          }
        },
      },
      // 快照截屏
      {
        id: 'LivePusher_snapshot',
        func: (apiIndex) => {
          if (LivePusherContext) {
            TestConsole.consoleTest('snapShot');
            LivePusherContext.snapshot({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
                TestConsole.consoleResult.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              }
            })
          } else {
            TestConsole.consoleTest('------LivePusherContext未创建------')
          }
        },
      },
      // 发送SEI消息
      {
        id: 'LivePusher_sendMessage',
        inputData: {
          msg: '这是一个简单的SEI消息',
        },
        func: (apiIndex, data: { msg: string }) => {
          if (LivePusherContext) {
            TestConsole.consoleTest('sendMessage');
            LivePusherContext.sendMessage({
              ...data,
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
                TestConsole.consoleResult.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              }
            })
          } else {
            TestConsole.consoleTest('------LivePusherContext未创建------')
          }
        },
      },
    ],
    src: '',
    srcurl: 'https://hls-xjhsy.sobeylive.com/xjwlmqapp2019/211_q_live170191539951308.flv',
    isShow: true,
    iscache: false,
  }
  handleInputChangeSrc = (e) => {
    this.setState({
      src: e.target.value,
    })
  }
  handleClickSrc = async () => {
    let srcurl = this.state.src
    await this.setState({
      srcurl,
    })
  }
  hendleFullScreenChange(e) {
    console.log('hendleFullScreenChange', e)
  }
  updates = async () => {
    let iscache = !this.state.iscache
    await this.setState({
      iscache,
    })
  }
  render () {
    const { list } = this.state
    return (
      //@ts-ignore
      <View className='api-page'>
<<<<<<< HEAD
        {/* <LivePusher ref={(ref: any) => (this.pusherRef = ref)}/> */}
        <LivePusher/>
        <LivePlayer
          id='LivePlayer'
          src='https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-480p.flv'
          isLive
          cors
          soundMode='ear'
          type='flv'
        ></LivePlayer>
        <ButtonList buttonList={list} />
=======
        <ButtonList buttonList={list} />
        {this.state.isShow && (
          <LivePlayer
            id='LivePlayer'
            maxCache={3}
            minCache={1}
            src={this.state.srcurl}
            iscache={this.state.iscache}
            onFullScreenChange={this.hendleFullScreenChange}
          ></LivePlayer>
        )}
        <Button onClick={this.updates}>显示缓冲秒数</Button>
        src: <input type='text' name='username' onChange={this.handleInputChangeSrc} />{' '}
        <Button onClick={this.handleClickSrc}>确定</Button>
>>>>>>> 42beeeda083c732d4bc478f79c16d13b4cf147b6
      </View>
    )
  }
}
