class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y = 60;
    x = 2400;
    energy = 100;
    speed = 0.075

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

    constructor() {
        super();
        this.loadImage('./img/4_enemie_boss_chicken/2_alert/G5.png')
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_WALK);
        this.animate();
    }

    animate() {
        setInterval(() => {

            if (this.hadFirstContact) {
                this.playAnimation(this.IMAGES_WALK);
                setInterval(() => {
                    this.moveLeft();
                }, 1000 / 60)
            } else {
                this.playAnimation(this.IMAGES_ALERT);
            }

            if (this.isColliding(world.character)) {
                this.playAnimation(this.IMAGES_ATTACK);
            }

            // if (this.isColliding(world.flask)) {
            //     this.playAnimation(this.IMAGES_HURT);
            // }

            if (this.energy == 0){
                this.speed = 0
                this.playAnimation(this.IMAGES_DEAD)
            }

            if(world.character.x > 2000 && !this.hadFirstContact){
                this.hadFirstContact = true
            }
        }, 200)
    }
}