function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}

var context;
window.addEventListener('load', init, false);

function init() {
    try {
        context = new AudioContext();
        bufferLoader = new BufferLoader( 
         	context,
        	[
        	//bgm
        	'bgm.mp3'
        // 	//blip
        // 	'blip.mp3',
        // 	//toong
        // 	'toong.mp3'
        	],
        	finishedLoading
        	);

        bufferLoader.load();
    	loadSound();
    	loadSound2();
    } catch (e) {
        alert('web audio api not supported');
    }
}

var toong = null;
var blip = null;
var bgm = null;
function finishedLoading(bufferList){
	bgm = context.createBufferSource();
	bgm.buffer = bufferList[0];
	bgm.connect(context.destination);
	bgm.start(0);
}
// function finishedLoading(bufferList){
// 	console.log("in");
// 	blip = context.createBufferSource();
// 	blip.buffer = bufferList[0];

// 	toong = context.createBufferSource();
// 	toong.buffer = bufferList[1];
// 	toong.connect(context.destination);
	
// }

// function playBlip(bufferList){
// 	console.log("in blip");
// 	blip.connect(context.destination);
// 	blip.start(0);
// }

// function playToong(){
// 	console.log("intoong");
// 	toong.start(0);
// }

function loadSound() {
    var request = new XMLHttpRequest();
    request.open('GET', 'blip.mp3', true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
        context.decodeAudioData(request.response, function(buffer) {
            blip = buffer;
        });
    }
    request.send();
}

function loadSound2() {
    var request = new XMLHttpRequest();
    request.open('GET', 'toong.mp3', true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
        context.decodeAudioData(request.response, function(buffer) {
            toong = buffer;
        });
    }
    request.send();
}

function playSound(buffer) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
}

//////////////////////////////////////////////
var BridgeGame = {};

