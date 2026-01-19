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
    }, 1000 / 60);  // ← GEÄNDERT: Von 50ms auf ~16ms (60 FPS)

    setStoppableInterval(() => {
      this.checkThrowObjects();
    }, 150);
  }

  /**
   * Prüft ob der Spieler eine Flasche werfen möchte und erstellt diese
   * Erlaubt nur eine fliegende Flasche gleichzeitig, um Spam zu verhindern
   * Das Inventar kann trotzdem bis zu 5 Flaschen enthalten
   * 
   * Bedingungen für Wurf:
   * - D-Taste gedrückt
   * - Mindestens 1 Flasche im Inventar
   * - Keine andere Flasche fliegt gerade (hasHit === false)
   */
  checkThrowObjects() {
    // Prüfe ob bereits eine aktive (noch nicht getroffene) Flasche fliegt
    const hasActiveBottle = this.throwableObjects.some(bottle => !bottle.hasHit);

    if (this.keyboard.D &&
      this.character.collectedFlasks > 0 &&
      !hasActiveBottle) {

      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100
      );
      this.throwableObjects.push(bottle);
      this.character.collectedFlasks--;
      this.updateFlaskStatusbar();
    }
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
          console.log('Bottle hit enemy!', enemy); // Debug
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
    // Markiere Flasche als getroffen (verhindert mehrfache Treffer)
    bottle.hasHit = true;

    // Spiele Splash-Animation ab
    bottle.playSplash();

    // Entferne Flasche nach Animation (nach 200ms)
    setTimeout(() => {
      this.throwableObjects.splice(bottleIndex, 1);
    }, 200);

    // Unterscheide zwischen Boss und normalen Enemies
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
    // Endboss bekommt 20 Schaden durch Flaschen (statt 5)
    endboss.hit(20);
    this.endbossStatusBar.setPercentage(endboss.energy);

    // Optional: Sound abspielen
    // this.audioManager.play('bossHit');
  }

  /**
   * Tötet einen normalen Enemy durch Flaschen-Treffer
   * @param {number} enemyIndex - Index des zu tötenden Enemies
   */
  killEnemyByBottle(enemyIndex) {
    this.level.enemies.splice(enemyIndex, 1);

    // Optional: Sound abspielen
    // this.audioManager.play('enemyKill');

    // Optional: Score erhöhen
    // this.score += 50;
  }

  /**
   * Prüft Kollisionen zwischen Character und Enemies
   * Unterscheidet zwischen Jump-Kills (nur normale Enemies) und normalen Kollisionen
   */
  checkEnemyCollisions() {
    this.level.enemies.forEach((enemy, index) => {
      if (this.character.isColliding(enemy)) {
        // Prüfe ob Character von oben auf Enemy springt
        if (this.isJumpingOnEnemy(enemy)) {
          // NUR normale Enemies können durch Springen besiegt werden
          if (!(enemy instanceof Endboss)) {
            this.killEnemyByJump(enemy, index);
          } else {
            // Endboss: Auch von oben nimmt Character Schaden (aber mit Cooldown)
            if (!this.character.isHurt()) {
              this.character.hit();
              this.healthStatusBar.setPercentage(this.character.energy);
            }
          }
        } else {
          // Seitliche Kollision: Character nimmt Schaden (aber nur wenn nicht gerade verletzt)
          if (!this.character.isHurt()) {
            this.character.hit();
            this.healthStatusBar.setPercentage(this.character.energy);
          }
        }
      }
    });

    // Prüfe ob Character tot ist → Game Over
    this.checkGameOver();

    // Prüfe ob Endboss tot ist → Win
    this.checkGameWin();
  }

  /**
   * Prüft ob der Character gestorben ist und zeigt Game Over Screen
   */
  checkGameOver() {
    if (this.character.isDead() && !this.gameEnded) {
      this.gameEnded = true;

      // Character hat 7 Death-Bilder × 50ms = 350ms
      const frameCount = this.character.IMAGES_DEAD.length;  // 7
      const frameDelay = 50;  // Von handleAnimations()
      const loops = 1;

      const animationDuration = frameCount * frameDelay * loops;  // 350ms

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

      // Berechne Dauer automatisch
      const frameCount = endboss.IMAGES_DEAD.length;  // 3 Bilder
      const frameDelay = 200;  // 200ms pro Bild
      const loops = 1;  // Nur 1x durchlaufen

      const animationDuration = frameCount * frameDelay * loops;  // 3 × 200 × 1 = 600ms

      setTimeout(() => {
        this.showGameWin();
      }, animationDuration);
    }
  }

  /**
   * Zeigt den Game Over Screen an
   */
  showGameOver() {
    stopAllIntervals();  // Stoppt ALLES
    console.log('GAME OVER!');

    // Aktiviere Game Over Screen
    const gameOverScreen = document.getElementById('gameOverScreen');
    if (gameOverScreen) {
      gameOverScreen.classList.remove('d-none');
    }
  }

  /**
   * Zeigt den Win Screen an
   */
  showGameWin() {
    stopAllIntervals();  // Stoppt ALLES
    console.log('YOU WIN!');

    // Aktiviere Win Screen  
    const winScreen = document.getElementById('winScreen');
    if (winScreen) {
      winScreen.classList.remove('d-none');
    }
  }

  /**
   * Prüft ob der Character von oben auf einen Enemy springt
   * Berücksichtigt die Fallrichtung und Hitbox-Offsets
   * @param {MovableObject} enemy - Der zu prüfende Enemy
   * @returns {boolean} True wenn Character von oben auf Enemy springt
   */
  isJumpingOnEnemy(enemy) {
    // Character muss fallen (speedY ist negativ beim Fallen)
    const isFalling = this.character.speedY < 0;

    // Character muss von oben kommen - mit verbesserter Berechnung
    const characterBottom = this.character.y + this.character.height - this.character.offsetHitbox.bottom;
    const enemyTop = enemy.y + (enemy.offsetHitbox?.top || 0);

    // WICHTIG: Character muss wirklich VON OBEN kommen
    // Vertikale Position: Character-Füße müssen über Enemy-Kopf sein
    const verticalDistance = characterBottom - enemyTop;

    // Sehr strenge Bedingung: Character muss deutlich von oben kommen
    // Wenn Character auf gleicher Höhe läuft → KEINE Jump-Kill
    const isComingFromAbove = verticalDistance >= 0 && verticalDistance <= 50;

    // Character muss in der Luft sein (nicht am Boden laufen)
    const isInAir = this.character.isAboveGround();

    // Zusätzlich: Character muss schnell genug fallen
    const fallingFastEnough = this.character.speedY < -5;

    // ALLE Bedingungen müssen erfüllt sein:
    // 1. Muss fallen
    // 2. Muss von oben kommen
    // 3. Muss in der Luft sein
    // 4. Muss schnell genug fallen
    return isFalling && isComingFromAbove && isInAir && fallingFastEnough;
  }

  /**
   * Besiegt einen Enemy durch Draufspringen
   * Entfernt den Enemy aus dem Level und lässt den Character hochspringen
   * @param {MovableObject} enemy - Der zu besiegende Enemy
   * @param {number} index - Index des Enemies im enemies-Array
   */
  killEnemyByJump(enemy, index) {
    // Enemy aus dem Level entfernen
    this.level.enemies.splice(index, 1);

    // Character bekommt einen kleinen Sprung nach oben (wie bei Mario)
    // speedY ist negativ für Bewegung nach oben
    this.character.speedY = 20;

    // Optional: Sound abspielen
    // this.audioManager.play('enemyKill');

    // Optional: Score erhöhen
    // this.score += 100;
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
    this.audioManager.play('coin');
  }

  /**
   * Prüft Kollisionen zwischen Character und Flaschen
   * Sammelt Flaschen ein, wenn das Maximum noch nicht erreicht ist
   */
  checkFlaskCollisions() {
    this.level.flasks.forEach((flask, index) => {
      if (this.character.isColliding(flask) && this.character.collectedFlasks < 5) {
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
    this.audioManager.play('flask');
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

    // Runde Kamera-Position auf ganze Pixel ab
    // Verhindert 1px-Lücken zwischen Background-Bildern
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
    moveObject.drawRectHitbox(this.ctx);

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