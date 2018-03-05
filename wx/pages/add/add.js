//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        category: '',
        name: '',
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
        wx.request({
            url: 'https://api.qucaimi.com/index.php?r=site/order',
            data: {
                expressid: that.data.info.category,
                productid: that.data.info.product,
                userid: that.data.userid
            },
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-UA': 'minprogram'
            },
            method: 'POST',
            success: function(res) {
                console.log(res);
                if(res.data.state == 1002) {
                    wx.showToast({
                        title: '入库成功',
                        icon: 'success',
                        duration: 2000
                    });
                    that.bindViewTap();
                } else {
                    that.toast(res.data.result);
                    that.bindViewTap();
                }
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
