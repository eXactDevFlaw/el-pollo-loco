class DrawableObjects {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    draw(ctx) {
        try{
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } catch(err) {
            console.warn('Error loading image', err);
            console.log('Could not load image', this.img.src);
        }
    }

    drawBorder(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = '3';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
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

}