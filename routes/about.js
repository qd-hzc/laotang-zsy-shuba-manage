/**
 * Created by fy on 15-9-4.
 * 关于模块
 */
'use strict';

var express = require('express');
var http = require('http');
var request = require('request-json');
var router = express.Router();

/**
 * 跳转到关于说明页面
 */
router.get('/', function (req, res, next) {
    res.render('about');
});

module.exports = router;