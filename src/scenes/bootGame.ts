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
        this.scene.stop('mainGame');
        const bg = this.add.image(0, 0, 'background').setOrigin(0);
        bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        this.startbtn = this.add.sprite(this.cameras.main.width*2.8/4, this.cameras.main.height*3.3/4, 'startbtn').setInteractive().setScale(0.5).on('pointerdown', function(pointer){
            this.scene.start('guideGame');
            // this.scale.startFullscreen();
        }.bind(this));;
    }

    update() {
        
    }

}