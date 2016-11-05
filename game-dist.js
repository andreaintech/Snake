"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;(function () {
	var Random = (function () {
		function Random() {
			_classCallCheck(this, Random);
		}

		_createClass(Random, null, [{
			key: "get",
			value: function get(inicio, final) {
				return Math.floor(Math.random() * final) + inicio;
			}
		}]);

		return Random;
	})();

	var Food = (function () {
		function Food(x, y) {
			_classCallCheck(this, Food);

			this.x = x;
			this.y = y;
			this.width = 10;
			this.height = 10;
		}

		_createClass(Food, [{
			key: "draw",
			value: function draw() {
				ctx.fillRect(this.x, this.y, this.width, this.height);
			}
		}], [{
			key: "generate",
			value: function generate() {
				return new Food(Random.get(0, 500), Random.get(0, 300));
			}
		}]);

		return Food;
	})();

	var Square = (function () {
		function Square(x, y) {
			_classCallCheck(this, Square);

			this.x = x;
			this.y = y;
			this.width = 10;
			this.height = 10;
			this.back = null // Cuadrado de atrás

			;
		}

		_createClass(Square, [{
			key: "draw",
			value: function draw() {
				ctx.fillRect(this.x, this.y, this.width, this.height);
				if (this.hasBack()) {
					this.back.draw();
				}
			}
		}, {
			key: "add",
			value: function add() {
				if (this.hasBack()) return this.back.add();
				this.back = new Square(this.x, this.y);
			}
		}, {
			key: "hasBack",
			value: function hasBack() {
				return this.back != null;
			}
		}, {
			key: "copy",
			value: function copy() {
				if (this.hasBack()) {
					this.back.copy();

					this.back.x = this.x;
					this.back.y = this.y;
				}
			}
		}, {
			key: "right",
			value: function right() {
				this.copy();
				this.x += 10;
			}
		}, {
			key: "left",
			value: function left() {
				this.copy();
				this.x -= 10;
			}
		}, {
			key: "up",
			value: function up() {
				this.copy();
				this.y -= 10;
			}
		}, {
			key: "down",
			value: function down() {
				this.copy();
				this.y += 10;
			}
		}, {
			key: "hit",
			value: function hit(head) {
				var segundo = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

				if (this == head && !this.hasBack()) return false;
				if (this == head) return this.back.hit(head, true);

				if (segundo && !this.hasBack()) return false;
				if (segundo) return this.back.hit(head);

				// No es ni la cabeza ni el segundo cuadrito
				if (this.hasBack()) {
					return squareHit(this, head) || this.back.hit(head);
				}

				// No es la cabeza, ni el segundo y soy el último

				return squareHit(this, head);
			}
		}, {
			key: "hitBorder",
			value: function hitBorder() {

				return this.x > 490 || this.x < 0 || this.y > 290 || this.y < 0;
			}
		}]);

		return Square;
	})();

	var Snake = (function () {
		function Snake() {
			_classCallCheck(this, Snake);

			this.head = new Square(100, 0);
			this.draw();
			this.direction = "right";
			this.head.add();
			this.head.add();
			this.head.add();
			this.head.add();
		}

		_createClass(Snake, [{
			key: "draw",
			value: function draw() {
				this.head.draw();
			}
		}, {
			key: "right",
			value: function right() {
				if (this.direction == "left") return;
				this.direction = "right";
			}
		}, {
			key: "left",
			value: function left() {
				if (this.direction == "right") return;
				this.direction = "left";
			}
		}, {
			key: "up",
			value: function up() {
				if (this.direction == "down") return;
				this.direction = "up";
			}
		}, {
			key: "down",
			value: function down() {
				if (this.direction == "up") return;
				this.direction = "down";
			}
		}, {
			key: "move",
			value: function move() {
				if (this.direction == "up") return this.head.up();

				if (this.direction == "down") return this.head.down();

				if (this.direction == "left") return this.head.left();

				if (this.direction == "right") return this.head.right();
			}
		}, {
			key: "eat",
			value: function eat() {
				puntos++;
				this.head.add();
			}
		}, {
			key: "dead",
			value: function dead() {
				return this.head.hit(this.head) || this.head.hitBorder();
			}
		}]);

		return Snake;
	})();

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	var puntos = 0;

	var snake = new Snake();
	var foods = [];

	window.addEventListener("keydown", function (event) {
		if (event.keyCode >= 37 && event.keyCode <= 40) event.preventDefault();

		if (event.keyCode == 40) return snake.down();

		if (event.keyCode == 39) return snake.right();

		if (event.keyCode == 38) return snake.up();

		if (event.keyCode == 37) return snake.left();

		return false;
	});

	var animacion = setInterval(function () {
		snake.move();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		snake.draw();
		drawFood();

		if (snake.dead()) {
			console.log("GAME OVER");
			window.clearInterval(animacion);
		}
	}, 1000 / 5);

	setInterval(function () {
		var food = Food.generate();
		foods.push(food);

		setTimeout(function () {
			// Elimina la comida
			removeFromFoods(food);
		}, 10000);
	}, 4000);

	function drawFood() {
		for (var index in foods) {
			var food = foods[index];
			if (typeof food != "undefined") {
				food.draw();

				if (hit(food, snake.head)) {
					snake.eat();
					removeFromFoods(food);
				}
			}
		}
	}

	function removeFromFoods(food) {
		foods = foods.filter(function (f) {
			return food != f;
		});
	}

	function squareHit(cuadrado_uno, cuadrado_dos) {
		return cuadrado_uno.x == cuadrado_dos.x && cuadrado_uno.y == cuadrado_dos.y;
	}

	// Función de colisiones
	function hit(a, b) {
		var hit = false;

		//Colsiones horizontales
		if (b.x + b.width >= a.x && b.x < a.x + a.width) {

			//Colisiones verticales
			if (b.y + b.height >= a.y && b.y < a.y + a.height) hit = true;
		}

		//Colisión de a con b
		if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
			if (b.y <= a.y && b.y + b.height >= a.y + a.height) hit = true;
		}

		//Colisión b con a
		if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
			if (a.y <= b.y && a.y + a.height >= b.y + b.height) hit = true;
		}
		return hit;
	}
})();
