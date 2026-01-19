/**
 * Character-Klasse - Der spielbare Hauptcharacter
 * Verwaltet alle Animationen, Bewegungen und States des Spielers
 * @extends MovableObject
 */
class Character extends MovableObject {
  height = 280;
  y = 160;
  speed = 10;

  /**
   * Hitbox-Offsets für präzisere Kollisionserkennung
   * @type {Object}
   */
  offsetHitbox = {
    top: 120,
    left: 30,
    right: 40,
    bottom: 30,
  };

  /**
   * Bilder für die Walk-Animation
   * @type {string[]}
   */
  IMAGES_WALK = [
    "./img/2_character_pepe/2_walk/W-21.png",
    "./img/2_character_pepe/2_walk/W-22.png",
    "./img/2_character_pepe/2_walk/W-23.png",
    "./img/2_character_pepe/2_walk/W-24.png",
    "./img/2_character_pepe/2_walk/W-25.png",
    "./img/2_character_pepe/2_walk/W-26.png",
  ];

  /**
   * Bilder für die Jump-Animation
   * @type {string[]}
   */
  IMAGES_JUMP = [
    "./img/2_character_pepe/3_jump/J-31.png",
    "./img/2_character_pepe/3_jump/J-32.png",
    "./img/2_character_pepe/3_jump/J-33.png",
    "./img/2_character_pepe/3_jump/J-34.png",
  ];

  /**
   * Bild für die Peak-Animation (höchster Punkt des Sprungs)
   * @type {string[]}
   */
  IMAGES_PEAK = ["./img/2_character_pepe/3_jump/J-35.png"];

  /**
   * Bilder für die Fall-Animation
   * @type {string[]}
   */
  IMAGES_FALL = [
    "./img/2_character_pepe/3_jump/J-36.png",
    "./img/2_character_pepe/3_jump/J-37.png",
    "./img/2_character_pepe/3_jump/J-38.png",
    "./img/2_character_pepe/3_jump/J-39.png",
  ];

  /**
   * Bilder für die Death-Animation
   * @type {string[]}
   */
  IMAGES_DEAD = [
    "./img/2_character_pepe/5_dead/D-51.png",
    "./img/2_character_pepe/5_dead/D-52.png",
    "./img/2_character_pepe/5_dead/D-53.png",
    "./img/2_character_pepe/5_dead/D-54.png",
    "./img/2_character_pepe/5_dead/D-55.png",
    "./img/2_character_pepe/5_dead/D-56.png",
    "./img/2_character_pepe/5_dead/D-57.png",
  ];

  /**
   * Bilder für die Hurt-Animation
   * @type {string[]}
   */
  IMAGES_HURT = [
    "./img/2_character_pepe/4_hurt/H-41.png",
    "./img/2_character_pepe/4_hurt/H-42.png",
    "./img/2_character_pepe/4_hurt/H-43.png",
  ];

  /**
   * Bilder für die Idle-Animation (kurz)
   * @type {string[]}
   */
  IMAGES_IDLE = [
    './img/2_character_pepe/1_idle/idle/I-1.png',
    './img/2_character_pepe/1_idle/idle/I-2.png',
    './img/2_character_pepe/1_idle/idle/I-3.png',
    './img/2_character_pepe/1_idle/idle/I-4.png',
    './img/2_character_pepe/1_idle/idle/I-5.png',
    './img/2_character_pepe/1_idle/idle/I-6.png',
    './img/2_character_pepe/1_idle/idle/I-7.png',
    './img/2_character_pepe/1_idle/idle/I-8.png',
    './img/2_character_pepe/1_idle/idle/I-9.png',
    './img/2_character_pepe/1_idle/idle/I-10.png',
  ];

  /**
   * Bilder für die Idle-Long-Animation (nach längerem Stillstand)
   * @type {string[]}
   */
  IMAGES_IDLE_LONG = [
    './img/2_character_pepe/1_idle/long_idle/I-11.png',
    './img/2_character_pepe/1_idle/long_idle/I-12.png',
    './img/2_character_pepe/1_idle/long_idle/I-13.png',
    './img/2_character_pepe/1_idle/long_idle/I-14.png',
    './img/2_character_pepe/1_idle/long_idle/I-15.png',
    './img/2_character_pepe/1_idle/long_idle/I-16.png',
    './img/2_character_pepe/1_idle/long_idle/I-17.png',
    './img/2_character_pepe/1_idle/long_idle/I-18.png',
    './img/2_character_pepe/1_idle/long_idle/I-19.png',
    './img/2_character_pepe/1_idle/long_idle/I-20.png',
  ];

  /**
   * Referenz zur World-Instanz
   * @type {World}
   */
  world;

  /**
   * Aktueller Animations-State des Characters
   * @type {string}
   */
  currentState = "idle";

  /**
   * Zeitstempel wann Character zuletzt idle wurde
   * Wird verwendet um den Wechsel zu idle_long zu bestimmen
   * @type {number}
   */
  idleStartTime = 0;

  /**
   * Zeit in Millisekunden bis idle_long Animation startet
   * @type {number}
   */
  idleLongDelay = 5000; // 5 Sekunden

  /**
   * Anzahl gesammelter Münzen
   * @type {number}
   */
  collectedCoins = 0;

  /**
   * Anzahl gesammelter Flaschen
   * @type {number}
   */
  collectedFlasks = 0;

  /**
   * Erstellt einen neuen Character
   * Lädt alle Bilder und startet Animationen
   */
  constructor() {
    super();
    this.loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImages(this.IMAGES_WALK);
    this.loadImages(this.IMAGES_JUMP);
    this.loadImages(this.IMAGES_PEAK);
    this.loadImages(this.IMAGES_FALL);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_IDLE_LONG);

