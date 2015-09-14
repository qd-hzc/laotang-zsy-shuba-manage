/**
 * Created by fy on 15-9-13.
 */
'use strict';
var BASE_URL = 'http://localhost:3000/';
var BASE_URL = '';
var grid_selector = "#grid-table";
var pager_selector = "#grid-pager";
var search_form = '#search-form-id';
var _rowNum = 10;
var _height = 300;
var _title = '';
var _url = "";
var _postData = {};
/**
 * 生成HTML模板
 * @param {Object} templateStr ：模板
 * @param {Object} data
 */
function render(templateStr, data) {
    return templateStr.replace(/\{([\w\.]*)\}/g, function (str, key) {
        var keys = key.split("."),
            v = data[keys.shift()];
        for (var i = 0, l = keys.length; i < l; i++)
            v = v[keys[i]];
        return (typeof v !== "undefined" && v !== null) ? v : "";
    });
}