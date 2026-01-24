/**
 * Regular chicken enemy
 */
class Chicken extends MovableObject {
    y = 360;
    height = 60;
    width = 60;
    hasSeenCharacter = false;

    offsetHitbox = {
        top: 10,
        left: 10,
        right: 10,
        bottom: 10
    }

    IMAGES_WALK = [
        './img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        './img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        './img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        './img/3_enemies_chicken/chicken_normal/2_dead/dead.png',
    ];

    /**
     * Creates a new chicken at random position
     */
    constructor() {
        super();
        this.loadImage('./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALK)
        this.loadImages(this.IMAGES_DEAD)
        this.x = 200 + Math.round(Math.random() * 2000);
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }

    /**
     * Starts movement and animation
     */
    animate() {
        setStoppableInterval(() => {
            this.move();
        }, 1000 / 60)

        setStoppableInterval(() => {
            this.playAnimation(this.IMAGES_WALK);
        }, 100);
    }

    /**
     * Moves chicken based on current direction
     */
    move() {
        if (this.otherDirection) {
            this.moveRight();
        } else {
            this.moveLeft();
        }
    }

    /**
     * Updates behavior based on character position
     * @param {Character} character - The player character
     */
    updateBehavior(character) {
        if (this.shouldChaseCharacter(character)) {
            this.chaseCharacter(character);
        }
    }

    /**
     * Checks if chicken should chase character
     * @param {Character} character - The player character
     * @returns {boolean} True if should chase
     */
    shouldChaseCharacter(character) {
        return character.x > this.x && !this.hasSeenCharacter;
    }

    /**
     * Makes chicken chase the character
     * @param {Character} character - The player character
     */
    chaseCharacter(character) {
        this.hasSeenCharacter = true;
        this.otherDirection = true;
    }
}