'use strict';

var express = require('express');
var http = require('http');
var querystring = require('querystring');
var host = require("./host1.json");
var localtask = require("./localtask");

var bodyParser = require('body-parser');
var app = express();

//app.use(bodyParser);
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies


var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();

/**
 * Manage the GET requests. Forward a GET to children servers
 */
app.get('/', function (req, res) {
    var query = querystring.stringify(req.query);
    if(host.children&&host.children.length>0){
        http.get(host.children[0].url+"?"+query, function(response) {
            // Continuously update stream with data
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {
                res.send(localtask.catResponses(localtask.execute({"query":query,"host":host}),body));
            });

        }).on('error', function(e) {
            res.send(host.name+"="+query+" error "+ e.message);
        });
    }
    else{
        res.send(localtask.execute({"query":query,"host":host}));
    }
});
/**
 * Manage the POST requests. Forward a POST to children servers
 */
app.post('/', function(req, res) {
    var query = querystring.stringify(req.body);
    var post_data = querystring.stringify(req.body);

    console.log("Query "+query);
    if(host.children&&host.children.length>0){
        host.children[0].method='POST';
        host.children[0].headers= {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": post_data.length
        };
      //  proxy.web(req, res, { target: host.children[0].url});

        var post_req = http.request(host.children[0], function(response) {
            response.setEncoding('utf8');
            var body = '';
            response.on('data', function (chunk) {
                body += chunk;
            });
            response.on('end', function() {
                res.send(localtask.catResponses(localtask.execute({"query":query,"host":host}),body));
            });
        }).on('error', function(e) {
            res.send(host.name+"="+query+" error "+ e.message);
        });

        post_req.write(post_data);
        post_req.end();
    }
    else{
        res.send(localtask.execute({"query":query,"host":host}));
    }
});

var server = app.listen(host.port, function () {

    var host = server.address().address;
    var port = server.address().port;
    console.log(localtask);
    localtask.onInit();

    console.log('Example app listening at http://%s:%s', host, port);

});
