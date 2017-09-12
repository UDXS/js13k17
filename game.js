//Input Handling
//these variables represent the buttons being pressed
var left = false;
var right = false;
var down = false;
onmousedown = function (e) {
    down = true;
    if (e.clientX >= innerWidth / 2 && down) {
        left = false;
        right = true;
    } else if (e.clientX < innerWidth / 2 && down) {
        left = true;
        right = false;
    }
};
onmousemove = function (e) {
    if (e.clientX >= innerWidth / 2 && down) {
        left = false;
        right = true;
    } else if (e.clientX < innerWidth / 2 && down) {
        left = true;
        right = false;
    }
};
onmouseup = function (e) {
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


//Canvas Initialization
var canvas = document.getElementById("game");
canvas.width = innerWidth - 20;
canvas.height = innerHeight - 20;
var ctx = canvas.getContext("2d");
//all positions/sizes are stored as if the screen is this big, scaling happens later.
var defaultX = 1280;
var defaultY = 1024;
//handle orientation/size change
onresize = function () {
    canvas.width = innerWidth - 50;
    canvas.height = innerHeight - 50;
}

//Asset Loading
var loadingLeft = 7;
var assets = {"assets/ball.png":new Image(),"assets/paddle.png":new Image(),"assets/brick1.png":new Image(),"assets/brick2.png":new Image(),"assets/brick3.png":new Image(),"assets/brick4.png":new Image(),"assets/brick5.png":new Image()};
function imgOnLoad(){
  loadingLeft--;
}
for (var k in assets){
  assets[k].onload = imgOnLoad;
  assets[k].src = k;
}

while (loadingLeft !== 0){
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Hello World",canvas.width/2,canvas.height/2);
}