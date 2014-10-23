inlets = 1;
outlets = 2;

var spacer = 1.3;

function moveto(index, x, y, z) {
	outlet(0, [0, "target", index]);
	outlet(0, [1, "moveto", x * spacer, y * spacer, z * spacer, 1]);	
}

function position(index, x, y, z) {
	outlet(0, [0, "target", index]);
	outlet(0, [2, "position", x * spacer, y * spacer, z * spacer]);	
}

function movecamera(z) {
	outlet(1, 9);
}

function msg_int(n)
{
	switch(n) {
		case 0:
			moveto(1, 0, 0, 0);
			break;
		case 1:
			moveto(1, 0, 0, 0);
			break;
		case 2:
			moveto(1, -1, 0, 0);
			moveto(2, 1, 0, 0);
			break;
		case 3:
			moveto(1, -2, 0, 0);
			moveto(2, 0, 0, 0);
			position(3, 1, 0, 0);
			moveto(3, 2, 0, 0);
			break;
		case 4:
			moveto(1, -1, 1, 0);
			moveto(2, 1, 1, 0);
			moveto(3, 1, -1, 0);
			moveto(4, -1, -1, 0);
			break;
		case 5:
			moveto(1, -2, 1, 0);
			moveto(2, 0, 1, 0);
			moveto(3, 2, 1, 0);
			moveto(4, -1, -1, 0);
			position(5, 1, -1, 0);
			moveto(5, 1, -1, 0);
			break
		case 6:
			moveto(1, -2, 1, 0);
			moveto(2, 0, 1, 0);
			moveto(3, 2, 1, 0);
			moveto(4, -2, -1, 0);
			moveto(5, 0, -1, 0);
			position(6, 1, -1, 0);
			moveto(6, 2, -1, 0);
			break;
		case 7:
			moveto(1, -2, 2, 0);
			moveto(2, 0, 2, 0);
			moveto(3, 2, 2, 0);
			moveto(4, -2, 0, 0);
			moveto(5, 0, 0, 0);
			moveto(6, 2, 0, 0);
			position(7, 0, -1, 0);
			moveto(7, 0, -2, 0);
			movecamera(9);
			break;
		case 8:
			moveto(1, -2, 2, 0);
			moveto(2, 0, 2, 0);
			moveto(3, 2, 2, 0);
			moveto(4, -2, 0, 0);
			moveto(5, 0, 0, 0);
			moveto(6, 2, 0, 0);
			moveto(7, -1, -2, 0);
			position(8, 0, -2, 0);
			moveto(8, 1, -2, 0);
			break;			
		case 9:
			moveto(1, -2, 2, 0);
			moveto(2, 0, 2, 0);
			moveto(3, 2, 2, 0);
			moveto(4, -2, 0, 0);
			moveto(5, 0, 0, 0);
			moveto(6, 2, 0, 0);
			moveto(7, -2, -2, 0);
			moveto(8, 0, -2, 0);
			position(9, 1, -2, 0);			
			moveto(9, 2, -2, 0);
			break;					
	}
}	


