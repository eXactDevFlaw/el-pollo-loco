let canvas;
let world;
let keyboard = new Keyboard();
let startBtn;
let intervallIds = [];

const keyMap = {
    39: 'RIGHT',
    37: 'LEFT',
    38: 'UP',
    40: 'DOWN',
    32: 'SPACE',
    68: 'D'
};


document.addEventListener('DOMContentLoaded', () => {
    startGameHandler();
})

window.addEventListener('keydown', (e) => {
    if (keyMap[e.keyCode]) keyboard[keyMap[e.keyCode]] = true;
});
window.addEventListener('keyup', (e) => {
    if (keyMap[e.keyCode]) keyboard[keyMap[e.keyCode]] = false;
});

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