/**
 * Created by fy on 15-9-7.
 */
'use strict';
var grid_selector = "#grid-table";
var pager_selector = "#grid-pager";
var search_form = '#search-form-id';
var _title = '分类管理';
var str = location.search;
var _url = BASE_URL + "book/category/list";
var _sortname = 'cdate';
var _sortorder = 'desc';
$('.date').datepicker();
var _postData = {};
var _colNames = ['分类名称', '分类图片', '状态', '创建日期', '修改日期', '操作'];
var _colModel = [
    {name: 'name', width: 80, index: 'name', align: "left", sortable: true},
    {name: 'img_path', width: 150, index: 'img_path', align: "left", sortable: true},
    {
        name: 'status', width: 80, index: 'status', align: "left", sortable: true,
        formatter: function (status) {
            if (status == 0) return "无效";
            if (status == 1) return "有效";
        }
    },
    {name: 'cdate', width: 100, index: 'cdate', align: "left", sortable: true, formatter: FORMAT.timeYMD},
    {name: 'udate', width: 100, index: 'udate', align: "left", sortable: true, formatter: FORMAT.timeYMD},
    {
        name: '操作', width: 150, index: '', sortable: false,
        formatter: function (value, options, row) {
            var categoryId = row.id;
            var status = row.status;

            var unused = '<a class="my-a-' + categoryId + '" onclick="updateCategoryStatus(this,' + categoryId + ',0);">使之失效</a>';
            var used = '<a class="my-a-' + categoryId + '" onclick="updateCategoryStatus(this,' + categoryId + ',1);">使之有效</a>';
            var photo = '<a class="my-a-' + categoryId + '" onclick="uploadImg(this,' + categoryId + ')">修改图片</a>';

            if (status == 0)return photo
                + '<span style="margin:0 10px;"></span>'
                + used;
            if (status == 1)return unused;
            return '';
        }
    }
];

/**
 * 更新分类状态
 */
function updateCategoryStatus(owner, id, status) {
    $.post('book/category/update/status', {id: id, status: status}, function (result) {
        var msg = '修改失败', color = 'red';
        if (result && result.status) msg = '修改成功', color = 'green';
        $(owner).parent().empty().append('<span style="color:' + color + ';">' + msg + '<span>');
        setTimeout(function () {
            jQuery(grid_selector).trigger('reloadGrid');
        }, 1000);
    });
}

/**
 *　上传图片方法
 */
function uploadImg(owner, id) {
    upload(owner, 'book/category/upload/img', id);
}

/**
 * 服务器上传图片成功后的ｊｓｏｎｐ回调函数
 */
function uploadImgJsonp(id, newImgPath, status) {
    window.__myDialog.modal('hide');
    var msg = '修改失败', color = 'red';
    if (status) msg = '修改成功', color = 'green';
    $('.my-a-' + id).parent().empty().append('<span style="color:' + color + ';">' + msg + '<span>');
    setTimeout(function () {
        jQuery(grid_selector).trigger('reloadGrid');
    }, 1000);
}


