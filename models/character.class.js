class Character extends MovableObject {
  height = 280;
  y = 160;
  speed = 10;

  offsetHitbox = {
    top: 120,
    left: 30,
    right: 40,
    bottom: 30,
  };

  IMAGES_WALK = [
    "./img/2_character_pepe/2_walk/W-21.png",
    "./img/2_character_pepe/2_walk/W-22.png",
    "./img/2_character_pepe/2_walk/W-23.png",
    "./img/2_character_pepe/2_walk/W-24.png",
    "./img/2_character_pepe/2_walk/W-25.png",
    "./img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMP = [
    "./img/2_character_pepe/3_jump/J-31.png",
    "./img/2_character_pepe/3_jump/J-32.png",
    "./img/2_character_pepe/3_jump/J-33.png",
    "./img/2_character_pepe/3_jump/J-34.png",
  ];

  IMAGES_PEAK = ["./img/2_character_pepe/3_jump/J-35.png"];

  IMAGES_FALL = [
    "./img/2_character_pepe/3_jump/J-36.png",
    "./img/2_character_pepe/3_jump/J-37.png",
    "./img/2_character_pepe/3_jump/J-38.png",
    "./img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_DEAD = [
    "./img/2_character_pepe/5_dead/D-51.png",
    "./img/2_character_pepe/5_dead/D-52.png",
    "./img/2_character_pepe/5_dead/D-53.png",
    "./img/2_character_pepe/5_dead/D-54.png",
    "./img/2_character_pepe/5_dead/D-55.png",
    "./img/2_character_pepe/5_dead/D-56.png",
    "./img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_HURT = [
    "./img/2_character_pepe/4_hurt/H-41.png",
    "./img/2_character_pepe/4_hurt/H-42.png",
    "./img/2_character_pepe/4_hurt/H-43.png",
  ];

  world;
  currentState = "idle";

  constructor() {
    super();
    this.loadImage("./img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALK);
    this.loadImages(this.IMAGES_JUMP);
    this.loadImages(this.IMAGES_PEAK);
    this.loadImages(this.IMAGES_FALL);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.animate();
    this.applyGravity();
  }

  animate() {
    this.handleMovement();
    this.handleAnimations();
  }

  handleMovement() {
    setInterval(() => {
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
    }, 1000 / 60);
  }

  handleAnimations() {
    setInterval(() => {
      let newState = this.determineState();

      if (newState !== this.currentState) {
        this.changeState(newState);
      }
      if (!["jump", "peak", "fall"].includes(this.currentState)) {
        this.playCurrentStateAnimation();
      }
    }, 50);

    setInterval(() => {
      if (["jump", "peak", "fall"].includes(this.currentState)) {
        this.playCurrentStateAnimation();
      }
    }, 150);
  }

  determineState() {
    if (this.isDead()) return "dead";
    if (this.isHurt()) return "hurt";

    if (this.isAboveGround()) {
      if (this.speedY > 15) return "jump";
      if (this.speedY > -5) return "peak";
      return "fall";
    }

    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      return "walk";
    }

    return "idle";
  }

  changeState(newState) {
    this.currentState = newState;
    this.currentImage = 0;
  }

  playCurrentStateAnimation() {
    switch (this.currentState) {
      case "dead":
        this.playAnimation(this.IMAGES_DEAD);
        break;
      case "hurt":
        this.playAnimation(this.IMAGES_HURT);
        break;
      case "jump":
        this.playAnimationOnce(this.IMAGES_JUMP);
        break;
      case "peak":
        this.playAnimationOnce(this.IMAGES_PEAK);
        break;
      case "fall":
        this.playAnimationOnce(this.IMAGES_FALL);
        break;
      case "walk":
        this.playAnimation(this.IMAGES_WALK);
        break;
      case "idle":
        break;
    }
  }
}
