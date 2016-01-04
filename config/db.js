/**
 * Created by yinbin on 2015/9/4.
 */
'use strict';

var mysql = require('mysql');

/**
 * 生产机配置
 */
var poolOptions = {
    connectionLimit: process.env.MYSQL_CONNECTION_LIMIT || 50,
    host: process.env.MYSQL_IP || 'localhost',
    user: process.env.MYSQL_USERNAME || 'root',
    password: process.env.MYSQL_PASSWORD || 'ybkk1027',
    database: process.env.MYSQL_SCHEMA || 'lrs'
};

var pool = mysql.createPool(poolOptions);

setInterval(function () {
    pool.query('SELECT 1');
}, 10000);

exports.pool = pool;
