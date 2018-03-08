module.exports = {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-UA': 'minprogram'
    },
    ajax: function(options, callback) {
        var that = this;
        var url = options.userid ? (options.url + '&userid=' + options.userid) : (options.url + '&userid=' + wx.getStorageSync('userid'));
        wx.request({
            url: url,
            data: options.data || {},
            header: options.header || that.header,
            method: options.method || 'GET',
            success: function(res) {
                callback && callback(res);
            }
        });
    }
}