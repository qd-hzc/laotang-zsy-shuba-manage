/**
 * Created by fy on 15-9-7.
 */
'use strict';

/**
 * 自己封装的jsonp方法,调用完毕后会关闭链接
 * 可以与上传文件同时提交搭配
 * @param res
 * @param script
 */
exports.jsonpAndEnd = function (res, script) {
    res.write('<script type="text/javascript">' + script + '</script>');
    res.end();
};

/**
 * 自己封装的json方法,调用完毕后不会关闭链接
 * 可以与上传文件同时提交搭配
 * @param res
 * @param script
 */
exports.jsonp = function (res, script) {
    res.write('<script type="text/javascript">' + script + '</script>');
};