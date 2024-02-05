import { observable, action, runInAction } from 'mobx-miniprogram';

// 获取购物车数量

export const store = observable({
  /** 数据字段 */
  userInfo: wx.getStorageSync('userInfo') || {},                     //用户信息
  token: wx.getStorageSync('token') || '',
  systemInfo: null, // 系统数据
  navHeight: 0, //自定义导航栏的高度
  menuButtonInfo: null, //胶囊按钮数据
  invitation_code: null, //被邀请的id
  lang: wx.getStorageSync('lang') || '英文', //语言

  /** 更新语言  */
  updateLang: action(function (lang) {
    this.lang = lang;
    wx.setStorageSync('lang', lang)
  }),
  /** 更新的数量  */
  updateSystemInfo: action(function (systemInfo) {
    this.systemInfo = systemInfo;
  }),
  updateUserInfo: action(function (userInfo) {
    this.userInfo = userInfo;
    wx.setStorageSync('userInfo', userInfo)
  }),
  updateToken: action(function (token) {
    this.token = token
    wx.setStorageSync('token', token)
  }),
  updateNavHeight: action(function (navHeight) {
    this.navHeight = navHeight;
  }),
  updateMenuButtonInfo: action(function (menuButtonInfo) {
    this.menuButtonInfo = menuButtonInfo;
  }),
  updateInvitationCode: action(function (invitation_code) {
    this.invitation_code = invitation_code;
  })
});