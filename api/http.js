export const baseApiUrl = 'https://api.longyuyin.com';
const app = getApp();
wx.getSystemInfo({
    success: function(res) {
        console.log(res, 'res')
    }
})

export  const request = function(url, data, type = 'GET'){
    return new Promise((resolve, reject) => {
        // wx.showLoading()
        wx.request({
            url: `${url.indexOf('//') > -1 ? '' : baseApiUrl}` + url, // 请求的接口地址，必须基于https协议
            method: type, // 请求的方式
            data: {
                ...data
            },
            header: {
                "Content-Type": "application/json",
                "Token": wx.getStorageSync('token'),
                "app_os": app.globalData.app_os,
                "app_opid": app.globalData.app_opid,
                "app_version": app.globalData.app_version,
                "app_osversion": app.globalData.app_osversion
            },
            success: (res) => {
                // 请求成功后的回调函数
                if(res.statusCode === 200){
                    if(res.data.code === 401 ){
                        wx.setStorageSync('token', '')
                        wx.reLaunch({
                            url: "/pages/login/login",
                        })
                        reject(res)
                        return
                    }
                    resolve(res.data)
                } else {
                    reject(res)
                }
            },
            fail: (err) => {
                wx.setStorageSync('token', '')
                wx.reLaunch({
                    url: "/pages/login/login",
                })
                reject(err)
            },
            complete: (res) => {
                // wx.hideLoading()
            }
        });
    })
}