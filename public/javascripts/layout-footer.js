/**
 * Created by fy on 15-9-14.
 */
'use strict';
/**
 * 弹出图片窗口，并且显示评论信息。
 */
function upload(owner, url, id) {
    var html = '<div class="row">' +
        '<iframe id="file_upload_iframe" name="file_upload_iframe" width="0" height="0" style="display: none;"></iframe>' +
        '<div class="col-md-12"> ' +
        '<form id="file_upload_form" class="form-horizontal" action="' + url + '" method="post" enctype="multipart/form-data" target="file_upload_iframe">' +
        '<div class="form-group"> ' +
        '<label class="col-md-3 control-label" for="name">请选择文件:</label> ' +
        '<div class="col-md-8"> ' +
        '<input type="file" name="file"  multiple="true" class="form-control input-md"> ' +
            //'<span class="help-block">Here goes your name</span>' +
        '</div> ' +
        '</div> ' +
        '<input type="hidden" name="id" value="' + id + '"/><br>' +
        '</div>' +
        '</form>' +
        '</div>' +
        '</div>';
    window.__myDialog = bootbox.dialog({
            //size: 'small',
            title: "文件上传对话框",
            message: html,
            buttons: {
                xx: {
                    label: "上传",
                    className: "btn-success",
                    callback: function () {
                        $('#file_upload_form').submit();
                        return false;
                    }
                }
            }
        }
    );
}

