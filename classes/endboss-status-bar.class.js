/**
 * Health bar display for the endboss.
 * @extends DrawableObjects
 */
class EndbossStatusBar extends DrawableObjects {
    constructor(endboss) {
        super();
        this.endboss = endboss;
        this.width = 200;
        this.height = 20;
    }

    /**
     * Draws the HP bar above the endboss.
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        this.updatePosition();
        this.drawBackground(ctx);
        this.drawHealthBar(ctx);
    }

    /**
     * Updates bar position relative to endboss.
     */
    updatePosition() {
        if (this.endboss) {
            this.x = this.endboss.x + (this.endboss.width / 2) - (this.width / 2); // Center above endboss
            this.y = this.endboss.y - 30; // 30 pixels above endboss
        }
    }

    /**
     * Draws the background of the HP bar.
     * @param {CanvasRenderingContext2D} ctx
     */
    drawBackground(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    /**
     * Draws the current health level.
     * @param {CanvasRenderingContext2D} ctx
     */
    drawHealthBar(ctx) {
        const healthPercent = this.endboss.health / this.endboss.maxHealth;
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width * healthPercent, this.height);
    }
}