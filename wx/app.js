App({
    onLaunch: function () {
        var that = this;
        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                console.log(res);
                that.globalData.code = res.code;
            }
        })
    },
    globalData:{
        code: '',
        userInfo: null,
        openid: '',
        userStatus: {},
    },
    getDate: function(cb){
        var that = this;
        wx.scanCode({
            success: (res) => {
                console.log(res);
                typeof cb == "function" && cb(res);
            }
        });
    }
});
