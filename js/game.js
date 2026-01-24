let canvas;
let world;
let keyboard = new Keyboard();
let infoContainer;

/**
 * Initializes the game
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
 */
function bindKeyboardEvents() {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
}

/**
 * Handles keydown events
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyDown(e) {
    if (e.keyCode == 39) keyboard.RIGHT = true;
    if (e.keyCode == 37) keyboard.LEFT = true;
    if (e.keyCode == 38) keyboard.UP = true;
    if (e.keyCode == 40) keyboard.DOWN = true;
    if (e.keyCode == 32) keyboard.SPACE = true;
    if (e.keyCode == 68) keyboard.D = true;
}

/**
 * Handles keyup events
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyUp(e) {
    if (e.keyCode == 39) keyboard.RIGHT = false;
    if (e.keyCode == 37) keyboard.LEFT = false;
    if (e.keyCode == 38) keyboard.UP = false;
    if (e.keyCode == 40) keyboard.DOWN = false;
    if (e.keyCode == 32) keyboard.SPACE = false;
    if (e.keyCode == 68) keyboard.D = false;
}

/**
 * Binds touch event listeners for mobile controls
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
 */
function preventContextMenu() {
    const mobileButtons = document.querySelectorAll('.btn-mobile');
    mobileButtons.forEach(btn => {
        btn.addEventListener('contextmenu', (e) => e.preventDefault());
    });
}

/**
 * Binds touch events to a button
 * @param {HTMLElement|null} button - The button element
 * @param {string} keyProperty - The keyboard property
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
 */
function initFullscreen() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
    addFullscreenEventListeners();
    window.addEventListener('resize', handleFullscreenResize);
}

/**
 * Adds fullscreen event listeners
 */
function addFullscreenEventListeners() {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
}

/**
 * Handles resize events in fullscreen
 */
function handleFullscreenResize() {
    if (isInFullscreen()) {
        adjustCanvasAspectRatio();
    }
}

/**
 * Adjusts canvas to maintain 3:2 aspect ratio
 */
function adjustCanvasAspectRatio() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    const targetRatio = 3 / 2;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowRatio = windowWidth / windowHeight;
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
    if (windowRatio > targetRatio) {
        canvas.style.height = '100vh';
        canvas.style.width = `${windowHeight * targetRatio}px`;
    } else {
        canvas.style.width = '100vw';
        canvas.style.height = `${windowWidth / targetRatio}px`;
    }
}

/**
 * Handles fullscreen state changes
 */
function handleFullscreenChange() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const fullscreenIcon = fullscreenBtn?.querySelector('.fullscreen-icon');
    if (isInFullscreen()) {
        updateFullscreenIcon(fullscreenIcon, '⛶');
        adjustCanvasAspectRatio();
        showFullscreenInfo();
    } else {
        updateFullscreenIcon(fullscreenIcon, '⛶');
        resetCanvasSize();
        hideFullscreenInfo();
    }
}

/**
 * Resets canvas to default size
 */
function resetCanvasSize() {
    const canvas = document.getElementById('canvas');
    if (canvas) {
        canvas.style.width = '';
        canvas.style.height = '';
        canvas.style.display = '';
        canvas.style.margin = '';
    }
}

/**
 * Checks if currently in fullscreen
 * @returns {boolean} True if in fullscreen
 */
function isInFullscreen() {
    return document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement;
}

/**
 * Updates fullscreen icon
 * @param {HTMLElement} icon - Icon element
 * @param {string} text - Icon text
 */
function updateFullscreenIcon(icon, text) {
    if (icon) {
        icon.textContent = text;
    }
}

/**
 * Shows fullscreen info text
 */
function showFullscreenInfo() {
    let infoElement = getOrCreateFullscreenInfo();
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
 * Gets or creates fullscreen info element
 * @returns {HTMLElement} Info element
 */
function getOrCreateFullscreenInfo() {
    let infoElement = document.getElementById('fullscreen-info');
    if (!infoElement) {
        infoElement = createFullscreenInfoElement();
        document.body.appendChild(infoElement);
    }
    return infoElement;
}

/**
 * Creates fullscreen info element
 * @returns {HTMLElement} Created element
 */
function createFullscreenInfoElement() {
    const infoElement = document.createElement('div');
    infoElement.id = 'fullscreen-info';
    infoElement.className = 'fullscreen-info';
    infoElement.textContent = 'Press ESC to exit fullscreen';
    return infoElement;
}

/**
 * Hides fullscreen info
 */
function hideFullscreenInfo() {
    const infoElement = document.getElementById('fullscreen-info');
    if (infoElement) {
        infoElement.style.opacity = '0';
    }
}

/**
 * Initializes mute button functionality
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
 * Toggles fullscreen mode on/off
 */
function toggleFullscreen() {
    const canvasContainer = document.getElementById('canvas-container');
    if (!isInFullscreen()) {
        enterFullscreen(canvasContainer);
    } else {
        exitFullscreen();
    }
}

/**
 * Enters fullscreen mode
 * @param {HTMLElement} element - Element to make fullscreen
 */
function enterFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    }
}

/**
 * Exits fullscreen mode
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }
}

/**
 * Checks device orientation and shows rotate overlay if needed
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
 */
function initResponsiveFeatures() {
    bindKeyboardEvents();
    bindMobileControls();
    initFullscreen();
    initMuteButton();
    checkOrientation();
    addOrientationListeners();
}

/**
 * Adds orientation change listeners
 */
function addOrientationListeners() {
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
}

/**
 * Starts the game and creates world instance
 */
