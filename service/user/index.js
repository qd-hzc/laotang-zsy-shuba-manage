/**
 * Created by HZC on 2015/09/04.
 */
var parseXlsx = require('excel');
var dateFormat = require('date-format');
var fs = require('fs');
var sp = require('../../lib/pager/select-pager');
var db = require('../../config/db');
var date = require('../../lib/date');

/**
 *  用户查询列表，带有分页
 */
function userList(req, res, next) {
    //var params = URL.parse(req.url, true).query;
    var selectSql = "SELECT * FROM sys_user";

    var whereSql = " WHERE 1 = 1 \n";
    req.body.name && (whereSql += " AND name LIKE '%:name%' /*姓名*/");
    req.body.username && (whereSql += " AND username LIKE '%:username%' /*登陆名*/");
    req.body.status && (whereSql += " AND status = :status /*状态*/\n");
    req.body.beginDate && (whereSql += " AND (IFNULL(':beginDate', '') = '' OR cdate >= ':beginDate') /*开始时间*/\n");
    req.body.endDate && (whereSql += " AND (IFNULL(':endDate', '') = '' OR cdate <= ':endDate') /*结束时间*/");

    sp.selectPager(req, res, db, selectSql, whereSql);
}

/**
 * 更新状态，根据用户ｉｄ
 * @param id
 * @param status
 * @param callback
 */
function updateStatus(id, status, callback) {
    db.pool.query('UPDATE sys_user SET status = ? WHERE id = ?', [status, id], callback);
}

/**
 * 添加用户
 */
function add(user, callback) {
    var mydate = date.now();
    var insertSql = 'INSERT INTO `sys_user` ' +
        ' (`username`,`password`,`company`,`department`,`name`,`phone`,`status`,`cdate`,`udate`) ' +
        ' VALUES (?,?,?,?,?,?,?,?,?)';
    db.pool.query(insertSql, [user.username, user.password, user.company, user.department, user.name, user.phone, user.status, mydate, mydate], callback);
}

/**
 * 导入ｅｘｃｅｌ
 * @param password
 * @param excel
 * @param successCb
 * @param processCb
 * @param errorCb
 */
function importExcel(password, excel, successCb, processCb, errorCb) {
    var newExcelPath = excel.destination + excel.originalname;
    fs.renameSync(excel.path, newExcelPath);

    var udate = dateFormat.asString('yyy-MM-dd HH:mm:ss', new Date());
    var insertSql = 'INSERT INTO sys_user (username, password, company, department, name, phone, status, cdate, udate) values (?,?,?,?,?,?,?,?,?)';

    parseXlsx(newExcelPath, function (err, data) {

        var i = 0;
        var length = data.length;

        data.forEach(function (a) {
            if (i == 0) {
                i++;
                return;
            }
            a[1] = a[1] || password;
            a[6] = a[6] == '是' ? 1 : 0;
            a.push(udate);
            a.push(udate);
            console.log(a);

            db.pool.query(insertSql, a, function (err, result) {
                var ret = {
                    msg: '<span style=\'color:blue;\'>完成</span>:' + a.join(','),
                    current: i,
                    total: length
                };
                if (err) ret.msg = '<span style=\'color:red;\'>错误:</span>' + a.join(',');
                processCb(ret);

                i++;
                console.log(i, length);
                if (i == length) {
                    successCb();
                }
            });
        });
    });
}

module.exports = {
    userList: userList,
    updateStatus: updateStatus,
    add: add,
    importExcel: importExcel
};
