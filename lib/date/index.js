/**
 * Created by fy on 15-9-7.
 */
'use strict';
var dateFormat = require('date-format');

exports.now = function () {
    return dateFormat.asString('yyyy-MM-dd HH:mm:ss', new Date())
};