import { Sleeping } from "matter";

export class mainGame extends Phaser.Scene {
    private mortise;
    private mortiseDefault = new Phaser.Math.Vector2(0,0);
    private pulley;
    private doctor;
    private lineOnPulley;
    private hookLine;
    private rotation_dir = 0.01;
    private pod_status = 'rotate';
    private initTime = 1;
    private gameTime = 30;
    private timeText: Phaser.GameObjects.Text;
    private diamondPick;
    private textPick;
    private inputSome;
    private stageNum = 0;
    private lineReplaceOnPulley;
    private trueAnswer = 0;
    private trueAnswerInLevel = 0;
    private checkInputSome: boolean;
    private gameTimeEvent;
    private cloudx;
    private checkGift = {
        timePlus: false,
        restart: false
    };
    private lifeSpanGame: Phaser.GameObjects.Container;
    private diamondGame: Array<Phaser.GameObjects.Container>;
    private questionSheet = [
        {
            ques: 'Theo quy định của WHO và luật người cao tuổi Việt Nam, công dân Việt Nam từ độ tuổi nào được định nghĩa là "Người cao tuổi"',
            ans: [
                '55',
                '60',
                '65',
                '70'
            ],
            rig: [1]
        },
        {
            ques: 'Tỉ lệ tăng huyết áp ở nhóm dân số > 60 tuổi ở Việt Nam',
            ans: [
                '> 60%', 
                'giống nhóm dân số trẻ', 
                'tăng theo tuổi – tuổi càng cao tỉ lệ càng cao', 
                'khoảng 30%'
            ],
            rig: [0,2]
        },
        {
            ques: 'Những đặc điểm của bệnh nhân tăng huyết áp > 60 tuổi',
            ans: [
                'hoạt tính hệ renin suy giảm', 
                'thường gặp tăng huyết áp tâm thu đơn độc', 
                'nguy cơ đột quỵ cao', 
                'nhiều bệnh lý mắc kèm',
                'thường gặp hội chứng lão hóa'
            ],
            rig: [0,1,2,3,4]
        },
        {
            ques: 'Theo khuyến cáo của hội Tim mạch/ THA châu  u và hội Tim mạch học Việt Nam, nhóm thuốc được ưu tiên cho bệnh nhân cao tuổi – tăng huyết áp tâm thu đơn độc là',
            ans: [
                'Lợi tiểu và chẹn kênh canxi', 
                'các thuốc ức chế hệ RAS', 
                'vai trò các nhóm thuốc như nhau', 
                'chẹn beta' 
            ],
            rig: [0]
        },
        {
            ques: 'theo các công trình nghiên cứu, nhóm thuốc nào có khả năng ngừa đột quỵ tốt hơn các nhóm khác',
            ans: [
                'lợi tiểu thiazide-like và chẹn kênh canxi', 
                'ƯCMC/ƯCTT', 
                'chẹn beta', 
                'cả 5 nhóm đều ngừa đột quỵ tốt' 
            ],
            rig: [0]
        },
        {
            ques: 'Ở Việt Nam có những viên phối hợp cố định nào của lợi tiểu và chẹn kênh canxi',
            ans: [
                'Indapamide SR/Amlodipine',
                'không có', 
                'HCTZ/amlodipine', 
                'có rất nhiều để lựa chọn'
            ],
            rig: [0]
        },

    ];
    constructor() {
        super({
            key: 'mainGame'
        });
    }
    preload() {
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
        this.load.audio('explosion', ['assets/explosion.m4a']);
        this.load.audio('gamewon', ['assets/gamewon.m4a']);
        this.load.spritesheet('exp', 'assets/exp.png', {frameWidth: 64, frameHeight: 64, endFrame: 23});
        this.load.plugin('rexbbcodetextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbbcodetextplugin.min.js', true);
    }
    create() {
        this.add.image(0, 0, 'gameMain').setOrigin(0, 0).setDisplaySize(window.innerWidth, window.innerHeight);
        this.doctor = this.add.sprite(this.cameras.main.width/2 + 50, this.cameras.main.height/2 - 100, 'doctor').setScale(0.5);
        this.pulley = this.physics.add.sprite(this.cameras.main.width/2 - 30, this.cameras.main.height/2 - 80, 'pulley').setScale(0.5);
        this.mortise = this.physics.add.sprite(0, 90, 'mortise').setScale(0.5);
        this.lineOnPulley = this.add.line(0, 0, 0, 0, 0, 55, 0x222222, 1).setOrigin(0);
        this.lineOnPulley.setName('lineOnPulley');
        this.hookLine = this.add.container(this.cameras.main.width/2 - 30, this.cameras.main.height/2 - 80); 
        this.hookLine.add([this.mortise, this.lineOnPulley]);
        this.physics.world.enable(this.hookLine);
        this.hookLine.body.onWorldBounds = true;
        this.hookLine.body.collideWorldBounds = true;
        this.mortiseDefault.x = this.hookLine.x;
        this.mortiseDefault.y = this.hookLine.y;
        this.lineReplaceOnPulley = this.add.line(this.mortiseDefault.x, this.mortiseDefault.y, 0, 0, 0, 0, 0x222222, 1).setOrigin(0);
         // time
         var timeOnGame = this.add.sprite(0, 0, 'time');
         this.timeText = this.add.text(40, 0, this.formatTime(this.gameTime),
         { fontFamily: "'Roboto Condensed', sans-serif", fontSize: '50px', color: "#ffffff", wordWrap: {
             width: timeOnGame.width
         } , align: "center"} );
         this.timeText.setOrigin(0.5, 0.5);
         var containerTime = this.add.container(this.cameras.main.width - 300, 50);
         // end Time
         containerTime.add(timeOnGame);
         containerTime.add(this.timeText);
         containerTime.setScale(0.5);
         this.lifeSpanGame = this.createLifeSpan();
         this.mortise.body.onWorldBounds = true;
         this.physics.world.on('worldbounds', function(body) {
             this.diamondPick = null;
             this.pod_status = 'rewind';
         }.bind(this));
         this.inputSome = this.input.on('pointerdown', function(){
             if(this.checkInputSome) {
                 this.pod_status = 'rotate';
             } else {
                 this.pod_status = 'shoot';
             }
         }.bind(this));
        this.gameStart();
    }

