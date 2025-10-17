import Phaser from 'phaser'

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' })
    }

    /**
     * create()
     * - crea il titolo e un "pulsante" composto da:
     *   - un rettangolo visivo
     *   - il testo centrato "START"
     *   - una hit-area trasparente che gestisce gli eventi pointer
     *
     * Spiegazioni in italiano per ogni parte:
     * - Container: raggruppa gli oggetti visivi (rettangolo + testo + hit-area).
     * - hitRect (alpha = 0): è la zona cliccabile; così il testo non deve essere reso interattivo separatamente.
     * - Gli handler pointerover/pointerout/pointerdown sono collegati alla hit-area.
     */
    create() {
        // Titolo
        this.add.text(400, 140, 'Simon', {
            fontSize: '48px',
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5)

        // Dimensioni del bottone
        const buttonWidth = 220
        const buttonHeight = 70

        // Container per il pulsante (centrato in 400,300)
        const buttonContainer = this.add.container(400, 300)

        // Rettangolo visivo del pulsante (posizionato a 0,0 relativo al container)
        const buttonRect = this.add.rectangle(0, 0, buttonWidth, buttonHeight, 0x2ecc71)

        // Testo "START" centrato nel rettangolo
        const buttonText = this.add.text(0, 0, 'START', {
            fontSize: '28px',
            color: '#ffffff'
        }).setOrigin(0.5)

        // Hit-area trasparente: cattura gli eventi pointer (usa il cursore a mano)
        // Ha alpha = 0 così non è visibile ma sovrapposta agli altri oggetti nel container
        const hitRect = this.add.rectangle(0, 0, buttonWidth, buttonHeight, 0x000000, 0)
            .setInteractive({ useHandCursor: true })

        // Aggiungo gli oggetti al container nell'ordine voluto (hitRect può stare sopra per sicurezza)
        buttonContainer.add([buttonRect, buttonText, hitRect])

        // Effetti hover usando la hit-area
        hitRect.on('pointerover', () => buttonRect.setFillStyle(0x27ae60))
        hitRect.on('pointerout', () => buttonRect.setFillStyle(0x2ecc71))

        // Al click: disabilita il pulsante, fade out e avvia GameScene
        hitRect.on('pointerdown', () => {
            // Disabilita ulteriori interazioni
            hitRect.disableInteractive()
            this.cameras.main.fadeOut(300, 0, 0, 0)
            this.time.delayedCall(300, () => this.scene.start('GameScene'))
        })

        // Piccola istruzione
        this.add.text(400, 380, 'Clicca START per iniziare', {
            fontSize: '16px',
            color: '#ecf0f1'
        }).setOrigin(0.5)
    }
}
