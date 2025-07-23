let canvas;
let world;
let keyboard = new Keyboard();
let startBtn;
let intervallIds = [];

document.addEventListener('DOMContentLoaded', () => {
    init();
})

window.addEventListener('keydown', (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = true;
    }

    if (e.keyCode == 37) {
        keyboard.LEFT = true;
    }

    if (e.keyCode == 38) {
        keyboard.UP = true;
    }

    if (e.keyCode == 40) {
        keyboard.DOWN = true;
    }

    if (e.keyCode == 32) {
        keyboard.SPACE = true;
    }

    if (e.keyCode == 68) {
        keyboard.D = true;
    }
})

window.addEventListener('keyup', (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = false;
    }

    if (e.keyCode == 37) {
        keyboard.LEFT = false;
    }

    if (e.keyCode == 38) {
        keyboard.UP = false;
    }

    if (e.keyCode == 40) {
        keyboard.DOWN = false;
    }

    if (e.keyCode == 32) {
        keyboard.SPACE = false;
    }

    if (e.keyCode == 68) {
        keyboard.D = false;
    }
})


function startGameHandler() {
    startBtn = document.getElementById('start-game');
    startBtn.addEventListener('click', () => {
    startBtn.classList.add('d-none')
    loadGame();
})
}

function loadGame() {
    canvas = document.getElementById('canvas')
    canvas.classList.remove('d-none');
    startGame();
    world = new World(canvas, keyboard, level1);
}

function setStopableIntervall(fn, time) {
    let id = setInterval(fn, time);
    intervallIds.push(id);
}

function stopGame() {
    intervallIds.forEach((id) => {
        clearInterval(id);
    });
    intervallIds = [];
}

function init() {
    startGameHandler();
}