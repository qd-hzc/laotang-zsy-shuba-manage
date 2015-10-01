/**
 * Created by fy on 15-9-29.
 */
'use strict';

var AdmZip = require('adm-zip');

// reading archives
var zip = new AdmZip("/home/fy/temp/test-zip-upload.zip");

/*
var zipEntries = zip.getEntries(); // an array of ZipEntry records

zipEntries.forEach(function (zipEntry) {
    console.log(zipEntry.toString()); // outputs zip entries information
    if (zipEntry.entryName == "my_file.txt") {
        console.log(zipEntry.data.toString('utf8'));
    }
});
*/

zip.extractAllTo("/home/fy/", true);


