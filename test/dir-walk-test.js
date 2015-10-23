/**
 * Created by fy on 15-10-8.
 */
'use strict';

var dirWalk = require('../lib/myfs/digui');

var list = dirWalk.walk('/home/fy/temp/zip-upload-template/zip', 0);

list.forEach(function (o) {
    if (o.floor == 3) {
        console.log('-----------');
        console.log(o.path);
    }
});


