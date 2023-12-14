import { formatSeconds } from "../../utils/util";
import { chatTranslation, grammarCheck } from "../../api/index";

const app = getApp();

Component({
    properties: {
        dialogItem: {
            type: Object,
            value: {},
        },
    },
    options: {
        multipleSlots: true,
        addGlobalClass: true,
    },
    data: {
        globalData: app.globalData,
        showCheck: false,
        showTranslate: false,
        boxHeight: 0,
        originalHeight: 0,
        checkBoxHeight: 0,
        animationData: null,
        countDown: 20,
        countDownTimer: null,
        timer: "00:00",
        speakNum: 2,
        isStop: true,
        translateData: '',
        checkData: '',
        isFirst: true,
        loadingShow: true,
        checkLoading: false,
        translateLoading: false
    },
    ready: function () {
        this.setDefaultBoxHeight();
        this.setData({
            timer: formatSeconds(this.data.dialogItem.audio_duration),
        });
    },
    detached: function () {},

    attached: function () {},
    observers: {
        'dialogItem': function (newVal) {
            // 此处为了处理loading状态到文本出现是高度丢失的情况  所以只需执行一次
            if(!newVal.isLoading && this.data.loadingShow){
                this.setDefaultBoxHeight();
                this.setData({
                    timer: formatSeconds(this.data.dialogItem.audio_duration),
                    loadingShow: false
                });
            }
            // 此处为了处理ai回复时自动播放音频时组件动画需要自动执行
            if(newVal.status === 1 && !this.data.countDownTimer && this.data.isFirst){
                this.playVoice()
                this.setData({
                    isFirst:false
                })
            }
        }
    },
    methods: {
        // 播放音乐
        playVoice() {
            if(!this.data.isStop) return
            this.triggerEvent("playVoice", {
                id: this.data.dialogItem.id,
                type: this.data.dialogItem.type === 'user' ? 'old' : ''
            });
            this.startCountDown(this.data.dialogItem.audio_duration);
            this.intervalNum();
            this.setData({
                isStop: false,
            });
        },
        playOldVoice() {
            this.triggerEvent("playVoice", {
                id: this.data.dialogItem.id
            });
        },
        startCountDown(num) {
            let countNum = num;
            this.data.countDownTimer = setTimeout(() => {
                if (this.data.isStop || this.data.dialogItem.status !== 1) {
                    this.setData({
                        isStop: true,
                        speakNum: 2,
                        timer: formatSeconds(this.data.dialogItem.audio_duration),
                    });
                    return;
                }
                if (countNum > 0) {
                    countNum = countNum - 1;
                    this.setData({
                        timer: formatSeconds(countNum),
                    });
                    this.startCountDown(countNum);
                } else {
                    this.setData({
                        isStop: true,
                        timer: formatSeconds(this.data.dialogItem.audio_duration),
                        countDownTimer: null
                    });
                }
            }, 600);
            this.setData({
                countDownTimer: this.data.countDownTimer,
            })
        },
        intervalNum() {
            setTimeout(() => {
                if (this.data.speakNum >= 2) {
                    this.setData({
                        speakNum: 0,
                    });
                } else {
                    this.data.speakNum += 1;
                    this.setData({
                        speakNum: this.data.speakNum,
                    });
                }
                if (!this.data.isStop && this.data.dialogItem.status === 1) {
                    this.intervalNum();
                } else {
                    this.setData({
                        isStop: true,
                        speakNum: 2,
                        timer: formatSeconds(this.data.dialogItem.audio_duration),
                        countDownTimer: null
                    });
                }
            }, 500);
        },
        // 设置默认模块高度
        setDefaultBoxHeight() {
            if(this.data.dialogItem.isLoading){
                return
            }
            const originalQuery = wx.createSelectorQuery().in(this);
            originalQuery
                .select(`#original${this.data.dialogItem.id}`)
                .boundingClientRect()
                .exec((res2) => {
                    const originalHeight = res2[0].height;
                    const boxHeight = originalHeight + (this.data.checkBoxHeight && this.data.showCheck ? this.data.checkBoxHeight : 0);
                    this.setData({
                        originalHeight: originalHeight,
                        boxHeight: boxHeight + "px",
                    });
                    this.openAni(boxHeight);
                });
        },
        async check() {
            // 检查模块已打开
            if (this.data.showCheck) {
                this.upward();
                return;
            }

            this.setData({
                checkLoading: this.data.showCheck ? false : true
            })
            this.setDefaultBoxHeight();
            if(!this.data.checkData){
                const checkData = await grammarCheck({
                    identity: this.data.dialogItem.id.split('_')[0],
                    lang: this.data.dialogItem.lang,
                    tag: 'input'
                })
                this.setData({
                    checkData: checkData.data.message
                })
            }

            // 检查模块未打开
            this.setData({
                showCheck: true,
                checkLoading: false
            });
            wx.nextTick(() => {
                this.setDefaultBoxHeight();
                if (!this.data.checkBoxHeight) {
                    const checkQuery = wx.createSelectorQuery().in(this);
                    checkQuery
                        .select(`#check-box${this.data.dialogItem.id}`)
                        .boundingClientRect()
                        .exec((res) => {
                            const checkBoxHeight = res[0].height;
                            this.setData({
                                checkBoxHeight: checkBoxHeight,
                                boxHeight: this.data.originalHeight + checkBoxHeight + "px",
                            });
                            this.openAni(this.data.originalHeight + checkBoxHeight);
                        });
                } else {
                    this.openAni(this.data.originalHeight + this.data.checkBoxHeight);
                }
            });
        },

        openAni(height) {
            const animation = wx.createAnimation({
                duration: 600, // Animation duration in milliseconds
                timingFunction: "ease", // Animation timing function
            });
            animation.height(height).step();
            this.setData({
                animationData: animation.export(),
            });
        },
        closeAni(height) {
            const animation = wx.createAnimation({
                duration: 600, // Animation duration in milliseconds
                timingFunction: "ease", // Animation timing function
            });
            animation.height(height).step({ duration: 600 });
            this.setData({
                showCheck: false,
                animationData: animation.export(), // Export the animation data to the view
            });
        },
        async translate() {
            const tag = this.data.dialogItem.type === 'user' ? 'input' : 'output';
            
            this.setData({
                translateLoading: this.data.showTranslate ? false : true
            })
            this.setDefaultBoxHeight();
            if(!this.data.translateData){
               const res = await chatTranslation({
                identity: this.data.dialogItem.id.split('_')[0],
                lang: 'zh-cn',
                tag: tag
               }) 
               const message = res.data.message;
               this.setData({
                translateData: message
               })
            }
            if (this.data.showTranslate) {
                this.setData({
                    showTranslate: false,
                });
            } else {
                this.setData({
                    showTranslate: true,
                });
            }
            this.setData({
                translateLoading: false
            })
            wx.nextTick(() => {
                this.setDefaultBoxHeight();
            });
        },
        upward() {
            const query = wx.createSelectorQuery().in(this);
            query
                .select(`#dialogBox-box${this.data.dialogItem.id}`)
                .boundingClientRect()
                .exec((res) => {
                    this.setData({
                        boxHeight: res[0].height + "px",
                    });
                    if (!this.data.originalHeight) {
                        const query2 = wx.createSelectorQuery().in(this);
                        query2
                            .select(`#original${this.data.dialogItem.id}`)
                            .boundingClientRect()
                            .exec((res2) => {
                                const originalHeight = res2[0].height;
                                this.setData({
                                    originalHeight: res2[0].height + "px",
                                });
                                this.closeAni(originalHeight);
                            });
                    } else {
                        this.closeAni(this.data.originalHeight);
                    }
                });
        },
    },
});
