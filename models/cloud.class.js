/**
 * Wolke im Hintergrund
 */
class Cloud extends MovableObject {
    y = 20;
    height = 250;
    width = 500;

    /**
     * Erstellt eine neue Wolke an zufälliger Position
     */
    constructor() {
        super();
        this.loadImage('./img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 500;

        this.animate();
    }

    /**
     * Startet die Bewegung der Wolke
     */
    animate() {
        setStoppableInterval(() => {
            this.moveLeft();
        }, 75)
    }
}