jQuery(function ($) {
    $(search_form).submit(function (evt) {
        var formData = $(this).serializeArray();
        var postData = {};
        for (var i = 0; i < formData.length; i++) {
            var f = formData[i];
            postData[f.name] = f.value;
        }
        jQuery(grid_selector).jqGrid('setGridParam', {
            datatype: 'json',
            postData: postData, //发送数据
            page: 1
        }).trigger("reloadGrid");
        evt.stopPropagation();
        evt.preventDefault();
        return false;
    });
    jQuery(grid_selector).jqGrid({
        //direction: "rtl",
        url: _url,
        postData: _postData,
        //autoWidth:false,
        //shrinkToFit: false,
        //            data: grid_data,
        datatype: "JSON",
        mtype: "POST",//提交方式
        height: _height,
        colNames: _colNames,
        sortname: _sortname,//默认排序列
        sortorder: _sortorder,//排序方式 asc desc
        //            colNames:['添加日期', '手机号码', '银行卡号','备注','操作'],
        colModel: _colModel,
        viewrecords: true,
        rowNum: _rowNum,
        rowList: [4, 8, 12],
        pager: pager_selector,
        altRows: true,
        //toppager: true,
        //            sortname: 'id',
        //            sortorder: 'desc',
        //            multiselect: true,
        //multikey: "ctrlKey",              控制checkbox
        multiboxonly: true,
        loadComplete: function (xhr) {
            //                console.log(JSON.stringify(xhr.rows));
            if (typeof _tuBiao === 'function')_tuBiao(xhr.rows);
            var table = this;
            setTimeout(function () {
                //                    styleCheckbox(table);
                updateActionIcons(table);
                updatePagerIcons(table);
                enableTooltips(table);
            }, 0);
        },
        editurl: $path_base + "/dummy.html",//nothing is saved
        caption: _title,
        autowidth: true
    });
    //navButtons
    jQuery(grid_selector).jqGrid('navGrid', pager_selector,
        { 	//navbar options
            edit: false,
            editicon: 'icon-pencil blue',
            add: false,
            addicon: 'icon-plus-sign purple',
            del: false,
            delicon: 'icon-trash red',
            search: false,
            searchicon: 'icon-search orange',
            refresh: false,
            refreshicon: 'icon-refresh green',
            view: false,
            viewicon: 'icon-zoom-in grey'
        },
        {
            //edit record form
            //closeAfterEdit: true,
            recreateForm: true,
            beforeShowForm: function (e) {
                var form = $(e[0]);
                form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
                style_edit_form(form);
            }
        },
        {
            //new record form
            closeAfterAdd: true,
            recreateForm: true,
            viewPagerButtons: false,
            beforeShowForm: function (e) {
                var form = $(e[0]);
                form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
                style_edit_form(form);
            }
        },
        {
            //delete record form
            recreateForm: true,
            beforeShowForm: function (e) {
                var form = $(e[0]);
                if (form.data('styled')) return false;
                form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
                style_delete_form(form);
                form.data('styled', true);
            },
            onClick: function (e) {
                alert(1);
            }
        },
        {
            //search form
            recreateForm: true,
            afterShowSearch: function (e) {
                var form = $(e[0]);
                form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
                style_search_form(form);
            },
            afterRedraw: function () {
                style_search_filters($(this));
            }
            ,
            multipleSearch: true
            /**
             multipleGroup:true,
             showQuery: true
             */
        },
        {
            //view record form
            recreateForm: true,
            beforeShowForm: function (e) {
                var form = $(e[0]);
                form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
            }
        }
    )
    function style_edit_form(form) {
        //enable datepicker on "sdate" field and switches for "stock" field
        form.find('input[name=sdate]').datepicker({format: 'yyyy-mm-dd', autoclose: true})
            .end().find('input[name=stock]')
            .addClass('ace ace-switch ace-switch-5').wrap('<label class="inline" />').after('<span class="lbl"></span>');
        //update buttons classes
        var buttons = form.next().find('.EditButton .fm-button');
        buttons.addClass('btn btn-sm').find('[class*="-icon"]').remove();//ui-icon, s-icon
        buttons.eq(0).addClass('btn-primary').prepend('<i class="icon-ok"></i>');
        buttons.eq(1).prepend('<i class="icon-remove"></i>')
        buttons = form.next().find('.navButton a');
        buttons.find('.ui-icon').remove();
        buttons.eq(0).append('<i class="icon-chevron-left"></i>');
        buttons.eq(1).append('<i class="icon-chevron-right"></i>');
    }

    function style_delete_form(form) {
        var buttons = form.next().find('.EditButton .fm-button');
        buttons.addClass('btn btn-sm').find('[class*="-icon"]').remove();//ui-icon, s-icon
        buttons.eq(0).addClass('btn-danger').prepend('<i class="icon-trash"></i>');
        buttons.eq(1).prepend('<i class="icon-remove"></i>')
    }

    function style_search_filters(form) {
        form.find('.delete-rule').val('X');
        form.find('.add-rule').addClass('btn btn-xs btn-primary');
        form.find('.add-group').addClass('btn btn-xs btn-success');
        form.find('.delete-group').addClass('btn btn-xs btn-danger');
    }

    function style_search_form(form) {
        var dialog = form.closest('.ui-jqdialog');
        var buttons = dialog.find('.EditTable')
        buttons.find('.EditButton a[id*="_reset"]').addClass('btn btn-sm btn-info').find('.ui-icon').attr('class', 'icon-retweet');
        buttons.find('.EditButton a[id*="_query"]').addClass('btn btn-sm btn-inverse').find('.ui-icon').attr('class', 'icon-comment-alt');
        buttons.find('.EditButton a[id*="_search"]').addClass('btn btn-sm btn-purple').find('.ui-icon').attr('class', 'icon-search');
    }

    function beforeDeleteCallback(e) {
        var form = $(e[0]);
        if (form.data('styled')) return false;
        form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
        style_delete_form(form);
        form.data('styled', true);
    }

    function beforeEditCallback(e) {
        var form = $(e[0]);
        form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
        style_edit_form(form);
    }

    //it causes some flicker when reloading or navigating grid
    //it may be possible to have some custom formatter to do this as the grid is being created to prevent this
    //or go back to default browser checkbox styles for the grid
    function styleCheckbox(table) {
        /**
         $(table).find('input:checkbox').addClass('ace')
         .wrap('<label />')
         .after('<span class="lbl align-top" />')
         $('.ui-jqgrid-labels th[id*="_cb"]:first-child')
         .find('input.cbox[type=checkbox]').addClass('ace')
         .wrap('<label />').after('<span class="lbl align-top" />');
         */
    }

    //unlike navButtons icons, action icons in rows seem to be hard-coded
    //you can change them like this in here if you want
    function updateActionIcons(table) {

    }

    //replace icons with FontAwesome icons like above
    function updatePagerIcons(table) {
        var replacement =
        {
            'ui-icon-seek-first': 'icon-double-angle-left bigger-140',
            'ui-icon-seek-prev': 'icon-angle-left bigger-140',
            'ui-icon-seek-next': 'icon-angle-right bigger-140',
            'ui-icon-seek-end': 'icon-double-angle-right bigger-140'
        };
        $('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function () {
            var icon = $(this);
            var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
            if ($class in replacement) icon.attr('class', 'ui-icon ' + replacement[$class]);
        })
    }

    function enableTooltips(table) {
        $('.navtable .ui-pg-button').tooltip({container: 'body'});
        $(table).find('.ui-pg-div').tooltip({container: 'body'});
    }

    //var selr = jQuery(grid_selector).jqGrid('getGridParam','selrow');
});
/**
 *获取年度的值
 **/
function getPeriodTime(jqId) {
    $.get(BASE_URL + 'dudao/getPeriodTime', function (data) {
        var html = '';
        html += '<option value="' + "" + '" selected>所有年度</option>';
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            if (row.isCurrent.data[0]) {
                html += '<option value="' + row.NAME + '" selected>' + row.NAME + '</option>';
            } else {
                html += '<option value="' + row.NAME + '">' + row.NAME + '</option>';
            }
        }
        $(jqId).html(html);
    });
}

