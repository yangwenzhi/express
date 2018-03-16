var base = require('../../common/base');
var app = getApp();
Page({
    data: {
        userid: null,
        name: '',
        category: '',
        active: 0,
        order0: [],
        order1: [],
        order2: [],
        order3: []
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
            wx.hideLoading();
            if(res.data.state == 1001) {
                var order1 = [], order2 = [], order3 = [];
                for(var i = 0; i < res.data.result.length; i++) {
                    if(res.data.result[i].state == 1) order1.push(res.data.result[i]);
                    else if(res.data.result[i].state == 2) order2.push(res.data.result[i]);
                    else if(res.data.result[i].state == 3) order3.push(res.data.result[i]);
                }
                that.setData({
                    order0: res.data.result,
                    order1: order1,
                    order2: order2,
                    order3: order3
                });
            } else {
                that.toast(res.data.result);
            }
        });
    },
    bindActive0: function() {
        this.setData({
            active: 0
        });
    },
    bindActive1: function() {
        this.setData({
            active: 1
        });
    },
    bindActive2: function() {
        this.setData({
            active: 2
        });
    },
    bindActive3: function() {
        this.setData({
            active: 3
        });
    }
});
