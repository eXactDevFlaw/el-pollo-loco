class Cloud extends MovableObject {
    y = 20;
    height = 300;
    width = 1500;

    IMAGES_CLOUDS = [
        'img/5_background/layers/4_clouds/1.png',
        'img/5_background/layers/4_clouds/2.png'
    ]

    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/full.png');
        this.loadImages(this.IMAGES_CLOUDS);
        this.x = (Math.random() * 500);
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 50)
    }
}