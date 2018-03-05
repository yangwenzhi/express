//获取应用实例
var app = getApp();
Page({
    data: {
        userid: null,
        id: 1,
        userlist: []
    },
    onLoad: function (options) {
        console.log('onLoad')
        var that = this;

        that.setData({
            userid: wx.getStorageSync('userid'),
            id: options.id
        });

        
        that.setData({
            
            userlist: [
                {
                    id: 100,
                    power: 0
                },
                {
                    id: 101,
                    power: 1
                },
                {
                    id: 102,
                    power: 2
                },
                {
                    id: 103,
                    power: 1
                }
            ]
        });

        wx.setNavigationBarTitle({
            title: '账号审核'
        });
    },
    onPullDownRefresh: function() {
        var that = this;

        that.setData({
            
            userlist: [
                {
                    id: 100,
                    power: 1
                },
                {
                    id: 101,
                    power: 1
                },
                {
                    id: 102,
                    power: 0
                },
                {
                    id: 103,
                    power: 2
                }
            ]
        });

        setTimeout(function(){
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 2000);
    }
})
