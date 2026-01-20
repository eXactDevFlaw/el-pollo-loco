/**
 * AudioManager-Klasse
 * Verwaltet alle Sound-Effekte und Musik im Spiel
 */
class AudioManager {
    /**
     * Erstellt einen neuen AudioManager
     */
    constructor() {
        this.isMuted = false;
        this.sounds = {};
        this.music = null;
        this.loadAllSounds();
    }

    /**
     * Lädt alle Sound-Dateien
     */
    loadAllSounds() {
        this.loadSound('coin', 'audio/coin_collect.wav');
        this.loadSound('flask', 'audio/flask_collect.wav');
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
        if (this.music) {
            this.music.volume = this.isMuted ? 0 : 0.3;
        }
    }
}