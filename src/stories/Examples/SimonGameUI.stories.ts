import type { Meta, StoryObj } from '@storybook/html-vite';
import Phaser from 'phaser';
import { Button } from '../Button/Button';

const meta = {
  title: 'Examples/Simon Game UI',
  tags: ['autodocs'],
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
          // Titolo
          this.add.text(400, 60, 'SIMON GAME UI', {
            fontSize: '48px',
            color: getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim() || '#000000',
            fontFamily: 'Arial, sans-serif'
          }).setOrigin(0.5);

          // Pulsante Play principale
          new Button({
            scene: this,
            x: 400,
            y: 200,
            text: 'PLAY',
            variant: 'default',
            size: 'lg',
            onClick: () => console.log('Game started!'),
          });

          // Pulsanti menu
          new Button({
            scene: this,
            x: 300,
            y: 300,
            text: 'Settings',
            variant: 'outline',
            size: 'default',
            onClick: () => console.log('Settings opened'),
          });

          new Button({
            scene: this,
            x: 500,
            y: 300,
            text: 'Leaderboard',
            variant: 'secondary',
            size: 'default',
            onClick: () => console.log('Leaderboard opened'),
          });

          // Pulsanti di controllo volume
          new Button({
            scene: this,
            x: 150,
            y: 450,
            text: '🔊',
            variant: 'ghost',
            size: 'icon',
            onClick: () => console.log('Volume up'),
          });

          new Button({
            scene: this,
            x: 200,
            y: 450,
            text: '🔇',
            variant: 'ghost',
            size: 'icon',
            onClick: () => console.log('Mute'),
          });

          // Pulsante reset/restart
          new Button({
            scene: this,
            x: 400,
            y: 400,
            text: 'Restart Game',
            variant: 'destructive',
            size: 'sm',
            onClick: () => console.log('Game restarted'),
          });

          // Pulsante help
          new Button({
            scene: this,
            x: 650,
            y: 450,
            text: 'Help',
            variant: 'link',
            size: 'sm',
            onClick: () => console.log('Help opened'),
          });

          // Info text
          this.add.text(400, 520, 'Usa questi bottoni nella tua UI del gioco Simon', {
            fontSize: '16px',
            color: getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground').trim() || '#666666',
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
        component: 'Esempio di come utilizzare i componenti Button nel gioco Simon, mostrando diversi casi d\'uso tipici per un\'interfaccia di gioco.'
      }
    }
  }
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const GameUI: Story = {};