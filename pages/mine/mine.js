// logs.js

import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../store/index";
import { dateParse } from '../../utils/util'
const app = getApp();
Page({
    data: {
        dateParse: dateParse,
        baseUrl: app.globalData.baseUrl,
        endTime: null
    },
    onLoad() {
        this.storeBindings = createStoreBindings(this, {
            store,
            fields: ["userInfo", "navHeight", "token"],
            actions: ["updateToken", "updateUserInfo", "login", "updateInvitationCode"],
        });
        // 打开微信分享功能
        wx.showShareMenu({
            withShareTicket: true,
            menus: ["shareAppMessage"],
        });
    },
    onUnload() {
        this.storeBindings.destroyStoreBindings();
    },
    onReady(){
        this.setEndTime()
    },
    onShow(){
        console.log(this.data.token)
        wx.nextTick(() => {
            if (!this.data.token) {
                wx.reLaunch({
                    url: "/pages/login/login",
                })
                return
            } 
            this.setEndTime()
        })
        
    },
    onShareAppMessage: function (res) {
        return {
            title: "学霸AI口语，轻松开口，摆脱哑巴英语",
            path: `/pages/index/index?invitation_code=${this.data.userInfo.invitation_code}`,
            imageUrl: app.globalData.baseUrl + "/share.jpg",
        };
    },
    handleContact(e) {
    },
    // 修改头像
    changeAvatar() {
        wx.navigateTo({
            url: "/pages/user-info/index",
        })
    },
    // 设置结束时间
    setEndTime(e){
        console.log(this.data.userInfo.vip_status, this.data.userInfo.svip_status)
        if(this.data.userInfo.vip_status === 1 || this.data.userInfo.svip_status === 1){
            const vipType = this.data.userInfo.vip_status === 1 ? 'vip' : 'svip';
            const endTime = this.data.userInfo[`${vipType}_expire_at`] * 1000;
            console.log(endTime)
            this.setData({
                endTime: dateParse(endTime, 'yyyy-MM-dd hh:mm:ss')
            })
        }
    },
    // 复制邀请码
    copyCode(){
        wx.setClipboardData({
            data: this.data.userInfo.invitation_code,
            success: function (res) {
              console.log('复制成功')
            }
        })
    },
    /**
     * @param {*}
     * @desc 购买或者续费vip || svip
     * 
    */
    buyVip(){
        wx.navigateTo({
            url: "/pages/member/member",
        })
    },
    /**
     * 
     * @desc 前往推荐有理
     * 
     * */ 
     toRecommend(){
        wx.navigateTo({
            url: "/pages/recommend/recommend",
        })
    }
});
