var fs = require('fs')
var FFT = require('fft')
var _ = require('underscore')

var input = fs.readFileSync('debug-values-only').toString().split("\n")
// 50ms interval on sample = 20Hz
// 80 BPM -> 1 beat every 750ms 
// frequency: 1.3 Hz

input.splice(input.length - 1, 1)

//console.log(input)

//var input = _.map(_.range(100), function(x) { return Math.sin(x) })
var samplingRate = 20

var autoCorrel = function(values, period) {
    var result = 0
    for (var i = 0; i < values.length; i++) {
        result += values[i] * values[(i + period) % values.length]
    }
    return result
}

console.log(input.length)

valuesWithIndex = []
for (var i = 1; i < input.length / 2; i++) {
    valuesWithIndex.push({ value: autoCorrel(input, i), index: i })
}

var ordered = _.sortBy(valuesWithIndex, function(entry) { return entry.value })

console.log(ordered.slice(ordered.length - 10, ordered.length))

var max = ordered[ordered.length - 1].index
var bpm = 60 / (max * 0.05)
console.log('\rBPM: ' + bpm)
