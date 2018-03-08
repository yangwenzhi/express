var base = require('../../common/base');
var app = getApp();
var timer = null;
Page({
    data: {
        userid: '',
        userInfo: {},
        message: {},
        tongji: {}
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

        that.getUserInfo();
        that.tongji();
    },
    onPullDownRefresh: function() {
        var that = this;

        that.getUserInfo();
        that.tongji();

        timer && clearTimeout(timer);
        timer = setTimeout(function(){
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1000);
    },
    getUserInfo: function() {
        var that = this;
        base.ajax({
            url: 'https://api.qucaimi.com/index.php?r=site/userinfo',
            userid: that.data.userid
        }, function(res){
            console.log(res);
            if(res.data.state == 1001) {
                that.setData({
                    message: res.data.result
                });
            } else {
                that.toast(res.data.result);
            }
        });
    },
    tongji: function() {
        var that = this;
        base.ajax({
            url: 'https://api.qucaimi.com/index.php?r=site/statistics-today',
            userid: that.data.userid
        }, function(res){
            console.log(res);
            if(res.data.state == 1001) {
                that.setData({
                    tongji: res.data.result
                });
            } else {
                that.toast(res.data.result);
            }
        });
    },
    toast: function(t) {
        wx.showToast({
            title: t,
            icon: 'none',
            duration: 2000
        });
    }
})
