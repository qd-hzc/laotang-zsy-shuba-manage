/**
 * Created by fy on 15-9-4.
 */
'use strict';

var express = require('express');
var router = express.Router();
var userService = require('../../service/user/index');

/**
 * 跳转到用户管理页面
 */
router.get('/', function (req, res, next) {
    res.render('user/list');
});

/**
 * ａｊａｘ　查询用户管理分页列表
 */
router.route('/list').get(userService.userList).post(userService.userList);

/**
 * 根据ｉｄ，修改状态
 */
router.post('/update/status', function (req, res, next) {
    var userId = req.body.userId;
    var status = req.body.status;
    if (!userId)return;
    userService.updateStatus(userId, status, function (err, result) {
        if (err) throw err;
        res.send({
            status: true
        });
    });
});

module.exports = router;
