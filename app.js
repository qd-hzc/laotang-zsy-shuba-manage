var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var RedisStore = require('connect-redis')(session);
var rpc = require('./lib/rpc');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.disable('etag');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(serveStatic('bower_components'));
app.use(cookieParser('fy_'));
/*app.use(session({
 secret: 'felix yin',
 cookie: {maxAge: 60 * 60 * 1000}
 //cookie: {secure: true}
 }));
 app.use(function (req, res, next) {
 var url = req.originalUrl;
 if (url != "/login" && url != "/" && !req.session.user) {
 return res.redirect("/");
 }
 next();
 });
 */
/*
 app.use(function (req, res, next) {
 res.locals.user = req.session.user || null;
 next();
 });
 */

// =================================================================================

//注册登陆等
var index = require('./routes/index');
app.use('/', index);
//用户管理模块
var user = require('./routes/user');
app.use('/user', user);
//分类管理模块
var category = require('./routes/book/category');
app.use('/book/category', category);
//pdf文件管理模块
var pdf = require('./routes/book/pdf');
app.use('/book/pdf', pdf);
//批量压缩包导入模块
var impt = require('./routes/import/index');
app.use('/import', impt);
//关于模块
var about = require('./routes/about');
app.use('/about', about);
//app api 接口服务
var serviceList = require('./service/api/service');
app.use('/rpc', rpc(express, '/helper.js', 'APIClient', serviceList));

// =================================================================================

/*app.use('/test_session', function (req, res, next) {
 var u = req.session.user;
 res.send(u);
 });*/

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    //next(err);
    res.render('404', {
        message: err.message,
        error: err
    });
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        console.log(err);
        res.render('500', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.log(JSON.stringify(err));
    res.render('500', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
