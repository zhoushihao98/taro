import { Component, ComponentInterface, Event, EventEmitter, h, Host, Listen, Prop, State } from '@stencil/core'
import Taro from '@tarojs/taro'
// import Pizzicato from 'pizzicato'
// import RecordRTC from 'recordrtc'
import * as Tone from 'tone'

@Component({
  tag: 'taro-live-pusher-core',
  styleUrl: './style/index.scss',
})
export class LivePusher implements ComponentInterface {
  private videoRef: HTMLVideoElement
  private canvasRef: HTMLCanvasElement

  /**
   * 视频推流地址
   */
  @Prop() url: string
  /**
   * 模式 SD（标清）, HD（高清）, FHD（超清）, RTC（实时通话）
   */
  @Prop() mode = 'RTC'
  /**
   * 自动推流
   */
  @Prop() autopush = false
  /**
   * 自定义渲染，允许开发者自行处理所采集的视频帧
   */
  @Prop() enableVideoCustomRender = false
  /**
   * 开启摄像头
   */
  @Prop() enableCamera = true
  /**
   *  自动聚集
   */
  @Prop() autoFocus = true
  /**
   *  画面方向
   */
  @Prop() orientation = 'vertical'

  // 美颜，取值范围 0-9 ，0 表示关闭
  @Prop() beauty = 0

  // 美白，取值范围 0-9 ，0 表示关闭
  @Prop() whiteness = 0

  // 宽高比，可选值有 3:4, 9:16
  @Prop() aspect = '9:16'

  // 最小码率
  @Prop() minBitrate = 200

  // 最大码率
  @Prop() maxBitrate = 1000

  // 高音质(48KHz)或低音质(16KHz)，值为high, low
  @Prop() audioQuality = 'high'

  // 进入后台时推流的等待画面
  @Prop() waitingImage: any

  // 等待画面资源的MD5值
  @Prop() waitingImageHash: any

  // 调整焦距
  @Prop() zoom = false

  // 前置或后置，值为front, back
  @Prop() devicePosition = 'front'

  // 进入后台时是否静音
  @Prop() backgroundMute = false

  // 设置推流画面是否镜像，产生的效果在 LivePlayer 反应到
  @Prop() mirror = false

  // 设置推流画面是否镜像，产生的效果在 LivePlayer 反应到
  @Prop() remoteMirror = false

  // 控制本地预览画面是否镜像
  @Prop() localMirror = 'auto'

  // 音频混响类型
  @Prop() audioReverbType = 0

  // 开启或关闭麦克风
  @Prop() enableMic = true

  // 是否开启音频自动增益
  @Prop() enableAgc = false

  // 是否开启音频噪声抑制
  @Prop() enableAns = true

  // 音量类型
  @Prop() audioVolumeType = 'voicecall'

  // 上推的视频流的分辨率宽度
  @Prop() videoWidth = 360

  // 上推的视频流的分辨率高度
  @Prop() videoHeight = 640

  // 设置美颜类型
  @Prop() beautyStyle = 'smooth'

  // 设置色彩滤镜
  @Prop() filter = 'standard'

  // 设置小窗模式： push, pop，空字符串或通过数组形式设置多种模式（如： ["push", "pop"]）
  @Prop() pictureInPictureMode: any[] = []

  // 是否启动自定义特效，设定后不能更改
  @Prop() customEffect = false

  // 自定义特效美白效果，取值 0~1。需要开启 custom-effect
  @Prop() skinWhiteness = 0

  // 自定义特效磨皮效果，取值 0~1。需要开启 custom-effect
  @Prop() skinSmoothness = 0

  // 自定义特效瘦脸效果，取值 0~1。需要开启 custom-effect
  @Prop() faceThinness = 0

  // 自定义特效大眼效果，取值 0~1。需要开启 custom-effect
  @Prop() eyeBigness = 0

  // 0：关闭变声；1：熊孩子；2：萝莉；3：大叔；4：重金属；6：外国人；7：困兽；8：死肥仔；9：强电流；10：重机械；11：空灵
  @Prop() voiceChangerType = 0

  // 帧率，有效值为 1~30
  @Prop() fps = 15

  // 设置背景音量
  @Prop() newGainNode: any

  // 状态变化事件，detail = {code}
  @Event({
    eventName: 'stateChange',
  })
    onStateChange: EventEmitter

  // 渲染错误事件，detail = {errMsg, errCode}
  @Event({
    eventName: 'error',
  })
    onError: EventEmitter

  // 返回麦克风采集的音量大小
  @Event({
    eventName: 'audioVolumeNotify',
  })
    onAudioVolumeNotify: EventEmitter

  // 网络状态通知，detail = {info}
  @Event({
    eventName: 'netStatus',
  })
    onNetStatus: EventEmitter

  // 进入小窗
  @Event({
    eventName: 'enterPictureInPicture',
  })
    onEnterPictureInPicture: EventEmitter

  // 退出小窗
  @Event({
    eventName: 'leavePictureInPicture',
  })
    onLeavePictureInPicture: EventEmitter

  // 开始播放背景音乐
  @Event({
    eventName: 'bgmStart',
  })
    onBgmStart: EventEmitter

  // 暂停播放背景音乐
  @Event({
    eventName: 'bgmPause',
  })
    onBgmPause: EventEmitter

  // 背景音乐播放完成
  @Event({
    eventName: 'bgmComplete',
  })
    onBgmComplete: EventEmitter

  @Event({
    eventName: 'bgmProgress',
  })
    onBgmProgress: EventEmitter

  // 获取的媒体流
  @State() mediaStream

  @State() mediaRecorder

  @State() websocket

  // WebSocket 是否连接
  @State() isStreaming = false

  // 音频轨道
  @State() audioTrack: any

  // 视频轨道
  @State() videoTrack: any

  @State() selectedCameraId: any

  // 前置摄像头和后置摄像头的设备ID
  @State() frontCameraId: any = ''

  @State() backCameraId: any = ''

  // 获取视频流对象数据
  @State() mediaBlob: any

