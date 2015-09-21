/**
 * Created by fy on 15-9-4.
 */
'use strict';

var express = require('express');
var router = express.Router();
var userService = require('../../service/user/index');
var utils = require('../../lib/utils');

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


/**
 * 添加用户方法
 */
router.post('/add', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var name = req.body.name;
    var phone = req.body.phone;
    var company = req.body.company;
    var department = req.body.department;
    var status = req.body.status || 0;

    if (!username || username.length < 4 || username.length > 12)
        return utils.jsonpAndEnd(res, 'parent.validate("username","登陆账号长度须在4到12之间")');
    if (!password || password.length < 4 || password.length > 12)
        return utils.jsonpAndEnd(res, 'parent.validate("password","登陆密码长度须在4到12之间")');
    if (name && ( name.length < 2 || name.length > 20))
        return utils.jsonpAndEnd(res, 'parent.validate("name","真实长度须在2到20之间")');
    if (phone && ( phone.length != 11))
        return utils.jsonpAndEnd(res, 'parent.validate("phone","手机号长度须是11位")');
    if (company && ( company.length < 2 || company.length > 20))
        return utils.jsonpAndEnd(res, 'parent.validate("company","公司名称长度须在2到20之间")');
    if (department && ( department.length < 3 || department.length > 20))
        return utils.jsonpAndEnd(res, 'parent.validate("department","部门名称长度须在3到20之间")');

    userService.add({
        username: username,
        password: password,
        name: name,
        phone: phone,
        company: company,
        department: department,
        status: status
    }, function (err, result) {
        if (err && err.code == 'ER_DUP_ENTRY') {
            utils.jsonpAndEnd(res, 'parent.validate("username","登陆账号已经存在")');
        } else {
            res.send('<script>parent.addUserJsonp(' + result.insertId + ', true)</script>');
        }
    });
});


module.exports = router;
