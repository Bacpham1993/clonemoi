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
        this.startbtn = this.add.sprite(this.sys.canvas.width*2.8/4, this.sys.canvas.height*3.3/4, 'startbtn').setInteractive();
        this.startbtn.setScale(0.5);
        var that = this;
        this.startbtn.on('pointerdown', function(pointer){
            that.scene.start('mainGame');
            // this.scale.startFullscreen();
        })
       
    }

    update() {
        
    }

}