/**
 * Created by fy on 15-9-4.
 */
'use strict';

var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: 'public/files/excel/'});
var userService = require('../../service/user/index');
var utils = require('../../lib/utils');

/**
 * 跳转到用户管理页面
 */
router.get('/', function (req, res, next) {
    res.render('user/list');
});

/**
 * 获取所有的裁判
 */
router.get('/getJudgment', function (req, res, next) {
    userService.selectAllJudgment(function (err, result) {
        console.log('------------------>', err, result);
        if (err)throw err;
        res.send(result);
    });
});


module.exports = router;