    gameStart() {
        if (this.diamondGame) {
            for(var i = 0; i < this.diamondGame.length; i++) {
                this.diamondGame[i].destroy();
            };
            this.initTime = 10;
        } 
        this.diamondGame = this.createDiamond();
        this.createQuestion(`CÂU HỎI ${this.stageNum + 1}`, this.questionSheet[this.stageNum].ques);   
    }

    createBomb(ansOK: any) {
        if(ansOK !== null){
            var config = {
                key: 'explode',
                frames: this.anims.generateFrameNumbers('exp', { start: 0, end: 23, first: 23 }),
                frameRate: 20,
            };
        
            this.anims.create(config);
        
            var boom = this.add.sprite(this.mortiseDefault.x, this.mortiseDefault.y, 'exp').setScale(2);
            var explosion = this.sound.add('explosion', {
                volume: 1
            });
        
            boom.anims.play('explode');
            explosion.play();
        }
        if(this.lifeSpanGame.length > 1) {
            this.lifeSpanGame.removeAt(this.lifeSpanGame.length - 1, true);
        } else {
            this.lifeSpanGame.destroy();
            this.createEndGame();
        }
    }

    createRight(trueLength: number) {
        this.trueAnswer += 1;
        this.trueAnswerInLevel += 1 ;
        var heart = this.add.sprite(this.doctor.x + 60, this.doctor.y, 'heart').setScale(0.5);
        this.tweens.add({
            targets: heart,
            alpha: { from: 0.5, to: 1 },
            ease: 'Bounce',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: -1,            // -1: infinity
            yoyo: true
        });
        var gamewon = this.sound.add('gamewon', {
            volume: 1
        });
        gamewon.on('complete', function() {
            heart.destroy();
        }, this)
        gamewon.play();
        if(this.trueAnswerInLevel === trueLength) {
            this.createNextLevel();   
        }
    }

