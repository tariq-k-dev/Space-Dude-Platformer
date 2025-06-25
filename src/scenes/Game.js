import { Player } from '../gameObjects/Player.js';

export class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    if (this.sound.locked) {
      let text = this.add
        .text(
          this.cameras.main.width / 2,
          this.cameras.main.height / 2,
          'Click to start',
          { font: '32px Arial', fill: '#ffffff' }
        )
        .setOrigin(0.5);

      this.input.once('pointerdown', () => {
        this.sound.unlock();
        text.destroy();
      });
    }

    // Create the game environment
    this.add.image(400, 300, 'sky');

    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 250, 'ground');

    // Add player to the game
    this.player = new Player(this, 100, 450);

    // Add a colliders for the player and platforms
    this.physics.add.collider(this.player, this.platforms);

    // Keyboard inputs - cursors
    this.cursors = this.input.keyboard.createCursorKeys();

    // Add star group
    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    this.stars.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // Add colliders for the stars and platforms
    this.physics.add.collider(this.stars, this.platforms);

    // Check for player star overlap
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collecStar,
      null,
      this
    );

    // Setting the initial score text
    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      fontStyle: 'bold',
      fill: '#192a56',
    });

    // Create bomb group
    this.bombs = this.physics.add.group();

    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      null,
      this
    );
  }

  update(time) {
    if (this.cursors.left.isDown) {
      this.player.moveLeft();
    } else if (this.cursors.right.isDown) {
      this.player.moveRight();
    } else {
      this.player.idle();
    }

    if (this.cursors.up.isDown) {
      this.player.jump();
    }
  }

  collecStar(player, star) {
    star.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate((child) => {
        child.enableBody(true, child.x, 0, true, true);
      });

      this.releaseBomb();
    }
  }

  hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xea2027);
    player.anims.play('turn');

    // Call GameOver after 2 second delay
    this.time.delayedCall(2000, () => {
      this.scene.start('GameOver', { score: this.score });
    });
  }

  releaseBomb() {
    const x =
      this.player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);
    const bomb = this.bombs.create(x, 16, 'bomb');
    -bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
  }
}
