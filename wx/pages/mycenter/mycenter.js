//获取应用实例
var app = getApp();
Page({
    data: {
        userid: '',
        userInfo: {},
        level: 1
    },
    onLoad: function (options) {
        console.log('onLoad')
        var that = this;
        this.setData({
            userid: wx.getStorageSync('userid'),
            userInfo: app.globalData.userInfo
        });

        wx.setNavigationBarTitle({
            title: '我的'
        });

        // userid 请求用户信息
        this.setData({
            level: 3
        });
    }
})
