var c = document.getElementById("snake");
var ctx = c.getContext("2d");
c.width  = window.innerWidth;
c.height = window.innerHeight;

//Config Variables
var snakeBitSize = 20;
var moveSpeed = 20;

function randomInt(min, max){
	return(Math.floor(Math.random() * (max - min + 1)) + min);
}

var keys = [];
document.onkeydown = function(e) {
    e = e || window.event;
    keys[e.which || e.keyCode] = true;
}
document.onkeyup = function(e) {
	e = e || window.event;
	keys[e.which || e.keyCode] = false;
}


function Vector2(x, y){
	this.x = x || 0;
	this.y = y || 0;
}

function Snake(){
	//Snake head is at snake[0], the rest is its tail.
	this.snake = new Array();
	this.snake.push(new Vector2(c.width / 2, c.height / 2));
	this.direction = 'r';
	this.collided = false;
	this.ate = false;
}

Snake.prototype.moveAndDraw = function(){
	switch(this.direction){
		case 'd':
			aux = new Vector2(this.snake[0].x, this.snake[0].y + moveSpeed);
			break;
		case 'u':
			aux = new Vector2(this.snake[0].x, this.snake[0].y - moveSpeed);
			break;
		case 'r':
			aux = new Vector2(this.snake[0].x + moveSpeed, this.snake[0].y);
			break;
		case 'l':
			aux = new Vector2(this.snake[0].x - moveSpeed, this.snake[0].y);
			break;
	}
	for(var i in keys) keys[i] = false;
	ctx.beginPath();
	ctx.lineWidth = "4";
	ctx.strokeStyle = "#cd00a5";
	var col = new Vector2(aux.x, aux.y);
	for(var i = 0; i < this.snake.length && !this.collided; i++){
		if(i != 0 && col.x == aux.x && col.y == aux.y){
			this.collided = true;
		}
		aux = [this.snake[i], this.snake[i] = aux][0];
		ctx.strokeRect(this.snake[i].x, this.snake[i].y, snakeBitSize, snakeBitSize);		
	}
};

Snake.prototype.updateDirection = function(){
	if(keys[65] && this.direction != 'r') this.direction = 'l';
	else if(keys[68] && this.direction != 'l') this.direction = 'r';
	else if(keys[87] && this.direction != 'd') this.direction = 'u';
	else if(keys[83] && this.direction != 'u') this.direction = 'd';
};

function Food(xx, yy){
	var x = xx;
	var y = yy;
	// while(x == xx){
	x = randomInt(150, c.width-150);
	// }
	// while(y == yy){
	y = randomInt(150, c.height-150);
	// }
	this.position = new Vector2(x, y);
}

Food.prototype.draw = function(){
	ctx.beginPath();
	ctx.lineWidth = "4";
	ctx.fillStyle = "#98cd00";
	ctx.fillRect(this.position.x, this.position.y, 20, 20);
	ctx.stroke();
}

function Game(){
	this.snake = new Snake();
	this.food = new Food(this.snake.snake[0].x, this.snake.snake[0].y);
	this.snake.snake.push(new Vector2(this.snake.snake[0].x-snakeBitSize, this.snake.snake[0].y));
	this.snake.snake.push(new Vector2(this.snake.snake[0].x-(2*snakeBitSize), this.snake.snake[0].y));
	this.score = 0;
	this.pause = true;
	this.speedInc = false;
	this.clear();
	this.drawWalls();
}

Game.prototype.clear = function(){
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, c.width, c.height);
};

Game.prototype.snakeGotFood = function(){
	if(Math.abs(this.food.position.x - this.snake.snake[0].x) <= snakeBitSize && Math.abs(this.food.position.y - this.snake.snake[0].y) <= snakeBitSize){
		this.food = new Food(this.snake.snake[0].x, this.snake.snake[0].y);
		this.addSnakeBit();
		this.score++;
		this.speedInc = true;
	}
}

Game.prototype.snakeCollided = function(){
	var leftWall = Math.abs(this.snake.snake[0].x) <= snakeBitSize;
	var rightWall = Math.abs(this.snake.snake[0].x - c.width + 20) <= snakeBitSize;
	var topWall = Math.abs(this.snake.snake[0].y) <= snakeBitSize;
	var bottomWall = Math.abs(this.snake.snake[0].y - c.height + 20) <= snakeBitSize;
	return(this.snake.collided || leftWall || rightWall || topWall || bottomWall);
}

Game.prototype.drawScore = function(){
	ctx.fillStyle = "#00C5CD";
	ctx.textAlign = "center";
	ctx.font = "30px Impact";
	ctx.fillText(this.score, 60, 60);
}

Game.prototype.addSnakeBit = function(){
	var bit;
	var size = this.snake.snake.length - 1;
	switch(this.snake.direction){
		case 'u':
			bit = new Vector2(this.snake.snake[size].x, this.snake.snake[0].y + snakeBitSize);
			break;
		case 'd':
			bit = new Vector2(this.snake.snake[size].x, this.snake.snake[0].y - snakeBitSize);
			break;
		case 'l':
			bit = new Vector2(this.snake.snake[size].x + snakeBitSize, this.snake.snake[0].y);
			break;
		case 'r':
			bit = new Vector2(this.snake.snake[size].x - snakeBitSize, this.snake.snake[0].y);
			break;
	}
	this.snake.snake.push(bit);
}

Game.prototype.drawWalls = function(){
	ctx.beginPath();
	ctx.lineWidth = "45";
	ctx.strokeStyle = "#6e00cd";
	ctx.moveTo(0, 0);
	ctx.lineTo(0, c.height);
	ctx.lineTo(c.width, c.height);
	ctx.lineTo(c.width, 0);
	ctx.lineTo(0, 0);
	ctx.stroke();
}

Game.prototype.update = function(){
	this.clear();
	this.drawScore();
	this.drawWalls();
	this.food.draw();
	this.snake.updateDirection();
	this.snake.moveAndDraw();
	this.snakeGotFood();
}

Game.prototype.pauseScreen = function(){
	this.clear();
	this.drawWalls();
	this.drawScore();
	ctx.fillStyle = "#00C5CD";
	ctx.textAlign = "center";
	ctx.font = "30px Impact";
	ctx.fillText("Press Space", c.width/2, c.height/2);
}

Game.prototype.incrementSpeed = function(){
	if(this.speedInc){
		this.speedInc = false;
		return(true);
	}
	return(false);
}

var game = new Game();

document.onkeypress = function(e){
	e = e || window.event;
	if((e.which || e.keyCode)== 32) game.pause = !game.pause;
}

var gameLoop = function(){
	if(!game.pause){
		if(game.snakeCollided()){
			alert("You lost! Try again.");
			game = new Game();
		}else{
			game.update();
		}
	}else{
		game.pauseScreen();
	}
}


var myFunction = function(){
    clearInterval(interval);
    if(game.incrementSpeed()){
    	gameSpeed = gameSpeed - 1;
    }
    if(!game.pause){
		if(game.snakeCollided()){
			alert("You lost! Try again.");
			gameSpeed = 100;
			game = new Game();
		}else{
			game.update();
		}
	}else{
		game.pauseScreen();
	}
    interval = setInterval(myFunction, gameSpeed);
}

var gameSpeed = 100;
var interval = setInterval(myFunction, gameSpeed);
