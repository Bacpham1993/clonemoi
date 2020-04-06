export class mainGame extends Phaser.Scene {
    private mortise;
    private mortiseDefault = new Phaser.Math.Vector2(0,0);
    private pulley;
    private doctor;
    private rotation_dir = 0.01;
    private pod_status = 'rotate';
    private initTime = 2;
    private gameTime = 10;
    private timeText;
    private diamondPick;
    private textPick;
    private inputSome;
    private stageNum = 0;
    private questionSheet = [
        {
            ques: 'Theo quy định của WHO và luật người cao tuổi Việt Nam, công dân Việt Nam từ độ tuổi nào được định nghĩa là "Người cao tuổi"',
            ans: [
                '55',
                '60',
                '65',
                '70'
            ],
            rig: [0,1,2,3]
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
        this.load.image('cloud', 'assets/cloud.png');
        this.load.image('time', 'assets/time.png');
        this.load.image('jw1', 'assets/jw-1.png');
        this.load.image('jw2', 'assets/jw-2.png');
        this.load.image('heart', 'assets/heart.png');
        this.load.image('star', 'assets/star.png');
        this.load.audio('explosion', ['assets/explosion.m4a']);
        this.load.audio('gamewon', ['assets/gamewon.m4a']);
        this.load.spritesheet('exp', 'assets/exp.png', {frameWidth: 64, frameHeight: 64, endFrame: 23});
    }
    create() {
        this.add.image(0, 0, 'gameMain').setOrigin(0, 0).setDisplaySize(window.innerWidth, window.innerHeight);;
        this.doctor = this.add.sprite(this.cameras.main.width/2 + 50, this.cameras.main.height/2 - 100, 'doctor').setScale(0.5);
        this.pulley = this.physics.add.sprite(this.cameras.main.width/2 - 30, this.cameras.main.height/2 - 80, 'pulley').setScale(0.5);
        this.mortise = this.physics.add.sprite(this.cameras.main.width/2 - 30, this.cameras.main.height/2 + 10, 'mortise').setScale(0.5).setCollideWorldBounds(true);
        this.mortiseDefault.x = this.mortise.x;
        this.mortiseDefault.y = this.mortise.y;
        this.createDiamond();
        this.createLifeSpan();
        // time
        var timeOnGame = this.add.sprite(0, 0, 'time');
        this.timeText = this.add.text(40, 0, this.formatTime(this.gameTime),
        { fontFamily: "Arial", fontSize: '50px', color: "#ffffff", wordWrap: {
            width: timeOnGame.width
        } , align: "center"} );
        this.timeText.setOrigin(0.5, 0.5);
        var containerTime = this.add.container(this.cameras.main.width - 300, 50);
        // end Time
        containerTime.add(timeOnGame);
        containerTime.add(this.timeText);
        containerTime.setScale(0.5);
        this.createQuestion(`CÂU HỎI ${this.stageNum + 1}`, this.questionSheet[this.stageNum].ques);
        this.mortise.body.onWorldBounds = true;
        this.physics.world.on('worldbounds', function(body) {
            this.diamondPick = null;
            this.pod_status = 'rewind';
        }.bind(this));
        this.inputSome = this.input.on('pointerdown', function(){
            this.pod_status = 'shoot';
        }.bind(this));
        this.inputSome.enabled = false;
    }

    createBomb() {
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
        explosion.play()
    }

    createRight() {
        var heart = this.add.sprite(this.doctor.x + 60, this.doctor.y, 'heart').setScale(0.5);
        this.tweens.add({
            targets: heart,
            alpha: { from: 0.5, to: 1 },
            // alpha: { start: 0, to: 1 },
            // alpha: 1,
            // alpha: '+=1',
            ease: 'Bounce',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: -1,            // -1: infinity
            yoyo: true
        });
        var gamewon = this.sound.add('gamewon', {
            volume: 1
        });
        gamewon.on('complete', function() {
            heart.destroy()
        }, this)
        gamewon.play();
    }

    createLifeSpan(){
        var containerStar = this.add.container(50, 50);
        var star1 = this.add.sprite(0, 0, 'star');
        var star2 = this.add.sprite(120, 0 , 'star');
        var star3 = this.add.sprite(240, 0, 'star');
        containerStar.add([star1, star2, star3]).setScale(0.5, 0.5);
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
        var dArray = ['jw1','jw2'];
        var boundNum = 15;
        var dAScale = [0.5, 1, 1.5];
        for(var i = 0; i <= boundNum; i++) {
            // collides[i] = this.physics.add.sprite(Math.floor((this.cameras.main.width-100) * Math.random()) + 100, this.cameras.main.height/2 + Math.floor(this.cameras.main.height/2 * Math.random()), dArray[ Math.floor(Math.random() * Math.floor(2))]).setOrigin(0);
            collides[i] = this.physics.add.sprite(0, 0, dArray[Math.floor(Math.random() * Math.floor(2))]).setOrigin(0);
            var textAns;
            var scaleRandom = dAScale[Math.floor(Math.random() * Math.floor(3))];
            if(i < this.questionSheet[this.stageNum].ans.length) {
                var style = { fontFamily: "Arial", fontSize: `${Math.floor(collides[i].width/3)}px`, color: "#ffffff", wordWrap: {
                    width: collides[i].width
                } , align: "center"};
                textAns = this.add.text(collides[i].width/3, collides[i].height/4, this.questionSheet[this.stageNum].ans[i], style).setName('answ');
            }
            let rndX = Phaser.Math.RND.integerInRange(150, this.cameras.main.width - 150);
            let rndY = Phaser.Math.RND.integerInRange(this.cameras.main.height/2 + 150 , this.cameras.main.height - 150)
            // containerCollides[i] = this.add.container(this.checkPointInCircle(new Phaser.Math.Vector2(rndX, rndY), 100, collides).x, this.checkPointInCircle(new Phaser.Math.Vector2(rndX, rndY), 100, collides).y)
            containerCollides[i] = this.add.container(rndX, rndY);
            containerCollides[i].add(collides[i]);
            containerCollides[i].add(textAns);
            containerCollides[i].setScale(scaleRandom);
            this.physics.world.enable(containerCollides[i]);
            this.physics.add.collider(this.mortise, containerCollides[i], function(ob1, ob2){
                this.diamondPick = ob2;
                this.textPick = this.diamondPick.getByName('answ') ? this.diamondPick.getByName('answ').text : null; 
                this.pod_status = 'rewind';
            }.bind(this))
        };
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
                }
            },
            callbackScope: this
        })
    }

    createQuestion(quesNum: string, quesDes: string) {
        var timeEvent10 = this.time.addEvent({
            delay: 1000,
            callback: function() {
                this.initTime -= 1;
                time10.setText(this.formatTime(this.initTime));
                if (this.initTime === 0) {
                    timeEvent10.destroy();
                    container.destroy();
                    this.inputSome.enabled = true;
                    this.createTimeGame();
                }
            },
            callbackScope: this,
            loop: true
        });
        var lcloud = this.add.sprite(0, 0, 'lcloud');
        var style = { fontFamily: "Arial", fontSize: '64px', color: "#0000ff", wordWrap: {
            width: lcloud.width
        } , align: "center"};
        var styleQ = { fontFamily: "Arial", fontSize: '64px', color: "#222", wordWrap: {
            width: lcloud.width
        }  , align: "center"};
        var textQ = this.add.text(0, -lcloud.height/2 + 100 , `${quesNum}`, style);
        var textQs = this.add.text(0, -lcloud.height/8, `${quesDes}`, styleQ);
        var time10 = this.add.text(0, lcloud.height/2 - 100, this.formatTime(this.initTime), { fontFamily: "Arial", fontSize: '90px', color: "#fff", wordWrap: {
            width: lcloud.width
        }  , align: "center"}); 
        textQ.setOrigin(0.5, 0.5);
        textQs.setOrigin(0.5, 0.5);
        time10.setOrigin(0.5,0.5);
        var container = this.add.container(this.cameras.main.width/2, this.cameras.main.height/2);
        container.add(lcloud);
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
        switch(this.pod_status) {
            case 'rotate': 
                this.mortise.rotation += this.rotation_dir*delta/3;
                if(this.mortise.rotation >= 4*Math.PI/9 || this.mortise.rotation <= -4*Math.PI/9) {
                    this.rotation_dir *= -1;
                };
                break;
            case 'shoot': 
                this.mortise.x += 10*Math.cos(Math.PI/2 + this.mortise.rotation);
                this.mortise.y += 10*Math.sin(Math.PI/2 + this.mortise.rotation);
                break;
            case 'rewind':
                this.mortise.x -= 10*Math.cos(Math.PI/2 + this.mortise.rotation);
                this.mortise.y -= 10*Math.sin(Math.PI/2 + this.mortise.rotation);
                if(this.diamondPick) {
                    this.diamondPick.x -= 10*Math.cos(Math.PI/2 + this.mortise.rotation);
                    this.diamondPick.y -= 10*Math.sin(Math.PI/2 + this.mortise.rotation);
                }
                if(this.mortise.y <= this.mortiseDefault.y) {
                    this.mortise.x = this.mortiseDefault.x;
                    this.mortise.y = this.mortiseDefault.y;
                    this.mortise.rotation = 0;
                    if(this.diamondPick) {
                        this.diamondPick.destroy();
                        // console.log(this.questionSheet[this.stageNum].rig, this.diamondPick.last.text)
                        if (typeof(this.diamondPick.getByName('answ')) !== null) {
                            const quesOK = this.questionSheet[this.stageNum];
                            const ansOK = this.textPick;
                            console.log(quesOK, ansOK);
                            if(quesOK.rig.includes(quesOK.ans.indexOf(ansOK))) {
                                this.createRight();
                            } else {
                                this.createBomb();
                            }
                        }
                    }
                    this.pod_status = 'rotate';
                }
                break;
        }        
    }

    createEndGame() {
        this.inputSome.enabled = false;
        this.pod_status = '';
        this.createQuestion('THẤT BẠI', 'VUI LÒNG CHƠI LẠI');
    }

    checkPointInCircle(I: Phaser.Math.Vector2, R: number, A: Array<Phaser.Math.Vector2>) {
        let num: Phaser.Math.Vector2;
        if(A.length > 0) {
            for(let i = 0; i <= A.length; i++) {
                let a = ((A[i].x - I.x)^2 + (A[i].y - I.y)^2);
                let b = R^2;
                if(a <= b) {
                    num = new Phaser.Math.Vector2(Phaser.Math.Between(150, this.cameras.main.width - 150), Phaser.Math.RND.integerInRange(this.cameras.main.height/2 + 150 , this.cameras.main.height - 150));
                    break;
                } 
            }
        }
        return num;
    }
    render() {
        
    }
   
}

