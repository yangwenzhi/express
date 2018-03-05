var express = require('express');
var path = require('path');
var http = require('http');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
//var session = require('express-session');
var route = require('./routes');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length || 1;
var config = require('./config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// session配置
/*app.use(session({
    secret: 'dazhi',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));*/

app.use(express.static(path.join(__dirname, 'public')));

// api接口
route.confApi(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

if (cluster.isMaster) {

    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('death', function(worker) {
        console.log('worker ' + worker.pid + ' died');
        cluster.fork();
    });
    cluster.on('exit', function(worker) {
        var st = new Date
        st = st.getFullYear()+ '-'+ (st.getMonth()+1)+ '-'+st.getDate()+ ' '+st.toLocaleTimeString()
        console.log('worker ' + worker.process.pid + ' died at:',st);
        cluster.fork();
    });

} else {

    var server,
        ip   = config.ip,
        port = config.port || 3006;

    server = http.createServer(app);  
      
    // server.listen(port, ip, function(){
    server.listen(port, function(){
        console.log("Server running at http://" + ip + ":" + port);
    });

}

module.exports = app;
