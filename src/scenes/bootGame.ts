export class bootGame extends Phaser.Scene {
    private startbtn;
    private textOrientation;
    private bootBackground;
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
        this.load.plugin('rexbbcodetextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbbcodetextplugin.min.js', true);
    }

    create() {
        // @ts-ignore
        this.textOrientation = this.add.rexBBCodeText(this.cameras.main.width/2, this.cameras.main.height/2, 'VUI LÒNG XOAY \nNGANG MÀN HÌNH', {
            fontFamily: "Arial",
            fontSize: '50px',
            color: '#fff',
            // backgroundColor: '#555',
            align: 'center',
            lineSpacing: 1.5,
            stroke: 'red',
            strokeThickness: 1,
            shadow: {
                offsetX: 5,
                offsetY: 5,
                blur: 5,
                color: 'yellow'
            },
            underline: {
                color: '#000',
                thickness: 2,
                offset: 1
            }
        }).setOrigin(0.5, 0.5);
        this.bootBackground = this.add.image(0, 0, 'background').setOrigin(0);;
        this.bootBackground.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        this.startbtn = this.add.sprite(this.cameras.main.width*2.8/4, this.cameras.main.height*3.3/4, 'startbtn').setInteractive().setScale(0.5).on('pointerdown', function(pointer){
            this.scene.start('guideGame');
            // this.scale.startFullscreen();
            
        }.bind(this));
        this.tweens.add({
            targets: this.textOrientation,
            alpha: { from: 0.5, to: 1 },
            ease: 'linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 500,
            repeat: -1,            // -1: infinity
            yoyo: true
        });
        this.checkOriention(this.scale.orientation);

        this.scale.on('orientationchange', this.checkOriention, this);
    }

    checkOriention (orientation)
    {
        if (orientation === Phaser.Scale.PORTRAIT)
        {
            this.scale.setGameSize(this.cameras.main.width, this.cameras.main.height);
            this.bootBackground.setAlpha(0);
            this.startbtn.setVisible(false);
            this.textOrientation.setVisible(true);
        }
        else if (orientation === Phaser.Scale.LANDSCAPE)
        {
            this.scale.setGameSize(this.cameras.main.width, this.cameras.main.height);
            this.bootBackground.setAlpha(1);
            this.startbtn.setVisible(true);
            this.textOrientation.setVisible(false);
        }
    }

    update() {
        
    }

}