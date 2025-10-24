
import Phaser from "phaser";
import { theme } from "../../components/theme";
import IconPhaser from '../IconPhaser/IconPhaser';

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export interface BadgeConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  text: string;
  variant?: BadgeVariant;
  iconKey?: string; // key of a loaded texture (optional)
  iconSvg?: string; // raw SVG string (optional) - will be added as base64 texture under iconKey if provided
  iconSize?: number; // px
}

const getVariantStyles = () => ({
  default: {
    background: theme.colors.primary(),
    text: "#22d3ee", // cyan-400
  },
  secondary: {
    background: theme.colors.secondary(),
    text: theme.cssColors.secondaryForeground(),
  },
  destructive: {
    background: theme.colors.destructive(),
    text: theme.cssColors.destructiveForeground(),
  },
  outline: {
    background: 0x00000000,
    text: theme.cssColors.foreground(),
  },
});

/**
 * Phaser Badge: small rounded label with optional icon and variants.
 * Usage:
 *   // if you have an SVG string
 *   await Badge.addSvgTexture(scene, 'icon-check', svgString);
 *   const badge = new Badge({ scene, x: 100, y: 50, text: '3', iconKey: 'icon-check' });
 *   scene.add.existing(badge);
 */
export class Badge extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Graphics;
  private label: Phaser.GameObjects.Text;
  private icon?: Phaser.GameObjects.Image;

  private variant: BadgeVariant;
  private iconSize: number;

  constructor(cfg: BadgeConfig) {
    super(cfg.scene, cfg.x, cfg.y);

    this.variant = cfg.variant ?? "default";
    this.iconSize = cfg.iconSize ?? 14;

    this.background = cfg.scene.add.graphics();

    // Text style: use theme sizing similar to react component (text-xs)
    this.label = cfg.scene.add.text(0, 0, cfg.text, {
      fontSize: "12px",
      fontFamily: "Arial, sans-serif",
      color: getVariantStyles()[this.variant].text,
    });
    this.label.setOrigin(0.5, 0.5);


    if (cfg.iconKey && cfg.iconSvg) {
      // Usa IconPhaser per gestire svg e texture
      IconPhaser.create({
        scene: cfg.scene,
        x: 0,
        y: 0,
        svg: cfg.iconSvg,
        key: cfg.iconKey,
        color: getVariantStyles()[this.variant].text,
        size: this.iconSize
      }).then(icon => {
        this.icon = icon;
        this.add(this.icon);
        this.draw();
      });
    } else if (cfg.iconKey) {
      this.icon = cfg.scene.add.image(0, 0, cfg.iconKey);
      this.icon.setDisplaySize(this.iconSize, this.iconSize);
      this.icon.setOrigin(0.5, 0.5);
    }

    const elements: Phaser.GameObjects.GameObject[] = [this.background];
    if (this.icon) elements.push(this.icon);
    elements.push(this.label);

    this.add(elements);

    this.draw();

    // Badge is not interactive by default, but you can enable it from outside
    this.scene.add.existing(this);
  }

  private draw() {
    const style = getVariantStyles()[this.variant];

    // Measure width: text width + padding + icon space
    const textBounds = this.label.getBounds();
    const paddingX = 16;
    const gap = this.icon ? 6 : 0;

    const width =
      textBounds.width + paddingX * 2 + (this.icon ? this.iconSize + gap : 0);
    const height = 38; // fixed height in px

    // Clear and draw background
    this.background.clear();
    const borderRadius = height / 2; // rounded-full
    if (this.variant === "default") {
      // Bordo cyan-400 e blur leggero (simulato con alpha)
      this.background.fillStyle(style.background, 0.85); // leggermente trasparente per simulare blur
      this.background.fillRoundedRect(
        -width / 2,
        -height / 2,
        width,
        height,
        borderRadius
      );
      this.background.lineStyle(1.5, 0x22d3ee, 1); // cyan-400
      this.background.strokeRoundedRect(
        -width / 2,
        -height / 2,
        width,
        height,
        borderRadius
      );
    } else if (style.background !== 0x00000000) {
      this.background.fillStyle(style.background, 1);
      this.background.fillRoundedRect(
        -width / 2,
        -height / 2,
        width,
        height,
        borderRadius
      );
    } else {
      // outline variant: draw light border
      this.background.lineStyle(1, theme.colors.border(), 1);
      this.background.strokeRoundedRect(
        -width / 2,
        -height / 2,
        width,
        height,
        borderRadius
      );
    }

    // Position icon and text vertically centered in 38px
    const centerY = 0;
    if (this.icon) {
      // icon left, text centrato nello spazio rimanente a destra
      const iconX = -width / 2 + paddingX + this.iconSize / 2;
      this.icon.setPosition(iconX, centerY);
      // Calcola la posizione del testo: centroide tra metà badge e metà spazio testo a destra dell'icona
      const textAreaStart = iconX + this.iconSize / 2 + gap;
      const textAreaWidth = width - (textAreaStart + width / 2);
      const textX = textAreaStart + (width / 2 - textAreaStart) / 2;
      this.label.setPosition(textX - 10, centerY);
    } else {
      this.label.setPosition(0, centerY);
    }

    // Update size of container for potential interaction
    this.setSize(width, height);
  }

  public setText(text: string) {
    this.label.setText(text);
    this.draw();
  }

  public setVariant(variant: BadgeVariant) {
    this.variant = variant;
    this.label.setColor(getVariantStyles()[variant].text);
    this.draw();
  }

  // addSvgTexture deprecato: usa IconPhaser.addSvgTexture
}

export default Badge;
