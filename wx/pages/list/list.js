var base = require('../../common/base');
var wxSortPickerView = require('../../wxSortPickerView/wxSortPickerView');
var app = getApp();
var timer = null;
Page({
    data: {
        userid: null,
        category: []
    },
    onShareAppMessage: function (res) {
        return {
            title: '邻里汇',
            path: 'pages/login/login'
        }
    },
    onLoad: function (options) {
        console.log('onLoad')
        var that = this;

        that.setData({
            userid: wx.getStorageSync('userid')
        });

        wx.setNavigationBarTitle({
            title: '选择快递公司'
        });
        wx.showLoading({
            title: '加载中'
        });
        // if(wx.getStorageSync('expresslist')) {
        //     wxSortPickerView.init(wx.getStorageSync('expresslist'), that);
        //     wx.hideLoading();
        // }
        that.expresslist();
    },
    onPullDownRefresh: function() {
        var that = this;

        // if(wx.getStorageSync('expresslist')) {
        //     wxSortPickerView.init(wx.getStorageSync('expresslist'), that);
        // }
        that.expresslist();

        timer && clearTimeout(timer);
        timer = setTimeout(function(){
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1000);
    },
    toast: function(t) {
        wx.showToast({
            title: t,
            icon: 'none',
            duration: 2000
        });
    },
    expresslist: function() {
        var that = this;
        base.ajax({
            url: 'https://api.qucaimi.com/index.php?r=site/expresslist'
        }, function(res){
            console.log(res);
            wx.hideLoading();
            if(res.data.state == 1001) {
                that.setData({
                    category: res.data.result,
                });
                var arr = [];
                for(var i = 0; i < that.data.category.length; i++) {
                    arr.push(that.data.category[i].name + '+' + that.data.category[i].id + '+' + that.data.category[i].tag);
                }
                wxSortPickerView.init(arr, that);
                // if(!wx.getStorageSync('expresslist')) {
                //     wxSortPickerView.init(arr, that);
                // }
                // wx.setStorageSync('expresslist', arr);
            } else {
                that.toast(res.data.result);
            }
        });
    }
})
