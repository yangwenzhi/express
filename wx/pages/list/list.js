//获取应用实例
var app = getApp();
Page({
    data: {
        userid: null,
        // class: 1,
        category: [],
    },
    onLoad: function (options) {
        console.log('onLoad')
        var that = this;

        that.setData({
            userid: wx.getStorageSync('userid'),
            // class: options.class
        });

        
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


        wx.setNavigationBarTitle({
            title: '选择快递公司'
        });
    }
})
