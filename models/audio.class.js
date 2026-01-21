/**
 * AudioManager-Klasse
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
     * Lädt alle Sound-Dateien
     */
    loadAllSounds() {
        this.loadSound('coin', 'audio/coin_collect.wav');
        this.loadSound('flask', 'audio/flask_collect.wav');
        this.loadSound('jump', 'audio/jump.mp3');
        this.loadSound('hurt', 'audio/hurt.mp3');
        this.loadSound('death', 'audio/death.mp3');
        this.loadSound('snoring', 'audio/snoring.mp3');
        this.loadSound('walking', 'audio/walking.mp3');
        this.loadSound('chickenDeath', 'audio/chicken_death.mp3');
        this.loadSound('bossHurt', 'audio/boss_hurt.mp3');
        this.loadSound('bossAttack', 'audio/boss_attack.mp3');
        this.loadSound('bottleThrow', 'audio/bottle_throw.mp3');
        this.loadSound('bottleSplash', 'audio/bottle_splash.mp3');

        this.loadMusic('audio/background_music.mp3');
    }

    /**
     * Lädt einen einzelnen Sound
     * @param {string} name - Name des Sounds
     * @param {string} path - Pfad zur Sound-Datei
     */
    loadSound(name, path) {
        this.sounds[name] = new Audio(path);
    }

    /**
     * Lädt Hintergrundmusik
     * @param {string} path - Pfad zur Musik-Datei
     */
    loadMusic(path) {
        this.music = new Audio(path);
        this.music.loop = true;
        this.music.volume = 0.3;
    }

    /**
     * Spielt einen Sound ab
     * @param {string} name - Name des abzuspielenden Sounds
     */
    play(name) {
        if (!this.isMuted && this.sounds[name]) {
            this.sounds[name].currentTime = 0;
            this.sounds[name].play();
        }
    }

    /**
     * Startet die Hintergrundmusik
     */
    startMusic() {
        if (!this.isMuted && this.music) {
            this.music.play();
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
            this.music.volume = this.isMuted ? 0 : 0.3;
        }
    }
}