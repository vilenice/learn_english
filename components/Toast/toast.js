Component({
    properties: {
        sceneInfo: {
            type: Object,
            value: {}
        }
    },
    options: {
        multipleSlots: true
    },
    data: {
        text: '',
        isShow: false,
        timer: null
    },
    ready: function(){
    },
    detached: function(){

    },


    attached: function(){
       
    },
    methods: {
        showToast(text, time){
            this.setData({
                text,
                isShow: true
            })
            let timer = setTimeout(() => {
                this.setData({
                    isShow: false
                })
            }, time);
            if(this.data.timer){
                clearTimeout(this.data.timer)
            }
            this.setData({
                timer
            })
            
            
        }
    }
})