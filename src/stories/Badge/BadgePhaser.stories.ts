import type { Meta, StoryObj } from '@storybook/html-vite';
import Phaser from 'phaser';
import { Badge, BadgeConfig } from './BadgePhaser';
import { lucideSparkles } from '../IconPhaser/lucideIcons';
export const DefaultWithSparkles: Story = {
  args: {
    text: 'Sfida la tua memoria!',
    variant: 'default',
    iconSvg: lucideSparkles,
    iconSize: 18,
  },
  parameters: {
    docs: {
      description: {
        story: 'Badge default con icona Lucide Sparkles.'
      }
    }
  }
};

const meta = {
  title: 'Components/BadgePhaser',
  tags: ['autodocs'],
  render: (args) => {
    const container = document.createElement('div');
    container.style.width = '400px';
    container.style.height = '200px';
    const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#ffffff';
    // Genera una chiave unica per la texture SVG (usando hash semplice)
    function svgKey(svg: string | undefined) {
      if (!svg) return undefined;
      let hash = 0;
      for (let i = 0; i < svg.length; i++) {
        hash = ((hash << 5) - hash) + svg.charCodeAt(i);
        hash |= 0;
      }
      return 'icon-' + Math.abs(hash);
    }
    const iconKey = svgKey(args.iconSvg);
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 400,
      height: 200,
      parent: container,
      backgroundColor: backgroundColor,
      scene: {
        create: async function() {
          if (args.iconSvg && iconKey) {
            new Badge({
              scene: this,
              x: 200,
              y: 100,
              text: args.text ?? 'OK',
              variant: args.variant ?? 'default',
              iconKey,
              iconSvg: args.iconSvg,
              iconSize: args.iconSize ?? 16,
            });
          } else {
            new Badge({
              scene: this,
              x: 200,
              y: 100,
              text: args.text ?? '3',
              variant: args.variant ?? 'default',
            });
          }
        }
      }
    };
    new Phaser.Game(config);
    return container;
  },
  argTypes: {
    text: { control: 'text', description: 'Testo del badge' },
    variant: { control: 'select', options: ['default', 'secondary', 'destructive', 'outline'], description: 'Variante' },
    iconSvg: { control: 'text', description: 'SVG stringa icona (opzionale)' },
    iconSize: { control: { type: 'number', min: 8, max: 32 }, description: 'Dimensione icona (px)' },
  },
  parameters: {
    docs: {
      description: {
        component: 'Badge per Phaser, supporta testo, varianti e icona SVG (es. Heroicons, Material Icons SVG).'
      }
    }
  }
} satisfies Meta<BadgeConfig>;

export default meta;
type Story = StoryObj<BadgeConfig>;

export const Default: Story = {
  args: { text: 'Sfida la tua memoria', variant: 'default' },
};

export const WithIcon: Story = {
  args: {
    text: 'OK',
    variant: 'secondary',
    iconSvg: lucideSparkles,
    iconSize: 16,
  },
  parameters: {
    docs: {
      description: {
        story: 'Badge con icona Lucide (lucide-static).'
      }
    }
  }
};

export const Destructive: Story = {
  args: { text: '!', variant: 'destructive' },
};

export const Outline: Story = {
  args: { text: 'Info', variant: 'outline' },
};
