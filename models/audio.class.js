class AudioManager {
    constructor() {
        this.isMuted = false;
        this.sounds = {};
        this.music = null;
    }


    loadSound(name, path) {
        this.sounds[name] = new Audio(path);
    }

    loadMusic(path) {
        this.music = new Audio(path);
        this.music.loop = true;
        this.music.volume = 0.3;
    }

    play(name) {
        if (!this.isMuted && this.sounds[name]) {
            this.sounds[name].currentTime = 0;
            this.sounds[name].play();
        }
    }

    startMusic() {
        if (!this.isMuted && this.music) {
            this.music.play();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.music) {
            this.music.volume = this.isMuted ? 0 : 0.3;
        }
    }
}