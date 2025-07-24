class Coin extends DrawableObjects {
    height = 120;
    width = 120;

    hitboxOffsetX = 20;
    hitboxOffsetY = 20;
    hitboxWidth = 80;
    hitboxHeight = 80;

    IMAGES_COINS = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    constructor() {
        super();
        let randomNumber = Math.trunc(Math.random() * 2);
        this.loadImage(this.IMAGES_COINS[randomNumber]);

        this.x = (Math.random() * 2000) + 200;
        this.y = (Math.random() * 260) + 80;
    }
}