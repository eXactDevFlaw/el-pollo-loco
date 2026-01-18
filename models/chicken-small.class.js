class SmallChicken extends MovableObject {
    y = 380;
    height = 40;
    width = 40;

    offsetHitbox = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }

    IMAGES_WALK = [
        './img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        './img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        './img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        './img/3_enemies_chicken/chicken_small/2_dead/dead.png',
    ];

    constructor() {
        super();
        this.loadImage('./img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALK)
        this.loadImages(this.IMAGES_DEAD)
        this.x = 200 + Math.round(Math.random() * 2000);
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    };

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60)

        setInterval(() => {
            this.playAnimation(this.IMAGES_WALK);
        }, 100);
    };


}