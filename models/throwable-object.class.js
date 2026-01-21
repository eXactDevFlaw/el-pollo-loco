/**
 * Klasse für geworfene Flaschen
 * Verwaltet Wurf-Animation, Flug und Splash-Effekt bei Treffer
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

    /**
     * Gibt an ob die Flasche bereits getroffen hat
     * @type {boolean}
     */
    hasHit = false;

    /**
     * Gibt an ob die Splash-Animation gerade läuft
     * @type {boolean}
     */
    isSplashing = false;

    /**
     * Interval für die Rotation während des Flugs
     * @type {number}
     */
    throwInterval;

    /**
     * Hitbox-Offsets für die Flasche
     * @type {Object}
     */
    offsetHitbox = {
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
    };

    /**
     * Erstellt eine neue geworfene Flasche
     * @param {number} x - Start X-Position
     * @param {number} y - Start Y-Position
     */
    constructor(x, y) {
        super();
        this.loadImage('./img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 60;
        this.loadImages(this.IMAGES_GROUND);
        this.loadImages(this.IMAGES_SPLASH);
        this.loadImages(this.IMAGES_THROW);
        this.throw();
    }

    /**
     * Wirft die Flasche
     */
    throw() {
        this.speedY = 25;
        this.applyGravity();

        if (world?.audioManager) {
            world.audioManager.play('bottleThrow');
        }

        this.throwInterval = setStoppableInterval(() => {
            if (!this.isSplashing) {
                this.playAnimation(this.IMAGES_THROW);
                this.x += 20;
            }
        }, 50);
    }

    /**
     * Spielt die Splash-Animation ab wenn die Flasche trifft
     */
    playSplash() {
        if (this.isSplashing) return;

        this.isSplashing = true;

        clearInterval(this.throwInterval);

        this.speedY = 0;
        this.speedX = 0;

        this.currentImage = 0;

        if (world?.audioManager) {
            world.audioManager.play('bottleSplash');
        }

        const splashInterval = setStoppableInterval(() => {
            if (this.currentImage < this.IMAGES_SPLASH.length) {
                let path = this.IMAGES_SPLASH[this.currentImage];
                this.img = this.imageCache[path];
                this.currentImage++;
            } else {
                clearInterval(splashInterval);
            }
        }, 50);
    }
}