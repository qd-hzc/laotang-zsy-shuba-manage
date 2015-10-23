/**
 * Created by fy on 15-10-5.
 */
'use strict';

import "babel/polyfill";

async function sleep(timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve();
        }, timeout);
    });
}

(async function () {
    console.log('Do some thing, ' + new Date());
    await sleep(1000);
    console.log('Do other things, ' + new Date());
})();


import fs from "fs";
import prominence from "prominence";

var filepath = '/home/fy/workspaces/laotang/laotang_zsy_sb_manage/PROCESS_ID';

// use Prominence Proxy
var text = prominence(fs).readFile(filepath, "utf-8").catch(console.error.bind(console));
console.log(text);

// not use a proxy
prominence(fs, "readFile", [filepath, "utf-8"]).then((text) => {
    console.log(text);
}).catch(console.error.bind(console));



var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var fetchDoubanApi = function () {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    var response;
                    try {
                        response = JSON.parse(xhr.responseText);
                    } catch (e) {
                        reject(e);
                    }
                    if (response) {
                        resolve(response, xhr.status, xhr);
                    }
                } else {
                    reject(xhr);
                }
            }
        };
        xhr.open('GET', 'https://api.douban.com/v2/user/aisk', true);
        xhr.setRequestHeader("Content-Type", "text/plain");
        var data = null;
        xhr.send(data);
    });
};

(async function () {
    try {
        let result = await fetchDoubanApi();
        console.log('---------------------------------->>\n', result);
    } catch (e) {
        console.log(e);
    }
})();