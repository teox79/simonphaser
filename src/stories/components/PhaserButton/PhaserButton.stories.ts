import type { Meta, StoryObj } from '@storybook/html-vite';
import { fn } from 'storybook/test';
import Phaser from 'phaser';
import { PhaserButton, type PhaserButtonProps } from './PhaserButton';

// Custom render function to create a Phaser game
const renderPhaserButton = (args: PhaserButtonProps) => {
    const container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '600px';
    container.style.border = '1px solid #ccc';

    // Create Phaser game config
    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: container,
        scene: {
            create: function () {
                new PhaserButton({ ...args, scene: this as Phaser.Scene });
            }
        }
    };

    // Initialize Phaser game
    new Phaser.Game(config);

    return container;
};

const meta = {
    title: 'Phaser/Button',
    tags: ['autodocs'],
    render: renderPhaserButton,
    argTypes: {
        text: { control: 'text' },
        x: { control: 'number' },
        y: { control: 'number' },
        onClick: { action: 'onClick' },
    },
    args: {
        x: 400,
        y: 300,
        text: 'Click Me',
        onClick: fn(),
    },
} satisfies Meta<PhaserButtonProps>;

export default meta;
type Story = StoryObj<PhaserButtonProps>;

export const Default: Story = {
    args: {
        x: 400,
        y: 300,
        text: 'Default Button',
    },
};

export const CustomPosition: Story = {
    args: {
        x: 200,
        y: 150,
        text: 'Custom Position',
    },
};