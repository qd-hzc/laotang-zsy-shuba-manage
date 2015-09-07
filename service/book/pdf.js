/**
 * Created by HZC on 2015/09/05.
 */
var sp = require('../../lib/pager/select-pager');
var db = require('../../config/db');
var fs = require('fs');
var dateFormat = require('date-format');
var PDF = require('../../lib/pdf');

/**
 *  pdf列表查询，带有分页
 */
function pdfList(req, res, next) {
    //var params = URL.parse(req.url, true).query;
    var selectSql = "SELECT * FROM (SELECT dc.id AS categoryId, dc.name AS categoryName, dp.* " +
        "FROM dic_pdf dp LEFT JOIN dic_category dc ON dp.dic_category_id = dc.id) AS t";

    var whereSql = " WHERE 1 = 1 \n";
    req.body.name && (whereSql += " AND name LIKE '%:name%' /*pdf名称*/");
    req.body.categoryId && (whereSql += " AND dic_category_id = :categoryId /*分类*/");
    req.body.status && (whereSql += " AND status = :status /*状态*/\n");
    req.body.beginDate && (whereSql += " AND (IFNULL(':beginDate', '') = '' OR cdate >= ':beginDate') /*开始时间*/\n");
    req.body.endDate && (whereSql += " AND (IFNULL(':endDate', '') = '' OR cdate <= ':endDate') /*结束时间*/");

    sp.selectPager(req, res, db, selectSql, whereSql);
}

/**
 * 更新状态，根据pdfｉｄ
 * @param id
 * @param status
 * @param callback
 */
function updateStatus(id, status, callback) {
    db.pool.query('UPDATE dic_pdf SET status = ? WHERE id = ?', [status, id], callback);
}

/**
 * 删除ｐｄｆ记录
 * @param id
 * @param callback
 */
function deletePdf(id,callback){
    db.pool.query('DELETE FROM dic_pdf WHERE id = ?', [id], callback);
}

/**
 * 移动文件,并将目录同步数据库
 * @param newObj
 * @param oldObj
 * @param callback
 * @private
 */
function _movePdfFile(newObj, oldObj, callback, progressCallback) {

    var id = newObj.id;
    var pdf = newObj.pdf;
    var img = newObj.img;
    var categoryId = newObj.categoryId;
    var name = newObj.name;
    var desc = newObj.desc;
    var status = newObj.status;

    categoryId || (categoryId = oldObj.categoryId);
    name || (name = oldObj.name);
    desc || (desc = oldObj.desc);
    status || (status = oldObj.desc);

    var newImgPath = img;
    if (typeof img == 'object') {
        newImgPath = img.destination + /*(new Date().getTime())*/ id + img.originalname;
        fs.renameSync(img.path, newImgPath);
    }

    var _cantContinue = false;
    var udate = dateFormat.asString('yyy-MM-dd HH:mm:ss', new Date());
    var newPdfPath = pdf;
    if (typeof pdf == 'object') {
        _cantContinue = true; //异步调用,则要防止updateDb的继续执行.

        newPdfPath = pdf.destination + /*(new Date().getTime())*/ id + pdf.originalname;
        fs.renameSync(pdf.path, newPdfPath);

        var fileName = pdf.originalname.substring(0, pdf.originalname.lastIndexOf('.'));
        var htmlFolder = pdf.destination + id + fileName;

        var folder = htmlFolder;
        if (newPdfPath != oldObj.html_dist) folder = 'public/' + oldObj.html_dist;

        if (fs.existsSync(folder)) {
            fs.readdirSync(folder).forEach(function (fileName) {
                fs.unlinkSync(folder + '/' + fileName);
            });
            fs.rmdirSync(folder);
        }
        fs.mkdirSync(htmlFolder);

        PDF.pdf2html(newPdfPath, htmlFolder, id + fileName + ".html", function () {
            var json = JSON.stringify(fs.readdirSync(htmlFolder));
            var sql = 'UPDATE dic_pdf SET html_dist = ?, html_name = ?, json = ?, name = ?, dic_category_id = ?, `desc` = ?, status = ?, pdf_path = ?, img_path = ?, udate = ? WHERE id = ?';
            db.pool.query(sql,
                [htmlFolder.substr(htmlFolder.indexOf("/") + 1), id + fileName + ".html", json, name, categoryId, desc, status,
                    newPdfPath.substr(newPdfPath.indexOf("/") + 1), newImgPath.substr(newImgPath.indexOf("/") + 1), udate, id],
                callback);
        }, function (error) {
            console.error(error);
        }, progressCallback);
    }

    if (_cantContinue)return;

    var sql = 'UPDATE dic_pdf SET name = ?, dic_category_id = ?, `desc` = ?, status = ?, pdf_path = ?, img_path = ?, udate = ? WHERE id = ?';
    db.pool.query(sql, [name, categoryId, desc, status, newPdfPath.replace('public/', ''), newImgPath.replace('public/', ''), udate, id], callback);
}

