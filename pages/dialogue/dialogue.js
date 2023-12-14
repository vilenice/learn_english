// logs.js

import { wxUpload,  chatInit, chatGenerate, sendGenerate, generateAnswer, generateSubject} from "../../api/index";

const app = getApp();

Page({
    data: {
        globalData: app.globalData,
        isSubmit: false,
        resultText: "",
        showType: "role",
        roleImg: '',
        sceneName: "",
        dialogList: [],
        innerAudioContext: null,
        toView: "fake", // 滚动位置
        isLoadEnd: true,
        last_id: 0,
        isTeach: false,
        temporary: null,
        identity: "", //当前对话标识
        originInfo: {
            result: '',
            tempFilePath: '',
            duration: 0
        },
        typeId: '',
        isRefresh: false,
        lang: "",
        loadingAiData: {
            audioUrl: "https://oss.longyuyin.com/tts/3aa2186b-d38a-4794-88bd-7e35f7c5f072_output.mp3",
            audio_duration: 2,
            id: "3aa2186b-d38a-4794-88bd-7e35f7c5f072_ai",
            isLoading: true,
            output: "What fruit do you like to eat?",
            status: 0,
            type: "ai",
        },
        answerData: {},
        roleName: '',
        renewType: 'vip', //需要开通的类型
        showRenew: false, //是否展示续费
        isConfine: false, //是否被限制

    },
    onLoad(options) {
        const { type, roleImg, sceneName, id, lang, roleName } = options;
        console.log(lang)
        this.initAudio();
        this.setData({
            showType: type,
            roleImg,
            sceneName,
            typeId: +id,
            lang,
            roleName
        });
        wx.nextTick(() => {
            this.initList(this.data.last_id);
        })
    },
    onHide() {
        this.data.innerAudioContext.stop();
    },
    onUnload() {
        this.data.innerAudioContext.stop();
    },
    teachClose() {
        this.setData({
            isTeach: false,
        });
    },
    async teach() {
        // 超出限制 展示限制弹框
        if(this.data.isConfine){
            this.setData({
                renewType: 'confine'
            })
            wx.nextTick(() => {
                this.setData({
                    showRenew: true
                })
            })
            return
        }

        this.setData({
            isTeach: true,
            answerData: {}
        });
        let sendId = ''
        for(let i = this.data.dialogList.length-1; i >= 0; i--){
            if(this.data.dialogList[i].id.indexOf('_ai')){
                sendId = this.data.dialogList[i].id.split('_')[0]
                break
            }
        }
        const res = await generateAnswer({
            identity: sendId,
            lang: this.data.lang,
        })
        this.setData({
            answerData: res.data
        })
        this.data.innerAudioContext.src = res.data.audio;
        this.data.innerAudioContext.play();
        console.log(res)
    },
    async scrollTop(e) {
        if(!this.data.last_id) return
        await this.initList(this.data.last_id)
    },
    playVoice(data) {
        const { id, type } = data.detail;
        let url = "";
        this.data.dialogList.forEach((item) => {
            if (item.id === id) {
                item.status = 1;
                url = type ? item.original_audio || item.audioUrl : item.audioUrl;
            } else {
                item.status = 0;
            }
        });
        this.setData({
            dialogList: this.data.dialogList,
        });
        this.data.innerAudioContext.stop();
        this.data.innerAudioContext.src = url;
        this.data.innerAudioContext.play();
    },
    // 教我回答
    async teachAnswer(){
        const sendId = ''
        for(let i = this.data.dialogList.length-1; i >= 0; i--){
            if(this.data.dialogList[i].id.indexOf('_ai')){
                sendId = this.data.dialogList[i].id.split('_')[0]
                break
            }
        }
        const res = await generateAnswer({
            identity: sendId,
            lang: this.data.lang,
        })
        this.data.innerAudioContext.src = url;
        this.data.innerAudioContext.play();
        console.log(res)
    },
    // 更换话题
    async changeSubject(){
        // 超出限制 展示限制弹框
        if(this.data.isConfine){
            this.setData({
                renewType: 'confine'
            })
            wx.nextTick(() => {
                this.setData({
                    showRenew: true
                })
            })
            return
        }
        this.setData({
            dialogList: [...this.data.dialogList, this.data.loadingAiData],
        })
        this.scrollToNew()
        const res = await generateSubject({
            identity: this.data.identity,
        })
        const subjectData = res.data;
        const list = this.dataProcessing([subjectData]);
        this.data.dialogList[this.data.dialogList.length - 1] = list[0];
        this.setData({
            dialogList: this.data.dialogList
        })
        this.playVoice({
            detail: {
                id: list[0].id
            }
        })
        this.scrollToNew()
    },
    initAudio() {
        const innerAudioContext = wx.createInnerAudioContext({
            useWebAudioImplement: true, // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
        });
        this.setData({
            innerAudioContext,
        });
    },
    async textTranslate(e) {
        // 有type 代表是输入框输入 无需二次确定弹框 直接发送即可，但是需要一个loading状态
        console.log(e)
        const { result, tempFilePath, duration, fileSize, type } = e.detail;
        if(type){
            this.setData({
                dialogList: [...this.data.dialogList, {
                    ...this.data.loadingAiData,
                    type: 'user'
                }],
            })
            this.scrollToNew()
        }
        this.setData({
            originInfo: {
                result,
                tempFilePath,
                duration
            },
            isTeach: false,
            isSubmit: type ? false : true,
        });
        const res = await chatGenerate({identity: this.data.identity, text: result, translation: type ? false : true });
        if (res.code !== 200){
            if(res.message.indexOf('已达上限') > -1){
                this.setData({
                    isConfine: true,
                    renewType: 'confine'
                })
                wx.nextTick(() => {
                    this.setData({
                        showRenew: true
                    })
                })
                return
            }
        }
        const userDialog = this.dataProcessing( [res.data], true)
        this.setData({
            resultText: type? '' : userDialog[0].output,
            temporary: userDialog
        })
        if(type){
            this.submitEnter()
        }
    },
    submitCancel() {
        this.setData({
            resultText: "",
            isSubmit: false,
        });
    },
    async submitEnter() {
        // 如果是文本框输入 需要删掉最后一条数据 （假loading）
        if(!this.data.originInfo.tempFilePath){
            this.data.dialogList.pop();
        }
        // 发送逻辑
        this.setData({
            resultText: "",
            isSubmit: false,
            dialogList: [
                ...this.data.dialogList,
                ...this.data.temporary
            ],
            isLoadEnd: false
        });
        wx.nextTick(() => {
            this.scrollToNew()
        })
        const sendId = this.data.dialogList[this.data.dialogList.length - 1].id.split("_")[0]
        let audioInfo = ''
        // 判断是否需要上传用户原声音
        if(this.data.originInfo.tempFilePath){
            console.log(this.data.originInfo.tempFilePath)
            let uploadData = await wxUpload({
                api: '/v1/upload/audio',
                tempFilePath: this.data.originInfo.tempFilePath,
                fileType: 'file',
                formData: {
                    identity: sendId
                }
            })
            uploadData = JSON.parse(uploadData)
            audioInfo = uploadData.data.url
        }
        // 发送接口  有音频的情况下调用语音发送接口
        let sendData = await sendGenerate({
            audio: audioInfo,
            audio_duration: Math.floor(this.data.originInfo.duration / 1000) || 0,
            text: this.data.temporary[0].output,
            identity: sendId
        })
        const sendResult = sendData.data
        // 更新用户原声
        this.data.dialogList[this.data.dialogList.length - 2].original_audio = sendResult.original_audio
        // 更新ai返回
        this.data.dialogList[this.data.dialogList.length - 1] = {
            id: `${sendResult.identity}_ai`,
            type: "ai",
            audio_duration: sendResult.output_audio_duration,
            audioUrl: sendResult.output_audio,
            output: sendResult.output,
            status: 1,
            isLoading: false,
        }
        this.setData({
            dialogList: this.data.dialogList,
            isLoadEnd: true
        })
        wx.nextTick(() => {
            this.scrollToNew()
            this.playVoice({
                detail:{
                    id: `${sendResult.identity}_ai`
                }
            })
        })
    },
    /**
     * 重新滚动到底部
     */
    scrollToNew: function () {
        this.setData({
            toView: this.data.toView,
        });
    },

    bottomFocus() {
         // 超出限制 展示限制弹框
        //  if(this.data.isConfine){
        //     this.setData({
        //         renewType: 'confine'
        //     })
        //     wx.nextTick(() => {
        //         this.setData({
        //             showRenew: true
        //         })
        //     })
        //     return
        // }
    },

    // 初始化列表
    async initList(last_id) {
        if(this.data.last_id < 0) {
            this.setData({
                isRefresh: false
            })
            return
        }
        this.setData({
            isRefresh : true
        })
        const res = await chatInit({id: this.data.typeId, last_id,page_size :10})
        if(res.code !== 200){
            const { message } = res
            if(message.indexOf('SVIP') > -1){
                this.setData({
                    renewType: 'svip',
                    showRenew: true
                })
            } else if (message.indexOf('VIP') > -1) {
                this.setData({
                    renewType: 'vip',
                    showRenew: true
                })
            }
            return 
        }
        const limit = res.data.limit;
        const list = this.dataProcessing(res.data.list);
        // 判断是否超出限制token
        if(limit.num > 0){
            if(!(limit.num > limit.val)){
                this.setData({
                    isConfine: true
                })
            }
        }
        this.setData({
            dialogList: [...list, ...this.data.dialogList],
            identity: res.data.identity,
            last_id:list.length < 10 ? -1 : res.data.last_id
        });

        
        wx.nextTick(() => {
            if(!last_id){
                this.scrollToNew()
            }
            this.setData({
                isRefresh: false
            })
            if(this.data.dialogList.length === 1){
                this.playVoice({
                    detail: {
                        id: this.data.dialogList[0].id
                    }
                })
            }
        })
    },
    /**
     * 
     * @param {*} demoList  数据列表 拆分成ai和user
     * @param {*} needLoading 是否需要ai loading 用于 用户发送 ai返回正在请求中
     * @returns 
     */
    dataProcessing(demoList, needLoading = false) {
        const list = demoList;
        const processingList = [];
        list.forEach((item) => {
            if (item.input_status === 1) {
                const user = {
                    id: `${item.identity}_user`,
                    type: "user",
                    audio_duration: item.original_audio_duration || item.input_audio_duration,
                    audioUrl: item.input_audio,
                    output: item.input,
                    status: 0,
                    isLoading: false,
                    original_audio: item.original_audio,
                    lang: this.data.lang
                };
                processingList.push(user);
            }
            if (item.output_status === 1 || needLoading) {
                const ai = {
                    id: `${item.identity}_ai`,
                    type: "ai",
                    audio_duration: item.output_audio_duration,
                    audioUrl: item.output_audio,
                    output: item.output,
                    status: 0,
                    isLoading: needLoading ? needLoading : false,
                    lang: this.data.lang
                };
                processingList.push(ai);
            }
        });

        return processingList;
    },
});
