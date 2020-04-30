
export class guideGame extends Phaser.Scene {
    constructor() {
        super({
            key: 'guideGame'
        });
    }

    preload() {
        this.load.image('gameMain', 'assets/gameMain.png');
        this.load.image('lcloudGuide', 'assets/lcloud-guide.png');
        this.load.plugin('rexbbcodetextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbbcodetextplugin.min.js', true);
    }   
    create() {
        this.add.image(0, 0, 'gameMain').setOrigin(0, 0).setDisplaySize(window.innerWidth, window.innerHeight);
        this.createNote();
    } 

    createNote() {
        // @ts-ignore
                // var text = this.add.rexBBCodeText(100, 30, s1, {
                //     backgroundColor: '#555',
                //     fontSize: '60px',
                //     align: 'right',
                //     wrap: {
                //         mode: 'char',
                //         width: 200
                //     },
        
                //     stroke: 'red',
                //     strokeThickness: 1,
                //     shadow: {
                //         offsetX: 5,
                //         offsetY: 5,
                //         blur: 5,
                //         color: 'yellow'
                //     },
        
                //     underline: {
                //         color: '#000',
                //         thickness: 2,
                //         offset: 1
                //     }
                // });
                
        let description = `
        1. Bác sĩ / Dược sĩ hãy sử dụng chiếc ngàm và ròng rọc để chọn viên
        ngọc có chứa đáp án đúng.\n
        2. Chiếc ngàm sẽ đung đưa qua lại. Nhấn vào màn hình để hạ thiết bị.\n
        3. Những viên ngọc to sẽ kéo lâu hơn.\n
        4. Người chơi có [b]3 mạng[/b]. Khi chọn sai đáp án thì viên ngọc sẽ
        nổ tung và người chơi bị trừ 1 mạng.\n
        5. Người chơi có [b]2 quyền[/b] trợ giúp và sẽ được lựa chọn sử dụng
        giữa mỗi câu hỏi.\n
        6. Bác sĩ có [b]10 giây[/b] để đọc câu hỏi trước khi chơi.\n
        Chúc Bác sĩ / Dược sĩ kéo thật nhiều ngọc!`;
        var lcloud = this.add.sprite(0, 0, 'lcloudGuide');
        var style = { fontFamily:   "'Roboto Condensed', sans-serif", fontSize: '64px', color: "#0000ff", fontWeight: '900', wordWrap: {
            width: lcloud.width
        } , align: "center"};
        var textQ = this.add.text(0, -lcloud.height/3, 'HƯỚNG DẪN', style);
        textQ.setOrigin(0.5, 0.5);
        textQ.setStroke('#ffffff', 10);
        // @ts-ignorets-lint
        var textQs = this.add.rexBBCodeText(-30, -lcloud.height/30, description,{
                fontFamily: "'Roboto Condensed', sans-serif",
                fontSize: '28px',
                color: '#222',
                halign: 'left',
                valign:'top',
                wrap: {
                    mode: 'word',
                    width: lcloud.width - 120
                }
            }).setOrigin(0.5, 0.5);
        var bottomText = this.add.text(-10, lcloud.height/2 - 120, 'SẴN SÀNG!', { fontFamily:   "'Roboto Condensed', sans-serif", fontSize: '70px', color: "#fff", wordWrap: {
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