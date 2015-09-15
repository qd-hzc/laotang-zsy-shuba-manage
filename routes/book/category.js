/**
 * Created by fy on 15-9-4.
 * 分类管理模块
 */
'use strict';

var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request-json');
var multer = require('multer');
var upload = multer({dest: 'public/files/img/'});
var fs = require('fs');
var db = require('../../config/db');
var utils = require('../../lib/utils.js');

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

/**
 * 添加分类方法
 */
router.post('/add', upload.fields([{name: 'file', maxCount: 1}]), function (req, res, next) {
    var name = req.body.name, status = req.body.status, file = null, files = req.files;

    if (!name || name.length < 3 || name.length > 20)
        return utils.jsonpAndEnd(res, 'parent.validate("name","图书名称长度须在3到20之间")');
    if (files['file'] && files['file'][0])file = files['file'][0];
    else return utils.jsonpAndEnd(res, 'parent.validate("img","必须上传封面图片")');

    categoryService.add(name, status, file, function (err, result) {
        console.log(err);
        res.send('<script>parent.addCategoryJsonp(' + result.insertId + ', true)</script>');
    });
});

/**
 * 根据id查询图书分类
 */
router.post('/update/pre', function (req, res, next) {
    var id = req.body.id;
    categoryService.load(id, function (error, row, field) {
        res.send(row[0]);
    });
});

/**
 * 更新图书分类
 */
var upload2 = multer({dest: 'public/files/img/'});
router.post('/update', upload2.fields([{name: 'file', maxCount: 1}]), function (req, res, next) {
    var params = req.body, newObj = {
        id: params.id,
        name: params.name,
        status: params.status
    };

    if (!newObj.name || newObj.name.length < 3 || newObj.name.length > 20)
        return utils.jsonpAndEnd(res, 'parent.validate("name","图书分类长度须在3到20之间")');

    var files = req.files;
    if (files['file'] && files['file'][0])newObj.img = files['file'][0];

    res.set('Content-Type', 'text/html');
    categoryService.update(newObj, function (err) {
        utils.jsonpAndEnd(res, 'parent.updateCallback(' + params.id + ',' + !err + ')');
    });
});


module.exports = router;