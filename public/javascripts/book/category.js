/**
 * Created by fy on 15-9-7.
 */
(function (W) {
    W.categoryPageInit = function () {


        W.grid_selector = "#grid-table";
        W.pager_selector = "#grid-pager";
        W.search_form = '#search-form-id';
        W._title = '分类管理';
        W.str = location.search;
        W._url = BASE_URL + "book/category/list";
        W._sortname = 'cdate';
        W._sortorder = 'desc';
        $('.date').datepicker();
        W._postData = {};
        W._colNames = ['分类名称', '分类图片', '状态', '创建日期', '修改日期', '操作'];
        W._colModel = [
            {name: 'name', width: 80, index: 'name', align: "left", sortable: true},
            {
                name: 'img_path', width: 150, index: 'img_path', align: "left", sortable: true,
                formatter: function (value, options, row) {
                    try {
                        if (value) {
                            var label = value.substring(value.lastIndexOf('/') + 1).substring(('' + row.id).toString().length + 1);
                            return '<a href="' + value + '" target="_blank">' + label + '</a>';
                        }
                        return value || '';
                    } catch (e) {
                        return '';
                    }
                }
            },
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
                    var updated = '<a class="my-a-' + categoryId + '" onclick="updateCategory(this,' + categoryId + ')">修改</a>';

                    if (status == 0)return updated
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
        W.updateCategoryStatus = function (owner, id, status) {
            $.post('book/category/update/status', {id: id, status: status}, function (result) {
                var msg = '修改失败', color = 'red';
                if (result && result.status) msg = '修改成功', color = 'green';
                $(owner).parent().empty().append('<span style="color:' + color + ';">' + msg + '<span>');
                setTimeout(function () {
                    jQuery(grid_selector).trigger('reloadGrid');
                }, 1000);
            });
        };

        /**
         *　上传图片方法
         */
        W.uploadImg = function (owner, id) {
            upload(owner, 'book/category/upload/img', id);
        };

        /**
         * 添加pdf
         */
        W.addCategory = function (onwer, id) {
            var addUrl = 'book/category/add'; // 添加请求
            var html = '<div class="row" style="margin: 0px;padding:0px;">' +
                '<iframe id="file_upload_iframe" name="file_upload_iframe" width="0" height="0" style="display: none;"></iframe>' +
                '<div class="col-md-12"> ' +
                '<form id="file_upload_form" class="form-horizontal" action="' + addUrl + '" method="post" enctype="multipart/form-data" target="file_upload_iframe">';

            html += '<div class="form-group"> ' +
            '<label class="col-md-3 control-label" for="name">分类名称:</label> ' +
            '<div class="col-md-8"> ' +
            '<input type="text" name="name" class="form-control input-md" value=""> ' +
            '</div> ' +
            '</div> ';

            html += '<div class="form-group"> ' +
            '<label class="col-md-3 control-label" for="name">封面图片:</label> ' +
            '<div class="col-md-8"> ' +
            '<input type="file" name="file" accept="image/*" class="form-control input-md"> ' +
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
                title: "添加分类对话框",
                message: html,
                buttons: {
                    tiJiao: {
                        label: "添加",
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
         * 弹出更新对话框
         */
        W.updateCategory = function (owner, id) {

            /**
             * 获取预览图片或者pdf的链接
             */
            function genPreviewLink(value, id) {
                try {
                    var label = value.substring(value.lastIndexOf('/') + 1).substring(('' + id).toString().length);
                    return '<a href="' + value + '" target="_blank">' + label + '</a>';
                } catch (e) {
                    return '';
                }
            }

            var preUrl = 'book/category/update/pre'; // 加载要更新的表单数据
            var updateUrl = 'book/category/update'; // 更新请求
            $.post(preUrl, {id: id}, function (category) {
                if (category) {
                    var imgLink = genPreviewLink(category.img_path, category.id);

                    var html = '<div class="row" style="margin: 0px;padding:0px;">' +
                        '<iframe id="file_upload_iframe" name="file_upload_iframe" width="0" height="0" style="display: none;"></iframe>' +
                        '<div class="col-md-12"> ' +
                        '<form id="file_upload_form" class="form-horizontal" action="' + updateUrl + '" method="post" enctype="multipart/form-data" target="file_upload_iframe">';

                    html += '<div class="form-group"> ' +
                    '<label class="col-md-3 control-label" for="name">分类名称:</label> ' +
                    '<div class="col-md-8"> ' +
                    '<input type="text" name="name" class="form-control input-md" value="' + category.name + '"> ' +
                    '</div> ' +
                    '</div> ';

                    html += '<div class="form-group"> ' +
                    '<label class="col-md-3 control-label" for="name">封面图片:</label> ' +
                    '<div class="col-md-8"> ' +
                    '<input type="file" name="file" accept="image/*" class="form-control input-md"> ' +
                    '<span class="help-block"style="margin-bottom: 0px;">预览原图片:' + imgLink + '</span>' +
                    '</div> ' +
                    '</div> ';

                    html += '<div class="form-group"> ' +
                    '<label class="col-md-3 control-label" for="name">状态:</label> ' +
                    '<div class="col-md-8"> ' +
                    '<select name="status" class="form-control input-md">';
                    if (category.status) {
                        html += '<option value="0">无效</option>';
                        html += '<option value="1" selected>有效</option>';
                    } else {
                        html += '<option value="0" selected>无效</option>';
                        html += '<option value="1">有效</option>';
                    }
                    html += '</select> ' +
                    '</div> ' +
                    '</div> ';

                    html += '<div id="progress-id" class="progress" data-percent="0%" style="display: none;">' +
                    '<div id="progress-bar-id" class="progress-bar" style="width:0%;"></div>' +
                    '</div>';

                    html += '<input type="hidden" name="id" value="' + category.id + '"/><br>' +
                    '</div>' +
                    '</form>' +
                    '</div>' +
                    '</div>';

                    window.__myDialog = bootbox.dialog({
                            //size: 'small',
                            title: "更新图书分类对话框",
                            message: html,
                            buttons: {
                                tiJiao: {
                                    label: "修改",
                                    className: "btn-success my-update-btn-id",
                                    callback: function () {
                                        $('.my-update-btn-id').hide();
                                        $('#file_upload_form').submit();
                                        return false;
                                    }
                                }
                            }
                        }
                    );

                }
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
         * 服务器修改分类成功后的ｊｓｏｎｐ回调函数
         */
        W.updateCallback = function (id, status) {
            var msg = '修改失败', color = 'red';
            if (status) {
                msg = '修改成功', color = 'green';
            } else {
                $('.my-update-btn-id').show();
            }
            $('#progress-id').replaceWith('<span style="font-size:13px;color:' + color + ';">' + msg + '~~~<span>').show();
            setTimeout(function () {
                window.__myDialog.modal('hide');
                jQuery(grid_selector).trigger('reloadGrid');
            }, 1500);
        };


        /**
         * 服务器上传图片成功后的ｊｓｏｎｐ回调函数
         */
        window.uploadImgJsonp = function (id, newImgPath, status) {
            window.__myDialog.modal('hide');
            var msg = '修改失败', color = 'red';
            if (status) msg = '修改成功', color = 'green';
            $('.my-a-' + id).parent().empty().append('<span style="color:' + color + ';">' + msg + '<span>');
            setTimeout(function () {
                jQuery(grid_selector).trigger('reloadGrid');
            }, 1000);
        };

        /**
         * 添加分类的ｊｓｏｎｐ回调函数
         */
        window.addCategoryJsonp = function (id, status) {
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
