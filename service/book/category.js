/**
 * Created by HZC on 2015/09/04.
 */
var sp = require('../../lib/pager/select-pager');
var db = require('../../config/db');
var dateFormat = require('date-format');
var pinyin = require('../../lib/pinyin');
var fs = require('fs');
var date = require('../../lib/date');

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

/**
 * 移动文件,并将目录同步数据库
 * @param newObj
 * @param oldObj
 * @param callback
 * @private
 * @param progressCallback
 */
function _moveImgFile(newObj, oldObj, callback, progressCallback) {
    var id = newObj.id;
    var img = newObj.img;
    var name = newObj.name;
    var status = newObj.status;

    name || (name = oldObj.name);
    status || (status = oldObj.desc);
    var newImgPath = img;
    if (typeof img === 'object') {
        newImgPath = pinyin.getPinYin(img.destination + /*(new Date().getTime())*/ id + img.originalname);
        fs.renameSync(img.path, newImgPath);
    } else {
        newImgPath = 'public/' + img;
    }

    var sql = 'UPDATE dic_category SET name = ?, status = ?, img_path = ?, udate = ? WHERE id = ?';
    db.pool.query(sql, [name, status, newImgPath.replace('public/', ''),
        dateFormat.asString('yyy-MM-dd HH:mm:ss', new Date()), id], callback);
}

/**
 * 判断文件是否存在,如果存在则先删除,然后再调用移动文件方法
 * @param newObj
 * @param cb
 * @param progressCallback
 */
function isImgFileExist(newObj, cb, progressCallback) {
    var id = newObj.id;
    var img = newObj.img;

    var loadSql = 'SELECT * FROM dic_category WHERE id = ?';
    db.pool.query(loadSql, [id], function (err, row, field) {
        if (err)throw err;
        if (row && row[0]) {

            var oldImgPath = row[0].img_path;
            if (img) try {
                fs.unlinkSync(oldImgPath);
            } catch (e) {
            } else newObj.img = oldImgPath;

            _moveImgFile(newObj, row[0], cb, progressCallback);
        } else {
            _moveImgFile(newObj, row[0], cb, progressCallback);
        }
    });
}

/**
 * 根据id查询一条分类
 * @param id
 * @param cb
 */
function load(id, cb) {
    db.pool.query('SELECT * FROM dic_category WHERE id = ?', [id], cb);
}

/**
 * 添加一个分类的方法
 * @param name
 * @param status
 * @param file
 * @param callback
 */
function add(name, status, file, callback) {

    function moveFile(id) {
        var newImgPath = pinyin.getPinYin(file.destination + /*(new Date().getTime())*/ id + file.originalname);
        fs.rename(file.path, newImgPath,
            function (err) {
                if (err) throw err;
                var sql = 'UPDATE dic_category SET img_path = ?, udate = ? WHERE id = ?';
                db.pool.query(sql, [newImgPath.replace('public/', ''), date.now(), id], callback);
            });
    }

    var udate = date.now();
    var insertSql = 'INSERT INTO dic_category (name, `status`, cdate, udate) VALUES (?,?,?,?)';
    db.pool.query(insertSql, [name, status, udate, udate], function (err, result) {
        moveFile(result.insertId);
    });
}

module.exports = {
    categoryList: categoryList,
    updateStatus: updateStatus,
    categoryListForSelect: categoryListForSelect,
    update: isImgFileExist,
    load: load,
    add: add
};
