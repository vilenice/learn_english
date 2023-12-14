const plugin = requirePlugin("WechatSI");
import { wxUpload } from "../../api/index.js";

const app = getApp();

const manager = plugin.getRecordRecognitionManager();
Component({
    properties: {
        dialogItem: {
            type: Object,
            value: {},
        },
        isTeach: {
            type: Boolean,
            value: false,
        },
        isLoadEnd: {
            type: Boolean,
            value: true,
        },
        answerData: {
            type: Object,
            value: {},
        }
    },
    options: {
        multipleSlots: true,
        addGlobalClass: true,
    },
    data: {
        globalData: app.globalData,
        // 0 默认状态 1点击按住说话
        clickType: 0,
        isCancel: false,   // 按钮移动状态 和 managerStatus 有区分
        speakNum: 0,

        inputValue: "",
        isFocus: false,
        timer: null,
        managerStatus: 0    //是否取消发送 0 取消 1发送
    },
    ready: function () {
        this.initRecord();
        this.getBtnInfo();
        this.intervalNum();
    },
    detached: function () {
        clearTimeout(this.data.timer);
    },

    attached: function () {},
    methods: {
        // 文本框改变
        inputChange(e) {
            this.setData({
                inputValue: e.detail.value,
            });
        },

        // 文本框获得焦点
        inputFocus() {
            this.setData({
                isFocus: true,
            });
            this.triggerEvent("bottomFocus");
        },

        // 文本框失去焦点
        inputBlur() {
            this.setData({
                isFocus: false,
            });
        },

        // 确定发送
        inputConfirm() {
            this.triggerEvent("translate", {
                result: this.data.inputValue,
                type: 'input'
            })
            this.setData({
                inputValue: "",
            });
        },
        close() {
            this.triggerEvent("teachClose");
            // this.setData({
            //     isTeach: false
            // })
        },
        intervalNum() {
            // if(this.data.timer){
            const timer = setTimeout(() => {
                if (this.data.isTeach) {
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
                }
                this.intervalNum();
            }, 500);
            this.setData({
                timer: timer,
            });
            // }
        },
        streamRecord() {
            if(!this.data.isLoadEnd) return
            this.triggerEvent("bottomStart");
            manager.start({lang: "en_US"});
            this.setData({
                clickType: 1,
            });
        },
        moveStreamRecord(e) {
            if(!this.data.isLoadEnd) return
            if (e && e.changedTouches) {
                const { clientY } = e.changedTouches[0];

                // 计算触摸点与取消元素的距离
                const distanceY = clientY - this.data.cancelInfo.top;
                if (distanceY <= -35) {
                    this.isCancel = true;
                    this.setData({
                        isCancel: true,
                    });
                } else {
                    if (this.isCancel) {
                        this.isCancel = false;
                        this.setData({
                            isCancel: false,
                        });
                    }
                }
            }
        },
        endStreamRecord() {
            this.endCheck();
        },

        cancelStreamRecord() {
            this.endCheck();
        },

        endCheck() {
            if(!this.data.isLoadEnd) return
            if (this.data.isCancel) {
                this.setData({
                    isCancel: false,
                    clickType: 0,
                    managerStatus: 0,
                });
            } else {
                this.setData({
                    isCancel: false,
                    clickType: 0,
                    managerStatus: 1,
                });
            }
            wx.nextTick(() => {
                manager.stop();
            })
        },

        getBtnInfo() {
            const query = wx.createSelectorQuery().in(this);
            query
                .select("#buttonItem")
                .boundingClientRect()
                .exec((res) => {
                    res[0].left = res[0].left + res[0].width / 2;
                    res[0].top = res[0].top + res[0].height / 2;
                    this.setData({
                        cancelInfo: res[0],
                    });
                });
        },
          /**
         * 识别内容为空时的反馈
         */
        showRecordEmptyTip: function () {
            wx.showToast({
                title: '请大声说出来！',
                icon: "success",
                image: "/imgs/no_voice.png",
                duration: 1000,
                success: function (res) {},
                fail: function (res) {
                },
            });
        },
        initRecord: function () {
            manager.onRecognize = (res) => {
            };
            manager.onStop = (res, tempFilePath, duration, fileSize) => {
                console.log(res, "stop");
                if (this.data.managerStatus) {
                    const { result, tempFilePath } = res;
                    // 获取的录音信息为空 
                    if(!result) {
                        this.showRecordEmptyTip();
                        return;
                    }
                    // wxUpload({ api: '/v1/upload/audio', tempFilePath, fileType: 'file', formData: { identity: 223 } })
                    this.triggerEvent("translate", res);
                }
            };

            manager.onError = (res) => {
                console.log(res, "error");
            };
        },
    },
});
