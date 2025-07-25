/**
 * The endboss enemy.
 * @extends MovableObject
 */
class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y = 60;

    hitboxOffsetX = 10;
    hitboxOffsetY = 10;
    hitboxWidth = this.width - 20;
    hitboxHeight = this.height - 20;

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    /**
     * Creates a new Endboss at a fixed location.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 2500;
        this.speed = 0.3;
        this.animate();
    }

    /**
     * Animates the endboss.
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