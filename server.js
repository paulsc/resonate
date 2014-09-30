var util = require('util')
var ws = require('nodejs-websocket')
var osc = require('node-osc')
var winston = require('winston')
var os = require('os')
var express = require('express')

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({ timestamp: true, colorize: true }),
    ]
})

var OSC_PORT = 4711
var WEBSOCKET_PORT = 8001
var HTTP_PORT = 8000

var client = new osc.Client('localhost', OSC_PORT)

var app = express()
app.get('/', function(req, res) {
    res.render('index.ejs', { websocket_url: "ws://localhost:8001/" })
})
app.listen(HTTP_PORT)
logger.info ('web server started on port: ' + HTTP_PORT)

var currentId = 0
var server = ws.createServer(function(conn) {
    var connectionId = currentId++;
    logger.info("new connection, assigned id: " + connectionId)
    conn.on("text", function (str) {
        value = str.split("|")[1]
        logger.info("received from connection " + connectionId + ": " + str)
        client.send("/" + connectionId, value)
    })
    conn.on("close", function(code, reason) {
        logger.info("connection closed: " + code)
    })
}).listen(WEBSOCKET_PORT)

logger.info('websocket server started on port: ' + WEBSOCKET_PORT)

logger.info('open one of these on your phone:')
var ifaces = os.networkInterfaces()
for (var dev in ifaces) {
  ifaces[dev].forEach(function(details){
    if (details.family == 'IPv4' && dev != 'lo0') {
      logger.info('http://' + details.address + ':' + HTTP_PORT)
    }
  })
}


