import Taro from '@tarojs/taro'

export class LivePusherContext implements Taro.LivePusherContext {
  livePusher?: any
  constructor (livePusher) {
    this.livePusher = livePusher
  }

  pause (option?: Taro.LivePusherContext.PauseOption | undefined): void {
    try {
      this.livePusher._pause()
      option?.success?.({ errMsg: 'pause: ok' })
    } catch (e) {
      option?.fail?.({ errMsg: `pause: ${e}` })
    } finally {
      option?.complete?.({ errMsg: 'pause: ok' })
    }
  }

  pauseBGM (option?: Taro.LivePusherContext.PauseBGMOption | undefined): void {
    try {
      this.livePusher._pauseBGM()
      option?.success?.({ errMsg: 'pauseBGM: ok' })
    } catch (e) {
      option?.fail?.({ errMsg: `pauseBGM: ${e}` })
    } finally {
      option?.complete?.({ errMsg: 'pauseBGM: ok' })
    }
  }

  playBGM (option?: Taro.LivePusherContext.PauseBGMOption | undefined): void {
    try {
      this.livePusher._playBGM(option)
      option?.success?.({ errMsg: 'playBGM: ok' })
    } catch (e) {
      option?.fail?.({ errMsg: `playBGM: ${e}` })
    } finally {
      option?.complete?.({ errMsg: 'playBGM: ok' })
    }
  }

  resume (option?: Taro.LivePusherContext.PauseBGMOption | undefined): void {
    try {
      this.livePusher._resume()
      option?.success?.({ errMsg: 'resume: ok' })
    } catch (e) {
      option?.fail?.({ errMsg: `resume: ${e}` })
    } finally {
      option?.complete?.({ errMsg: 'resume: ok' })
    }
  }

  resumeBGM (option?: Taro.LivePusherContext.PauseBGMOption | undefined): void {
    try {
      this.livePusher._resumeBGM()
      option?.success?.({ errMsg: 'resumeBGM: ok' })
    } catch (e) {
      option?.fail?.({ errMsg: `resumeBGM: ${e}` })
    } finally {
      option?.complete?.({ errMsg: 'resumeBGM: ok' })
    }
  }

  sendMessage (option?: Taro.LivePusherContext.PauseBGMOption | undefined): void {
    try {
      this.livePusher._sendMessage(option)
      option?.success?.({ errMsg: 'sendMessage: ok' })
    } catch (e) {
      option?.fail?.({ errMsg: `sendMessage: ${e}` })
    } finally {
      option?.complete?.({ errMsg: 'sendMessage: ok' })
    }
  }

  setBGMVolume (option?: Taro.LivePusherContext.PauseBGMOption | undefined): void {
    try {
      this.livePusher._setBGMVolume(option)
      option?.success?.({ errMsg: 'setBGMVolume: ok' })
    } catch (e) {
      option?.fail?.({ errMsg: `setBGMVolume: ${e}` })
    } finally {
      option?.complete?.({ errMsg: 'setBGMVolume: ok' })
    }
  }

  setMICVolume (option?: Taro.LivePusherContext.PauseBGMOption | undefined): void {
    try {
      this.livePusher._setMICVolume(option)
      option?.success?.({ errMsg: 'setMICVolume: ok' })
    } catch (e) {
      option?.fail?.({ errMsg: `setMICVolume: ${e}` })
    } finally {
      option?.complete?.({ errMsg: 'setMICVolume: ok' })
    }
  }

  snapshot (option?: Taro.LivePusherContext.PauseBGMOption | undefined): void {
    try {
      this.livePusher._snapshot()
      option?.success?.({ errMsg: 'snapshot: ok' })
    } catch (e) {
      option?.fail?.({ errMsg: `snapshot: ${e}` })
    } finally {
      option?.complete?.({ errMsg: 'snapshot: ok' })
    }
  }

  start (option?: Taro.LivePusherContext.PauseBGMOption | undefined): void {
    try {
      this.livePusher._start()
      option?.success?.({ errMsg: 'start: ok' })
    } catch (e) {
      option?.fail?.({ errMsg: `start: ${e}` })
    } finally {
      option?.complete?.({ errMsg: 'start: ok' })
    }
  }

  startPreview (option?: Taro.LivePusherContext.PauseBGMOption | undefined): void {
    try {
      this.livePusher._startPreview()
      option?.success?.({ errMsg: 'startPreview: ok' })
    } catch (e) {
      option?.fail?.({ errMsg: `startPreview: ${e}` })
    } finally {
      option?.complete?.({ errMsg: 'startPreview: ok' })
    }
  }

  stop (option?: Taro.LivePusherContext.PauseBGMOption | undefined): void {
    try {
      this.livePusher._stop()
      option?.success?.({ errMsg: 'stop: ok' })
    } catch (e) {
      option?.fail?.({ errMsg: `stop: ${e}` })
    } finally {
      option?.complete?.({ errMsg: 'stop: ok' })
    }
  }

  stopBGM (option?: Taro.LivePusherContext.PauseBGMOption | undefined): void {
    try {
      this.livePusher._stopBGM()
      option?.success?.({ errMsg: 'stopBGM: ok' })
    } catch (e) {
      option?.fail?.({ errMsg: `stopBGM: ${e}` })
    } finally {
      option?.complete?.({ errMsg: 'stopBGM: ok' })
    }
  }

  stopPreview (option?: Taro.LivePusherContext.PauseBGMOption | undefined): void {
    try {
      this.livePusher._stopPreview()
      option?.success?.({ errMsg: 'stopPreview: ok' })
    } catch (e) {
      option?.fail?.({ errMsg: `stopPreview: ${e}` })
    } finally {
      option?.complete?.({ errMsg: 'stopPreview: ok' })
    }
  }

  switchCamera (option?: Taro.LivePusherContext.PauseBGMOption | undefined): void {
    try {
      this.livePusher._switchCamera()
      option?.success?.({ errMsg: 'switchCamera: ok' })
    } catch (e) {
      option?.fail?.({ errMsg: `switchCamera: ${e}` })
    } finally {
      option?.complete?.({ errMsg: 'switchCamera: ok' })
    }
  }

  toggleTorch (option?: Taro.LivePusherContext.PauseBGMOption | undefined): void {
    try {
      this.livePusher._toggleTorch()
      option?.success?.({ errMsg: 'toggleTorch: ok' })
    } catch (e) {
      option?.fail?.({ errMsg: `toggleTorch: ${e}` })
    } finally {
      option?.complete?.({ errMsg: 'toggleTorch: ok' })
    }
  }
}