function startGame() {
    const startBtn = document.querySelector('#game-startBtn');
    const contentContainer = document.querySelector('#canvas-container');
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const muteBtn = document.querySelector('.audio-mute-btn');
    infoContainer = document.querySelector('.info-container');
    startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showGameInterface();
        initLevel();
        world = new World(canvas, keyboard);
    })
}

/**
 * Shows game interface elements
 */
function showGameInterface() {
    const contentContainer = document.querySelector('#canvas-container');
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const muteBtn = document.querySelector('.audio-mute-btn');
    infoContainer.classList.add('d-none');
    contentContainer.classList.remove('d-none');
    fullscreenBtn.classList.remove('d-none');
    muteBtn.classList.remove('d-none');
}

/**
 * Restarts game without page reload
 */
function restartGame() {
    hideEndScreens();
    stopAllIntervals();
    stopMusic();
    initLevel();
    world = new World(canvas, keyboard);
}

/**
 * Hides end screens
 */
function hideEndScreens() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    const winScreen = document.getElementById('winScreen');
    if (gameOverScreen) gameOverScreen.classList.add('d-none');
    if (winScreen) winScreen.classList.add('d-none');
}

/**
 * Stops background music
 */
function stopMusic() {
    if (world?.audioManager) {
        world.audioManager.stopMusic();
    }
}

/**
 * Returns to main menu
 */
function returnToHome() {
    exitFullscreenIfActive();
    hideAllGameElements();
    showMainMenu();
    stopAllIntervals();
    stopMusic();
}

/**
 * Exits fullscreen if active
 */
function exitFullscreenIfActive() {
    if (isInFullscreen()) {
        exitFullscreen();
    }
}

/**
 * Hides all game elements
 */
function hideAllGameElements() {
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
}

/**
 * Shows main menu
 */
function showMainMenu() {
    if (infoContainer) infoContainer.classList.remove('d-none');
}

/**
 * Initializes info game sections
 */
function infoGame() {
    const infoContent = document.querySelector('.info-content');
    const controlBtn = document.querySelector('#game-controlBtn');
    const gameControls = document.querySelector('.game-howTo');
    const infoBtn = document.querySelector('#game-infoBtn');
    const gameInfo = document.querySelector('.information');
    const impressumLink = document.getElementById('impressumLink');
    bindInfoButtons(infoContent, controlBtn, gameControls, infoBtn, gameInfo);
    bindImpressumLink(impressumLink, infoContent, gameControls, gameInfo);
}

/**
 * Binds info button events
 * @param {HTMLElement} infoContent - Info content element
 * @param {HTMLElement} controlBtn - Control button
 * @param {HTMLElement} gameControls - Game controls element
 * @param {HTMLElement} infoBtn - Info button
 * @param {HTMLElement} gameInfo - Game info element
 */
function bindInfoButtons(infoContent, controlBtn, gameControls, infoBtn, gameInfo) {
    controlBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showControls(infoContent, gameControls, gameInfo);
    });
    infoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showInfo(infoContent, gameControls, gameInfo);
    });
}

/**
 * Shows controls screen
 * @param {HTMLElement} infoContent - Info content element
 * @param {HTMLElement} gameControls - Game controls element
 * @param {HTMLElement} gameInfo - Game info element
 */
function showControls(infoContent, gameControls, gameInfo) {
    infoContent.classList.add('d-none');
    gameControls.classList.remove('d-none');
    gameInfo.classList.add('d-none');
}

/**
 * Shows info screen
 * @param {HTMLElement} infoContent - Info content element
 * @param {HTMLElement} gameControls - Game controls element
 * @param {HTMLElement} gameInfo - Game info element
 */
function showInfo(infoContent, gameControls, gameInfo) {
    infoContent.classList.add('d-none');
    gameControls.classList.add('d-none');
    gameInfo.classList.remove('d-none');
}

/**
 * Binds impressum link event
 * @param {HTMLElement} impressumLink - Impressum link element
 * @param {HTMLElement} infoContent - Info content element
 * @param {HTMLElement} gameControls - Game controls element
 * @param {HTMLElement} gameInfo - Game info element
 */
function bindImpressumLink(impressumLink, infoContent, gameControls, gameInfo) {
    if (impressumLink) {
        impressumLink.addEventListener('click', (e) => {
            e.preventDefault();
            showInfo(infoContent, gameControls, gameInfo);
        });
    }
}

/**
 * Handles back button to return to home screen
 */
function backHomeScreen() {
    const backBtn = document.querySelectorAll('.backBtn');
    const infoContent = document.querySelector('.info-content');
    const gameControls = document.querySelector('.game-howTo');
    const gameInfo = document.querySelector('.information');
    backBtn.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            returnToMainMenu(gameInfo, gameControls, infoContent);
        });
    });
}

/**
 * Returns to main menu screen
 * @param {HTMLElement} gameInfo - Game info element
 * @param {HTMLElement} gameControls - Game controls element
 * @param {HTMLElement} infoContent - Info content element
 */
function returnToMainMenu(gameInfo, gameControls, infoContent) {
    gameInfo.classList.add('d-none');
    gameControls.classList.add('d-none');
    infoContent.classList.remove('d-none');
}

/**
 * Entry point - initializes game when DOM is loaded
 */
window.addEventListener('DOMContentLoaded', () => {
    init();
    initEndScreenButtons();
});

/**
 * Initializes event listeners for game end screen buttons
 */
function initEndScreenButtons() {
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    const mainMenuBtn1 = document.getElementById('mainMenuBtn1');
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