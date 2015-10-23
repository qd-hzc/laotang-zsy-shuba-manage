/**
 * Created by fy on 15-9-29.
 */
'use strict';

// 解压1

var AdmZip = require('adm-zip');

// reading archives
//var zip = new AdmZip('/home/fy/Downloads/zip-upload-template-laotang.zip');

/*
 var zipEntries = zip.getEntries(); // an array of ZipEntry records
 zipEntries.forEach(function (zipEntry) {
 console.log(zipEntry.toString()); // outputs zip entries information
 if (zipEntry.entryName == "my_file.txt") {
 console.log(zipEntry.data.toString('utf8'));
 }
 });
 */

//zip.extractAllTo('/home/fy/Downloads/', true);


//加压2
var unzip = require('unzip');
var fs = require('fs');

fs.createReadStream('/home/fy/Downloads/zip-upload-template.zip')
    .pipe(unzip.Extract({path: '/home/fy/Downloads/'}))
    .on('close', function () {
        console.log('over');
    });
