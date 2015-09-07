/**
 * 用户注册登陆等
 */
'use strict';

var express = require('express');
var http = require('http');
var request = require('request-json');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('login');
});

router.post('/login', function (req, res, next) {
    var params = req.body;
    if (params.username == 'admin' && params.password == '123456') {
        res.render('index', {user: {username: params.username}});
    } else {
        res.render('login', {'msg': '用户名密码错误'});
    }
});

router.get('/logout', function (req, res, next) {
    res.redirect('/');
});

module.exports = router;
