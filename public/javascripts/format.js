/**
 * Created by yinbin on 2015/7/29.
 */
var FORMAT = {};

/**
 * 性别格式化
 */
FORMAT.xingBie = function () {
    var value = arguments[0];
    if (value === 1) {
        return '男';
    } else if (value === 2) {
        return '女';
    } else {
        return '';
    }
};

/**
 * 格式化时间  yyyy-MM-dd HH:mm:ss HH:mm:ss
 */
//Date.prototype.format = function (format) {
//    var o = {
//        "M+": this.getMonth() + 1, //month
//        "d+": this.getDate(), //day
//        "h+": this.getHours(), //hour
//        "m+": this.getMinutes(), //minute
//        "s+": this.getSeconds(), //second
//        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
//        "S": this.getMilliseconds() //millisecond
//    }
//
//    if (/(y+)/.test(format)) {
//        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
//    }
//
//    for (var k in o) {
//        if (new RegExp("(" + k + ")").test(format)) {
//            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
//        }
//    }
//    return format;
//}

function _my_prarse_date(ds) {
    var d = new Date(Date.parse(ds));
    return {
        y: d.getFullYear(),
        M: d.getMonth() + 1, //month
        d: d.getDate(), //day
        h: d.getHours(), //hour
        m: d.getMinutes(), //minute
        s: d.getSeconds(), //second
        q: Math.floor((d.getMonth() + 3) / 3), //quarter
        S: d.getMilliseconds() //millisecond
    };
}
/**
 * 格式化时间  yyyy-MM-dd HH:mm:ss
 */
FORMAT.timeYMDHMS = function () {
    var value = arguments[0];
    if (value) {
        var d = _my_prarse_date(value);
        var mouS = d.M;
        if (mouS < 10) mouS = '0' + mouS;
        var dayS = d.d;
        if (dayS < 10)  dayS = '0' + dayS;
        var hourS = d.h;
        if (hourS < 10)  hourS = '0' + hourS;
        var minS = d.m;
        if (minS < 10)  minS = '0' + minS;
        var sS = d.s;
        if (sS < 10)  sS = '0' + sS;
        return d.y + '-' + mouS + '-' + dayS + ' ' + hourS + ':' + minS + ':' + sS;
    } else {
        return "";
    }
};
/**
 * 格式化时间  yyyy-MM-dd
 */
FORMAT.timeYMD = function () {
    var value = arguments[0];
    if (value) {
        var d = _my_prarse_date(value);
        var mouS = d.M;
        if (mouS < 10) mouS = '0' + mouS;
        var dayS = d.d;
        if (dayS < 10)  dayS = '0' + dayS;
        return d.y + '-' + mouS + '-' + dayS;
    } else {
        return "";
    }
};

/**
 * 格式化时间  HH:mm:ss
 */
FORMAT.timeHMS = function () {
    var value = arguments[0];
    if (value) {
        var d = _my_prarse_date(value);
        var hourS = d.h;
        if (hourS < 10)  hourS = '0' + hourS;
        var minS = d.m;
        if (minS < 10)  minS = '0' + minS;
        var sS = d.s;
        if (sS < 10)  sS = '0' + sS;
        return hourS + ':' + minS + ':' + sS;
    } else {
        return "";
    }
};
/**
 * 格式化时间  HH:mm
 */
FORMAT.timeHM = function () {
    var value = arguments[0];
    if (value) {
        var d = _my_prarse_date(value);
        var hourS = d.h;
        if (hourS < 10)  hourS = '0' + hourS;
        var minS = d.m;
        if (minS < 10)  minS = '0' + minS;
        return hourS + ':' + minS;
    } else {
        return "";
    }
};
/**
 *  姓名空格式化
 */
FORMAT.xingming = function () {
    var value = arguments[0];
    if (value) {
        return value;
    } else {
        return '';
    }
};
/**
 * 百分数格式化  0.0%
 */
FORMAT.baiFen = function () {
    var value = arguments[0];
    if (value) {//Math.round(num*100)/100
        return Math.round(value * 10000)/100 + '%';
    } else {
        return "0%";
    }
};
/**
 * 课时格式化  课时
 */
FORMAT.ks = function () {
    var value = arguments[0];
    if (value) {
        return value + '课时';
    } else {
        return "";
    }
};
/**
 * 线上课时格式化
 */
FORMAT.xsks = function () {
    var value = arguments[0];
    var row = arguments[2];
    if (value) {
        if(row.learnType == '线上'){
            var t;
            if(value > -1){
                hour = Math.floor(value/3600);
                min = Math.floor(value/60) % 60;
                sec = value % 60;
                day = parseInt(hour / 24);
                if (day > 0) {
                    hour = hour - 24 * day;
                    t = day + "天 " + hour + "小时";
                } else if (hour>0){
                    t = hour + "小时";
                }else {
                    t='';
                }
                //if(min < 10){t += "0";}
                t += min + "分钟";
                //if(sec < 10){t += "0";}
                //t += sec;
            }
            return t;
        }else{
            return value + '小时';
        }
    } else {
        return "";
    }
};
/**
 * 小时格式化  小时
 */
