class DrawableObjects {
    /**
     * Currently displayed image object.
     * @type {HTMLImageElement}
     */
    img;

    /**
     * Cache of loaded images mapped by their file path.
     * @type {Object.<string, HTMLImageElement>}
     */
    imageCache = {};

    /**
     * Index or key of the current image in use.
     * @type {number}
     */
    currentImage = 0;

    /**
     * X-coordinate of the object on the canvas.
     * @type {number}
     */
    x = 120;

    /**
     * Y-coordinate of the object on the canvas.
     * @type {number}
     */
    y = 280;

    /**
     * Height of the object in pixels.
     * @type {number}
     */
    height = 150;

    /**
     * Width of the object in pixels.
     * @type {number}
     */
    width = 100;

    /**
     * Loads a single image and assigns it to the object.
     * @param {string} path - Path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads multiple images into the image cache.
     * @param {string[]} arr - Array of image file paths (e.g. ['img/img1.png', 'img/img2.png']).
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    getHitbox() {
        return {
            x: this.x + (this.hitboxOffsetX || 0),
            y: this.y + (this.hitboxOffsetY || 0),
            width: this.hitboxWidth || this.width,
            height: this.hitboxHeight || this.height
        };
    }

    /**
     * Draws the object's current image on the canvas.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    draw(ctx) {
        try {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } catch (err) {
            console.warn('Error loading image', err);
            console.log('Could not load image', this.img?.src);
        }
    }


    drawBorder(ctx) {
        const { x, y, width, height } = this.getHitbox ? this.getHitbox() : this;
        if (this instanceof Chicken || this instanceof Character || this instanceof Endboss || this instanceof Coin || this instanceof Bottle) {
            ctx.beginPath();
            ctx.strokeStyle = 'magenta';
            ctx.lineWidth = 2;
            ctx.rect(x, y, width, height);
            ctx.stroke();
        }
    }
}