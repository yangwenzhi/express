//获取应用实例
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

        //请求用户详细信息 userid id
        //message
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
    }
})
