/**
 * Enemy chicken class.
 * @extends MovableObject
 */
class Chicken extends MovableObject {
    y = 370;
    height = 60;
    width = 60;

    hitboxOffsetX = 10;
    hitboxOffsetY = 10;
    hitboxWidth = this.width - 20;
    hitboxHeight = this.height - 20;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    /**
     * Creates a new Chicken at a random position.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 300 + (Math.random() * 1860);
        this.speed = 0.15 + Math.random() * 0.3;
        this.animate();
    }

    /**
     * Override animate to stop moving if dead.
     */
    animate() {
        setStopableIntervall(() => {
            this.moveLeft();
        }, 1000 / 60);

        setStopableIntervall(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }
}