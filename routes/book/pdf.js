/**
 * Created by fy on 15-9-4.
 * 图书管理模块
 */
'use strict';

var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request-json');
var multer = require('multer');
var db = require('../../config/db');
var utils = require('../../lib/utils.js');

var pdfService = require('../../service/book/pdf');
var categoryService = require('../../service/book/category');

/**
 * 图书管理列表
 */
router.get('/', function (req, res, next) {
    categoryService.categoryListForSelect(function (s_error, s_row, s_field) {
        res.render('book/pdf', {categoryOptions: s_row});
    });
});

/**
 * 修改pdf的图书分类select选择框
 */
router.post('/update/pre', function (req, res, next) {
    var id = req.body.id;
    categoryService.categoryListForSelect(function (s_error, s_row, s_field) {
        pdfService.loadPdf(id, function (error, row, field) {
            if (row && row[0]) row[0].optionList = s_row;
            res.send(row[0]);
        });
    });
});

/**
 * 修改pdf的图书分类select选择框
 */
router.post('/add/pre', function (req, res, next) {
    categoryService.categoryListForSelect(function (s_error, s_row, s_field) {
        res.send(s_row);
    });
});

/**
 * ａｊａｘ　查询图书管理分页列表
 */
router.route('/list').get(pdfService.pdfList).post(pdfService.pdfList);

/**
 * 根据ｉｄ，修改状态
 */
router.post('/update/status', function (req, res, next) {
    var pdfId = req.body.id;
    var status = req.body.status;
    if (!pdfId)return;
    pdfService.updateStatus(pdfId, status, function (err, result) {
        if (err) throw err;
        res.send({
            status: true
        });
    });
});

/**
 * 根据ｉｄ，删除ｐｄｆ
 */
router.post('/delete', function (req, res, next) {
    var pdfId = req.body.id;
    if (!pdfId)return;
    pdfService.deletePdf(pdfId, function (err, result) {
        if (err) throw err;
        res.send({
            status: true
        });
    });
});

/**
 * 更新上传pdf
 */
var upload = multer({dest: 'public/files/pdf/'});
router.post('/update',
    upload.fields([{name: 'pdf', maxCount: 1}, {name: 'img', maxCount: 1}]),
    function (req, res, next) {
        var params = req.body;

        var newObj = {
            id: params.id,
            categoryId: params.categoryId,
            name: params.name,
            desc: params.desc,
            status: params.status
        };

        //验证
        if (!newObj.name || newObj.name.length < 5 || newObj.name.length > 20)
            return utils.jsonpAndEnd(res, 'parent.validate("name","图书名称长度须在5到20之间")');
        if (!newObj.desc|| newObj.desc.length < 10 || newObj.desc.length > 100)
            return utils.jsonpAndEnd(res, 'parent.validate("desc","描述长度须在10到100之间")');

        var files = req.files;
        if (files['pdf'] && files['pdf'][0])newObj.pdf = files['pdf'][0];
        if (files['img'] && files['img'][0])newObj.img = files['img'][0];

        res.set('Content-Type', 'text/html');
        pdfService.update(newObj, function (err) {
            utils.jsonpAndEnd(res, 'parent.callback(' + params.id + ',' + !err + ')');
        }, function (ret) {
            var progress = Math.round((ret.current * 100.0) / ret.total) + "%";
            utils.jsonp(res, 'parent.updateProgress("' + progress + '")');
        });

    });

/**
 * 添加上传pdf
 */
var add = multer({dest: 'public/files/pdf/'});
router.post('/add',
    upload.fields([{name: 'pdf', maxCount: 1}, {name: 'img', maxCount: 1}]),
    function (req, res, next) {
        var params = req.body;

        var newObj = {
            categoryId: params.categoryId,
            name: params.name,
            desc: params.desc,
            status: params.status
        };

        //验证
        if (!newObj.name || newObj.name.length < 5 || newObj.name.length > 20)
            return utils.jsonpAndEnd(res, 'parent.validate("name","图书名称长度须在5到20之间")');
        if (!newObj.desc|| newObj.desc.length < 10 || newObj.desc.length > 100)
            return utils.jsonpAndEnd(res, 'parent.validate("desc","描述长度须在10到100之间")');

        var files = req.files;
        if (files['pdf'] && files['pdf'][0])newObj.pdf = files['pdf'][0];
        if (files['img'] && files['img'][0])newObj.img = files['img'][0];

        res.set('Content-Type', 'text/html');
        pdfService.add(newObj, function (err) {
            utils.jsonpAndEnd(res, 'parent.addCallback(' + !err + ')');
        }, function (ret) {
            var progress = Math.round((ret.current * 100.0) / ret.total) + "%";
            utils.jsonp(res, 'parent.addProgress("' + progress + '")');
        }, function (fieldName, message) {
            utils.jsonpAndEnd(res, 'parent.addValidator("' + fieldName + '","' + message + '")');
        });

    });

module.exports = router;