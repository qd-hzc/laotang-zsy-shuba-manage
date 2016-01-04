/**
 * Created by fy on 15-12-22.
 */
'use strict';
var express = require('express');
var router = express.Router();
var fs = require('fs');
var utils = require('../../lib/utils');
var roomService = require('../../service/room/index');
var userService = require('../../service/user/index');

router.get('/', function (req, res, next) {
    console.log('------->', roomService.index());
    res.render('room/index');
});

router.route('/list').get(roomService.list).post(roomService.list);

router.post('/add', function (req, res, next) {
    var code = req.body.code, seatCount = req.body.seatCount;
    if (!code || code.length < 2 || code.length > 6)
        return utils.jsonpAndEnd(res, 'parent.validate("code","房间号长度须在3到5之间")');
    if (!seatCount || seatCount < 10 || seatCount > 18)
        return utils.jsonpAndEnd(res, 'parent.validate("seatCount","座位数量必须在10到18之间")');
    roomService.add(code, seatCount, 0, function (err, result) {
        res.send('<script>parent.cbJsonp(' + result.insertId + ', true)</script>');
    });
});

router.post('/update', function (req, res, next) {
    var roomId = req.body.roomId;
    var code = req.body.code;
    var seatCount = req.body.seatCount;
    var status = req.body.status;
    console.log(roomId);
    console.log(code);
    console.log(seatCount);
    console.log(status);
    roomService.updateRoom(code, seatCount, status, roomId, function (err, result) {
        console.error(err);
        res.send('<script>parent.cbJsonp(' + roomId + ', true)</script>');
    });
});

router.get('/layout', function (req, res, next) {
    res.render('room/layout', {roomId: req.query.id, code: req.query.code});
});

router.post('/saveLayout', function (req, res, next) {
    var id = req.body.id;
    var layoutJson = req.body.layoutJson;
    roomService.saveOrUpdateLayout(id, layoutJson, function (err, result) {
        res.send(result);
    });
});

router.post('/getLayout', function (req, res, next) {
    roomService.getRoomById(req.body.id, function (err, result) {
        if (err)throw err;
        res.send(result[0].layoutJson);
    });
});

/**
 * 跳转到游戏界面
 */
router.get('/open', function (req, res, next) {
    var roomCode = req.query.roomCode;
    var judgment = req.query.judgment;
    var office = req.query.office;
    var type = req.query.type;
    var roomId = req.query.roomId;
    var judgmentId = req.query.judgmentId;
    var gameName = office + '-' + type + '-' + roomCode;

    roomService.saveGame(gameName, judgment, office, type, roomId, judgmentId,
        function (err, result) {
            if (err)throw err;
            res.render('room/game',
                {roomId: roomId, roomCode: roomCode, office: office, type: type, gameId: result.insertId});
        });
});

/**
 * 座次登记
 */
router.post('/register', function (req, res, next) {
    var memberCode = req.body.memberCode;
    var gameId = req.body.gameId;
    var seatCode = req.body.seatCode;
    roomService.register(memberCode, gameId, seatCode, function (err, result) {
        result.status = !err;
        res.send(result);//{status:true,member:{id:xx,code:9102}}
    });
});

/***
 * 更新用户的身份
 */
router.post('/updateIdentity', function (req, res, next) {
    var memberId = req.body.memberId;
    var gameId = req.body.gameId;
    var identity = req.body.identity;
    roomService.updateIdentity(gameId, memberId, identity, function (err, result) {
        console.error(err);
        res.send({status: !err});
    });
});

/**
 * 罚分
 */
router.post('/penalty', function (req, res, next) {
    var penalty = req.body.penalty;
    var gameId = req.body.gameId;
    var memberId = req.body.memberId;
    roomService.updatePenalty(gameId, memberId, penalty, function (err, result) {
        console.error(err);
        res.send({status: !err});
    });
});

/**
 * 保存游戏所得分数给每个赢了的人
 */
router.post('/gameOver', function (req, res, next) {
    roomService.gameOver(req.body.roomId, req.body.score, function (err, result) {
        res.send({status: !err});
    });
});
module.exports = router;
