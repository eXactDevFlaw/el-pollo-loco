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
        bottom: 0
    }

    drawRect(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    drawRectHitbox(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'red';
            ctx.rect(this.x + this.offsetHitbox.left,
                this.y + this.offsetHitbox.top,
                this.width - this.offsetHitbox.left - this.offsetHitbox.right,
                this.height - this.offsetHitbox.top - this.offsetHitbox.bottom);
            ctx.stroke();
        }
    }

    playAnimation(images) {
        let index = this.currentImage % images.length;
        let path = images[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25)
    }

    isAboveGround() {
        return this.y < 160;
    }

    jump() {
        this.speedY = 30;
    }

    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isDead() {
        return this.energy == 0;
    }

    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 1;
    }

    isColliding(moveObject) {
        const a = {
            left: this.x + this.offsetHitbox.left,
            right: this.x + this.width - this.offsetHitbox.right,
            top: this.y + this.offsetHitbox.top,
            bottom: this.y + this.height - this.offsetHitbox.bottom
        };

        const b = {
            left: moveObject.x + moveObject.offsetHitbox.left,
            right: moveObject.x + moveObject.width - moveObject.offsetHitbox.right,
            top: moveObject.y + moveObject.offsetHitbox.top,
            bottom: moveObject.y + moveObject.height - moveObject.offsetHitbox.bottom
        };

        return (
            a.left < b.right &&
            a.right > b.left &&
            a.top < b.bottom &&
            a.bottom > b.top
        );
    }
}