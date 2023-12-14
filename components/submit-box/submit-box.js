const app = getApp()

Component({
    properties: {
        resultText: {
            type: String,
            value: "",
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
        cancel(){
            this.triggerEvent('submitCancel')
        },
        submit(){
            this.triggerEvent('submitEnter')
        }
    }
})