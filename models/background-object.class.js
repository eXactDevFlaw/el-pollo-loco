/**
 * Background layer for parallax scrolling effect
 */
class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;

    /**
     * Creates a new background object
     * @param {string} imagePath - Path to background image
     * @param {number} x - X position
     */
    constructor(imagePath, x) {
        super()
        this.loadImage(imagePath)
        this.x = x;
        this.y = 480 - this.height;
    }
}