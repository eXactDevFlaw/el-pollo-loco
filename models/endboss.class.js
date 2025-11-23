class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y = 60;

    IMAGES_WALK = [
        '../img/4_enemie_boss_chicken/2_alert/G5.png',
        '../img/4_enemie_boss_chicken/2_alert/G6.png',
        '../img/4_enemie_boss_chicken/2_alert/G7.png',
        '../img/4_enemie_boss_chicken/2_alert/G8.png',
        '../img/4_enemie_boss_chicken/2_alert/G9.png',
        '../img/4_enemie_boss_chicken/2_alert/G10.png',
        '../img/4_enemie_boss_chicken/2_alert/G11.png',
        '../img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    constructor() {
        super();
        this.loadImage('../img/4_enemie_boss_chicken/2_alert/G5.png')
        this.loadImages(this.IMAGES_WALK);
        this.x = 2500;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALK);
        }, 200)
    }
}