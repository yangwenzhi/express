var fs = require('fs');
var url = require('url');
var path = require('path');
var http = require('http');
var webshot = require('webshot');
var md5 = require('md5');
// var needle = require('needle');
var request = require('request');
var exec = require('child_process').exec;
// var gm = require('gm').subClass({imageMagick: true});
var config = require('../config');

var get_client_ip = function(req) {
    var ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if(ip.split(',').length > 0) {
        ip = ip.split(',')[0];
    }
    return ip;
};

var logger = function(req, status, err, time) {
    if(time) console.log(req.method, req.url, status + ': ', err, ' | ' + new Date, ' | ' + get_client_ip(req) + ' | ' + time + ' ms ');
    else console.log(req.method, req.url, status + ': ', err, ' | ' + new Date, ' | ' + get_client_ip(req));
};

var create = function(req, res, type) {
    var time = new Date().getTime();

    var options = { 
        screenSize: {
            width: 750,
            height: 1334
        }, 
        shotSize: {
            width: 750,
            height: 'all'
        }, 
        userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)' + ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
    };

    try {

        var id = req.params.id || 'D2HYPdrV';
        var source_url = 'https://' + config.domain + '/vp/' + id + '?from=webview&qrcode=2&vp_ak=ff35adece63d1111f34fcb71c2d6b030&random=' + Math.random();

        if(type == 1) {
            options.shotSize.height = 1100;
            source_url = 'https://' + config.domain + '/wx/m/xcx_create/dist/html/article.html?id=' + id + '&random=' + Math.random();
        } else if(type == 2) {
            options.shotSize.height = 1000;
            source_url = 'https://' + config.domain + '/wx/m/xcx_create/dist/html/usercenter.html?id=' + id + '&random=' + Math.random();
        } 

        var image_url = path.join(__dirname.replace('routes', 'images'), md5(source_url) + '.jpg');

        webshot(source_url, image_url, options, function(err) { 
            var time1 = new Date().getTime();
                
            if(err) logger(req, 404, err);

            fs.exists(image_url, function (exists) {
                var time2 = new Date().getTime();

                if(exists) {

                    var formData = {
                        // Pass a simple key-value pair
                        my_field: 'my_value',
                        // Pass data via Buffers
                        my_buffer: new Buffer([1, 2, 3]),
                        // Pass data via Streams
                        my_file: fs.createReadStream(image_url)
                    };

                    request.post({url:'http://mp-up.51vv.com/upload_v_article', formData: formData}, function optionalCallback(err, resp, body) {
                        var time3 = new Date().getTime();
                        var times = ' 生成时间: ' + (time1 - time)
                        + ' 读取图片时间: ' + (time2 - time1)
                        + ' 上传cdn时间:' + (time3 - time2)
                        + ' 总时间: ' + (new Date().getTime() - time);
                        exec('rm -rf ' + image_url);
                        if(err) {
                            logger(req, 400, err, times);
                            res.status(200).send({code: 400, msg: '上传失败'});
                        }
                        else {
                            logger(req, 200, 'ok', times);
                            res.status(200).send({code: 200, data: JSON.parse(body)});
                        }
                    });

                    // var data = {
                    //     image: { file: image_url, content_type: 'image/jpeg' }
                    // };

                    // needle.post('http://mp-up.51vv.com/upload_v_article', data, { multipart: true }, function(err, resp, body) {
                    //     var time3 = new Date().getTime();
                    //     var times = ' 生成时间: ' + (time1 - time)
                    //     + ' 读取图片时间: ' + (time2 - time1)
                    //     + ' 上传cdn时间:' + (time3 - time2)
                    //     + ' 总时间: ' + (new Date().getTime() - time);
                    //     exec('rm -rf ' + image_url);
                    //     if(err) {
                    //         logger(req, 400, err, times);
                    //         res.status(200).send({code: 400, msg: '上传失败'});
                    //     }
                    //     else {
                    //         logger(req, 200, 'ok', times);
                    //         res.status(200).send({code: 200, data: JSON.parse(body)});
                    //     }
                    // });

                } else {
                    res.status(200).send({code: 404, msg: '生成失败'});
                }

            });

        });

    } catch(err) {
        logger(req, 500, err);
        res.status(200).send({code: 500, msg: '服务器异常'});
    }
};

var apis = function(app){

    app.post('/vp/openapi/build/:id', function(req, res){
        create(req, res);
    });

    app.post('/vp/openapi/build/:id/:h', function(req, res){
        create(req, res);
    });

    app.get('/vp/openapi/build/:id', function(req, res){
        create(req, res);
    });

    app.get('/vp/openapi/build/:id/:h', function(req, res){
        create(req, res);
    });

    app.get('/vp/openapi/xcx/article/:id', function(req, res){
        create(req, res, 1);
    });

    app.get('/vp/openapi/xcx/usercenter/:id', function(req, res){
        create(req, res, 2);
    });

};

module.exports.confApi = apis;
