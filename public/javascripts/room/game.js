/**
 * Created by fy on 15-12-24.
 */
'use strict';

/**
 * 局的配置对象
 * window.__settings[office]
 * @type {{1: {office: string, shenfen: string}, 2: {office: string, shenfen: string}, 3: {office: string, shenfen: string}}}
 * @private
 */
window.__settings = {
    1: {
        office: '10/11人局',
        shenfen: '3狼3身份',
        score: {langRen: 20, shenFen: 20, pingMin: 15},
        flowIndex: 0,
        flowNames: [
            {name: '狼人环节', step: 4},
            //{name: '女巫环节', step: 3},
            {name: '猎人环节', step: 2},
            {name: '白痴环节', step: 2},
            //{name: '乌鸦环节', step: 3},
            {name: '预言家环节', step: 3},
            {name: '竞选村长环节', step: 2},
            {name: '投票环节', step: 4}
        ],
        shenFen: ['预言家', '白痴', '猎人']
    },
    2: {
        office: '12/13/14人局', shenfen: '4狼4身份',
        score: {langRen: 30, shenFen: 30, pingMin: 20},
        flowIndex: 0,
        flowNames: [
            {name: '狼人环节', step: 4},
            {name: '女巫环节', step: 3},
            {name: '猎人环节', step: 2},
            {name: '白痴环节', step: 2},
            //{name: '乌鸦环节', step: 3},
            {name: '预言家环节', step: 3},
            {name: '竞选村长环节', step: 2},
            {name: '投票环节', step: 4}
        ],
        shenFen: ['预言家', '白痴', '猎人', '女巫']
    },
    3: {
        office: '15/16/17/18人局', shenfen: '5狼5身份',
        score: {langRen: 40, shenFen: 40, pingMin: 25},
        flowIndex: 0,
        flowNames: [
            {name: '狼人环节', step: 4},
            {name: '女巫环节', step: 3},
            {name: '猎人环节', step: 2},
            {name: '白痴环节', step: 2},
            {name: '乌鸦环节', step: 3},
            {name: '预言家环节', step: 3},
            {name: '竞选村长环节', step: 2},
            {name: '投票环节', step: 4}
        ],
        shenFen: ['预言家', '白痴', '猎人', '乌鸦']
    }
};

/**
 * 下一步的流程控制对象
 * @type {{getFlowIndex: Function, getFlowItem: Function, getFlowName: Function, getSubFlowStep: Function, nextSubFlow: Function, nextFlow: Function, resetFlow: Function}}
 */
var Flow = {
    getFlowIndex: function () {
        return window.__settings[office].flowIndex;
    },
    getFlowItem: function () {
        var juSetting = window.__settings[office];
        return juSetting.flowNames[juSetting.flowIndex];
    },
    getFlowName: function () {
        return this.getFlowItem().name;
    },
    getSubFlowStep: function () {
        return this.getFlowItem().step;
    },
    nextSubFlow: function () {
        --this.getFlowItem().step;
    },
    nextFlow: function () {
        ++window.__settings[office].flowIndex;
    },
    resetFlow: function () {
        window.__settings[office].flowIndex = 0;
    },
    getGameTitle: function () {
        var juSetting = window.__settings[office];
        return juSetting.office + ',' + juSetting.shenfen;
    }
};

/**
 * 取消选中事件
 */
!function distachSelectText() {
    document.onselectstart = function () {
        return false;
    }; //for ie
    //document.onselectstart = new Function('event.returnValue=false;');
}();

//window.__all_member
!function cacheAllMember() {
    $.post('member/all', function (result) {
        if (!result) {
            alert('系统还没有会员,无法开始游戏,确定后窗口会自动关闭');
            window.close();
        }
        console.log(result);
        window.__all_member = result;
    });
}();

