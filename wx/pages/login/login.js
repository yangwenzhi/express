var area = require('../../data/area');
var base = require('../../common/base');
const app = getApp();
var timer = null;
var p = 0, c = 0, d = 0;

Page({
    data: {
        provinceName:[],
        provinceCode: [],
        provinceSelIndex: '',
        cityName: [],
        cityCode: [],
        citySelIndex: '',
        districtName: [],
        districtCode: [],
        districtSelIndex: '',
        showMessage: false,
        messageContent: '',
        showDistpicker: false,
        userInfo: {},
        loginInfo: {},
        code: '',
        userid: '',
        openid: '',
        class: 1,
        type: 0,
        state: 0,
        userStatus: {},
    },
    onLoad: function(options) {
        var that = this;
        that.setData({
            userStatus: app.globalData.userStatus,
            code: app.globalData.code,
            userid: wx.getStorageSync('userid'),
            openid: wx.getStorageSync('openid')
        });
        console.log('app.globalData.userStatus');
        console.log(app.globalData.userStatus);
        if(that.data.userid) {
            wx.switchTab({
                url: '../index/index'
            });
        }
        this.setAreaData();
    },
    onShow: function () {
        var that = this;
        that.getscopeLogin();
    },
    onPullDownRefresh: function() {
        var that = this;

        that.getUserInfoData();

        timer && clearTimeout(timer);
        timer = setTimeout(function(){
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1000);
    },
    getscopeLogin: function() {
        var that = this;
        // 可以通过 wx.getSetting 先查询一下用户是否授权了
        wx.getSetting({
            success: function(res) {
                if (res.authSetting['scope.userInfo']) {
                    that.getUserInfoMessage();
                } else {
                    wx.authorize({
                        scope: 'scope.userInfo',
                        success: function(res) {
                            that.getUserInfoMessage();
                        },
                        fail: function(res) {
                            console.log('拒绝授权');
                        }
                    });

                }
            }
        })
    },
    getUserInfoMessage: function() {
        var that = this;
        wx.getUserInfo({
            success: res => {
                // 可以将 res 发送给后台解码出 unionId
                app.globalData.userInfo = res.userInfo;
                console.log('app.globalData.userInfo');
                console.log(app.globalData.userInfo);

                base.ajax({
                    url: 'https://api.qucaimi.com/index.php?r=site/code2session',
                    data: {
                        code: app.globalData.code
                    }
                }, function(res){
                    console.log('code2session', res.data);
                    if(res.data.state == 1001) {
                        app.globalData.openid = res.data.result.openid;
                        wx.setStorageSync('openid', app.globalData.openid);
                        that.setData({
                            openid: app.globalData.openid
                        });

                        that.getUserInfoData();
                    }
                });
            }
        })
    },
    getUserInfoData: function() {
        var that = this;

        base.ajax({
            url: 'https://api.qucaimi.com/index.php?r=site/getuserpower',
            data: {
                openid: app.globalData.openid
            }
        }, function(res){
            console.log('getuserpower', res.data);
            if(res.data.state == 1001) {
                app.globalData.userStatus = res.data.result;
                that.setData({
                    userStatus: app.globalData.userStatus,
                });
                if(res.data.result.power == 0) {
                    that.setData({
                        type: 0,
                        state: 1
                    });
                    wx.setNavigationBarTitle({
                        title: '审核中'
                    });
                } else if(res.data.result.power == 1) {
                    
                    if(that.data.userid) {
                        wx.setNavigationBarTitle({
                            title: '站长助手'
                        });
                        wx.switchTab({
                            url: '../index/index'
                        });
                    } else {
                        that.setData({
                            type: 1,
                            state: 0
                        });
                        wx.setNavigationBarTitle({
                            title: '登录'
                        });
                    }
                } else if(res.data.result.power == 2) {
                    that.setData({
                        type: 0,
                        state: 2
                    });
                    wx.setNavigationBarTitle({
                        title: '账号异常'
                    });
                }
            } else {
                that.setData({
                    type: 2,
                    state: 0
                });
                wx.setNavigationBarTitle({
                    title: '权限申请'
                });
            }
        });
    },
    formSubmit: function(e) {
        var that = this;
        console.log('form发生了submit事件，携带数据为：', e.detail.value);
        if(that.data.type == 1) {
            that.setData({
                loginInfo: e.detail.value
            });
            if(that.data.loginInfo.userid == '' || that.data.loginInfo.password == '') {
                that.toast('工号密码不能为空');
                return;
            }
            wx.showLoading({
                title: '登录中',
            });
            base.ajax({
                url: 'https://api.qucaimi.com/index.php?r=site/login',
                userid: that.data.loginInfo.userid,
                data: {
                    id: that.data.loginInfo.userid,
                    password: that.data.loginInfo.password
                },
                method: 'POST'
            }, function(res){
                if(res.data.state == 1002) {
                    wx.setStorageSync('userid', that.data.loginInfo.userid);
                    wx.switchTab({
                        url: '../index/index'
                    });
                    wx.hideLoading();
                } else {
                    that.toast(res.data.result);
                }
            });
            
        } else {
            that.setData({
                userInfo: e.detail.value
            });
            if(that.data.userInfo.name == '') {
                that.toast('姓名不能为空');
                return;
            }
            if(that.data.userInfo.tel == '') {
                that.toast('手机号不能为空');
                return;
            }
            if(!(/^1[3|4|5|6|7|8][0-9]\d{4,8}$/.test(that.data.userInfo.tel))) {
                that.toast('手机号码格式不正确');
                return;
            }
            if(that.data.userInfo.province == '' || that.data.userInfo.city == '') {
                that.toast('请选择所在地区');
                return;
            }
            if(that.data.userInfo.address == '') {
                that.toast('详细地址不能为空');
                return;
            }
            if(that.data.userInfo.ename == '') {
                that.toast('站点名不能为空');
                return;
            }
            if(that.data.userInfo.password == '' || that.data.userInfo.cpassword == '') {
                that.toast('密码不能为空');
                return;
            }
            if(that.data.userInfo.password != that.data.userInfo.cpassword) {
                that.toast('两次输入密码不一致');
                return;
            }
            wx.showLoading({
                title: '加载中',
            });
            base.ajax({
                url: 'https://api.qucaimi.com/index.php?r=site/join',
                data: that.data.userInfo,
                method: 'POST'
            }, function(res){
                console.log(res);
                if(res.data.state == 1002) {
                    base.ajax({
                        url: 'https://api.qucaimi.com/index.php?r=site/getuserpower',
                        data: {
                            openid: app.globalData.openid
                        }
                    }, function(res){
                        if(res.data.state == 1001) {
                            wx.setNavigationBarTitle({
                                title: '审核中'
                            });
                            app.globalData.userStatus = res.data.result;
                            that.setData({
                                userStatus: app.globalData.userStatus,
                                type: 0,
                                state: 1
                            });
                            wx.hideLoading();
                            wx.showToast({
                                title: '申请已提交',
                                icon: 'success',
                                duration: 2000
                            });
                        }
                    });
                } else {
                    that.toast(res.data.result);
                }
            });
        }
    },
    toast: function(t) {
        wx.showToast({
            title: t,
            icon: 'none',
            duration: 2000
        });
    },
    setAreaData: function(p, c, d){
        var p = p || 0 // provinceSelIndex
        var c = c || 0 // citySelIndex
        var d = d || 0 // districtSelIndex
        // 设置省的数据
        var province = area['100000']
        var provinceName = [];
        var provinceCode = [];
        for (var item in province) {
          provinceName.push(province[item])
          provinceCode.push(item)
        }
        this.setData({
          provinceName: provinceName,
          provinceCode: provinceCode
        })
        // 设置市的数据
        var city = area[provinceCode[p]]
        var cityName = [];
        var cityCode = [];
        for (var item in city) {
          cityName.push(city[item])
          cityCode.push(item)
        }
        this.setData({
          cityName: cityName,
          cityCode: cityCode
        })
        // 设置区的数据
        var district = area[cityCode[c]]
        var districtName = [];
        var districtCode = [];
        for (var item in district) {
          districtName.push(district[item])
          districtCode.push(item)
        }
        this.setData({
          districtName: districtName,
          districtCode: districtCode
        })
    },
    changeArea: function(e) {
        p = e.detail.value[0]
        c = e.detail.value[1]
        d = e.detail.value[2]
        this.setAreaData(p, c, d)
    },
    showDistpicker: function() {
        this.setData({
          showDistpicker: true
        })
    },
    distpickerCancel: function() {
        this.setData({
          showDistpicker: false
        })
    },
    distpickerSure: function() {
        this.setData({
          provinceSelIndex: p,
          citySelIndex: c,
          districtSelIndex: d
        })
        this.distpickerCancel()
    },
    showMessage: function(text) {
        var that = this
        that.setData({
          showMessage: true,
          messageContent: text
        })
        setTimeout(function(){
          that.setData({
            showMessage: false,
            messageContent: ''
          })
        }, 3000)
    }
});
