/**
 * Created by HZC on 2015/09/04.
 */
var sp = require('../../lib/pager/select-pager');
var db = require('../../config/db');
/**
 *  图书分类，带有分页
 */
function categoryList(req, res, next) {
    //var params = URL.parse(req.url, true).query;
    var selectSql = "SELECT * FROM dic_category";

    var whereSql = " WHERE 1 = 1 \n";
    req.body.name && (whereSql += " AND name LIKE '%:name%' /*目录名称*/");
    req.body.status && (whereSql += " AND status = :status /*状态*/\n");
    req.body.beginDate && (whereSql += " AND (IFNULL(':beginDate', '') = '' OR cdate >= ':beginDate') /*开始时间*/\n");
    req.body.endDate && (whereSql += " AND (IFNULL(':endDate', '') = '' OR cdate <= ':endDate') /*结束时间*/");

    sp.selectPager(req, res, db, selectSql, whereSql);
}

/**
 * 更新状态，根据分类ｉｄ
 * @param id
 * @param status
 * @param callback
 */
function updateStatus(id, status, callback) {
    db.pool.query('UPDATE dic_category SET status = ? WHERE id = ?', [status, id], callback);
}

/**
 * 返回分类下拉框的数据
 */
function categoryListForSelect(cb) {
    var sql = 'SELECT * FROM dic_category WHERE status != 0';
    db.pool.query(sql, cb);
}

module.exports = {
    categoryList: categoryList,
    updateStatus: updateStatus,
    categoryListForSelect: categoryListForSelect
};
