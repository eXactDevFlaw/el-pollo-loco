/**
 * Main class for the game world
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
  gameEnded = false;

  IMAGES_WIN = [
    "./img/You won, you lost/You Win A.png",
    "./img/You won, you lost/You win B.png",
    "./img/You won, you lost/You won A.png",
    "./img/You won, you lost/You Won B.png",
  ];

  IMAGES_LOOSE = [
    "./img/9_intro_outro_screens/game_over/Game over A.png",
    "./img/9_intro_outro_screens/game_over/Game Over.png",
    "./img/9_intro_outro_screens/game_over/You lost b.png",
    "./img/9_intro_outro_screens/game_over/you lost.png",
  ];

  /**
   * Creates a new game world
   * @param {HTMLCanvasElement} canvas - The canvas element
   * @param {Object} keyboard - The keyboard object with key status
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.audioManager = new AudioManager();
    this.startBackgroundMusic();
    this.draw();
    this.setWorld();
    this.run();
  }

  /**
   * Starts background music if not muted
   */
  startBackgroundMusic() {
    if (!this.audioManager.isMuted) {
      this.audioManager.startMusic();
    }
  }

  /**
   * Sets world reference in character
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Starts game loops for collision detection and throw objects
   */
  run() {
    setStoppableInterval(() => {
      this.checkCollisions();
      this.checkBottleCollisions();
      this.cleanupBottles();
      this.updateEnemyBehavior();
    }, 1000 / 60);
    setStoppableInterval(() => {
      this.checkThrowObjects();
    }, 150);
  }

  /**
   * Checks if player wants to throw bottle and creates it
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
   * Checks if bottle can be thrown
   * @param {boolean} hasActiveBottle - Is there already a flying bottle
   * @returns {boolean} True if throw is possible
   */
  canThrowBottle(hasActiveBottle) {
    return (
      this.keyboard.D &&
      this.character.collectedFlasks > 0 &&
      !hasActiveBottle
    );
  }

  /**
   * Throws a new bottle
   */
  throwBottle() {
    const xOffset = this.character.otherDirection ? 0 : 100;
    let bottle = new ThrowableObject(
      this.character.x + xOffset,
      this.character.y + 100,
      this.character.otherDirection
    );
    this.throwableObjects.push(bottle);
    this.character.collectedFlasks--;
    this.updateFlaskStatusbar();
  }

  /**
   * Checks all types of collisions in game
   */
  checkCollisions() {
    this.checkEnemyCollisions();
    this.checkCoinCollisions();
    this.checkFlaskCollisions();
  }

  /**
   * Updates enemy behavior based on character position
   */
  updateEnemyBehavior() {
    this.level.enemies.forEach(enemy => {
      if (enemy.updateBehavior) {
        enemy.updateBehavior(this.character);
      }
    });
  }

  /**
   * Checks collisions between thrown bottles and enemies
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
   * Removes bottles that fell off screen
   */
  cleanupBottles() {
    this.throwableObjects = this.throwableObjects.filter((bottle) => {
      return !this.isBottleOutOfBounds(bottle) && !this.isOldHitBottle(bottle);
    });
  }

  /**
   * Checks if bottle is out of bounds
   * @param {ThrowableObject} bottle - The bottle to check
   * @returns {boolean} True if out of bounds
   */
  isBottleOutOfBounds(bottle) {
    return bottle.y > 500 ||
      bottle.x > this.level.level_end_x + 300 ||
      bottle.x < -100;
  }

  /**
   * Checks if bottle is old hit bottle
   * @param {ThrowableObject} bottle - The bottle to check
   * @returns {boolean} True if old hit bottle
   */
  isOldHitBottle(bottle) {
    return bottle.hasHit && Date.now() - bottle.throwTime > 1000;
  }

  /**
   * Handles bottle hit on enemy
   * @param {ThrowableObject} bottle - The thrown bottle
   * @param {MovableObject} enemy - The hit enemy
   * @param {number} enemyIndex - Enemy index in array
   * @param {number} bottleIndex - Bottle index in array
   */
  handleBottleHit(bottle, enemy, enemyIndex, bottleIndex) {
    bottle.hasHit = true;
    bottle.playSplash();
    this.scheduleBottleRemoval(bottleIndex);
    if (enemy instanceof Endboss) {
      this.damageEndboss(enemy);
    } else {
      this.killEnemyByBottle(enemyIndex);
    }
  }

  /**
   * Schedules bottle removal after delay
   * @param {number} bottleIndex - Index of bottle to remove
   */
  scheduleBottleRemoval(bottleIndex) {
    setTimeout(() => {
      this.throwableObjects.splice(bottleIndex, 1);
    }, 200);
  }

  /**
   * Damages endboss
   * @param {Endboss} endboss - The endboss
   */
  damageEndboss(endboss) {
    endboss.hit(20);
    this.endbossStatusBar.setPercentage(endboss.energy);
    this.audioManager.play('bossHurt');
  }

  /**
   * Kills normal enemy by bottle hit
   * @param {number} enemyIndex - Index of enemy to kill
   */
  killEnemyByBottle(enemyIndex) {
    this.level.enemies.splice(enemyIndex, 1);
    this.audioManager.play('chickenDeath');
  }

  /**
   * Checks collisions between character and enemies
   */
  checkEnemyCollisions() {
    const collidingEnemies = [];
    const enemiesToKill = [];
    let shouldBounce = false;
    this.findCollidingEnemies(collidingEnemies);
    this.processCollidingEnemies(collidingEnemies, enemiesToKill);
    this.handleSideCollisions(collidingEnemies);
    this.killMarkedEnemies(enemiesToKill, shouldBounce);
    this.checkGameOver();
    this.checkGameWin();
  }

  /**
   * Finds all enemies colliding with character
   * @param {Array} collidingEnemies - Array to store colliding enemies
   */
  findCollidingEnemies(collidingEnemies) {
    this.level.enemies.forEach((enemy, index) => {
      if (this.character.isColliding(enemy)) {
        collidingEnemies.push({ enemy, index });
      }
    });
  }

  /**
   * Processes colliding enemies for jump kills
   * @param {Array} collidingEnemies - Enemies colliding with character
   * @param {Array} enemiesToKill - Enemies marked for death
   */
  processCollidingEnemies(collidingEnemies, enemiesToKill) {
    collidingEnemies.forEach(({ enemy, index }) => {
      if (this.isJumpingOnEnemy(enemy)) {
        this.handleJumpOnEnemy(enemy, index, enemiesToKill);
      }
    });
  }

  /**
   * Handles jump on enemy
   * @param {MovableObject} enemy - The enemy
   * @param {number} index - Enemy index
   * @param {Array} enemiesToKill - Enemies to kill
   */
  handleJumpOnEnemy(enemy, index, enemiesToKill) {
    if (enemy instanceof Endboss) {
      this.damageCharacterByEndboss();
    } else {
      enemiesToKill.push(index);
    }
  }

  /**
   * Damages character by endboss
   */
  damageCharacterByEndboss() {
    if (!this.character.isHurt()) {
      this.character.hit(50);
      this.healthStatusBar.setPercentage(this.character.energy);
    }
  }

  /**
   * Handles side collisions with enemies
   * @param {Array} collidingEnemies - Colliding enemies
   */
  handleSideCollisions(collidingEnemies) {
    if (collidingEnemies.length > 0 && !this.hasJumpKills(collidingEnemies)) {
      this.damageCharacter(collidingEnemies[0].enemy);
    }
  }

  /**
   * Checks if any collisions resulted in jump kills
   * @param {Array} collidingEnemies - Colliding enemies
   * @returns {boolean} True if jump kills occurred
   */
  hasJumpKills(collidingEnemies) {
    return collidingEnemies.some(({ enemy }) =>
      this.isJumpingOnEnemy(enemy) && !(enemy instanceof Endboss)
    );
  }

  /**
   * Damages character by enemy
   * @param {MovableObject} enemy - The enemy
   */
  damageCharacter(enemy) {
    if (!this.character.isHurt()) {
      const damage = enemy instanceof Endboss ? 15 : 5;
      this.character.hit(damage);
      this.healthStatusBar.setPercentage(this.character.energy);
    }
  }

  /**
   * Kills marked enemies
   * @param {Array} enemiesToKill - Enemies to kill
   * @param {boolean} shouldBounce - Should character bounce
   */
  killMarkedEnemies(enemiesToKill, shouldBounce) {
    if (enemiesToKill.length > 0) {
      enemiesToKill.sort((a, b) => b - a);
      enemiesToKill.forEach((index) => {
        this.level.enemies.splice(index, 1);
      });
      this.audioManager.play("chickenDeath");
      this.character.speedY = 15;
    }
  }

  /**
   * Checks if game over and shows screen
   */
  checkGameOver() {
    if (this.character.isDead() && !this.gameEnded) {
      this.gameEnded = true;
      const animationDuration = this.calculateDeathAnimationDuration();
      setTimeout(() => {
        this.showGameOver();
      }, animationDuration);
    }
  }

  /**
   * Calculates death animation duration
   * @returns {number} Duration in milliseconds
   */
  calculateDeathAnimationDuration() {
    const frameCount = this.character.IMAGES_DEAD.length;
    const frameDelay = 50;
    const loops = 1;
    return frameCount * frameDelay * loops;
  }

  /**
   * Checks if game won and shows screen
   */
  checkGameWin() {
    let endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (endboss && endboss.isDead() && !this.gameEnded) {
      this.gameEnded = true;
      const animationDuration = this.calculateEndbossDeathDuration(endboss);
      setTimeout(() => {
        this.showGameWin();
      }, animationDuration);
    }
  }

  /**
   * Calculates endboss death animation duration
   * @param {Endboss} endboss - The endboss
   * @returns {number} Duration in milliseconds
   */
  calculateEndbossDeathDuration(endboss) {
    const frameCount = endboss.IMAGES_DEAD.length;
    const frameDelay = 200;
    const loops = 1;
    return frameCount * frameDelay * loops;
  }

  /**
   * Shows game over screen and stops game
   */
  showGameOver() {
    stopAllIntervals();
    this.audioManager.cleanup();
    this.displayGameOverScreen();
  }

  /**
   * Displays game over screen with random image
   */
  displayGameOverScreen() {
    const randomImage = this.getRandomImage(this.IMAGES_LOOSE);
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
   * Shows win screen and stops game
   */
  showGameWin() {
    stopAllIntervals();
    this.audioManager.cleanup();
    this.displayWinScreen();
  }

  /**
   * Displays win screen with random image
   */
  displayWinScreen() {
    const randomImage = this.getRandomImage(this.IMAGES_WIN);
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
   * Gets random image from array
   * @param {Array} images - Array of image paths
   * @returns {string} Random image path
   */
  getRandomImage(images) {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }

  /**
   * Checks if character is jumping on enemy
   * @param {MovableObject} enemy - The enemy to check
   * @returns {boolean} True if jumping on enemy from above
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
   * Checks if character is coming from above enemy
   * @param {MovableObject} enemy - The enemy
   * @returns {boolean} True if coming from above
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
   * Checks collisions between character and coins
   */
  checkCoinCollisions() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.collectCoin(index);
      }
    });
  }

  /**
   * Collects a coin
   * @param {number} index - Coin index in coins array
   */
  collectCoin(index) {
    this.level.coins.splice(index, 1);
    this.character.collectedCoins++;
    this.updateCoinStatusbar();
    this.audioManager.play("coin");
  }

  /**
   * Updates coin status bar
   */
  updateCoinStatusbar() {
    let percentage = (this.character.collectedCoins / 10) * 100;
    if (percentage > 100) percentage = 100;
    this.coinStatusBar.setPercentage(percentage);
  }

  /**
   * Checks collisions between character and flasks
   */
  checkFlaskCollisions() {
    this.level.flasks.forEach((flask, index) => {
      if (this.canCollectFlask(flask)) {
        this.collectFlask(index);
      }
    });
  }

  /**
   * Checks if flask can be collected
   * @param {Flask} flask - The flask
   * @returns {boolean} True if can collect
   */
  canCollectFlask(flask) {
    return this.character.isColliding(flask) &&
      this.character.collectedFlasks < 5;
  }

  /**
   * Collects a flask
   * @param {number} index - Flask index in flasks array
   */
  collectFlask(index) {
    this.level.flasks.splice(index, 1);
    this.character.collectedFlasks++;
    this.updateFlaskStatusbar();
    this.audioManager.play("flask");
  }

  /**
   * Updates flask status bar
   */
  updateFlaskStatusbar() {
    let percentage = (this.character.collectedFlasks / 5) * 100;
    if (percentage > 100) percentage = 100;
    this.flaskStatusBar.setPercentage(percentage);
  }

  /**
   * Main drawing method - renders all game objects
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const roundedCameraX = Math.floor(this.camera_x);
    this.ctx.translate(roundedCameraX, 0);
    this.drawBackgroundObjects();
    this.drawDynamicObjects();
    this.ctx.translate(-roundedCameraX, 0);
    this.addStaticStatusBars();
    this.ctx.translate(roundedCameraX, 0);
    this.addToMap(this.character);
    this.ctx.translate(-roundedCameraX, 0);
    this.scheduleNextFrame();
  }

  /**
   * Draws background objects
   */
  drawBackgroundObjects() {
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
  }

  /**
   * Draws dynamic game objects
   */
  drawDynamicObjects() {
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.flasks);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.addDynamicStatusBars();
  }

  /**
   * Schedules next animation frame
   */
  scheduleNextFrame() {
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Draws static status bars
   */
  addStaticStatusBars() {
    this.addToMap(this.healthStatusBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.flaskStatusBar);
  }

  /**
   * Draws dynamic status bars
   */
  addDynamicStatusBars() {
    let endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (endboss && endboss.hadFirstContact) {
      this.endbossStatusBar.updatePosition(endboss);
      this.addToMap(this.endbossStatusBar);
    }
  }

  /**
   * Draws array of objects to map
   * @param {Array} objects - Array of objects to draw
   */
  addObjectsToMap(objects) {
    objects.forEach((element) => {
      this.addToMap(element);
    });
  }

  /**
   * Draws single object to map
   * @param {MovableObject} moveObject - Object to draw
   */
  addToMap(moveObject) {
    if (moveObject.otherDirection) {
      this.flipImage(moveObject);
    }
    moveObject.draw(this.ctx);
    if (moveObject.otherDirection) {
      this.flipImageBack(moveObject);
    }
  }

  /**
   * Flips image horizontally
   * @param {MovableObject} moveObject - Object to flip
   */
  flipImage(moveObject) {
    this.ctx.save();
    this.ctx.translate(moveObject.width, 0);
    this.ctx.scale(-1, 1);
    moveObject.x = moveObject.x * -1;
  }

  /**
   * Restores normal image orientation
   * @param {MovableObject} moveObject - Object to restore
   */
  flipImageBack(moveObject) {
    moveObject.x = moveObject.x * -1;
    this.ctx.restore();
  }
}