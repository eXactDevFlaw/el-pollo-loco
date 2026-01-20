/**
 * Coin-Klasse - Sammelbare Münze
 * Erscheint an zufälligen Positionen im Level
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
     * Erstellt eine neue Münze an zufälliger Position
     */
    constructor() {
        super();
        this.loadImage('./img/8_coin/coin_1.png');
        this.loadImages(this.IMAGES_COIN)
        this.x = 250 + Math.round(Math.random() * 1900);
        this.y = 100 + Math.round(Math.random() * 200);
        this.animate();
    };

    /**
     * Startet die Animation der Münze
     */
    animate() {
        setStoppableInterval(() => {
            this.playAnimation(this.IMAGES_COIN);
        }, 200);
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
    };
}