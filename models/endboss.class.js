/**
 * Endboss-Klasse - Der finale Gegner des Spiels
 * Ein großes Hühnchen mit mehreren Animationsphasen (Alert, Walk, Attack, Hurt, Dead)
 * Aktiviert sich wenn der Character nahe genug kommt
 * @extends MovableObject
 */
class Endboss extends MovableObject {
    /** @type {number} Höhe des Endbosses in Pixel */
    height = 400;

    /** @type {number} Breite des Endbosses in Pixel */
    width = 250;

    /** @type {number} Y-Position (vertikal) */
    y = 60;

    /** @type {number} X-Position (horizontal) - Spawnt am Ende des Levels */
    x = 2400;

    /** @type {number} Lebenspunkte des Endbosses (0-100) */
    energy = 100;

    /** @type {number} Bewegungsgeschwindigkeit */
    speed = 2;

    /**
     * Hitbox-Offsets für präzisere Kollisionserkennung
     * @type {Object}
     */
    offsetHitbox = {
        top: 100,
        left: 30,
        right: 30,
        bottom: 30
    }

    /**
     * Bilder für die Walk-Animation
     * @type {string[]}
     */
    IMAGES_WALK = [
        './img/4_enemie_boss_chicken/1_walk/G1.png',
        './img/4_enemie_boss_chicken/1_walk/G2.png',
        './img/4_enemie_boss_chicken/1_walk/G3.png',
        './img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    /**
     * Bilder für die Alert-Animation
     * @type {string[]}
     */
    IMAGES_ALERT = [
        './img/4_enemie_boss_chicken/2_alert/G5.png',
        './img/4_enemie_boss_chicken/2_alert/G6.png',
        './img/4_enemie_boss_chicken/2_alert/G7.png',
        './img/4_enemie_boss_chicken/2_alert/G8.png',
        './img/4_enemie_boss_chicken/2_alert/G9.png',
        './img/4_enemie_boss_chicken/2_alert/G10.png',
        './img/4_enemie_boss_chicken/2_alert/G11.png',
        './img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    /**
     * Bilder für die Attack-Animation
     * @type {string[]}
     */
    IMAGES_ATTACK = [
        './img/4_enemie_boss_chicken/3_attack/G13.png',
        './img/4_enemie_boss_chicken/3_attack/G14.png',
        './img/4_enemie_boss_chicken/3_attack/G15.png',
        './img/4_enemie_boss_chicken/3_attack/G16.png',
        './img/4_enemie_boss_chicken/3_attack/G17.png',
        './img/4_enemie_boss_chicken/3_attack/G18.png',
        './img/4_enemie_boss_chicken/3_attack/G19.png',
        './img/4_enemie_boss_chicken/3_attack/G20.png',
    ];

    /**
     * Bilder für die Hurt-Animation
     * @type {string[]}
     */
    IMAGES_HURT = [
        './img/4_enemie_boss_chicken/4_hurt/G21.png',
        './img/4_enemie_boss_chicken/4_hurt/G22.png',
        './img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    /**
     * Bilder für die Death-Animation
     * @type {string[]}
     */
    IMAGES_DEAD = [
        './img/4_enemie_boss_chicken/5_dead/G24.png',
        './img/4_enemie_boss_chicken/5_dead/G25.png',
        './img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    /**
     * Flag ob der Endboss bereits aktiviert wurde
     * @type {boolean}
     */
    hadFirstContact = false;

    /**
     * Erstellt einen neuen Endboss
     * Lädt alle Animations-Bilder und startet die Animation
     */
    constructor() {
        super();
        this.loadImage('./img/4_enemie_boss_chicken/2_alert/G5.png');
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_WALK);
        this.animate();
    }

    /**
     * Verwaltet alle Animationen und Bewegung des Endbosses
     */
    animate() {
        setStoppableInterval(() => {
            if (this.hadFirstContact && this.energy > 0) {
                this.moveLeft();
            }
        }, 1000 / 60);

        setStoppableInterval(() => {
            if (this.energy == 0) {
                this.speed = 0;
                this.playAnimationOnce(this.IMAGES_DEAD);
                return;
            }

            if (this.isHurt()) {
                this.playAnimationOnce(this.IMAGES_HURT);
                return;
            }

            if (this.isColliding(world.character)) {
                this.playAnimation(this.IMAGES_ATTACK);
                return;
            }

            if (this.hadFirstContact) {
                this.playAnimation(this.IMAGES_WALK);
            } else {
                this.playAnimation(this.IMAGES_ALERT);
            }

            if (world.character.x > 2000 && !this.hadFirstContact) {
                this.hadFirstContact = true;
            }
        }, 200);
    }
}