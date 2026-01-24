/**
 * Defines a game level with all enemies, objects and backgrounds
 */
class Level {
    enemies;
    clouds;
    backgroundObjects;
    level_end_x = 2200;
    coins;
    flasks;

    /**
     * Creates a new level
     * @param {Array} enemies - Array of all enemies
     * @param {Array} clouds - Array of all clouds
     * @param {Array} backgroundObjects - Array of all background objects
     * @param {Array} coins - Array of all coins
     * @param {Array} flasks - Array of all flasks
     */
    constructor(enemies, clouds, backgroundObjects, coins, flasks) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.flasks = flasks;
    }
}