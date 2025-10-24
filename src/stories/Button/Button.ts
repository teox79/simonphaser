import Phaser from 'phaser';
import { theme } from '../../components/theme';

// Definizione delle varianti del bottone (convertito da CVA)
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'default' | 'lg' | 'icon';

export interface ButtonConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  text: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: () => void;
}

// Configurazione colori per le varianti usando il design system
const getVariantStyles = () => ({
  default: {
    background: theme.colors.primary(),
    backgroundHover: theme.isDark() ? 0x666666 : 0x1a1a1a,
    text: theme.cssColors.primaryForeground(),
    border: theme.colors.primary(),
    borderFocus: theme.colors.ring(),
    underline: false,
  },
  destructive: {
    background: theme.colors.destructive(),
    backgroundHover: theme.isDark() ? 0xdc2626 : 0xb91c1c,
    text: theme.cssColors.destructiveForeground(),
    border: theme.colors.destructive(),
    borderFocus: theme.colors.destructive(),
    underline: false,
  },
  outline: {
    background: theme.colors.background(),
    backgroundHover: theme.colors.accent(),
    text: theme.cssColors.foreground(),
    border: theme.colors.border(),
    borderFocus: theme.colors.ring(),
    underline: false,
  },
  secondary: {
    background: theme.colors.secondary(),
    backgroundHover: theme.isDark() ? 0x555555 : 0xdddde1,
    text: theme.cssColors.secondaryForeground(),
    border: theme.colors.secondary(),
    borderFocus: theme.colors.ring(),
    underline: false,
  },
  ghost: {
    background: 0x00000000, // transparent
    backgroundHover: theme.colors.accent(),
    text: theme.cssColors.foreground(),
    border: 0x00000000, // transparent
    borderFocus: theme.colors.ring(),
    underline: false,
  },
  link: {
    background: 0x00000000, // transparent
    backgroundHover: 0x00000000,
    text: theme.cssColors.primary(),
    border: 0x00000000,
    borderFocus: theme.colors.ring(),
    underline: true,
  },
});

// Configurazione dimensioni usando il border radius del tema
const getSizeStyles = () => ({
  sm: {
    height: 32, // h-8
    paddingX: 12, // px-3
    fontSize: '14px',
    borderRadius: theme.radius.sm(),
  },
  default: {
    height: 36, // h-9
    paddingX: 16, // px-4
    fontSize: '14px',
    borderRadius: theme.radius.md(),
  },
  lg: {
    height: 40, // h-10
    paddingX: 24, // px-6
    fontSize: '16px',
    borderRadius: theme.radius.lg(),
  },
  icon: {
    height: 36, // size-9
    paddingX: 36, // quadrato
    fontSize: '16px',
    borderRadius: theme.radius.md(),
  },
});

/**
 * Componente Button riutilizzabile per Phaser
 * Convertito dal componente React con varianti e dimensioni
 */
