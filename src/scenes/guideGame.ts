export class guideGame extends Phaser.Scene {
    constructor() {
        super({
            key: 'guideGame'
        });
    }

    preload() {
        this.load.image('gameMain', 'assets/gameMain.png');
        this.load.image('lcloud', 'assets/lcloud.png');
    }   
    create() {
        this.add.image(0, 0, 'gameMain').setOrigin(0, 0).setDisplaySize(window.innerWidth, window.innerHeight);
        this.createNote();
        // var graphics = this.add.graphics();

        // graphics.lineStyle(2, 0x00ffff, 1);

        // graphics.strokeRect(guidebg.width/2 + 150, guidebg.height - 40, 300, 140)
        // .setInteractive(new Phaser.Geom.Rectangle(0, 0, 300, 140), Phaser.Geom.Rectangle.Contains)
        // .on('pointerdown', function(){
        //     this.scene.start('mainGame');
        // }.bind(this));
    } 

    createNote() {
        let description = `
        1. Bác sĩ hãy sử dụng chiếc ngàm và ròng rọc để chọn viên
        ngọc có chứa đáp án đúng nhé.\n
        2. Chiếc ngàm sẽ đung đưa qua lại. Nhấn vào màn hình để hạ  
        thiết bị.\n
        3. Những viên ngọc to sẽ khó kéo hơn.\n
        4. Người chơi có 3 mạng. Khi chọn sai đáp án thì viên ngọc sẽ
        nổ tung và người chơi bị trừ 1 mạng.\n
        5. Người chơi có 2 quyền trợ giúp và sẽ được lựa chọn và sử
        dụng giữa mỗi câu hỏi.\n
        6. Bác sĩ có 10 giây để đọc câu hỏi trước khi chơi.\n
        Hãy giúp bệnh nhân kiểm soát huyết áp thật tốt nhé!`;
        var lcloud = this.add.sprite(0, 0, 'lcloud');
        var style = { fontFamily: "Arial", fontSize: '64px', color: "#0000ff", wordWrap: {
            width: lcloud.width
        } , align: "center"};
        var styleQ = { fontFamily: "Arial", fontSize: '34px',color: "#222", wordWrap: {
            width: lcloud.width,
            height: lcloud.height
        }  , align: "left"};
        var textQ = this.add.text(0, -lcloud.height/2.5, 'HƯỚNG DẪN', style);
        textQ.setOrigin(0.5, 0.5);
        textQ.setStroke('#ffffff', 10);
        var textQs = this.add.text(0, -lcloud.height/12, description, styleQ).setOrigin(0.5, 0.5);
        var bottomText = this.add.text(30, lcloud.height/2 - 100, 'SẴN SÀNG', { fontFamily: "Arial", fontSize: '90px', color: "#fff", wordWrap: {
            width: lcloud.width
        }  , align: "center"});
        bottomText.setOrigin(0.5,0.5);
        bottomText.setInteractive(new Phaser.Geom.Rectangle(0, 0, bottomText.width, bottomText.height), Phaser.Geom.Rectangle.Contains);
        bottomText.on('pointerdown', function(pointer){
            this.scene.start('mainGame');
        }.bind(this));
        var container = this.add.container(this.cameras.main.width/2, this.cameras.main.height/2);
        container.add(lcloud);
        container.add(textQ);
        container.add(textQs);
        container.add(bottomText);
        container.setScale(0.7);
        return container;
    }
}