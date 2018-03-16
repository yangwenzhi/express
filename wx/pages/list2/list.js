var base = require('../../common/base');
var app = getApp();
var timer = null;
Page({
    data: {
        userid: null,
        category: []
    },
    onLoad: function (options) {
        console.log('onLoad')
        var that = this;

        that.setData({
            userid: wx.getStorageSync('userid')
        });

        wx.setNavigationBarTitle({
            title: '选择快递公司'
        });
        wx.showLoading({
            title: '加载中'
        });
        // if(wx.getStorageSync('expresslist')) {
        //     that.setData({
        //         category: wx.getStorageSync('expresslist'),
        //     });
        //     wx.hideLoading();
        // }
        that.expresslist();
    },
    onPullDownRefresh: function() {
        var that = this;

        // if(wx.getStorageSync('expresslist')) {
        //     that.setData({
        //         category: wx.getStorageSync('expresslist'),
        //     });
        // }
        that.expresslist();

        timer && clearTimeout(timer);
        timer = setTimeout(function(){
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1000);
    },
    toast: function(t) {
        wx.showToast({
            title: t,
            icon: 'none',
            duration: 2000
        });
    },
    expresslist: function() {
        var that = this;
        base.ajax({
            url: 'https://api.qucaimi.com/index.php?r=site/expresslist'
        }, function(res){
            console.log(res);
            wx.hideLoading();
            if(res.data.state == 1001) {
                that.setData({
                    category: res.data.result,
                });
                // if(!wx.getStorageSync('expresslist')) {
                //     that.setData({
                //         category: res.data.result,
                //     });
                // }
                // wx.setStorageSync('expresslist', res.data.result);
            } else {
                that.toast(res.data.result);
            }
        });
    }
})
