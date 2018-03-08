var base = require('../../common/base');
var app = getApp();
var timer = null;
Page({
    data: {
        userid: '',
        info: {},
        productid: ''
    },
    //事件处理函数
    bindViewTap: function() {
        var that = this;
        app.getDate(function(res){
            that.setData({
                productid: res.result
            });
            that.select();
        });
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
                    info: {
                        name: res.data.result.express,
                        productid: res.data.result.productid,
                        createtime: res.data.result.createtime
                    }
                });
            } else {
                that.toast(res.data.result);
            }
        });
    },
    onLoad: function (options) {
        console.log('onLoad')
        var that = this;
        that.setData({
            userid: wx.getStorageSync('userid')
        });
        wx.setNavigationBarTitle({
            title: '正在出库'
        });
    },
    formSubmit: function(e) {
        console.log('form发生了submit事件，携带数据为：', e.detail.value);
        var that = this;
        var productid = e.detail.value.productid;
        console.log({productid: productid, userid: that.data.userid})
        base.ajax({
            url: 'https://api.qucaimi.com/index.php?r=site/issue',
            data: {
                productid: productid,
                userid: that.data.userid
            },
            method: 'POST'
        }, function(res){
            console.log('出库', res);
            if(res.data.state == 1002) {
                wx.showToast({
                    title: '出库成功',
                    icon: 'success',
                    duration: 1000
                });
                timer && clearTimeout(timer);
                timer = setTimeout(function(){
                    that.bindViewTap();
                }, 1000);
            } else {
                that.toast(res.data.result);
                timer && clearTimeout(timer);
                timer = setTimeout(function(){
                    that.bindViewTap();
                }, 1000);
            }
            that.setData({
                info: {}
            });
        });
    },
    toast: function(t) {
        wx.showToast({
            title: t,
            icon: 'none',
            duration: 1000
        });
    }
})
