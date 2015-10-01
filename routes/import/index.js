/**
 * Created by fy on 15-9-30.
 */
'use strict';

var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var upload = multer({dest: 'public/files/import/'});
var categoryService = require('../../service/book/category');
var importService = require('../../service/import/index');
var utils = require('../../lib/utils');

/**
 * 跳转到批量导入管理页面
 */
router.get('/', function (req, res, next) {
    categoryService.categoryListForSelect(function (s_error, s_row, s_field) {
        res.render('import/list', {categoryOptions: s_row});
    });
});

/**
 * ｚｉｐ导入方法
 */
var upload = multer({dest: 'public/files/import/'});
router.post('/zip', upload.fields([{name: 'file', maxCount: 1}]), function (req, res, next) {
    res.setTimeout(24 * 60 * 60 * 60 * 1000);
    res.set('Content-Type', 'text/html');

    var files = req.files, zip = null;
    if (files['file'] && files['file'][0])zip = files['file'][0];
    else return utils.jsonpAndEnd(res, 'parent.validate("file","请选择压缩包！")');

    var newPath = zip.destination + zip.originalname;
    fs.rename(zip.path, newPath, function (err) {
        //res.sendStatus(!err ? 200 : 500);
        if (err)res.send(''); else res.send(newPath);
    });
});

/**
 * ｚｉｐ　验证／解压／遍历／创建分类记录／转换ｐｄｆ到ｈｔｍｌ／创建ｐｄｆ记录
 */
router.post('/zipAfter', function (req, res, next) {
    var path = req.body.path;
    console.log(path);
    importService.zipBiz(path, function (isOk) {
        utils.jsonpAndEnd(res, 'parent.callback(' + isOk + ')');
    }, function (ret) {
        var msg = ret.msg;
        var progress = Math.round((ret.current * 100.0) / ret.total) + "%";
        utils.jsonp(res, 'parent.showMessage("' + msg + '");parent.progress("' + progress + '");');
    });
});

module.exports = router;
