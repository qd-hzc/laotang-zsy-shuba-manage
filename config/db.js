/**
 * Created by yinbin on 2015/9/4.
 */
'use strict';

var mysql = require('mysql');
var fs = require('fs');
var Util = require('underscore');

var pool = mysql.createPool({
    connectionLimit: process.env.MYSQL_CONNECTION_LIMIT || 50,
    host: process.env.MYSQL_IP || 'localhost',
    user: process.env.MYSQL_USERNAME || 'root',
    password: process.env.MYSQL_PASSWORD || 'ybkk1027',
    database: process.env.MYSQL_SCHEMA || 'zsy_sb'
});

exports.pool = pool;


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
                sql = sql.replace('#SCHAME#',process.env.MYSQL_SCHEMA);
            } else config.database = process.env.MYSQL_SCHEMA || 'zsy_sb';
            var connection = mysql.createConnection(config);
            connection.query(sql, function (err, rows) {
                //console.log(sql);
                //console.error(err);
                if (err)isErr = true;
            });
        });
};
