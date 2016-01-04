/**
 * Created by fy on 15-9-10.
 */
'use strict';
//var pinyin = require("pinyin");
var uuid = require('node-uuid');


/**
 * 返回中文的拼音
 * @param text
 */
exports.getPinYin = function (text) {
    return uuid.v1();
    //return uuid(text, {
    //    style: pinyin.STYLE_NORMAL
    //}).join('-');
};