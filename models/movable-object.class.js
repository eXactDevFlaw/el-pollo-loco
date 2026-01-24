/**
 * Base class for all movable objects in the game
 */
class MovableObject extends DrawableObject {
  speed = 0.15;
  speedY = 0;
  acceleration = 2.5;
  otherDirection = false;
  energy = 100;
  lastHit = 0;

  offsetHitbox = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  /**
   * Plays animation in a loop
   * @param {string[]} images - Array of image paths
   */
  playAnimation(images) {
    let index = this.currentImage % images.length;
    let path = images[index];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Plays animation exactly once
   * @param {string[]} images - Array of image paths
   */
  playAnimationOnce(images) {
    if (this.currentImage < images.length) {
      this.showAnimationFrame(images);
    } else {
      this.showLastFrame(images);
    }
  }

  /**
   * Shows current animation frame
   * @param {string[]} images - Array of image paths
   */
  showAnimationFrame(images) {
    let path = images[this.currentImage];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Shows last frame and marks animation finished
   * @param {string[]} images - Array of image paths
   */
  showLastFrame(images) {
    this.jumpAnimationFinished = true;
    let path = images[images.length - 1];
    this.img = this.imageCache[path];
  }

  /**
   * Moves object to the right
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves object to the left
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Applies gravity to the object
   */
  applyGravity() {
    setStoppableInterval(() => {
      if (this.shouldApplyGravity()) {
        this.updateVerticalPosition();
      }
    }, 1000 / 25);
  }

  /**
   * Checks if gravity should be applied
   * @returns {boolean} True if above ground or moving up
   */
  shouldApplyGravity() {
    return this.isAboveGround() || this.speedY > 0;
  }

  /**
   * Updates vertical position with gravity
   */
  updateVerticalPosition() {
    this.y -= this.speedY;
    this.speedY -= this.acceleration;
    this.ensureGroundPosition();
  }

  /**
   * Ensures character is exactly on ground level
   */
  ensureGroundPosition() {
    if (!this.isAboveGround() && this.speedY <= 0) {
      this.y = 160;
      this.speedY = 0;
    }
  }

  /**
   * Checks if object is above ground
   * @returns {boolean} True if above ground level
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    }
    return this.y < 160;
  }

  /**
   * Makes object jump
   */
  jump() {
    this.speedY = 30;
    this.playJumpSound();
  }

  /**
   * Plays jump sound if character
   */
  playJumpSound() {
    if (this instanceof Character && this.world?.audioManager) {
      this.world.audioManager.play('jump');
    }
  }

  /**
   * Damages the object
   * @param {number} damage - Damage amount
   */
  hit(damage = 5) {
    this.energy -= damage;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks if object is dead
   * @returns {boolean} True if energy is 0
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Checks if object was recently hurt
   * @returns {boolean} True if hit within last 0.5 seconds
   */
  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    timePassed = timePassed / 1000;
    return timePassed < 0.5;
  }

  /**
   * Checks collision with another object
   * @param {MovableObject} moveObject - The other object
   * @returns {boolean} True if collision detected
   */
  isColliding(moveObject) {
    const a = this.getHitbox();
    const b = moveObject.getHitbox();
    return this.checkHitboxOverlap(a, b);
  }

  /**
   * Checks if two hitboxes overlap
   * @param {Object} a - First hitbox
   * @param {Object} b - Second hitbox
   * @returns {boolean} True if overlapping
   */
  checkHitboxOverlap(a, b) {
    return (
      a.left < b.right &&
      a.right > b.left &&
      a.top < b.bottom &&
      a.bottom > b.top
    );
  }
}