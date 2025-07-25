/**
 * The main playable character (Pepe).
 * @extends MovableObject
 */
class Character extends MovableObject {
    height = 280;
    y = 80;
    speed = 5;
    world;
    isIdle = 0;

    hitboxOffsetX = 16;
    hitboxOffsetY = 110;
    hitboxWidth = this.width - 30;
    hitboxHeight = this.height - 120;

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_IDLE_LONG = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];


    /**
     * Creates a new Character.
     */
    constructor() {
        super().loadImage(this.IMAGES_IDLE[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_IDLE_LONG);
        this.applyGravity();
        this.animate();
    }

    /**
     * Handles movement and animation logic.
     */
    animate() {
        this.isIdle = 0;
        setStopableIntervall(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
            }
            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
            }
            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
            }
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60)

        setStopableIntervall(() => {
            if (this.isDead()) {
                this.isDeadHanlder();
            } else if (this.isHurt()) {
                this.isHurtHandler();
            } else if (this.isAboveGround()) {
                this.isJumpingHandler();
            } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.isWalkingHandler();
            } else {
                this.checkIdleStatus();
            }
        }, 100);
    }

    /**
     * Resets the idle counter.
     */
    resetIsIdle() {
        this.isIdle = 0;
    }

    /**
     * Checks and handles idle animation.
     */
    checkIdleStatus() {
        this.isIdle++;
        if (this.isIdle < 200) {
            this.playAnimation(this.IMAGES_IDLE);
        } else {
            this.playAnimation(this.IMAGES_IDLE_LONG);
        }
    }

    /**
     * Handles the dead animation.
     */
    isDeadHanlder() {
        this.playAnimation(this.IMAGES_DEAD);
        this.resetIsIdle();
    }

    /**
     * Handles the hurt animation.
     */
    isHurtHandler() {
        this.playAnimation(this.IMAGES_HURT);
        this.resetIsIdle();
    }

    /**
     * Handles the jumping animation.
     */
    isJumpingHandler() {
        if (this.speedY > 0) {
            this.playAnimation(this.IMAGES_JUMPING);
        }
        this.resetIsIdle();
    }

    /**
     * Handles the walking animation.
     */
    isWalkingHandler() {
        this.playAnimation(this.IMAGES_WALKING);
        this.resetIsIdle();
    }
}