FORMAT.xs = function () {
    var value = arguments[0];
    if (value) {
        return value + '小时';
    } else {
        return "";
    }
};
/**
 * 课时期次格式化  期
 */
FORMAT.qc = function () {
    var value = arguments[0];
    if (value) {
        return '第' + value + '期';
    } else {
        return "";
    }
};

/**
 * 编号格式化  号
 */
FORMAT.bh = function () {
    var value = arguments[0];
    if (value) {
        return value + '号';
    } else {
        return "";
    }
};

/**
 * 次数格式化  次
 */
FORMAT.cs = function () {
    var value = arguments[0];
    if (value) {
        return value + '次';
    } else {
        return "0次";
    }
};
/**
 * 分类格式化  类
 */
FORMAT.fl = function () {
    var value = arguments[0];
    if (value) {
        return value + '号';
    } else {
        return "";
    }
};
/**
 * 人数格式化  人
 */
FORMAT.people = function () {
    var value = arguments[0];
    if (value) {
        return value + '人';
    } else {
        return "0人";
    }
};
/**
 * 人数格式化  期
 */
FORMAT.qi = function () {
    var value = arguments[0];
    if (value) {
        return value;
    } else {
        return "0";
    }
};
/**
 * 签到签入状态
 */
FORMAT.IsLate = function () {
    var value = arguments[0];
    if (value==1) {
        return '<span class="label label-danger">迟到</span>';
    } else {
        return '<span class="label label-success">正常</span>';
    }
};
/**
 * 签到签出状态
 */
FORMAT.IsLeaveEarly = function () {
    var value = arguments[0];
    if (value==1) {
        return '<span class="label label-warning">早退</span>';
    } else {
        return '<span class="label label-success">正常</span>';
    }
};
FORMAT.IsLeaveEarlyState = function (x, c, rowObject) {//CheckInTime
    var IsLeaveEarly = rowObject.IsLeaveEarly,CheckInTime=rowObject.CheckInTime,CheckOutTime=rowObject.CheckOutTime;
    if(CheckOutTime){
        if (IsLeaveEarly == 1) {
            return '<span class="label label-warning">早退</span>';
        }
        else if(IsLeaveEarly == 0){
            return '<span class="label label-primary">正常</span>';
        }
    }else {
        if(CheckInTime){
            return '<span class="label label-grey">未打卡</span>';
        }else{
            return '<span class="label label-success">缺勤</span>';
        }
    }
};
FORMAT.IsLateState = function (x, c, rowObject) {//CheckInTime
    var IsLater = rowObject.IsLate,CheckInTime=rowObject.CheckInTime,CheckOutTime=rowObject.CheckOutTime;
    if(CheckInTime){
        if (IsLater == 1) {
            return '<span class="label label-danger">迟到</span>';
        }
        else if(IsLater == 0){
            return '<span class="label label-primary">正常</span>';
        }
    }else {
        if(CheckOutTime){
            return '<span class="label label-grey">未打卡</span>';
        }else{
            return '<span class="label label-success">缺勤</span>';
        }
    }
};


FORMAT.isChiDao = function () {
    var v = arguments[0];
    var row = arguments[2];
    var checkInTime = row.CheckInTime;
    //if (!checkInTime) {
    //    return '';
    //}
    if (parseInt(v) == 1) {
        return '<span class="label label-danger">迟到</span>';
    } else if(parseInt(v) == 3){
        return '<span class="label label-grey">未打卡</span>';
    } else{
        return '';
    }
};
FORMAT.isZaoTui = function () {
    var row = arguments[2];
    var checkOutTime = row.CheckOutTime;
    //if (!checkOutTime) {
    //    return '';
    //}
    var v = arguments[0];
    if (parseInt(v) == 1) {
        return '<span class="label label-warning">早退</span>';
    }else if(parseInt(v) == 3){
        return '<span class="label label-grey">未打卡</span>';
    }
    return '';

};
FORMAT.isQueQin = function () {
    /*var row = arguments[2];
    var checkInTime = row.CheckInTime;
    var checkOutTime = row.CheckOutTime;
    console.log(checkInTime,checkOutTime);
    if (checkInTime ||  checkOutTime) {
        return '';
    }
    return '缺勤';*/
    var v = arguments[0];
    if (parseInt(v) == 1) {
        return '<span class="label label-success">缺勤</span>';
    }else if(parseInt(v) == 3){
        return '<span class="label label-grey">未打卡</span>';
    }
    return '';
};
