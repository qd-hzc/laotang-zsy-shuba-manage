/**
 * Created by fy on 15-12-22.
 */
'use strict';
var express = require('express');
var router = express.Router();
var fs = require('fs');
var utils = require('../../lib/utils');
var settingsService = require('../../service/settings/index');

router.get('/', function (req, res, next) {
    console.log('------->', settingsService.index());
    res.render('settings/index');
});

module.exports = router;
