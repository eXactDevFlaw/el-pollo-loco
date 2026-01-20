/**
 * BackgroundObject-Klasse - Hintergrund-Layer
 * Wird verwendet für Parallax-Scrolling Effekt
 */
class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;

    /**
     * Erstellt ein neues Hintergrund-Objekt
     * @param {string} imagePath - Pfad zum Hintergrundbild
     * @param {number} x - X-Position
     */
    constructor(imagePath, x){
        super()
        this.loadImage(imagePath)
        this.x = x;
        this.y = 480 - this.height;
    }
}