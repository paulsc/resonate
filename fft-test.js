var fs = require('fs')
var FFT = require('fft')
var _ = require('underscore')

var input = fs.readFileSync('session.rec').toString().split("\n")
// sampled once every 50ms = 20 Hz 
// for every 50 samples we have roughly 4 finger taps
// that's a tap every 2,5s

//var input = _.map(_.range(100), function(x) { return Math.sin(x) })
var samplingRate = 20

var fft = new FFT.complex(input.length, false)

var output = new Array()

fft.simple(output, input, 'real')

var filterfn = function(value, index) { 
    return index % 2 == 0 && index <= input.length
}

var freq = function(index) { 
    return index * samplingRate / input.length
}

var realvalues = _.map(_.filter(output, filterfn), Math.abs)

var frequencies = _.map(realvalues, 
    function(value, index) { return { value: value, freq: freq(index) }})

var ordered = _.sortBy(frequencies, function(freq) { return freq.value })

console.log(ordered.slice(ordered.length - 10, ordered.length))


