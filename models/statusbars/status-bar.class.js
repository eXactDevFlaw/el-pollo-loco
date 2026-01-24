/**
 * Base class for all status displays
 */
class StatusBar extends DrawableObject {
    percentage = 100;
    IMAGES = [];

    /**
     * Creates a new status bar
     */
    constructor() {
        super();
    }

    /**
     * Sets percentage and updates displayed image
     * @param {number} percentage - Value between 0 and 100
     */
    setPercentage(percentage) {
        this.percentage = percentage
        let path = this.IMAGES[this.resolveImageIndex()]
        this.img = this.imageCache[path]
    }

    /**
     * Determines which image to show based on percentage
     * @returns {number} Index of image to use
     */
    resolveImageIndex() {
        if (this.percentage == 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }
}