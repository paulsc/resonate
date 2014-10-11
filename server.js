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
            level: 'debug',
            timestamp: true, 
            colorize: true 
        }),
    ]
})

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

var currentId = 0
var server = ws.createServer(function(conn) {
    var connectionId = currentId++;
    logger.debug("new connection, assigned id: " + connectionId)
    conn.on("text", function (str) {
        logger.debug("connection #" + connectionId + " received: " + str)
        split = str.split("|")
        var value = parseFloat(split[1])
        var color = parseInt(split[0])
        client.send("/" + connectionId, value, color)
        if (record) {
            var line = value + '|' + color + require('os').EOL
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
        var color = Math.random()
        var bg = HSVtoRGB(color, 1, 1);

        var timer = setInterval(function() {
            var line = recording[lineCounter++]
            var split = line.split('|')
            var value = parseFloat(split[0])
            client.send("/" + simulatorId, value, bg.r, bg.g, bg.b)
            logger.debug('simulator #' + simulatorId + ' sending: ' + value)
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


function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (h && s === undefined && v === undefined) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
r: Math.floor(r * 255),
       g: Math.floor(g * 255),
       b: Math.floor(b * 255)
    };
}


