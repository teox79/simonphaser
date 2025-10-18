import Phaser from 'phaser';

export interface PhaserButtonProps {
    scene: Phaser.Scene;
    x: number;
    y: number;
    text: string;
    style?: Phaser.Types.GameObjects.Text.TextStyle;
    onClick?: () => void;
}

export class PhaserButton extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.Rectangle;
    private textObj: Phaser.GameObjects.Text;

    constructor(props: PhaserButtonProps) {
        const { scene, x, y, text, style = {}, onClick } = props;

        super(scene, x, y);

        // Create background rectangle
        this.background = scene.add.rectangle(0, 0, 200, 50, 0x4CAF50);
        this.background.setStrokeStyle(2, 0x000000);
        this.add(this.background);

        // Create text
        this.textObj = scene.add.text(0, 0, text, {
            fontSize: '20px',
            color: '#ffffff',
            ...style,
        });
        this.textObj.setOrigin(0.5);
        this.add(this.textObj);

        // Make interactive
        this.setInteractive(new Phaser.Geom.Rectangle(-100, -25, 200, 50), Phaser.Geom.Rectangle.Contains);
        this.on('pointerdown', () => {
            if (onClick) onClick();
        });

        // Hover effects
        this.on('pointerover', () => {
            this.background.setFillStyle(0x66BB6A);
        });
        this.on('pointerout', () => {
            this.background.setFillStyle(0x4CAF50);
        });

        scene.add.existing(this);
    }

    setText(newText: string) {
        this.textObj.setText(newText);
    }

    setPosition(x: number, y: number) {
        return super.setPosition(x, y);
    }
}