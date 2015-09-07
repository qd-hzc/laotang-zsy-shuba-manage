/**
 * Created by fy on 15-9-4.
 */

'use strict';

var pdftohtml = require('pdftohtmljs');

/**
 * ＰＤＦ转换ＨＴＭＬ
 * @param pdf
 * @param dest
 * @param html
 * @param success
 * @param error
 * @param progress
 * @example pdf2html('scala-gailan.pdf', "test", "scala-gailan.html");
 */
function pdf2html(pdf, dest, html, success, error, progress) {
    var converter = new pdftohtml(pdf, html);

    converter.add_options([
        ' --process-outline 0',
        '--embed-outline 0',
        '--fit-width 968',
        '--split-pages 1',
        '--dest-dir ' + dest
    ]);

    // converter.preset('default');

    if (success == undefined || typeof success != 'function')success = function () {
        console.log("convertion done");
    };
    converter.success(success);

    if (error == undefined || typeof error != 'function')error = function (e) {
        console.log("conversion error: " + e);
    };
    converter.error(error);

    if (progress == undefined || typeof progress != 'function')progress = function (ret) {
        console.log((ret.current * 100.0) / ret.total + " %");
    };
    converter.progress(progress);

    converter.convert();

}

module.exports.pdf2html = pdf2html;
