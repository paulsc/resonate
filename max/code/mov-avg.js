inlets = 1;
outlets = 1;

var values = [];
var SIZE = 50;

function msg_int(n)
{
	values.push(n);
	if (values.length > SIZE) values.shift();
	
	var sum = 0;
	for (i = 0; i < values.length; i++) {
		sum += values[i];
	}

	var movavg = Math.round(sum / values.length);

	outlet(0, movavg);
}
