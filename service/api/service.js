/**
 * Created by yinbin on 2015/7/27.
 */
'use strict';
var db = require('../../config/db');
var dateFormat = require('date-format');

/**
 * 登陆
 * @param username
 * @param password
 * @param callback
 */
module.exports.login = function (username, password, callback) {
    if (!username) return callback({rs: false, ms: '用户名不能为空'});
    if (username.length < 4 || username.length > 10) return callback({rs: false, ms: '用户名长度需在４到10之间'});
    if (!password) return callback({rs: false, ms: '密码不能为空'});
    if (password.length < 4 || password.length > 10) return callback({rs: false, ms: '密码长度需在４到10之间'});
    var loginSql = 'SELECT id,password FROM sys_user WHERE username = ?';
    db.pool.query(loginSql, username, function (error, row, field) {
        if (row && row[0]) {
            if (password === row[0].password) callback({rs: true, ms: row[0].id}); else callback({
                rs: false,
                ms: '密码错误'
            });
        } else callback({rs: false, ms: '用户名不存在'});
    });
};

/**
 * 注册
 * @param username
 * @param password
 * @param callback
 */
module.exports.register = function (username, password, callback) {
    if (!username) return callback({rs: false, ms: '用户名不能为空'});
    if (username.length < 4 || username.length > 10) return callback({rs: false, ms: '用户名长度需在４到10之间'});
    if (!password)return callback({rs: false, ms: '密码不能为空'});
    if (password.length < 4 || password.length > 10)return callback({rs: false, ms: '密码长度需在４到10之间'});
    var checkSql = 'SELECT count(*) AS count FROM sys_user WHERE username = ?';
    db.pool.query(checkSql, username, function (error, row, field) {
        if (row && row[0] && row[0].count > 0) return callback({rs: false, ms: "账号已经存在"});// 账号重复
        var insertSql = 'INSERT INTO sys_user(username,password,cdate,status) values (?,?,?)';
        var now = dateFormat.asString('yyy-MM-dd HH:mm:ss', new Date());
        db.pool.query(insertSql, [username, password, now, 1], function (error, result) {
            if (error) return callback({rs: false, ms: '未知错误,注册失败'});
            callback({rs: true, ms: result.insertId});
        });
    });
};

/**
 * 返回删除的图书id数组
 * @param callback
 */
module.exports.listDelPdfId = function (callback) {
    var selectSql = 'SELECT id FROM dic_pdf WHERE status = 0';
    db.pool.query(selectSql, function (error, row, field) {
        if (row) {
            var ret = [];
            for (var i = 0; i < row.length; i++) ret[i] = row[i].id;
            callback(ret)
        } else callback([]);
    });
};

/**
 * 返回可用的图书列表
 * @param categoryId
 * @param callback
 */
module.exports.listPdfByPid = function (categoryId, callback) {
    var selectSql = 'SELECT * FROM dic_pdf WHERE  dic_category_id = ? AND status = 1';
    db.pool.query(selectSql, [categoryId], function (error, row, field) {
        if (row) {
            for(var i =0;i<row.length;i++) row[i].json = JSON.parse(row[i].json);
            callback(row);
        } else callback([]);
    });
};

/**
 * 搜索图书列表
 * @param searchText
 * @param callback
 */
module.exports.searchPdf = function (searchText, callback) {
    var selectSql = "SELECT * FROM dic_pdf WHERE name like '%?%' OR `desc` like '%?%'";
    db.pool.query(selectSql, searchText, function (error, row, field) {
        if (row) callback(row); else callback([]);
    });
};
