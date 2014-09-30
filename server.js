var util = require('util')
var ws = require('nodejs-websocket')
var osc = require('node-osc')
var winston = require('winston')
var express = require('express')
var lib = require('./lib')
var _ = require('underscore')

var OSC_PORT = 4711
var OSC_HOST = 'localhost'
var WEBSOCKET_PORT = 8001
var HTTP_PORT = 8000

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({ 
            level: 'debug',
            timestamp: true, 
            colorize: true 
        }),
    ]
})

var client = new osc.Client(OSC_HOST, OSC_PORT)
logger.info('sending OSC data to ' + OSC_HOST + ' on port: ' + OSC_PORT)

var app = express()
app.get('/', function(req, res) {
    logger.info('got index request from: ' + req.ip)
    var url = util.format('ws://%s:%s/', lib.findClosestIP(req.ip), WEBSOCKET_PORT)
    res.render('index.ejs', { websocket_url: url})
})
app.listen(HTTP_PORT)
logger.info ('web server started on port: ' + HTTP_PORT)

var currentId = 0
var server = ws.createServer(function(conn) {
    var connectionId = currentId++;
    logger.debug("new connection, assigned id: " + connectionId)
    conn.on("text", function (str) {
        value = str.split("|")[1]
        logger.debug("connection #" + connectionId + " received: " + str)
        client.send("/" + connectionId, value)
    })
    conn.on("close", function(code, reason) {
        logger.debug('connection #' + connectionId +' closed')
    })
    conn.on("error", function(error) {
        logger.debug('connection #' + connectionId + ' error: ' + error.code)
    })
}).listen(WEBSOCKET_PORT)

logger.info('websocket server started on port: ' + WEBSOCKET_PORT)

logger.info('open one of these on your phone:')
_.each(lib.getIPList(), function(ip) {
    if (ip == '127.0.0.1') return
    logger.info('http://' + ip + ':' + HTTP_PORT)
})
