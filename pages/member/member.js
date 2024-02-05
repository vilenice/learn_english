const app = getApp();
import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../store/index";
import { updateInfo, updateInviteCode, generateOrder, getUserInfo } from "../../api/index";


Page({
    data: {
        memberVip:[
            {
                id:3,
                day: 365,
                oldPrice: 328,
                newPrice: 199,
            },
            {
                id:2,
                day: 90,
                oldPrice: 199,
                newPrice: 99,
            },
            {
                id:1,
                day: 30,
                oldPrice: 69,
                newPrice: 49,
            },

        ],
        selectType: 3,
        payNum: 199,
        isSuccess: false,
        platform: app.globalData.platform,
        isCanPay: true
    },

    onLoad: function () {
        this.storeBindings = createStoreBindings(this, {
            store,
            fields: ["navHeight", "userInfo", "invitation_code", "token"],
            actions: ["updateUserInfo"],
        });
    },
    onReady() {
    },
    onShow() {
        if(true){
            updateInviteCode({
                code: 'WGWYLT'
            }) 
        } 
    },
    onUnload() {
        this.storeBindings.destroyStoreBindings();
    },
    chooseVip(e){
        console.log(e.currentTarget.dataset.id)
        this.setData({
            selectType: e.currentTarget.dataset.id,
            payNum: this.data.memberVip.filter(item => item.id == e.currentTarget.dataset.id)[0].newPrice
        })
    },
    closeSuccess(){
        this.setData({
            isSuccess: false
        })
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
    // 生成订单
    async generateOrderFn(e){
        this.setData({
            isCanPay: false
        })
        const { id } = e.currentTarget.dataset;
        const res = await generateOrder({
            goods_id: id || this.data.selectType,
            invitation_code: this.data.invitation_code,
            platform: 1
        })
        const result = res.data
        const that = this
        wx.requestPayment({
            timeStamp: result.time_stamp,
            nonceStr: result.nonce_str,
            package: result.package,
            signType: result.sign_type,
            paySign: result.pay_sign,
            success(res) {
              // 支付成功后的回调
              console.log(res, '--------成功------')
              that.getLoginInfo()
              that.setData({
                isSuccess: true,
                isCanPay: true
              })
            },
            fail(res) {
              // 支付失败后的回调
                console.log(res, '-------失败------')
                that.setData({
                    isCanPay: true
                })
            }
        });
            
        
    }
});
