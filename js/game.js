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

let infoContainer;

/**
 * Initializes the game
 * Creates canvas reference and sets up responsive features
 * @returns {void}
 */
function init() {
    canvas = document.getElementById('canvas');
    initResponsiveFeatures();
    startGame();
    infoGame();
    backHomeScreen();
}

/**
 * Binds keyboard event listeners for desktop controls
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

/**
 * Binds touch event listeners for mobile controls
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
    bindTouchButton(btnJump, 'UP');
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
 * @param {string} keyProperty - The keyboard property to control
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
 * Initialisiert die Mute-Button Funktionalität
 * @returns {void}
 */
function initMuteButton() {
    const muteBtn = document.getElementById('audioMuteBtn');

    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            if (world && world.audioManager) {
                world.audioManager.toggleMute();
            }
        });
    }
}

/**
 * Toggles fullscreen mode on and off
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

/**
 * Checks device orientation and displays rotate overlay if needed
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

/**
 * Initializes all responsive features
 * @returns {void}
 */
function initResponsiveFeatures() {
    bindKeyboardEvents();
    bindMobileControls();
    initFullscreen();
    initMuteButton();
    checkOrientation();

    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
}

/**
 * Starts the game and creates world instance
 * @returns {void}
 */
function startGame() {
    const startBtn = document.querySelector('#game-startBtn');
    const contentContainer = document.querySelector('#canvas-container');
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const muteBtn = document.querySelector('.audio-mute-btn');
    infoContainer = document.querySelector('.info-container');
    startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        infoContainer.classList.add('d-none');
        contentContainer.classList.remove('d-none');
        fullscreenBtn.classList.remove('d-none');
        muteBtn.classList.remove('d-none');
        initLevel();
        world = new World(canvas, keyboard);
    })
}

/**
 * Startet das Spiel neu ohne Page Reload
 * @returns {void}
 */
function restartGame() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    const winScreen = document.getElementById('winScreen');

    if (gameOverScreen) gameOverScreen.classList.add('d-none');
    if (winScreen) winScreen.classList.add('d-none');

    stopAllIntervals();

    // Cleanup altes Audio komplett
    if (world?.audioManager) {
        world.audioManager.cleanup();
    }

    initLevel();
    world = new World(canvas, keyboard);
}

/**
 * Kehrt zum Hauptmenü zurück
 * @returns {void}
 */
function returnToHome() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    const winScreen = document.getElementById('winScreen');
    const contentContainer = document.querySelector('#canvas-container');
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const muteBtn = document.querySelector('.audio-mute-btn');

    if (gameOverScreen) gameOverScreen.classList.add('d-none');
    if (winScreen) winScreen.classList.add('d-none');
    if (contentContainer) contentContainer.classList.add('d-none');
    if (fullscreenBtn) fullscreenBtn.classList.add('d-none');
    if (muteBtn) muteBtn.classList.add('d-none');
    if (infoContainer) infoContainer.classList.remove('d-none');

    stopAllIntervals();

    // Cleanup Audio
    if (world?.audioManager) {
        world.audioManager.cleanup();
    }
}

/**
 * Initializes info game sections
 * @returns {void}
 */
function infoGame() {
    const infoContent = document.querySelector('.info-content');
    const controlBtn = document.querySelector('#game-controlBtn');
    const gameControls = document.querySelector('.game-howTo');
    const infoBtn = document.querySelector('#game-infoBtn');
    const gameInfo = document.querySelector('.information');

    controlBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        infoContent.classList.add('d-none');
        gameControls.classList.remove('d-none');
    })

    infoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        infoContent.classList.add('d-none');
        gameInfo.classList.remove('d-none');
    })
}

/**
 * Handles back button to return to home screen
 * @returns {void}
 */
function backHomeScreen() {
    const backBtn = document.querySelectorAll('.backBtn');
    const infoContent = document.querySelector('.info-content');
    const gameInfo = document.querySelector('.game-howTo');
    const infoContainer = document.querySelector('.information');
    backBtn.forEach(btn => {
        btn.addEventListener('click', (e) => {
            infoContainer.classList.add('d-none');
            gameInfo.classList.add('d-none');
            infoContent.classList.remove('d-none');
        })
    })
}

/**
 * Entry point - initializes game when DOM is fully loaded
 */
window.addEventListener('DOMContentLoaded', () => {
    init();
});