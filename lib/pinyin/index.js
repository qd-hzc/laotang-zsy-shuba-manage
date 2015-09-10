/**
 * Created by fy on 15-9-10.
 */
'use strict';
var pinyin = require("pinyin");


/**
 * 返回中文的拼音
 * @param text
 */
exports.getPinYin = function (text){
    return pinyin(text, {
        style: pinyin.STYLE_NORMAL
    }).join('');
}