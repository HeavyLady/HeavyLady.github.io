
var defBallXPos;
var defBallYPos;

var ballXSpeed;
var ballYSpeed;

window.onload = function () {

    var canvas = document.getElementById("gameWindow");
    var img = document.getElementById("background");
    var img2 = document.getElementById("player");
    var img3 = document.getElementById("ball");
    console.log(img3);
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
        'keys': [40, 38]
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
        'keys': [87, 83]
    };

    var ball = {
        'radius': 60,
        'skin': '#f20',
        'deg': 0,
        'spinSpeed': 3
    }

    defaultSettings();

    var pressedKeys = [];
    window.onkeydown = handlerKey;
    window.onkeyup = handlerKey;

    // реди стеди го! сделать счёт очков! 
    setInterval(function () {
        moveBall();
        movePlayer();
        drawAll();
    }, 1000 / fps);


    function drawAll() {

        // Отступ по X, отступ по Y, ширина полота, высота полотна, картинка
        drawRectImage(0, 0, canvas.width, canvas.height, img);
        //drawRectangle(0, 0, canvas.width, canvas.height, 'white');
        // Отступ по X, отступ по Y, ширина полота, высота полотна, цвет
        drawRectImage(player1.posX, player1.posY, player1.width, player1.height, player1.skin);
        drawRectImage(player2.posX, player2.posY, player2.width, player2.height, player2.skin);
        //drawCanvas (defBallXPos, defBallYPos, 10, 10, ball.skin);
        //
        test(defBallXPos, defBallYPos, ball.radius, ball.radius, img3, ball.deg);
    }

    function drawRectangle(horizontal, vertical, cWidth, cHeight, cColor) {
        context.fillStyle = cColor;
        context.fillRect(horizontal, vertical, cWidth, cHeight);
    }

    function drawRectImage(horizontal, vertical, cWidth, cHeight, images) {
        context.beginPath();
        //context.globalAlpha = 0.4;
        context.drawImage(images, horizontal, vertical, cWidth, cHeight);
        context.closePath();


    }

    function test(x, y, w, h, img, deg) {
        context.save();
        context.translate(x + w / 2, y + h / 2);
        context.rotate(deg * Math.PI / 180.0);
        context.translate(-x - w / 2, -y - h / 2);
        context.drawImage(img, x, y, w, h);
        context.restore();
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
        defBallXPos += ballXSpeed;
        defBallYPos += ballYSpeed;
        if (defBallXPos + (ball.radius / 1.5) >= canvas.width || defBallXPos + (ball.radius / 3) <= 0) {
            defaultSettings();
        }


        if ((defBallYPos + (ball.radius / 2) >= player1.posY && defBallYPos <= (player1.posY + player1.height)) && defBallXPos <= player1.width) {
            if (ballXSpeed < 0) {
                ballXSpeed = ballXSpeed * (-1);
                ball.direction = 1;
            }
        }

        if ((defBallYPos + (ball.radius / 2) >= player2.posY && defBallYPos <= (player2.posY + player2.height)) && (defBallXPos + ball.radius >= ((canvas.width - player2.width)))) {
            if (ballXSpeed > 0) {
                ballXSpeed = ballXSpeed * (-1);
                ball.direction = 0;
            }
        }


        if (defBallYPos + ball.radius >= canvas.height || defBallYPos <= 0) {
            ballYSpeed = ballYSpeed * (-1);
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
                drawRectImage(player2.posX, player2.posY, player2.width, player2.height, player2.skin);
            }
        }

        if (pressedKeys[83]) {
            if (!((player2.posY + player2.height) >= canvas.height)) {
                player2.posY += player2.speed;
                drawRectImage(player2.posX, player2.posY, player2.width, player2.height, player2.skin);
            }
        }
        if (pressedKeys[40]) {
            if (!((player1.posY + player1.height) >= canvas.height)) {
                player1.posY += player1.speed;
                drawRectImage(player1.posX, player1.posY, player1.width, player1.height, player1.skin);
            }
        }

        if (pressedKeys[38]) {
            if (!(player1.posY <= 0)) {
                player1.posY -= player1.speed;
                drawRectImage(player1.posX, player1.posY, player1.width, player1.height, player1.skin);
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
            //playerInertion = playerSpeed;
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

        defBallXPos = canvas.width / 2;
        defBallYPos = canvas.height / 2;

        ballXSpeed = 6;
        ballYSpeed = 6;

        if (!Math.round(Math.random())) {
            ballXSpeed = ballXSpeed * (-1);
            ball.direction = 0;
        } else {
            ball.direction = 1;
        }

        if (!Math.round(Math.random())) {
            ballYSpeed *= -1;
        }
    }
}




