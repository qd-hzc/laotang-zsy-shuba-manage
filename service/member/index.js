/**
 * Created by fy on 15-12-25.
 */
'use strict';
var sp = require('../../lib/pager/select-pager');
var db = require('../../config/db');
var dateFormat = require('date-format');
var fs = require('fs');
var date = require('../../lib/date');
var _ = require('underscore');

/**
 *  图书分类，带有分页
 */
exports.list = function (req, res, next) {
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
 * 查询会员是否存在
 * @param memberCode
 * @param cb
 */
exports.checkUserExits = function (memberCode, cb) {
    db.pool.query('SELECT * FROM member WHERE code = ?', memberCode, cb);
};

/**
 * 在应用启动的时候或者在进入游戏之前，缓存在本地
 * @param cb
 */
exports.getAllMemberForCache = function (cb) {
    // todo 状态先不加上
    db.pool.query("SELECT concat(`code`,',', userName) as content FROM member", function (err, result) {
        cb(err, _.map(result, function (row) {
            return row.content;
        }));
    });
};

/**
 * 累加用户所得的积分
 * @param memberId
 * @param integration
 * @param cb
 */
exports.updateIntegration = function (memberId, integration, cb) {
    var updateSql = 'UPDATE member SET integration = integration + ? WHERE id = ?';
    db.pool.query(updateSql, [integration, memberId], cb);
};