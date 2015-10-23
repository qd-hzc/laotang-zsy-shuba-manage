/**
 * Created by fy on 15-10-1.
 */
'use strict';

var co = require('co')
    , thunkify = require('thunkify');

var db = require('../config/db');
var categoryService = require('../service/book/category');


function device(p1, p2, callback) {
    if (p2 == 0) callback(new Error("错误"));
    var out = Math.round(Math.random() * 10) * 100;
    setTimeout(function () {
        callback(null, p1 / p2)
    }, 1 || out);
}

function plus(p1, p2, callback) {
    if (p2 == 0) callback(new Error("错误"));
    callback(null, p1 + p2)
}

[11, 22, 33].forEach(function (item) {
    device(item, 2, function (err, result) {
        //console.log(result);
        plus(2, result, function (err, rs) {
            console.log(rs);
        })
    });
});

console.log('测试１：------------------>');

var tdevice = thunkify(device);
var tplus = thunkify(plus);

[11, 22, 33].map(function (item) {
    return co(function *() {
        var d = yield tdevice(item, 2);
        var p = yield tplus(2, d);
        console.log(p);
        return p;
    });
}).forEach(function (x) {
    x.then(function (p) {
        console.log('--->' + p)
    });
});

co(function *() {
    var d = yield tdevice(3, 2);
    var p = yield tplus(2, d);
    console.log(p);
    return p;
}).then(function (r) {
    console.log('--->>' + r);
});

console.log('测试ｄｂ：------------------>');
let loadByName = thunkify(categoryService.loadByName);

co(function *() {
    var data = yield loadByName('国学');
    console.log(data[0][0].id);
    return data;
}).catch(function onerror(err) {
    // log any uncaught errors
    // co will not throw any errors you do not handle!!!
    // HANDLE ALL YOUR ERRORS!!!
    console.error(err.stack);
}).then(function (data) {
    console.log(data[0][0].id);
});
