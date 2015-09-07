/**
 * Created by fy on 15-9-8.
 */
'use strict';
var grid_selector = "#grid-table";
var pager_selector = "#grid-pager";
var search_form = '#search-form-id';
var _title = '用户管理';
var str = location.search;
var _url = BASE_URL + "user/list";
var _sortname = 'cdate';
var _sortorder = 'desc';
$('.date').datepicker();
var _postData = {};
/*`id`, `username`, `password`, `company`, `department`, `name`, `phone`, `status`, `cdate`, `udate`*/
var _colNames = ['登陆名', '创建日期', '修改日期', '状态', '真实姓名', '手机号', '公司', '部门', '操作'];
var _colModel = [
    {name: 'username', width: 80, index: 'username', align: "left", sortable: true},
    //        formatter: function (cellvalue, options, rowObject) {
    {name: 'cdate', width: 120, index: 'cdate', align: "left", sortable: true, formatter: FORMAT.timeYMDHMS},
    {name: 'udate', width: 120, index: 'udate', align: "left", sortable: true, formatter: FORMAT.timeYMDHMS},
    {
        name: 'status', width: 80, index: 'status', align: "left", sortable: true,
        formatter: function (status) {
            //0：失效，１：注册中，２：审批拒绝，３：有效
            if (status == 0) return "无效用户";
            if (status == 1) return "注册申请中";
            if (status == 2) return "审批未通过";
            if (status == 3) return "有效用户";
        }
    },
    {name: 'name', width: 80, index: 'name', align: "left", sortable: true},
    {name: 'phone', width: 100, index: 'phone', align: "left", sortable: true},
    {name: 'company', width: 120, index: 'company', align: "left", sortable: true},
    {name: 'department', width: 120, index: 'department', align: "left", sortable: true},
    {
        name: '操作', width: 150, index: '', sortable: false,
        formatter: function (value, options, row) {
            var userId = row.id;
            var unused = '<a onclick="updateUserStatus(this,' + userId + ',0);">使之失效</a>';
            var used = '<a onclick="updateUserStatus(this,' + userId + ',3);">使之有效</a>';
            var status = row.status;
            if (status == 0)return used;
            if (status == 1)return '<a onclick="updateUserStatus(this,' + userId + ',3);">通过</a>'
                + '<span style="margin:0 10px;"></span>'
                + '<a onclick="updateUserStatus(this,' + userId + ',2);">未通过</a>';
            if (status == 2)return '<a onclick="updateUserStatus(this,' + userId + ',3);">通过</a>'
                + '<span style="margin:0 10px;"></span>'
                + unused;
            if (status == 3)return unused;
            return '';
        }
    }
];

function updateUserStatus(owner, userId, status) {
    $.post('user/update/status', {userId: userId, status: status}, function (result) {
        var msg = '修改失败', color = 'red';
        if (result && result.status) msg = '修改成功', color = 'green';
        $(owner).parent().empty().append('<span style="color:' + color + ';">' + msg + '<span>');
        setTimeout(function () {
            jQuery(grid_selector).trigger("reloadGrid");
        }, 1000);
    });
}


