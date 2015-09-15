/**
 * Created by fy on 15-9-7.
 */
(function (W) {
    W.pdfPageInit = function () {

        W.grid_selector = "#grid-table";
        W.pager_selector = "#grid-pager";
        W.search_form = '#search-form-id';
        W._title = '分类管理';
        W._height = 270;
        W.str = location.search;
        W._url = BASE_URL + "book/pdf/list";
        W._sortname = 'cdate';
        W._sortorder = 'desc';
        $('.date').datepicker();
        W._postData = {};
        W._colNames = ['图书分类', '图书名称', '简介', '封面图片', 'PDF', '状态', '创建日期', '修改日期', '操作'];
        W._colModel = [
            {name: 'categoryName', width: 100, index: 'categoryName', align: "left", sortable: true},
            {name: 'name', width: 150, index: 'name', align: "left", sortable: true},
            {name: 'desc', width: 150, index: 'desc', align: "left", sortable: true},
            {
                name: 'img_path', width: 150, index: 'img_path', align: "left", sortable: false,
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
                name: 'pdf_path', width: 150, index: 'pdf_path', align: "left", sortable: false,
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
                name: 'status', width: 60, index: 'status', align: "left", sortable: true,
                formatter: function (status) {
                    if (status == 0) return "无效";
                    if (status == 1) return "有效";
                }
            },
            {name: 'cdate', width: 100, index: 'cdate', align: "left", sortable: true, formatter: FORMAT.timeYMD},
            {name: 'udate', width: 100, index: 'udate', align: "left", sortable: true, formatter: FORMAT.timeYMD},
            {
                name: '操作', width: 200, index: '', sortable: false,
                formatter: function (value, options, row) {
                    var pdfId = row.id;
                    var status = row.status;

                    var unused = '<a class="my-a-' + pdfId + '" onclick="updatePdfStatus(this,' + pdfId + ',0);">使之失效</a>';
                    var used = '<a class="my-a-' + pdfId + '" onclick="updatePdfStatus(this,' + pdfId + ',1);">使之有效</a>';
                    var update = '<a class="my-a-' + pdfId + '" onclick="updatePdf(this,' + pdfId + ')">修改</a>';
                    var deleted = '<a class="my-a-' + pdfId + '" onclick="deletePdf(this,' + pdfId + ')">删除</a>';

                    if (status == 0)return update
                        + '<span style="margin:0 10px;"></span>'
                        + used
                        + '<span style="margin:0 10px;"></span>'
                        + deleted
                        ;
                    if (status == 1)return update
                        + '<span style="margin:0 10px;"></span>'
                        + unused;
                    return '';
                }
            }
        ];

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
         * 更新pdf图书的状态
         */
        W.updatePdfStatus = function (owner, id, status) {
            $.post('book/pdf/update/status', {id: id, status: status}, function (result) {
                var msg = '修改失败', color = 'red';
                if (result && result.status) msg = '修改成功', color = 'green';
                $(owner).parent().empty().append('<span style="color:' + color + ';">' + msg + '<span>');
                setTimeout(function () {
                    jQuery(grid_selector).trigger('reloadGrid');
                }, 1000);
            });
        };

        /**
         * 更新pdf图书的状态
         */
        W.deletePdf = function (owner, id) {
            bootbox.confirm("您确定要删除吗?", function (result1) {
                if (result1) {
                    bootbox.confirm("删除不可恢复,请再次确认", function (result2) {
                        if (result2) {
                            $.post('book/pdf/delete', {id: id}, function (result) {
                                var msg = '删除失败', color = 'red';
                                if (result && result.status) msg = '删除成功', color = 'green';
                                $(owner).parent().empty().append('<span style="color:' + color + ';">' + msg + '<span>');
                                setTimeout(function () {
                                    jQuery(grid_selector).trigger('reloadGrid');
                                }, 1000);
                            });
                        }
                    });
                }
            });

        };

        /**
         * 弹出更新对话框
         */
        W.updatePdf = function (owner, id) {

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

            var preUrl = 'book/pdf/update/pre'; // 加载要更新的表单数据
            var updateUrl = 'book/pdf/update'; // 更新请求
            $.post(preUrl, {id: id}, function (pdf) {
                if (pdf && pdf.optionList) {
                    var imgLink = genPreviewLink(pdf.img_path, pdf.id);
                    var pdfLink = genPreviewLink(pdf.pdf_path, pdf.id);
                    var html = '<div class="row" style="margin: 0px;padding:0px;">' +
                        '<iframe id="file_upload_iframe" name="file_upload_iframe" width="0" height="0" style="display: none;"></iframe>' +
                        '<div class="col-md-12"> ' +
                        '<form id="file_upload_form" class="form-horizontal" action="' + updateUrl + '" method="post" enctype="multipart/form-data" target="file_upload_iframe">' +
                        '<div class="form-group"> ' +
                        '<label class="col-md-3 control-label" for="name">图书分类:</label> ' +
                        '<div class="col-md-8"> ' +
                        '<select name="categoryId" class="form-control input-md">';
                    for (var i = 0; i < pdf.optionList.length; i++) {
                        var option = pdf.optionList[i], isSelect = '';
                        if (pdf.dic_category_id == option.id) isSelect = 'selected';
                        html += '<option value="' + option.id + '" ' + isSelect + '>' + option.name + '</option>';
                    }
                    html += '</select> ' +
                    '</div> ' +
                    '</div> ' +

                    '<div class="form-group"> ' +
                    '<label class="col-md-3 control-label" for="name">图书名称:</label> ' +
                    '<div class="col-md-8"> ' +
                    '<input type="text" name="name" class="form-control input-md" value="' + pdf.name + '"> ' +
                    '</div> ' +
                    '</div> ' +

                    '<div class="form-group"> ' +
                    '<label class="col-md-3 control-label" for="name">简介:</label> ' +
                    '<div class="col-md-8"> ' +
                    '<textarea name="desc"  class="form-control input-md">' + pdf.desc + '</textarea> ' +
                    '</div> ' +
                    '</div> ' +

                    '<div class="form-group"> ' +
                    '<label class="col-md-3 control-label" for="name">封面图片:</label> ' +
                    '<div class="col-md-8"> ' +
                    '<input type="file" name="img" accept="image/*" class="form-control input-md"> ' +
                    '<span class="help-block"style="margin-bottom: 0px;">预览图片:' + imgLink + '</span>' +
                    '</div> ' +
                    '</div> ' +

                    '<div class="form-group"> ' +
                    '<label class="col-md-3 control-label" for="name">PDF文件:</label> ' +
                    '<div class="col-md-8"> ' +
                    '<input type="file" name="pdf" accept="application/pdf" class="form-control input-md"> ' +
                    '<span class="help-block" style="margin-bottom: 0px;">预览PDF:' + pdfLink + '</span>' +
                    '</div> ' +
                    '</div> ' +

                    '<div class="form-group"> ' +
                    '<label class="col-md-3 control-label" for="name">状态:</label> ' +
                    '<div class="col-md-8"> ' +
                    '<select name="status" class="form-control input-md">';
                    if (pdf.status) {
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

                    html += '<input type="hidden" name="id" value="' + id + '"/><br>' +
                    '</div>' +
                    '</form>' +
                    '</div>' +
                    '</div>';
                    window.__myDialog = bootbox.dialog({
                            //size: 'small',
                            title: "更新PDF图书对话框",
                            message: html,
                            buttons: {
                                tiJiao: {
                                    label: "修改",
                                    className: "btn-success my-update-btn-id",
                                    callback: function () {
                                        alert('开始提交,处理时间较长,请您不要关闭窗口,耐心等待处理结束~~');
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
         * 更新上传进度的方法
         */
        W.updateProgress = function (progress) {
            $('#progress-id').show().attr('data-percent', progress);
            $('#progress-bar-id').css('width', progress);
        };

        /**
         * 服务器上传图片成功后的ｊｓｏｎｐ回调函数
         */
        W.callback = function (id, status) {
            var msg = '修改失败', color = 'red';
            if (status) {
                msg = '修改成功', color = 'green';
            } else {
                $('.my-update-btn-id').show();
            }
            $('#progress-id').replaceWith('<span style="font-size:13px;color:' + color + ';">' + msg + '~~~<span>');
            setTimeout(function () {
                window.__myDialog.modal('hide');
                jQuery(grid_selector).trigger('reloadGrid');
            }, 1500);
        };

        /**
         * 添加pdf
         */
        W.addPdf = function (onwer, id) {
            var preUrl = 'book/pdf/add/pre'; // 加载分类select
            var addUrl = 'book/pdf/add'; // 添加请求
            $.post(preUrl, function (optionList) {
                if (optionList) {
                    var html = '<div class="row" style="margin: 0px;padding:0px;">' +
                        '<iframe id="file_upload_iframe" name="file_upload_iframe" width="0" height="0" style="display: none;"></iframe>' +
                        '<div class="col-md-12"> ' +
                        '<form id="file_upload_form" class="form-horizontal" action="' + addUrl + '" method="post" enctype="multipart/form-data" target="file_upload_iframe">' +
                        '<div class="form-group"> ' +
                        '<label class="col-md-3 control-label" for="name">图书分类:</label> ' +
                        '<div class="col-md-8"> ' +
                        '<select name="categoryId" class="form-control input-md">';
                    for (var i = 0; i < optionList.length; i++) {
                        var option = optionList[i];
                        html += '<option value="' + option.id + '">' + option.name + '</option>';
                    }
                    html += '</select> ' +
                    '</div> ' +
                    '</div> ' +

                    '<div class="form-group"> ' +
                    '<label class="col-md-3 control-label" for="name">图书名称:</label> ' +
                    '<div class="col-md-8"> ' +
                    '<input type="text" name="name" class="form-control input-md" value=""> ' +
                    '</div> ' +
                    '</div> ' +

                    '<div class="form-group"> ' +
                    '<label class="col-md-3 control-label" for="name">简介:</label> ' +
                    '<div class="col-md-8"> ' +
                    '<textarea name="desc"  class="form-control input-md"></textarea> ' +
                    '</div> ' +
                    '</div> ' +

                    '<div class="form-group"> ' +
                    '<label class="col-md-3 control-label" for="name">封面图片:</label> ' +
                    '<div class="col-md-8"> ' +
                    '<input type="file" name="img" accept="image/*" class="form-control input-md"> ' +
                    '</div> ' +
                    '</div> ' +

                    '<div class="form-group"> ' +
                    '<label class="col-md-3 control-label" for="name">PDF文件:</label> ' +
                    '<div class="col-md-8"> ' +
                    '<input type="file" name="pdf" accept="application/pdf" class="form-control input-md"> ' +
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
                            title: "添加PDF图书对话框",
                            message: html,
                            buttons: {
                                tiJiao: {
                                    label: "添加",
                                    className: "btn-success my-add-btn-id",
                                    callback: function () {
                                        alert('开始提交,处理时间较长,请您不要关闭窗口,耐心等待处理结束~~');
                                        $('.my-add-btn-id').hide();
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
         * 添加上传进度的方法
         */
        W.addProgress = function (progress) {
            $('#progress-id').show().attr('data-percent', progress);
            $('#progress-bar-id').css('width', progress);
        };

        /**
         * 服务器上传图片成功后的ｊｓｏｎｐ回调函数
         */
        W.addCallback = function (status) {
            var msg = '添加失败', color = 'red';
            if (status) {
                msg = '添加成功', color = 'green';
            } else {
                $('.my-add-btn-id').show();
            }
            $('#progress-id').replaceWith('<span style="font-size:13px;color:' + color + ';">' + msg + '~~~<span>');
            setTimeout(function () {
                window.__myDialog.modal('hide');
                jQuery(grid_selector).trigger('reloadGrid');
            }, 1500);
        };


    };
})(window);

