/**
 * Created by fy on 15-9-4.
 * 分类管理模块
 */
'use strict';

var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request-json');
//var Uploader = require('express-uploader');
//var upload = require('express-upload');
var multer = require('multer');
var upload = multer({dest: 'public/files/img/'});
var fs = require('fs');
var db = require('../../config/db');


var categoryService = require('../../service/book/category');

/**
 * 分类管理列表
 */
router.get('/', function (req, res, next) {
    res.render('book/category');
});


/**
 * ａｊａｘ　查询分类管理分页列表
 */
router.route('/list').get(categoryService.categoryList).post(categoryService.categoryList);

/**
 * 根据ｉｄ，修改状态
 */
router.post('/update/status', function (req, res, next) {
    var categoryId = req.body.id;
    var status = req.body.status;
    if (!categoryId)return;
    categoryService.updateStatus(categoryId, status, function (err, result) {
        if (err) throw err;
        res.send({
            status: true
        });
    });
});

/**
 * 上传分类图片
 */
router.post('/upload/img', upload.fields([{name: 'file', maxCount: 1}]), function (req, res, next) {
    var id = req.body.id;
    var file = req.files['file'][0];

    function moveFile() {
        var newImgPath = file.destination + /*(new Date().getTime())*/ id + file.originalname;
        fs.rename(file.path, newImgPath,
            function (err) {
                if (err) throw err;
                var sql = 'UPDATE dic_category SET img_path = ? WHERE id = ?';
                db.pool.query(sql, [newImgPath.replace('public/', ''), id], function (err) {
                    res.send('<script>parent.uploadImgJsonp(' + id + ', "' + newImgPath + '", true)</script>');
                });
            });
    }

    var loadSql = 'SELECT img_path FROM dic_category WHERE id = ?';
    db.pool.query(loadSql, [id], function (err, row, field) {
        if (err)throw err;
        if (row && row[0]) {
            var oldImgPath = row[0].img_path;
            try {
                fs.unlinkSync(oldImgPath);
            } catch (e) {
            }
            moveFile();
        } else {
            moveFile();
        }
    });
});

module.exports = router;