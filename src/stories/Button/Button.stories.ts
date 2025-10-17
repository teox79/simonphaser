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
    
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: container,
      backgroundColor: '#ffffff',
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
            onClick: () => console.log('Clicked!'),
          });
        }
      }
    };

    new Phaser.Game(config);
    return container;
  },
  argTypes: {
    text: { control: 'text' },
    variant: { control: 'select', options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] },
    size: { control: 'select', options: ['sm', 'default', 'lg', 'icon'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<ButtonConfig>;

export default meta;
type Story = StoryObj<ButtonConfig>;

export const Default: Story = {
  args: { text: 'Button', variant: 'default', size: 'default' },
};

export const Destructive: Story = {
  args: { text: 'Delete', variant: 'destructive', size: 'default' },
};

export const Outline: Story = {
  args: { text: 'Outline', variant: 'outline', size: 'default' },
};

export const Secondary: Story = {
  args: { text: 'Secondary', variant: 'secondary', size: 'default' },
};

export const Ghost: Story = {
  args: { text: 'Ghost', variant: 'ghost', size: 'default' },
};

export const Link: Story = {
  args: { text: 'Link', variant: 'link', size: 'default' },
};

export const Small: Story = {
  args: { text: 'Small', variant: 'default', size: 'sm' },
};

export const Large: Story = {
  args: { text: 'Large', variant: 'default', size: 'lg' },
};

export const IconButton: Story = {
  args: { text: '🎮', variant: 'default', size: 'icon' },
};

export const Disabled: Story = {
  args: { text: 'Disabled', variant: 'default', size: 'default', disabled: true },
};
