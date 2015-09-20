/**
 * Created by yinbin on 2015/9/4.
 */
'use strict';

var mysql = require('mysql');
var fs = require('fs');
var Util = require('underscore');

/**
 * 生产机配置
 */
var poolOptions = {
    connectionLimit: process.env.MYSQL_CONNECTION_LIMIT || 50,
    host: process.env.MYSQL_IP || 'localhost',
    user: process.env.MYSQL_USERNAME || 'root',
    password: process.env.MYSQL_PASSWORD || 'ybkk1027',
    database: process.env.MYSQL_SCHEMA || 'zsy_sb'
};

var pool = mysql.createPool(poolOptions);

setInterval(function () {
    pool.query('SELECT 1');
}, 10000);

exports.pool = pool;

/**
 * 每次启动服务前都先判断数据库是否已经初始化,否则初始化数据库
 */
exports.createDb = function () {
    var isErr = false;
    Util.each(JSON.parse(fs.readFileSync(__dirname + '/init-db.sql', 'utf-8')),
        function (sql, index, array) {
            if (isErr)return;
            var config = {
                host: process.env.MYSQL_IP || 'localhost',
                user: process.env.MYSQL_USERNAME || 'root',
                password: process.env.MYSQL_PASSWORD || 'ybkk1027'
            };
            if (index == 0) {
                sql = sql.replace('#SCHAME#', process.env.MYSQL_SCHEMA);
                console.log(sql);
            } else config.database = process.env.MYSQL_SCHEMA || 'zsy_sb';
            var connection = mysql.createConnection(config);
            connection.query(sql, function (err, rows) {
                //console.log(sql);
                //console.error(err);
                if (err)isErr = true;
                if(connection && connection.release) connection.release();
            });
        });
};
