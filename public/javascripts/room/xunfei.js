/**
 * Created by fy on 15-12-25.
 */
'use strict';
/**
 * 初始化Session对象
 */
var session = new IFlyTtsSession({
    'url': 'http://webapi.openspeech.cn/',
    'interval': '30000',
    'disconnect_hint': 'disconnect',
    'sub': 'tts'
});
var audio = null;
/**
 * 输入文本，输出语音播放链接
 * @content 待合成文本(不超过4096字节)
 */
function play(content) {
    /***********************************************************以下签名过程需根据实际应用信息填入***************************************************/
    var appid = "567cfa3a";                              //应用APPID，在open.voicecloud.cn上申请即可获得
    var timestamp = '下午4:26:04';//todo  new Date().toLocaleTimeString();                      //当前时间戳，例new Date().toLocaleTimeString()
    var expires = 60000;                          //签名失效时间，单位:ms，例60000
    //!!!为避免secretkey泄露，签名函数调用代码建议在服务器上完成
    var signature = faultylabs.MD5(appid + '&' + timestamp + '&' + expires + '&' + "d60532654a302e7e");
    /************************************************************以上签名过程需根据实际应用信息填入**************************************************/
    var params = {
        "params": "aue = speex-wb;7, ent = intp65, spd = 50, vol = 50, tte = utf8, caller.appid=" + appid + ",timestamp=" + timestamp + ",expires=" + expires,
        "signature": signature,
        "gat": "mp3"
    };
    console.log(params)
    session.start(params, content, function (err, obj) {
        if (err) {
            alert("语音合成发生错误，错误代码 ：" + err);
        } else {
            if (audio != null) {
                audio.pause();
            }
            audio = new Audio();
            audio.src = '';
            audio.play();
            audio.src = "http://webapi.openspeech.cn/" + obj.audio_url;
            audio.play();
        }
    });
};