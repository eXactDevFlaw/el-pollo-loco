/**
 * Flask-Klasse - Sammelbare Flasche
 * Wird verwendet als Munition für Wurfattacken
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
     * Erstellt eine neue Flasche an zufälliger Position
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
     * Startet die Animation der Flasche
     */
    animate() {
        setStoppableInterval(() => {
            this.playAnimation(this.IMAGES_FLASK);
        }, 300);
    }

    /**
     * Spielt eine Animation ab
     * @param {string[]} images - Array mit Bildpfaden
     */
    playAnimation(images) {
        let index = this.currentImage % images.length;
        let path = images[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}