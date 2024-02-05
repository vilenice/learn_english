const app = getApp();
import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../store/index";
import { updateInfo, wxUpload } from "../../api/index";

Page({
    data: {
        
    },

    onLoad: function () {
        this.storeBindings = createStoreBindings(this, {
            store,
            fields: ["navHeight", "userInfo"],
            actions: ["updateUserInfo"],
        });
    },
    onReady() {
    },
    onUnload() {
        this.storeBindings.destroyStoreBindings();
    },

    //  获取微信头像回调
    async chooseBack(e) {
        const { avatarUrl } = e.detail;
        this.updateUserInfo({
            ...this.data.userInfo,
            avatarUrl: avatarUrl
        })
        let uploadData = await wxUpload({
            api: '/v1/upload/img',
            tempFilePath: avatarUrl,
            fileType: 'file',
            formData: {
                identity: 'radom'
            }
        })
        uploadData = JSON.parse(uploadData)
        updateInfo({
            avatar: uploadData.data.url
        }).then((res) => {
            console.log(res)
        })
    },

    // 微信名称修改
    nameChange(e){
        const name = e.detail.value
        this.updateUserInfo({
            ...this.data.userInfo,
            nickname: name
        })
        updateInfo({
            nickname: name
        }).then(() => {
            
        })
    }
});
