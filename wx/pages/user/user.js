var base = require('../../common/base');
var app = getApp();
var timer = null;
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

        wx.setNavigationBarTitle({
            title: '账号审核'
        });
        wx.showLoading({
            title: '加载中',
        });
        that.userlist();
    },
    onPullDownRefresh: function() {
        var that = this;

        that.userlist();

        timer && clearTimeout(timer);
        timer = setTimeout(function(){
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1000);
    },
    userlist: function() {
        var that = this;

        base.ajax({
            url: 'https://api.qucaimi.com/index.php?r=site/unaudited'
        }, function(res){
            console.log(res);
            if(res.data.state == 1001) {
                that.setData({
                    userlist: res.data.result
                });
            } else {
                that.toast(res.data.result);
            }
            wx.hideLoading();
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
