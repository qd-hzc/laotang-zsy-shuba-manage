/**
 * Created by fy on 15-10-1.
 */
'use strict';
var co = require('co')
    , thunkify = require('thunkify');

function device(p1, p2, callback) {
    if (p2 == 0) callback(new Error("错误"));
    var out = Math.round(Math.random() * 10) * 100;
    setTimeout(function () {
        callback(null, p1 / p2)
    }, out);
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

var tdevice = thunkify(device);
var tplus = thunkify(plus);
co(function *() {
    var d = yield tdevice(1, 2);
    var p = yield tplus(2, d);
})();