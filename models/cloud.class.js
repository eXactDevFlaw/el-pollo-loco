/**
 * Cloud in background
 */
class Cloud extends MovableObject {
    y = 20;
    height = 250;
    width = 500;

    /**
     * Creates a new cloud at random position
     */
    constructor() {
        super();
        this.loadImage('./img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 500;
        this.animate();
    }

    /**
     * Starts cloud movement
     */
    animate() {
        setStoppableInterval(() => {
            this.moveLeft();
        }, 75)
    }
}