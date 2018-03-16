var base = require('../../common/base');
var app = getApp();
var timer = null;
Page({
    data: {
        category: '',
        name: '',
        tag: '',
        userid: '',
        info: '',
        auto: 0,
        showModal: false
    },
    //事件处理函数
    bindViewTap: function() {
        var that = this;
        app.getDate(function(res){
            that.setData({
                info: res.result
            });
            if(that.data.auto == 1) that.getExpressData();
        });
    },
    onLoad: function (options) {
        console.log('onLoad')
        var that = this;
        that.setData({
            category: options.category || '-',
            name: options.name || '-',
            tag: options.tag || '-',
            auto: options.auto || '0',
            userid: wx.getStorageSync('userid')
        });
        if(that.data.auto == 1) {
            wx.setNavigationBarTitle({
                title: '智能入库'
            });
        } else {
            wx.setNavigationBarTitle({
                title: '正在入库 - ' + that.data.name
            });
        }
    },
    formSubmit: function(e) {
        console.log('form发生了submit事件，携带数据为：', e.detail.value);
        var that = this, d = e.detail.value;
        wx.showLoading({
            title: '入库中'
        });
        //http://www.kuaidi100.com/autonumber/auto?num=[单号]&key=XYYNXvqg9704
        //返回的comCode和tag对比确认productid是否合法
        base.ajax({
            url: 'https://api.qucaimi.com/index.php?r=site/order',
            data: {
                expressid: d.category,
                productid: d.product,
                tag: that.data.tag,
                name: that.data.name,
                userid: that.data.userid
            },
            method: 'POST'
        }, function(res){
            console.log('入库', res);
            wx.hideLoading();
            if(res.data.state == 1002) {
                wx.showToast({
                    title: '入库成功',
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
                info: ''
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
    getExpressData: function() {
        var that = this;
        wx.showLoading({
            title: '智能识别中'
        });
        base.ajax({
            url: 'https://api.qucaimi.com/index.php?r=site/getexpress&productid=' + that.data.info
        }, function(res){
            console.log(res);
            wx.hideLoading();
            if(res.data.state == 1001) {
                that.setData({
                    category: res.data.result.id,
                    name: res.data.result.name,
                    tag: res.data.result.tag
                });
            } else {
                that.toast(res.data.result);
            }
        });
    },
    goselect: function(e) {
        var that = this;
        that.setData({
            info: e.detail.value,
            showModal: false
        });
        if(that.data.auto == 1) that.getExpressData();
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
    }
})
