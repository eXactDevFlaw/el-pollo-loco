class Level {
    enemies;
    clouds;
    backgroundObjects;
    level_end_x = 2200;
    coins;
    flasks;

    constructor(enemies, clouds, backgroundObjects, coins, flasks) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.flasks = flasks;
    }
}