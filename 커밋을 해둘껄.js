

var colDistances = [50, 100];

var Map = (function(){
	var pressed = false;

	return {
		isPressed: function(){
			return pressed;
		},
		setPressed : function(flag) {
			pressed = flag;
		},
	    getCanvas: function() {
	        return document.querySelector('.canvas');
	    },
	    getContext: function() {
	        return this.getCanvas().getContext('2d');
	    },
	    getMap: function() {
	        return this.context;
	    },
	    getHeight: function() {
	        return this.getCanvas().height;
	    },
	    getWidth: function() {
	        return this.canvas.width;
	    }	
	}
})();

var START_X = 50;
var firstColumn = new Column(START_X);
var secondColumn = new Column(firstColumn.getEndPoint() + getRandomValue(colDistances));

// 생성자 패턴 new Column() 으로 사용한다.
function Column(startX) {
    this.width = 0;
    this.height = 200;
    this.color = "black";
    this.startX = startX;

    // 메소드 들
    this.getHeight = function() {
        return this.height;
    };
    this.getWidth = function() {
        return this.width;
    };
    this.getMidPoint = function() {
        return this.startX + (this.width / 2);
    };
    this.getEndPoint = function() {
        return this.startX + this.width;
    };
    this.draw = function(startX) {
        var context = Map.getContext();
        var startHeight = Map.getHeight() - this.height;
        context.fillStyle = this.color;
        context.fillRect(startX, startHeight, this.getWidth(), this.getHeight());
    };
    this.__setRandomWidth = function() {
        var colWidths = [80, 85, 100, 105, 150, 200];
        this.width = getRandomValue(colWidths);
    };

    // 초기화
    this.__setRandomWidth();
    this.draw(startX);
}

// 모듈 패턴
var Ball = (function() {
    var color = "pink";
    var startAngle = 0;
    var endAngle = 2 * Math.PI;

    return {
        draw: function(startX, columnHeight) {
            var context = Map.getContext();
            var ballRadius = 10;
            context.arc(startX, Map.getHeight() - columnHeight - ballRadius, ballRadius, startAngle, endAngle);
            context.fillStyle = color;
            context.fill();
        }
    }
})();


// 스틱이 필요한 위치도 있어야 해요
// 스틱은 넘어져요

var Stick = {
	length : 0,
	thickness : 5,
	color : "grey",

	draw : function(column){
		this.render(column.getEndPoint(), column.getHeight())
	},
	grow : function(length) {
		this.length += length;
	},
	fall : function(){

	},
	render : function(columnEndPoint, columnHeight) {
		context.fillStyle = color;
		context.fillRect(columnEndPoint - this.thickness, Map.getHeight() - columnHeight - this.length, this.thickness, this.length);
	}
}
// stick.draw(fistColumn.getEndPoint())



// 게임을 완전 처음 들어왔을때
function gameInit() {
    drawInitialColumnAndBall();
    addMouseEvent();
}

function drawInitialColumnAndBall() {
    
    Ball.draw(firstColumn.getMidPoint(), firstColumn.getHeight());
}

function addMouseEvent() {
	var map = Map.getCanvas();
    map.addEventListener("mousedown", whileMouseIsPressed);
	map.addEventListener("mouseup", whenMouseIsUp);
}

function whileMouseIsPressed() {
	Map.setPressed(true);
	growStick();
}

function whenMouseIsUp() {
	Map.setPressed(false);
}

function growStick() {
	if(Map.isPressed()){
		var growAmount = 5;
		Stick.grow(growAmount);
		Stick.draw();
		return;
	}

	if(Map.isPressed() === false && stickLength === 0){
		return;
	}

	//stickFall();
}

function getRandomValue(array) {
    var max = array.length - 1;
    var min = 0;
    return array[Math.round(Math.random() * (max - min) + min)];
}

gameInit();









