var base = require('../../common/base');
var app = getApp();
var timer = null;
Page({
    data: {
        category: '',
        name: '',
        tag: '',
        userid: '',
        info: {}
    },
    //事件处理函数
    bindViewTap: function() {
        var that = this;
        app.getDate(function(info){
            that.setData({
                info:info
            })
        });
    },
    onLoad: function (options) {
        console.log('onLoad')
        var that = this;
        this.setData({
            category: options.category,
            name: options.name,
            tag: options.tag,
            userid: wx.getStorageSync('userid')
        });
        wx.setNavigationBarTitle({
            title: '正在入库 - ' + that.data.name
        });
    },
    formSubmit: function(e) {
        console.log('form发生了submit事件，携带数据为：', e.detail.value);
        var that = this;
        this.setData({
            info: e.detail.value
        });
        console.log({info: that.data.info, userid: that.data.userid})
        //http://www.kuaidi100.com/autonumber/auto?num=[单号]&key=XYYNXvqg9704
        //返回的comCode和tag对比确认productid是否合法
        base.ajax({
            url: 'https://api.qucaimi.com/index.php?r=site/order',
            data: {
                expressid: that.data.info.category,
                productid: that.data.info.product,
                tag: that.data.tag,
                userid: that.data.userid
            },
            method: 'POST'
        }, function(res){
            console.log('入库', res);
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
