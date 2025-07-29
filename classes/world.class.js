/**
 * Main game world controller.
 */
class World {
    character = new Character();
    level;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    coinStatusBar = new CoinStatusBar();
    bottleStatusBar = new BottleStatusBar();
    throwableObjects = [];
    bottleAmount = 0;
    coinAmount = 0;

    /**
     * Creates a new World.
     * @param {HTMLCanvasElement} canvas - The canvas element.
     * @param {Keyboard} keyboard - The keyboard controller.
     * @param {Level} level - The game level.
     */
    constructor(canvas, keyboard, level) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = level;
        this.lastThrowTime = 0;
        this.throwCooldown = 300;
        this.draw();
        this.setWorld();
        this.run();
    }

    /**
     * Links the character to the world.
     */
    setWorld() {
        this.character.world = this;
    }

    /**
     * Main game loop for collision and actions.
     */
    run() {
        setInterval(() => {
            this.checkCollision();
            this.checkCoinCollisions();
            this.checkBottlePickup();
            this.checkThrowObjects();
        }, 200);
    }

    /**
     * Handles bottle throwing logic.
     */
    checkThrowObjects() {
        const now = Date.now();

        if (this.canThrowBottle(now)) {
            this.throwNewBottle();
            this.updateThrowCooldown(now);
            this.decreaseBottleAmount();
        }
    }

    /**
     * Checks if player can throw a bottle right now.
     * @param {number} now - Current time in milliseconds
     * @returns {boolean} True if bottle can be thrown
     */
    canThrowBottle(now) {
        const keyPressed = this.keyboard.D;
        const cooldownPassed = now - this.lastThrowTime > this.throwCooldown;
        const hasBottles = this.bottleAmount > 0;
        return keyPressed && cooldownPassed && hasBottles;
    }

    /**
     * Creates and throws a new bottle.
     */
    throwNewBottle() {
        let bottle = new ThrowableObjects(this.character.x, this.character.y);
        this.throwableObjects.push(bottle);
    }

    /**
     * Updates the last throw time.
     * @param {number} now - Current time in milliseconds
     */
    updateThrowCooldown(now) {
        this.lastThrowTime = now;
    }

    /**
     * Decreases bottle amount and updates status bar.
     */
    decreaseBottleAmount() {
        this.bottleAmount--;
        const percentage = (this.bottleAmount / 5) * 100;
        this.bottleStatusBar.setPercentage(percentage);
    }

    /**
     * Checks collisions between the character and all enemies.
     */
    checkCollision() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.handlePlayerDamage(enemy);
            }
        });
    }

    /**
     * Handles the logic when the player takes damage.
     * @param {MovableObject} enemy
     */
    handlePlayerDamage(enemy) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
    }

    /**
     * Handles coin collection.
     */
    checkCoinCollisions() {
        const coinsToRemove = [];

        this.findCollidingCoins(coinsToRemove);
        this.removeCollectedCoins(coinsToRemove);
    }

    /**
     * Finds coins that collide with character and adds them to removal list.
     * @param {number[]} coinsToRemove - Array to store coin indices
     */
    findCollidingCoins(coinsToRemove) {
        this.level.coins.forEach((coin, i) => {
            if (this.character.isColliding(coin)) {
                coinsToRemove.push(i);
                this.increaseCoinAmount();
            }
        });
    }

    /**
     * Increases coin amount and updates status bar.
     */
    increaseCoinAmount() {
        this.coinAmount++;
        this.coinStatusBar.setPercentage(this.coinAmount);
    }

    /**
     * Removes collected coins from the level.
     * @param {number[]} coinsToRemove - Array of coin indices to remove
     */
    removeCollectedCoins(coinsToRemove) {
        for (let i = coinsToRemove.length - 1; i >= 0; i--) {
            this.level.coins.splice(coinsToRemove[i], 1);
        }
    }

    /**
     * Handles bottle pickup.
     */
    checkBottlePickup() {
        if (this.canPickupMoreBottles()) {
            const bottlesToRemove = [];
            this.findCollidingBottles(bottlesToRemove);
            this.removeCollectedBottles(bottlesToRemove);
        }
    }

    /**
     * Checks if player can pick up more bottles.
     * @returns {boolean} True if bottle amount is less than maximum
     */
    canPickupMoreBottles() {
        return this.bottleAmount < 5;
    }

    /**
     * Finds bottles that collide with character and adds them to removal list.
     * @param {number[]} bottlesToRemove - Array to store bottle indices
     */
    findCollidingBottles(bottlesToRemove) {
        this.level.bottles.forEach((bottle, i) => {
            if (this.character.isColliding(bottle) && this.bottleAmount < 5) {
                bottlesToRemove.push(i);
                this.increaseBottleAmount();
            }
        });
    }

    /**
     * Increases bottle amount and updates status bar.
     */
    increaseBottleAmount() {
        this.bottleAmount++;
        if (this.bottleAmount > 5) {
            this.bottleAmount = 5;
        }
        const percentage = (this.bottleAmount / 5) * 100;
        this.bottleStatusBar.setPercentage(percentage);
    }

    /**
     * Removes collected bottles from the level.
     * @param {number[]} bottlesToRemove - Array of bottle indices to remove
     */
    removeCollectedBottles(bottlesToRemove) {
        for (let i = bottlesToRemove.length - 1; i >= 0; i--) {
            this.level.bottles.splice(bottlesToRemove[i], 1);
        }
    }

    /**
     * Main render loop.
     */
    draw() {
        this.clearCanvas();
        this.drawBackgroundObjects();
        this.drawFixedObjects();
        this.drawGameObjects();
        this.scheduleNextFrame();
    }

    /**
     * Clears the canvas for the next frame.
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width + 100, this.canvas.height + 100);
    }

    /**
     * Draws all background objects (background, clouds, items).
     */
    drawBackgroundObjects() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectToMap(this.level.backgroundObjects);
        this.addObjectToMap(this.level.clouds);
        this.addObjectToMap(this.level.bottles);
        this.addObjectToMap(this.level.coins);
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Draws fixed UI elements (status bars).
     */
    drawFixedObjects() {
        this.addToMap(this.statusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.bottleStatusBar);
    }

    /**
     * Draws moving game objects (character, enemies, bottles).
     */
    drawGameObjects() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectToMap(this.throwableObjects);
        this.addObjectToMap(this.level.enemies);
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Schedules the next animation frame.
     */
    scheduleNextFrame() {
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    /**
     * Adds multiple objects to the map.
     * @param {DrawableObjects[]} objects
     */
    addObjectToMap(objects) {
        objects.forEach((o) => {
            this.addToMap(o);
        });
    }

    /**
     * Renders a single object to the map.
     * @param {DrawableObjects} mo
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);
        mo.drawBorder(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Flips the object's image horizontally.
     * @param {DrawableObjects} mo
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the flipped object's image.
     * @param {DrawableObjects} mo
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}