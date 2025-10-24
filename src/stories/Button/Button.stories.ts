import type { Meta, StoryObj } from '@storybook/html-vite';
import Phaser from 'phaser';
import { Button, ButtonConfig } from './Button';

const meta = {
  title: 'Components/Button',
  tags: ['autodocs'],
  render: (args) => {
    const container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '600px';
    
    // Usa il colore di background dal tema CSS
    const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#ffffff';
    
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: container,
      backgroundColor: backgroundColor,
      scene: {
        create: function() {
          new Button({
            scene: this,
            x: args.x ?? 400,
            y: args.y ?? 300,
            text: args.text ?? 'Button',
            variant: args.variant,
            size: args.size,
            disabled: args.disabled,
            onClick: () => {
              console.log('Clicked!');
              // Mostra un alert con stile più discreto
              const message = `Button "${args.text}" (${args.variant}, ${args.size}) clicked!`;
              console.log(message);
            },
          });
        }
      }
    };

    new Phaser.Game(config);
    return container;
  },
  argTypes: {
    text: { 
      control: 'text',
      description: 'Testo del bottone'
    },
    variant: { 
      control: 'select', 
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Variante del design system'
    },
    size: { 
      control: 'select', 
      options: ['sm', 'default', 'lg', 'icon'],
      description: 'Dimensione del bottone'
    },
    disabled: { 
      control: 'boolean',
      description: 'Stato disabilitato'
    },
    x: {
      control: { type: 'number', min: 0, max: 800 },
      description: 'Posizione X (per test)',
      table: { category: 'Layout' }
    },
    y: {
      control: { type: 'number', min: 0, max: 600 },
      description: 'Posizione Y (per test)',
      table: { category: 'Layout' }
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Componente Button convertito dal design system React. Utilizza CSS custom properties per supportare i temi light/dark dinamici.'
      }
    }
  }
} satisfies Meta<ButtonConfig>;

export default meta;
type Story = StoryObj<ButtonConfig>;

export const Default: Story = {
  args: { text: 'Button', variant: 'default', size: 'default' },
};

export const Destructive: Story = {
  args: { text: 'Delete', variant: 'destructive', size: 'default' },
  parameters: {
    docs: {
      description: {
        story: 'Utilizzato per azioni pericolose come eliminazioni o cancellazioni.'
      }
    }
  }
};

export const Outline: Story = {
  args: { text: 'Outline', variant: 'outline', size: 'default' },
  parameters: {
    docs: {
      description: {
        story: 'Variante con bordo, ideale per azioni secondarie.'
      }
    }
  }
};

export const Secondary: Story = {
  args: { text: 'Secondary', variant: 'secondary', size: 'default' },
};

export const Ghost: Story = {
  args: { text: 'Ghost', variant: 'ghost', size: 'default' },
  parameters: {
    docs: {
      description: {
        story: 'Variante trasparente che diventa visibile al hover.'
      }
    }
  }
};

export const Link: Story = {
  args: { text: 'Link', variant: 'link', size: 'default' },
  parameters: {
    docs: {
      description: {
        story: 'Stile link con underline al hover.'
      }
    }
  }
};

export const Small: Story = {
  args: { text: 'Small', variant: 'default', size: 'sm' },
};

export const Large: Story = {
  args: { text: 'Large', variant: 'default', size: 'lg' },
};

export const IconButton: Story = {
  args: { text: '🎮', variant: 'default', size: 'icon' },
  parameters: {
    docs: {
      description: {
        story: 'Dimensione quadrata ideale per icone.'
      }
    }
  }
};

export const Disabled: Story = {
  args: { text: 'Disabled', variant: 'default', size: 'default', disabled: true },
};

// Story showcase con tutte le varianti
export const AllVariants: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '600px';
    
    const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#ffffff';
    
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: container,
      backgroundColor: backgroundColor,
      scene: {
        create: function() {
          const variants: Array<{ text: string, variant: ButtonConfig['variant'], x: number, y: number }> = [
            { text: 'Default', variant: 'default', x: 150, y: 150 },
            { text: 'Destructive', variant: 'destructive', x: 400, y: 150 },
            { text: 'Outline', variant: 'outline', x: 650, y: 150 },
            { text: 'Secondary', variant: 'secondary', x: 150, y: 250 },
            { text: 'Ghost', variant: 'ghost', x: 400, y: 250 },
            { text: 'Link', variant: 'link', x: 650, y: 250 },
          ];

          variants.forEach(({ text, variant, x, y }) => {
            new Button({
              scene: this,
              x,
              y,
              text,
              variant,
              size: 'default',
              onClick: () => console.log(`${variant} clicked!`),
            });
          });

          // Titolo
          this.add.text(400, 50, 'Tutte le varianti del Button', {
            fontSize: '24px',
            color: getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim() || '#000000',
            fontFamily: 'Arial, sans-serif'
          }).setOrigin(0.5);
        }
      }
    };

    new Phaser.Game(config);
    return container;
  },
  parameters: {
    docs: {
      description: {
        story: 'Panoramica di tutte le varianti disponibili del componente Button.'
      }
    }
  }
};
