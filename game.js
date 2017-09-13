  //Fortress Fracture

  //Input Handling
  //These variables represent the buttons being pressed.
  var left = false;
  var right = false;
  var down = false;
  onpointerdown = function (e) {
    down = true;
    if (e.clientX >= innerWidth / 2 && down) {
      left = false;
      right = true;
    } else if (e.clientX < innerWidth / 2 && down) {
      left = true;
      right = false;
    }
  };
  onpointermove = function (e) {
    if (e.clientX >= innerWidth / 2 && down) {
      left = false;
      right = true;
    } else if (e.clientX < innerWidth / 2 && down) {
      left = true;
      right = false;
    }
  };
  onpointereup = function (e) {
    down = false;
    left = false;
    right = false;
  };
  onkeydown = function (e) {
    if (e.key === "ArrowLeft") {
      left = true;
      right = false;
    }
    if (e.key === "ArrowRight") {
      left = false;
      right = true;
    }
  };
  onkeyup = function (e) {
    if (e.key === "ArrowLeft") {
      left = false;
    }
    if (e.key === "ArrowRight") {
      right = false;
    }
  };
  //All positions/sizes are stored as if the screen is this big, scaling happens later.
  var defaultX = 1280;
  var defaultY = 1024;
  //Canvas Initialization
  var canvas = document.getElementById("game");
  var ctx = canvas.getContext("2d");
  canvas.height = (innerHeight / 10) * 9;
  canvas.width = (canvas.height / 4) * 5;
  //Handle orientation/size change
  onresize = function () {
    canvas.height = (innerHeight / 10) * 9;
    canvas.width = (canvas.height / 4) * 5;
    render(null);
  };

  //Game (Data/Functions/Types/Loop)
  var bricks = [];
  //The paddle's x position
  var paddle = defaultX / 2;

  var ball = {
    x: defaultX / 2 - 32,
    y: (defaultY / 2) - 32,
    dx: 1,
    dy: 1
  };

  var gameOver = false;

  function initialize() {
    //Place bricks
    for (var iy = 0; iy < 5; iy++) {
      bricks[iy] = [];
      for (var ix = 0; ix < 10; ix++) {
        //Bricks are only stored with their type
        bricks[iy][ix] = (4 - iy) + 1;
      }
    }
  }

  function drawTex(name, vX, vY) {
    ctx.drawImage(assets[name], (vX / defaultX) * canvas.width, (vY / defaultY) * canvas.height, (assets[name].width / defaultX) * canvas.width, (assets[name].height / defaultX) * canvas.height);
  }
  //Helper function that does collisions
  function checkRectCol(ax, ay, aw, ah, bx, by, bw, bh) {
    if (ax < bx + bw &&
      ax + aw > bx &&
      ay < by + bh &&
      ah + ay > by) {
      return true;
    }
    return false;
  }
  //Helper function that does with an array
  function checkRectColArray(rectA, rectB) {
    return checkRectCol(rectA[0], rectA[1], rectA[2], rectA[3], rectB[0], rectB[1], rectB[2], rectB[3]);
  }
  //This function checks if the ball has hit a wall and changes the velocity.
  function handleBallWalls() {
    var lwall = [0, 0, 1, defaultY];
    var rwall = [defaultX, 0, 1, defaultY];
    var twall = [0, 0, defaultX, 1];
    var bwall = [0, defaultY, defaultX, 1];
    var ballArray = [ball.x, ball.y, 64, 64];
    if (checkRectColArray(ballArray, lwall)) {
      ball.dx = ball.dx * -1;
      bounce.play();
    }
    if (checkRectColArray(ballArray, rwall)) {
      ball.dx = ball.dx * -1;
      bounce.play();
    }
    if (checkRectColArray(ballArray, twall)) {
      ball.dy = ball.dy * -1;
      bounce.play();
    }
    if (checkRectColArray(ballArray, bwall)) {
      gameOver = true;
    }
  }
  //This function checks for intersection between ball and paddle and changes the velocity.
  function handlePaddleBall() {
    if (Math.abs((paddle + 128) - (ball.x + 32)) <= 128 && ball.y >= defaultY - 320) {
      if (ball.y < defaultY - 192) {
        ball.dy = ball.dy * -1;
        bounce.play();
      }
    }
  }
  var hits = 0;
  //Quick fix for collision problems
  var hitCooldown = 100;
  //This function checks for intersection between ball and the bricks, changes the velocity, and decrements the brick type by one
  function handleBrickBall() {
    var ballArray = [ball.x, ball.y, 64, 64];
    var brickArray = [0, 0, 128, 64];
    for (var y = 0; y < 5; y++) {
      for (var x = 0; x < 10; x++) {
        brickArray[0] = x * 128;
        brickArray[1] = y * 64;
        if (checkRectColArray(ballArray, brickArray) && bricks[y][x] !== 0 && hitCooldown <= 0) {
          ball.dy = ball.dy * -1;
          bricks[y][x] = bricks[y][x] - 1;
          hitCooldown = 100;
          bounce.play()
          if (bricks[y][x] === 0) {
            hits = hits + 1;
          }
        }
      }
    }
  }

  //Function that runs every 10 ms, it is tied to update.
  function fixedUpdate() {
    //To avoid movement speed changes, the paddle movement code has been moved to fixedUpdate
    if (right && paddle <= 1280 - 256) {
      paddle = paddle + 6;
    }
    if (left && paddle >= 0) {
      paddle = paddle - 6;
    }
    //Ball velocity processing
    ball.x = ball.x + (ball.dx * 6);
    ball.y = ball.y + (ball.dy * 6);
    hitCooldown--;
  }

  var fixedUpdateTime = 10;

  function update(deltaTime) {
    //Handle ball collisions
    handleBallWalls();
    handlePaddleBall();
    handleBrickBall();

    //fixedUpdate is executed every 10ms
    fixedUpdateTime = fixedUpdateTime - deltaTime;
    if (fixedUpdateTime <= 0) {
      fixedUpdateTime = 10;
      fixedUpdate();
    }
  }

  function render(deltaTime) {
    update(deltaTime);
    //Clear and draw the ball/paddle
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTex("assets/paddle.png", paddle, defaultY - 256);
    drawTex("assets/ball.png", ball.x, ball.y);
    //Draw the bricks
    for (var y = 0; y < 5; y++) {
      for (var x = 0; x < 10; x++) {
        if (bricks[y][x] !== 0) {
          drawTex("assets/brick" + bricks[y][x] + ".png", x * 128, y * 64);
        }
      }
    }
    ctx.font = "18px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(hits + " Points", 0, canvas.height - 64);
    if (!gameOver) {
      requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      alert("Game Over!\n\nYou scored " + hits + " points!\n\nThanks For Playing Fortress Fracture by UDXS\n\nI hope you enjoyed playing it as much as I did making it!\n\nFind out more about me, Davit Markarian @ udxs.me");
    }

  }
  //Asset Loading (Running this section triggers the game loop)
  ctx.font = "24px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("UDXS Fortress Fracture", canvas.width / 2, canvas.height / 2);

  var loadingLeft = 7;
  var assets = {
    "assets/ball.png": new Image(),
    "assets/paddle.png": new Image(),
    "assets/brick1.png": new Image(),
    "assets/brick2.png": new Image(),
    "assets/brick3.png": new Image(),
    "assets/brick4.png": new Image(),
    "assets/brick5.png": new Image()
  };
  var bounce = new Audio("assets/bounce.mp3");
  bounce.play();

  function imgOnLoad() {
    loadingLeft--;
  }

  for (var k in assets) {
    assets[k].onload = imgOnLoad;
    assets[k].src = k;
  }
  var loadcheck;

  function startGame() {
    //Here, we clean the canvas from the loading and then registers the game loop with the browser repaint.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initialize();
    window.requestAnimationFrame(render);
  }

  function onImgLoad() {
    clearInterval(loadcheck);
    setTimeout(startGame, 3000);
  }
  loadcheck = setInterval(onImgLoad, 100);