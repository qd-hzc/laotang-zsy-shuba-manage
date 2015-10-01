/**
 * Created by HZC on 2015/09/04.
 */
var parseXlsx = require('excel');
var dateFormat = require('date-format');
var fs = require('fs');
var dirWalker = require('../../lib/myfs/digui');
var AdmZip = require('adm-zip');
var sp = require('../../lib/pager/select-pager');
var db = require('../../config/db');
var date = require('../../lib/date');
var categoryService = require('../book/category');
var pdfService = require('../book/pdf');

/**
 * 压缩文件后续的处理 <br/>
 * 　验证／解压／遍历／创建分类记录／转换ｐｄｆ到ｈｔｍｌ／创建ｐｄｆ记录
 */
module.exports.zipBiz = function (path, successCb, progressCb) {
    var zip = new AdmZip(path);
    var zipEntries = zip.getEntries();
    // 验证
    zipEntries.forEach(function (zipEntry) {
        console.log(zipEntry);
    });

    var fileName = "public/files/import/temp/" + path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
    zip.extractAllTo(fileName, true);

    function handleFile(path, floor) {
        console.log(floor);
        var blankStr = '';
        for (var i = 0; i < floor; i++) {
            blankStr += '    ';
        }
        fs.stat(path, function (err1, stats) {
            if (err1) {
                console.log('stat error');
            } else {
                if (stats.isDirectory()) {
                    if (floor == 0) { // 第零层
                        console.log('0' + blankStr + path);
                    } else if (floor == 1) {//　第一层
                        console.log('1' + blankStr + path);
                    } else if (floor == 2) {//　第二层
                        console.log('2' + blankStr + path);
                    }
                } else {
                    if (floor == 3) {
                        console.log('3' + blankStr + path);

                        var lastIndex = path.lastIndexOf('/');
                        var categoryName = path.substring(lastIndex - 2, lastIndex - 1);
                        var bookName = path.substring(lastIndex - 1, lastIndex);

                        categoryService.loadByName(categoryName, function (err, rows, field) {
                            var categoryId = rows[0].id;
                            var newObj = {
                                categoryId: categoryId,
                                name: bookName,
                                desc: bookName,
                                status: 1
                            };
                        });

                    } else {
                        console.log('error');
                    }
                }
            }
        })
    }

    successCb(true);// TODO

    dirWalker.walk(fileName, 0, handleFile);
};