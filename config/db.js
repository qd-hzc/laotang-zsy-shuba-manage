/**
 * Created by yinbin on 2015/7/23.
 */
'use strict';

var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'ybkk1027',
    database: 'zsy_sb'
});

exports.pool = pool;