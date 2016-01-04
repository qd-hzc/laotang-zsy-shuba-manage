/**
 * Created by fy on 15-12-22.
 */
'use strict';
var express = require('express');
var router = express.Router();
var fs = require('fs');
var utils = require('../../lib/utils');
var memberService = require('../../service/member/index');

/**
 * 会员管理列表
 */
router.get('/', function (req, res, next) {
    res.render('member/list');
});


/**
 * ａｊａｘ　查询管理分页列表
 */
router.route('/list').get(memberService.list).post(memberService.list);

/**
 * 返回所有会员
 */
router.post('/all', function (req, res, next) {
    memberService.getAllMemberForCache(function (err, result) {
        res.send(result);
    });
});



module.exports = router;
