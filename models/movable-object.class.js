/**
 * Basisklasse für alle beweglichen Objekte im Spiel
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
   * Spielt eine Animation in einer Schleife ab
   * @param {string[]} images - Array mit Bildpfaden
   */
  playAnimation(images) {
    let index = this.currentImage % images.length;
    let path = images[index];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Spielt eine Animation genau einmal ab
   * @param {string[]} images - Array mit Bildpfaden
   */
  playAnimationOnce(images) {
    if (this.currentImage < images.length) {
      let path = images[this.currentImage];
      this.img = this.imageCache[path];
      this.currentImage++;
    } else {
      this.jumpAnimationFinished = true;
      let path = images[images.length - 1];
      this.img = this.imageCache[path];
    }
  }

  /**
   * Bewegt das Objekt nach rechts
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Bewegt das Objekt nach links
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Wendet Schwerkraft auf das Objekt an
   */
  applyGravity() {
    setStoppableInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Prüft ob das Objekt über dem Boden ist
   * @returns {boolean} True wenn über dem Boden
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    }
    return this.y < 160;
  }

  /**
   * Lässt das Objekt springen
   */
  jump() {
    this.speedY = 30;

    if (this instanceof Character && this.world?.audioManager) {
      this.world.audioManager.play('jump');
    }
  }

  /**
   * Fügt dem Objekt Schaden zu
   * @param {number} damage - Schadenswert
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
   * Prüft ob das Objekt tot ist
   * @returns {boolean} True wenn Energie bei 0 ist
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Prüft ob das Objekt gerade verletzt wurde
   * @returns {boolean} True wenn innerhalb der letzten 0.5 Sekunden getroffen
   */
  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    timePassed = timePassed / 1000;
    return timePassed < 0.5;
  }

  /**
   * Prüft ob dieses Objekt mit einem anderen kollidiert
   * @param {MovableObject} moveObject - Das andere Objekt
   * @returns {boolean} True wenn Kollision vorliegt
   */
  isColliding(moveObject) {
    const a = this.getHitbox();
    const b = moveObject.getHitbox();

    return (
      a.left < b.right &&
      a.right > b.left &&
      a.top < b.bottom &&
      a.bottom > b.top
    );
  }
}