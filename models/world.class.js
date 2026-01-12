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

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
    }, 200);
  }

  checkThrowObjects() {
    if (this.keyboard.D) {
      let bottle = new ThrowableObject(this.character.x, this.character.y);
      this.throwableObjects.push(bottle);
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.healthStatusBar.setPercentage(this.character.energy);
      }
    });
  }

  // NEU: Coin Collision Check
  checkCoinCollisions() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        // Coin einsammeln
        this.collectCoin(index);
      }
    });
  }

  // NEU: Coin einsammeln
  collectCoin(index) {
    // Coin aus Array entfernen
    this.level.coins.splice(index, 1);

    // Counter erhöhen
    this.character.collectedCoins++;

    // StatusBar updaten (0-100%, 10 Coins = 100%)
    let percentage = (this.character.collectedCoins / 10) * 100;
    if (percentage > 100) percentage = 100;
    this.coinStatusBar.setPercentage(percentage);

    // Optional: Sound abspielen
    // this.coinSound.play();
  };

  // NEU: Flask Collision Check
  checkFlaskCollisions() {
    this.level.flasks.forEach((flask, index) => {
      if (this.character.isColliding(flask)) {
        // Flask einsammeln
        this.collectFlask(index);
      }
    });
  };

  // NEU: Flask einsammeln
  collectFlask(index) {
    // Flask aus Array entfernen
    this.level.flasks.splice(index, 1);

    // Inventory erhöhen
    this.character.availableFlasks++;

    // StatusBar updaten (0-100%, 5 Flasks = 100%)
    let percentage = (this.character.availableFlasks / 5) * 100;
    if (percentage > 100) percentage = 100;
    this.flaskStatusBar.setPercentage(percentage);

    // Optional: Sound abspielen
    // this.flaskSound.play();
  };

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.flasks);
    this.addObjectsToMap(this.throwableObjects);
    this.addDynamicStatusBars();

    this.ctx.translate(-this.camera_x, 0);
    this.addStaticStatusBars();
    this.ctx.translate(this.camera_x, 0);

    this.addToMap(this.character);
    this.ctx.translate(-this.camera_x, 0);

    // draw() wird wiederholt gecallt
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addStaticStatusBars() {
    this.addToMap(this.healthStatusBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.flaskStatusBar);
  }

  addDynamicStatusBars() {
    let endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (endboss && endboss.hadFirstContact) {
      this.endbossStatusBar.updatePosition(endboss);
      this.addToMap(this.endbossStatusBar);
    }
  }

  addObjectsToMap(objects) {
    objects.forEach((element) => {
      this.addToMap(element);
    });
  }

  addToMap(moveObject) {
    if (moveObject.otherDirection) {
      this.flipImage(moveObject);
    }

    moveObject.draw(this.ctx);
    //moveObject.drawRect(this.ctx);
    //moveObject.drawRectHitbox(this.ctx);

    if (moveObject.otherDirection) {
      this.flipImageBack(moveObject);
    }
  }

  flipImage(moveObject) {
    this.ctx.save();
    this.ctx.translate(moveObject.width, 0);
    this.ctx.scale(-1, 1);
    moveObject.x = moveObject.x * -1;
  }

  flipImageBack(moveObject) {
    moveObject.x = moveObject.x * -1;
    this.ctx.restore();
  }
}
