import "phaser";
// import BBCodeTextPlugin from 'phaser3-rex-plugins/plugins/bbcodetext-plugin';
import { bootGame } from "./scenes/bootGame";
import { guideGame } from "./scenes/guideGame";
import { mainGame } from "./scenes/mainGame";

const config: Phaser.Types.Core.GameConfig = {
  title: "Gold Miner by Bac Pham",
  version: "1.0",
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  // resolution: window.devicePixelRatio || 1,
  type: Phaser.AUTO,
  scene: [bootGame, guideGame, mainGame],
  physics: {
    default: 'arcade',
    arcade: {
        fps: 60,
        gravity: { y: 0 },
        debug: true
    }
  },
  input: {
    keyboard: true,
    mouse: true,
    touch: true,
    gamepad: false
  },
  // plugins: {
  //   global: [{
  //       key: 'rexBBCodeTextPlugin',
  //       plugin: BBCodeTextPlugin,
  //       start: true
  //   },
  //   // ...
  //   ]
  // },
  backgroundColor: "#000000",
  render: { 
    // pixelArt: true, 
    antialias: true,
    roundPixels: true
   }
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.addEventListener("load", () => {
  var game = new Game(config);
});
