inlets = 1;
outlets = 1;

function moveto(index, x, y, z) {
	var spacer = 1.1;
	outlet(0, [0, "target", index]);
	outlet(0, [1, "moveto", x * spacer, y * spacer, z * spacer, 1]);
	
}

function msg_int(n)
{
	switch(n) {
		case 0:
			moveto(0, 0, 0, 0);
			break;
		case 1:
			moveto(0, 0, 0, 0);
			break;
		case 2:
			moveto(0, 1, 0, 0);
			moveto(1, -1, 0, 0);
			break;
		case 3:
			moveto(0, -2, 0, 0);
			moveto(1, 0, 0, 0);
			moveto(2, 2, 0, 0);
			break;
		case 4:
			moveto(0, -1, 1, 0);
			moveto(1, 1, 1, 0);
			moveto(2, 1, -1, 0);
			moveto(3, -1, -1, 0);
			break;
	}
}	


