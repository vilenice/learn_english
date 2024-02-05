const app = getApp();
import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../store/index";
import { getSignInfo, signIn } from "../../api/index";
import { debounce } from "../../utils/util";

Component({
    behaviors: [storeBindingsBehavior],
    properties: {
        
    },
    storeBindings: {
        store,
        fields: {
            systemInfo: () => store.systemInfo,
            menuButtonInfo: () => store.menuButtonInfo,
            navHeight: () => store.navHeight,
            userInfo: () => store.userInfo,
            token: () => store.token,
        },
        actions: {
            updateSystemInfo: "updateSystemInfo",
            updateMenuButtonInfo: "updateMenuButtonInfo",
            updateNavHeight: "updateNavHeight",
            updateToken: "updateToken",
            updateUserInfo: "updateUserInfo",
            login: "login",
        },
    },
    data: {
        baseUrl: app.globalData.baseUrl,
        rewardList: [],
        cycle_day: 0,
        cycle_reward: [],
        cycle_reward_day: [],
        day_status: 0
    },
    ready: function () {
        this.fetchSignInfo();
    },
    detached: function () {},

    attached: function () {
    },

    methods: {
        async fetchSignInfo() {
            const res = await getSignInfo();
            if(res.code === 200){
                const cycle_day = res.data.cycle_day
                const cycle_reward = res.data.cycle_reward
                const cycle_reward_day = res.data.cycle_reward.map((item,index) => {
                    return item.day
                })
                this.setData({
                    cycle_day,
                    cycle_reward,
                    cycle_reward_day,
                    day_status: res.data.day_status
                })
            }
        },
        debounceSign: debounce(function(){
            this.sign()
        }),
        async sign(){
            if(this.data.day_status > 0) return 
            const res = await signIn();
            const rewardString = this.data.cycle_reward_day.join(',')
            if(res.code === 200){
                if(rewardString.indexOf(this.data.cycle_day +1)){
                    this.selectComponent('#toast').showToast('VIP领取成功~',3000)
                } else {
                    this.selectComponent('#toast').showToast('今日已签到，明天再来哦~',3000)
                }
                this.fetchSignInfo();
                this.triggerEvent('refresh')
            }
            console.log(res)
        }
    },
});
