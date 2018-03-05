//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log(222);
    
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // }
  onShow: function() {
        console.log('getscopeLogin+++++');
        // 授权登录
        this.getscopeLogin();
    },
  getscopeLogin: function() {
        var _this = this;
        // 可以通过 wx.getSetting 先查询一下用户是否授权了
        wx.getSetting({
            success: function(res) {
                if (res.authSetting['scope.userInfo']) {
                    // _this.checkSessionFn();

                  wx.getUserInfo({
                    success: res => {
                      // 可以将 res 发送给后台解码出 unionId
                      app.globalData.userInfo = res.userInfo
                      _this.setData({
                            userInfo: res.userInfo,
                            hasUserInfo: true
                      })
                      console.log(res);

                      
                    }
                  })


                    console.log(1)
                } else {
                    wx.authorize({
                        scope: 'scope.userInfo',
                        success: function(res) {
                            // _this.checkSessionFn();
                            wx.getUserInfo({
                    success: res => {
                      // 可以将 res 发送给后台解码出 unionId
                      app.globalData.userInfo = res.userInfo
                      _this.setData({
                            userInfo: res.userInfo,
                            hasUserInfo: true
                      })
                      console.log(res);

                      
                    }
                  })
                            console.log(11)
                        },
                        fail: function(res) {
                            // _this.getUserInfoTip();
                            console.log(12)
                        }
                    });

                }
            }
        })
    },
})
