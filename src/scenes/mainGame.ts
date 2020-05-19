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
    private initTime = 10;
    private gameTime = 60;
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
    private checkGiftNote;
    private cloudx;
    private lastTimeOfStage: number;
    private lastLifeSpanGame: number;
    private checkGift = {
        timePlus: false,
        restart: false
    };
    private resizeResolution = window.innerWidth/1333;
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
            ques: 'Theo khuyến cáo của hội Tim mạch / THA châu Âu và hội Tim mạch học Việt Nam, nhóm thuốc được ưu tiên cho bệnh nhân cao tuổi – tăng huyết áp tâm thu đơn độc là',
            ans: [
                'Lợi tiểu và chẹn kênh canxi', 
                'các thuốc ức chế hệ RAS', 
                'vai trò các nhóm thuốc như nhau', 
                'chẹn beta' 
            ],
            rig: [0]
        },
        {
            ques: 'Theo các công trình nghiên cứu, nhóm thuốc nào có khả năng ngừa đột quỵ tốt hơn các nhóm khác',
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
        this.load.audio('backgroundSound', ['assets/background.m4a']);
        this.load.spritesheet('exp', 'assets/exp.png', {frameWidth: 64, frameHeight: 64, endFrame: 23});
        this.load.plugin('rexbbcodetextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbbcodetextplugin.min.js', true);
    }
    create() {
        // this.scale.on('resize', (gameSize, baseSize, displaySize, resolution, previousWidth, previousHeight) => {
            this.scale.setGameSize(window.innerWidth, window.innerHeight);
        // });
        this.add.image(0, 0, 'gameMain').setOrigin(0, 0).setDisplaySize(window.innerWidth, window.innerHeight);
        this.sound.add('backgroundSound', {
            mute: false,
            volume: 0.6,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }).play();
        this.doctor = this.add.sprite(this.cameras.main.width/2 + 50, this.cameras.main.height/2 - 100, 'doctor').setScale(0.5);
        this.pulley = this.add.sprite(this.cameras.main.width/2 - 30, this.cameras.main.height/2 - 80, 'pulley').setScale(0.5);
        this.mortise = this.physics.add.sprite(0, 90, 'mortise').setCircle(35, 0, 50).setScale(0.5);
        this.lineOnPulley = this.add.line(0, 0, 0, 0, 0, 55, 0x222222, 1).setOrigin(0);
        this.lineOnPulley.setName('lineOnPulley');
        this.hookLine = this.add.container(this.cameras.main.width/2 - 30, this.cameras.main.height/2 - 80); 
        this.hookLine.add([this.mortise, this.lineOnPulley]);
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
         var containerTime = this.add.container(this.cameras.main.width - 250*this.resizeResolution, 50);
         // end Time
         containerTime.add(timeOnGame);
         containerTime.add(this.timeText);
         containerTime.setScale(0.5);
         this.lifeSpanGame = this.createLifeSpan();
         this.mortise.body.onWorldBounds = true;
         this.mortise.body.collideWorldBounds = true;
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
            if(this.lifeSpanGame.length > 1) {
                this.lifeSpanGame.removeAt(this.lifeSpanGame.length - 1, true);
            } else {
                this.lifeSpanGame.destroy();
                this.createEndGame();
            }
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
        console.log(trueLength, this.trueAnswerInLevel, this.questionSheet.length);
        if(this.trueAnswerInLevel === trueLength) {
            // console.log(trueLength, this.trueAnswerInLevel, this.questionSheet.length);
            if (this.stageNum === this.questionSheet.length - 1) {
                this.createEndGame();
            } else {
                this.createNextLevel();   
            }
        }
        // console.log(this.trueAnswer, trueLength);
    }

    createLifeSpan(star = 3){
        var containerStar = this.add.container(50, 50);
        var starCon = new Array();
        for(var i = 0; i < star; i++) { 
            starCon[i] = this.add.sprite(140*i, 0, 'star');
        }
        // var star1 = this.add.sprite(0, 0, 'star');
        // var star2 = this.add.sprite(140, 0 , 'star');
        // var star3 = this.add.sprite(280, 0, 'star');
        containerStar.add(starCon);
        containerStar.setScale(0.5, 0.5);
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
        var dArray = ['jw13','jw23'];
        var boundNum = 9;
        var RNDScale = [2/3, 1, 4/3];
        RNDScale = RNDScale.map((val) => {
            return val * (this.resizeResolution - 0.1);
        });
        var textAns: Phaser.GameObjects.Text;
        for(var i = 0; i < boundNum; i++) {
            collides[i] = this.add.sprite(0, 0, dArray[Math.floor(Math.random() * Math.floor(2))]).setOrigin(0.2);
            let rndX = 0;
            if(i === boundNum - 1) {
                rndX = this.cameras.main.width/9*i + 25*this.resizeResolution;
            } else {
                rndX = this.cameras.main.width/9*i + 75*this.resizeResolution;
            }
            let rndY = Phaser.Math.FloatBetween(this.cameras.main.height/2 + 75*this.resizeResolution , this.cameras.main.height - 180*this.resizeResolution)
            containerCollides[i] = this.add.container(rndX, rndY);
            containerCollides[i].add(collides[i]);
            this.physics.world.enable(containerCollides[i]);
        };
        this.shuffle(containerCollides);
        for(var i = 0; i < boundNum; i++) {
            var abc = Math.floor(Math.random() * Math.floor(3));
            if(i < this.questionSheet[this.stageNum].ans.length) {
                // @ts-ignore
                textAns = this.add.rexBBCodeText(0, 0, this.questionSheet[this.stageNum].ans[i],{
                    fontFamily: "'Roboto Condensed', sans-serif",
                    fontSize: `${Math.floor(collides[i].width/5)}px`,
                    color: '#ffffff',
                    halign: 'center',
                    valign: 'center',
                    wrap: {
                        mode: 'word',
                        width: collides[i].width-65
                    }
                }).setOrigin(0.5).setName('answ');
                Phaser.Display.Align.In.Center(textAns, collides[i]);
                containerCollides[i].add(textAns);
                if(this.questionSheet[this.stageNum].ans[i].length > 20) {
                    containerCollides[i].setScale(RNDScale[2]);
                    textAns.setFontSize(12*this.resizeResolution);
                } else if(this.questionSheet[this.stageNum].ans[i].length > 5){
                    containerCollides[i].setScale(RNDScale[1]);
                    textAns.setFontSize(13*this.resizeResolution);
                } else {
                    containerCollides[i].setScale(RNDScale[abc], RNDScale[abc]);
                }
            }
            this.physics.add.overlap(this.mortise, containerCollides[i], function(ob1, ob2){
                this.diamondPick = ob2;
                this.textPick = this.diamondPick.getByName('answ') ? this.diamondPick.getByName('answ').text : null; 
                this.pod_status = 'rewind';
            }.bind(this))
        }
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
                            width: cloudm.width - 100
                        }
                    }).setOrigin(0.5, 0.5);
                    this.cloudx = this.add.container(this.cameras.main.width/2, 100, [cloudm, quesx]).setScale(0.7*this.resizeResolution)
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
        container.setScale(0.5*this.resizeResolution);
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
                this.hookLine.rotation += this.rotation_dir*delta/5;
                if(this.hookLine.rotation >= Phaser.Math.DegToRad(75) || this.hookLine.rotation <= -Phaser.Math.DegToRad(75)) {
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
                    // console.log(this.diamondPick);
                    if ( this.diamondPick.scale > 1) {
                        slowdown = 6;
                    } else if (this.diamondPick.scale > 0.5 ) {
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
                            let quesOK = this.questionSheet[this.stageNum];
                            let ansOK = this.textPick;
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
        this.stageNum = 0;
        this.gameTime = 60;
        this.lifeSpanGame.destroy();
        this.lifeSpanGame = this.createLifeSpan();
        this.timeText.setText(this.formatTime(this.gameTime));
        this.checkInputSome = true;
        this.trueAnswerInLevel = 0;
        this.checkGift.restart = false;
        this.checkGift.timePlus = false;
        this.checkGiftNote = this.createNote('[b]SỐ ĐÁP ÁN ĐÚNG[/b]', 'CHƠI LẠI', true);
    }

    createNextLevel() {
        this.time.removeAllEvents();
        this.cloudx.destroy();
        this.checkInputSome = true;
        this.checkGiftNote = this.createNote('[b]CHỌN VẬT PHẨM[/b]', 'TIẾP TỤC', false);
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
                this.trueAnswerInLevel = 0;
                this.lastTimeOfStage = this.gameTime;
                this.lastLifeSpanGame = this.lifeSpanGame.length; 
                this.stageNum +=1;
                this.gameStart();
            } else {
                this.trueAnswer = 0;
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

    createTexture(lcloud: Phaser.GameObjects.Sprite, x: number, y: number, done: boolean, container?: any) {
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
                container1.setAlpha(0.4);
                timePlusButton.disableInteractive();
            }.bind(this));
            container2 = this.add.container(lcloud.width/1.7, 0).add([restartButton, textRestart]);
            container2.setInteractive(new Phaser.Geom.Rectangle(0, 0, container2.width, container2.height), Phaser.Geom.Rectangle.Contains);
            restartButton.on('pointerdown', function(pointer){
                this.checkGift.restart = true;
                this.gameTime = this.stageNum === 0 ? 60 : this.lastTimeOfStage;
                this.timeText.setText(this.formatTime(this.gameTime));
                this.trueAnswer -= this.trueAnswerInLevel;
                this.trueAnswerInLevel = 0;
                this.lifeSpanGame.destroy();
                this.lifeSpanGame = this.stageNum === 0 ? this.createLifeSpan() : this.createLifeSpan(this.lastLifeSpanGame) ;
                container2.setAlpha(0.4);
                restartButton.disableInteractive();
                this.checkGiftNote.destroy();
                this.gameStart();
            }.bind(this));
            if (this.checkGift.timePlus === true) {
                timePlusButton.disableInteractive();
                container1.setAlpha(0.4);
            };
            if (this.checkGift.restart === true) {
                restartButton.disableInteractive();
                container2.setAlpha(0.4);
            };
        } else {
            var emoji = this.add.text(-10, 130, `${this.trueAnswer < 6 ? '🙁 ' : '💖 '}  ${this.trueAnswer} / 11`, styleQ).setOrigin(0.5, 0.5);
            container1 = this.add.container(0, 0, emoji);
            var tempText = this.trueAnswer < 6 ? 'Chúc bác sĩ/dược sĩ sẽ đạt kết quả cao hơn trong lần chơi tới' : 'Chúc mừng bác sĩ/dược sĩ đã hoàn thành xuất sắc trò chơi';
            var textWinLose = this.add.text(0, 0, `${tempText}`, styleQ).setOrigin(0.5, 0.5);
            container2 = this.add.container(0, 300, textWinLose);
        }
        containerTotal = this.add.container(x,y).add([container1, container2]);
        return containerTotal;
    }

    shuffle(array: Array<any>) {
        array.sort(() => Math.random() - 0.5);
    }

    render() {
        
    }
   
}

