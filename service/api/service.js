/**
 * Created by yinbin on 2015/7/27.
 */
'use strict';
var db = require('../../config/db');
var date = require('../../lib/date');

/**
 * 登陆
 * @param username
 * @param password
 * @param callback
 */
module.exports.login = function (username, password, callback) {
    if (!username) return callback({rs: false, ms: '用户名不能为空'});
    if (username.length < 4 || username.length > 15) return callback({rs: false, ms: '用户名长度需在４到15之间'});
    if (!password) return callback({rs: false, ms: '密码不能为空'});
    if (password.length < 4 || password.length > 10) return callback({rs: false, ms: '密码长度需在４到10之间'});
    var loginSql = 'SELECT id,password,status FROM sys_user WHERE username = ?';
    db.pool.query(loginSql, username, function (error, row, field) {
        if (row && row[0]) {
            var user = row[0];
            if (password === user.password) {
                if (user.status == 0) return callback({rs: false, ms: '账号被禁用'});
                if (user.status == 1) return callback({rs: false, ms: '账号审批中'});
                if (user.status == 2) return callback({rs: false, ms: '审批未通过'});
                callback({rs: true, ms: user.id});
            } else callback({rs: false, ms: '密码错误'});
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
    if (username.length < 4 || username.length > 15) return callback({rs: false, ms: '用户名长度需在４到15之间'});
    if (!password)return callback({rs: false, ms: '密码不能为空'});
    if (password.length < 4 || password.length > 10)return callback({rs: false, ms: '密码长度需在４到10之间'});
    var checkSql = 'SELECT count(*) AS count FROM sys_user WHERE username = ?';
    db.pool.query(checkSql, username, function (error, row, field) {
        if (row && row[0] && row[0].count > 0) return callback({rs: false, ms: "账号已经存在"});// 账号重复
        var insertSql = 'INSERT INTO sys_user(username,password,cdate,status) values (?,?,?,?)';
        db.pool.query(insertSql, [username, password, date.now(), 1], function (error, result) {
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
 * 返回所有结果pdf的集的数据库毁掉处理函数
 * @param error
 * @param row
 * @param field
 */
function callbackForList(error, row, field) {
    if (row) {
        for (var i = 0; i < row.length; i++) row[i].json = JSON.parse(row[i].json);
        callbackForList.callback(row);
    } else callbackForList.callback([]);
}

/**
 * 返回可用的图书列表
 * @param categoryId
 * @param start
 * @param callback
 */
module.exports.listPdfByPid = function (categoryId, start, callback) {
    var selectSql = 'SELECT * FROM dic_pdf WHERE  dic_category_id = ? AND status = 1 LIMIT ?,10';
    callbackForList.callback = callback;
    db.pool.query(selectSql, [categoryId, start || 0], callbackForList);
};

/**
 * 搜索图书列表
 * @param searchText
 * @param start
 * @param callback
 */
module.exports.searchPdf = function (searchText, start, callback) {
    var selectSql = "SELECT * FROM dic_pdf WHERE name like ? OR `desc` like ? LIMIT ?,10";
    callbackForList.callback = callback;
    db.pool.query(selectSql, ['%' + searchText + '%', '%' + searchText + '%', start || 0], callbackForList);
};


/**
 * 返回分类列表
 */
module.exports.listCategory = function (callback) {
    var selectSql = 'SELECT * FROM dic_category WHERE status = 1';
    db.pool.query(selectSql, function (err, rows, feild) {
        console.log(JSON.stringify(rows));
        callback(rows);
    });
};