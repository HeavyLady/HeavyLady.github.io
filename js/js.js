

window.onload = function () {

    var canvas = document.getElementById("gameWindow");
    var img = document.getElementById("background");
    var img2 = document.getElementById("player");
    var img3 = document.getElementById("ball");
   
    var context = canvas.getContext("2d");
    var fps = 60;

    var player1 = {
        'width': 30,
        'height': 128,
        'skin': document.getElementById("p1"),
        'posX': 0,
        'posY': 0,
        'speed': 10,
        'inertion': 0,
        'direction': 'up',
        'keys': [40, 38],
        'score': 0,
    };
    var player2 = {
        'width': 30,
        'height': 128,
        'skin': document.getElementById("p2"),
        'posX': 0,
        'posY': 0,
        'speed': 10,
        'inertion': 0,
        'direction': 'up',
        'keys': [87, 83],
        'score': 0,
    };

    var ball = {
        'radius': 60,
        'skin': '#f20',
        'deg': 0,
        'spinSpeed': 2,
  		'speed' : 2,
  		'maxSpeed': 10,
  		'movementX' : 0,
  		'movementY' : 0,
  		'posX' : 0,
        'posY' : 0,
         
    }  


    defaultSettings();

    var pressedKeys = [];
    window.onkeydown = handlerKey;
    window.onkeyup = handlerKey;

    // реди стеди го! сделать счёт очков!

    if (1) {
        start();
    }

    function start() {
        var game = setInterval(function () {
            moveBall();
            movePlayer();
            drawAll();
            if (player1.score >= 10 || player2.score >= 10) {
                clearInterval(game);
            }
        }, 1000 / fps);
    }


    function drawAll() {

        // Отступ по X, отступ по Y, ширина полота, высота полотна, картинка
        drawRectImage(0, 0, canvas.width, canvas.height, img);
        //drawRectangle(0, 0, canvas.width, canvas.height, 'white');
        // Отступ по X, отступ по Y, ширина полота, высота полотна, цвет
        drawRectImage(player1.posX, player1.posY, player1.width, player1.height, player1.skin);
        drawRectImage(player2.posX, player2.posY, player2.width, player2.height, player2.skin);
        //drawCanvas (ball.posX, ball.posY, 10, 10, ball.skin);
        //
        drawSpinImg(ball.posX, ball.posY, ball.radius, ball.radius, img3, ball.deg);
        drawText(player1.score, canvas.width / 2 - 30, 35);
        drawText(player2.score, canvas.width / 2 + 30, 35);
    }

    function drawRectangle(horizontal, vertical, cWidth, cHeight, cColor) {
        context.fillStyle = cColor;
        context.fillRect(horizontal, vertical, cWidth, cHeight);
    }

    function drawRectImage(horizontal, vertical, cWidth, cHeight, images) {
        context.beginPath();
        context.drawImage(images, horizontal, vertical, cWidth, cHeight);
        context.closePath();
    }

    function drawSpinImg(x, y, w, h, img, deg) {
        context.save();
        context.translate(x + w / 2, y + h / 2);
        context.rotate(deg * Math.PI / 180.0);
        context.translate(-x - w / 2, -y - h / 2);
        context.drawImage(img, x, y, w, h);
        context.restore();
    }
    function drawText(text, x, y) {
        context.font = "45px Arial";
        context.fillStyle = "white";
        context.fillText(text, x, y);
    }

    function drawBall(centerX, centerY, radius, color) {
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, Math.PI * 2, true)
        context.fillStyle = color;
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = 'black';
        context.stroke();
        context.closePath();
    }

    function moveBall() {
        ball.posX += ball.movementX;
        ball.posY += ball.movementY;

        // Увеличение скорости головы
        if (ball.speed < ball.maxSpeed){
        	ball.speed = ball.speed * 1.001;
        	ball.spinSpeed = ball.speed;
        	if (ball.movementX < 0) {
        		ball.movementX = ball.speed * (-1);
        	} else {
        		ball.movementX = ball.speed;
        	}

        	if (ball.movementY < 0) {
        		ball.movementY = ball.speed * (-1);
        	} else {
        		ball.movementY = ball.speed;
        	}        	
        	
        }

        if (ball.posX + (ball.radius / 1.5) >= canvas.width) {
            defaultSettings();
            player1.score += 1;
        } else if (ball.posX + (ball.radius / 3) <= 0) {
            defaultSettings();
            player2.score += 1;
        }

        if ((ball.posY + (ball.radius / 2) >= player1.posY && ball.posY <= (player1.posY + player1.height)) && ball.posX <= player1.width) {
            if (ball.movementX < 0) {
                ball.movementX = ball.movementX * (-1);
                ball.direction = 1;
            }

        }

        if ((ball.posY + (ball.radius / 2) >= player2.posY && ball.posY <= (player2.posY + player2.height)) && (ball.posX + ball.radius >= ((canvas.width - player2.width)))) {
            if (ball.movementX > 0) {
                ball.movementX = ball.movementX * (-1);
                ball.direction = 0;
            }

        }

        if (ball.posY + ball.radius >= canvas.height || ball.posY <= 0) {
            ball.movementY = ball.movementY * (-1);
            console.log(ball.movementY);
        }

        if (ball.direction) {
            ball.deg += ball.spinSpeed;
        } else {
            ball.deg -= ball.spinSpeed;
        }
    }

    function movePlayer() {

        if (pressedKeys[87]) {
            if (!(player2.posY <= 0)) {
                player2.posY -= player2.speed;
            }
        }
        if (pressedKeys[83]) {
            if (!((player2.posY + player2.height) >= canvas.height)) {
                player2.posY += player2.speed;
            }
        }
        if (pressedKeys[40]) {
            if (!((player1.posY + player1.height) >= canvas.height)) {
                player1.posY += player1.speed;
            }
        }
        if (pressedKeys[38]) {
            if (!(player1.posY <= 0)) {
                player1.posY -= player1.speed;
            }
        }
        handleInertion(player1);
        handleInertion(player2);
    }

    function handleInertion(player) {
        if (player.inertion > 1 && player.direction == 'down' && (player.posY + player.height) < canvas.height) {
            player.inertion /= 2;
            player.posY += player.inertion;
            player.inertion *= 1.7;
        } else if (player.inertion > 1 && player.direction == 'up' && player.posY > 0) {
            player.inertion /= 2;
            player.posY -= player.inertion;
            player.inertion *= 1.7;
        }
    }

    function handlerKey(event) {

        var preventKeys = player1.keys.concat(player2.keys);

        if (inArray(event.keyCode, preventKeys)) {
            event.preventDefault();
        }

        if (event.type === "keydown" && !pressedKeys[event.keyCode]) {
            pressedKeys[event.keyCode] = true;
        }
        if (event.type === "keyup" && pressedKeys[event.keyCode]) {
            pressedKeys[event.keyCode] = false;
            if (inArray(event.keyCode, player1.keys)) {
                player1.inertion = player1.speed;
                if (event.keyCode == player1.keys[0]) {
                    player1.direction = 'down';
                } else {
                    player1.direction = 'up';
                }
            }
            if (inArray(event.keyCode, player2.keys)) {
                player2.inertion = player2.speed;
                if (event.keyCode == player2.keys[0]) {
                    player2.direction = 'up';
                } else {
                    player2.direction = 'down';
                }
            }
        }

        return;

    }

    function inArray(needle, haystack) {
        var length = haystack.length;
        for (var i = 0; i < length; i++) {
            if (haystack[i] == needle)
                return true;
        }
        return false;
    }

    function defaultSettings() {
        player1.posX = 0;
        player1.posY = canvas.height / 2 - player1.height / 2;
        player2.posX = canvas.width - player2.width;
        player2.posY = canvas.height / 2 - player2.height / 2;

        ball.posX = canvas.width / 2;
        ball.posY = canvas.height / 2;

        ball.speed = 4;

        ball.movementX = ball.speed;
        ball.movementY = ball.speed;

        if (!Math.round(Math.random())) {
            ball.movementX = ball.movementX * (-1);
            ball.direction = 0;
        } else {
            ball.direction = 1;
        }

        if (!Math.round(Math.random())) {
            ball.movementY *= -1;
        }
    }
}




