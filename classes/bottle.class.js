class Bottle extends DrawableObjects {
    IMAGES_BOTTLE = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
    ];

    constructor() {
        super();
        let randomNumber = Math.trunc(Math.random() * 2);
        this.loadImage(this.IMAGES_BOTTLE[randomNumber]);
        
        this.x = Math.trunc((Math.random() * 2000) + 100);
        this.y = 380;
        this.height = 70;
        this.width = 60;
    }
}