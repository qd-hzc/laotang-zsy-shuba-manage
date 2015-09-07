/**
 * Created by HZC on 2015/09/04.
 */
var sp = require('../../lib/pager/select-pager');
var db = require('../../config/db');
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

module.exports = {
    userList: userList,
    updateStatus: updateStatus
};
