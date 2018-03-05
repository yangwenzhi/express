//获取应用实例
var app = getApp();
Page({
    data: {
        userid: null,
        name: '',
        category: '',
        order: []
    },
    onLoad: function (options) {
        console.log('onLoad')
        var that = this;

        that.setData({
            userid: wx.getStorageSync('userid'),
            name: options.name,
            category: options.category,
        });

        //请求数据 userid category
        that.setData({
            order: [
                {
                    id: '48938042804',
                    state: 1
                },
                {
                    id: '48938042804',
                    state: 2
                },
                {
                    id: '48938042804',
                    state: 1
                },
                {
                    id: '48938042804',
                    state: 2
                }
            ]
        });

        wx.setNavigationBarTitle({
            title: that.data.name
        });
    }
})
