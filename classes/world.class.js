class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    throwableObjects = []

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
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
            this.checkCollision();
            this.checkThrowObjects();
        }, 200)
    }

    checkThrowObjects() {
        if (this.keyboard.D) {
            let bottle = new ThrowableObjects(this.character.x, this.character.y)
            this.throwableObjects.push(bottle);
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

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width + 100, this.canvas.height + 100);

        this.ctx.translate(this.camera_x, 0)

        this.addObjecctToMap(this.level.backgroundObjects);
        this.addObjecctToMap(this.level.clouds);








        this.ctx.translate(-this.camera_x, 0)
        // ------ Space for fixed objects --------
        this.addToMap(this.statusBar);
        this.ctx.translate(this.camera_x, 0);




        this.addObjecctToMap(this.throwableObjects);
        this.addObjecctToMap(this.level.enemies);
        this.addToMap(this.character)

        this.ctx.translate(-this.camera_x, 0)

        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjecctToMap(objects) {
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