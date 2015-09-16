#!/usr/bin/env node

/**
 * Module dependencies.
 */
var app = require('./app.js');

var debug = require('debug')('zsysb:server');
var http = require('http');
var cluster = require('express-cluster');
var numCPUs = require('os').cpus().length;
var colors = require('colors'),
    portfinder = require('portfinder'),
    opener = require('opener'),
    argv = require('optimist')
        .boolean('cors')
        .argv;
var fs = require('fs');
var request = require('request-json');

/**
 * 检测应用程序是否到期,到期则无法启动应用
 */
setInterval(function () {
    var client = request.createClient('http://bluejings.club/');
    client.post('time.json', {}, function (err, res, body) {
        if (body.status == 'off') {
            killSelf();
        } else {
            // do nothing
        }
    });
}, 60 * 60 * 1000);

//打印帮助
if (argv.h || argv.help) {
    console.log([
        "usage: nohup zsysb [options]",
        "",
        "options:",
        "  -p                 ZSYSB_PORT(web), default 3333",
        "  -t                 MYSQL_PORT(db), default 3306",
        "  -a                 MYSQL_IP,default 127.0.0.1",
        "  -c                 MYSQL_CONNECTION_LIMIT, default 50",
        "  -u                 MYSQL_USERNAME, default root",
        "  -w                 MYSQL_PASSWORD, default 123456",
        "  -m                 MYSQL_SCHEMA, default zsy_sb",
        "  -g --kill          Stop web application",
        "  -h --help          Print this list and exit.",
        "  -v --version       Print the version and author"
    ].join('\n'));
    process.exit();
}

// 打印版本
if (argv.v || argv.version) {
    console.log("version:unknow, author:FelixYin.");
    process.exit();
}

/**
 * 自杀程序
 */
function killSelf() {
    var exec = require('child_process').exec;
    var cmdStr = "kill -9 $(ps -ef|grep zsysb|gawk '$0 !~/grep/ {print $2}' |tr -s '\n' ' ')";
    exec(cmdStr, function (err, stdout, stderr) {
        if (err)  console.error(stderr); else console.log(stdout);
    });
}


// 停止服务
if (argv.g || argv.kill) {
    var pid = fs.readFileSync(__dirname + '/PROCESS_ID', 'UTF-8');
    try {
        console.log('<中石油书吧APP管理系统>服务集群已停止运行,主进程id是:' + pid);
        killSelf();
    } catch (e) {
        console.log('<中石油书吧APP管理系统>服务集群还没启动,不需要停止');
    }
    process.exit();
}

process.env.ZSYSB_PORT = argv.p || process.env.ZSYSB_PORT || '3333';
process.env.MYSQL_PORT = argv.t || process.env.MYSQL_PORT || '3306';
process.env.MYSQL_IP = argv.a || process.env.MYSQL_IP || '0.0.0.0';
process.env.MYSQL_CONNECTION_LIMIT = argv.c || process.env.MYSQL_CONNECTION_LIMIT || '50';
process.env.MYSQL_USERNAME = argv.u || process.env.MYSQL_USERNAME || 'root';
process.env.MYSQL_PASSWORD = argv.w || process.env.MYSQL_PASSWORD || 'ybkk1027';
process.env.MYSQL_SCHEMA = argv.m || process.env.MYSQL_SCHEMA || 'zsy_sb';

/*
 //调试命令行参数
 console.log('ZSYSB_PORT:' + process.env.ZSYSB_PORT);
 console.log('MYSQL_PORT:' + process.env.MYSQL_PORT);
 console.log('MYSQL_IP:' + process.env.MYSQL_IP);
 console.log('MYSQL_CONNECTION_LIMIT:' + process.env.MYSQL_CONNECTION_LIMIT);
 console.log('MYSQL_USERNAME:' + process.env.MYSQL_USERNAME);
 console.log('MYSQL_PASSWORD:' + process.env.MYSQL_PASSWORD);
 console.log('MYSQL_SCHEMA:' + process.env.MYSQL_SCHEMA);
 */

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.ZSYSB_PORT);
app.set('port', port);

var master = cluster(function (worker) {
    /**
     * Create HTTP server.
     */
    var server = http.createServer(app);

    /**
     * Event listener for HTTP server "listening" event.
     */
    function onListening() {
        var addr = server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        debug('Listening on ' + bind);
    }

    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
}, {
    count: (function () {
        if (numCPUs >= 4)
            return numCPUs / 2;
        else return numCPUs;
    })()
});

// 保存当前进程id
if (master && master.pid) {
    console.log('<中石油书吧APP管理系统>服务集群已启动,主进程id是:' + master.pid);
    fs.writeFileSync(__dirname + '/PROCESS_ID', master.pid);
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

require('./config/db.js').createDb();//初始化数据库
