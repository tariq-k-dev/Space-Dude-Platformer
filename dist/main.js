import { Boot } from './scenes/Boot.js';
import { Game } from './scenes/Game.js';
import { GameOver } from './scenes/GameOver.js';
import { Preloader } from './scenes/Preloader.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: 'transparent',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 500 },
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    orientation: 'landscape',
  },
  scene: [Boot, Preloader, Game, GameOver],
  audio: {
    disableWebAudio: true,
  },
};

new Phaser.Game(config);
