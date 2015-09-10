module.exports = function (helperUrl, rpcClientClassName, remoteObj) {

    var express = require('express');
    var Mustache = require('mustache');
    var fs = require('fs');

    var rpcRouter = new express.Router();

    rpcRouter.get('/test', function (req, res) {
        res.send(200, "test successful...");
    });

    rpcRouter.get(helperUrl, function (req, res) {

        var port = (process.env.PORT || '3333');

        var data = {
            RPCClientClassName: rpcClientClassName,
            methods: [],
            port: port,
            host: req.host
        };

        for (method in remoteObj) {
            if (typeof(remoteObj[method]) === 'function') {
                data.methods.push({method_name: method});
            }
        }

        var helperTemplatePath = require('path').resolve(__dirname, 'helper.mustache');

        var jsContent = Mustache.render(fs.readFileSync(helperTemplatePath).toString(), data);

        res.end(jsContent);
    });


    rpcRouter.post('/:method', function (req, res) {
        var method = req.params.method;
        var args = JSON.parse(req.body.args);
        console.log('params:');
        console.log(req.body.args);

        if (remoteObj.hasOwnProperty(method) && typeof(remoteObj[method]) === 'function') {
            var fn = remoteObj[method];
            args.push(function (result) {
                res.set('Content-Type', 'application/json');
                var json= JSON.stringify(result);
                console.log('return:');
                console.log(json);
                res.send(200, json);
            });
            fn.apply({request: req}, args);
        } else {
            res.send(500);
        }

    });

    return rpcRouter;


};