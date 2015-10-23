/**
 * Created by fy on 15-10-8.
 */
'use strict';
/**
 * 模拟一个上传后对象结构
 * @param path
 */
var fs = require('fs');

function genUploadFileObj(path) {
    var f = fs.readFileSync(path);
    f.destination = path.substring(0, path.lastIndexOf('/') + 1);
    f.originalname = path.substring(path.lastIndexOf('/') + 1);
    return f;
}

var ff = genUploadFileObj('/home/fy/workspaces/laotang/laotang_zsy_sb_manage/test/eventproxy-test.js');
console.log(ff.destination);
console.log(ff.originalname);