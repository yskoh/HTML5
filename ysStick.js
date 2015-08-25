var canvas = document.querySelector('.canvas');
var context = canvas.getContext('2d');
var stickLength = 0;
var pressed = false;
var columns = [];
var colWidths =[10,20,25,40,45,60,65,,80,85,100,105,150,200];
var colDistances =[50,100,150,200,250];
var COL_HEIGHT = 200;
var startX = 50;
var ballRadius = 10;
var stickWidth = 5;
var ballMove = 0;
var gameState = true;
var nextLevel = false;

var randWidth1 = random(colWidths);
var randWidth2 = random(colWidths);
var randDistance = random(colDistances);

function random(array){
	var max = array.length;
	var min =0;
	return array[Math.floor(Math.random() * (max - min) + min)];
}

//column
function renderColumns(){
		var x = startX;
		var y = canvas.height - COL_HEIGHT;

		context.fillStyle = 'black';
		context.fillRect(x, y, randWidth1, COL_HEIGHT);

		context.fillStyle ='blue';
		context.fillRect(x + randWidth1 + randDistance, y, randWidth2, COL_HEIGHT);
}
//ball 	
function renderBall(){
	context.beginPath();
	context.arc(startX + randWidth1/2, canvas.height - COL_HEIGHT- ballRadius, ballRadius, 0, 2 * Math.PI, false);
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
	stickFall();
}

function renderStick(){
	context.fillStyle ='gray';
	context.fillRect(startX + randWidth1 - stickWidth, canvas.height - COL_HEIGHT - stickLength,stickWidth, stickLength);
}

//stick animation
function radianToDegree(angle){
	return angle/180*Math.PI;
}

var angle = -90;

function stickFall(){
	var cx = startX + randWidth1 - stickWidth;
	var cy = canvas.height - COL_HEIGHT;
	var endX = stickLength;
	var endY = COL_HEIGHT;
	// var length = stickLength;

	// console.log("stick fall");
	context.strokeStyle = "gray";
	context.lineWidth = 4;

	if(angle < 0){
		angle+=3;
	}
	
	endX = cx + Math.cos(radianToDegree(angle))*stickLength;
	endY = cy + Math.sin(radianToDegree(angle))*stickLength; 

  
	context.moveTo(cx,cy);
	context.lineTo(endX,endY);
	context.stroke();
}

//ball animation
function ballRoll(){
	//if no bridge
	if(!stickLength){
		return;
	}
	if(stickLength < randDistance || stickLength > randDistance + randWidth2){
		console.log("DIE!!");
	}

	if(stickLength > randDistance && stickLength < randDistance + randWidth2){
		//if long enough
		context.beginPath();
		context.arc(startX + randWidth1/2 + ballMove, canvas.height - COL_HEIGHT- ballRadius, ballRadius, 0, 2 * Math.PI, false);
		context.fillStyle = 'pink';
		context.fill();
		setTimeout(function(){
			if(ballMove < randWidth1/2 + randDistance + randWidth2/2){
				ballMove +=5;
			}	
			nextLevel = true;
		}, 1500);
		screenChange();
	}
}

//screen change animation
function screenChange(){
	var moveCol = 0;
	if(nextLevel){
		if(randWidth1 + startX + randDistance > startX){
			context.fillStyle='black';
			context.fillRect(startX + randWidth1 + randDistance - moveCol,canvas.height - COL_HEIGHT, randWidth2, COL_HEIGHT);
			moveCol= moveCol+10;
		}
		randWidth1 = randWidth2;
		randWidth2 = random(colWidths);
		context.fillRect(startX, canvas.height - COL_HEIGHT, randWidth2, COL_HEIGHT);
		stickLength = 0;
	}
}

function draw(){	
	context.clearRect(0,0, canvas.width, canvas.height);
	renderBall();
	renderColumns();
	stickGrow();
	ballRoll();
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

