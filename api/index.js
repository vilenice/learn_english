import { request, baseApiUrl } from "./http";

export const AuthLogin = function (data) {
    try {
        return request("/v1/auth/login", data, "POST");
    } catch (error) {
        return Promise.reject(error);
    }
};

export const AuthInfo = function (data) {
    try {
        return request("/v1/auth/info", data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getRoles = function (data) {
    try {
        return request("/v1/role-topic/roles", data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getTopics = function (data) {
    try {
        return request("/v1/role-topic/topics", data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const wxUpload = function (uploadInfo) {
    return new Promise((resolve, reject) => {
        const { api, tempFilePath, fileType, formData } = uploadInfo; 
        wx.uploadFile({
            url: baseApiUrl + api, // 你的服务器上传接口地址
            filePath: tempFilePath,
            name: fileType, // 你的服务器接收文件的字段名
            formData: {
                // 如果需要，你可以在这里附带一些额外的参数，例如用户ID等
                ...formData,
            },
            header: {
              token: wx.getStorageSync('token'),  
            },
            success: function (res) {
                var data = res.data;
                resolve(data);
            },
            fail: function (res) {
                reject(res);
            },
        });
    });
};

export const chatInit = function (data) {
    try {
        return request("/v1/chat/init", data, "POST");
    } catch (error) {
        return Promise.reject(error);
    }
}

export const chatGenerate = function (data) {
    try {
        return request("/v1/chat/generate", data, "POST");
    } catch (error) {
        return Promise.reject(error);
    }
}

export const sendGenerate = function (data) {
    try {
        return request("/v1/chat/send", data, "POST");
    } catch (error) {
        return Promise.reject(error);
    }
}

export const chatTranslation = function (data) {
    try {
        return request("/v1/chat/translation", data, "POST");
    } catch (error) {
        return Promise.reject(error);
    }
}

export const sendText = function (data) {
    try {
        return request("/v1/chat/send-text", data, "POST");
    } catch (error) {
        return Promise.reject(error);
    }
}

export const generateSubject = function (data) {
    try {
        return request("/v1/chat/generate-subject", data, "POST");
    } catch (error) {
        return Promise.reject(error);
    }
}

export const grammarCheck = function (data) {
    try {
        return request("/v1/chat/grammar-check", data, "POST");
    } catch (error) {
        return Promise.reject(error);
    }
}

export const updateInfo = function (data) {
    try {
        return request("/v1/user/update-info", data, "POST");
    } catch (error) {
        return Promise.reject(error);
    }
}

export const generateAnswer = function (data) {
    try {
        return request("/v1/chat/generate-answer", data, "POST");
    } catch (error) {
        return Promise.reject(error);
    }
}

// 获取用户信息
export const getUserInfo = function (data) {
    try {
        return request("/v1/user/info", data);
    } catch (error) {
        return Promise.reject(error);
    }
}

//生成订单
export const generateOrder = function (data) {
    try {
        return request("/v1/payment/generate", data, "POST");
    } catch (error) {
        return Promise.reject(error);
    }
}

// 查询邀请信息
export const getInviteInfo = function (data) {
    try {
        return request("/v1/invitation/info", data);
    } catch (error) {
        return Promise.reject(error);
    }
}