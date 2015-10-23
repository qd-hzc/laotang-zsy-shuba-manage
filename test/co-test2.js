/**
 * Created by fy on 15-10-1.
 */
'use strict';

var co = require('co')
    , thunkify = require('thunkify');


function testFunc(p1, p2, cb) {
    setTimeout(function () {
        clearInterval(itr);
    }, 300);
    var itr = setInterval(function () {
        cb(null, p1 + p2);
    }, 80);
}

var _testFunc = thunkify(testFunc);

co(function *() {
    var r1 = yield _testFunc(3, 2);
    return r1;
}).then(function (result) {
    console.log(result);
});
