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

    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {
            this.checkCollision();
            this.checkCoinCollisions();
            this.checkBottlePickup();
            this.checkThrowObjects();
        }, 200)
    }

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

    checkCollision() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }
        })
    }

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

    checkBottlePickup() {
        const bottlesToRemove = [];
        if(this.bottleAmount < 5){
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

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width + 100, this.canvas.height + 100);

        this.ctx.translate(this.camera_x, 0)

        this.addObjectToMap(this.level.backgroundObjects);
        this.addObjectToMap(this.level.clouds);
        this.addObjectToMap(this.level.bottles);
        this.addObjectToMap(this.level.coins);







        this.ctx.translate(-this.camera_x, 0)
        // ------ Space for fixed objects --------


        this.addToMap(this.statusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.bottleStatusBar);
        this.ctx.translate(this.camera_x, 0);




        this.addObjectToMap(this.throwableObjects);
        this.addObjectToMap(this.level.enemies);
        this.addToMap(this.character)

        this.ctx.translate(-this.camera_x, 0)

        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectToMap(objects) {
        objects.forEach((o) => {
            this.addToMap(o)
        })
    }

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

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}