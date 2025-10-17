import Phaser from "phaser";

type Sector = {
  graphics: Phaser.GameObjects.Graphics;
  color: number;
  index: number;
};

/**
 * GameScene - implementa il gioco "Simon" con 4 spicchi colorati
 *
 * Disposizione (partendo da SINISTRA e procedendo in senso orario):
 * 0 = sinistra (verde)
 * 1 = sopra   (rosso)
 * 2 = destra  (giallo)
 * 3 = sotto   (blu)
 */
export default class GameScene extends Phaser.Scene {
  private centerX!: number;
  private centerY!: number;
  private radius!: number;
  private sectors: Sector[] = [];
  private sequence: number[] = [];
  private playerStep = 0;
  private acceptingInput = false;
  private infoText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private audioKeys: string[] = [];
  private audioPaths: Record<string, string> = {};

  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    // Caricamento suoni per ogni colore e il suono game over
    this.load.audio("verde", "assets/audio/verde.wav");
    this.load.audio("rosso", "assets/audio/rosso.wav");
    this.load.audio("giallo", "assets/audio/giallo.wav");
    this.load.audio("blue", "assets/audio/blue.wav");
    this.load.audio("gameover", "assets/audio/gameover.wav");
  }

  create() {
    // Centro e dimensione del Simon board
    this.centerX = 400;
    this.centerY = 260;
    this.radius = 140;

    // Sfondo semplice
    this.cameras.main.setBackgroundColor(0x222222);

    // Titolo
    this.add
      .text(400, 60, "SIMON", {
        fontSize: "48px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    // Testo informazioni (mostra messaggi come "Guarda", "Tocca", "Sbagliato")
    this.infoText = this.add
      .text(400, 430, "Premi PLAY per iniziare", {
        fontSize: "18px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // Punteggio / giro corrente: sarà mostrato nel cerchio centrale
    // formato: 01, 02, 03, ... (due cifre)
    this.scoreText = this.add
      .text(this.centerX, this.centerY, this.formatRound(0), {
        fontSize: "28px",
        color: "#ffffff",
        fontFamily: "Arial",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(5);

    // Disegno degli spicchi e loro configurazione
    // Ordine richiesto: partendo da sinistra (index 0): verde, rosso, giallo, blu
    const colors = [0x2ecc71, 0xe74c3c, 0xf1c40f, 0x3498db]; // verde, rosso, giallo, blu

    // Angoli: definiamo spicchi da 90° ciascuno.
    // Ora i bordi degli spicchi corrispondono esattamente alle due rette perpendicolari
    // (angoli: 0°, 90°, 180°, 270°). Manteniamo l'ordine logico richiesto:
    // 0 = sinistra, 1 = sopra, 2 = destra, 3 = sotto
    const sectorRanges = [
      { startDeg: 180, endDeg: 270 }, // sinistra (tra 180° e 270°)
      { startDeg: 270, endDeg: 360 }, // sopra   (tra 270° e 360°)
      { startDeg: 0, endDeg: 90 }, // destra  (tra 0° e 90°)
      { startDeg: 90, endDeg: 180 }, // sotto   (tra 90° e 180°)
    ];

    // Creiamo gli oggetti Graphics per ogni spicchio
    for (let i = 0; i < 4; i++) {
      const g = this.add.graphics({ x: 0, y: 0 });
      this.drawSector(
        g,
        this.centerX,
        this.centerY,
        this.radius,
        sectorRanges[i].startDeg,
        sectorRanges[i].endDeg,
        colors[i]
      );
      g.setDepth(1);
      this.sectors.push({ graphics: g, color: colors[i], index: i });
    }

    // Bordo esterno spesso 10px (stroke)
    const borderG = this.add.graphics();
    borderG.fillStyle(0x000000, 1);
    // Disegniamo un anello esterno: cerchio esterno meno cerchio interno
    borderG.beginPath();
    borderG.arc(
      this.centerX,
      this.centerY,
      this.radius + 10,
      0,
      Phaser.Math.DEG_TO_RAD * 360,
      false
    );
    borderG.arc(
      this.centerX,
      this.centerY,
      this.radius - 0,
      0,
      Phaser.Math.DEG_TO_RAD * 360,
      true
    );
    borderG.closePath();
    borderG.fillPath();
    borderG.setDepth(2);

    // Disegniamo due rette perpendicolari (diametri) che dividono il cerchio in 4 spicchi
    // Questo sostituisce i separatori ad arco precedenti e rappresenta esattamente "due rette
    // perpendicolari che passano per il centro" come richiesto.
    const sepLinesG = this.add.graphics();
    // linea nera più definita per contrastare i colori
    sepLinesG.lineStyle(4, 0x000000, 1);
    // orizzontale
    sepLinesG.beginPath();
    sepLinesG.moveTo(this.centerX - this.radius - 6, this.centerY);
    sepLinesG.lineTo(this.centerX + this.radius + 6, this.centerY);
    // verticale
    sepLinesG.moveTo(this.centerX, this.centerY - this.radius - 6);
    sepLinesG.lineTo(this.centerX, this.centerY + this.radius + 6);
    sepLinesG.strokePath();
    sepLinesG.setDepth(3);

    // Cerchio interno con bordo (cerchio pieno più bordo esterno dello stesso spessore)
    const innerG = this.add.graphics();
    // cerchio pieno
    innerG.fillStyle(0x111111, 1);
    innerG.fillCircle(this.centerX, this.centerY, 40);
    // bordo interno di 10px: disegno anello
    innerG.beginPath();
    innerG.arc(
      this.centerX,
      this.centerY,
      40 + 10,
      0,
      Phaser.Math.DEG_TO_RAD * 360,
      false
    );
    innerG.arc(
      this.centerX,
      this.centerY,
      40 - 0,
      0,
      Phaser.Math.DEG_TO_RAD * 360,
      true
    );
    innerG.closePath();
    innerG.fillPath();
    innerG.setDepth(4);

    // Il testo centrale (mostra il punteggio) è già stato creato sopra come this.scoreText

    // Mappatura chiavi audio (indice -> key)
    this.audioKeys = ["verde", "rosso", "giallo", "blue"];
    // mappatura chiave -> percorso (usata dal fallback HTMLAudio)
    this.audioPaths = {
      verde: "assets/audio/verde.wav",
      rosso: "assets/audio/rosso.wav",
      giallo: "assets/audio/giallo.wav",
      blue: "assets/audio/blue.wav",
      gameover: "assets/audio/gameover.wav",
    };

    // Cerchio centrale (estetico) sopra gli spicchi
    this.add.circle(this.centerX, this.centerY, 40, 0x111111).setDepth(2);
    // Il testo centrale è this.scoreText (depth 5) e cadrà visivamente sopra il cerchio

    // Input: ascoltiamo pointerdown su tutta la scena e decidiamo quale spicchio è stato premuto
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (!this.acceptingInput) return;
      const sectorIndex = this.getSectorIndexFromPointer(pointer);
      if (sectorIndex === -1) return; // clic fuori dal cerchio
      this.handlePlayerTap(sectorIndex);
    });

    // Non partiamo automaticamente: creiamo il pulsante PLAY
    this.createPlayButton();
    this.sequence = [];

    // Espone la scena globalmente per debug (usa in console: gameScene)
    (window as any).gameScene = this;
  }

  /**
   * createPlayButton()
   * - crea un pulsante estetico con bordi stondati che avvia il gioco
   */
  private createPlayButton() {
    const px = this.centerX;
    const py = this.centerY + this.radius + 70; // spostato più in basso rispetto al cerchio
    const width = 160; // ridotto
    const height = 48; // ridotto
    const radius = 14;

    // Graphics per il pulsante (rounded)
    const g = this.add.graphics();
    // colore di base
    const baseColor = 0x8e44ad; // viola
    g.fillStyle(baseColor, 1);
    g.fillRoundedRect(px - width / 2, py - height / 2, width, height, radius);
    // bordo leggero
    g.lineStyle(2, 0xffffff, 0.08);
    g.strokeRoundedRect(px - width / 2, py - height / 2, width, height, radius);

    // mettiamo il pulsante in primo piano
    g.setDepth(10);

    // Testo del pulsante
    const txt = this.add
      .text(px, py, "PLAY", {
        fontSize: "22px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);
    txt.setDepth(11);

    // Un rettangolo invisibile per l'interazione (hit area)
    const hit = this.add
      .rectangle(px, py, width, height, 0x000000, 0)
      .setInteractive({ useHandCursor: true });
    hit.setDepth(12);

    // Hover effect
    hit.on("pointerover", () => g.setAlpha(0.85));
    hit.on("pointerout", () => g.setAlpha(1));

    // Click: avvia primo round
    hit.on("pointerdown", async () => {
      console.log("PLAY button clicked");
      // disabilita interazione
      hit.disableInteractive();
      // play rapido per sbloccare eventuale autoplay policy del browser
      this.playSound("rosso");
      // piccolo effetto di click
      this.tweens.add({
        targets: [g, txt],
        scaleX: 0.98,
        scaleY: 0.98,
        duration: 80,
        yoyo: true,
      });
      this.infoText.setText("Guarda la sequenza...");
      await this.delay(200);
      // avvia il gioco
      console.log("calling startNewRound from PLAY");
      this.startNewRound();
    });
  }

  /**
   * drawSector(graphics, cx, cy, radius, startDeg, endDeg, color)
   * - disegna sul GameObject Graphics uno spicchio circolare tra startDeg ed endDeg (in gradi).
   * - gestisce il caso di wrap-around (es: 315 -> 45).
   */
  private drawSector(
    graphics: Phaser.GameObjects.Graphics,
    cx: number,
    cy: number,
    radius: number,
    startDeg: number,
    endDeg: number,
    color: number
  ) {
    graphics.clear();
    graphics.fillStyle(color, 1);
    graphics.beginPath();

    // converti in radianti
    const startRad = Phaser.Math.DegToRad(startDeg);
    const endRad = Phaser.Math.DegToRad(endDeg);

    graphics.moveTo(cx, cy);
    // Se il settore non ha wrap
    if (startDeg < endDeg) {
      graphics.arc(cx, cy, radius, startRad, endRad, false);
    } else {
      // wrap-around: disegniamo in due pezzi (start..360 e 0..end)
      graphics.arc(cx, cy, radius, startRad, Phaser.Math.DegToRad(360), false);
      graphics.arc(cx, cy, radius, 0, endRad, false);
    }
    graphics.closePath();
    graphics.fillPath();
  }

  /**
   * getSectorIndexFromPointer(pointer)
   * - calcola quale spicchio è stato cliccato in base alla posizione del pointer rispetto al centro.
   * - ritorna -1 se il click è fuori dal raggio.
   */
  private getSectorIndexFromPointer(pointer: Phaser.Input.Pointer): number {
    const dx = pointer.x - this.centerX;
    const dy = pointer.y - this.centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > this.radius) return -1; // fuori dal cerchio

    let angleDeg = Phaser.Math.RadToDeg(Math.atan2(dy, dx)); // [-180,180], 0=destra, positivo verso il basso
    if (angleDeg < 0) angleDeg += 360; // ora in [0,360)

    // Mappatura precisa coerente con i sectorRanges definiti sopra:
    // sectorRanges (ordine):
    // 0 = sinistra: 180 .. 270
    // 1 = sopra:    270 .. 360
    // 2 = destra:   0 .. 90
    // 3 = sotto:    90 .. 180
    if (angleDeg >= 180 && angleDeg < 270) return 0;
    if (angleDeg >= 270 && angleDeg < 360) return 1;
    if (angleDeg >= 0 && angleDeg < 90) return 2;
    if (angleDeg >= 90 && angleDeg < 180) return 3;

    return -1;
  }

  /**
   * flashSector(index, duration)
   * - anima rapidamente lo spicchio (aumenta alpha o cambia lucentezza) per playback/feedback.
   */
  private async flashSector(index: number, duration = 400) {
    const sector = this.sectors[index];
    if (!sector) return;

    // suono associato allo spicchio
    const key = this.audioKeys[index];
    if (key && this.sound.get(key) == null) {
      // se non è già in cache (get ritorna undefined se non esiste) proviamo a suonare comunque
      // ma preferiamo usare this.sound.play che ignora se il file non è caricato?
    }
    if (key) this.playSound(key);

    await new Promise<void>((resolve) => {
      this.tweens.add({
        targets: sector.graphics,
        alpha: { from: 1, to: 0.35 },
        duration: duration / 2,
        yoyo: true,
        onComplete: () => resolve(),
      });
    });
  }

  /**
   * startNewRound()
   * - aggiunge un nuovo passo alla sequenza e riproduce tutta la sequenza (playback).
   */
  private startNewRound() {
    // aggiungi un nuovo elemento random alla sequenza
    const next = Phaser.Math.Between(0, 3);
    this.sequence.push(next);
    this.playerStep = 0;
    this.acceptingInput = false;
    // aggiorniamo il testo centrale con il formato a 2 cifre
    this.scoreText.setText(this.formatRound(this.sequence.length));
    this.infoText.setText("Guarda la sequenza...");
    this.playbackSequence();
  }

  /**
   * playbackSequence()
   * - riproduce visivamente la sequenza con delay tra i flash.
   */
  private async playbackSequence() {
    // piccolo delay iniziale
    await this.delay(400);

    for (let i = 0; i < this.sequence.length; i++) {
      const idx = this.sequence[i];
      await this.flashSector(idx, 350);
      await this.delay(200);
    }

    // ora accettiamo input
    this.infoText.setText("Tocca gli spicchi nella stessa sequenza");
    this.acceptingInput = true;
  }

  /**
   * handlePlayerTap(index)
   * - gestisce l'input del giocatore, confronta con la sequenza e decide successo/errore.
   */
  private async handlePlayerTap(index: number) {
    if (!this.acceptingInput) return;

    // Feedback immediato del tap (suono + flash)
    if (this.audioKeys[index]) this.playSound(this.audioKeys[index]);
    this.flashSector(index, 200);

    // Controllo
    if (index === this.sequence[this.playerStep]) {
      this.playerStep++;
      // Se il giocatore ha completato la sequenza correttamente
      if (this.playerStep >= this.sequence.length) {
        this.acceptingInput = false;
        this.infoText.setText("Ben fatto! Preparando il prossimo round...");
        await this.delay(700);
        this.startNewRound();
      }
    } else {
      // Errore: passiamo alla scena della classifica per salvare/mostrare i migliori
      this.acceptingInput = false;
      this.infoText.setText("Sbagliato!");
      // suono di game over
      this.playSound("gameover");
      await this.showFailure();

      // calcoliamo il punteggio raggiunto (turno a cui è arrivato): sequence.length
      const achieved = this.sequence.length;

      // avvia la scena leaderboard passando il punteggio
      console.log("GameScene: achieved score before leaderboard:", achieved);
      this.scene.start("LeaderboardScene", { score: achieved });
    }
  }

  /**
   * showFailure()
   * - animazione visiva di errore: lampeggia gli spicchi in rosso scuro rapidamente.
   */
  private async showFailure() {
    // versione semplice: strobe degli alpha
    for (let i = 0; i < 3; i++) {
      this.sectors.forEach((s) => s.graphics.setAlpha(0.2));
      await this.delay(120);
      this.sectors.forEach((s) => s.graphics.setAlpha(1));
      await this.delay(120);
    }
  }

  private delay(ms: number) {
    return new Promise((resolve) => this.time.delayedCall(ms, resolve));
  }

  update() {
    // non usato per ora, ma utile per future animazioni
  }

  /**
   * playSound(key)
   * - tenta di riprodurre un suono tramite Phaser Sound, altrimenti usa HTMLAudio come fallback
   */
  private playSound(key: string) {
    // Controllo se l'audio è presente nella cache di Phaser prima di provare a usare WebAudio.
    try {
      const hasCacheAudio = !!(
        this.cache &&
        (this.cache as any).audio &&
        (this.cache as any).audio.exists &&
        (this.cache as any).audio.exists(key)
      );
      if (hasCacheAudio && this.sound) {
        // proviamo a riprodurre con Phaser; se fallisce, passeremo al fallback
        try {
          this.sound.play(key);
          return;
        } catch (err) {
          console.warn(
            "Phaser sound play failed, falling back to HTMLAudio for",
            key,
            err
          );
        }
      }
    } catch (err) {
      console.warn(
        "Error checking sound cache, using fallback HTMLAudio for",
        key,
        err
      );
    }

    // Fallback: HTMLAudio (usa il percorso in audioPaths)
    const path = this.audioPaths[key];
    if (path) {
      const a = new Audio(path);
      a.play().catch((e) => console.warn("HTMLAudio play failed for", key, e));
    } else {
      console.warn("No audio path for key", key);
    }
  }

  /**
   * formatRound(n)
   * - ritorna il numero del round con due cifre (es: 01, 02, 10)
   */
  private formatRound(n: number) {
    const v = Math.max(0, n);
    return v < 10 ? `0${v}` : `${v}`;
  }
}
