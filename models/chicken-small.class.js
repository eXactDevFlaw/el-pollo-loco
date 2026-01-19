class SmallChicken extends MovableObject {
    y = 380;
    height = 50;
    width = 50;

    offsetHitbox = {
        top: -5,
        left: -5,
        right: -5,
        bottom: -5
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
        this.speed = 0.15 + Math.random() * 0.15;
        this.animate();
    };

    animate() {
        setStoppableInterval(() => {
            this.moveLeft();
        }, 1000 / 60)

        setStoppableInterval(() => {
            this.playAnimation(this.IMAGES_WALK);
        }, 100);
    };
}