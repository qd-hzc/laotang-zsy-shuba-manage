/**
 * Created by fy on 15-10-4.
 */
'use strict';
let s = "hello";
function func(s) {
    if (s.includes('llo')) return 'pdf';
    else return 'img';
}
let xx = {
    name: 'hello',
    [/*s.includes("llo") ? 'pdf' : 'img'*/
        func(s)
        ]: (function () {
        return 1
    })()
};
console.log(xx);