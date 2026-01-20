/**
 * Level-Klasse
 * Definiert ein Spiel-Level mit allen Enemies, Objekten und Hintergründen
 */
class Level {
    enemies;
    clouds;
    backgroundObjects;
    level_end_x = 2200;
    coins;
    flasks;

    /**
     * Erstellt ein neues Level
     * @param {Array} enemies - Array mit allen Enemies
     * @param {Array} clouds - Array mit allen Wolken
     * @param {Array} backgroundObjects - Array mit allen Hintergrund-Objekten
     * @param {Array} coins - Array mit allen Münzen
     * @param {Array} flasks - Array mit allen Flaschen
     */
    constructor(enemies, clouds, backgroundObjects, coins, flasks) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.flasks = flasks;
    }
}