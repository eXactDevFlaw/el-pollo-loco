/**
 * Basisklasse für alle beweglichen Objekte im Spiel
 * Erweitert DrawableObject um Bewegung, Physik und Kollisionserkennung
 */
class MovableObject extends DrawableObject {
  /** @type {number} Horizontale Bewegungsgeschwindigkeit */
  speed = 0.15;
  
  /** @type {number} Vertikale Geschwindigkeit (negativ = fallen, positiv = steigen) */
  speedY = 0;
  
  /** @type {number} Schwerkraft-Beschleunigung */
  acceleration = 2.5;
  
  /** @type {boolean} Gibt an ob das Objekt in die andere Richtung schaut */
  otherDirection = false;
  
  /** @type {number} Energie/Leben des Objekts (0-100) */
  energy = 100;
  
  /** @type {number} Zeitstempel des letzten Treffers */
  lastHit = 0;

  /**
   * Hitbox-Offsets für präzisere Kollisionserkennung
   * @type {Object}
   * @property {number} top - Offset oben
   * @property {number} left - Offset links
   * @property {number} right - Offset rechts
   * @property {number} bottom - Offset unten
   */
  offsetHitbox = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  /**
   * Spielt eine Animation in einer Schleife ab
   * Durchläuft die Bilder wiederholt
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
   * Bleibt am Ende beim letzten Bild stehen
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
   * Lässt das Objekt fallen wenn es in der Luft ist
   */
  applyGravity() {
    setInterval(() => {
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
   * Setzt die vertikale Geschwindigkeit nach oben
   */
  jump() {
    this.speedY = 30;
  }

  /**
   * Fügt dem Objekt Schaden zu
   * Reduziert die Energie und speichert den Zeitpunkt des Treffers
   * @param {number} damage - Schadenswert (Standard: 5)
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
   * Gilt für 1 Sekunde nach dem letzten Treffer
   * @returns {boolean} True wenn innerhalb der letzten Sekunde getroffen
   */
  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    timePassed = timePassed / 1000;
    return timePassed < 1;
  }

  /**
   * Prüft ob dieses Objekt mit einem anderen kollidiert
   * Berücksichtigt die Hitbox-Offsets beider Objekte
   * @param {MovableObject} moveObject - Das andere Objekt
   * @returns {boolean} True wenn Kollision vorliegt
   */
  isColliding(moveObject) {
    const a = {
      left: this.x + this.offsetHitbox.left,
      right: this.x + this.width - this.offsetHitbox.right,
      top: this.y + this.offsetHitbox.top,
      bottom: this.y + this.height - this.offsetHitbox.bottom,
    };

    const b = {
      left: moveObject.x + moveObject.offsetHitbox.left,
      right: moveObject.x + moveObject.width - moveObject.offsetHitbox.right,
      top: moveObject.y + moveObject.offsetHitbox.top,
      bottom: moveObject.y + moveObject.height - moveObject.offsetHitbox.bottom,
    };

    return (
      a.left < b.right &&
      a.right > b.left &&
      a.top < b.bottom &&
      a.bottom > b.top
    );
  }
}