import type { Meta, StoryObj } from '@storybook/html-vite';
import Phaser from 'phaser';
import { IconPhaser } from './IconPhaser';
import { lucideSparkles } from './lucideIcons';

const meta = {
  title: 'Components/IconPhaser',
  tags: ['autodocs'],
  render: (args) => {
    const container = document.createElement('div');
    container.style.width = '120px';
    container.style.height = '120px';
    const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#ffffff';
    const iconKey = 'icon-sparkles';
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 120,
      height: 120,
      parent: container,
      backgroundColor: backgroundColor,
      scene: {
        create: async function() {
          await IconPhaser.create({
            scene: this,
            x: 60,
            y: 60,
            svg: args.svg,
            key: iconKey,
            color: args.color,
            size: args.size
          });
        }
      }
    };
    new Phaser.Game(config);
    return container;
  },
  argTypes: {
    svg: { control: 'text', description: 'SVG stringa icona' },
    color: { control: 'color', description: 'Colore icona' },
    size: { control: { type: 'number', min: 8, max: 64 }, description: 'Dimensione icona (px)' },
  },
  parameters: {
    docs: {
      description: {
        component: 'IconPhaser: visualizza una icona SVG come GameObject Phaser riutilizzabile.'
      }
    }
  }
} satisfies Meta<{ svg: string, color: string, size: number }>;

export default meta;
type Story = StoryObj<{ svg: string, color: string, size: number }>;

export const Default: Story = {
  args: {
    svg: lucideSparkles,
    color: '#22d3ee',
    size: 48,
  },
  parameters: {
    docs: {
      description: {
        story: 'Icona Lucide Sparkles come GameObject Phaser.'
      }
    }
  }
};
