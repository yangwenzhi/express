//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        userid: '',
        info: {},
        message: ''
    },
    //事件处理函数
    bindViewTap: function() {
        var that = this;
        app.getDate(function(res){
            that.setData({
                message: res.result
            });
            that.select();
        });
    },
    select: function() {
        var that = this;
        console.log(that.data.message);
        //查询接口 订单号
        that.setData({
            info: {
                name: '顺丰',
                productid: '74280934092',
                createtime: '2018-03-05'
            }
        });
    },
    onLoad: function (options) {
        console.log('onLoad')
        var that = this;
        this.setData({
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
        wx.request({
            url: 'https://api.qucaimi.com/index.php?r=site/order',
            data: {
                productid: productid,
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
                        title: '出库成功',
                        icon: 'success',
                        duration: 2000
                    });
                    that.bindViewTap();
                } else {
                    that.toast(res.data.result);
                    that.bindViewTap();
                }
                that.setData({
                    info: {}
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
