//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo
    //           console.log(res);

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  // onShow: function() {
  //       console.log('getscopeLogin+++++');
  //       // 授权登录
  //       this.getscopeLogin();
  //   },
  // getscopeLogin: function() {
  //       var _this = this;
  //       // 可以通过 wx.getSetting 先查询一下用户是否授权了
  //       wx.getSetting({
  //           success: function(res) {
  //               if (res.authSetting['scope.userInfo']) {
  //                   // _this.checkSessionFn();

  //                 wx.getUserInfo({
  //                   success: res => {
  //                     // 可以将 res 发送给后台解码出 unionId
  //                     _this.globalData.userInfo = res.userInfo
  //                     console.log(res);

                      
  //                   }
  //                 })


  //                   console.log(1)
  //               } else {
  //                   wx.authorize({
  //                       scope: 'scope.userInfo',
  //                       success: function(res) {
  //                           // _this.checkSessionFn();
  //                           wx.getUserInfo({
  //                   success: res => {
  //                     // 可以将 res 发送给后台解码出 unionId
  //                     _this.globalData.userInfo = res.userInfo
  //                     console.log(res);

                      
  //                   }
  //                 })
  //                           console.log(11)
  //                       },
  //                       fail: function(res) {
  //                           // _this.getUserInfoTip();
  //                           console.log(12)
  //                       }
  //                   });

  //               }
  //           }
  //       })
  //   },
  globalData: {
    userInfo: null
  }
})