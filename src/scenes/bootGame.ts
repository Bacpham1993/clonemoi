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
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width*0.2/2, height/2, width*0.8, 50);

        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Đang tải...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        
        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 15,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 80,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });

        assetText.setOrigin(0.5, 0.5);
        
        this.load.on('progress', function (value) {
            var percenString = value * 100;
            percentText.setText(percenString.toFixed(0) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width*0.2/2+10, height/2+10, (width*0.8-20)*value, 30)
        });
        
        this.load.on('fileprogress', function (file) {
            assetText.setText('Tải: ' + file.key);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });
        this.load.image('background', 'assets/background-new.png');
        this.load.image('startbtn', 'assets/start.png');
        this.load.image('gameMain', 'assets/gameMain.png');
        this.load.image('doctor', 'assets/bacsi.png');
        this.load.image('pulley', 'assets/rongroc.png');
        this.load.image('mortise', 'assets/ngoam.png');
        this.load.image('lcloud', 'assets/lcloud.png');
        this.load.image('lcloud-q', 'assets/lcloud-q.png');
        this.load.image('lcloud-end', 'assets/lcloud-end.png');
        this.load.image('cloud', 'assets/cloud.png');
        this.load.image('time', 'assets/time.png');
        this.load.image('jw11', 'assets/jw-11.png');
        this.load.image('jw21', 'assets/jw-21.png');
        this.load.image('jw12', 'assets/jw-12.png');
        this.load.image('jw22', 'assets/jw-22.png');
        this.load.image('jw13', 'assets/jw-13.png');
        this.load.image('jw23', 'assets/jw-23.png');
        this.load.image('heart', 'assets/heart.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('timeplus', 'assets/timeplus.png');
        this.load.image('restart', 'assets/restart.png');
        this.load.image('lcloudGuide', 'assets/lcloud-guide.png');
        this.load.audio('explosion', ['assets/explosion.m4a']);
        this.load.audio('gamewon', ['assets/gamewon.m4a']);
        this.load.audio('backgroundSound', ['assets/background.m4a']);
        this.load.spritesheet('exp', 'assets/exp.png', {frameWidth: 64, frameHeight: 64, endFrame: 23});
        this.load.plugin('rexbbcodetextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbbcodetextplugin.min.js', true);
        // this.load.image('gameMain', 'assets/gameMain.png');
        // this.load.plugin('rexbbcodetextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbbcodetextplugin.min.js', true);
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