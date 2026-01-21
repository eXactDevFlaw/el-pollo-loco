/**
 * Hauptklasse für die Spielwelt
 * Verwaltet alle Spielobjekte, Kollisionen und das Rendering
 */
class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;

  healthStatusBar = new HealthStatusBar();
  coinStatusBar = new CoinStatusBar();
  flaskStatusBar = new FlaskStatusBar();
  endbossStatusBar = new EndbossHealthStatusBar();

  throwableObjects = [];

  /**
   * Flag um zu verhindern dass Game Over/Win mehrfach getriggert wird
   * @type {boolean}
   */
  gameEnded = false;

  IMAGES_WIN = [
    "./img/You won, you lost/Game over A.png",
    "./img/You won, you lost/Game Over.png",
    "./img/You won, you lost/You lost b.png",
    "./img/You won, you lost/You lost.png",
    "./img/You won, you lost/You Win A.png",
    "./img/You won, you lost/You win B.png",
    "./img/You won, you lost/You won A.png",
    "./img/You won, you lost/You Won B.png",
  ];

  IMAGES_LOOSE = [
    "./img/9_intro_outro_screens/game_over/game over!.png",
    "./img/9_intro_outro_screens/game_over/game over.png",
    "./img/9_intro_outro_screens/game_over/oh no you lost!.png",
    "./img/9_intro_outro_screens/game_over/you lost.png",
  ];

  /**
   * Erstellt eine neue Spielwelt
   * @param {HTMLCanvasElement} canvas - Das Canvas-Element
   * @param {Object} keyboard - Das Keyboard-Objekt mit Tastenstatus
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.audioManager = new AudioManager();
    this.audioManager.startMusic();
    this.draw();
    this.setWorld();
    this.run();
  }

  /**
   * Setzt die World-Referenz im Character
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Startet die Game-Loops für Kollisionsprüfung und Wurfobjekte
   */
  run() {
    setStoppableInterval(() => {
      this.checkCollisions();
      this.checkBottleCollisions();
    }, 1000 / 60);

    setStoppableInterval(() => {
      this.checkThrowObjects();
    }, 150);
  }

  /**
   * Prüft ob der Spieler eine Flasche werfen möchte und erstellt diese
   */
  checkThrowObjects() {
    const hasActiveBottle = this.throwableObjects.some(
      (bottle) => !bottle.hasHit,
    );

    if (this.canThrowBottle(hasActiveBottle)) {
      this.throwBottle();
    }
  }

  /**
   * Prüft ob eine Flasche geworfen werden kann
   * @param {boolean} hasActiveBottle - Gibt es bereits eine fliegende Flasche
   * @returns {boolean} True wenn werfen möglich ist
   */
  canThrowBottle(hasActiveBottle) {
    return (
      this.keyboard.D &&
      this.character.collectedFlasks > 0 &&
      !hasActiveBottle
    );
  }

  /**
   * Wirft eine neue Flasche
   */
  throwBottle() {
    let bottle = new ThrowableObject(
      this.character.x + 100,
      this.character.y + 100,
    );
    this.throwableObjects.push(bottle);
    this.character.collectedFlasks--;
    this.updateFlaskStatusbar();
  }

  /**
   * Prüft alle Arten von Kollisionen im Spiel
   */
  checkCollisions() {
    this.checkEnemyCollisions();
    this.checkCoinCollisions();
    this.checkFlaskCollisions();
  }

  /**
   * Prüft Kollisionen zwischen geworfenen Flaschen und Enemies
   * Spielt Splash-Animation ab und fügt Schaden zu oder tötet den Enemy
   */
  checkBottleCollisions() {
    this.throwableObjects.forEach((bottle, bottleIndex) => {
      this.level.enemies.forEach((enemy, enemyIndex) => {
        if (bottle.isColliding(enemy) && !bottle.hasHit) {
          this.handleBottleHit(bottle, enemy, enemyIndex, bottleIndex);
        }
      });
    });
  }

  /**
   * Behandelt den Treffer einer Flasche auf einen Enemy
   * @param {ThrowableObject} bottle - Die geworfene Flasche
   * @param {MovableObject} enemy - Der getroffene Enemy
   * @param {number} enemyIndex - Index des Enemies im Array
   * @param {number} bottleIndex - Index der Flasche im Array
   */
  handleBottleHit(bottle, enemy, enemyIndex, bottleIndex) {
    bottle.hasHit = true;

    bottle.playSplash();

    setTimeout(() => {
      this.throwableObjects.splice(bottleIndex, 1);
    }, 200);

    if (enemy instanceof Endboss) {
      this.damageEndboss(enemy);
    } else {
      this.killEnemyByBottle(enemyIndex);
    }
  }

  /**
   * Fügt dem Endboss Schaden zu
   * @param {Endboss} endboss - Der Endboss
   */
  damageEndboss(endboss) {
    endboss.hit(20);
    this.endbossStatusBar.setPercentage(endboss.energy);
    this.audioManager.play('bossHurt');
  }

  /**
   * Tötet einen normalen Enemy durch Flaschen-Treffer
   * @param {number} enemyIndex - Index des zu tötenden Enemies
   */
  killEnemyByBottle(enemyIndex) {
    this.level.enemies.splice(enemyIndex, 1);
    this.audioManager.play('chickenDeath');
  }

  /**
   * Prüft Kollisionen zwischen Character und Enemies
   * Unterscheidet zwischen Jump-Kills (nur normale Enemies) und normalen Kollisionen
   */
  checkEnemyCollisions() {
    this.level.enemies.forEach((enemy, index) => {
      if (this.character.isColliding(enemy)) {
        this.handleEnemyCollision(enemy, index);
      }
    });

    this.checkGameOver();
    this.checkGameWin();
  }

  /**
   * Behandelt eine Kollision zwischen Character und Enemy
   * @param {MovableObject} enemy - Der Enemy
   * @param {number} index - Index des Enemies
   */
  handleEnemyCollision(enemy, index) {
    if (this.isJumpingOnEnemy(enemy)) {
      this.handleJumpOnEnemy(enemy, index);
    } else {
      this.handleSideCollision();
    }
  }

  /**
   * Behandelt Jump-Kill auf Enemy
   * @param {MovableObject} enemy - Der Enemy
   * @param {number} index - Index des Enemies
   */
  handleJumpOnEnemy(enemy, index) {
    if (!(enemy instanceof Endboss)) {
      this.killEnemyByJump(enemy, index);
    } else {
      this.handleSideCollision();
    }
  }

  /**
   * Behandelt seitliche Kollision mit Enemy
   */
  handleSideCollision() {
    if (!this.character.isHurt()) {
      this.character.hit();
      this.healthStatusBar.setPercentage(this.character.energy);
    }
  }

  /**
   * Prüft ob der Character gestorben ist und zeigt Game Over Screen
   */
  checkGameOver() {
    if (this.character.isDead() && !this.gameEnded) {
      this.gameEnded = true;

      const frameCount = this.character.IMAGES_DEAD.length;
      const frameDelay = 50;
      const loops = 1;

      const animationDuration = frameCount * frameDelay * loops;

      setTimeout(() => {
        this.showGameOver();
      }, animationDuration);
    }
  }

  /**
   * Prüft ob der Endboss besiegt wurde und zeigt Win Screen
   */
  checkGameWin() {
    let endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (endboss && endboss.isDead() && !this.gameEnded) {
      this.gameEnded = true;

      const frameCount = endboss.IMAGES_DEAD.length;
      const frameDelay = 200;
      const loops = 1;

      const animationDuration = frameCount * frameDelay * loops;

      setTimeout(() => {
        this.showGameWin();
      }, animationDuration);
    }
  }

  /**
   * Zeigt den Game Over Screen an und stoppt das Spiel
   * Wählt zufälliges Game Over Bild aus
   */
  showGameOver() {
    stopAllIntervals();
    this.audioManager.stopMusic();

    const randomIndex = Math.floor(
      Math.random() * this.IMAGES_GAME_OVER.length,
    );
    const randomImage = this.IMAGES_GAME_OVER[randomIndex];

    const gameOverImg = document.getElementById("gameOverImage");
    if (gameOverImg) {
      gameOverImg.src = randomImage;
    }

    const gameOverScreen = document.getElementById("gameOverScreen");
    if (gameOverScreen) {
      gameOverScreen.classList.remove("d-none");
    }
  }

  /**
   * Zeigt den Win Screen an und stoppt das Spiel
   * Wählt zufälliges Win Bild aus
   */
  showGameWin() {
    stopAllIntervals();
    this.audioManager.stopMusic();

    const randomIndex = Math.floor(Math.random() * this.IMAGES_WIN.length);
    const randomImage = this.IMAGES_WIN[randomIndex];

    const winImg = document.getElementById("winImage");
    if (winImg) {
      winImg.src = randomImage;
    }

    const winScreen = document.getElementById("winScreen");
    if (winScreen) {
      winScreen.classList.remove("d-none");
    }
  }

  /**
   * Prüft ob der Character von oben auf einen Enemy springt
   * @param {MovableObject} enemy - Der zu prüfende Enemy
   * @returns {boolean} True wenn Character von oben auf Enemy springt
   */
  isJumpingOnEnemy(enemy) {
    return (
      this.character.speedY < 0 &&
      this.isComingFromAbove(enemy) &&
      this.character.isAboveGround() &&
      this.character.speedY < -5
    );
  }

  /**
   * Prüft ob Character von oben auf Enemy kommt
   * @param {MovableObject} enemy - Der Enemy
   * @returns {boolean} True wenn von oben kommend
   */
  isComingFromAbove(enemy) {
    const characterBottom =
      this.character.y +
      this.character.height -
      this.character.offsetHitbox.bottom;
    const enemyTop = enemy.y + (enemy.offsetHitbox?.top || 0);
    const verticalDistance = characterBottom - enemyTop;

    return verticalDistance >= 0 && verticalDistance <= 50;
  }

  /**
   * Besiegt einen Enemy durch Draufspringen
   * Entfernt den Enemy aus dem Level und lässt den Character hochspringen
   * @param {MovableObject} enemy - Der zu besiegende Enemy
   * @param {number} index - Index des Enemies im enemies-Array
   */
  killEnemyByJump(enemy, index) {
    this.level.enemies.splice(index, 1);

    this.character.speedY = 20;

    this.audioManager.play('chickenDeath');
  }

  /**
   * Prüft Kollisionen zwischen Character und Münzen
   * Sammelt Münzen beim Berühren ein
   */
  checkCoinCollisions() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.collectCoin(index);
      }
    });
  }

  /**
   * Sammelt eine Münze ein
   * Entfernt die Münze aus dem Level und aktualisiert die Statusbar
   * @param {number} index - Index der Münze im coins-Array
   */
  collectCoin(index) {
    this.level.coins.splice(index, 1);
    this.character.collectedCoins++;

    let percentage = (this.character.collectedCoins / 10) * 100;
    if (percentage > 100) percentage = 100;
    this.coinStatusBar.setPercentage(percentage);
    this.audioManager.play("coin");
  }

  /**
   * Prüft Kollisionen zwischen Character und Flaschen
   * Sammelt Flaschen ein, wenn das Maximum noch nicht erreicht ist
   */
  checkFlaskCollisions() {
    this.level.flasks.forEach((flask, index) => {
      if (
        this.character.isColliding(flask) &&
        this.character.collectedFlasks < 5
      ) {
        this.collectFlask(index);
      }
    });
  }

  /**
   * Sammelt eine Flasche ein
   * Entfernt die Flasche aus dem Level und aktualisiert die Statusbar
   * @param {number} index - Index der Flasche im flasks-Array
   */
  collectFlask(index) {
    this.level.flasks.splice(index, 1);
    this.character.collectedFlasks++;
    this.updateFlaskStatusbar();
    this.audioManager.play("flask");
  }

  /**
   * Aktualisiert die Flaschen-Statusbar
   * Berechnet den Prozentsatz basierend auf der maximalen Anzahl (5)
   */
  updateFlaskStatusbar() {
    let percentage = (this.character.collectedFlasks / 5) * 100;
    if (percentage > 100) percentage = 100;
    this.flaskStatusBar.setPercentage(percentage);
  }

  /**
   * Hauptzeichenmethode - rendert alle Spielobjekte
   * Wird kontinuierlich über requestAnimationFrame aufgerufen
   * Rundet camera_x ab um 1px-Lücken im Background zu verhindern
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const roundedCameraX = Math.floor(this.camera_x);

    this.ctx.translate(roundedCameraX, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.flasks);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.addDynamicStatusBars();

    this.ctx.translate(-roundedCameraX, 0);
    this.addStaticStatusBars();
    this.ctx.translate(roundedCameraX, 0);

    this.addToMap(this.character);
    this.ctx.translate(-roundedCameraX, 0);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Zeichnet die statischen Statusbars (oben links)
   * Diese bewegen sich nicht mit der Kamera
   */
  addStaticStatusBars() {
    this.addToMap(this.healthStatusBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.flaskStatusBar);
  }

  /**
   * Zeichnet die dynamischen Statusbars (z.B. Endboss-Healthbar)
   * Diese bewegen sich mit der Kamera
   */
  addDynamicStatusBars() {
    let endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (endboss && endboss.hadFirstContact) {
      this.endbossStatusBar.updatePosition(endboss);
      this.addToMap(this.endbossStatusBar);
    }
  }

  /**
   * Zeichnet ein Array von Objekten auf die Map
   * @param {Array} objects - Array von Objekten die gezeichnet werden sollen
   */
  addObjectsToMap(objects) {
    objects.forEach((element) => {
      this.addToMap(element);
    });
  }

  /**
   * Zeichnet ein einzelnes Objekt auf die Map
   * Berücksichtigt dabei die Blickrichtung (Spiegelung)
   * @param {MovableObject} moveObject - Das zu zeichnende Objekt
   */
  addToMap(moveObject) {
    if (moveObject.otherDirection) {
      this.flipImage(moveObject);
    }

    moveObject.draw(this.ctx);
    // moveObject.drawRect(this.ctx);
    // moveObject.drawRectHitbox(this.ctx);

    if (moveObject.otherDirection) {
      this.flipImageBack(moveObject);
    }
  }

  /**
   * Spiegelt das Bild horizontal (für Blickrichtung nach links)
   * @param {MovableObject} moveObject - Das zu spiegelnde Objekt
   */
  flipImage(moveObject) {
    this.ctx.save();
    this.ctx.translate(moveObject.width, 0);
    this.ctx.scale(-1, 1);
    moveObject.x = moveObject.x * -1;
  }

  /**
   * Stellt die normale Bildausrichtung wieder her
   * @param {MovableObject} moveObject - Das Objekt dessen Spiegelung rückgängig gemacht wird
   */
  flipImageBack(moveObject) {
    moveObject.x = moveObject.x * -1;
    this.ctx.restore();
  }
}