var mysql = require('mysql'),
    pool = require('./pool'),
    extend = require('../util').extend,
    EventEmitter = require('events').EventEmitter,
    pathConfig = require('../config/path'),
    table = pathConfig.status == 'online' ? '`active_list_online`' : '`active_list_test`';

var basedata = (function(){

    function BaseData() {
        if (!(this instanceof BaseData))
            return new BaseData();
        EventEmitter.prototype.constructor.apply(this, arguments);
    };

    extend(BaseData, EventEmitter);

    BaseData.prototype.response = function(err, conn) {
        var self = this;
        if (err) {
            return function(sql, fn){
                console.log(err);
                conn && conn.release();
                self.emit('error', err);
                return;
            }
        } else {
            return function(sql, data, fn) {
                conn.query(sql, data, function(err, result) {
                    if (err) {
                        console.log(err);
                        conn && conn.release();
                        self.emit('error', err);
                        return;
                    }
                    conn && conn.release();
                    if (fn) {
                        fn(result);
                    } else {
                        self.emit('done', result);
                    }
                });
            };
        }
        return this;
    };

    BaseData.prototype.query = function(sql, data, fn) {
        var self = this;
        pool.getConnection(function(err, conn){
            self.response(err, conn)(sql, data, fn);
        });
        return this;
    };

    /**
     * @: 查询数据
     */
    BaseData.prototype.select = function (options, fn) {
        var sql = 'SELECT * FROM ' + table + ' where hidden<>1 and act_type="' + options.type + '"';
        if(options.id) sql += ' and act_id="' + options.id + '"';
        sql += ' order by id desc';
        this.query(sql, [], fn);
    };

    /**
     * @: 删除数据
     */
    BaseData.prototype.delete = function (options, fn) {
        var sql = 'UPDATE ' + table + ' SET hidden = 1 WHERE id="' + options.id + '"';
        this.query(sql, [], fn);
    };

    /**
     * @: 添加&修改数据
     */
    BaseData.prototype.add = function (options, fn) {
        var sql = "insert into " + table + "(act_id, act_type, act_title, act_desc, act_scss, create_time) values('" + options.act_id + "','" + options.act_type + "','" + options.act_title + "','" + options.act_desc + "','" + options.act_scss + "','" + options.create_time + "')";
        if(options.state != -1) {
            sql = "UPDATE " + table + " SET act_title='" + options.act_title + "', act_desc='" + options.act_desc + "', act_scss='" + options.act_scss + "', update_time='" + options.update_time + "' WHERE act_id='" + options.act_id + "' and act_type='" + options.act_type + "'";
        }
        this.query(sql, [], fn);
    };

    /**
     * @: 更新时间
     */
    BaseData.prototype.update = function (options, fn) {
        var time = {
            "build_time_pc"   : "build_time_pc='" + options.build_time_pc + "'",
            "build_time_m"    : "build_time_m='" + options.build_time_m + "'",
            "publish_time_pc" : "publish_time_pc='" + options.publish_time_pc + "'",
            "publish_time_m"  : "publish_time_m='" + options.publish_time_m + "'"
        };
        var sql = "UPDATE " + table + " SET " + time[options.timeType] + " WHERE act_id='" + options.act_id + "' and act_type='" + options.act_type + "'";
        this.query(sql, [], fn);
    };

    /**
     * @: 更新图片状态
     */
    BaseData.prototype.updateImage = function (options, fn) {
        var image = {
            "act_img_pc" : "act_img_pc=" + options.act_img_pc,
            "act_img_m"  : "act_img_m=" + options.act_img_m
        };
        var sql = "UPDATE " + table + " SET " + image[options.imageType] + " WHERE act_id='" + options.act_id + "' and act_type='" + options.act_type + "'";
        this.query(sql, [], fn);
    };

    return BaseData;

})();

module.exports = basedata;
