var fs      =   require('fs');
var path    =   require('path');

var express =   require('express');

var app = express();
var port = process.env.PORT || 3434;

app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session( {secret : "my !@#!@#! secret"}));
    app.use(function(err, req, res, next){
        console.error(err.stack);
        res.send(500, 'Something broke!');
    });
    app.use(express.static('public'));

    var remoteObj = {
        add: function(a,b, callback){
            callback(null,1*a+1*b);
        },
        multiply: function(a,b, callback){
            callback(null,1*a*b);
        }
    };

    var rpcMiddleware = require('./../rpc-middleware.js');
    app.use('/rpc', rpcMiddleware('/helper.js', 'APIClient', remoteObj).middleware);


});

var server = app.listen(port);





