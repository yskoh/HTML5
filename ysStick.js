var canvas = document.querySelector('.canvas');
var context = canvas.getContext('2d');
var stickLength = 0;
var pressed = false;
var columns = [];
var COL_HEIGHT = 200;
var startX = 50;
var ballRadius = 10;
var stickWidth = 5;
var ballMove =0;

var randWidth = 100;
var randDistance = 100;

function updateColumns() {
    if (columns.length === 2){
        return;
    }

    while (columns.length < 2){
        columns.push(makeColumn());
    }

    renderColumns();
}

function makeColumn(){
	return {
		width: randWidth,
		height: COL_HEIGHT
	}
}
//column
function renderColumns(){
	context.fillStyle = 'black';
	context.fillRect(startX, canvas.height - COL_HEIGHT, columns[0].width, COL_HEIGHT);

	context.fillStyle ='blue';
	context.fillRect(startX + columns[0].width + randDistance, canvas.height - COL_HEIGHT, columns[1].width, COL_HEIGHT);
}
//ball 	
function renderBall(){
	context.beginPath();
	context.arc(startX + randWidth/2, canvas.height - COL_HEIGHT- ballRadius, ballRadius, 0, 2 * Math.PI, false);
	context.fillStyle = 'pink';
	context.fill();
}


function stickGrow(){
	if(pressed){
		stickLength +=5;
		renderStick();
		return;
	}
	if(!pressed && stickLength === 0){
		return;
	}

	// stickFall();
}

function renderStick(){
	context.fillStyle ='gray';
	context.fillRect(startX + columns[0].width - stickWidth, canvas.height - COL_HEIGHT - stickLength,stickWidth, stickLength);
}

//stick animation
function stickFall(){
	console.log("stick fall");
}

//ball animation
function ballRoll(){
	//if no bridge
	// return;

	//if long enough
	context.clearRect(0,0, canvas.width, canvas.height);
	renderColumns();
	context.beginPath();
	context.arc(startX + randWidth/2 + ballMove, canvas.height - COL_HEIGHT- ballRadius, ballRadius, 0, 2 * Math.PI, false);
	context.fillStyle = 'pink';
	context.fill();
	if(ballMove < columns[0].width/2 + randDistance + columns[1].width/2){
		ballMove +=5;
	}

	//if bridge not long
	// die
}

//screen change animation
function screenChange(){
	var prepNextBar = context.getImageData(50, 0, canvas.width - 50, canvas.height);
	context.putImageData( prepNextBar,0, 0);
	// context.clearRect(canvas.width-50, 0, 50, canvas.height);
	if(nextLevel){
		nextBar();
		return;
	}
}

function nextBar(){
	console.log("reset");
	stickLength =0;
	columns.shift();

	context.clearRect(0,0, canvas.width, canvas.height);
}
function draw(){	
	updateColumns();
	renderBall();
	stickGrow();
	renderStick();
	ballRoll();
	screenChange();
	window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);
//mousedown event
document.addEventListener('mousedown', function(){
	pressed = true;
	console.log("pressed");
});

document.addEventListener('mouseup', function(){
	pressed = false;
	console.log("up");
});

