const app = getApp()

Component({
    properties: {
        dialogItem:{
            type: Object,
            value: {}
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
        close(){
            this.triggerEvent('close')
        }
    }
})