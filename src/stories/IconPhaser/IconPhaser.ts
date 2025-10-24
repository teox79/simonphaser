import Phaser from 'phaser';

/**
 * IconPhaser: componente riutilizzabile per aggiungere un'icona SVG come texture Phaser e visualizzarla come GameObject Image.
 * - Carica la texture solo se non esiste già (usando una chiave unica)
 * - Permette di specificare svg, colore, dimensione, key
 * - Restituisce l'istanza Phaser.GameObjects.Image
 */
export interface IconPhaserConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  svg: string;
  key: string;
  color?: string;
  size?: number;
}

export class IconPhaser {
  public static async addSvgTexture(scene: Phaser.Scene, key: string, svg: string, color: string = '#22d3ee') {
    const processedSvg = svg.replace(/currentColor/g, color);
    const svgData = encodeURIComponent(processedSvg);
    const dataUrl = `data:image/svg+xml,${svgData}`;
    const img = new Image();
    img.src = dataUrl;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load SVG image'));
    });
    scene.textures.addImage(key, img);
  }

  /**
   * Crea e ritorna una Phaser.GameObjects.Image con la texture SVG
   */
  public static async create(config: IconPhaserConfig): Promise<Phaser.GameObjects.Image> {
    const { scene, x, y, svg, key, color = '#22d3ee', size = 18 } = config;
    if (!scene.textures.exists(key)) {
      await IconPhaser.addSvgTexture(scene, key, svg, color);
    }
    const image = scene.add.image(x, y, key);
    image.setDisplaySize(size, size);
    image.setOrigin(0.5, 0.5);
    return image;
  }
}

export default IconPhaser;
