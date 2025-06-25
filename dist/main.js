import { Boot } from '../src/scenes/Boot.js';
import { Game } from '../src/scenes/Game.js';
import { GameOver } from '../src/scenes/GameOver.js';
import { Preloader } from '../src/scenes/Preloader.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#028af8',
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
  },
  scene: [Boot, Preloader, Game, GameOver],
  audio: {
    disableWebAudio: true,
  },
};

new Phaser.Game(config);
