var base = require('../../common/base');
var app = getApp();
var pages, prevPage;
Page({
    data: {
        userid: null,
        id: '',
        message: {},
    },
    onLoad: function (options) {
        console.log('onLoad')
        var that = this;

        that.setData({
            userid: wx.getStorageSync('userid'),
            id: options.id
        });

        wx.setNavigationBarTitle({
            title: '账号审核'
        });

        pages = getCurrentPages();
        prevPage = pages[pages.length - 2]; //上一个页面
        wx.showLoading({
            title: '加载中',
        });
        that.userInfo();
    },
    bindViewTap: function() {
        var that = this;
        console.log('通过审核')
        wx.showModal({
            title: '审核',
            content: '确定要通过审核吗？',
            success: function (sm) {
                if (sm.confirm) {
                    that.backData(1);
                } else if (sm.cancel) {
                    console.log('用户点击取消');
                }
            }
        });
    },
    bindViewTap1: function() {
        var that = this;
        console.log('拉黑')
        wx.showModal({
            title: '审核',
            content: '确定要拉黑吗？',
            success: function (sm) {
                if (sm.confirm) {
                    that.backData(2);
                } else if (sm.cancel) {
                    console.log('用户点击取消');
                }
            }
        });
    },
    backData: function(power) {
        var that = this;
        that.changepower(power, function(){
            var list = prevPage.data.userlist;
            for (var i in list) {
                if (that.data.id == list[i].id) {
                    list[i].power = power;
                    break;
                }
            }
            prevPage.setData({
                'userlist': list 
            });

            wx.navigateBack({
                delta: 1
            });
        });
    },
    changepower: function(power, callback) {
        var that = this;
        base.ajax({
            url: 'https://api.qucaimi.com/index.php?r=site/audited&power=' + power,
            userid: that.data.id
        }, function(res){
            console.log(res);
            if(res.data.state == 1002) {
                callback && callback();
            } else {
                that.toast(res.data.result);
            }
        });
    },
    userInfo: function() {
        var that = this;
        base.ajax({
            url: 'https://api.qucaimi.com/index.php?r=site/userinfo',
            userid: that.data.id
        }, function(res){
            console.log(res);
            wx.hideLoading();
            if(res.data.state == 1001) {
                that.setData({
                    message: res.data.result
                });
            } else {
                that.toast(res.data.result);
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
