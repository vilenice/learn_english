const app = getApp()

Component({
    properties: {
       loadingText: {
           type: String,
           value: "加载中",
       }
    },
    options: {
        multipleSlots: true,
    },
    data: {
        globalData: app.globalData,
    },
    ready: function(){

    },
    detached: function(){

    },

    attached: function(){
       
    },
    methods: {

    }
})