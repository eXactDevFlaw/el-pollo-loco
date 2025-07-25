/**
 * Main game initialization and loop logic for El Pollo Loco.
 * Handles canvas setup, keyboard input, game start/stop, and interval management.
 * 
 * @module game
 */

let canvas;
let world;
let keyboard = new Keyboard();
let startBtn;
let intervallIds = [];

/**
 * Maps key codes to Keyboard properties.
 * @type {Object<number, string>}
 */
const keyMap = {
    39: 'RIGHT',
    37: 'LEFT',
    38: 'UP',
    40: 'DOWN',
    32: 'SPACE',
    68: 'D'
};

/**
 * Initializes the game after DOM is loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    startGameHandler();
});

/**
 * Handles keydown events and updates the Keyboard object.
 * @param {KeyboardEvent} e
 */
window.addEventListener('keydown', (e) => {
    if (keyMap[e.keyCode]) keyboard[keyMap[e.keyCode]] = true;
});

/**
 * Handles keyup events and updates the Keyboard object.
 * @param {KeyboardEvent} e
 */
window.addEventListener('keyup', (e) => {
    if (keyMap[e.keyCode]) keyboard[keyMap[e.keyCode]] = false;
});

/**
 * Sets up the start button and its click handler to start the game.
 */
function startGameHandler() {
    startBtn = document.getElementById('start-game');
    startBtn.addEventListener('click', () => {
        startBtn.classList.add('d-none');
        loadGame();
    });
}

/**
 * Loads the game canvas and starts the game world.
 */
function loadGame() {
    canvas = document.getElementById('canvas');
    canvas.classList.remove('d-none');
    startGame();
    world = new World(canvas, keyboard, level1);
}

/**
 * Sets an interval that can be stopped later using stopGame.
 * @param {Function} fn - The callback function to run at each interval.
 * @param {number} time - Interval in milliseconds.
 */
function setStopableIntervall(fn, time) {
    let id = setInterval(fn, time);
    intervallIds.push(id);
}

/**
 * Stops all active game intervals and resets interval ID storage.
 */
function stopGame() {
    intervallIds.forEach((id) => {
        clearInterval(id);
    });
    intervallIds = [];
}