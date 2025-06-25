# Space Dude Platformer

A simple platformer game built with [Phaser 3](https://phaser.io/).  
Guide your space dude, collect points, and avoid the baddies!

## Features

- Classic platformer gameplay
- Score tracking and Game Over screen
- Restart button with interactive UI
- Responsive design for desktop browsers

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (optional, for local server)
- [Phaser 3](https://phaser.io/) (included via CDN or local file)

### Running Locally

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-username/space-dude-platformer.git
   cd space-dude-platformer
   ```

2. **Open `index.html` in your browser**  
   Or, for best results, use a local server:

   ```sh
   npx serve .
   ```

   or

   ```sh
   python -m http.server
   ```

3. **Play the game!**

### Folder Structure

```
.
├── dist/                # Deployment-ready files (index.html, manifest, favicon, etc.)
├── src/
│   └── scenes/          # Game scenes (Game.js, GameOver.js, etc.)
├── assets/              # Images, sprites, audio
├── package.json         # (optional) For npm scripts or dependencies
└── README.md
```

## Deployment

You can deploy this game as a static site, for example using **GitHub Pages**:

1. Build or copy your files to the `dist/` folder.
2. Push to your GitHub repository.
3. In your repo settings, enable GitHub Pages and set the source to `/dist` (or root).
4. Access your game at `https://your-username.github.io/your-repo-name/`.

## Credits

- [Phaser 3](https://phaser.io/)
- Game art and sounds: (add credits if using third-party assets)

## License

MIT License. See [LICENSE](LICENSE) for
