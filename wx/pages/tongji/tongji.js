//获取应用实例
var util = require('../../utils/util.js');
var app = getApp();
Page({
    data: {
        userid: null,
        class: 1,
        category: [],
        date: ''
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
        
        that.setData({
            
            category: [
                {
                    id: 1,
                    tag: 'sf',
                    name: '顺丰'
                },
                {
                    id: 2,
                    tag: 'yd',
                    name: '韵达'
                },
                {
                    id: 3,
                    tag: 'bs',
                    name: '百世汇通'
                },
                {
                    id: 4,
                    tag: 'yt',
                    name: '圆通'
                }
            ]
        });


        if(that.data.class == 1) {
            wx.setNavigationBarTitle({
                title: '今日统计-80/100'
            })
        } else {
            wx.setNavigationBarTitle({
                title: '历史统计-80/100'
            })
        }

        //查询固定日期的统计 包括今日
    },
    bindDateChange: function (e) {
        var that = this;
        that.setData({  
            date: e.detail.value
        });
        //查询固定日期的统计 包括今日
        console.log(that.data.date);
    }
})
