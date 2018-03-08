var base = require('../../common/base');
var util = require('../../utils/util.js');
var app = getApp();
Page({
    data: {
        userid: null,
        class: 1,
        date: '',
        tongji: {},
        empty: 0
    },
    onLoad: function (options) {
        console.log('onLoad')
        var that = this;

        that.setData({
            userid: wx.getStorageSync('userid'),
            class: options.class,
            date: util.formatTime(new Date()).split(' ')[0]
        });
        console.log(util.formatTime(new Date()).split(' ')[0])

        if(that.data.class == 1) {
            wx.setNavigationBarTitle({
                title: '今日统计'
            })
        } else {
            wx.setNavigationBarTitle({
                title: '历史统计'
            })
        }
        wx.showLoading({
            title: '加载中',
        });
        that.tongji();
    },
    bindDateChange: function (e) {
        var that = this;
        that.setData({  
            date: e.detail.value
        });
        console.log(that.data.date);

        that.tongji();
    },
    tongji: function() {
        var that = this;
        var d = that.data.date.replace(/-/g, '');
        console.log(d);
        base.ajax({
            url: 'https://api.qucaimi.com/index.php?r=site/statistics-history&date=' + d,
            userid: that.data.userid
        }, function(res){
            console.log(res);
            if(res.data.state == 1001) {
                that.setData({
                    tongji: res.data.result
                });
                if(res.data.result.list.length) {
                    that.setData({
                        empty: 0
                    });
                } else {
                    that.setData({
                        empty: 1
                    });
                }
                if(that.data.class == 1) {
                    wx.setNavigationBarTitle({
                        title: '今日统计(' + res.data.result.total_output + '/' + res.data.result.total_input + ')'
                    })
                } else {
                    wx.setNavigationBarTitle({
                        title: that.data.date + '(' + res.data.result.total_output + '/' + res.data.result.total_input + ')'
                    })
                }
            } else {
                that.toast(res.data.result);
                that.setData({
                    empty: 1
                });
            }
            wx.hideLoading();
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
