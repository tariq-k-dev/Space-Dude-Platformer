export class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create(data) {
    this.cameras.main.setBackgroundColor(0x0a3d62);

    this.add.image(400, 300, 'background').setAlpha(0.5);

    // Calculate vertical positions
    const centerX = 400;
    const centerY = 300;
    const spacing = 60;

    const gameOverY = centerY - spacing;
    const scoreY = centerY;
    const buttonY = centerY + spacing;

    // Game Over text
    this.add
      .text(centerX, gameOverY, 'Game Over', {
        fontFamily: 'Arial Black',
        fontSize: 64,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center',
      })
      .setOrigin(0.5);

    // Show final score
    this.add
      .text(centerX, scoreY, `Final Score: ${data.score ?? 0}`, {
        fontFamily: 'Arial',
        fontSize: 36,
        color: '#E6E8FA',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center',
      })
      .setOrigin(0.5);

    // Add Restart Button
    const buttonWidth = 200;
    const buttonHeight = 60;
    const buttonRadius = 20;

    // Create graphics for the button background
    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(0x3742fa, 1);
    buttonBg.fillRoundedRect(
      centerX - buttonWidth / 2,
      buttonY - buttonHeight / 2,
      buttonWidth,
      buttonHeight,
      buttonRadius
    );

    // Add the text on top
    const restartButton = this.add
      .text(centerX, buttonY, 'Restart', {
        fontFamily: 'Arial',
        fontSize: 40,
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // Make the graphics respond to pointer events
    buttonBg.setInteractive(
      new Phaser.Geom.Rectangle(
        centerX - buttonWidth / 2,
        buttonY - buttonHeight / 2,
        buttonWidth,
        buttonHeight
      ),
      Phaser.Geom.Rectangle.Contains
    );

    // Pointer events for both text and background
    const onPointerOver = () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x5352ed, 1);
      buttonBg.fillRoundedRect(
        centerX - buttonWidth / 2,
        buttonY - buttonHeight / 2,
        buttonWidth,
        buttonHeight,
        buttonRadius
      );
    };

    const onPointerOut = () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x3742fa, 1);
      buttonBg.fillRoundedRect(
        centerX - buttonWidth / 2,
        buttonY - buttonHeight / 2,
        buttonWidth,
        buttonHeight,
        buttonRadius
      );
    };

    const onPointerDown = () => {
      this.scene.start('Game');
    };

    restartButton.on('pointerover', onPointerOver);
    restartButton.on('pointerout', onPointerOut);
    restartButton.on('pointerdown', onPointerDown);

    buttonBg.on('pointerover', onPointerOver);
    buttonBg.on('pointerout', onPointerOut);
    buttonBg.on('pointerdown', onPointerDown);
  }
}
