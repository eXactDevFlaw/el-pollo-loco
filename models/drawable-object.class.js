/**
 * Base class for all drawable objects
 */
class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;

    x = 120;
    y = 280;
    height = 150;
    width = 150;

    offsetHitbox = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    };

    /**
     * Loads a single image
     * @param {string} path - Path to the image
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads multiple images into cache
     * @param {string[]} arr - Array of image paths
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Calculates the hitbox of the object
     * @returns {Object} Hitbox with left, right, top, bottom
     */
    getHitbox() {
        return {
            left: this.x + this.offsetHitbox.left,
            right: this.x + this.width - this.offsetHitbox.right,
            top: this.y + this.offsetHitbox.top,
            bottom: this.y + this.height - this.offsetHitbox.bottom,
        };
    }

    /**
     * Draws the object on canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        try {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } catch (e) {
            console.warn('Error loading image', e);
            console.log('Could not load image,', this.img.src);
        }
    }

    /**
     * Draws rectangle hitbox around object
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawRect(ctx) {
        if (this.shouldDrawRect()) {
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    /**
     * Checks if rect should be drawn
     * @returns {boolean} True if debug hitbox should show
     */
    shouldDrawRect() {
        return this instanceof Character ||
            this instanceof Chicken ||
            this instanceof Endboss;
    }

    /**
     * Draws actual hitbox with offsets
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawRectHitbox(ctx) {
        if (this.shouldDrawHitbox()) {
            this.renderHitbox(ctx);
        }
    }

    /**
     * Checks if hitbox should be drawn
     * @returns {boolean} True if object type should show hitbox
     */
    shouldDrawHitbox() {
        return this instanceof Character ||
            this instanceof Chicken ||
            this instanceof SmallChicken ||
            this instanceof Endboss ||
            this instanceof Coin ||
            this instanceof Flask;
    }

    /**
     * Renders the hitbox rectangle
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    renderHitbox(ctx) {
        ctx.beginPath();
        ctx.lineWidth = '2';
        ctx.strokeStyle = 'red';
        ctx.rect(
            this.x + this.offsetHitbox.left,
            this.y + this.offsetHitbox.top,
            this.width - this.offsetHitbox.left - this.offsetHitbox.right,
            this.height - this.offsetHitbox.top - this.offsetHitbox.bottom
        );
        ctx.stroke();
    }
}