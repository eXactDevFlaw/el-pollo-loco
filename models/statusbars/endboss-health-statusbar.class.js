class EndbossHealthStatusBar extends StatusBar {
    x = 20;
    y = 0;
    width = 200;
    height = 60;
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
}