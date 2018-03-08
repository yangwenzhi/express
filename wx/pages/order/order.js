var base = require('../../common/base');
var app = getApp();
Page({
    data: {
        userid: null,
        name: '',
        category: '',
        order: [],
        empty: 0
    },
    onLoad: function (options) {
        console.log('onLoad')
        var that = this;

        that.setData({
            userid: wx.getStorageSync('userid'),
            name: options.name,
            category: options.category,
        });

        wx.setNavigationBarTitle({
            title: that.data.name
        });
        wx.showLoading({
            title: '加载中',
        });
        that.orderlist();
    },
    toast: function(t) {
        wx.showToast({
            title: t,
            icon: 'none',
            duration: 2000
        });
    },
    orderlist: function() {
        var that = this;
        base.ajax({
            url: 'https://api.qucaimi.com/index.php?r=site/orderlist',
            data: {
                expressid: that.data.category,
                userid: that.data.userid
            },
            method: 'POST'
        }, function(res){
            console.log(res);
            if(res.data.state == 1001) {
                that.setData({
                    order: res.data.result
                });
                if(res.data.result.length) {
                    that.setData({
                        empty: 0
                    });
                } else {
                    that.setData({
                        empty: 1
                    });
                }
            } else {
                that.toast(res.data.result);
                that.setData({
                    empty: 1
                });
            }
            wx.hideLoading();
        });
    }
})
