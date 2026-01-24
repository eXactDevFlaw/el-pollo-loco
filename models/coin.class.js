/**
 * Collectable coin
 */
class Coin extends DrawableObject {
    width = 150;
    height = 150;

    offsetHitbox = {
        top: 50,
        left: 50,
        right: 50,
        bottom: 50,
    };

    IMAGES_COIN = [
        './img/8_coin/coin_1.png',
        './img/8_coin/coin_2.png',
    ];

    /**
     * Creates a new coin at random position
     */
    constructor() {
        super();
        this.loadImage('./img/8_coin/coin_1.png');
        this.loadImages(this.IMAGES_COIN)
        this.x = 250 + Math.round(Math.random() * 1900);
        this.y = 100 + Math.round(Math.random() * 200);
        this.animate();
    }

    /**
     * Starts coin animation
     */
    animate() {
        setStoppableInterval(() => {
            this.playAnimation(this.IMAGES_COIN);
        }, 200);
    }

    /**
     * Plays animation
     * @param {string[]} images - Array of image paths
     */
    playAnimation(images) {
        let index = this.currentImage % images.length;
        let path = images[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}