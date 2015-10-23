/**
 * Created by fy on 15-10-5.
 */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require("babel/polyfill");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _prominence = require("prominence");

var _prominence2 = _interopRequireDefault(_prominence);

function sleep(timeout) {
    return regeneratorRuntime.async(function sleep$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                return context$1$0.abrupt('return', new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        resolve();
                    }, timeout);
                }));

            case 1:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

(function callee$0$0() {
    return regeneratorRuntime.async(function callee$0$0$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                console.log('Do some thing, ' + new Date());
                context$1$0.next = 3;
                return regeneratorRuntime.awrap(sleep(1000));

            case 3:
                console.log('Do other things, ' + new Date());

            case 4:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
})();

var filepath = '/home/fy/workspaces/laotang/laotang_zsy_sb_manage/PROCESS_ID';

// use Prominence Proxy
var text = (0, _prominence2['default'])(_fs2['default']).readFile(filepath, "utf-8")['catch'](console.error.bind(console));
console.log(text);

// not use a proxy
(0, _prominence2['default'])(_fs2['default'], "readFile", [filepath, "utf-8"]).then(function (text) {
    console.log(text);
})['catch'](console.error.bind(console));

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var fetchDoubanApi = function fetchDoubanApi() {
    return new Promise(function (resolve, reject) {
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

(function callee$0$0() {
    var result;
    return regeneratorRuntime.async(function callee$0$0$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                context$1$0.prev = 0;
                context$1$0.next = 3;
                return regeneratorRuntime.awrap(fetchDoubanApi());

            case 3:
                result = context$1$0.sent;

                console.log('---------------------------------->>\n', result);
                context$1$0.next = 10;
                break;

            case 7:
                context$1$0.prev = 7;
                context$1$0.t0 = context$1$0['catch'](0);

                console.log(context$1$0.t0);

            case 10:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this, [[0, 7]]);
})();
