class Flask extends DrawableObject {
    width = 80;
    height = 80;

    offsetHitbox = {
        top: 10,
        left: 10,
        right: 10,
        bottom: 10
    };

    IMAGES_FLASK = [
        './img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        './img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    constructor() {
        super();
        this.loadImage('./img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.loadImages(this.IMAGES_FLASK);
        this.x = 250 + Math.round(Math.random() * 1900);
        this.y = 360
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_FLASK);
        }, 300);
    }

    playAnimation(images) {
        let index = this.currentImage % images.length;
        let path = images[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}