    createLifeSpan(){
        var containerStar = this.add.container(50, 50);
        var star1 = this.add.sprite(0, 0, 'star');
        // var star2 = this.add.sprite(140, 0 , 'star');
        // var star3 = this.add.sprite(280, 0, 'star');
        containerStar.add([star1, ]).setScale(0.5, 0.5);
        this.tweens.add({
            targets: containerStar,
            alpha: { from: 0.5, to: 1 },
            ease: 'linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 500,
            repeat: -1,            // -1: infinity
            yoyo: true
        });
        return containerStar;
    }

    createDiamond(){
        var collides = new Array();
        var containerCollides = new Array();
        var dArray = ['jw11','jw21','jw12','jw22','jw13','jw23'];
        var boundNum = 12;
        var textAns: Phaser.GameObjects.Text;
        for(var i = 0; i < boundNum; i++) {
            collides[i] = this.physics.add.sprite(0, 0, dArray[Math.floor(Math.random() * Math.floor(6))]).setOrigin(0);
            if(i < this.questionSheet[this.stageNum].ans.length) {
                var style = { fontFamily: "'Roboto Condensed', sans-serif", fontSize: `${Math.floor(collides[i].width/3)}px`, color: "#ffffff", wordWrap: {
                    width: collides[i].width
                } , align: "center"};
                textAns = this.add.text(collides[i].width/3, collides[i].height/4, this.questionSheet[this.stageNum].ans[i], style).setName('answ');
            }
            let rndX = this.cameras.main.width/12*i;
            let rndY = Phaser.Math.FloatBetween(this.cameras.main.height/2 + 150 , this.cameras.main.height - 150)
            containerCollides[i] = this.add.container(rndX, rndY);
            containerCollides[i].add(collides[i]);
            if(i < this.questionSheet[this.stageNum].ans.length) {
                containerCollides[i].add(textAns);
            }
            this.physics.world.enable(containerCollides[i]);
            this.physics.add.overlap(this.mortise, containerCollides[i], function(ob1, ob2){
                this.diamondPick = ob2;
                this.textPick = this.diamondPick.getByName('answ') ? this.diamondPick.getByName('answ').text : null; 
                this.pod_status = 'rewind';
            }.bind(this))
        };
        return containerCollides;
    }

