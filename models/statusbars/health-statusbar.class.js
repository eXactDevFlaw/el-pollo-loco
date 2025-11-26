class HealthStatusBar extends StatusBar {
    x = 10;
    y = 0;
    width = 200;
    height = 60;
    percentage = 100;

    IMAGES = [
        '../img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        '../img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        '../img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        '../img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        '../img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        '../img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png',
    ]

    constructor() {
        super();
        this.loadImage(this.IMAGES[5]);
        this.loadImages(this.IMAGES);
        this.setPercentage(this.percentage)
    }
}