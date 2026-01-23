let canvas;
let world;
let keyboard = new Keyboard();
let infoContainer;

/**
 * Initialisiert das Spiel
 */
function init() {
    canvas = document.getElementById('canvas');
    initResponsiveFeatures();
    startGame();
    infoGame();
    backHomeScreen();
}

/**
 * Bindet Keyboard Event Listener für Desktop-Controls
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
 * Bindet Touch Event Listener für Mobile-Controls
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
 * Verhindert Kontextmenü auf allen Mobile-Touch-Buttons
 */
function preventContextMenu() {
    const mobileButtons = document.querySelectorAll('.btn-mobile');
    mobileButtons.forEach(btn => {
        btn.addEventListener('contextmenu', (e) => e.preventDefault());
    });
}

/**
 * Bindet Touch-Events an einen Button
 * @param {HTMLElement|null} button - Das Button-Element
 * @param {string} keyProperty - Die Keyboard-Property
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
 * Initialisiert Fullscreen-Button Funktionalität
 */
function initFullscreen() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const canvasContainer = document.getElementById('canvas-container');

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);

    window.addEventListener('resize', handleFullscreenResize);
}

/**
 * Behandelt Resize-Events im Fullscreen
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
 * Behandelt Fullscreen-State Änderungen
 */
function handleFullscreenChange() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const fullscreenIcon = fullscreenBtn?.querySelector('.fullscreen-icon');
    const canvas = document.getElementById('canvas');

    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
        if (fullscreenIcon) {
            fullscreenIcon.textContent = '⛶';
        }

        if (canvas) {
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
            canvas.style.maxWidth = '100vw';
            canvas.style.maxHeight = '100vh';
        }

        showFullscreenInfo();
    } else {
        if (fullscreenIcon) {
            fullscreenIcon.textContent = '⛶';
        }

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
 */
function hideFullscreenInfo() {
    const infoElement = document.getElementById('fullscreen-info');
    if (infoElement) {
        infoElement.style.opacity = '0';
    }
}

/**
 * Initialisiert die Mute-Button Funktionalität
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
 * Schaltet Fullscreen-Modus ein/aus
 */
function toggleFullscreen() {
    const canvasContainer = document.getElementById('canvas-container');

    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement) {
        if (canvasContainer.requestFullscreen) {
            canvasContainer.requestFullscreen();
        } else if (canvasContainer.webkitRequestFullscreen) {
            canvasContainer.webkitRequestFullscreen();
        } else if (canvasContainer.mozRequestFullScreen) {
            canvasContainer.mozRequestFullScreen();
        }
    } else {
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
 * Prüft Geräte-Orientierung und zeigt Rotate-Overlay wenn nötig
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
 * Initialisiert alle Responsive-Features
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
 * Startet das Spiel und erstellt World-Instanz
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
 */
function restartGame() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    const winScreen = document.getElementById('winScreen');

    if (gameOverScreen) gameOverScreen.classList.add('d-none');
    if (winScreen) winScreen.classList.add('d-none');

    stopAllIntervals();

    if (world?.audioManager) {
        world.audioManager.stopMusic();
    }

    initLevel();
    world = new World(canvas, keyboard);
}

/**
 * Kehrt zum Hauptmenü zurück
 */
function returnToHome() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    const winScreen = document.getElementById('winScreen');
    const contentContainer = document.querySelector('#canvas-container');
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const muteBtn = document.querySelector('.audio-mute-btn');

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

    if (world?.audioManager) {
        world.audioManager.stopMusic();
    }
}

/**
 * Initialisiert Info-Game Bereiche
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
 * Behandelt Back-Button um zum Home-Screen zurückzukehren
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
 * Entry Point - initialisiert Spiel wenn DOM geladen ist
 */
window.addEventListener('DOMContentLoaded', () => {
    init();
    initEndScreenButtons();
});

/**
 * Initialisiert Event Listener für Game-End-Screen Buttons
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