    this.animate();
    this.applyGravity();
  }

  /**
   * Startet alle Animations- und Bewegungs-Loops
   * Initialisiert Movement und Animation-Handler
   */
  animate() {
    this.handleMovement();
    this.handleAnimations();
  }

  /**
   * Verwaltet die Character-Bewegung basierend auf Keyboard-Input
   * Kamera folgt sanft mit Interpolation
   */
  handleMovement() {
    setStoppableInterval(() => {
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.moveRight();
        this.otherDirection = false;
      }
      if (this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft();
        this.otherDirection = true;
      }

      if (this.world.keyboard.SPACE && !this.isAboveGround()) {
        this.jump();
      }

      this.updateCameraSmooth();
    }, 1000 / 60);
  }

  /**
   * Aktualisiert die Kamera-Position mit sanfter Interpolation
   * Kamera bewegt sich langsam zur Ziel-Position
   * Nach links: Character weiter rechts (mehr Sicht links)
   * Nach rechts: Character weiter links (mehr Sicht rechts)
   */
  updateCameraSmooth() {
    // Ziel-Offset basierend auf Blickrichtung
    let targetOffset = this.otherDirection ? 300 : 100;
    let targetCameraX = -this.x + targetOffset;

    // Sanfte Interpolation (Lerp) - 10% pro Frame
    let smoothSpeed = 0.075;
    this.world.camera_x += (targetCameraX - this.world.camera_x) * smoothSpeed;
  }

  /**
   * Verwaltet alle Animations-States des Characters
   * Nutzt unterschiedliche Geschwindigkeiten für verschiedene Animationen:
   * - Normale Animationen: 50ms
   * - Sprung-Animationen: 150ms
   * - Idle-Animationen: 200ms (langsamer für ruhigere Bewegung)
   */
  handleAnimations() {
    // Schnelle Animationen (50ms) - für die meisten States
    setStoppableInterval(() => {
      let newState = this.determineState();

      if (newState !== this.currentState) {
        this.changeState(newState);
      }

      // Alle States außer jump/peak/fall/idle/idle_long
      if (!["jump", "peak", "fall", "idle", "idle_long"].includes(this.currentState)) {
        this.playCurrentStateAnimation();
      }
    }, 50);

    // Jump/Fall Animationen (150ms) - Mittlere Geschwindigkeit
    setStoppableInterval(() => {
      if (["jump", "peak", "fall"].includes(this.currentState)) {
        this.playCurrentStateAnimation();
      }
    }, 150);

    // Idle Animationen (200ms) - Langsamer für ruhigere Bewegung
    setStoppableInterval(() => {
      if (["idle", "idle_long"].includes(this.currentState)) {
        this.playCurrentStateAnimation();
      }
    }, 200);
  }

  /**
   * Bestimmt den aktuellen State des Characters basierend auf:
   * - Lebensstatus (tot/verletzt)
   * - Position (in der Luft/am Boden)
   * - Bewegung (laufend/stillstehend)
   * Resettet den Idle-Timer bei Bewegung oder Sprüngen
   * @returns {string} Der neue State
   */
  determineState() {
    if (this.isDead()) return "dead";
    if (this.isHurt()) return "hurt";

    if (this.isAboveGround()) {
      // Reset idle timer wenn in der Luft
      this.idleStartTime = 0;

      if (this.speedY > 15) return "jump";
      if (this.speedY > -5) return "peak";
      return "fall";
    }

    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      // Reset idle timer wenn Character sich bewegt
      this.idleStartTime = 0;
      return "walk";
    }

    // Character steht still → Idle-Logik
    return this.determineIdleState();
  }

  /**
   * Bestimmt ob idle oder idle_long angezeigt werden soll
   * Misst die Zeit seit dem letzten Stillstand
   * Wechselt zu idle_long nach Ablauf von idleLongDelay
   * @returns {string} "idle" oder "idle_long"
   */
  determineIdleState() {
    const now = Date.now();

    // Setze Start-Zeit beim ersten Mal idle
    if (this.idleStartTime === 0) {
      this.idleStartTime = now;
      return "idle";
    }

    // Berechne wie lange Character bereits idle ist
    const idleDuration = now - this.idleStartTime;

    // Wechsel zu idle_long nach X Sekunden
    if (idleDuration >= this.idleLongDelay) {
      return "idle_long";
    }

    return "idle";
  }

  /**
   * Wechselt den State und setzt die Animation zurück
   * @param {string} newState - Der neue State (z.B. "walk", "jump", "idle")
   */
  changeState(newState) {
    this.currentState = newState;
    this.currentImage = 0;
  }

  /**
   * Spielt die Animation des aktuellen Character-States ab
   * Nutzt playAnimationOnce für einmalige Animationen (Death, Jump, Peak, Fall)
   * Nutzt playAnimation für Loop-Animationen (Walk, Idle, Hurt)
   */
  playCurrentStateAnimation() {
    switch (this.currentState) {
      case "dead":
        this.playAnimationOnce(this.IMAGES_DEAD);
        break;
      case "hurt":
        this.playAnimation(this.IMAGES_HURT);
        break;
      case "jump":
        this.playAnimationOnce(this.IMAGES_JUMP);
        break;
      case "peak":
        this.playAnimationOnce(this.IMAGES_PEAK);
        break;
      case "fall":
        this.playAnimationOnce(this.IMAGES_FALL);
        break;
      case "walk":
        this.playAnimation(this.IMAGES_WALK);
        break;
      case "idle":
        this.playAnimation(this.IMAGES_IDLE);
        break;
      case "idle_long":
        this.playAnimation(this.IMAGES_IDLE_LONG);
        break;
    }
  }
}