// index.js
// 获取应用实例
import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../store/index";
import { getRoles, getTopics, getUserInfo } from "../../api/index";
const app = getApp();

Page({
    data: {
        loginShow: false,
        dialogueShow: true,
        globalData: app.globalData,
        baseUrl: app.globalData.baseUrl,
        roleList: [],
        sceneList: [],
    },
    // 事件处理函数

    onLoad(options) {
        console.log(options, "options");
        // 挂载store
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
        // 获取邀请码
        const { invitation_code } = options;
        this.updateInvitationCode(invitation_code);
        console.log(invitation_code);
        //  wx.nextTick(() => {

        //      this.updateInvitationCode(invitation_code)
        //  })
    },
    onShareAppMessage: function (res) {
        return {
            title: "学霸AI口语，轻松开口，摆脱哑巴英语",
            path: `/pages/index/index`,
            imageUrl: "/imgs/share.jpg",
        };
    },
    onReady() {
        console.log("11111111111");
        // if (!this.data.token) {
        //     wx.reLaunch({
        //         url: "/pages/login/login",
        //     })
        //     return
        // }
        // this.getLoginInfo()
    },
    onShow() {
        if (this.data.roleList.length === 0 || this.data.sceneList.length === 0) {
            this.init();
        }
    },
    onUnload() {
        this.storeBindings.destroyStoreBindings();
    },
    checkToLogin() {
        if (!this.data.token) {
            wx.navigateTo({
                url: "/pages/login/login",
            });
            return false;
        }
        return true;
    },
    roleToDialog(e) {
        if (!this.checkToLogin()) return;
        const img = e.currentTarget.dataset.img;
        const id = e.currentTarget.dataset.id;
        const lang = this.data.roleList.filter((item) => item.id == id)[0].langs;
        const name = this.data.roleList.filter((item) => item.id == id)[0].name;
        console.log(lang);
        wx.navigateTo({
            url: `/pages/dialogue/dialogue?type=role&roleImg=${img}&id=${id}&lang=${lang}&roleName=${name}`,
        });
    },
    sceneToDialog(e) {
        if (!this.checkToLogin()) return;
        const desc = e.currentTarget.dataset.desc;
        const id = e.currentTarget.dataset.id;
        const lang = this.data.sceneList.filter((item) => item.id == id)[0].lang;
        wx.navigateTo({
            url: `/pages/dialogue/dialogue?type=scene&sceneName=${desc}&id=${id}&lang=${lang}`,
        });
    },
    loginSuccess() {
        this.setData({
            loginShow: false,
        });
    },
    async getLoginInfo() {
        wx.nextTick(async () => {
            if (!this.data.token) return;
            const res = await getUserInfo();
            const info = res.data;
            console.log(info);
            this.updateUserInfo({
                ...this.data.userInfo,
                ...info,
                avatarUrl: res.data.avatar || "https://oss.gtarcade.com/ucms/2029a000-0c7d-448c-a8d4-301dba09d8ff_2023-12-13.png",
            });
        });
    },
    async init() {
        this.getLoginInfo();
        const rolesData = await getRoles();
        const topicsData = await getTopics();
        const roleList = rolesData.data.list;
        const sceneList = topicsData.data.list;
        this.setData({
            roleList,
            sceneList,
        });
    },
});
