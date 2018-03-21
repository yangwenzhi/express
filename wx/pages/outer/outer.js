var base = require('../../common/base');
var app = getApp();
var timer = null;
Page({
    data: {
        userid: '',
        info: {},
        productid: '',
        showModal: false,
        locked: false,
        inputValue: ''
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
        wx.showLoading({
            title: '查询中'
        });
        base.ajax({
            url: 'https://api.qucaimi.com/index.php?r=site/query',
            data: {
                productid: that.data.productid,
                userid: that.data.userid
            },
            method: 'POST'
        }, function(res){
            console.log(res);
            wx.hideLoading();
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
    bindViewOuter2: function() {
        console.log('出库');
        var that = this;
        that.postData(2, 'https://api.qucaimi.com/index.php?r=site/issue');
    },
    bindViewOuter3: function() {
        console.log('退库');
        var that = this;
        that.postData(3, 'https://api.qucaimi.com/index.php?r=site/refund');
    },
    postData: function(state, url) {
        var that = this;
        if(that.data.locked) return false;
        that.setData({
            locked: true
        });
        wx.showLoading({
            title: (state == 2 ? '出' : '退') + '库中'
        });
        base.ajax({
            url: url,
            data: {
                productid: that.data.info.productid,
                userid: that.data.userid
            },
            method: 'POST'
        }, function(res){
            console.log((state == 2 ? '出' : '退') + '库', res);
            wx.hideLoading();
            if(res.data.state == 1002) {
                wx.showToast({
                    title: (state == 2 ? '出' : '退') + '库成功',
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
                info: {},
                locked: false
            });
        });
    },
    toast: function(t) {
        wx.showToast({
            title: t,
            icon: 'none',
            duration: 1000
        });
    },
    goselect: function(e) {
        var that = this;
        that.setData({
            productid: e.detail.value,
            showModal: false
        });
        that.select();
    },
    showDialogBtn: function() {
        this.setData({
            showModal: true
        });
    },
    hideModal: function () {
        this.setData({
            showModal: false
        });
    },
    bindKeyInput: function(e) {
        this.setData({
            inputValue: e.detail.value
        });
    },
    onCancel: function() {
        this.hideModal();
    },
    onConfirm: function() {
        var that = this;
        if(that.data.inputValue == '') return false;
        that.setData({
            productid: that.data.inputValue,
            showModal: false
        });
        that.select();
    }
})
