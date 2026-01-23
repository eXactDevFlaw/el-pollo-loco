/**
 * Verwaltet alle Sound-Effekte und Musik im Spiel
 */
class AudioManager {
    /**
     * Erstellt einen neuen AudioManager
     */
    constructor() {
        this.sounds = {};
        this.music = null;
        this.loadMuteStateFromStorage();
        this.loadAllSounds();
    }

    /**
     * Lädt den Mute-Status aus dem LocalStorage
     */
    loadMuteStateFromStorage() {
        const savedMuteState = localStorage.getItem('elPolloLocoMuted');
        this.isMuted = savedMuteState === 'true';
        this.updateMuteButton();
    }

    /**
     * Speichert den Mute-Status im LocalStorage
     */
    saveMuteStateToStorage() {
        localStorage.setItem('elPolloLocoMuted', this.isMuted);
    }

    /**
     * Aktualisiert das Mute Button Icon
     */
    updateMuteButton() {
        const muteBtn = document.getElementById('audioMuteBtn');
        const muteIcon = muteBtn?.querySelector('.audio-icon');
        if (muteIcon) {
            muteIcon.textContent = this.isMuted ? '🔇' : '🔊';
        }
    }

    /**
     * Lädt alle Sound-Dateien mit vordefinierten Lautstärken
     */
    loadAllSounds() {
        this.loadSound('coin', 'audio/coin_collect.wav', 0.6);
        this.loadSound('flask', 'audio/flask_collect.wav', 0.6);
        this.loadSound('jump', 'audio/jump.mp3', 0.5);
        this.loadSound('walking', 'audio/walking.mp3', 0.3);
        this.loadSound('hurt', 'audio/hurt.wav', 0.7);
        this.loadSound('snoring', 'audio/snoring.mp3', 0.4);
        this.loadSound('bottleSplash', 'audio/bottle_splash.wav', 0.7);
        this.loadMusic('audio/background_music.wav');
    }

    /**
     * Lädt einen einzelnen Sound
     * @param {string} name - Name des Sounds
     * @param {string} path - Pfad zur Sound-Datei
     * @param {number} volume - Lautstärke (0.0 - 1.0)
     */
    loadSound(name, path, volume = 0.5) {
        this.sounds[name] = new Audio(path);
        this.sounds[name].volume = volume;
    }

    /**
     * Lädt Hintergrundmusik
     * @param {string} path - Pfad zur Musik-Datei
     */
    loadMusic(path) {
        this.music = new Audio(path);
        this.music.loop = true;
        this.music.volume = 0.075;
    }

    /**
     * Spielt einen Sound ab
     * @param {string} name - Name des abzuspielenden Sounds
     */
    play(name) {
        if (!this.isMuted && this.sounds[name]) {
            this.sounds[name].currentTime = 0;
            this.sounds[name].play().catch(() => { });
        }
    }

    /**
     * Spielt einen Sound in Endlosschleife ab
     * @param {string} name - Name des Sounds
     */
    playLoop(name) {
        if (!this.isMuted && this.sounds[name]) {
            if (this.sounds[name].paused) {
                this.sounds[name].loop = true;
                this.sounds[name].play().catch(() => { });
            }
        }
    }

    /**
     * Stoppt einen laufenden Loop-Sound
     * @param {string} name - Name des Sounds
     */
    stopLoop(name) {
        if (this.sounds[name]) {
            this.sounds[name].pause();
            this.sounds[name].currentTime = 0;
            this.sounds[name].loop = false;
        }
    }

    /**
     * Startet die Hintergrundmusik
     */
    startMusic() {
        if (!this.isMuted && this.music) {
            this.music.play().catch(() => { });
        }
    }

    /**
     * Stoppt die Hintergrundmusik
     */
    stopMusic() {
        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
        }
    }

    /**
     * Schaltet den Ton ein/aus
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.saveMuteStateToStorage();
        this.updateMuteButton();

        if (this.music) {
            if (this.isMuted) {
                this.music.volume = 0;
            } else {
                this.music.volume = 0.075;
                if (this.music.paused) {
                    this.music.play().catch(() => { });
                }
            }
        }
    }

    /**
     * Stoppt alle Sounds und räumt auf
     */
    cleanup() {
        Object.keys(this.sounds).forEach(soundName => {
            this.stopLoop(soundName);
        });
        this.stopMusic();
    }
}