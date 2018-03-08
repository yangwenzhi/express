var base = require('../../common/base');
var app = getApp();
Page({
    data: {
        userid: null,
        express: {}
    },
    onLoad: function (options) {
        console.log('onLoad')
        var that = this;
        this.setData({
            userid: wx.getStorageSync('userid')
        });
        wx.setNavigationBarTitle({
            title: '添加快递公司'
        });
    },
    formSubmit: function(e) {
        var that = this;
        console.log('form发生了submit事件，携带数据为：', e.detail.value);
        that.setData({
            express: e.detail.value
        });
        if(that.data.express.name == '') {
            that.toast('快递公司名称不能为空');
            return;
        }
        if(that.data.express.tag == '') {
            that.toast('快递公司编号不能为空');
            return;
        }
        wx.showLoading({
            title: '添加中',
        });
        //快递公司名称编号不能重复
        base.ajax({
            url: 'https://api.qucaimi.com/index.php?r=site/addcategory',
            data: {
                userid: that.data.userid,
                name: that.data.express.name,
                tag: that.data.express.tag
            },
            method: 'POST'
        }, function(res){
            if(res.data.state == 1002) {
                wx.showToast({
                    title: '添加成功',
                    icon: 'success',
                    duration: 2000
                });
                that.setData({
                    express: {}
                });
                wx.hideLoading();
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
