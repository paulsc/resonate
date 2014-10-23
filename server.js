var util = require('util')
var ws = require('nodejs-websocket')
var osc = require('node-osc')
var winston = require('winston')
var express = require('express')
var lib = require('./lib')
var _ = require('underscore')
var keypress = require('keypress')
var fs = require('fs')
var lazy = require('lazy')

var OSC_PORT = 4711
var OSC_HOST = 'localhost'
var WEBSOCKET_PORT = 8001
var HTTP_PORT = 8000

var RECORD_FILE = 'session.rec'

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({ 
            level: 'info',
            timestamp: true, 
            colorize: true 
        }),
    ]
})

var parseNumbers = function(arr) {
    return _.map(arr, function(el) { return isNaN(el) ? el : +el })
}

var client = new osc.Client(OSC_HOST, OSC_PORT)
logger.info('sending OSC data to ' + OSC_HOST + ' on port: ' + OSC_PORT)

var app = express()
app.use(express.static('static'))
app.get('/', function(req, res) {
    logger.info('got index request from: ' + req.ip)
    var url = util.format('ws://%s:%s/', lib.findClosestIP(req.ip), WEBSOCKET_PORT)
    res.render('index.ejs', { websocket_url: url})
})
app.listen(HTTP_PORT)
logger.info ('web server started on port: ' + HTTP_PORT)


// websocket stuff

var currentId = 1
var server = ws.createServer(function(conn) {
    var connectionId = currentId++;
    logger.debug("new connection, assigned id: " + connectionId)
    conn.on("text", function (str) {
        logger.debug("connection #" + connectionId + " received: " + str)
        split = str.split("|")
        var payload = parseNumbers(split)
        payload.unshift("/" + connectionId)
        client.send.apply(client, payload)

        if (record) {
            var line = payload.join("|") + require('os').EOL
            fs.appendFile(RECORD_FILE, line, function(err) {
                if (err) throw err
            })
        }
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


// simulator stuff
var simulators = []
var record = false

keypress(process.stdin);
process.stdin.on('keypress', function (ch, key) {
    if (key && key.ctrl && key.name == 'c') {
        logger.info('exiting...')
        process.exit()
    }
    else if (key && key.name == 'space') {
        var recording = fs.readFileSync(RECORD_FILE).toString().split("\n")
        var lineCounter = 0
        var simulatorId = currentId++
        logger.info('added simulator #' + simulatorId)
        var color = Math.round(Math.random() * 255)
        var timer = setInterval(function() {
            var line = recording[lineCounter++]
            var payload = line.split('|')
            payload[0] = "/" + simulatorId
            payload[1] = color
            payload = parseNumbers(payload)

            client.send.apply(client, payload)
            logger.debug('simulator #' + simulatorId + ' sending: ' + payload)

            if (lineCounter == recording.length) lineCounter = 0
        }, 50)
        simulators.push(timer)
    }
    else if (key && key.name == 'backspace') {
        logger.info('removing simulator')
        var timer = simulators.pop()
        clearInterval(timer)
    }
    else if (key && key.ctrl && key.name == 'r') {
        if (record) {
            record = false
            logger.info('recording stopped.')
            return
        }

        logger.info('recording...')
        fs.unlink(RECORD_FILE, function(err) {
            if (err && err.code != 'ENOENT') throw err 
        })
        record = true
    }
});

process.stdin.setRawMode(true);
process.stdin.resume();

logger.info('press space to add a simulator, backspace to remove one')
_
