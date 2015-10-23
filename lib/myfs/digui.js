/**
 * Created by fy on 15-9-30.
 */
'use strict';

var co = require('co');
var thunkify = require('thunkify');
var fs = require('fs');

/*
 递归处理文件,文件夹
 path 路径
 floor 层数
 handleFile 文件,文件夹处理函数
 */
function syncWalk(path, floor, rett) {
    var ret = rett || [];
    floor++;
    var files = fs.readdirSync(path);
    files.forEach(function (item) {
        var tmpPath = path + '/' + item;
        var stats = fs.statSync(tmpPath);
        if (stats.isDirectory()) {
            syncWalk(tmpPath, floor, ret);
        } else {
            if (floor == 3) {
                ret.push({
                    floor: floor,
                    path: tmpPath
                });
            }
        }
    });
    return ret;
}

/*
 递归处理文件,文件夹
 path 路径
 floor 层数
 handleFile 文件,文件夹处理函数
 */
function walk(path, floor, handleFile) {
    handleFile(path, floor);
    floor++;
    fs.readdir(path, function (err, files) {
        if (err) {
            console.log('read dir error');
        } else {
            files.forEach(function (item) {
                var tmpPath = path + '/' + item;
                fs.stat(tmpPath, function (err1, stats) {
                    if (err1) {
                        console.log('stat error');
                    } else {
                        if (stats.isDirectory()) {
                            walk(tmpPath, floor, handleFile);
                        } else {
                            if (floor == 3) {
                                handleFile(tmpPath, floor);
                            }
                        }
                    }
                });
            });
        }
    });
}

/*syncWalk;*/
module.exports.walk = function (path, floor) {
    var ret = {};

    var list = syncWalk(path, floor, null);
    list.forEach(function (o) {
        var path = o.path;
        //console.log(path);
        var names = path.split('/');
        let bookName = names[6];
        var categoryName = names[5];
        let attr = path.substring(path.lastIndexOf('.')) == '.pdf' ? 'pdf' : 'img';
        //if (o.path.indexOf('.pdf') != -1) {
        if (typeof ret[bookName] != 'object')ret[bookName] = {};
        ret[bookName]['categoryName'] = categoryName;
        ret[bookName]['bookName'] = bookName;
        ret[bookName][attr] = path;
        //}
    });

    var xx = [];
    for (var item in ret) xx.push(ret[item]);

    return xx;
};
