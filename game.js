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

//handle orientation/size change
onresize = function () {
    canvas.width = innerWidth - 50;
    canvas.height = innerHeight - 50;
}
//Initialization
var canvas = document.getElementById("game");
canvas.width = innerWidth - 20;
canvas.height = innerHeight - 20;
var ctx = canvas.getContext("2d");

