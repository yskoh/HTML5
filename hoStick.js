var BridgeGame = {};

BridgeGame.Map = (function() {
    var pressed = false;

    return {
        isPressed: function() {
            return pressed;
        },
        setPressed: function(flag) {
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
            return this.getCanvas().width;
        }
    }
})();

// 생성자 패턴 new BridgeGame.Column() 으로 사용한다.
BridgeGame.Column = function(startX) {
    this.width = 0;
    this.height = 200;
    this.color = "black";
    this.startX = startX;

    // 초기화
    this.__setRandomWidth();
    this.draw(startX);
}

BridgeGame.Column.prototype.getHeight = function() {
    return this.height;
};
BridgeGame.Column.prototype.getWidth = function() {
    return this.width;
};
BridgeGame.Column.prototype.getMidPoint = function() {
    return this.startX + (this.width / 2);
};
BridgeGame.Column.prototype.getEndPoint = function() {
    return this.startX + this.width;
};
BridgeGame.Column.prototype.draw = function(startX) {
    var context = BridgeGame.Map.getContext();
    var startHeight = BridgeGame.Map.getHeight() - this.height;
    context.beginPath();
    context.fillStyle = this.color;
    context.fillRect(startX, startHeight, this.getWidth(), this.getHeight());
    context.closePath();
};
BridgeGame.Column.prototype.drawAgain = function() {
	this.draw(this.startX);
}
BridgeGame.Column.prototype.__setRandomWidth = function() {
    var colWidths = [80, 85, 100, 105, 150, 200];
    this.width = BridgeGame.getRandomValue(colWidths);
};



// 모듈 패턴
BridgeGame.Ball = (function() {
    var color = "pink";
    var startAngle = 0;
    var endAngle = 2 * Math.PI;

    return {
        draw: function(startX, columnHeight) {
            var context = BridgeGame.Map.getContext();
            var ballRadius = 10;
            context.beginPath();
            context.arc(startX, BridgeGame.Map.getHeight() - columnHeight - ballRadius, ballRadius, startAngle, endAngle);
            context.fillStyle = color;
            context.fill();
            context.closePath();
        }
    }
})();

BridgeGame.Stick = {
    length: 0,
    thickness: 5,
    growAmount: 3,
    color: "grey",
    angle: -90,
    fallOverFinished : false,

    grow: function() {
        if (BridgeGame.Map.isPressed()) {
            this.length += this.growAmount;
            this.drawGrowing(BridgeGame.firstColumn);
        }
    },
    drawGrowing: function(column) {
    	this.growRender(column.getEndPoint(), column.getHeight());
    },
    growRender: function(columnEndPoint, columnHeight) {
    	var map = BridgeGame.Map;
    	map.getContext().beginPath();
        map.getContext().fillStyle = this.color;
        map.getContext().fillRect(columnEndPoint - this.thickness, BridgeGame.Map.getHeight() - columnHeight - this.length, this.thickness, this.length);
        map.getContext().closePath();
        
        if (map.isPressed()) {
        	this.length += this.growAmount;
            // window.requestAnimationFrame(this.growRender.bind(this, columnEndPoint, columnHeight));
        } 
        // else {
        //     this.fall(columnEndPoint, columnHeight);
        // }
    },
    fall: function(columnEndPoint, columnHeight) {
    	// window.requestAnimationFrame(this.fallRender.bind(this, columnEndPoint, columnHeight));
    	this.fallRender(columnEndPoint, columnHeight);
    },
    fallRender: function(columnEndPoint, columnHeight){
    	var context = BridgeGame.Map.getContext();
        var stickX = columnEndPoint;
        var stickY = BridgeGame.Map.getHeight() - columnHeight;

        var endX = this.length;
        var endY = columnHeight;

		context.beginPath();
        context.strokeStyle = this.color;
        context.lineWidth = this.thickness;

        endX = stickX + Math.cos(this.radianToDegree(this.angle)) * this.length;
        endY = stickY + Math.sin(this.radianToDegree(this.angle)) * this.length;

        context.moveTo(stickX,stickY);
		context.lineTo(endX,endY);
		context.closePath();
		context.stroke();

		if (this.angle < 0) {
            this.angle += 3;
        } else {
        	this.fallOverFinished = true;
        	this.angle = -90;
        	this.length = 0;
        }
    },
    isFallOverFinished: function(){
    	return this.fallOverFinished;
    },
    setFallOverStatus : function(flag) {
    	this.fallOverFinished = flag;
    },
    radianToDegree: function(angle) {
        return angle / 180 * Math.PI;
    },

}

// 게임을 완전 처음 들어왔을때
BridgeGame.gameInit = function() {
    this.drawBall();
    this.addMouseEvent();
}

BridgeGame.drawBall = function() {
    BridgeGame.Ball.draw(BridgeGame.firstColumn.getMidPoint(), BridgeGame.firstColumn.getHeight());
}

BridgeGame.addMouseEvent = function() {
    var map = BridgeGame.Map.getCanvas();
    map.addEventListener("mousedown", this.whileMouseIsPressed.bind(this));
    map.addEventListener("mouseup", this.whenMouseIsUp.bind(this));
}

BridgeGame.drawAll = function() {
	if(BridgeGame.Stick.isFallOverFinished() == false) {
		BridgeGame.requestAnimationFrame = window.requestAnimationFrame(this.drawAll.bind(this));
	} else {
		window.cancelAnimationFrame(BridgeGame.requestAnimationFrame);
		BridgeGame.Stick.setFallOverStatus(false);
	}

	var map = BridgeGame.Map;
	map.getContext().clearRect(0, 0, map.getWidth(), map.getHeight());

	BridgeGame.firstColumn.drawAgain();
	BridgeGame.secondColumn.drawAgain();
	BridgeGame.drawBall();

	if(BridgeGame.Map.isPressed()) {
		BridgeGame.Stick.grow();	
	}

	if(BridgeGame.Map.isPressed() == false) {
		BridgeGame.Stick.fall(BridgeGame.firstColumn.getEndPoint(), BridgeGame.firstColumn.getHeight());
	}
}

BridgeGame.whileMouseIsPressed = function() {
    BridgeGame.Map.setPressed(true);
    window.requestAnimationFrame(this.drawAll.bind(this));
}

BridgeGame.whenMouseIsUp = function() {
    BridgeGame.Map.setPressed(false);
}

BridgeGame.getRandomValue = function(array) {
    var max = array.length - 1;
    var min = 0;
    return array[Math.round(Math.random() * (max - min) + min)];
}

BridgeGame.START_X = 50;
BridgeGame.colDistances = [50, 100];
BridgeGame.firstColumn = new BridgeGame.Column(BridgeGame.START_X);
BridgeGame.secondColumn = new BridgeGame.Column(BridgeGame.firstColumn.getEndPoint() + BridgeGame.getRandomValue(BridgeGame.colDistances));

BridgeGame.gameInit();