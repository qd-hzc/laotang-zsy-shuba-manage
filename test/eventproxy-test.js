/**
 * Created by fy on 15-10-7.
 */
'use strict';
var fs = require('fs');
var EventProxy = require('eventproxy');
var ep = new EventProxy();

// ##############################################################################

ep.all('tpl', 'data', function (tpl, data) { // or ep.all(['tpl', 'data'], function (tpl, data) {})
    // 在所有指定的事件触发后，将会被调用执行
    // 参数对应各自的事件名
    console.log(tpl);
    console.log(data);
});

fs.readFile('test/eventproxy-test.js', 'utf-8', function (err, content) {
    ep.emit('tpl', content);
});

setTimeout(function () {
    ep.emit('data', 'hello event');
}, 10000);

// ##############################################################################

var files = [
    '/home/fy/workspaces/laotang/laotang_zsy_sb_manage/test/class-test.js',
    '/home/fy/workspaces/laotang/laotang_zsy_sb_manage/test/co-test.js',
    '/home/fy/workspaces/laotang/laotang_zsy_sb_manage/test/co-test2.js',
    '/home/fy/workspaces/laotang/laotang_zsy_sb_manage/test/es7-test.es7.js',
    '/home/fy/workspaces/laotang/laotang_zsy_sb_manage/test/es7-test.js',
    '/home/fy/workspaces/laotang/laotang_zsy_sb_manage/test/eventproxy-test.js',
    '/home/fy/workspaces/laotang/laotang_zsy_sb_manage/test/zip-test.js'
];

ep.after('got_file', files.length, function (list) {
    // 在所有文件的异步执行结束后将被执行
    // 所有文件的内容都存在list数组中
    console.log(list);
});

for (var i = 0; i < files.length; i++) {
    fs.readFile(files[i], 'utf-8', ep.done('got_file'));
    /* fs.readFile(files[i], 'utf-8', function (err, content) {
     ep.emit('got_file', content);
     }); */
    /*fs.readFile(files[i], 'utf-8', ep.group('got_file'));*/
}

// ##############################################################################

ep.tail('tpl', 'data', function (tpl, data) {
    // 在所有指定的事件触发后，将会被调用执行
    // 参数对应各自的事件名的最新数据
    console.log(tpl);
    console.log(data);
    console.log('----------------');
});

fs.readFile('test/eventproxy-test.js', 'utf-8', function (err, content) {
    ep.emit('tpl', content);
});

var inter = setInterval(function () {
    ep.emit('data', 'hello...');
}, 2000);

setTimeout(function () {
    clearInterval(inter);
}, 21000);
