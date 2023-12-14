// app.js
App({
  globalData: {
    phoneNumber: wx.getStorageSync('phoneNumber'),
    baseUrl: 'https://pic.youzu.com/hd/xcx/talking_ai'
  },
  onLaunch() {

    
    switch (__wxConfig.envVersion) {
      case 'develop':
        this.globalData.baseUrl = 'http://127.0.0.1:1234'
        break
      case 'trial':
        this.globalData.baseUrl = 'https://pic.youzu.com/hd/xcx/talking_ai'
        break
      case 'release':
        this.globalData.baseUrl = 'https://pic.youzu.com/hd/xcx/talking_ai'
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
          // iOS 系统
        } else if (res.platform === 'android') {
          this.globalData.platform = 'android'
          // Android 系统
        }
        // this.globalData.platform = 'android'
      }
    })

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())

    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    wx.loadFontFace({
      family: 'ArialFont',
      global: true,
      source: this.globalData.baseUrl + '/font/Arial.ttf',
      success: res => {
        console.log(res, '加载字体成功')
      },
      fail: err => {
        console.log(err, '加载字体失败')
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
