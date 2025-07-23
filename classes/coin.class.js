class Coin extends DrawableObjects {
    IMAGES_COINS = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    constructor() {
        super();
        let randomNumber = Math.trunc(Math.random() * 2);
        this.loadImage(this.IMAGES_COINS[randomNumber]);
        
        this.x = Math.trunc((Math.random() * 2000) + 100);

        this.y = 380;
        this.height = 70;
        this.width = 60;
    }
}