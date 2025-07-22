let canvas;
let world;
let keyboard = new Keyboard();
let startBtn;

document.addEventListener('DOMContentLoaded', () => {
    init();
})

function startGameHandler() {
    startBtn = document.getElementById('start-game');
    startBtn.addEventListener('click', () => {
    startBtn.classList.add('d-none')
    loadGame();
})
}


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

function loadGame() {
    canvas = document.getElementById('canvas')
    canvas.classList.remove('d-none');
    startGame();
    world = new World(canvas, keyboard, level1);
}

function init() {
    startGameHandler();
}