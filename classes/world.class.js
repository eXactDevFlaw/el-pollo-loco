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

        if (this.keyboard.D &&
            now - this.lastThrowTime > this.throwCooldown &&
            this.bottleAmount > 0) {

            let bottle = new ThrowableObjects(this.character.x, this.character.y);
            this.throwableObjects.push(bottle);

            this.lastThrowTime = now;
            this.bottleAmount--;
            this.bottleStatusBar.setPercentage(this.bottleAmount);
        }
    }

    /**
     * Checks collisions between the character and all enemies.
     */
    checkCollision() {
        this.level.enemies.forEach((enemy, i) => {
            if (this.character.isColliding(enemy)) {
                this.handleEnemyCollision(enemy, i);
            }
        });
    }

    /**
     * Handles collision with a single enemy.
     * @param {MovableObject} enemy
     * @param {number} index - Index of the enemy in the enemies array.
     */
    handleEnemyCollision(enemy, index) {
        if (enemy instanceof Chicken && !enemy.isDead) {
            if (this.isChickenStomped(enemy)) {
                this.handleChickenStomp(enemy, index);
            } else {
                this.handlePlayerDamage(enemy);
            }
        } else if (enemy instanceof Endboss) {
            this.handlePlayerDamage(enemy);
        }
    }

    /**
     * Determines if the chicken was stomped from above.
     * @param {Chicken} chicken
     * @returns {boolean}
     */
    isChickenStomped(chicken) {
        console.log("chicken hat aua")
        const charBottom = this.character.y + this.character.height;
        const chickenTop = chicken.y + 10;
        return this.character.speedY < 0 && charBottom <= chickenTop + 15;
    }

    /**
     * Handles the logic when a chicken is stomped.
     * @param {Chicken} chicken
     * @param {number} index
     */
    handleChickenStomp(chicken, index) {
        chicken.die(() => {
            this.level.enemies.splice(index, 1);
        });
        this.character.speedY = 20; // Rebound
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
        this.level.coins.forEach((coin, i) => {
            if (this.character.isColliding(coin)) {
                coinsToRemove.push(i);
                this.coinAmount++;
                this.coinStatusBar.setPercentage(this.coinAmount);
            }
        });

        for (let i = coinsToRemove.length - 1; i >= 0; i--) {
            this.level.coins.splice(coinsToRemove[i], 1);
        }
    }

    /**
     * Handles bottle pickup.
     */
    checkBottlePickup() {
        const bottlesToRemove = [];
        if (this.bottleAmount < 5) {
            this.level.bottles.forEach((bottle, i) => {
                if (this.character.isColliding(bottle)) {
                    bottlesToRemove.push(i);
                    this.bottleAmount++;
                    this.bottleStatusBar.setPercentage(this.bottleAmount);
                }
            });
            for (let i = bottlesToRemove.length - 1; i >= 0; i--) {
                this.level.bottles.splice(bottlesToRemove[i], 1);
            }
        }
    }

    /**
     * Main render loop.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width + 100, this.canvas.height + 100);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectToMap(this.level.backgroundObjects);
        this.addObjectToMap(this.level.clouds);
        this.addObjectToMap(this.level.bottles);
        this.addObjectToMap(this.level.coins);

        this.ctx.translate(-this.camera_x, 0);

        // ------ Space for fixed objects --------
        this.addToMap(this.statusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.bottleStatusBar);
        this.ctx.translate(this.camera_x, 0);

        this.addObjectToMap(this.throwableObjects);
        this.addObjectToMap(this.level.enemies);
        this.addToMap(this.character);

        this.ctx.translate(-this.camera_x, 0);

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