/**
 * StatusBar-Klasse - Basisklasse für alle Statusanzeigen
 * Zeigt verschiedene Zustände durch unterschiedliche Bilder an
 */
class StatusBar extends DrawableObject {
    percentage = 100;
    IMAGES = [];

    /**
     * Erstellt eine neue StatusBar
     */
    constructor() {
        super();
    }

    /**
     * Setzt den Prozentsatz und aktualisiert das angezeigte Bild
     * @param {number} percentage - Wert zwischen 0 und 100
     */
    setPercentage(percentage) {
        this.percentage = percentage
        let path = this.IMAGES[this.resolveImageIndex()]
        this.img = this.imageCache[path]
    }

    /**
     * Bestimmt welches Bild basierend auf dem Prozentsatz angezeigt werden soll
     * @returns {number} Index des zu verwendenden Bildes
     */
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}