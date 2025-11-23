class MovableObject {
    x = 120;
    y = 280;
    height = 150;
    width = 150;
    img;
    speed = 0.15;

    imageCache = {};
    currentImage = 0;
    otherDirection = false;

    /**
     * 
     * @param {String} path 
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * 
     * @param {Array} arr
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    playAnimation(images) {
        let index = this.currentImage % images.length;
        let path = images[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        console.log('move right!');
    }

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60)
    }
}