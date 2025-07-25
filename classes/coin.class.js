/**
 * Represents a collectible coin in the game.
 * @extends DrawableObjects
 */
class Coin extends DrawableObjects {
    height = 120;
    width = 120;

    hitboxOffsetX = 40;
    hitboxOffsetY = 40;
    hitboxWidth = 40;
    hitboxHeight = 40;

    IMAGES_COINS = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    /**
     * Creates a new Coin at a random position.
     */
    constructor() {
        super();
        let randomNumber = Math.trunc(Math.random() * 2);
        this.loadImage(this.IMAGES_COINS[randomNumber]);
        this.x = (Math.random() * 2000) + 200;
        this.y = (Math.random() * 260) + 80;
    }
}