/**
 * Created by HZC on 2015/09/04.
 */
'use strict';
var dateFormat = require('date-format');
var fs = require('fs');
var dirWalker = require('../../lib/myfs/digui');
var AdmZip = require('adm-zip');
var co = require('co');
var thunkify = require('thunkify');
var EventProxy = require('eventproxy');
var sp = require('../../lib/pager/select-pager');
var db = require('../../config/db');
var date = require('../../lib/date');
var categoryService = require('../book/category');
var pdfService = require('../book/pdf');


var ep = new EventProxy();

/**
 * 模拟一个上传后对象结构
 * @param path
 */
function genUploadFileObj(path) {
    var f = fs.readFileSync(path);
    f.path = path;
    f.destination = path.substring(0, path.lastIndexOf('/') + 1);
    f.originalname = path.substring(path.lastIndexOf('/') + 1);
    return f;
}

/**
 * 转换ｐｄｆ为ｉｍｇ
 * @param path
 * @param itemCb
 * @param progressCb
 * @param finishCb
 */
function saveOrUpdate(path, itemCb, progressCb, finishCb) {

    let names = path.split('/');
    let categoryName = names[5];
    let bookName = names[6];
    let sourceType = path.substring(path.lastIndexOf('.'));
    var attr = sourceType == '.pdf' ? 'pdf' : 'img';

    let loadCategoryByName = thunkify(categoryService.loadByName);
    let loadPdfByName = thunkify(pdfService.loadByName);

    co(function *() {
        try {
            var categoryId = (yield loadCategoryByName(categoryName))[0][0].id;
        } catch (e) {
            itemCb(bookName, false);
            ep.emit('all_file_over');
            //console.log('444444444', categoryName, path)
            return false;
        }

        let newObj = {
            categoryId: categoryId,
            name: bookName,
            desc: '',
            status: 0
        };

        newObj[attr] = genUploadFileObj(path);

        let books = (yield loadPdfByName(bookName))[0];

        if (books.length > 0) newObj.id = books[0].id;
        //console.log(newObj);

        pdfService[books.length > 0 || attr == 'pdf' ? 'update' : 'add'](newObj, function (isError) {
            itemCb(bookName, !isError);
            ep.emit('all_file_over');
            //console.log('1111111111')
        }, function (ret) {
            progressCb(bookName, ret);
        }, function (err) {
            itemCb(bookName, false);
            ep.emit('all_file_over');
            //console.log('222222222')
        });

    }).catch(function (err) {
        itemCb(bookName, false);
        ep.emit('all_file_over');
        //console.log('333333333')
    }).then(function (data) {

    });
}

/**
 * 压缩文件后续的处理 <br/>
 * 　验证／解压／遍历／创建分类记录／转换ｐｄｆ到ｈｔｍｌ／创建ｐｄｆ记录
 */
module.exports.zipBiz = function (path, itemCb, progressCb, finishCb) {

    var zip = new AdmZip(path);
    //var zipEntries = zip.getEntries();
    //var allCount = 0;
    //var finishCount = 0;

    var fileName = "public/files/import/temp/" + path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
    zip.extractAllTo(fileName, true);

    var list = dirWalker.walk(fileName, 0);
    //console.log('#################' + list.length);

    var mycount = 0;
    ep.after('all_file_over', list.length, function () {
        //console.log('end---------------->');
        mycount++;
        setTimeout(function () {
            finishCb(true);
        }, 3000);
    });

    list.forEach(function (o) {
        if (o.path.indexOf('.jpg') == -1 || o.path.indexOf('.png') == -1 || o.path.indexOf('.jpeg') == -1) saveOrUpdate(o.path, itemCb, progressCb, finishCb);
    });

    var teri = setInterval(function () {
        if (mycount >= Math.floor(list.length / 2)) {
            clearInterval(teri);
            list.forEach(function (o) {
                if (o.path.indexOf('.pdf') != -1) saveOrUpdate(o.path, itemCb, progressCb, finishCb);
            });
        }
    }, 500);
};