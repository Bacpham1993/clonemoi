export class bootGame extends Phaser.Scene {
    private startbtn;
    constructor() {
        super({
            key: 'bootGame'
        });
        
    }
    init() {
       
        
    }
    preload() {
        this.load.image('background', 'assets/background-new.png');
        this.load.image('startbtn', 'assets/start.png');
    }

    create() {   
        const bg = this.add.image(0, 0, 'background').setOrigin(0);
        bg.setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);
        this.startbtn = this.add.sprite(this.sys.canvas.width*2.8/4, this.sys.canvas.height*3.3/4, 'startbtn').setInteractive().setScale(0.5).on('pointerdown', function(pointer){
            this.scene.start('guideGame');
            // this.scale.startFullscreen();
        }.bind(this));;
    }

    update() {
        
    }

}