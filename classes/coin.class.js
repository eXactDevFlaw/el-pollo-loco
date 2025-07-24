class Coin extends DrawableObjects {
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
        this.height = 120;
        this.width = 120;
    }
}