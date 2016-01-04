/**
 * Created by HZC on 2015/09/04.
 */
var dateFormat = require('date-format');
var fs = require('fs');
var sp = require('../../lib/pager/select-pager');
var db = require('../../config/db');
var date = require('../../lib/date');

/**
 * 查询所有裁判或者收银员
 * @param roleName
 * @param cb
 */
exports.selectUserByRole = function (roleName, cb) {
    db.pool.query('SELECT * FROM user WHERE roleName = ?', roleName, cb);
};

exports.selectAllJudgment = function (cb) {
    this.selectUserByRole('裁判', cb);
};