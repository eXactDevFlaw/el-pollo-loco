/**
 * Basisklasse für alle zeichenbaren Objekte
 * Verwaltet Bilder, Position und grundlegende Rendering-Funktionalität
 */
class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;

    x = 120;
    y = 280;
    height = 150;
    width = 150;

    /**
     * Hitbox-Offsets für präzisere Kollisionserkennung
     * @type {Object}
     */
    offsetHitbox = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    };

    /**
     * Lädt ein einzelnes Bild
     * @param {String} path - Pfad zum Bild
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Lädt mehrere Bilder in den Cache
     * @param {Array} arr - Array mit Bildpfaden
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Berechnet die Hitbox des Objekts
     * @returns {Object} Hitbox mit left, right, top, bottom
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
     * Zeichnet das Objekt auf das Canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas Context
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
     * Zeichnet eine Rechteck-Hitbox um das Objekt
     * @param {CanvasRenderingContext2D} ctx - Canvas Context
     */
    drawRect(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    /**
     * Zeichnet die tatsächliche Hitbox mit Offsets
     * @param {CanvasRenderingContext2D} ctx - Canvas Context
     */
    drawRectHitbox(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof SmallChicken || this instanceof Endboss || this instanceof Coin || this instanceof Flask) {
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
}