/**
 * 判断文件是否存在,如果存在则先删除,然后再调用移动文件方法
 * @param newObj
 * @param cb
 */
function isPdfFileExist(newObj, cb, progressCallback) {
    var id = newObj.id;
    var pdf = newObj.pdf;
    var img = newObj.img;

    var loadSql = 'SELECT * FROM dic_pdf WHERE id = ?';

    db.pool.query(loadSql, [id], function (err, row, field) {
        if (err)throw err;
        if (row && row[0]) {
            var oldPdfPath = row[0].pdf_path;
            var oldImgPath = row[0].img_path;

            if (pdf) try {
                fs.unlinkSync(oldPdfPath);
            } catch (e) {
            } else newObj.pdf = oldPdfPath;

            if (img) try {
                fs.unlinkSync(oldImgPath);
            } catch (e) {
            } else newObj.img = oldImgPath;

            _movePdfFile(newObj, row[0], cb, progressCallback);
        } else {
            _movePdfFile(newObj, row[0], cb, progressCallback);
        }
    });
}

/**
 * 根据id查询一条pdf数据
 * @param id
 * @param cb
 */
function loadPdf(id, cb) {
    db.pool.query('SELECT * FROM dic_pdf WHERE id = ?', [id], cb);
}


/**
 * 判断文件是否存在,如果存在则先删除,然后再调用移动文件方法
 * @param newObj
 * @param cb
 * @param progressCallback
 * @param errorCallback
 */
function addPdf(newObj, cb, progressCallback, errorCallback) {
    var pdf = newObj.pdf;
    var img = newObj.img;
    var categoryId = newObj.categoryId;
    var name = newObj.name;
    var desc = newObj.desc;
    var status = newObj.status;

    if (!categoryId) {
        errorCallback('categoryId', '分类不能为空!');
        return;
    }

    var udate = dateFormat.asString('yyy-MM-dd HH:mm:ss', new Date());
    var sql = 'INSERT INTO dic_pdf SET name = ?, dic_category_id = ?, `desc` = ?, status = ?, udate = ?, cdate=?';
    db.pool.query(sql, [name, categoryId, desc, status, udate,udate], insertCallback);

    /**
     * 插入之后保存pdf
     * @param err
     * @param result
     */
    function insertCallback(err, result) {
        var id = result.insertId;

        // 如果上传了img,则先重命名
        var newImgPath = img;
        if (typeof img == 'object') {
            newImgPath = img.destination + /*(new Date().getTime())*/ id + img.originalname;
            fs.renameSync(img.path, newImgPath);
        }

        var _cantContinue = false;

        // 如果上传你了pdf,则处理pdf
        var newPdfPath = pdf;
        if (typeof pdf == 'object') {
            _cantContinue = true; //异步调用,则要防止updateDb的继续执行.
            newPdfPath = pdf.destination + /*(new Date().getTime())*/ id + pdf.originalname;
            fs.renameSync(pdf.path, newPdfPath);

            // pdf 生成 html的目标文件夹的处理
            var fileName = pdf.originalname.substring(0, pdf.originalname.lastIndexOf('.'));
            var htmlFolder = pdf.destination + id + fileName;
            fs.mkdirSync(htmlFolder);

            // pdf 转换
            PDF.pdf2html(newPdfPath, htmlFolder, id + fileName + ".html", convertSuccess, function (error) {
                console.error(error);
            }, progressCallback);

            /**
             *  pdf转换成功后,保存数据库
             */
            function convertSuccess() {
                // 生成html/page下载列表的json形式
                var json = JSON.stringify(fs.readdirSync(htmlFolder));

                var sql = 'UPDATE dic_pdf SET html_dist = ?, html_name = ?, json = ?, name = ?, dic_category_id = ?, `desc` = ?, status = ?, pdf_path = ?, img_path = ?, udate = ? WHERE id = ? ';
                db.pool.query(sql,
                    [htmlFolder.substr(htmlFolder.indexOf("/") + 1), id + fileName + ".html", json, name, categoryId, desc, status,
                        newPdfPath.substr(newPdfPath.indexOf("/") + 1), newImgPath.substr(newImgPath.indexOf("/") + 1), udate, id],
                    cb);
            }
        }

        if (_cantContinue)return;

        var sql = 'UPDATE dic_pdf SET name = ?, dic_category_id = ?, `desc` = ?, status = ?, pdf_path = ?, img_path = ?, udate = ? WHERE id = ?';
        db.pool.query(sql, [name, categoryId, desc, status, newPdfPath.replace('public/', ''), newImgPath.replace('public/', ''), udate, id], cb);
    }

}


module.exports = {
    pdfList: pdfList,
    updateStatus: updateStatus,
    update: isPdfFileExist,
    add: addPdf,
    loadPdf: loadPdf,
    deletePdf:deletePdf
};
