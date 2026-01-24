/**
 * Thrown bottles with throw animation and splash effect
 */
class ThrowableObject extends MovableObject {
    IMAGES_GROUND = [
        './img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        './img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
    ];

    IMAGES_THROW = [
        './img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        './img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        './img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        './img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];

    IMAGES_SPLASH = [
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ];

    hasHit = false;
    isSplashing = false;
    throwInterval;
    throwLeft = false;

    offsetHitbox = {
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
    };

    /**
     * Creates a new throwable bottle
     * @param {number} x - Start X position
     * @param {number} y - Start Y position
     * @param {boolean} throwLeft - Whether to throw left instead of right
     */
    constructor(x, y, throwLeft = false) {
        super();
        this.loadImage('./img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 60;
        this.throwLeft = throwLeft;
        this.otherDirection = throwLeft;
        this.loadImages(this.IMAGES_GROUND);
        this.loadImages(this.IMAGES_SPLASH);
        this.loadImages(this.IMAGES_THROW);
        this.throw();
    }

    /**
     * Throws the bottle in the specified direction
     */
    throw() {
        this.speedY = 25;
        this.applyGravity();
        this.playThrowSound();
        this.startThrowAnimation();
    }

    /**
     * Plays the bottle throw sound effect
     */
    playThrowSound() {
        if (world?.audioManager) {
            world.audioManager.play('bottleThrow');
        }
    }

    /**
     * Starts the throw animation and movement
     */
    startThrowAnimation() {
        this.throwInterval = setStoppableInterval(() => {
            if (!this.isSplashing) {
                this.playAnimation(this.IMAGES_THROW);
                this.moveBottle();
            }
        }, 50);
    }

    /**
     * Moves the bottle based on throw direction
     */
    moveBottle() {
        const speed = 20;
        this.x += this.throwLeft ? -speed : speed;
    }

    /**
     * Plays the splash animation when bottle hits
     */
    playSplash() {
        if (this.isSplashing) return;
        this.isSplashing = true;
        this.stopMovement();
        this.resetAnimationIndex();
        this.playBottleSplashSound();
        this.animateSplash();
    }

    /**
     * Stops bottle movement
     */
    stopMovement() {
        clearInterval(this.throwInterval);
        this.speedY = 0;
        this.speedX = 0;
    }

    /**
     * Resets animation index for splash
     */
    resetAnimationIndex() {
        this.currentImage = 0;
    }

    /**
     * Plays bottle splash sound
     */
    playBottleSplashSound() {
        if (world?.audioManager) {
            world.audioManager.play('bottleSplash');
        }
    }

    /**
     * Animates the splash effect
     */
    animateSplash() {
        const splashInterval = setStoppableInterval(() => {
            if (this.shouldContinueSplash()) {
                this.showNextSplashFrame();
            } else {
                clearInterval(splashInterval);
            }
        }, 50);
    }

    /**
     * Checks if splash animation should continue
     * @returns {boolean} True if more frames remain
     */
    shouldContinueSplash() {
        return this.currentImage < this.IMAGES_SPLASH.length;
    }

    /**
     * Shows next frame of splash animation
     */
    showNextSplashFrame() {
        let path = this.IMAGES_SPLASH[this.currentImage];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}