// logs.js

import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../store/index";
import { getInviteInfo } from "../../api/index";
const app = getApp();
Page({
    data: {
        inviteInfo:{}
    },
    onLoad() {
        this.storeBindings = createStoreBindings(this, {
            store,
            fields: ["userInfo", "navHeight", "token"],
            action: [],
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
    onShareAppMessage: function (res) {
        return {
            title: "学霸AI口语，轻松开口，摆脱哑巴英语",
            path: `/pages/index/index?invitation_code=${this.data.userInfo.invitation_code}`,
            imageUrl: app.globalData.baseUrl + "/share.jpg",
        };
    },
    onReady() {
        this.getInviteInfoFn()
    },
    handleContact(e) {
    },
    changeAvatar() {
        wx.navigateTo({
            url: "/pages/user-info/index",
        })
    },
    // 查询邀请信息
    async getInviteInfoFn(){
        const res = await getInviteInfo()
        this.setData({
            inviteInfo: {
                buy_duration: Math.floor(res.data.buy_duration / 60 / 60),
                register_duration: Math.floor(res.data.register_duration / 60 / 60),
                total_duration: Math.floor(res.data.total_duration / 60 / 60),
            }
        })
        console.log(res)
    }
});