BridgeGame.Map = (function() {
    var pressed = false;
    var moveFinished = false;
    var point = 0;
    var pointAdded = false;

    return {
        isPressed: function() {
            return pressed;
        },
        setPointAdded: function(flag){
            pointAdded = flag;
        },
        getPointAdded: function(){
            return pointAdded;
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
        getHeight: function() {
            return this.getCanvas().height;
        },
        getWidth: function() {
            return this.getCanvas().width;
        },
        isMoveFinished: function() {
            return moveFinished;
        },
        moveToNextStage: function() {
            // debugger;
                this.setPointAdded(false);
            if (!BridgeGame.thirdColumn) {
                BridgeGame.thirdColumn = new BridgeGame.Column(BridgeGame.secondColumn.getEndPoint() + BridgeGame.distance);
            } else {
                BridgeGame.thirdColumn.drawAgain();
                this.moveMapToLeft();
//
                //update score box
                // document.getElementById('scoreBox').innerHTML = point;
                this.updateScore();

            }
        },
        moveMapToLeft: function() {
            if (BridgeGame.secondColumn.getStartPoint() > BridgeGame.START_X) {
                BridgeGame.firstColumn.moveLeft();
                BridgeGame.secondColumn.moveLeft();
                BridgeGame.thirdColumn.moveLeft();
            } else {
                moveFinished = true;
                BridgeGame.firstColumn = BridgeGame.secondColumn;
                BridgeGame.secondColumn = BridgeGame.thirdColumn;
                BridgeGame.thirdColumn = null;
            }
        },
        resetStatus: function() {
            moveFinished = false;
            BridgeGame.stickGrowable = true;
        },
        failMessage: function() {
            this.gameOver = true;
            document.getElementById('showGameStatus').style.display = "block";
            moveFinished = true;
        },
        addPoint: function(){
            if(pointAdded == false){
                // point = point + 1;
                BridgeGame.Map.setPoint(1);
                console.log(point);
            }
        },
        setPoint: function (num) {
            console.trace();
            point += num;
        },
        getPoint: function(){
            return point;
        },
        updateScore: function() {
            var context = this.getContext();
            context.fillStyle = 'black';
            context.font = 'bold 40px Arial';
            context.fillText(point, this.getWidth() - 50, 50);
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
BridgeGame.Column.prototype.getStartPoint = function() {
    return this.startX;
};
BridgeGame.Column.prototype.getMidPoint = function() {
    return this.startX + (this.width / 2);
};
BridgeGame.Column.prototype.getEndPoint = function() {
    return this.startX + this.width;
};
BridgeGame.Column.prototype.moveLeft = function() {
    return this.startX = this.startX - 3;
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
    // var colWidths=[100,150];
    var colWidths = [10, 20, 30, 50, 80, 100, 150];
    this.width = BridgeGame.getRandomValue(colWidths);
};

// 모듈 패턴
BridgeGame.Ball = (function() {
    var color = "pink";
    var startAngle = 0;
    var endAngle = 2 * Math.PI;
    var moveFinished = false;
    var ballRadius = 10;
    var positionX = -1;

    return {
        draw: function(startX, columnHeight) {
            var context = BridgeGame.Map.getContext();
            context.beginPath();
            context.arc(startX, BridgeGame.Map.getHeight() - columnHeight - ballRadius, ballRadius, startAngle, endAngle);
            context.fillStyle = color;
            context.fill();
            context.closePath();
        },
        isMoveFinished: function() {
            return moveFinished;
        },
        resetStatus: function() {
            moveFinished = false;
            positionX = -1;
        },
        roll: function() {
            var stick = BridgeGame.Stick;
            var distance = BridgeGame.secondColumn.getStartPoint() - BridgeGame.firstColumn.getEndPoint();
            // if no Bridge
            if (!stick.length) {
                return;
            }

            // longer or shorter than distance
            if (stick.length < distance || stick.length > distance + BridgeGame.secondColumn.getWidth()) {
                console.log("DIE!!");
                var context = BridgeGame.Map.getContext();
                context.beginPath();
                context.arc(BridgeGame.firstColumn.getMidPoint() + positionX, BridgeGame.Map.getHeight() - BridgeGame.secondColumn.getHeight() - ballRadius, ballRadius, startAngle, endAngle);
                context.fillStyle = 'pink';
                context.fill();
                context.closePath();

                if (positionX < BridgeGame.firstColumn.getEndPoint() + BridgeGame.Stick.length - 50) {
                    positionX += 5;
                } else {
                    //clearRECt하고 다시 그려준다??
                    context.clearRect(0, 0, BridgeGame.Map.getWidth(), BridgeGame.Map.getHeight());
                    BridgeGame.firstColumn.drawAgain();
                    BridgeGame.secondColumn.drawAgain();
                    context.beginPath();
                    context.arc(BridgeGame.firstColumn.getEndPoint() + BridgeGame.Stick.length, BridgeGame.Map.getHeight() - ballRadius, ballRadius, startAngle, endAngle);
                    context.fillStyle = 'pink';
                    context.fill();
                    context.closePath();
//                    //toong sound
					bgm.stop();
                    playSound(toong);
                    moveFinished = true;
                    BridgeGame.stageSuccess = false;
                    //기둥 안 생기게
                    BridgeGame.Map.failMessage();
                }
            }

            //if long enough
            if (stick.length >= distance && stick.length <= distance + BridgeGame.secondColumn.getWidth()) {
                var context = BridgeGame.Map.getContext();
                context.beginPath();
                context.arc(BridgeGame.firstColumn.getMidPoint() + positionX, BridgeGame.Map.getHeight() - BridgeGame.secondColumn.getHeight() - ballRadius, ballRadius, startAngle, endAngle);
                context.fillStyle = 'pink';
                context.fill();
                context.closePath();

                if (positionX < BridgeGame.secondColumn.getMidPoint() - BridgeGame.firstColumn.getMidPoint()) {
                    positionX += 5;
                    // debugger;
                    BridgeGame.Map.addPoint();
                    BridgeGame.Map.setPointAdded(true);
                } else {
                    moveFinished = true;
                    BridgeGame.stageSuccess = true;
                }
            }
        },
    }
})();

BridgeGame.Stick = {
    length: 0,
    thickness: 5,
    growAmount: 3,
    color: "grey",
    angle: -90,
    fallOverFinished: false,

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
//			play blip sound
        	playSound(blip);
            this.length += this.growAmount;
        }
    },
    fall: function(columnEndPoint, columnHeight) {
        this.fallRender(columnEndPoint, columnHeight);
    },
    fallRender: function(columnEndPoint, columnHeight) {
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

        context.moveTo(stickX, stickY + this.thickness / 2);
        context.lineTo(endX, endY + this.thickness / 2);
        context.closePath();
        context.stroke();

        if (this.angle < 0) {
            this.angle += 3;
        } else {
            this.fallOverFinished = true;
        }
    },
    isFallOverFinished: function() {
        return this.fallOverFinished;
    },
    radianToDegree: function(angle) {
        return angle / 180 * Math.PI;
    },
    resetStatus: function() {
        this.angle = -90;
        this.length = 0;
        this.fallOverFinished = false;
    }
}

// 게임을 완전 처음 들어왔을때
BridgeGame.gameInit = function() {
    this.drawBall();
    this.bindPress = this.whileMouseIsPressed.bind(this);
    this.addMouseEvent();
}

BridgeGame.drawBall = function() {
    BridgeGame.Ball.draw(BridgeGame.firstColumn.getMidPoint(), BridgeGame.firstColumn.getHeight());
}

BridgeGame.addMouseEvent = function() {
    var map = BridgeGame.Map.getCanvas();
    map.addEventListener("mousedown", this.bindPress);
    map.addEventListener("mouseup", this.whenMouseIsUp.bind(this));
}

BridgeGame.drawAll = function() {
    var map = BridgeGame.Map;
    map.getContext().clearRect(0, 0, map.getWidth(), map.getHeight());

    BridgeGame.firstColumn.drawAgain();
    BridgeGame.secondColumn.drawAgain();

    if (BridgeGame.Stick.angle != 0) {
        BridgeGame.drawBall();
    }

    if (BridgeGame.Map.isPressed() && BridgeGame.stickGrowable == true) {
        BridgeGame.Stick.grow();
    }

    // if(BridgeGame.Map.isPressed() == false && BridgeGame.Map.isMoveFinished() == false) {
    if (BridgeGame.Map.isPressed() == false || (BridgeGame.Map.isPressed == true && BridgeGame.Map.stickGrowable == false) && BridgeGame.Map.isMoveFinished() == false) {
        BridgeGame.Stick.fall(BridgeGame.firstColumn.getEndPoint(), BridgeGame.firstColumn.getHeight());
    }

    if (BridgeGame.Stick.isFallOverFinished()) {
        BridgeGame.Ball.roll();
    }

    if (BridgeGame.Ball.isMoveFinished() && BridgeGame.stageSuccess == true) {
        BridgeGame.Map.moveToNextStage();
    }

    if (BridgeGame.Map.isMoveFinished() == false) {
        BridgeGame.requestAnimationFrame = window.requestAnimationFrame(this.drawAll.bind(this));
    } else {
        //loop  끝나는 시점
        window.cancelAnimationFrame(BridgeGame.requestAnimationFrame);

        var map = BridgeGame.Map.getCanvas();
        map.addEventListener("mousedown", this.bindPress);
        BridgeGame.Stick.resetStatus();
        BridgeGame.Ball.resetStatus();
        BridgeGame.Map.resetStatus();
    }
}

BridgeGame.whileMouseIsPressed = function() {
    BridgeGame.Map.setPressed(true);
    document.getElementById('showGameStatus').style.display = "none";
    window.requestAnimationFrame(this.drawAll.bind(this));
}

BridgeGame.whenMouseIsUp = function() {
    BridgeGame.Map.setPressed(false);
    BridgeGame.removeHandler();

}

BridgeGame.getRandomValue = function(array) {
    var max = array.length - 1;
    var min = 0;
    return array[Math.round(Math.random() * (max - min) + min)];
}

BridgeGame.removeHandler = function() {
    var map = BridgeGame.Map.getCanvas();
    map.removeEventListener("mousedown", this.bindPress);
}

BridgeGame.START_X = 50;
BridgeGame.colDistances = [50, 70, 100, 120, 150, 170, 200, 250];
BridgeGame.distance = BridgeGame.getRandomValue(BridgeGame.colDistances);
BridgeGame.firstColumn = new BridgeGame.Column(BridgeGame.START_X);
BridgeGame.secondColumn = new BridgeGame.Column(BridgeGame.firstColumn.getEndPoint() + BridgeGame.distance);
BridgeGame.thirdColumn = null;
BridgeGame.stickGrowable = true;
BridgeGame.stageSuccess = false;

BridgeGame.gameInit();
