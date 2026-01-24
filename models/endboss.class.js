/**
 * The final boss enemy
 */
class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y = 60;
    x = 2400;
    energy = 100;
    speed = 2;
    baseSpeed = 2;
    maxSpeed = 8;
    speedIncreasePerHit = 1;

    offsetHitbox = {
        top: 100,
        left: 30,
        right: 30,
        bottom: 30
    }

    IMAGES_WALK = [
        './img/4_enemie_boss_chicken/1_walk/G1.png',
        './img/4_enemie_boss_chicken/1_walk/G2.png',
        './img/4_enemie_boss_chicken/1_walk/G3.png',
        './img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    IMAGES_ALERT = [
        './img/4_enemie_boss_chicken/2_alert/G5.png',
        './img/4_enemie_boss_chicken/2_alert/G6.png',
        './img/4_enemie_boss_chicken/2_alert/G7.png',
        './img/4_enemie_boss_chicken/2_alert/G8.png',
        './img/4_enemie_boss_chicken/2_alert/G9.png',
        './img/4_enemie_boss_chicken/2_alert/G10.png',
        './img/4_enemie_boss_chicken/2_alert/G11.png',
        './img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    IMAGES_ATTACK = [
        './img/4_enemie_boss_chicken/3_attack/G13.png',
        './img/4_enemie_boss_chicken/3_attack/G14.png',
        './img/4_enemie_boss_chicken/3_attack/G15.png',
        './img/4_enemie_boss_chicken/3_attack/G16.png',
        './img/4_enemie_boss_chicken/3_attack/G17.png',
        './img/4_enemie_boss_chicken/3_attack/G18.png',
        './img/4_enemie_boss_chicken/3_attack/G19.png',
        './img/4_enemie_boss_chicken/3_attack/G20.png',
    ];

    IMAGES_HURT = [
        './img/4_enemie_boss_chicken/4_hurt/G21.png',
        './img/4_enemie_boss_chicken/4_hurt/G22.png',
        './img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    IMAGES_DEAD = [
        './img/4_enemie_boss_chicken/5_dead/G24.png',
        './img/4_enemie_boss_chicken/5_dead/G25.png',
        './img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    hadFirstContact = false;
    characterX = 0;

    /**
     * Creates a new endboss
     */
    constructor() {
        super();
        this.loadAllImages();
        this.animate();
    }

    /**
     * Loads all endboss images
     */
    loadAllImages() {
        this.loadImage('./img/4_enemie_boss_chicken/2_alert/G5.png');
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_WALK);
    }

    /**
     * Manages all animations and movement
     */
    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
    }

    /**
     * Starts the movement update loop
     */
    startMovementLoop() {
        setStoppableInterval(() => {
            if (this.shouldMove()) {
                this.moveTowardsCharacter();
            }
        }, 1000 / 60);
    }

    /**
     * Checks if endboss should move
     * @returns {boolean} True if should move
     */
    shouldMove() {
        return this.hadFirstContact && this.energy > 0;
    }

    /**
     * Moves endboss towards character position
     */
    moveTowardsCharacter() {
        const distanceToCharacter = this.characterX - this.x;
        const minDistance = 10;
        if (distanceToCharacter < -minDistance) {
            this.moveLeft();
            this.otherDirection = false;
        } else if (distanceToCharacter > minDistance) {
            this.moveRight();
            this.otherDirection = true;
        }
    }

    /**
     * Starts the animation update loop
     */
    startAnimationLoop() {
        setStoppableInterval(() => {
            this.updateAnimation();
        }, 200);
    }

    /**
     * Updates current animation state
     */
    updateAnimation() {
        if (this.isDead()) {
            this.handleDeathAnimation();
            return;
        }
        if (this.isHurt()) {
            this.playAnimationOnce(this.IMAGES_HURT);
            return;
        }
        if (this.isAttacking()) {
            this.playAnimation(this.IMAGES_ATTACK);
            return;
        }
        this.playIdleAnimation();
    }

    /**
     * Handles death animation
     */
    handleDeathAnimation() {
        this.speed = 0;
        this.playAnimationOnce(this.IMAGES_DEAD);
    }

    /**
     * Checks if endboss is attacking character
     * @returns {boolean} True if colliding with character
     */
    isAttacking() {
        return this.isColliding(world.character);
    }

    /**
     * Plays idle or walk animation
     */
    playIdleAnimation() {
        if (this.hadFirstContact) {
            this.playAnimation(this.IMAGES_WALK);
        } else {
            this.playAnimation(this.IMAGES_ALERT);
        }
    }

    /**
     * Takes damage and increases speed
     * @param {number} damage - Amount of damage
     */
    hit(damage = 20) {
        super.hit(damage);
        this.increaseSpeed();
    }

    /**
     * Increases speed after taking damage
     */
    increaseSpeed() {
        if (this.energy > 0) {
            this.speed = Math.min(
                this.speed + this.speedIncreasePerHit,
                this.maxSpeed
            );
        }
    }

    /**
     * Updates behavior based on character position
     * @param {Character} character - The player character
     */
    updateBehavior(character) {
        this.characterX = character.x;
        if (!this.hadFirstContact && character.x > 2000) {
            this.hadFirstContact = true;
        }
    }
}