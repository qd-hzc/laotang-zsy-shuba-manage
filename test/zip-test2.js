/**
 * Created by fy on 15-10-13.
 */
'use strict';
var fs = require("fs");
var zlib = require("zlib");
var Hzip = require("hzip");

var path = '/home/fy/Downloads/zip-upload-template-laotang.zip';
var hzip = new Hzip(fs.readFileSync(path), "GBK");

//替换或增加文件
var entry = hzip.getEntries();
hzip.entries.forEach(function (d) {
    console.log(d.fileName, d.cfile)
});

