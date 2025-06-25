import { Player } from '../gameObjects/Player.js';

export class Game extends Phaser.Scene {
  constructor() {
    super('Game');
    this.mobileControls = null;
  }

  // In Game.js, replace the entire create() method with this.

  create() {
    // --- 1. Set up the camera and world bounds ---
    // this.cameras.main.setBounds(0, 0, 800, 600);
    // this.physics.world.setBounds(0, 0, 800, 600);
    let worldWidth = this.scale.width;
    let worldHeight = this.scale.height;
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    // --- 2. Create the background ---
    this.bg = this.add
      .image(0, 0, 'sky')
      .setOrigin(0)
      .setScrollFactor(0)
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    // Resize handler to adjust background size
    this.scale.on('resize', (gameSize) => {
      const width = gameSize.width;
      const height = gameSize.height;
      this.bg.setDisplaySize(width, height);
    });

    // --- 3. Create the game world objects (platforms, stars, etc.) ---
    // These objects have a default scroll factor of 1, so they move with the camera.
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');

    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });
    this.stars.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    this.physics.add.collider(this.stars, this.platforms);

    // --- 4. Create the player and make the camera follow it ---
    this.player = new Player(this, 100, 450);
    this.player.setCollideWorldBounds(true);
    this.cameras.main.startFollow(this.player, true);

    // --- 5. Create UI elements (score, controls) and lock them to the camera ---
    // These have a scroll factor of 0.
    this.score = 0;
    this.scoreText = this.add
      .text(32, 32, 'Score: 0', {
        fontSize: '32px',
        fontStyle: 'bold',
        fill: '#192a56',
      })
      .setScrollFactor(0);

    // Initial check
    this.updateMobileControls();

    // Listen for resize and update controls
    this.scale.on('resize', () => {
      this.updateMobileControls();
    });

    // Listen for resize and update controls
    this.scale.on('resize', () => {
      this.updateMobileControls();
    });

    // --- Optional: Add fullscreen button ---
    const fullscreenButton = this.add
      .image(this.cameras.main.width - 32, 32, 'fullscreen-icon')
      .setInteractive()
      .setScrollFactor(0)
      .setOrigin(1, 0)
      .setScale(0.5);

    fullscreenButton.on('pointerup', () => {
      if (!this.scale.isFullscreen) {
        this.scale.startFullscreen();
      } else {
        this.scale.stopFullscreen();
      }
    });

    // --- 6. Set up remaining physics and inputs ---
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );

    this.bombs = this.physics.add.group();
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      null,
      this
    );

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.cursors.left.isDown || this.moveLeft) {
      // Move left if the keyboard left OR the mobile left button is active
      this.player.moveLeft();
    } else if (this.cursors.right.isDown || this.moveRight) {
      // Move right if the keyboard right OR the mobile right button is active
      this.player.moveRight();
    } else {
      // If no movement keys are active, be idle
      this.player.idle();
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.jump();
    }
  }

  collectStar(player, star) {
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

  // Mobile controls
  addMobileControls() {
    const group = this.add.container();

    // --- State and Configuration ---
    this.moveLeft = false;
    this.moveRight = false;

    // Define constants for easy tweaking
    const buttonAlpha = 0.7;
    const buttonScale = 1;
    const safeAreaMargin = 50;
    // --- Define Button Positions ---
    const buttonY = this.cameras.main.height - safeAreaMargin;
    const leftButtonX = 100;
    const rightButtonX = 220;
    const jumpButtonX = this.cameras.main.width - 100;

    // --- Create Movement D-Pad on the Left ---
    const leftButton = this.add
      .image(leftButtonX, buttonY, 'left-arrow')
      .setInteractive()
      .setScrollFactor(0)
      .setAlpha(buttonAlpha)
      .setScale(buttonScale);

    group.add(leftButton);

    const rightButton = this.add
      .image(rightButtonX, buttonY, 'right-arrow')
      .setInteractive()
      .setScrollFactor(0)
      .setAlpha(buttonAlpha)
      .setScale(buttonScale);

    group.add(rightButton);

    // --- Create Jump Button on the Right ---
    const jumpButton = this.add
      .image(jumpButtonX, buttonY, 'jump-button')
      .setInteractive()
      .setScrollFactor(0)
      .setAlpha(buttonAlpha)
      .setScale(buttonScale);

    group.add(jumpButton);

    // --- Set Larger Hit Areas for Forgiving Controls ---
    const hitAreaSize = leftButton.width * 1.5;
    const hitArea = new Phaser.Geom.Circle(0, 0, hitAreaSize / 2);

    leftButton.setOrigin(0.5);
    rightButton.setOrigin(0.5);
    jumpButton.setOrigin(0.5);

    this.input.setHitArea(leftButton, hitArea);
    this.input.setHitArea(rightButton, hitArea);
    this.input.setHitArea(jumpButton, hitArea);

    // --- Pointer Events (No changes to logic needed) ---
    leftButton.on('pointerdown', () => {
      this.moveLeft = true;
    });
    leftButton.on('pointerup', () => {
      this.moveLeft = false;
    });
    leftButton.on('pointerout', () => {
      this.moveLeft = false;
    });

    rightButton.on('pointerdown', () => {
      this.moveRight = true;
    });
    rightButton.on('pointerup', () => {
      this.moveRight = false;
    });
    rightButton.on('pointerout', () => {
      this.moveRight = false;
    });

    jumpButton.on('pointerdown', () => {
      if (this.player.body.touching.down) {
        this.player.jump();
      }
    });

    return group;
  }

  updateMobileControls() {
    const isMobile = window.innerWidth < 800 || window.innerHeight < 600;

    if (isMobile && !this.mobileControls) {
      this.mobileControls = this.addMobileControls();
    } else if (!isMobile && this.mobileControls) {
      this.mobileControls.destroy(true);
      this.mobileControls = null;
    }
  }
}
