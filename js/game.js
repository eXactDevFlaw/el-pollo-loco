/**
 * Main game initialization and loop logic for El Pollo Loco.
 * Handles canvas setup, keyboard input, game start/stop, and interval management.
 * 
 * @module game
 */

// ================================
// GLOBAL VARIABLES & CONSTANTS
// ================================

let canvas;
let world;
let keyboard = new Keyboard();
let startBtn;
let startRef;
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

// ================================
// INITIALIZATION & EVENT LISTENERS
// ================================

/**
 * Initializes the game after DOM is loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeGameControls();
});

/**
 * Handles keydown events and updates the Keyboard object.
 * @param {KeyboardEvent} e - The keyboard event
 */
window.addEventListener('keydown', (e) => {
    updateKeyboardState(e, true);
});

/**
 * Handles keyup events and updates the Keyboard object.
 * @param {KeyboardEvent} e - The keyboard event
 */
window.addEventListener('keyup', (e) => {
    updateKeyboardState(e, false);
});

// ================================
// GAME INITIALIZATION FUNCTIONS
// ================================

/**
 * Sets up all game controls and event handlers.
 */
function initializeGameControls() {
    setupElementReferences();
    attachEventListeners();
}

/**
 * Gets references to DOM elements.
 */
function setupElementReferences() {
    startBtn = document.getElementById('play-btn');
    startRef = document.getElementById('start-game');
}

/**
 * Attaches click event listeners to all buttons.
 */
function attachEventListeners() {
    const helpBtn = document.getElementById('help-btn');
    const backToMenuBtn = document.getElementById('back-to-menu-btn');
    
    startBtn.addEventListener('click', handleStartButtonClick);
    helpBtn.addEventListener('click', showHelpScreen);
    backToMenuBtn.addEventListener('click', hideHelpScreen);
}

// ================================
// KEYBOARD INPUT FUNCTIONS
// ================================

/**
 * Updates keyboard state based on key events.
 * @param {KeyboardEvent} e - The keyboard event
 * @param {boolean} isPressed - Whether the key is pressed or released
 */
function updateKeyboardState(e, isPressed) {
    if (keyMap[e.keyCode]) {
        keyboard[keyMap[e.keyCode]] = isPressed;
    }
}

// ================================
// GAME FLOW FUNCTIONS
// ================================

/**
 * Handles the start button click event.
 */
function handleStartButtonClick() {
    hideStartScreen();
    loadGame();
}

/**
 * Hides the start screen interface.
 */
function hideStartScreen() {
    startRef.classList.add('d-none');
}

/**
 * Loads the game canvas and starts the game world.
 */
function loadGame() {
    initializeCanvas();
    createGameWorld();
}

/**
 * Initializes the game canvas.
 */
function initializeCanvas() {
    canvas = document.getElementById('canvas');
    canvas.classList.remove('d-none');
    startGame();
}

/**
 * Creates the game world instance.
 */
function createGameWorld() {
    world = new World(canvas, keyboard, level1);
}

// ================================
// SCREEN NAVIGATION FUNCTIONS
// ================================

/**
 * Shows the help screen by hiding start game and showing help div.
 */
function showHelpScreen() {
    hideElementById('start-game');
    showElementById('help-screen');
}

/**
 * Hides the help screen and shows the start game div.
 */
function hideHelpScreen() {
    hideElementById('help-screen');
    showElementById('start-game');
}

/**
 * Helper function to toggle between two screen contents.
 * @param {string} hideId - ID of element to hide
 * @param {string} showId - ID of element to show
 */
function toggleScreenContent(hideId, showId) {
    hideElementById(hideId);
    showElementById(showId);
}

/**
 * Helper function to hide an element by ID.
 * @param {string} elementId - The ID of the element to hide
 */
function hideElementById(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('d-none');
    }
}

/**
 * Helper function to show an element by ID.
 * @param {string} elementId - The ID of the element to show
 */
function showElementById(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('d-none');
    }
}

// ================================
// INTERVAL MANAGEMENT FUNCTIONS
// ================================

/**
 * Sets an interval that can be stopped later using stopGame.
 * @param {Function} fn - The callback function to run at each interval
 * @param {number} time - Interval in milliseconds
 */
function setStopableIntervall(fn, time) {
    const id = setInterval(fn, time);
    intervallIds.push(id);
}

/**
 * Stops all active game intervals and resets interval ID storage.
 */
function stopGame() {
    clearAllIntervals();
    resetIntervalStorage();
}

/**
 * Clears all stored intervals.
 */
function clearAllIntervals() {
    intervallIds.forEach((id) => {
        clearInterval(id);
    });
}

/**
 * Resets the interval ID storage array.
 */
function resetIntervalStorage() {
    intervallIds = [];
}