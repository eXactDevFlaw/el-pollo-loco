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
     * Großes Offset oben wegen Kamm/Kopf des Huhns
     * @type {Object}
     */
    offsetHitbox = {
        top: 100,
        left: 30,
        right: 30,
        bottom: 30
    }

    /**
     * Bilder für die Walk-Animation (Lauf-Bewegung)
     * @type {string[]}
     */
    IMAGES_WALK = [
        './img/4_enemie_boss_chicken/1_walk/G1.png',
        './img/4_enemie_boss_chicken/1_walk/G2.png',
        './img/4_enemie_boss_chicken/1_walk/G3.png',
        './img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    /**
     * Bilder für die Alert-Animation (Wachsam/Wartend)
     * Wird abgespielt bevor der Character nahe genug kommt
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
     * Bilder für die Attack-Animation (Angriff)
     * Wird bei Kollision mit dem Character abgespielt
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
     * Bilder für die Hurt-Animation (Verletzt)
     * Wird abgespielt wenn Endboss Schaden nimmt
     * Endboss stoppt Bewegung während dieser Animation
     * @type {string[]}
     */
    IMAGES_HURT = [
        './img/4_enemie_boss_chicken/4_hurt/G21.png',
        './img/4_enemie_boss_chicken/4_hurt/G22.png',
        './img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    /**
     * Bilder für die Death-Animation (Tod)
     * Wird einmal abgespielt wenn energy auf 0 fällt
     * @type {string[]}
     */
    IMAGES_DEAD = [
        './img/4_enemie_boss_chicken/5_dead/G24.png',
        './img/4_enemie_boss_chicken/5_dead/G25.png',
        './img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    /**
     * Flag ob der Endboss bereits aktiviert wurde
     * Wird auf true gesetzt wenn Character x > 1950 erreicht
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
     * Nutzt zwei separate Intervals:
     * - Bewegung: 60 FPS für flüssige Bewegung
     * - Animation: 200ms pro Frame für langsame, schwere Bewegung
     * 
     * Animations-Priorität:
     * 1. Death (höchste Priorität, stoppt alles andere)
     * 2. Hurt (stoppt Bewegung temporär)
     * 3. Attack (bei Kollision mit Character)
     * 4. Walk (nach erstem Kontakt)
     * 5. Alert (vor erstem Kontakt)
     */
    animate() {
        // Bewegungs-Loop (60 FPS) - Nur nach erstem Kontakt und wenn lebend
        setStoppableInterval(() => {
            // Bewegung nur wenn: Aktiviert UND Lebend UND NICHT verletzt
            if (this.hadFirstContact && this.energy > 0) {
                this.moveLeft();
            }
        }, 1000 / 60);

        // Animations-Loop (200ms pro Frame) - Langsam für schweren Boss
        setStoppableInterval(() => {
            // Death-Animation (nur einmal abspielen) - Höchste Priorität
            if (this.energy == 0) {
                this.speed = 0;
                this.playAnimationOnce(this.IMAGES_DEAD);
                return; // Stoppt alle weiteren Animationen
            }

            // Hurt-Animation - Zweithöchste Priorität (stoppt Bewegung)
            if (this.isHurt()) {
                this.playAnimationOnce(this.IMAGES_HURT);
                return; // Stoppt Attack/Walk/Alert Animation
            }

            // Attack-Animation bei Kollision - Dritthöchste Priorität
            if (this.isColliding(world.character)) {
                this.playAnimation(this.IMAGES_ATTACK);
                return; // Stoppt Walk/Alert Animation
            }

            // Walking-Animation nach erstem Kontakt
            if (this.hadFirstContact) {
                this.playAnimation(this.IMAGES_WALK);
            } else {
                // Alert-Animation vor erstem Kontakt
                this.playAnimation(this.IMAGES_ALERT);
            }

            // Aktiviere Endboss wenn Character nah genug ist
            if (world.character.x > 2000 && !this.hadFirstContact) {
                this.hadFirstContact = true;
            }
        }, 200);
    }
}