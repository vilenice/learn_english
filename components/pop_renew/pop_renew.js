const app = getApp()

Component({
    properties: {
        dialogItem:{
            type: Object,
            value: {}
        },
        renewType :{
            type: String,
            value: 'vip'
        }
    },
    options: {
        multipleSlots: true,
        addGlobalClass: true
    },
    data: {
        globalData: app.globalData,
    },
    ready: function(){
        // this.startAnimation();
    },
    detached: function(){

    },

    attached: function(){
    },
    methods: {
        toMember(){
            wx.navigateTo({
                url: '/pages/member/member',
            })
        },
        backHome(){
            wx.navigateBack({
                delta: 1
            })
        },
        toInvite(){
            wx.navigateTo({
                url: '/pages/recommend/recommend',
            })
        }
    }
})