$(function () {

    /**
     * 初始化局
     */
    !function () {
        var juSetting = window.__settings[office];

        // 生成flow流程界面
        var flowsHtml = jade.templates.flow(juSetting);
        $('#flowContent').html(flowsHtml);

        // 移除当前局不允许的身份
        $('#shenfen').children().each(function () {
            var allowOptions = juSetting.shenFen.join(',') + ',狼人,平民';
            if (allowOptions.indexOf($(this).text()) == -1) $(this).remove();
        });

        //修改标题
        $('#juLabel').text(Flow.getGameTitle());
    }();


    /**
     * 检查村长是否存在
     * @returns {number}　４：则村长不存在，３：存在
     */
    function checkCunZhangExits() {
        var cunzhangSize = $('.grid-stack-item').filter(function () {
            return getData(this, 'shenfen') == '村长' && getData(this, 'status') == 0;
        }).size();
        return cunzhangSize ? 3 : 4;
    }

    /**
     * @deprecated
     * 获取某个身份的数量
     * @param shenFen
     * @returns {*|jQuery}
     */
    function getShenFenCount(shenFen) {
        return $('.grid-stack-item').filter(function () {
            return getData(this, 'shenfen') == shenFen;
        }).size();
    }

    /**
     * 返回活着的女巫ｄｏｍ
     * @returns {*|jQuery}
     */
    function getNvWuDom() {
        return $('.grid-stack-item').filter(function () {
            return getData(this, 'shenfen') == '巫' && getData(this, 'status') == 0;
        });
    }

    /**
     * 检查游戏是否结束了，
     * 逻辑是：
     * <pre>
     * 1:如果狼人死光了，猎人赢
     * 2:如果猎人死光了，狼人赢
     * 3:否则游戏继续
     * </pre>
     */
    function checkIsGameOver() {

        //todo 狼人分数
        var langFen = 40;
        //todo 好人分数
        var haoFen = 30;

        var seatDoms = $('.grid-stack-item');
        var lieRenCount = seatDoms.filter(function () {
            return getData(this, 'shenfen') == '猎';
        }).size();
        var langRenCount = seatDoms.filter(function () {
            return getData(this, 'shenfen') == '狼';
        }).size();

        if (lieRenCount <= 0) { // 狼人赢
            //TODO 显示结束对话框
            var ret = ['获胜者：狼人'];
            var score = seatDoms.filter(function () {
                return getData(this, 'shenfen') == '狼';
            }).map(function () {
                var memberId = getData(this, 'memberId');
                var memberName = getData(this, 'memberName');
                var penalty = getData(this, 'penalty') || 0;
                var shenfen = getData(this, 'shenfen');
                // todo 这里不同的身份要加入不同的分数
                var winerFen = penalty + haoFen;
                ret.push(memberName + '加分:' + winerFen);
                return {
                    gameId: gameId,
                    roomId: roomId,
                    memberId: memberId,
                    penalty: winerFen
                }
            }).get();
            $.post('room/gameOver', {
                roomId: roomId,
                score: score
            }, function (result) {
                if (result && result.status) {
                    toast('保存分数成功！');
                    showGameOverDialog(ret);
                } else {
                    toast('保存分数失败！');
                }
            });
            return false;
        }
        if (langRenCount <= 0) { //　好人赢
            var ret = ['获胜者：好人'];
            var score = seatDoms.filter(function () {
                return getData(this, 'shenfen') != '狼';
            }).map(function () {
                var memberId = getData(this, 'memberId');
                var memberName = getData(this, 'memberName');
                var penalty = getData(this, 'penalty') || 0;
                var shenfen = getData(this, 'shenfen');
                // todo 这里不同的身份要加入不同的分数
                var winerFen = penalty + haoFen;
                ret.push(memberName + '加分:' + winerFen);
                return {
                    gameId: gameId,
                    roomId: roomId,
                    memberId: memberId,
                    penalty: winerFen
                }
            }).get();
            $.post('room/gameOver', {
                roomId: roomId,
                score: score
            }, function (result) {
                if (result && result.status) {
                    showGameOverDialog(ret);
                    toast('保存分数成功！');
                } else {
                    toast('保存分数失败！');
                }
            });
            return false;
        }
        //otherwise 游戏继续
        return true;
    }

    /**
     * 鼠标单击显示pop框
     * @param ele
     * @param title
     * @param content
     */
    function eventPopover(ele, content, title) {
        $(ele).attr({
            'data-rel': 'popover',
            'data-placement': 'right',
            'data-content': content,
            'data-original-title': title || "<i class='icon-ok green'></i> 个人信息面板"
        }).popover({html: true});
    }

    /**
     * 添加到用户基本信息面板
     * @param ele
     * @param key
     * @param value
     */
    function addForPersonPanel(ele, key, value) {
        var extras = saveAndUpdateData(ele, key, value);
        var content = jade.templates.info({infos: [extras]});
        $(ele).attr({
            'data-rel': 'popover',
            'data-placement': 'right',
            'data-content': content,
            'data-original-title': "<i class='icon-ok green'></i> 个人信息面板"
        }).popover({html: true});
    }

    /**
     * 游戏结束对话框
     */
    function showGameOverDialog(content) {
        var html = jade.templates.gameOver({
            list: content
        });
        window.__myDialog = bootbox.dialog({
            title: "游戏结束对话框",
            message: html,
            buttons: {
                close: {
                    label: '关闭',
                    className: 'btn-success',
                    callback: function () {
                        window.__myDialog.modal('hide');
                        return false;
                    }
                }
            }
        });
    }

    /**
     * 显示语音播报对话框
     */
    function showAudioDialog() {
        var audios = ['请玩家遵守游戏规则', '请玩家文明游戏', '请已出局玩家保持安静', '请屋内玩家保持安静'];
        var html = jade.templates.audio({
            audios: audios
        });
        window.__myDialog = bootbox.dialog({
            title: "语音播报对话框",
            message: html,
            buttons: {
                close: {
                    label: '关闭',
                    className: 'btn-success',
                    callback: function () {
                        window.__myDialog.modal('hide');
                        return false;
                    }
                }
            }
        });
    }

    /**
     * 消息提示
     * @param title
     * @param text
     */
    function toast(title, text) {
        clearToast();
        $.gritter.add({
            title: title,
            text: text,
            class_name: 'gritter-error gritter-light'
        });
    }

    /**
     * 清除消息提示
     */
    function clearToast() {
        $.gritter.removeAll();
    }

    /**
     * 保存数据到元素上
     * @param ele
     * @param key
     * @param value
     */
    function saveAndUpdateData(ele, key, value) {
        var extras = $(ele).data('extras');
        if (extras) {
            extras[key] = value;
        } else {
            var obj = {};
            obj[key] = value;
            $(ele).data('extras', obj);
        }
        return extras;
    }

    /**
     * 删除某个标签上保存的data
     * @param ele
     * @param key
     */
    function deleData(ele, key) {
        var extras = $(ele).data('extras');
        if (extras) {
            delete extras[key];
            return extras;
        } else {
            $(ele).data('extras', {});
            return {};
        }
    }

    /**
     * 获取绑定到某个标签上的数据
     * @param ele
     * @param key
     */
    function getData(ele, key) {
        var extras = $(ele).data('extras');
        if (extras)return extras[key];
        else {
            ele.data('extras', {});
            return null;
        }
    }

    /**
     * 获取用户设置的房间的布局信息
     */
    function getLayoutJsonById(id) {
        var layoutJson = null;
        $.ajax({
            type: "POST",
            url: "room/getLayout",
            dataType: "json",
            async: false,
            data: {
                id: id
            },
            success: function (result) {
                layoutJson = result;
            },
            error: function () {
                return null;
            }
        });
        return layoutJson;
    }

    /**
     * 判断用户是否已经注册了
     * @param context
     * @returns {boolean}
     */
    function checkIsRegister(context) {
        var memberCode = getData(context.parent(), 'memberCode');
        if (!memberCode) {
            toast('您还没有进行座次登记');
        }
        return !!memberCode;
    }

    /**
     * 添加右键菜单事件
     */
    function eventContextMenu(doms) {
        doms.filter(function () {
            var t = $.trim($(this).children().first().text());
            return (t.indexOf('裁判') == -1 && t.indexOf('桌') == -1 && t.indexOf('屏') == -1);
        }).contextmenu({
            target: '#context-menu',
            onItem: function (context, e) {
                e.preventDefault();
                var ele = $(e.target);
                var text = ele.text();

                if (text != '座次登记' && !checkIsRegister(context)) return;//校验是否已经登记座次

                if (text == '座次登记') {
                    showDialogForRegister(context, e);
                } else if (text == '更改身份') {
                    showDialogForShenFen(context, e);
                } else if (text == '罚分') {
                    showDialogForPenalty(context, e);
                } else if (text == '杀掉') {
                    if (Flow.getFlowIndex() == 1) { //在女巫环节，才可以救活人/杀人
                        var nvWuDom = getNvWuDom();
                        var shasiCount = getData(nvWuDom, 'shasiCount') || 1;
                        if (shasiCount) {
                            //TODO 声音特效
                            var ele1 = context.find('.my-badge-si').remove().end().append('<div class="my-badge-si">死</div>').parent();
                            saveAndUpdateData(ele1, 'status', 4);
                            if (nvWuDom) addForPersonPanel(nvWuDom, 'shasiCount', 0);
                            checkIsGameOver();
                        } else {
                            toast('女巫的杀人药已经用完了');
                        }
                    } else { //
                        //TODO 声音特效
                        var ele1 = context.find('.my-badge-si').remove().end().append('<div class="my-badge-si">死</div>').parent();
                        saveAndUpdateData(ele1, 'status', 4);
                        if (nvWuDom) addForPersonPanel(nvWuDom, 'shasiCount', 0);
                        checkIsGameOver();
                    }
                } else if (text == '救活') {
                    if (Flow.getFlowIndex() == 1) { //在女巫环节，才可以救活人/杀人
                        var nvWuDom = getNvWuDom();
                        var jiuHuoCount = getData(nvWuDom, 'jiuhuoCount') || 1;
                        if (jiuHuoCount) {
                            var ele1 = context.find('.my-badge-si').remove().end().parent();
                            saveAndUpdateData(ele1, 'status', 1);
                            addForPersonPanel(nvWuDom, 'jiuhuoCount', 0);
                        } else {
                            toast('女巫的救活药已经用完了');
                        }
                    } else { //
                        toast('只有女巫可以救活别人,女巫已死或，不在女巫环节');
                    }
                } else if (text == '爆狼') {
                    //　判断是否是狼
                    var identity = getData(context.parent(), 'shenfen');
                    if (!identity) {
                        toast('hi,我还没有身份呢!!');
                        return;
                    }
                    if (identity != '狼') {
                        toast('hi,这不是狼!!');
                        return;
                    }
                    var ele1 = context.find('.my-badge-si').remove().end().append('<div class="my-badge-si">死</div>').parent();
                    addForPersonPanel(ele1, 'status', 5);
                    if (checkIsGameOver()) {
                        // TODO 爆狼后直接进入晚上环节
                        resetFlow();
                    }
                } else if (text == '告知发言') {
                    var x = context.children().first().text();
                    play('请' + x + '号玩家发言');
                } else if (text == '禁止发言') {
                    var x = context.children().first().text();
                    play('请' + x + '号玩家结束发言');
                } else if (text == '乌鸦标记') {
                    var ele1 = context.find('.my-badge-biao').remove().end().append('<div class="my-badge-biao">标</div>').parent();
                    addForPersonPanel(ele1, 'wuyaFlag', 1);
                } else if (text == '公投出局') {
                    var ele1 = context.find('.my-badge-si').remove().end().append('<div class="my-badge-si">死</div>').parent();
                    addForPersonPanel(ele1, 'status', 2);
                    checkIsGameOver();
                } else if (text == '误睁眼出局') {
                    var ele1 = context.find('.my-badge-si').remove().end().append('<div class="my-badge-si">死</div>').parent();
                    addForPersonPanel(ele1, 'status', 3);
                    checkIsGameOver();
                } else if (text == '购买商品') {
                    alert('购买商品');
                }
            }
        });
    }

    /**
     * 座次等级对话框
     *  @context 右键点击的目标元素
     *  @ele 当前右键菜单项
     */
    function showDialogForRegister(context, ele) {
        var dialog = $("#dialog-register").removeClass('hide').dialog({
            modal: true,
            title: '座次登记对话框',
            title_html: true,
            buttons: [
                {
                    text: "取消",
                    "class": "btn btn-xs",
                    click: function () {
                        $(this).dialog("close");
                    }
                },
                {
                    text: "确定",
                    "class": "btn btn-primary btn-xs",
                    click: function () {
                        var self = this;
                        var nf = $('#memberForm');
                        var member = nf.find('[name="memberCode"]').val().split(',');
                        var memberCode = member[0];
                        var memberName = member[1];//姓名
                        var seatCode = context.parent().data('extras').name;

                        var params = {memberCode: memberCode, gameId: gameId, seatCode: seatCode};

                        $.post('room/register', params, function (data) {
                            if (data.status) {
                                nf.get(0).reset();
                                var ele = context.parent();
                                saveAndUpdateData(ele, 'memberId', data.member.id);
                                saveAndUpdateData(ele, 'status', 0);
                                addForPersonPanel(ele, 'memberCode', memberCode);
                                addForPersonPanel(ele, 'memberName', memberName);
                                $(self).dialog("close");
                            } else {
                                alert('系统中不存在此会员');
                            }
                        });
                    }
                }
            ]
        }).data('context', context);
        // 自动完成
        $("#memberCode").autocomplete({
            source: window.__all_member
        });

        //custom autocomplete (category selection)
        /*$.widget("custom.catcomplete", $.ui.autocomplete, {
         _renderMenu: function (ul, items) {
         var that = this,
         currentCategory = "";
         $.each(items, function (index, item) {
         if (item.category != currentCategory) {
         ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");
         currentCategory = item.category;
         }
         that._renderItemData(ul, item);
         });
         }
         });*/
    }

    /**
     * 更改身份对话框
     *  @context 右键点击的目标元素
     *  @ele 当前右键菜单项
     */
    function showDialogForShenFen(context, ele) {

        var dialog = $("#dialog-shenfen").removeClass('hide').dialog({
            modal: true,
            title: '更改身份对话框',
            title_html: true,
            buttons: [
                {
                    text: "取消",
                    "class": "btn btn-xs",
                    click: function () {
                        $(this).dialog("close");
                    }
                },
                {
                    text: "确定",
                    "class": "btn btn-primary btn-xs",
                    click: function () {
                        var self = this;
                        var nf = $('#shenfenForm');
                        var shenfen = nf.find('[name="shenfen"]').val();
                        var memberId = getData(context.parent(), 'memberId');

                        $.post('room/updateIdentity', {
                            roomId: roomId,
                            memberId: memberId,
                            identity: shenfen
                        }, function (result) {
                            if (result && result.status) {// 更新数据库成功
                                nf.get(0).reset();
                                var ele = context.find('.my-badge').remove().end().append('<div class="my-badge">' + shenfen + '</div>').parent();
                                addForPersonPanel(ele, 'shenfen', shenfen);
                                $(self).dialog("close");
                            }
                        });
                    }
                }
            ]
        }).data('context', context);
    }

    /**
     * 选择村长对话框
     *  @context 右键点击的目标元素
     *  @ele 当前右键菜单项
     */
    function showDialogForCunZhang(ele) {
        //TODO 遍历所有的活着的身份的座位号，生成选项,并记录ｃｏｎｔｅｘｔ
        var allLivePerson = $('.grid-stack-item').filter(function () {
            return getData(this, 'status') == 0;
        }).map(function () {
            var obj = {};
            var seatCode = getData(this, 'name');
            obj[seatCode] = this;
            var label = '座位:' + seatCode + ',姓名:' + getData(this, 'memberName');
            $('#zuowei').append('<option value="' + seatCode + '">' + label + '</option>');
            return obj;
        });

        function getContext(seatCode) {
            var context = null;
            $.each(allLivePerson, function () {
                var c = this[seatCode];
                if (c)context = c;
            });
            return $(context);
        }

        var dialog = $("#dialog-cunzhang").removeClass('hide').dialog({
            modal: true,
            title: '设置村长对话框',
            title_html: true,
            buttons: [
                {
                    text: "取消",
                    "class": "btn btn-xs",
                    click: function () {
                        $(this).dialog("close");
                    }
                },
                {
                    text: "确定",
                    "class": "btn btn-primary btn-xs",
                    click: function () {
                        var self = this;
                        var nf = $('#cunzhangForm');
                        var zuowei = nf.find('[name="zuowei"]').val();
                        var context = getContext(zuowei);//todo 根据座位号找到ｃｏｎｔｅｘｔ
                        nf.get(0).reset();
                        var ele = context.find('.my-badge').remove().end().append('<div class="my-badge">村长</div>').parent();
                        addForPersonPanel(ele, 'cunzhang', '村长');
                        play(zuowei + '号玩家当选村长');
                        $(self).dialog("close");
                    }
                }
            ]
        });
    }

    /**
     *  显示罚分对话框
     * @param context
     * @param e
     */
    function showDialogForPenalty(context, e) {
        var dialog = $("#dialog-penalty").removeClass('hide').dialog({
            modal: true,
            title: '罚分对话框',
            title_html: true,
            buttons: [
                {
                    text: "取消",
                    "class": "btn btn-xs",
                    click: function () {
                        $(this).dialog("close");
                    }
                },
                {
                    text: "确定",
                    "class": "btn btn-primary btn-xs",
                    click: function () {
                        var self = this;
                        var nf = $('#penaltyForm');
                        var penalty = -parseInt(nf.find('[name="penalty"]').val());
                        var memberId = getData(context.parent(), 'memberId');

                        var params = {penalty: penalty, gameId: gameId, memberId: memberId};

                        $.post('room/penalty', params, function (data) {
                            if (data.status) {
                                nf.get(0).reset();
                                var ele = context.parent();
                                var oldPenalty = getData(ele, 'penalty') || 0;
                                addForPersonPanel(ele, 'penalty', penalty + oldPenalty);
                                $(self).dialog("close");
                            } else {
                                toast('后台发生异常!');
                            }
                        });
                    }
                }
            ]
        }).data('context', context);
    }

    //　初始化游戏界面布局的方法
    var options = {
        width: 8,
        float: true,
        cell_height: 50,
        vertical_margin: 10//,
        //resizable:false,
        //draggable:false
    };

    $('.grid-stack').gridstack(options);

    var GridStack = new function () {
        this.serialized_data = getLayoutJsonById(roomId);

        this.grid = $('.grid-stack').data('gridstack');

        this.load_grid = function () {
            this.grid.remove_all();
            var items = GridStackUI.Utils.sort(this.serialized_data);
            _.each(items, function (node) {
                var item = $('<div><div class="grid-stack-item-content" data-toggle="context" data-target="#context-menu"><span>' + (node.name || "") + '</span></div><div/>');
                item.data('extras', {name: node.name});
                this.grid.add_widget(item, node.x, node.y, node.width, node.height);
            }, this);
            $('#saved-data').val(JSON.stringify(this.serialized_data, null, '    '));

            // 批量添加右键菜单事件
            eventContextMenu($('.grid-stack-item-content'));
        }.bind(this);

        this.load_grid();

        this.grid.movable('.grid-stack-item', false);
        this.grid.resizable('.grid-stack-item', false);

        return this;
    };

    /**
     * 下一环节时,修改样式
     */
    function nextFlowStyle() {
        $('#flow-' + (Flow.getFlowIndex())).find('i').replaceWith('<img src="assets/avatars/avatar1.png"/>');
    }

    /**
     * 重新开始游戏时需要初始化一些
     */
    function resetFlow() {
        // 重置流程的样式
        $('.timeline-item').find('img').replaceWith('<i class="timeline-indicator icon-food btn btn-success no-hover"></i>');
        //重置游戏环节和子环节控制对象

        Flow.resetFlow();
        //flowIndex = 0;
        //flowStepClone = $.map(flowStep, function (i) { //克隆一个新的
        //    return i
        //});
    }

    /**
     * 30秒倒计时音效
     */
    function countDownAudio(time) {
        var i = time || 30;
        var second = $.map(new Array(i), function (k) {
            return i--
        }).join(',');
        play(second);
        var tiot = setTimeout(function () {
            clearTimeout(tiot);
            nextFlowStyle();
        }, i * 1000);
    }

    // 游戏流程控制变量和数据结构
    //var flowIndex = 0;
    //var flowStep = [4, 3, 2, 2, 3, 3, 2, 4/*猎人为6*/];
    //var flowStepClone = [];

    // 控制面板按钮事件
    $('.my-btn').click(function () {
        var btnText = $(this).text();
        if (btnText == '开始') {
            Example1.Timer.toggle();
            resetFlow();
            play('本轮游戏即将开始,共15人,4狼,4身份局,请在局玩家再次确认身份牌,抬头靠后坐,戴好面罩,场外作弊是最不能容忍的行为,另外请将手机静音');
            $('#flow-' + 0).find('i').replaceWith('<img src="assets/avatars/avatar1.png"/>');
            $(this).text('结束');
            toast('请裁判先进行座次登记');
        } else if (btnText == '结束') {
            Example1.Timer.toggle();
            play('游戏结束,请大家离场.');
            $(this).text('开始');
        } else if (btnText == '下一环节') {

            var flowName = Flow.getFlowName();
            var subFlow = Flow.getSubFlowStep();
            if (flowName == '狼人环节') {//狼人环节
                if (subFlow == 4) {
                    nextFlowStyle();
                    Flow.nextSubFlow();
                    play('天黑请闭眼');
                } else if (subFlow == 3) {
                    Flow.nextSubFlow();
                    play('狼人请睁眼');
                    toast('请裁判标记狼人位置');
                } else if (subFlow == 2) {
                    Flow.nextSubFlow();
                    play('狼人请杀人');
                    toast('请裁判标记狼人所杀的人');
                } else if (subFlow == 1) {
                    play('狼人请闭眼');
                    Flow.nextFlow();
                }
            } else if (flowName == '女巫环节') {//女巫环节
                if (subFlow == 3) {
                    nextFlowStyle();
                    Flow.nextSubFlow();
                    play('女巫请睁眼');
                    // todo 屏幕显示被狼人所杀玩家
                } else if (subFlow == 2) {
                    Flow.nextSubFlow();
                    play('女巫是否用药');
                    toast('请裁判标记女巫用药所杀或救活之人');
                } else if (subFlow == 1) {
                    play('女巫请闭眼');
                    Flow.nextFlow();
                }
            } else if (flowName == '猎人环节') {// 猎人环节
                if (subFlow == 2) {
                    nextFlowStyle();
                    Flow.nextSubFlow();
                    play('猎人请睁眼');
                    toast('请裁判标记猎人位置');
                } else if (subFlow == 1) {
                    play('猎人请闭眼');
                    Flow.nextFlow();
                }
            } else if (flowName == '白痴环节') {// 白痴环节
                if (subFlow == 2) {
                    nextFlowStyle();
                    Flow.nextSubFlow();
                    play('白痴请睁眼');
                    toast('请裁判标记白痴位置');
                } else if (subFlow == 1) {
                    play('白痴请闭眼');
                    Flow.nextFlow();
                }
            } else if (flowName == '乌鸦环节') {// 乌鸦环节
                if (subFlow == 3) {
                    nextFlowStyle();
                    Flow.nextSubFlow();
                    play('乌鸦请睁眼');
                    toast('请裁判标记乌鸦位置');
                } else if (subFlow == 2) {
                    Flow.nextSubFlow();
                    play('乌鸦请标记');
                    toast('请裁判标记乌鸦制定的人');
                } else if (subFlow == 1) {
                    play('乌鸦请闭眼');
                    Flow.nextFlow();
                }
            } else if (flowName == '预言家环节') { //预言家环节
                if (subFlow == 3) {
                    nextFlowStyle();
                    Flow.nextSubFlow();
                    play('预言家请睁眼');
                    toast('请裁判标记预言家位置');
                } else if (subFlow == 2) {
                    Flow.nextSubFlow();
                    play('预言家请验人');
                } else if (subFlow == 1) {
                    play('预言家请闭眼');
                    Flow.nextFlow();
                    // todo 将剩余未标注的都标为平民
                }
            } else if (flowName == '竞选村长环节') {//天亮了,竞选村长环节
                if (subFlow == 2) {
                    nextFlowStyle();
                    Flow.nextSubFlow();
                    play('天亮了,请大家睁眼,现在开始竞选村长');
                } else if (subFlow == 1) {
                    play('现在开始投票,请大家第一时间投票,跟票无效!');
                    toast('请裁判标记村长位置');
                    Flow.nextFlow();
                    countDownAudio();
                }
            } else if (flowName == '投票环节') {// 投票环节
                //如果村长存在则，ｓｕｂＦｌｌｏｗ=3
                subFlow = checkCunZhangExits();
                if (subFlow == 4) {
                    nextFlowStyle();
                    Flow.nextSubFlow();
                    // todo　倒计时效果
                    setTimeout(function () {
                        showDialogForCunZhang()
                    }, 30 * 1000);
                } else if (subFlow == 3) {
                    Flow.nextSubFlow();
                    //if todo
                    play('昨晚yy号被杀,ff号玩家被毒害,请xx号玩家开始发言');
                } else if (subFlow == 2) {
                    Flow.nextSubFlow();
                    play('现在开始公投,请大家第一时间投票,跟票无效!');
                    countDownAudio();
                } else if (subFlow == 1) {
                    play('xx号玩家被公投出局,身份为ff');
                    // todo 这里要针对猎人和白痴做特殊判断
                    Flow.resetFlow();
                }
            }
        } else if (btnText == '隐藏身份') {
            $('.my-badge').hide();
            $(this).text('显示身份');
        } else if (btnText == '显示身份') {
            $('.my-badge').show();
            $(this).text('隐藏身份');
        } else if (btnText == '语音播报') {
            showAudioDialog();

            //} else if (btnText == '下局占位') {
            //    alert('下局占位');
        } else if (btnText == '打开大屏') {
            alert('打开大屏');
        }
    });

});