    createTimeGame() {
        var timeEventGame = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: function() {
                this.gameTime -= 1;
                this.timeText.setText(this.formatTime(this.gameTime));
                if(this.gameTime === 0) {
                    timeEventGame.destroy();
                    this.createEndGame();
                }
            },
            callbackScope: this
        });
        return timeEventGame;
    }

    createQuestion(quesNum: string, quesDes: string) {
        this.checkInputSome = true;
        var timeEvent10 = this.time.addEvent({
            delay: 1000,
            callback: function() {
                this.initTime -= 1;
                time10.setText(this.formatTime(this.initTime));
                if (this.initTime === 0) {
                    timeEvent10.destroy();
                    container.destroy();
                    var cloudm = this.add.sprite(0, 0, 'cloud');
                    var quesx = this.add.rexBBCodeText(0, 0, `${quesDes}`,{
                        fontFamily: "'Roboto Condensed', sans-serif",
                        fontSize: '28px',
                        color: '#222',
                        halign: 'center',
                        valign: 'center',
                        origin: { x: 0.5, y: 0.5 },
                        wrap: {
                            mode: 'word',
                            width: lcloud.width - 100
                        }
                    }).setOrigin(0.5, 0.5);
                    this.cloudx = this.add.container(this.cameras.main.width/2, 100, [cloudm, quesx])
                    this.checkInputSome = false;
                    this.createTimeGame();
                }
            },
            callbackScope: this,
            loop: true
        });
        var lcloud = this.add.sprite(0, 0, 'lcloud');
        var lcloudQ = this.add.sprite(lcloud.width*3/4, lcloud.height*0.5, 'lcloud-q').setScale(0.7);
        var style = { fontFamily: "'Roboto Condensed', sans-serif", fontSize: '64px', color: "#0000ff", wordWrap: {
            width: lcloud.width - 100
        } , align: "center"};
        var styleQ = { fontFamily: "'Roboto Condensed', sans-serif", fontSize: '64px', color: "#222", wordWrap: {
            width: lcloud.width - 100
        }  , align: "center"};
        var textQ = this.add.text(0, -lcloud.height/2 + 100 , `${quesNum}`, style);
        var textQs = this.add.text(0, -lcloud.height/8, `${quesDes}`, styleQ);
        var time10 = this.add.text(0, lcloud.height/2 - 120, this.formatTime(this.initTime), { fontFamily: "'Roboto Condensed', sans-serif", fontSize: '90px', color: "#fff", wordWrap: {
            width: lcloud.width - 100
        }  , align: "center"}); 
        textQ.setOrigin(0.5, 0.5);
        textQs.setOrigin(0.5, 0.5);
        time10.setOrigin(0.5,0.5);
        var container = this.add.container(this.cameras.main.width/2, this.cameras.main.height/2);
        container.add(lcloud);
        container.add(lcloudQ);
        container.add(textQ);
        container.add(textQs);
        container.add(time10);
        container.setScale(0.5);
    }

    formatTime(seconds){
        // Minutes
        var minutes = Math.floor(seconds/60);
        // Seconds
        var partInSeconds = seconds%60;
        // Adds left zeros to seconds
        var partInSecondsC = partInSeconds.toString().padStart(2,'0');
        // Returns formated time
        return `${minutes.toString().padStart(2,'0')}:${partInSecondsC}`
    }

    update(time, delta) {
        var hihi = Phaser.Math.Angle.BetweenPoints(new Phaser.Math.Vector2(this.hookLine.x, this.hookLine.y), new Phaser.Math.Vector2(this.mortiseDefault.x, this.mortiseDefault.y));
        var haha = Phaser.Math.Distance.BetweenPoints(new Phaser.Math.Vector2(this.hookLine.x, this.hookLine.y), new Phaser.Math.Vector2(this.mortiseDefault.x, this.mortiseDefault.y));
        switch(this.pod_status) {
            case 'rotate': 
                this.hookLine.rotation += this.rotation_dir*delta/3;
                if(this.hookLine.rotation >= Phaser.Math.DegToRad(70) || this.hookLine.rotation <= -Phaser.Math.DegToRad(70)) {
                    this.rotation_dir *= -1;
                };
                break;
            case 'shoot': 
                this.hookLine.x += 10*Math.cos(Phaser.Math.DegToRad(90) + this.hookLine.rotation);
                this.hookLine.y += 10*Math.sin(Phaser.Math.DegToRad(90) + this.hookLine.rotation);
                this.lineReplaceOnPulley.setTo(0, 0, -haha * Math.cos(hihi), -haha * Math.sin(hihi))
                break;
            case 'rewind':
                let slowdown = 0;
                if (this.diamondPick) {
                    if ( this.diamondPick.scale === 1.5) {
                        slowdown = 6;
                    } else if (this.diamondPick.scale === 1) {
                        slowdown = 3;
                    } else {
                        slowdown = 0;
                    }
                }
                this.hookLine.x -= (10-slowdown)*Math.cos(Phaser.Math.DegToRad(90) + this.hookLine.rotation);
                this.hookLine.y -= (10-slowdown)*Math.sin(Phaser.Math.DegToRad(90) + this.hookLine.rotation);
                this.lineReplaceOnPulley.setTo(0, 0, -haha * Math.cos(hihi), -haha * Math.sin(hihi));
                if(this.diamondPick) {
                    this.diamondPick.x -= (10-slowdown)*Math.cos(Phaser.Math.DegToRad(90) + this.hookLine.rotation);
                    this.diamondPick.y -= (10-slowdown)*Math.sin(Phaser.Math.DegToRad(90) + this.hookLine.rotation);
                }
                if(this.hookLine.y <= this.mortiseDefault.y) {
                    this.hookLine.x = this.mortiseDefault.x;
                    this.hookLine.y = this.mortiseDefault.y;
                    this.hookLine.rotation = 0;
                    if(this.diamondPick) {
                        this.diamondPick.destroy();
                        if (typeof(this.diamondPick.getByName('answ')) !== null) {
                            const quesOK = this.questionSheet[this.stageNum];
                            const ansOK = this.textPick;
                            if(quesOK.rig.includes(quesOK.ans.indexOf(ansOK))) {
                                this.createRight(quesOK.rig.length);
                            } else {
                                this.createBomb(ansOK);
                            }
                        }
                    }
                    this.pod_status = 'rotate';
                }
                break;
            default: break;
        }        
    }

    createEndGame() {
        this.time.removeAllEvents();
        this.cloudx.destroy();
        this.timeText.setText(this.formatTime(30));
        this.checkInputSome = true;
        this.trueAnswerInLevel = 0;
        this.createNote('[b]SỐ ĐÁP ÁN ĐÚNG[/b]', 'CHƠI LẠI', true);
    }

    createNextLevel() {
        this.time.removeAllEvents();
        this.cloudx.destroy();
        this.checkInputSome = true;
        this.trueAnswerInLevel = 0;
        this.createNote('[b]CHỌN VẬT PHẨM[/b]', 'TIẾP TỤC', false);
    }

    createNote(quesNum: string, bottomDes: string, done: boolean) {
        var lcloud;
        var lcloudQ;
        if (!done) {
            lcloud = this.add.sprite(0, 0, 'lcloud');
            lcloudQ = this.add.sprite(lcloud.width*3/4, lcloud.height*0.5, 'lcloud-q').setScale(0.7);
        } else {
            lcloud = this.add.sprite(0,0, 'lcloud-end');
        }
        var style = { fontFamily: "'Roboto Condensed', sans-serif", fontSize: '64px', color: "#0000ff", wordWrap: {
            width: lcloud.width - 100
        } , align: "center"};
        // var textQ = this.add.text(0, done ? 0 : -lcloud.height/3, `${quesNum}`, style);
        // @ts-ignore
        var textQ = this.add.rexBBCodeText(0, done ? -lcloud.height/7 : -lcloud.height/3, `${quesNum}`,{
            fontFamily: "'Roboto Condensed', sans-serif",
            fontSize: '64px',
            color: '#0000ff',
            halign: 'center',
            valign: 'top',
            origin: { x: 0.5, y: 0.5 },
            wrap: {
                mode: 'word',
                width: lcloud.width - 100
            }
        }).setOrigin(0.5, 0.5);
        textQ.setOrigin(0.5, 0.5);
        if(!done) {
            var containerTexture = this.createTexture(lcloud, -lcloud.width/3.2, -lcloud.height/8, done);
        } else {
            var containerTexture = this.createTexture(lcloud, 0, -lcloud.height/8, done);
        } 
        var bottomText = this.add.text(0, lcloud.height/2 - 120, `${bottomDes}`, { fontFamily: "'Roboto Condensed', sans-serif", fontSize: '90px', color: "#fff", wordWrap: {
            width: lcloud.width - 100
        }  , align: "center"});
        bottomText.setOrigin(0.5,0.5);
        bottomText.setInteractive(new Phaser.Geom.Rectangle(0, 0, bottomText.width, bottomText.height), Phaser.Geom.Rectangle.Contains);
        bottomText.on('pointerdown', function(pointer){
            container.destroy();
            if(!done) {
                this.stageNum +=1;
                this.gameStart();
            } else {
                this.stageNum = 0;
                this.gameTime = 30;
                this.lifeSpanGame = this.createLifeSpan();
                this.gameStart();
            }
        }.bind(this));
        var container = this.add.container(this.cameras.main.width/2, this.cameras.main.height/2);
        container.add(lcloud);
        if (!done) {
            container.add(lcloudQ);
        }
        container.add(textQ);
        container.add(containerTexture);
        container.add(bottomText);
        container.setScale(0.5);
        return container;
    }

    createTexture(lcloud: Phaser.GameObjects.Sprite, x: number, y: number, done: boolean) {
        var container1: Phaser.GameObjects.Container, container2: Phaser.GameObjects.Container, containerTotal: Phaser.GameObjects.Container;
        var styleQ = { fontFamily: "'Roboto Condensed', sans-serif", fontSize: '64px', color: "#222", wordWrap: {
            width: lcloud.width - 100
        }  , align: "center"};
        if (!done) {
            var restartButton = this.add.sprite(0, 0, 'restart').setScale(2.5).setInteractive();
            var timePlusButton = this.add.sprite(0, 0, 'timeplus').setScale(2.5).setInteractive();
            var textTime = this.add.text(0, timePlusButton.height + 80, '+10 giây', styleQ).setOrigin(0.5, 0.5);
            var textRestart = this.add.text(0, restartButton.height + 80, 'Chơi lại màn \nvừa rồi', styleQ).setOrigin(0.5, 0.5);
            container1 = this.add.container(0, 0).add([timePlusButton, textTime]);
            container1.setInteractive(new Phaser.Geom.Rectangle(0, 0, container1.width, container1.height), Phaser.Geom.Rectangle.Contains);
            timePlusButton.on('pointerdown', function(pointer){
                this.checkGift.timePlus = true;
                this.gameTime += 10;
                this.timeText.setText(this.formatTime(this.gameTime));
                container1.destroy();
            }.bind(this));
            container2 = this.add.container(lcloud.width/1.7, 0).add([restartButton, textRestart]);
            container2.setInteractive(new Phaser.Geom.Rectangle(0, 0, container2.width, container2.height), Phaser.Geom.Rectangle.Contains);
            restartButton.on('pointerdown', function(pointer){
                this.checkGift.restart = true;
                this.gameStart();
                container2.destroy();
            }.bind(this));
            if (this.checkGift.timePlus === true) container1.destroy();
            if (this.checkGift.restart === true) container2.destroy();
        } else {
            var emoji = this.add.text(-10, 130, `${this.trueAnswer < 6 ? '🙁 ' : '💖 '}  ${this.trueAnswer} / 11`, styleQ).setOrigin(0.5, 0.5);
            container1 = this.add.container(0, 0, emoji);
            var tempText = this.trueAnswer < 6 ? 'Bác sĩ hãy giúp bệnh nhân kiểm soát mức huyết áp của mình tốt hơn nhé' : 'chúc mừng bác sĩ đã giúp bệnh nhân kiểm soát huyết áp tốt';
            var textWinLose = this.add.text(0, 0, `${tempText}`, styleQ).setOrigin(0.5, 0.5);
            container2 = this.add.container(0, 300, textWinLose);
        }
        containerTotal = this.add.container(x,y).add([container1, container2]);
        return containerTotal;
    }

    // checkPointInCircle(I: Phaser.Math.Vector2, R: number, A: Phaser.Math.Vector2) {
    //     let ok: boolean;   
    //     let a = Math.sqrt((A.x - I.x)^2 + (A.y - I.y)^2);
    //     let b = R;
    //     if(a <= b) {
    //         ok = true;
    //         // console.log(a, b, a <= b);
    //     } else {
    //         ok = false;
    //         // console.log('check false',a, b, a <= b);
    //     };
    //     return ok;         
    // }

    // checkOK(R: number) {
    //     let i = 0;
    //     let A = new Array();
    //     A.push(new Phaser.Math.Vector2(Phaser.Math.Between(150, this.cameras.main.width - 150), Phaser.Math.RND.integerInRange(this.cameras.main.height/2 + 150 , this.cameras.main.height - 150)));
    //     while(i < 14) {
    //         let check = false;
    //         let F = new Phaser.Math.Vector2(Phaser.Math.RND.integerInRange(150, this.cameras.main.width - 150), Phaser.Math.RND.integerInRange(this.cameras.main.height/2 + 150 , this.cameras.main.height - 150));
    //         for(let k = 0; k < A.length; k++) {
    //             if (this.checkPointInCircle(A[k], R, F)) {
    //                 check = true;
    //                 break;                    
    //             };
    //                      };
    //         if(!check) {
    //             i += 1;
    //             A.push(F);
    //         }
    //     };
    //     console.log(A);
    //     return A;
        
    // }
    // checkOverlapMany(sprite, list) {
    
    //     for (var i = 0; i < list.length; i++)
    //     {
    //         if (this.physics.overlap(sprite, list )) return true;
    //     }
        
    //     return false;
    // }
    render() {
        
    }
   
}

