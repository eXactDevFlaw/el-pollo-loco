/**
 * The playable main character
 * Manages all animations, movements and states of the player
 */
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

  IMAGES_IDLE = [
    './img/2_character_pepe/1_idle/idle/I-1.png',
    './img/2_character_pepe/1_idle/idle/I-2.png',
    './img/2_character_pepe/1_idle/idle/I-3.png',
    './img/2_character_pepe/1_idle/idle/I-4.png',
    './img/2_character_pepe/1_idle/idle/I-5.png',
    './img/2_character_pepe/1_idle/idle/I-6.png',
    './img/2_character_pepe/1_idle/idle/I-7.png',
    './img/2_character_pepe/1_idle/idle/I-8.png',
    './img/2_character_pepe/1_idle/idle/I-9.png',
    './img/2_character_pepe/1_idle/idle/I-10.png',
  ];

  IMAGES_IDLE_LONG = [
    './img/2_character_pepe/1_idle/long_idle/I-11.png',
    './img/2_character_pepe/1_idle/long_idle/I-12.png',
    './img/2_character_pepe/1_idle/long_idle/I-13.png',
    './img/2_character_pepe/1_idle/long_idle/I-14.png',
    './img/2_character_pepe/1_idle/long_idle/I-15.png',
    './img/2_character_pepe/1_idle/long_idle/I-16.png',
    './img/2_character_pepe/1_idle/long_idle/I-17.png',
    './img/2_character_pepe/1_idle/long_idle/I-18.png',
    './img/2_character_pepe/1_idle/long_idle/I-19.png',
    './img/2_character_pepe/1_idle/long_idle/I-20.png',
  ];

  world;
  currentState = "idle";
  idleStartTime = 0;
  idleLongDelay = 5000;
  collectedCoins = 0;
  collectedFlasks = 0;

  /**
   * Creates a new character
   */
  constructor() {
    super();
    this.loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadAllImages();
    this.animate();
    this.applyGravity();
  }

  /**
   * Loads all character images
   */
  loadAllImages() {
    this.loadImages(this.IMAGES_WALK);
    this.loadImages(this.IMAGES_JUMP);
    this.loadImages(this.IMAGES_PEAK);
    this.loadImages(this.IMAGES_FALL);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_IDLE_LONG);
  }

  /**
   * Starts all animation and movement loops
   */
  animate() {
    this.handleMovement();
    this.handleAnimations();
  }

  /**
   * Manages character movement based on keyboard input
   */
  handleMovement() {
    setStoppableInterval(() => {
      this.processMovementInput();
      this.updateCameraSmooth();
    }, 1000 / 60);
  }

  /**
   * Processes all movement inputs
   */
  processMovementInput() {
    this.handleRightMovement();
    this.handleLeftMovement();
    this.handleJumpInput();
  }

  /**
   * Handles right movement input
   */
  handleRightMovement() {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
    }
  }

  /**
   * Handles left movement input
   */
  handleLeftMovement() {
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
    }
  }

  /**
   * Handles jump input
   */
  handleJumpInput() {
    if ((this.world.keyboard.UP || this.world.keyboard.SPACE) && !this.isAboveGround()) {
      this.jump();
    }
  }

  /**
   * Updates camera position with smooth interpolation
   */
  updateCameraSmooth() {
    let targetOffset = this.otherDirection ? 300 : 100;
    let targetCameraX = -this.x + targetOffset;
    let smoothSpeed = 0.075;
    this.world.camera_x += (targetCameraX - this.world.camera_x) * smoothSpeed;
  }

  /**
   * Manages all animation states
   */
  handleAnimations() {
    this.startStateAnimationLoop();
    this.startJumpAnimationLoop();
    this.startIdleAnimationLoop();
  }

  /**
   * Starts state animation loop
   */
  startStateAnimationLoop() {
    setStoppableInterval(() => {
      let newState = this.determineState();
      if (newState !== this.currentState) {
        this.changeState(newState);
      }
      if (!this.isSpecialState()) {
        this.playCurrentStateAnimation();
      }
    }, 50);
  }

  /**
   * Checks if current state is special
   * @returns {boolean} True if jump, peak, fall, idle or idle_long
   */
  isSpecialState() {
    return ["jump", "peak", "fall", "idle", "idle_long"].includes(this.currentState);
  }

  /**
   * Starts jump animation loop
   */
  startJumpAnimationLoop() {
    setStoppableInterval(() => {
      if (this.isJumpingState()) {
        this.playCurrentStateAnimation();
      }
    }, 150);
  }

  /**
   * Checks if in jumping state
   * @returns {boolean} True if jump, peak or fall
   */
  isJumpingState() {
    return ["jump", "peak", "fall"].includes(this.currentState);
  }

  /**
   * Starts idle animation loop
   */
  startIdleAnimationLoop() {
    setStoppableInterval(() => {
      if (this.isIdleState()) {
        this.playCurrentStateAnimation();
      }
    }, 200);
  }

  /**
   * Checks if in idle state
   * @returns {boolean} True if idle or idle_long
   */
  isIdleState() {
    return ["idle", "idle_long"].includes(this.currentState);
  }

  /**
   * Determines the current state of the character
   * @returns {string} The new state
   */
  determineState() {
    if (this.isDead()) return "dead";
    if (this.isHurt()) return "hurt";
    if (this.isAboveGround()) {
      return this.getAirborneState();
    }
    if (this.isMoving()) {
      return this.getMovingState();
    }
    return this.determineIdleState();
  }

  /**
   * Gets state while airborne
   * @returns {string} Jump, peak or fall state
   */
  getAirborneState() {
    this.idleStartTime = 0;
    if (this.speedY > 15) return "jump";
    if (this.speedY > -5) return "peak";
    return "fall";
  }

  /**
   * Checks if character is moving
   * @returns {boolean} True if moving left or right
   */
  isMoving() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
  }

  /**
   * Gets state while moving
   * @returns {string} Walk state
   */
  getMovingState() {
    this.idleStartTime = 0;
    return "walk";
  }

  /**
   * Determines idle or idle_long state
   * @returns {string} "idle" or "idle_long"
   */
  determineIdleState() {
    const now = Date.now();
    if (this.idleStartTime === 0) {
      this.idleStartTime = now;
      return "idle";
    }
    const idleDuration = now - this.idleStartTime;
    return idleDuration >= this.idleLongDelay ? "idle_long" : "idle";
  }

  /**
   * Changes state and resets animation
   * @param {string} newState - The new state
   */
  changeState(newState) {
    this.currentState = newState;
    this.currentImage = 0;
  }

  /**
   * Plays animation of current character state
   */
  playCurrentStateAnimation() {
    const animations = {
      dead: () => this.playDeadAnimation(),
      hurt: () => this.playHurtAnimation(),
      jump: () => this.playJumpAnimation(),
      peak: () => this.playPeakAnimation(),
      fall: () => this.playFallAnimation(),
      walk: () => this.playWalkAnimation(),
      idle: () => this.playIdleAnimation(),
      idle_long: () => this.playIdleLongAnimation()
    };
    animations[this.currentState]?.();
  }

  /**
   * Plays death animation
   */
  playDeadAnimation() {
    this.playAnimationOnce(this.IMAGES_DEAD);
    this.playDeathSound();
    this.stopWalkingSound();
    this.stopSnoringSound();
  }

  /**
   * Plays death sound on first frame
   */
  playDeathSound() {
    if (this.currentImage === 1 && this.world?.audioManager) {
      this.world.audioManager.play('death');
    }
  }

  /**
   * Plays hurt animation
   */
  playHurtAnimation() {
    this.playAnimation(this.IMAGES_HURT);
    this.playHurtSound();
    this.stopWalkingSound();
    this.stopSnoringSound();
  }

  /**
   * Plays hurt sound on first frame
   */
  playHurtSound() {
    if (this.currentImage === 1 && this.world?.audioManager) {
      this.world.audioManager.play('hurt');
    }
  }

  /**
   * Plays jump animation
   */
  playJumpAnimation() {
    this.playAnimationOnce(this.IMAGES_JUMP);
    this.stopWalkingSound();
    this.stopSnoringSound();
  }

  /**
   * Plays peak animation
   */
  playPeakAnimation() {
    this.playAnimationOnce(this.IMAGES_PEAK);
    this.stopWalkingSound();
    this.stopSnoringSound();
  }

  /**
   * Plays fall animation
   */
  playFallAnimation() {
    this.playAnimationOnce(this.IMAGES_FALL);
    this.stopWalkingSound();
    this.stopSnoringSound();
  }

  /**
   * Plays walk animation
   */
  playWalkAnimation() {
    this.playAnimation(this.IMAGES_WALK);
    this.playWalkingSound();
    this.stopSnoringSound();
  }

  /**
   * Plays idle animation
   */
  playIdleAnimation() {
    this.playAnimation(this.IMAGES_IDLE);
    this.stopWalkingSound();
    this.stopSnoringSound();
  }

  /**
   * Plays idle long animation
   */
  playIdleLongAnimation() {
    this.playAnimation(this.IMAGES_IDLE_LONG);
    this.playSnoringSound();
    this.stopWalkingSound();
  }

  /**
   * Starts walking sound loop
   */
  playWalkingSound() {
    if (this.world?.audioManager) {
      this.world.audioManager.playLoop('walking');
    }
  }

  /**
   * Stops walking sound
   */
  stopWalkingSound() {
    if (this.world?.audioManager) {
      this.world.audioManager.stopLoop('walking');
    }
  }

  /**
   * Starts snoring sound loop
   */
  playSnoringSound() {
    if (this.world?.audioManager) {
      this.world.audioManager.playLoop('snoring');
    }
  }

  /**
   * Stops snoring sound
   */
  stopSnoringSound() {
    if (this.world?.audioManager) {
      this.world.audioManager.stopLoop('snoring');
    }
  }
}