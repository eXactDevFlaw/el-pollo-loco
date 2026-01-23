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
    const canvasContainer = document.getElementById('canvas-container');

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }

    // Fullscreen-Change Event Listener
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);

    // Resize Event für Fullscreen
    window.addEventListener('resize', handleFullscreenResize);
}

/**
 * Handles resize events in fullscreen
 * @returns {void}
 */
function handleFullscreenResize() {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
        const canvas = document.getElementById('canvas');
        if (canvas) {
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
        }
    }
}

/**
 * Handles fullscreen state changes
 * @returns {void}
 */
function handleFullscreenChange() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const fullscreenIcon = fullscreenBtn?.querySelector('.fullscreen-icon');
    const canvas = document.getElementById('canvas');

    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
        // Fullscreen ist aktiv
        if (fullscreenIcon) {
            fullscreenIcon.textContent = '⛶'; // Exit Fullscreen Icon
        }

        // Canvas explizit auf Fullscreen-Größe setzen
        if (canvas) {
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
            canvas.style.maxWidth = '100vw';
            canvas.style.maxHeight = '100vh';
        }

        showFullscreenInfo();
    } else {
        // Fullscreen ist inaktiv - Zurück zu Normalgröße
        if (fullscreenIcon) {
            fullscreenIcon.textContent = '⛶'; // Fullscreen Icon
        }

        // Canvas zurück auf Normalgröße
        if (canvas) {
            canvas.style.width = '';
            canvas.style.height = '';
            canvas.style.maxWidth = '';
            canvas.style.maxHeight = '';
        }

        hideFullscreenInfo();
    }
}

/**
 * Zeigt Info-Text für Fullscreen-Exit an
 * @returns {void}
 */
function showFullscreenInfo() {
    let infoElement = document.getElementById('fullscreen-info');

    if (!infoElement) {
        infoElement = document.createElement('div');
        infoElement.id = 'fullscreen-info';
        infoElement.className = 'fullscreen-info';
        infoElement.textContent = 'Press ESC to exit fullscreen';
        document.body.appendChild(infoElement);
    }

    // Info für 3 Sekunden anzeigen
    setTimeout(() => {
        if (infoElement) {
            infoElement.style.opacity = '1';
        }
    }, 100);

    setTimeout(() => {
        hideFullscreenInfo();
    }, 3000);
}

/**
 * Versteckt Fullscreen-Info
 * @returns {void}
 */
function hideFullscreenInfo() {
    const infoElement = document.getElementById('fullscreen-info');
    if (infoElement) {
        infoElement.style.opacity = '0';
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
    const canvasContainer = document.getElementById('canvas-container');

    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement) {
        // Enter fullscreen
        if (canvasContainer.requestFullscreen) {
            canvasContainer.requestFullscreen();
        } else if (canvasContainer.webkitRequestFullscreen) {
            canvasContainer.webkitRequestFullscreen();
        } else if (canvasContainer.mozRequestFullScreen) {
            canvasContainer.mozRequestFullScreen();
        }
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
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

    const isMobile = window.innerWidth <= 768;
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
        world.audioManager.stopMusic();
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

    // Exit fullscreen if active
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
    }

    if (gameOverScreen) gameOverScreen.classList.add('d-none');
    if (winScreen) winScreen.classList.add('d-none');
    if (contentContainer) contentContainer.classList.add('d-none');
    if (fullscreenBtn) fullscreenBtn.classList.add('d-none');
    if (muteBtn) muteBtn.classList.add('d-none');
    if (infoContainer) infoContainer.classList.remove('d-none');

    stopAllIntervals();

    // Cleanup Audio
    if (world?.audioManager) {
        world.audioManager.stopMusic();
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
    const impressumLink = document.getElementById('impressumLink');

    controlBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        infoContent.classList.add('d-none');
        gameControls.classList.remove('d-none');
        gameInfo.classList.add('d-none');
    })

    infoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        infoContent.classList.add('d-none');
        gameControls.classList.add('d-none');
        gameInfo.classList.remove('d-none');
    })

    // Impressum Link öffnet Information-Bereich
    if (impressumLink) {
        impressumLink.addEventListener('click', (e) => {
            e.preventDefault();
            infoContent.classList.add('d-none');
            gameControls.classList.add('d-none');
            gameInfo.classList.remove('d-none');
        });
    }
}

/**
 * Handles back button to return to home screen
 * @returns {void}
 */
function backHomeScreen() {
    const backBtn = document.querySelectorAll('.backBtn');
    const infoContent = document.querySelector('.info-content');
    const gameControls = document.querySelector('.game-howTo');
    const gameInfo = document.querySelector('.information');

    backBtn.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            gameInfo.classList.add('d-none');
            gameControls.classList.add('d-none');
            infoContent.classList.remove('d-none');
        })
    })
}

/**
 * Entry point - initializes game when DOM is fully loaded
 */
window.addEventListener('DOMContentLoaded', () => {
    init();
    initEndScreenButtons();
});

/**
 * Initializes event listeners for game end screen buttons
 * @returns {void}
 */
function initEndScreenButtons() {
    // Game Over Screen Buttons
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    const mainMenuBtn1 = document.getElementById('mainMenuBtn1');

    // Win Screen Buttons
    const playAgainBtn = document.getElementById('playAgainBtn');
    const mainMenuBtn2 = document.getElementById('mainMenuBtn2');

    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', restartGame);
    }

    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', restartGame);
    }

    if (mainMenuBtn1) {
        mainMenuBtn1.addEventListener('click', returnToHome);
    }

    if (mainMenuBtn2) {
        mainMenuBtn2.addEventListener('click', returnToHome);
    }
}