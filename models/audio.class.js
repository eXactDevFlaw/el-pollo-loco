/**
 * Manages all sound effects and music in the game
 */
class AudioManager {
    /**
     * Creates a new AudioManager
     */
    constructor() {
        this.sounds = {};
        this.music = null;
        this.loadMuteStateFromStorage();
        this.loadAllSounds();
    }

    /**
     * Loads mute status from LocalStorage
     */
    loadMuteStateFromStorage() {
        const savedMuteState = localStorage.getItem('elPolloLocoMuted');
        this.isMuted = savedMuteState === 'true';
        this.updateMuteButton();
    }

    /**
     * Saves mute status to LocalStorage
     */
    saveMuteStateToStorage() {
        localStorage.setItem('elPolloLocoMuted', this.isMuted);
    }

    /**
     * Updates mute button icon
     */
    updateMuteButton() {
        const muteBtn = document.getElementById('audioMuteBtn');
        const muteIcon = muteBtn?.querySelector('.audio-icon');
        if (muteIcon) {
            muteIcon.textContent = this.isMuted ? '🔇' : '🔊';
        }
    }

    /**
     * Loads all sound files with predefined volumes
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
     * Loads a single sound
     * @param {string} name - Sound name
     * @param {string} path - Path to sound file
     * @param {number} volume - Volume (0.0 - 1.0)
     */
    loadSound(name, path, volume = 0.5) {
        this.sounds[name] = new Audio(path);
        this.sounds[name].volume = volume;
    }

    /**
     * Loads background music
     * @param {string} path - Path to music file
     */
    loadMusic(path) {
        this.music = new Audio(path);
        this.music.loop = true;
        this.music.volume = 0.075;
    }

    /**
     * Plays a sound
     * @param {string} name - Name of sound to play
     */
    play(name) {
        if (!this.isMuted && this.sounds[name]) {
            this.sounds[name].currentTime = 0;
            this.sounds[name].play().catch(() => { });
        }
    }

    /**
     * Plays a sound in endless loop
     * @param {string} name - Sound name
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
     * Stops a running loop sound
     * @param {string} name - Sound name
     */
    stopLoop(name) {
        if (this.sounds[name]) {
            this.sounds[name].pause();
            this.sounds[name].currentTime = 0;
            this.sounds[name].loop = false;
        }
    }

    /**
     * Starts background music
     */
    startMusic() {
        if (!this.isMuted && this.music) {
            this.music.play().catch(() => { });
        }
    }

    /**
     * Stops background music
     */
    stopMusic() {
        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
        }
    }

    /**
     * Toggles sound on/off
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.saveMuteStateToStorage();
        this.updateMuteButton();
        this.updateMusicVolume();
    }

    /**
     * Updates music volume based on mute state
     */
    updateMusicVolume() {
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
     * Stops all sounds and cleans up
     */
    cleanup() {
        Object.keys(this.sounds).forEach(soundName => {
            this.stopLoop(soundName);
        });
        this.stopMusic();
    }
}