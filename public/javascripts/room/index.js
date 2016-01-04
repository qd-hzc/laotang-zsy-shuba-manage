/**
 * Created by fy on 15-12-22.
 */
'use strict';
(function (W) {
    W.roomPageInit = function () {

        W.grid_selector = "#grid-table";
        W.pager_selector = "#grid-pager";
        W.search_form = '#search-form-id';
        W._title = '游戏房间管理';
        W.str = location.search;
        W._url = BASE_URL + "room/list";
        W._sortname = 'code';
        W._sortorder = 'ASC';
        $('.date').datepicker();
        W._postData = {};
        W._colNames = ['房间号', '状态', '最多容纳人数', '操作'];
        W._colModel = [
            {name: 'code', width: 80, index: 'code', align: "left", sortable: true},
            {
                name: 'status', width: 100, index: 'status', align: "left", sortable: true,
                formatter: function (status) {
                    if (status == 0)return '空闲';
                    if (status == 1)return '游戏中';
                    if (status == 2)return '删除';
                }
            },
            {
                name: 'seatCount',
                width: 100,
                index: 'seatCount',
                align: "left",
                sortable: true
            },
            {
                name: '操作', width: 200, index: '', sortable: false,
                formatter: function (value, options, row) {
                    var id = row.id;
                    var code = row.code;
                    var seatCount = row.seatCount;
                    var status = row.status;

                    var buJu = '<a href="room/layout?id=' + id + '&code=' + code + '">房间布局</a>';
                    var update = '<a href="javascript:updateRoom(this,' + id + ',\'' + code + '\',' + seatCount + ',' + status + ');">修改</a>';
                    var jinRu = '<a class="btn btn-sm btn-success" href="javascript:openRoom(this,' + id + ',\'' + code + '\');">游戏开间</a>';

                    if (status == 0)return buJu
                        + '<span style="margin:0 10px;"></span>'
                        + update
                        + '<span style="margin:0 10px;"></span>'
                        + jinRu;
                    if (status == 1)return '等待游戏结束';
                    if (status == 2) return update;
                    return '';
                }
            }
        ];

        window.cbJsonp = function (id, status) {
            window.__myDialog.modal('hide');
            var msg = '操作失败', color = 'red';
            if (status) msg = '操作成功', color = 'green';
            $('.my-a-' + id).parent().empty().append('<span style="color:' + color + ';">' + msg + '<span>');
            setTimeout(function () {
                jQuery(grid_selector).trigger('reloadGrid');
            }, 1000);
        };

        W.addRoom = function (onwer, id) {
            var html = jade.templates.add({action: 'room/add'});
            W.__myDialog = bootbox.dialog({
                //size: 'small',
                title: "添加房间对话框",
                message: html,
                buttons: {
                    tiJiao: {
                        label: "添加",
                        className: "btn-success my-add-btn-id",
                        callback: function () {
                            $('.my-add-btn-id').hide();
                            $('#addForm').submit();
                            return false;
                        }
                    }
                }
            });
        };

        W.updateRoom = function (onwer, id, code, seatCount, status) {
            var html = jade.templates.update({
                action: 'room/update',
                roomId: id,
                code: code,
                seatCount: seatCount,
                status: status
            });
            W.__myDialog = bootbox.dialog({
                //size: 'small',
                title: "修改房间对话框",
                message: html,
                buttons: {
                    tiJiao: {
                        label: "修改",
                        className: "btn-success my-add-btn-id",
                        callback: function () {
                            $('.my-add-btn-id').hide();
                            $('#updateForm').submit();
                            return false;
                        }
                    }
                }
            });
        };

        W.openRoom = function (owner, id, code) {
            $.get('user/getJudgment', function (judgments) {
                if (!judgments || judgments.length == 0) {
                    alert('系统还没有裁判，请先去添加裁判');
                    return;
                }
                var html = jade.templates.open({
                    action: 'room/open',
                    roomId: id,
                    roomCode: code,
                    judgments: judgments
                });
                W.__myDialog = bootbox.dialog({
                    title: "游戏开间对话框",
                    message: html,
                    buttons: {
                        kaiJian: {
                            label: '进入房间',
                            className: 'btn-success my-add-btn-id',
                            callback: function () {
                                $('.my-add-btn-id').hide();
                                $('#openForm').submit();
                                window.__myDialog.modal('hide');
                                return false;
                            }
                        }
                    }
                });
            });
        };

        W.delRoom = function (owner, id) {
            $.post('room/remove', {roomId: id}, function (result) {
                if (result && result.status) {
                    setTimeout(function () {
                        jQuery(grid_selector).trigger('reloadGrid');
                    }, 1000);
                    alert('删除成功');
                } else {
                    alert('删除失败');
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
                $('.my-add-btn-id').show();
                $.gritter.removeAll();
                $('input[name="' + name + '"],textarea[name="' + name + '"]').focus();
            }, 2000);
        };


    };
})(window);


