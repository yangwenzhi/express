//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        hasUserInfo: false,
        userInfo: {},
        message: ''
    },
    onLoad: function () {
        var that = this;
    },
    bindViewTap: function() {
        var that = this;
        app.getDate(function(res){
            that.setData({
                message: res.result
            });
            that.select();
        });
    },
    goselect: function(e) {
        var that = this;
        that.setData({
            message: e.detail.value
        });
        that.select();
    },
    select: function() {
        var that = this;
        console.log(that.data.message);
        //查询接口 订单号
    }
})