  // 摄像头设置对象
  @State() constraints: any

  @State() isOpencvLoaded = false

  @State() sound: any

  @State() ctx: any
  @State() isVertical: any = false
  @State() faceapi: { detect: (arg0: { (error: any, result: any): void, (error: any, result: any): void }) => void }
  @State() videoVal: { size: (arg0: number, arg1: number) => void, hide: () => void, get: () => any }
  @State() audioContext: any
  @State() analyser: any
  @State() isVideo: boolean
  @State() isAudio: boolean
  @State() torchOn = false
  @State() cv: any
  @State() rotatedStream: MediaStreamTrack
  @State() canvasContext: any

  private loadOpencv (): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isOpencvLoaded === false) {
        const script = document.createElement('script')
        script.src = 'https://docs.opencv.org/4.5.5/opencv.js'
        script.async = true
        script.onload = () => {
          this.isOpencvLoaded = true
          resolve()
        }
        script.onerror = () => {
          const error = new Error('Failed to load openCV.js')
          reject(error)
        }
        document.head.appendChild(script)
      }
    })
  }

  componentDidLoad () {
    try {
      this.isVideo = this.enableCamera
      this.isAudio = this.enableMic
      this.init()
      this.handleOrientation()
      if (typeof (window as any).cv === 'undefined') {
        this.loadOpencv().then(() => {
          if ((window as any).cv) {
            this.cv = (window as any).cv
          }
        })
      } else {
        return
      }
    } catch (error) {
      console.log(error)
    }
  }

  init = () => {
    const _this = this
    // 获取摄像头id
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then(function (devices) {
        const hasCamera = devices.some(function (device) {
          return device.kind === 'videoinput'
        })
        if (hasCamera) {
          devices.forEach(function (device) {
            if (device.kind === 'videoinput') {
              if (device.label.toLowerCase().includes('front')) {
                _this.frontCameraId = device.deviceId
              } else if (device.label.toLowerCase().includes('back')) {
                _this.backCameraId = device.deviceId
              }
            }
          })
          // 选择前置或后置摄像头
          _this.selectedCameraId = this?.devicePosition === 'front' ? this?.frontCameraId : this?.backCameraId
        }
      })
    }
    // 设置小窗模式
    if (this.pictureInPictureMode.length === 1) {
      switch (this.pictureInPictureMode[0]) {
        case 'push':
          this.requestLitleWindow()
          break
        case 'pop':
          this.exitLitleWindow()
          break
        default:
          break
      }
    }
    if (this.pictureInPictureMode.length === 2) {
      this.pictureInPictureMode.forEach((val: string) => {
        switch (val) {
          case 'push':
            this.requestLitleWindow()
            break
          case 'pop':
            this.exitLitleWindow()
            break
          default:
            break
        }
      })
    }
  }

  // 获取变声参数
  setVoiceChanger = (changerValue: number) => {
    const sound = this.sound
    console.log('进入变声设置')
    switch (changerValue) {
      case 0: // 关闭变声
        sound.pitchShift = 0
        sound.speed = 1
        break

      case 1: // 熊孩子
        sound.pitchShift = -12
        sound.speed = 1
        break

      case 2: // 萝莉
        sound.pitchShift = 12
        sound.speed = 1
        break

      case 3: // 大叔
        sound.pitchShift = -6
        sound.speed = 1
        break

      case 4: // 重金属
        sound.pitchShift = 0
        sound.speed = 1.2
        break

      case 6: // 外国人
        sound.pitchShift = 0
        sound.speed = 0.8
        break

      case 7: // 困兽
        sound.pitchShift = 0
        sound.speed = 0.5
        break

      case 8: // 死肥仔
        sound.pitchShift = 0
        sound.speed = 1.5
        break

      case 9: // 强电流
        sound.pitchShift = 0
        sound.speed = 1
        sound.tremolo = {
          speed: 10,
          depth: 0.8,
          mix: 0.8,
        }
        break

      case 10: // 重机械
        sound.pitchShift = 0
        sound.speed = 1
        sound.flanger = {
          time: 0.5,
          speed: 0.2,
          depth: 0.5,
          feedback: 0.1,
          mix: 0.5,
        }
        break

      case 11: // 空灵
        sound.pitchShift = 0
        sound.speed = 1
        sound.reverb = {
          time: 3,
          decay: 2,
          mix: 0.8,
        }
        break

      default: // 默认情况下关闭变声
        sound.pitchShift = 0
        sound.speed = 1
        break
    }
  }

  // 获取混响参数
  setReverbType = (reverbType: number) => {
    const sound = this.sound
    console.log('进入混响类型设置')
    switch (reverbType) {
      case 0:
        sound.reverb = null
        break
      case 1:
        sound.reverb = {
          impulse: new Tone.Convolver({
            url: 'path/to/impulse-response.wav',
          }),
          mix: 0.8,
        }
        break

      case 2:
        sound.reverb = {
          time: 0.5,
          decay: 0.3,
          reverse: false,
          mix: 0.7,
        }
        break

      case 3:
        sound.reverb = {
          time: 1.5,
          decay: 1.2,
          reverse: false,
          mix: 0.6,
        }
        break

      case 4:
        sound.reverb = {
          time: 2.5,
          decay: 2,
          reverse: false,
          mix: 0.5,
        }
        break

      case 5:
        sound.reverb = {
          time: 1,
          decay: 0.8,
          reverse: false,
          mix: 0.7,
        }
        break

      case 6:
        sound.reverb = {
          time: 1.5,
          decay: 1,
          reverse: false,
          mix: 0.6,
        }
        break

      case 7:
        sound.reverb = {
          time: 2,
          decay: 1.5,
          reverse: true,
          mix: 0.6,
        }
        break

      default:
        sound.reverb = null
        break
    }
  }

  // 加载静态文件
  getFileContent (url: string): Promise<XMLHttpRequest> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr)
          } else {
            reject(new Error(xhr.statusText))
          }
        }
      }
      xhr.onerror = function () {
        reject(new Error('Network error'))
      }
      xhr.send()
    })
  }

  // 美颜函数，根据美颜类型应用不同的滤波器
  beautyFilter = (src, output, beautyType) => {
    const ksize = new this.cv.Size(15, 15)
    const sigmaX = 30
    const sigmaY = 30
    const d = -1
    const sigmaColor = 10
    const sigmaSpace = 10
    switch (beautyType) {
      case 'smooth':
        this.cv.GaussianBlur(src, output, ksize, sigmaX, sigmaY, this.cv.BORDER_DEFAULT)
        break
      case 'nature':
        this.cv.bilateralFilter(src, output, d, sigmaColor, sigmaSpace, this.cv.BORDER_DEFAULT)
        break
      default:
        src.copyTo(output)
        break
    }
  }

  // 美白和美颜
  beautyWitener = async (beauty: number, whiteness: number) => {
    const video = this.videoRef
    const canvas = this.canvasRef
    const cv = this.cv
    this.beauty = beauty
    this.whiteness = whiteness
    const beautyLevel = this.beauty // 美颜程度
    const whitenessLevel = this.whiteness // 美白程度
    // 加载模型文件和数据文件
    // const module = await cv.onRuntimeInitialized();
    const faceCascade = new cv.CascadeClassifier()

    // 加载模型数据
    const faceCascadeFile = await fetch('./static/haarcascade_frontalface_default.xml')
    // 读取 haarcascade_frontalface_default.xml 文件内容
    const response = await this.getFileContent('./static/haarcascade_frontalface_default.xml')
    const xmlContent = response.responseText
    // 将 XML 内容转换为 Uint8Array
    const encoder = new TextEncoder()
    const xmlData = encoder.encode(xmlContent)
    cv.FS_createDataFile('/', faceCascadeFile, xmlData, true, false, false)

    // 创建Mat对象
    const src = new cv.Mat(video.height, video.width, cv.CV_8UC4)
    const gray = new cv.Mat(video.height, video.width, cv.CV_8UC1)
    const dst = new cv.Mat(video.height, video.width, cv.CV_8UC4)

    setInterval(() => {
      // 绘制视频帧到画布元素
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx: any = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // 将画布上的图像转换为OpenCV的Mat对象
      src.data.set(ctx.getImageData(0, 0, canvas.width, canvas.height).data)
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY)
      cv.cvtColor(src, dst, cv.COLOR_RGBA2RGB)

      // 美颜处理
      const faces = new cv.RectVector()
      faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, [0, 0], [src.cols, src.rows])
      for (let i = 0; i < faces.size(); ++i) {
        const face = faces.get(i)
        cv.rectangle(dst, [face.x, face.y], [face.x + face.width, face.y + face.height], [255, 255, 255, 255], -1)
      }

      // 美白处理
      const alpha = 1 + (9 - whitenessLevel) * 0.1
      const beta = 0 + (9 - beautyLevel) * 10
      cv.convertScaleAbs(dst, dst, alpha, beta)

      // 在画布上绘制处理后的图像
      ctx.putImageData(new ImageData(new Uint8ClampedArray(dst.data), canvas.width, canvas.height), 0, 0)
    }, 1000 / this.fps)
  }

  // 自定义美白、磨皮、瘦脸、大眼等效果
  handleBeauty = () => {
    const canvasContext: any = this.canvasRef.getContext('2d')

    // 在每一帧绘制到Canvas上
    function processVideo () {
      const canvasElement = this.canvasRef
      const cv = this.cv
      canvasContext.drawImage(this.videoRef, 0, 0, canvasElement.width, canvasElement.height)
      // 获取Canvas上绘制的视频帧的像素数据
      const imageData = canvasContext.getImageData(0, 0, canvasElement.width, canvasElement.height)
      const src = cv.matFromImageData(imageData)

      // 进行美白处理
      const dst1 = new cv.Mat()
      cv.cvtColor(src, dst1, cv.COLOR_RGBA2GRAY)
      cv.cvtColor(dst1, dst1, cv.COLOR_GRAY2RGBA)
      const alpha = 1 + this.skinWhiteness // 原图像的权重（增加 skinWhiteness
      const beta = -this.skinWhiteness // 灰度图像的权重（减少 skinWhiteness
      cv.addWeighted(src, alpha, dst1, beta, 0, dst1)

      // 进行磨皮处理
      const dst2 = new cv.Mat()
      const skinSmoothness = this.skinSmoothness // 磨皮程度，取值范围为0到1
      const diameter = 8 // 控制滤波器的直径
      const sigmaColor = 150 * skinSmoothness // 控制颜色相似性的标准差
      const sigmaSpace = 150 * skinSmoothness // 控制空间相似性的标准差
      cv.bilateralFilter(dst1, dst2, diameter, sigmaColor, sigmaSpace)

      // 进行瘦脸处理
      const dst3 = new cv.Mat()
      const faces = new cv.RectVector()

      const faceCascade = new cv.CascadeClassifier()
      faceCascade.load('haarcascade_frontalface_default.xml')
      faceCascade.detectMultiScale(dst2, faces, 1.1, 3, 0)

      const faceThinness = this.faceThinness // 瘦脸程度，取值范围为0到1

      for (let i = 0; i < faces.size(); ++i) {
        const face = faces.get(i)
        const x = face.x
        const y = face.y
        const w = face.width
        const h = face.height
        const halfW = Math.round(w / 2)
        const halfH = Math.round(h / 2)
        const radiusX = Math.round(halfW * (1 - faceThinness))
        const radiusY = Math.round(halfH * (1 - faceThinness))
        const color = new cv.Scalar(255, 255, 255, 0)
        const thickness = -1
        const lineType = cv.LINE_8
        const shift = 0
        const ellipse1 = new cv.RotatedRect(new cv.Point(x + halfW, y + halfH), new cv.Size(radiusX, radiusY), 0)
        const ellipse2 = new cv.RotatedRect(new cv.Point(x + w - halfW, y + halfH), new cv.Size(radiusX, radiusY), 0)
        cv.ellipse(dst2, ellipse1, color, thickness, lineType, shift)
        cv.ellipse(dst2, ellipse2, color, thickness, lineType, shift)

        dst2
          .roi(face)
          .rowRange(0, face.height)
          .colRange(0, face.width / 2)
          .copyTo(dst3.rowRange(face.y, face.y + face.height).colRange(face.x, face.x + face.width / 2))
        dst2
          .roi(face)
          .rowRange(0, face.height)
          .colRange(face.width / 2, face.width)
          .copyTo(dst3.rowRange(face.y, face.y + face.height).colRange(face.x + face.width / 2, face.x + face.width))
      }

      cv.resize(dst3, dst3, new cv.Size(dst2.cols, dst2.rows))

      // 进行大眼处理
      const circles = new cv.Mat()
      const gray = new cv.Mat()
      cv.cvtColor(dst3, gray, cv.COLOR_RGBA2GRAY)
      cv.medianBlur(gray, gray, 3)
      const minDist = dst2.rows / 8
      cv.HoughCircles(gray, circles, cv.HOUGH_GRADIENT, 1, minDist, 75, 20, 10, 40)
      for (let i = 0; i < circles.cols; ++i) {
        const circle = circles.data32F
        cv.circle(dst3, new cv.Point(circle[i * 3], circle[i * 3 + 1]), circle[i * 3 + 2], [0, 0, 255, 255], 2)
      }
      const eyeBigness = this.eyeBigness // 大眼程度，取值范围为0到1
      const eyes = new cv.MatVector()
      const eyesCascade = new cv.CascadeClassifier()
      eyesCascade.load('haarcascade_eye.xml')
      eyesCascade.detectMultiScale(gray, eyes, 1.1, 3, 0)

      for (let i = 0; i < eyes.size(); ++i) {
        const eye = eyes.get(i)
        const x = eye.x
        const y = eye.y
        const w = eye.width
        const h = eye.height
        const centerX = x + Math.round(w / 2)
        const centerY = y + Math.round(h / 2)
        const radiusX = Math.round((w / 2) * eyeBigness)
        const radiusY = Math.round((h / 2) * eyeBigness)
        const color = new cv.Scalar(0, 0, 255, 255)
        const thickness = 2
        const lineType = cv.LINE_8
        const shift = 0
        const ellipse = new cv.RotatedRect(new cv.Point(centerX, centerY), new cv.Size(radiusX, radiusY), 0)
        cv.ellipse(dst3, ellipse, color, thickness, lineType, shift)
      }

      // 将处理后的图像数据绘制回Canvas上
      cv.imshow(canvasElement, dst3)

      // 释放Mat对象
      src.delete()
      dst1.delete()
      dst2.delete()
      dst3.delete()
      gray.delete()
      circles.delete()
      faces.delete()
      eyes.delete()
      requestAnimationFrame(processVideo)
    }

    // 开始处理视频流
    this.videoRef.addEventListener('canplay', () => {
      this.canvasRef.width = this.videoRef.videoWidth
      this.canvasRef.height = this.videoRef.videoHeight
      requestAnimationFrame(processVideo)
    })
  }

  rgbToHsv = (r: number, g: number, b: number) => {
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const delta = max - min

    let h = 0
    let s = 0
    const v = max / 255

    if (delta !== 0) {
      if (max === r) {
        h = (g - b) / delta
        if (g < b) {
          h += 6
        }
      } else if (max === g) {
        h = (b - r) / delta + 2
      } else {
        h = (r - g) / delta + 4
      }

      h *= 60
      s = delta / max
    }

    return {
      h: Math.round(h),
      s: Math.round(s * 100),
      v: Math.round(v * 100),
    }
  }

  hsvToRgb = (h: number, s: number, v: number) => {
    h /= 60
    s /= 100
    v /= 100

    const c = v * s
    const x = c * (1 - Math.abs((h % 2) - 1))
    const m = v - c

    let r = 0
    let g = 0
    let b = 0

    if (h >= 0 && h < 1) {
      r = c
      g = x
    } else if (h >= 1 && h < 2) {
      r = x
      g = c
    } else if (h >= 2 && h < 3) {
      g = c
      b = x
    } else if (h >= 3 && h < 4) {
      g = x
      b = c
    } else if (h >= 4 && h < 5) {
      r = x
      b = c
    } else {
      r = c
      b = x
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    }
  }

  applyBlur = (data: Uint8ClampedArray, index: number, radius: number) => {
    let r = 0
    let g = 0
    let b = 0
    for (let x = -radius; x <= radius; x++) {
      for (let y = -radius; y <= radius; y++) {
        const dataIndex = index + x * 4 + y * 4 * this.videoRef.videoWidth
        if (dataIndex >= 0 && dataIndex < data.length) {
          r += data[dataIndex]
          g += data[dataIndex + 1]
          b += data[dataIndex + 2]
        }
      }
    }
    const area = (2 * radius + 1) ** 2
    r /= area
    g /= area
    b /= area
    return { r, g, b }
  }

  // 在 canvas 上绘制每一帧并应用色彩滤镜
  renderCanvas = () => {
    const canvasElement = this.canvasRef
    const context = canvasElement.getContext('2d')!
    context.drawImage(this.videoRef, 0, 0, this.videoRef.videoWidth, this.videoRef.videoHeight)
    const imageData = context.getImageData(0, 0, this.videoRef.videoWidth, this.videoRef.videoHeight)
    const data = imageData.data

    switch (this.filter) {
      case 'standard':
        break
      case 'pink':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          // 增加红色和蓝色通道的值，减少绿色通道的值
          data[i] = r + 40
          data[i + 1] = g - 20
          data[i + 2] = b + 40

          // 调整图像饱和度
          const hsv = this.rgbToHsv(data[i], data[i + 1], data[i + 2])
          hsv.s *= 1.2 // 增加饱和度
          const { r: newR, g: newG, b: newB } = this.hsvToRgb(hsv.h, hsv.s, hsv.v)
          data[i] = newR
          data[i + 1] = newG
          data[i + 2] = newB

          // 添加柔化效果
          const blurRadius = 3
          const blurData = this.applyBlur(data, i, blurRadius)
          data[i] = blurData.r
          data[i + 1] = blurData.g
          data[i + 2] = blurData.b
        }
        break
      case 'nostalgia':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          // 调整图像的色调
          const newR = Math.round(r * 0.393 + g * 0.769 + b * 0.189)
          const newG = Math.round(r * 0.349 + g * 0.686 + b * 0.168)
          const newB = Math.round(r * 0.272 + g * 0.534 + b * 0.131)

          // 降低饱和度
          const hsv = this.rgbToHsv(newR, newG, newB)
          hsv.s *= 0.6 // 减少饱和度
          const { r: desaturatedR, g: desaturatedG, b: desaturatedB } = this.hsvToRgb(hsv.h, hsv.s, hsv.v)

          // 增加对比度
          const contrast = 1.2
          const contrastedR = Math.round((desaturatedR - 128) * contrast + 128)
          const contrastedG = Math.round((desaturatedG - 128) * contrast + 128)
          const contrastedB = Math.round((desaturatedB - 128) * contrast + 128)

          data[i] = contrastedR
          data[i + 1] = contrastedG
          data[i + 2] = contrastedB
        }
        break
      case 'blues':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          // 增加蓝色通道的值
          data[i + 2] = Math.min(b + 50, 255)

          // 降低对比度
          const contrast = 0.8
          const contrastedR = Math.round((r - 128) * contrast + 128)
          const contrastedG = Math.round((g - 128) * contrast + 128)
          const contrastedB = Math.round((b - 128) * contrast + 128)

          // 降低饱和度
          const hsv = this.rgbToHsv(contrastedR, contrastedG, contrastedB)
          hsv.s *= 0.6 // 减少饱和度
          const { r: desaturatedR, g: desaturatedG, b: desaturatedB } = this.hsvToRgb(hsv.h, hsv.s, hsv.v)

          data[i] = desaturatedR
          data[i + 1] = desaturatedG
          data[i + 2] = desaturatedB
        }
        break
      case 'romantic':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          // 增加红色和蓝色通道的值
          data[i] = Math.min(r + 20, 255)
          data[i + 2] = Math.min(b + 30, 255)

          // 降低对比度
          const contrast = 0.7
          const contrastedR = Math.round((r - 128) * contrast + 128)
          const contrastedG = Math.round((g - 128) * contrast + 128)
          const contrastedB = Math.round((b - 128) * contrast + 128)

          // 提高亮度
          const brightness = 1.2
          const brightenedR = Math.min(contrastedR * brightness, 255)
          const brightenedG = Math.min(contrastedG * brightness, 255)
          const brightenedB = Math.min(contrastedB * brightness, 255)

          data[i] = brightenedR
          data[i + 1] = brightenedG
          data[i + 2] = brightenedB
        }

        break
      case 'cool':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          // 增加蓝色通道的值
          data[i + 2] = Math.min(b + 50, 255)

          // 提高对比度
          const contrast = 1.2
          const contrastedR = Math.round((r - 128) * contrast + 128)
          const contrastedG = Math.round((g - 128) * contrast + 128)
          const contrastedB = Math.round((b - 128) * contrast + 128)

          // 降低亮度
          const brightness = 0.8
          const darkenedR = Math.max(contrastedR * brightness, 0)
          const darkenedG = Math.max(contrastedG * brightness, 0)
          const darkenedB = Math.max(contrastedB * brightness, 0)

          data[i] = darkenedR
          data[i + 1] = darkenedG
          data[i + 2] = darkenedB
        }
        break
      case 'fresher':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          // 增加亮度
          const brightness = 1.2
          const brightenedR = Math.min(r * brightness, 255)
          const brightenedG = Math.min(g * brightness, 255)
          const brightenedB = Math.min(b * brightness, 255)

          // 增加饱和度
          const saturation = 1.2
          const average = (brightenedR + brightenedG + brightenedB) / 3
          const saturatedR = Math.min(average + saturation * (brightenedR - average), 255)
          const saturatedG = Math.min(average + saturation * (brightenedG - average), 255)
          const saturatedB = Math.min(average + saturation * (brightenedB - average), 255)

          // 调整颜色平衡
          const balance = 0.1
          const balancedR = Math.round(saturatedR * (1 + balance))
          const balancedG = Math.round(saturatedG * (1 - balance))
          const balancedB = Math.round(saturatedB * (1 - balance))

          data[i] = balancedR
          data[i + 1] = balancedG
          data[i + 2] = balancedB
        }
        break
      case 'solor':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          // 提高红色和蓝色通道的值来增加温暖感
          data[i] = Math.min(r + 30, 255)
          data[i + 2] = Math.min(b + 20, 255)

          // 减少绿色通道的值来减弱颜色饱和度
          data[i + 1] = Math.max(g - 20, 0)

          // 调整亮度和对比度
          const brightness = 1.1
          const contrast = 1.2

          const adjustedR = Math.round((data[i] - 128) * contrast + 128) * brightness
          const adjustedG = Math.round((data[i + 1] - 128) * contrast + 128) * brightness
          const adjustedB = Math.round((data[i + 2] - 128) * contrast + 128) * brightness

          data[i] = Math.min(adjustedR, 255)
          data[i + 1] = Math.min(adjustedG, 255)
          data[i + 2] = Math.min(adjustedB, 255)
        }
        break
      case 'aestheticism':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          // 增加柔和度
          const softness = 0.1
          const softenedR = Math.round(r + softness * (255 - r))
          const softenedG = Math.round(g + softness * (255 - g))
          const softenedB = Math.round(b + softness * (255 - b))

          // 增加色彩温暖度
          const warmth = 20
          const warmedR = Math.min(softenedR + warmth, 255)
          const warmedG = Math.max(softenedG - warmth, 0)

          // 提高对比度
          const contrast = 1.2
          const contrastedR = Math.round((warmedR - 128) * contrast + 128)
          const contrastedG = Math.round((warmedG - 128) * contrast + 128)
          const contrastedB = Math.round((softenedB - 128) * contrast + 128)

          data[i] = contrastedR
          data[i + 1] = contrastedG
          data[i + 2] = contrastedB
        }
        break
      case 'whitening':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          // 提高亮度
          const brightness = 1.2
          const brightenedR = Math.min(r * brightness, 255)
          const brightenedG = Math.min(g * brightness, 255)
          const brightenedB = Math.min(b * brightness, 255)

          // 降低对比度
          const contrast = 0.8
          const contrastedR = Math.round((brightenedR - 128) * contrast + 128)
          const contrastedG = Math.round((brightenedG - 128) * contrast + 128)
          const contrastedB = Math.round((brightenedB - 128) * contrast + 128)

          data[i] = contrastedR
          data[i + 1] = contrastedG
          data[i + 2] = contrastedB
        }
        break
      case 'cerisered':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          // 增加红色通道的值来强调红色
          const emphasis = 0.5
          const emphasizedR = Math.min(r + emphasis * (255 - r), 255)

          // 增加柔和度
          const softness = 0.1
          const softenedR = Math.round(emphasizedR + softness * (255 - emphasizedR))
          const softenedG = Math.round(g + softness * (255 - g))
          const softenedB = Math.round(b + softness * (255 - b))

          data[i] = softenedR
          data[i + 1] = softenedG
          data[i + 2] = softenedB
        }
        break
      default:
        break
    }
    // 将更改后的像素数据重新绘制回 Canvas 上
    context.putImageData(imageData, 0, 0)
  }

  // 设置音量类型
  setAudioVolumeType = (audioTrack: { applyConstraints: (arg0: { volume: number }) => void }, volumeType: string) => {
    switch (volumeType) {
      case 'media':
        // 设置为媒体音量类型
        audioTrack.applyConstraints({ volume: 1 })
        break
      case 'voicecall':
        // 设置为通话音量类型
        audioTrack.applyConstraints({ volume: 0.5 })
        break
      default:
        // 默认设置为媒体音量类型
        audioTrack.applyConstraints({ volume: 1 })
        break
    }
  }

  // 设置麦克风音量
  setMICVolume = (option: any) => {
    if (this.audioTrack) {
      this.audioTrack
        .applyConstraints({ advanced: [{ Volume: option.MICVolume }] })
        .then(() => {
          console.log('麦克风音量设置成功', option.MICVolume)
        })
        .catch((err) => {
          console.error('麦克风音量设置失败', err)
        })
    } else {
      alert('获取音频轨道失败')
    }
  }

  // 播放背景音
  playBGM = (option: any) => {
    // 使用 Taro.createInnerAudioContext() 创建音频实例
    const audio = Taro.createInnerAudioContext({
      useWebAudioImplement: true, // 使用 Web Audio API 实现
    })
    audio.src = option.src
    audio.play()
    this.audioContext = audio
    this.onBgmStart.emit()
  }

  // 设置背景音量
  setBGMVolume = (option: { Volume: any }) => {
    console.log(option)
    this.audioContext.volume = option.Volume
  }

  // 暂停背景音
  pauseBGM = () => {
    this.audioContext.pause()
  }

  // 恢复播放背景音
  resumeBGM = () => {
    this.audioContext.play()
  }

  // 停止播放背景音
  stopBGM = () => {
    this.audioContext.stop()
  }

  start = () => {
    try {

      navigator.mediaDevices.enumerateDevices()
        .then(function (devices) {
          devices.forEach(function (device) {
            console.log('设备ID:', device.deviceId)
            console.log('设备名称:', device.label)
          })
        })
        .catch(function (err) {
          console.error('获取设备列表时发生错误:', err)
        })

      // 音视频配置
      const mediaOption = {
        video: this.isVideo
          ? {
            deviceId: this?.selectedCameraId,
            width: this.videoWidth,
            height: this.videoHeight,
          }
          : false,
        audio: this.isAudio,
      }

      // 获取音视频媒体流
      navigator.mediaDevices
        .getUserMedia(mediaOption)
        .then(async (stream) => {
          console.log('媒体流获取成功', stream)
          this.mediaStream = stream.getTracks()

          if (this.isAudio) {
            this.audioTrack = stream.getAudioTracks()[0]
            this.audioTrack.enabled = false
            const constraints: any = {
              autoGainControl: this.enableAgc, // 是否开启音频自动增益
              noiseSuppression: this.enableAns, // 是否开启音频噪声抑制
            }
            if (this.audioTrack) {
              this.audioTrack.applyConstraints(constraints)
            } else {
              alert('音频轨道不存在')
            }

            // 设置声音类型
            // this.setAudioVolumeType(this.audioTrack, this.audioVolumeType)
          }

          if (this.isVideo) {
            this.videoTrack = stream.getVideoTracks()[0]

            // 设置视频宽高比、帧率、码率
            const videoConstraints: any = {
              aspectRatio: this.aspect === '16:9' ? 16 / 9 : 4 / 3, // 视频宽高比
              frameRate:
                this.fps >= 30 && this.fps <= 1 ? this.fps : this.fps >= 30 ? 30 : this.fps <= 1 ? 1 : this.fps, // 帧率
              bitrate: { min: this.minBitrate, max: this.maxBitrate }, // 最小和最大码率
              sampleRate: this.audioQuality === 'high' ? 48000 : 16000, // 采样率
              // advanced: this.autoFocus ? [{ focusMode: 'continuous' }] : []
            }
            this.videoTrack.applyConstraints(videoConstraints)

            // 设置采样率
            if ('getCapabilities' in this.audioTrack) {
              const capabilities = this.audioTrack.getCapabilities()
              if ('sampleRate' in capabilities) {
                const desiredSampleRate = this.audioQuality === 'high' ? 48000 : 16000 // 设置期望的采样率，可以是 48000（高音质）或 16000（低音质）
                const settings = { sampleRate: desiredSampleRate }

                this.audioTrack
                  .applyConstraints(settings)
                  .then(function () {
                    console.log('采样率设置成功')
                  })
                  .catch(function (error) {
                    console.log('采样率设置失败', error)
                  })
              }
            }

            // 设置焦距
            if ('getCapabilities' in this.videoTrack) {
              const capabilities = this.videoTrack.getCapabilities()
              if ('zoom' in capabilities) {
                const desiredZoom = 2 // 设置期望的焦距值
                const settings = { zoom: desiredZoom }
                if (this.zoom) {
                  // 是否调整焦距
                  this.videoTrack
                    .applyConstraints({ advanced: [settings] })
                    .then(function () {
                      console.log('焦距设置成功')
                    })
                    .catch(function () {
                      console.log('焦距设置失败')
                    })
                }
              }
            }
          }

          // 创建canvas元素和渲染上下文
          const canvas = document.createElement('canvas')

          // 设置canvas尺寸和旋转角度
          canvas.width = this.videoTrack.getSettings().width
          canvas.height = this.videoTrack.getSettings().height

          // this.setBackgroundMusic()     //背景音乐

          if (this.isVideo && this.localMirror) {
            // 设置视频镜像
            switch (this.localMirror) {
              case 'auto':
                this?.selectedCameraId === this?.frontCameraId ? (this.videoRef.style.transform = 'scaleX(-1)') : ''
                break
              case 'enable':
                this.videoRef.style.transform = 'scaleX(-1)'
                break
              case 'disable':
                break

              default:
                break
            }
          }

          const options = {
            mimeType: 'video/webm;codecs=h264', // 设置视频的 MIME 类型
            codecs: 'h264',
            video: {
              width: { ideal: this.videoWidth }, // 设置理想的宽度
              height: { ideal: this.videoHeight }, // 设置理想的高度
            },
            mirror: this.remoteMirror,
          }
          this.mediaRecorder = new MediaRecorder(stream, options)


          // 在 <video> 元素中播放媒体流
          this.videoRef.srcObject = stream
          this.videoRef.play()


          // this.mediaRecorder.addEventListener('dataavailable', (event) => {
          //   // 将录制完成的视频数据转换为 Blob 对象
          //   this.mediaBlob = new Blob([event.data], { type: 'video/webm' })
          // })

          // if (this.isVideo) {
          // this.videoRef.style.display = 'none'
          // 自定义美白、磨皮、瘦脸、大眼效果
          // if (this.customEffect) {
          // this.handleBeauty()
          // }
          // this.beautyWitener(0, 0) // 美颜和美白0~9
          // 滤镜
          // this.renderCanvas()
          // }

          // 开始录制
          await this.mediaRecorder.start(8000)

          this.mediaRecorder.addEventListener('dataavailable', async (event) => {
            if (event.data.size > 0) {

              this.saveArrayBuffer(event.data).then((res) => {
                console.log('arrayBuffer data is', res)
                // @ts-ignore         
                native.startRtmp(res, this.url)
              })

            } else {
              console.log('暂无录制数据，不进行推流')
            }
          })


          this.mediaRecorder.onerror = function (error) {
            console.error('录制发生错误:', error)
          }

          this.mediaRecorder.onstop = () => {
            console.log('录制已停止')
          }

        })
        .catch((error) => {
          const message = error.message || error
          const response = {
            'permission denied': '浏览器禁止本页面使用摄像头，请开启相关的权限',
            'requested device not found': '未检测到摄像头',
          }
          if (error.name === 'NotAllowedError' && error.message === 'permission denied') {
            // 用户禁止了使用麦克风的权限
            this.onError.emit({ errCode: 10001 })
          }
          alert(response[message.toLowerCase()] || message)
          console.log('error', error)
        })
    } catch (error) {
      console.error('发生错误：', error)
    }
  }

  // start = () => {
  //   // @ts-ignore         
  //   native.startRtmp(this.url)
  // }
  saveArrayBuffer = async (blob) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.onerror = reject
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
      fileReader.readAsArrayBuffer(blob)
    })
  }

  // 打开小窗
  requestLitleWindow = () => {
    if (this.videoRef.requestPictureInPicture) {
      this.videoRef.requestPictureInPicture()
      this.onEnterPictureInPicture.emit()
    } else {
      console.log('浏览器不支持小窗模式')
    }
  }

  // 退出小窗
  exitLitleWindow = () => {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture()
      this.onLeavePictureInPicture.emit()
    } else {
      console.log('未处于小窗模式')
    }
    // if (this.mediaStream) {
    //   this.mediaStream.forEach(function (track) {
    //     track.stop();
    //   });
    //   this.videoRef.srcObject = null
    // }
  }

  // 获取音量大小
  getAudioVolumeNotify = () => {
    if (this.isAudio) {
      console.log('this.analyser->', this.analyser)
      const dataArray = new Uint8Array(this.analyser.frequencyBinCount)
      this.analyser.getByteFrequencyData(dataArray)

      // 计算音量大小
      let sum = 0
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i]
      }
      const average = sum / dataArray.length

      // 音量值范围在 0 到 100 之间
      const volume = Math.round((average / 255) * 100)
      console.log('音量大小是：' + volume)
      this.onAudioVolumeNotify.emit(volume)
      // return volume;
    }
  }

  // 设置视频水平还是竖直
  handleOrientation = () => {
    if (this.orientation === 'horizontal') {
      this.videoRef.style.transform = 'rotate(90deg)'
      this.videoRef.style.width = '100vh'
      this.videoRef.style.height = '100vw'
      // this.videoRef.style.marginLeft = '-55vw'
      // this.videoRef.style.marginTop = '6vh'
      this.orientation = 'vertical'
      this.isVertical = true
    } else {
      this.videoRef.style.width = ''
      this.videoRef.style.height = ''
      this.videoRef.style.marginLeft = ''
      this.videoRef.style.marginTop = ''
      this.videoRef.style.transform = ''
      this.isVertical = false
      this.orientation = 'horizontal'
    }
  }

  @Listen('visibilitychange', {
    target: 'document',
  })
  onDocumentVisibilitychange () {
    // 监听页面可见性变化事件
    if (document.visibilityState === 'hidden') {
      if (this.audioTrack) {
        this.audioTrack.stop()
        this.isAudio = false
      }
      if (this.videoTrack && this.waitingImage) {
        this.videoTrack.stop()
        this.showWaitScreen()
      }
    } else {
      if (this.isAudio || this.isVideo) {
        this.start()
      }
    }
  }

  // 显示等待画面
  showWaitScreen = () => {
    try {
      // 显示等待画面，比如一个加载动画或消息提示
      // 绘制固定画面到Canvas上
      const _this = this
      const canvas = document.createElement('canvas')
      const ctx: any = canvas.getContext('2d')
      // 获取一个图片元素
      const staticImage = document.getElementById('staticImage')
      // 在Canvas上绘制你希望显示的固定画面
      ctx.drawImage(staticImage, 0, 0, canvas.width, canvas.height)

      // 将Canvas转换为Blob对象
      canvas.toBlob(function (blob) {
        // 将固定画面添加到录制的视频流中
        _this.mediaRecorder.push(blob, { md5: _this.waitingImageHash })
      }, 'image/jpeg')
    } catch {
      this.onError.emit({ errCode: 10004 })
    }
  }

  // 隐藏等待画面
  hideWaitScreen = () => {
    // 隐藏等待画面，恢复正常界面
    const message = document.querySelector('#container img') // 替换为你的容器选择器
    if (message) {
      message.remove()
    }
  }

  // 停止录制  本地麦克风摄像头需要关闭
  stop = () => {
    this.mediaRecorder.stop()
    this.mediaStream.forEach(function (track) {
      track.stop()
    })
    // 关闭 WebSocket 连接
    if (this.websocket) {
      this.isStreaming = false
      this.websocket.close()
    }
  }

  // 暂停推流
  pause = () => {
    this.mediaRecorder.pause()
    this.videoRef.pause()
  }

  // 恢复推流
  resume = () => {
    this.mediaRecorder.resume()
    this.videoRef.play()
  }

  // 打开麦克风
  handleEnableMicOpen = () => {
    if (this.audioTrack !== undefined) {
      this.audioTrack.enabled = true
      this.isAudio = true
      this.start()
    } else {
      alert('找不到麦克风')
    }
  }

  // 关闭麦克风
  handleEnableMicClose = () => {
    if (this.audioTrack !== undefined) {
      if (this.isAudio) {
        this.audioTrack.enabled = false
        this.isAudio = false
        this.audioTrack.stop()
      } else {
        alert('麦克风暂时没有启用，请先启用麦克风')
      }
    } else {
      alert('找不到麦克风')
    }
  }

  // 打开摄像头
  startPreview = () => {
    if (this.videoTrack !== undefined) {
      this.isVideo = true
      this.videoTrack.enabled = true
      this.start()
    } else {
      alert('找不到摄像头，请检查设备')
    }
  }

  // 关闭摄像头
  stopPreview = () => {
    if (this.videoTrack !== undefined) {
      if (this.isVideo) {
        this.isVideo = false
        this.videoTrack.enabled = false
        this.videoTrack.stop()
      } else {
        alert('摄像头暂时没有启用，请先启用摄像头')
      }
    } else {
      alert('找不到摄像头，请检查设备')
    }
  }

  // 切换前后置摄像头，
  switchCamera = async () => {
    // const devices = await navigator.mediaDevices.enumerateDevices()
    // let backCameraId, frontCameraId
    // devices.forEach((device) => {
    //   if (device.kind === 'videoinput') {
    //     if (device.label.toLowerCase().includes('back')) {
    //       this.backCameraId = device.deviceId
    //     } else if (device.label.toLowerCase().includes('front')) {
    //       frontCameraId = device.deviceId
    //     } else {
    //       console.log('无法找到前后置摄像头的设备ID');

    //     }
    //   }
    // })
    this.selectedCameraId = this.devicePosition === 'front' ? this.backCameraId : this.frontCameraId
    // const constraints = {
    //   deviceId: {
    //     exact: newDeviceId,
    //   },
    // }
    // this.videoTrack.applyConstraints(constraints)
    this.start()
    this.devicePosition = 'back'
  }

  // 快照截图
  // 截取视频流的定位处，使用this.audioTrack
  snapshot = () => {
    const videoElement = this.videoRef
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = videoElement.videoWidth
    canvas.height = videoElement.videoHeight
    if (context) {
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
    } else {
      console.error('Failed to get 2D rendering context')
      return
    }
    const imageURL = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = imageURL
    link.download = 'snapshot.png'
    link.click()
  }

  // 发送sei消息
  sendMessage = (option: any) => {
    const blob = this.mediaBlob
    try {
      // 发送 SEI 消息
      const seiMessage = option.msg // 替换为您要发送的 SEI 消息的内容，可改
      const formData = new FormData()
      formData.append('video', blob, 'recorded.webm')
      formData.append('sei_message', seiMessage)

      fetch('/url', {
        // url为目标服务器地址，可改
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          // 处理响应
          console.log('上传成功', response)
        })
        .catch((error) => {
          // 处理错误
          console.error('上传失败:', error)
        })
    } catch (error) {
      console.error('Failed to send SEI message:', error)
    }
  }

  // 
  render () {
    return (
      <Host>
        <div id="container">
          <video
            id="videoElement"
            autoPlay
            controls
            ref={(dom) => {
              if (dom) {
                this.videoRef = dom as HTMLVideoElement
              }
            }}
          ></video>
          <img src={this.waitingImage} alt="" id="staticImage" style={{ display: 'none' }} />

        </div>
        <button id="startButton" onClick={this.start}>
          开始
        </button>
      </Host>
    )
  }
}