class EndbossHealthStatusBar extends StatusBar {
    x = 400;
    y = 8;
    width = 200;
    height = 60;

    offsetX = 25;
    offsetY = -20;

    percentage = 100;

    IMAGES = [
        './img/7_statusbars/2_statusbar_endboss/green/green0.png',
        './img/7_statusbars/2_statusbar_endboss/green/green20.png',
        './img/7_statusbars/2_statusbar_endboss/green/green40.png',
        './img/7_statusbars/2_statusbar_endboss/green/green60.png',
        './img/7_statusbars/2_statusbar_endboss/green/green80.png',
        './img/7_statusbars/2_statusbar_endboss/green/green100.png',
    ]

    constructor() {
        super();
        this.loadImage(this.IMAGES[5]);
        this.loadImages(this.IMAGES);
        this.setPercentage(this.percentage)
    }

    updatePosition(endboss){
        this.x = endboss.x + this.offsetX;
        this.y = endboss.y + this.offsetY;
    }
}