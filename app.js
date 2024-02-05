// app.js
App({
  globalData: {
    phoneNumber: wx.getStorageSync('phoneNumber'),
    baseUrl: 'https://oss.longyuyin.com/img/talking_ai/imgs',
    app_os:'',
    app_opid: 100,
    app_version: '',
    app_osversion: '',
    userInfo: null,
    langInfo: {
      '中文': 'zh-cn',
      '英文': 'en-us',
      '日语': 'ja-jp',
      '韩语': 'ko-kr',
      '法语': 'fr-fr',
      '德语': 'de-de',
      '俄语': 'ru-ru',
    }
  },
  onLaunch() {

    
    switch (__wxConfig.envVersion) {
      case 'develop':
        this.globalData.baseUrl = 'https://oss.longyuyin.com/img/talking_ai/imgs'
        break
      case 'trial':
        this.globalData.baseUrl = 'https://oss.longyuyin.com/img/talking_ai/imgs'
        break
      case 'release':
        this.globalData.baseUrl = 'https://oss.longyuyin.com/img/talking_ai/imgs'
        break
    }


    // 检查网络环境
    wx.onNetworkStatusChange(function (res) {
      if(!res.isConnected){
        wx.showToast({
          title: '网络异常',
          image: "/imgs/wifi.png",
          icon: 'none',
          duration: 2000
        })
      }
    })
    // 检测设备信息
    wx.getSystemInfo({
      success: (res) => {
        console.log(res.platform)
        if (res.platform === 'ios') {
          this.globalData.platform = 'ios'
          this.globalData.app_os = 'ios'
          // iOS 系统
        } else if (res.platform === 'android') {
          this.globalData.platform = 'android'
          this.globalData.app_os = 'android'
          // Android 系统
        }
        this.globalData.app_version = res.version
        this.globalData.app_osversion = res.system
        // this.globalData.platform = 'android'
      }
    })

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())

    wx.setStorageSync('logs', logs)
    // setTimeout(() => {
    //   wx.loadFontFace({
    //     family: 'ArialFont',
    //     global: true,
    //     source: this.globalData.baseUrl + '/font/Arial.ttf',
    //     success: res => {
    //       console.log(res, '加载字体成功')
    //     },
    //     fail: err => {
    //       console.log(err, '加载字体失败')
    //     }
    //   })
    // },100)
  },
})
