/**
 * Created by yinbin on 2015/7/29.
 */
var express = require('express');
var router = express.Router();

/**
 * 返回需下载pdf文件的列表，json格式
 */
router.get('/list', function (req, res, next) {

    res.send({});
});

module.exports = router;
