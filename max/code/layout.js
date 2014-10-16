inlets = 1;
outlets = 1;

function moveto(index, x, y, z) {
	outlet(0, [0, "target", index]);
	outlet(0, [1, "moveto", x, y, z, 1]);
	
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
	}
}	


