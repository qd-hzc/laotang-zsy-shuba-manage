/**
 * Created by fy on 15-9-8.
 */
(function (W) {
    W.userPageInit = function () {

        W.grid_selector = "#grid-table";
        W.pager_selector = "#grid-pager";
        W.search_form = '#search-form-id';
        W._title = '用户管理';
        W.str = location.search;
        W._url = BASE_URL + "user/list";
        W._sortname = 'cdate';
        W._sortorder = 'desc';
        $('.date').datepicker();
        W._postData = {};
        /*`id`, `username`, `password`, `company`, `department`, `name`, `phone`, `status`, `cdate`, `udate`*/
        W._colNames = ['登陆名', '创建日期', '修改日期', '状态', '真实姓名', '手机号', '公司', '部门', '操作'];
        W._colModel = [
            {name: 'username', width: 80, index: 'username', align: "left", sortable: true},
            //        formatter: function (cellvalue, options, rowObject) {
            {
                name: 'cdate',
                width: 120,
                index: 'cdate',
                align: "left",
                sortable: true,
                formatter: FORMAT.timeYMDHMS
            },
            {
                name: 'udate',
                width: 120,
                index: 'udate',
                align: "left",
                sortable: true,
                formatter: FORMAT.timeYMDHMS
            },
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

        W.updateUserStatus = function (owner, userId, status) {
            $.post('user/update/status', {userId: userId, status: status}, function (result) {
                var msg = '修改失败', color = 'red';
                if (result && result.status) msg = '修改成功', color = 'green';
                $(owner).parent().empty().append('<span style="color:' + color + ';">' + msg + '<span>');
                setTimeout(function () {
                    jQuery(grid_selector).trigger("reloadGrid");
                }, 1000);
            });
        };


        /**
         * @name 提交的请求的key的名称
         * @message 错误消息
         */
        W.validate = function (name, message) {
            $.gritter.add({
                title: message,
                class_name: 'gritter-info gritter-center'
            });
            setTimeout(function () {
                $('.my-add-btn-id,.my-update-btn-id').show();
                $.gritter.removeAll();
                $('input[name="' + name + '"],textarea[name="' + name + '"]').focus();
            }, 2000);
        };

        /**
         * 添加用户
         */
        W.addUser = function (onwer, id) {
            var addUrl = 'user/add'; // 添加请求
            var html = '<div class="row" style="margin: 0px;padding:0px;">' +
                '<iframe id="file_upload_iframe" name="file_upload_iframe" width="0" height="0" style="display: none;"></iframe>' +
                '<div class="col-md-12"> ' +
                '<form id="file_upload_form" class="form-horizontal" action="' + addUrl + '" method="post" target="file_upload_iframe">';

            html += '<div class="form-group"> ' +
            '<label class="col-md-3 control-label" for="username">登陆账号:</label> ' +
            '<div class="col-md-8"> ' +
            '<input type="text" name="username" class="form-control input-md" value=""> ' +
            '</div> ' +
            '</div> ';

            html += '<div class="form-group"> ' +
            '<label class="col-md-3 control-label" for="password">登陆密码:</label> ' +
            '<div class="col-md-8"> ' +
            '<input type="password" name="password" class="form-control input-md" value="123456"> ' +
            '</div> ' +
            '</div> ';

            html += '<div class="form-group"> ' +
            '<label class="col-md-3 control-label" for="name">真实姓名:</label> ' +
            '<div class="col-md-8"> ' +
            '<input type="text" name="name" class="form-control input-md" value=""> ' +
            '</div> ' +
            '</div> ';

            html += '<div class="form-group"> ' +
            '<label class="col-md-3 control-label" for="phone">手机号:</label> ' +
            '<div class="col-md-8"> ' +
            '<input type="number" name="phone" class="form-control input-md" value=""> ' +
            '</div> ' +
            '</div> ';

            html += '<div class="form-group"> ' +
            '<label class="col-md-3 control-label" for="company">公司:</label> ' +
            '<div class="col-md-8"> ' +
            '<input type="text" name="company" class="form-control input-md" value=""> ' +
            '</div> ' +
            '</div> ';

            html += '<div class="form-group"> ' +
            '<label class="col-md-3 control-label" for="department">部门:</label> ' +
            '<div class="col-md-8"> ' +
            '<input type="text" name="department" class="form-control input-md" value=""> ' +
            '</div> ' +
            '</div> ';

            html += '<div id="progress-id" class="progress" data-percent="0%" style="display: none;">' +
            '<div id="progress-bar-id" class="progress-bar" style="width:0%;"></div>' +
            '</div>';

            html += '<input type="hidden" name="status" value="0"/><br>' +
            '</div>' +
            '</form>' +
            '</div>' +
            '</div>';

            window.__myDialog = bootbox.dialog({
                //size: 'small',
                title: "添加用户对话框",
                message: html,
                buttons: {
                    tiJiao: {
                        label: "新建",
                        className: "btn-success my-add-btn-id",
                        callback: function () {
                            $('.my-add-btn-id').hide();
                            $('#file_upload_form').submit();
                            return false;
                        }
                    }
                }
            });
        };
        /**
         * 导入用户
         */
        W.importUser = function (onwer, id) {
            var addUrl = 'user/import'; // 添加请求
            var html = '<div class="row" style="margin: 0px;padding:0px;">' +
                '<iframe id="file_upload_iframe" name="file_upload_iframe" width="0" height="0" style="display: none;"></iframe>' +
                '<div class="col-md-12"> ' +
                '<form id="file_upload_form" class="form-horizontal" action="' + addUrl + '" method="post" enctype="multipart/form-data" target="file_upload_iframe">';

            html += '<div class="form-group"> ' +
            '<label class="col-md-3 control-label" for="password">统一密码:</label> ' +
            '<div class="col-md-8"> ' +
            '<input type="text" name="password" class="form-control input-md" placeholder="默认是123456"> ' +
            '</div> ' +
            '</div> ';

            html += '<div class="form-group"> ' +
            '<label class="col-md-3 control-label" for="excel">选择导入文件:</label> ' +
            '<div class="col-md-8"> ' +
            '<input type="file" name="excel" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"  class="form-control input-md" placeholder="必填"> ' +
            '</div> ' +
            '</div> ';

            html += '<div class="form-group"> ' +
            '<label class="col-md-3 control-label" for="message-id">导入日志显示:</label> ' +
            '<div class="col-md-8"> ' +
            '<div id="message-id" style="height: 130px;overflow: auto;">' +
            '</div>' +
            '</div> ' +
            '</div>';

            html += '<div id="progress-id" class="progress" data-percent="0%" style="display: none;">' +
            '<div id="progress-bar-id" class="progress-bar" style="width:0%;"></div>' +
            '</div>';

            html += '</div>' +
            '</form>' +
            '</div>' +
            '</div>';

            window.__myDialog = bootbox.dialog({
                //size: 'small',
                title: "导入用户对话框",
                message: html,
                buttons: {
                    tiJiao: {
                        label: "开始导入",
                        className: "btn-success my-add-btn-id",
                        callback: function () {
                            alert('开始提交,处理时间较长,请您不要关闭窗口,耐心等待处理结束~~');
                            $('.my-add-btn-id').hide();
                            $('#file_upload_form').submit();
                            return false;
                        }
                    }
                }
            });
        };

        /**
         * 服务器导入用户成功后的ｊｓｏｎｐ回调函数
         */
        W.importCallback = function (status, sMsg) {
            var msg = '导入失败', color = 'red';
            if (status) {
                msg = '导入结束', color = 'green';
            } else {
                $('.my-add-btn-id').show();
            }
            $('#progress-id').replaceWith('<span style="font-size:13px;color:' + color + ';">' + msg + '~~~<span><br/><div>' + sMsg + '</div>');
            //setTimeout(function () {
            //    window.__myDialog.modal('hide');
            jQuery(grid_selector).trigger('reloadGrid');
            //}, 1500);
        };

        /**
         * 显示导入用户的消息
         */
        W.showMessage = function (msg) {
            $('#message-id').append('<div style="width:800px;">' + msg + '</div>');
        };

        /**
         * 导入进度的方法
         */
        W.importProgress = function (progress) {
            $('#progress-id').show().attr('data-percent', progress);
            $('#progress-bar-id').css('width', progress);
        };

        /**
         * 添加分类的ｊｓｏｎｐ回调函数
         */
        W.addUserJsonp = function (id, status) {
            window.__myDialog.modal('hide');
            var msg = '修改失败', color = 'red';
            if (status) msg = '修改成功', color = 'green';
            $('.my-a-' + id).parent().empty().append('<span style="color:' + color + ';">' + msg + '<span>');
            setTimeout(function () {
                jQuery(grid_selector).trigger('reloadGrid');
            }, 1000);
        };

    };
})(window);

