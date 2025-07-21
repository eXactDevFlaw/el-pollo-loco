class MovableObject {
    x = 120;
    y = 280;
    img;
    height = 150;
    width = 100;
    imageCache = {}
    currentImage = 0
    speed = 0.15
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    applyGravity() {
        setInterval(() => {
            if(this.isAboveGround()){
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }

        }, 1000 / 25)
    }

    isAboveGround(){
        return this.y < 160
    }

    /**
     * 
     * @param {Array} arr - ['img/img1.png', 'img/img2.png', ...]
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        })
    }

    playAnimation(images) {
        let i = this.currentImage % this.IMAGES_WALKING.length
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        console.log("moving right")
    }

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }
}