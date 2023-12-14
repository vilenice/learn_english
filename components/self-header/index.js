const app = getApp();
import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../store/index";
import { localStorage } from "../../utils/util";
Component({
    behaviors: [storeBindingsBehavior],
    properties: {
        titleName: {
            type: String,
            value: "",
        },
        pageType: {
            type: String,
            value: 1,
        },
        fromPage: {
            type: String,
            value: "home",
        }
    },
    storeBindings: {
        store,
        fields: {
            systemInfo: () => store.systemInfo,
            menuButtonInfo: () => store.menuButtonInfo,
            navHeight: () => store.navHeight,
            userInfo: () => store.userInfo,
            token: () => store.token,
        },
        actions: {
            updateSystemInfo: "updateSystemInfo",
            updateMenuButtonInfo: "updateMenuButtonInfo",
            updateNavHeight: "updateNavHeight",
            updateToken: "updateToken",
            updateUserInfo: "updateUserInfo",
            login: "login",
        },
    },
    data: {
        statusBarHeight: 0, // 距离顶部多少高度
        navBarHeight: 0, //自定义头部高度
        baseUrl: app.globalData.baseUrl
    },
    ready: function () {},
    detached: function () {},

    attached: function () {
        this.getMenuButtonInfo();
    },

    methods: {
        // 获取胶囊按钮的位置信息
        getMenuButtonInfo() {
            // 获取系统信息
            if (!this.data.systemInfo) {
                const systemInfo = wx.getSystemInfoSync();
                app.globalData.systemInfo = systemInfo;
                this.updateSystemInfo(systemInfo);
            }
            // 获取小程序胶囊按钮信息
            if (!app.globalData.menuButtonInfo) {
                const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
                app.globalData.menuButtonInfo = menuButtonInfo;
            }
            const menuInfo = app.globalData.menuButtonInfo;
            const statusBarHeight = app.globalData.systemInfo.statusBarHeight;
            const navBarHeight = (menuInfo.top - statusBarHeight) * 2 + menuInfo.height;
            this.updateSystemInfo;
            this.setData({
                statusBarHeight,
                navBarHeight,
            });
            this.updateNavHeight(statusBarHeight + navBarHeight);
            this.updateMenuButtonInfo(menuInfo);
        },

        // 获取用户code 储存在本地
        async toMine() {
           
        },

        toUserPage(){
            wx.switchTab({
                url: "/pages/mine/mine",
            })
        },
        // 返回上一页
        toBack() {
            wx.navigateBack()
        },
    },
});
