export class guideGame extends Phaser.Scene {
    constructor() {
        super({
            key: 'guideGame'
        });
    }

    preload() {
        this.load.image('guidebg', 'assets/guidebg.png');

    }   
    create() {
        this.add.image(0,0, 'guidebg').setOrigin(0).setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);
    } 
}