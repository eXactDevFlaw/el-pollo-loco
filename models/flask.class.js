/**
 * Collectable bottle as ammunition for throwing attacks
 */
class Flask extends DrawableObject {
    width = 80;
    height = 80;

    offsetHitbox = {
        top: 20,
        left: 20,
        right: 20,
        bottom: 20
    };

    IMAGES_FLASK = [
        './img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        './img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    /**
     * Creates a new flask at random position
     */
    constructor() {
        super();
        this.loadImage('./img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.loadImages(this.IMAGES_FLASK);
        this.x = 250 + Math.round(Math.random() * 1900);
        this.y = 360
        this.animate();
    }

    /**
     * Starts flask animation
     */
    animate() {
        setStoppableInterval(() => {
            this.playAnimation(this.IMAGES_FLASK);
        }, 300);
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