/**
 * Created by fy on 15-12-22.
 */
'use strict';
var sp = require('../../lib/pager/select-pager');
var db = require('../../config/db');
var dateFormat = require('date-format');
var fs = require('fs');
var date = require('../../lib/date');
var memberService = require('../member/index');

exports.index = function () {
    return 'room';
};

exports.list = function (req, res, next) {
    var selectSql = "SELECT * FROM room";
    var whereSql = " WHERE 1 = 1 \n";
    req.body.code && (whereSql += " AND code LIKE '%:code%' /*房间编号*/");
    req.body.status && (whereSql += " AND status = :status /*房间状态*/\n");
    sp.selectPager(req, res, db, selectSql, whereSql);
};

exports.add = function (code, seatCount, status, cb) {
    db.pool.query('INSERT INTO `room` (`code`, `seatCount`, `status`) VALUES (?, ?, ?)', [code, seatCount, status || 0], cb);
};

exports.updateRoom = function (code, seatCount, status, roomId, cb) {
    db.pool.query('UPDATE room SET code = ?, seatCount = ?, status = ? WHERE id = ?', [code, seatCount, status, roomId], cb);
};

exports.saveOrUpdateLayout = function (id, layoutJson, cb) {
    db.pool.query('UPDATE room SET layoutJson = ? WHERE id = ?', [layoutJson, id], cb);
};

exports.getRoomById = function (id, cb) {
    db.pool.query('SELECT * FROM room WHERE id = ?', [id], cb);
};

exports.updateRoomStatus = function (roomId, status, cb) {
    db.pool.query('UPDATE room SET status = ? WHERE id = ?', [status, roomId], cb);
};

/**
 * 建立游戏
 * @param gameName
 * @param judgment
 * @param office
 * @param type
 * @param roomId
 * @param judgmentId
 * @param cb
 */
exports.saveGame = function (gameName, judgment, office, type, roomId, judgmentId, cb) {
    var self = this;
    console.info(gameName, judgment, office, type, roomId, judgmentId);
    //todo 全局单价 需要变为可以配置
    var timePrice = 2.5;
    self.updateRoomStatus(roomId, 1, function (err, result) {
        if (!err) {
            var now = date.now();
            var status = '游戏中';
            db.pool.query('INSERT INTO `game` (`name`, `judgment`, `timePrice`, ' +
                '`status`, `startTime`, `office`, `type`, `room_id`, `judgment_id`) ' +
                'VALUES (?,?,?,?,?,?,?,?,?)',
                [gameName, judgment, timePrice, status, now, office, type, roomId, judgmentId], cb);
        }
    });

};

/**
 * 记录游戏和人员和座位之间的关系
 * @param memberId
 * @param gameId
 * @param status 出局/游戏中
 * @param seatCode
 * @param cb
 */
exports.saveGameHasMember = function (memberId, gameId, status, seatCode, cb) {
    var insertSql = 'INSERT INTO `member_has_game` (`member_id`, `game_id`, `status`, `seat_code`) VALUES (?,?,?,?)';
    db.pool.query(insertSql, [memberId, gameId, status, seatCode], cb);
};


/**
 * 座位登记
 * @param memberCode
 * @param gameId
 * @param seatCode 座位编号
 * @param cb
 */
exports.register = function (memberCode, gameId, seatCode, cb) {
    var self = this;
    console.log(memberCode);
    memberService.checkUserExits(memberCode, function (err, result) {
        if (err) return cb(new Error('系统不存在此会员'), result);
        if (!result || result.length != 1) return cb(new Error('数据错误,没有找到此会员或找到了同名的多个会员'), null);
        var member = result[0];
        console.log(JSON.stringify(member));
        console.log(gameId);
        self.saveGameHasMember(member.id, gameId, '游戏中', seatCode, function (err, result) {
            console.log(err);
            console.log(result);
            result.member = member;
            cb(err, result);
        });
    });
};

/**
 * 更改用户身份
 * @param gameId
 * @param memberId
 * @param identify
 */
exports.updateIdentity = function (gameId, memberId, identify, cb) {
    var updateSql = 'UPDATE member_has_game SET identity = ? WHERE member_id = ? AND game_id = ?';
    db.pool.query(updateSql, [identify, memberId, gameId], cb);
};

/**
 * 罚分
 * @param gameId
 * @param memberId
 * @param penalty
 * @param cb
 */
exports.updatePenalty = function (gameId, memberId, penalty, cb) {
    var updateSql = 'UPDATE member_has_game SET integral = ? WHERE member_id = ? AND game_id = ?';
    db.pool.query(updateSql, [penalty, memberId, gameId], cb);
};

/**
 * 批量修改用户在当前游戏中所得或缩减的积分
 * @param score
 */
exports.updateScore = function (score) {
    var self = this;
    _.each(score, function (s) {
        self.updatePenalty(s.gameId, s.memberId, s.penalty, function (err, result) {
            if (!err) {// 累加到总积分上
                memberService.updateIntegration(s.memberId, s.penalty, function () {
                });
            }
        });
    });
};

/**
 * 游戏结束的处理
 * @param roomId
 * @param score
 * @param cb
 */
exports.gameOver = function (roomId, score, cb) {
    this.updateScore(score);
    this.updateRoomStatus(roomId, 0/*空闲*/, cb);
};