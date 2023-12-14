export const baseApiUrl = 'https://api.longyuyin.com';

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
                "Token": wx.getStorageSync('token')
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