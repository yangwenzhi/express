var base = require('../../common/base');
const app = getApp();

Page({
    data: {
        userid: '',
        message: {},
        productid: '',
        state: 0
    },
    onLoad: function () {
        console.log('onLoad')
        var that = this;
        that.setData({
            userid: wx.getStorageSync('userid')
        });
    },
    bindViewTap: function() {
        var that = this;
        app.getDate(function(res){
            that.setData({
                productid: res.result
            });
            that.select();
        });
    },
    goselect: function(e) {
        var that = this;
        that.setData({
            productid: e.detail.value
        });
        that.select();
    },
    select: function() {
        var that = this;
        console.log(that.data.productid);
        //查询接口 订单号
        base.ajax({
            url: 'https://api.qucaimi.com/index.php?r=site/query',
            data: {
                productid: that.data.productid,
                userid: that.data.userid
            },
            method: 'POST'
        }, function(res){
            console.log(res);
            if(res.data.state == 1001) {
                that.setData({
                    message: res.data.result,
                    state: 1
                });
            } else {
                that.toast(res.data.result);
                that.setData({
                    state: 2
                });
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
