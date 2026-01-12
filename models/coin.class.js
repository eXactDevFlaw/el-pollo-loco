class Coin extends DrawableObject {
    width = 150;
    height = 150;

    offsetHitbox = {
        top: 40,
        left: 40,
        right: 40,
        bottom: 40,
    };

    IMAGES_COIN = [
        './img/8_coin/coin_1.png',
        './img/8_coin/coin_2.png',
    ];

    constructor(){
        super();
        this.loadImage('./img/8_coin/coin_1.png');
        this.loadImages(this.IMAGES_COIN)
        this.x = 250 + Math.round(Math.random() * 1900);
        this.y = 100 + Math.round(Math.random() * 200);
        this.animate();
    };

    animate(){
        setInterval(() => {
            this.playAnimation(this.IMAGES_COIN);
        }, 200);
    }

    playAnimation(images){
        let index = this.currentImage % images.length;
        let path = images[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    };
}