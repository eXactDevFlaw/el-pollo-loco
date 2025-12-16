/**
 * @fileoverview Mobile Fullscreen Handler
 * Aktiviert automatisch Fullscreen-Modus auf Mobile-Geräten beim Spielstart
 */

/**
 * Initialisiert den Mobile Fullscreen Handler
 * Wartet auf DOMContentLoaded und bindet Event Listener an Start-Button
 * @returns {void}
 */
function initMobileFullscreen() {
    document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.getElementById('game-startBtn');

        if (startBtn) {
            startBtn.addEventListener('click', handleGameStart);
        }
    });
}

/**
 * Handler für Game-Start Button Click
 * Aktiviert Fullscreen auf Mobile-Geräten im Landscape-Modus
 * @returns {void}
 */
function handleGameStart() {
    const isMobile = window.innerWidth <= 768;
    const isLandscape = window.innerWidth > window.innerHeight;

    // Fullscreen nur auf Mobile im Landscape aktivieren
    if (isMobile && isLandscape) {
        setTimeout(() => {
            requestCanvasFullscreen();
        }, 100);
    }
}

/**
 * Fordert Fullscreen für das Canvas-Element an
 * @returns {void}
 */
function requestCanvasFullscreen() {
    const canvas = document.getElementById('canvas');

    if (canvas && !document.fullscreenElement) {
        canvas.requestFullscreen().catch(err => {
            console.log('Fullscreen nicht verfügbar:', err);
        });
    }
}

// Initialisierung starten
initMobileFullscreen();