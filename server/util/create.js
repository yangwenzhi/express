var fs = require('fs');
var url = require('url');
var path = require('path');
var pathConfig = require('../config/path');
var exec = require('child_process').exec;

function createHtml(data, json) {
    var d = data.replace(/#id#/g, json.id).replace(/#title#/g, json.title).replace(/#desc#/g, json.desc);
    return d;
};

function createScss(data, json) {
    var d = json.scss + data;
    return d;
};

function gulpFile(option, callback) {
    var g = path.join(option.path, 'vv-tools');
    exec('cd ' + g + '; gulp --publish ' + option.oc + '/' + option.name + ' -V --file ' + option.id + ';', function(error, stdout, stderr){
        console.log(error, stdout, stderr);
        callback && callback();
    });
};

function copyFile(option, callback) {
	var p = path.join(option.dir_path, option.dir_name, option.name, '/src/images/', option.id);
    var shell = 'cp -rf ' + option.tmp_path + '/* ' + p +'/; rm -rf ' + option.tmp_path;
    fs.exists(p, function (exists) {
        if(!exists) shell = 'mkdir ' + p + '; ' + shell;
        exec(shell, function(error, stdout, stderr){
            console.log(error, stdout, stderr);
            callback && callback();
        });
    });
};

module.exports.html = createHtml;
module.exports.scss = createScss;
module.exports.gulp = gulpFile;
module.exports.copy = copyFile;
