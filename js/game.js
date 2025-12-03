/**
 * @fileoverview Main game initialization and control handling
 * Manages keyboard input, mobile touch controls, fullscreen mode, and device orientation
 */

/** @type {HTMLCanvasElement} Canvas element for game rendering */
let canvas;

/** @type {World} Game world instance */
let world;

/** @type {Keyboard} Keyboard state object */
let keyboard = new Keyboard();

/**
 * Initializes the game
 * Creates canvas reference, world instance, and sets up responsive features
 * @returns {void}
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    initResponsiveFeatures();
}

// ===== KEYBOARD EVENTS =====

/**
 * Binds keyboard event listeners for desktop controls
 * Handles keydown and keyup events for arrow keys, space, and D key
 * @returns {void}
 */
function bindKeyboardEvents() {
    window.addEventListener('keydown', (e) => {
        if (e.keyCode == 39) keyboard.RIGHT = true;
        if (e.keyCode == 37) keyboard.LEFT = true;
        if (e.keyCode == 38) keyboard.UP = true;
        if (e.keyCode == 40) keyboard.DOWN = true;
        if (e.keyCode == 32) keyboard.SPACE = true;
        if (e.keyCode == 68) keyboard.D = true;
    });

    window.addEventListener('keyup', (e) => {
        if (e.keyCode == 39) keyboard.RIGHT = false;
        if (e.keyCode == 37) keyboard.LEFT = false;
        if (e.keyCode == 38) keyboard.UP = false;
        if (e.keyCode == 40) keyboard.DOWN = false;
        if (e.keyCode == 32) keyboard.SPACE = false;
        if (e.keyCode == 68) keyboard.D = false;
    });
}

// ===== MOBILE TOUCH CONTROLS =====

/**
 * Binds touch event listeners for mobile controls
 * Prevents context menu on touch-and-hold and maps touch events to keyboard state
 * @returns {void}
 */
function bindMobileControls() {
    const btnLeft = document.getElementById('btnLeft');
    const btnRight = document.getElementById('btnRight');
    const btnJump = document.getElementById('btnJump');
    const btnThrow = document.getElementById('btnThrow');

    preventContextMenu();
    bindTouchButton(btnLeft, 'LEFT');
    bindTouchButton(btnRight, 'RIGHT');
    bindTouchButton(btnJump, 'SPACE');
    bindTouchButton(btnThrow, 'D');
}

/**
 * Prevents context menu on all mobile touch buttons
 * @returns {void}
 */
function preventContextMenu() {
    const mobileButtons = document.querySelectorAll('.btn-mobile');
    mobileButtons.forEach(btn => {
        btn.addEventListener('contextmenu', (e) => e.preventDefault());
    });
}

/**
 * Binds touch events to a button and maps them to keyboard state
 * @param {HTMLElement|null} button - The button element to bind
 * @param {string} keyProperty - The keyboard property to control (e.g., 'LEFT', 'SPACE')
 * @returns {void}
 */
function bindTouchButton(button, keyProperty) {
    if (!button) return;

    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard[keyProperty] = true;
    });

    button.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard[keyProperty] = false;
    });
}

// ===== FULLSCREEN BUTTON =====

/**
 * Initializes fullscreen button functionality
 * @returns {void}
 */
function initFullscreen() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
}

/**
 * Toggles fullscreen mode on and off
 * Enters fullscreen if not active, exits if already in fullscreen
 * @returns {void}
 */
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen().catch(err => {
            console.error('Fullscreen error:', err);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// ===== ORIENTATION DETECTION =====

/**
 * Checks device orientation and displays rotate overlay if needed
 * Shows overlay on mobile devices in portrait mode
 * @returns {void}
 */
function checkOrientation() {
    const rotateOverlay = document.getElementById('rotateOverlay');

    if (!rotateOverlay) return;

    const isMobile = window.innerWidth <= 1024;
    const isPortrait = window.innerHeight > window.innerWidth;

    if (isMobile && isPortrait) {
        rotateOverlay.style.display = 'flex';
    } else {
        rotateOverlay.style.display = 'none';
    }
}

// ===== RESPONSIVE FEATURES INITIALIZATION =====

/**
 * Initializes all responsive features
 * Sets up keyboard controls, mobile touch controls, fullscreen button,
 * and orientation detection with event listeners
 * @returns {void}
 */
function initResponsiveFeatures() {
    bindKeyboardEvents();
    bindMobileControls();
    initFullscreen();
    checkOrientation();

    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
}

// ===== START =====

/**
 * Entry point - initializes game when DOM is fully loaded
 */
window.addEventListener('DOMContentLoaded', () => {
    init();
});