class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;

    x = 120;
    y = 280;
    height = 150;
    width = 150;

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
    * @param {String} path
    */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * 
     * @param {*} ctx 
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
}