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

    /**
     * Draws a debug frame around the object depending on its specific class.
     * Calls the corresponding drawXYZ method based on instance type.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawBorder(ctx) {
        if (this instanceof Character) {
            this.drawCharacter(ctx);
        } else if (this instanceof Chicken) {
            this.drawChicken(ctx);
        } else if (this instanceof Coin) {
            this.drawCoin(ctx);
        } else if (this instanceof Bottle) {
            this.drawBottle(ctx);
        } else if (this instanceof Endboss) {
            this.drawEndboss(ctx);
        }
    }

    /**
     * Draws a blue rectangle frame around the character for debugging.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawCharacter(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 1;
        ctx.rect(this.x + 16, this.y + 75, this.width - 30, this.height - 85);
        ctx.stroke();
    }

    /**
     * Draws a black rectangle frame around the chicken for debugging.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawChicken(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }

    /**
     * Draws a green rectangle frame around the coin for debugging.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawCoin(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 1;
        ctx.rect(this.x + 40, this.y + 40, this.width - 80, this.height - 80);
        ctx.stroke();
    }

    /**
     * Draws a yellow rectangle frame around the bottle for debugging.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawBottle(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 1;
        ctx.rect(this.x + 15, this.y + 10, this.width - 30, this.height - 20);
        ctx.stroke();
    }

    /**
     * Draws a red rectangle frame around the boss for debugging.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawEndboss(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.rect(this.x + 15, this.y + 10, this.width - 30, this.height - 20);
        ctx.stroke();
    }
}