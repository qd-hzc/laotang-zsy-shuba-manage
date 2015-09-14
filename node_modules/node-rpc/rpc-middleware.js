
module.exports = function(helperUrl, rpcClientClassName, remoteObj){

    var express = require('express');
    var Mustache = require('mustache');
    var fs = require('fs');

    var rpcRouter = new express.Router();

    rpcRouter.get('/test', function(req, res){ res.send(200, "test successful..."); });

    rpcRouter.get(helperUrl, function(req, res){

        var data = {
            RPCClientClassName : rpcClientClassName,
            methods: []
        };

        for(method in remoteObj){
            if (typeof(remoteObj[method])==='function'){
                data.methods.push({method_name:method});
            }
        }

        var helperTemplatePath = require('path').resolve(__dirname, 'helper.mustache');

        var jsContent = Mustache.render(fs.readFileSync(helperTemplatePath).toString(), data);

        res.end(jsContent);
    });


    rpcRouter.post('/:method', function(req, res){
        var method = req.params.method;
        var args = req.body.args;

        if (remoteObj.hasOwnProperty(method) && typeof(remoteObj[method])==='function'){
            var fn = remoteObj[method];
            args.push(function(error,result){
                res.set('Content-Type', 'application/json');
                res.send(200, JSON.stringify(result));
            });
            fn.apply({request:req}, args);
        }else{
            res.send(500);
        }

    });

    return rpcRouter;


};