export class Button extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Graphics;
  private border: Phaser.GameObjects.Graphics;
  private buttonText: Phaser.GameObjects.Text;
  private underline?: Phaser.GameObjects.Graphics;
  private focusRing: Phaser.GameObjects.Graphics;
  
  private variant: ButtonVariant;
  private size: ButtonSize;
  private disabled: boolean;
  private isHovered: boolean = false;
  private isFocused: boolean = false;
  private onClick: () => void;
  private buttonWidth: number = 0;
  private buttonHeight: number = 0;

  constructor(config: ButtonConfig) {
    super(config.scene, config.x, config.y);

    this.variant = config.variant ?? 'default';
    this.size = config.size ?? 'default';
    this.disabled = config.disabled ?? false;
    this.onClick = config.onClick ?? (() => {});

    // Ottieni gli stili dal tema
    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();
    
    const variantStyle = variantStyles[this.variant];
    const sizeStyle = sizeStyles[this.size];

    // Calcola larghezza basata sul testo
    const tempText = this.scene.add.text(0, 0, config.text, {
      fontSize: sizeStyle.fontSize,
      fontFamily: 'Arial, sans-serif',
    });
    const textWidth = tempText.width;
    tempText.destroy();

    const width = this.size === 'icon' ? sizeStyle.paddingX : textWidth + sizeStyle.paddingX * 2;
    const height = sizeStyle.height;

    // Salva le dimensioni
    this.buttonWidth = width;
    this.buttonHeight = height;

    // Crea focus ring (più esterno)
    this.focusRing = this.scene.add.graphics();
    
    // Crea il background
    this.background = this.scene.add.graphics();
    
    // Crea il border
    this.border = this.scene.add.graphics();

    // Crea il testo
    this.buttonText = this.scene.add.text(0, 0, config.text, {
      fontSize: sizeStyle.fontSize,
      color: variantStyle.text,
      fontFamily: 'Arial, sans-serif',
      fontStyle: this.variant === 'link' ? 'normal' : 'normal',
    });
    this.buttonText.setOrigin(0.5);

    // Crea underline per variante link
    if (variantStyle.underline) {
      this.underline = this.scene.add.graphics();
    }

    // Aggiungi gli elementi al container
    const elements: Phaser.GameObjects.GameObject[] = [
      this.focusRing,
      this.background,
      this.border,
      this.buttonText,
    ];
    if (this.underline) elements.push(this.underline);
    
    this.add(elements);

    // Disegna lo stato iniziale
    this.draw(width, height);

    // Rendi il bottone interattivo
    this.setSize(width, height);
    this.setInteractive(
      new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
      Phaser.Geom.Rectangle.Contains
    );

    // Eventi
    if (!this.disabled) {
      this.on('pointerover', () => this.onHover());
      this.on('pointerout', () => this.onOut());
      this.on('pointerdown', () => this.onDown());
      this.on('pointerup', () => this.onUp());
    }

    // Applica stile disabled se necessario
    if (this.disabled) {
      this.setAlpha(0.5);
      this.disableInteractive();
    }

    // Aggiungi il container alla scena
    this.scene.add.existing(this);
  }

  private draw(width: number, height: number): void {
    // Ottieni gli stili dal tema (per supportare cambi di tema dinamici)
    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();
    
    const variantStyle = variantStyles[this.variant];
    const sizeStyle = sizeStyles[this.size];

    // Pulisci i graphics
    this.background.clear();
    this.border.clear();
    this.focusRing.clear();
    if (this.underline) this.underline.clear();

    // Colore di sfondo (con hover) - usa il colore predefinito dall'hover
    let bgColor = this.isHovered ? variantStyle.backgroundHover : variantStyle.background;

    // Disegna focus ring se focused
    if (this.isFocused) {
      this.focusRing.lineStyle(3, variantStyle.borderFocus, 0.5);
      this.focusRing.strokeRoundedRect(
        -width / 2 - 2,
        -height / 2 - 2,
        width + 4,
        height + 4,
        sizeStyle.borderRadius
      );
    }

    // Disegna background
    if (bgColor !== 0x00000000) {
      this.background.fillStyle(bgColor, 1);
      this.background.fillRoundedRect(
        -width / 2,
        -height / 2,
        width,
        height,
        sizeStyle.borderRadius
      );
    }

    // Disegna border per variante outline
    if (this.variant === 'outline') {
      this.border.lineStyle(1, variantStyle.border, 1);
      this.border.strokeRoundedRect(
        -width / 2,
        -height / 2,
        width,
        height,
        sizeStyle.borderRadius
      );
    }

    // Disegna underline per variante link
    if (this.underline && this.isHovered) {
      const textBounds = this.buttonText.getBounds();
      this.underline.lineStyle(1, Phaser.Display.Color.HexStringToColor(variantStyle.text).color, 1);
      this.underline.lineBetween(
        -textBounds.width / 2,
        height / 2 - 8,
        textBounds.width / 2,
        height / 2 - 8
      );
    }
  }

  private onHover(): void {
    if (this.disabled) return;
    this.isHovered = true;
    this.draw(this.buttonWidth, this.buttonHeight);
    this.scene.game.canvas.style.cursor = 'pointer';
  }

  private onOut(): void {
    if (this.disabled) return;
    this.isHovered = false;
    this.draw(this.buttonWidth, this.buttonHeight);
    this.scene.game.canvas.style.cursor = 'default';
  }

  private onDown(): void {
    if (this.disabled) return;
    this.setScale(0.98);
    this.isFocused = true;
    this.draw(this.buttonWidth, this.buttonHeight);
  }

  private onUp(): void {
    if (this.disabled) return;
    this.setScale(1);
    this.onClick();
  }

  /**
   * Aggiorna il testo del bottone
   */
  public setText(text: string): void {
    this.buttonText.setText(text);
  }

  /**
   * Abilita o disabilita il bottone
   */
  public setEnabled(enabled: boolean): void {
    this.disabled = !enabled;
    if (this.disabled) {
      this.setAlpha(0.5);
      this.disableInteractive();
    } else {
      this.setAlpha(1);
      this.setInteractive();
    }
  }
}

