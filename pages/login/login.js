// logs.js

import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../store/index";
import { AuthLogin, AuthInfo, getUserInfo } from "../../api/index";
const app = getApp();
Page({
    data: {
        loginInfo: {
            code: '',
            encryptedData: '',
            iv: '',
            platform: 1
        }
    },
    onLoad() {
        this.storeBindings = createStoreBindings(this, {
            store,
            fields: ["userInfo", "navHeight", "token", "invitation_code"],
            actions: ["updateToken", "updateUserInfo", "login"],
        });
    },
    onReady() {
      console.log(this.data.invitation_code)  
    },
    onUnload() {
        this.storeBindings.destroyStoreBindings();
    },
    handleContact(e) {
    },
    loginFn() {
        // 创建两个 Promise 对象
        const loginPromise = new Promise((resolve, reject) => {
            wx.login({
                success: (loginInfo) => {
                    const { code } = loginInfo;
                    this.setData({
                        loginInfo: {
                            ...this.data.loginInfo,
                            code,
                        },
                    });
                    resolve({ ...this.data.loginInfo, code });
                },
                fail: reject,
            });
        });
    
        const userProfilePromise = new Promise((resolve, reject) => {
            wx.getUserProfile({
                desc: "获取用户头像和昵称",
                success: (res) => {
                    const userInfo = res.userInfo;
                    console.log(res)
                    this.updateUserInfo({
                        ...this.data.userInfo,
                        ...userInfo,
                        avatarUrl: 'https://oss.gtarcade.com/ucms/a0cd55fe-0caf-4949-b974-f06a81dab689_2023-12-11.png'
                    });
                    this.setData({
                        loginInfo: {
                            ...this.data.loginInfo,
                            encryptedData: res.encryptedData,
                            iv: res.iv,
                        },
                    });
                    resolve({
                        ...this.data.loginInfo,
                        encryptedData: res.encryptedData,
                        iv: res.iv,
                    });
                },
                fail: reject,
            });
        });
    
        // 使用 Promise.all() 来同时执行这两个 Promise
        Promise.all([loginPromise, userProfilePromise]).then((results) => {
            // 这里的 results 是一个数组，包含了 loginPromise 和 userProfilePromise 的结果
            this.toLogin({...results[0], ...results[1]});
        }).catch((error) => {
            // 处理错误
            console.error(error);
        });
    },
    async toLogin(info) {
        // 进行接口登录
        console.log(info)
        const res = await AuthLogin({
            invitation_code: this.data.invitation_code,
            ...info
        });
        const { token } = res.data;
        this.updateToken(token);
        wx.nextTick( async () => {
            // const loginInfo = await AuthInfo()
            
            // this.updateUserInfo({
            //     ...this.data.userInfo,
            //     nickName: loginInfo.data.nickname,
            //     avatarUrl: loginInfo.data.avatar
            // })
            await this.getLoginInfo()
            // console.log(this.data.userInfo)
            // wx.switchTab({
            //     url: "/pages/index/index",
            // }); 
        })
    },
    async getLoginInfo() {
        const res = await getUserInfo()
        const info = res.data
        
        this.updateUserInfo({
            ...this.data.userInfo,
            ...info,
            avatarUrl: res.data.avatar || 'https://oss.gtarcade.com/ucms/2029a000-0c7d-448c-a8d4-301dba09d8ff_2023-12-13.png',
        })
        wx.nextTick(() => {
            wx.switchTab({
                url: "/pages/index/index",
            }); 
            console.log(this.data.userInfo, '---------')
        })
    },
    cancelLogin() {
        wx.switchTab({
            url: "/pages/index/index",
        });
    }
});
