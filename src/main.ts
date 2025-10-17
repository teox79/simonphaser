import Phaser from 'phaser'
import MenuScene from './scenes/MenuScene'
import GameScene from './scenes/GameScene'
import LeaderboardScene from './scenes/LeaderboardScene'

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#34495e',
    // Start with the menu scene first
    scene: [MenuScene, GameScene, LeaderboardScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 300 },
            debug: true
        }
    }
}

new Phaser.Game(config)
