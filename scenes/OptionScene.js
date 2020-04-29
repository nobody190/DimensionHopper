import {CST} from "../js/CST.js"

export class OptionScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.OPTIONS
        })
    }
    init(data){
        /*pause previous scene*/
        this.data = data;
        this.scene.pause(data);
    }
    preload(){
        /*load images and sound*/
        this.load.image("optionsTitle", "../sources/optionsTitle.png");
        this.load.image("portalColor", "../sources/portal_color.png");
        this.load.image("musicOn", "../sources/music_on.png");
        this.load.image("musicOff", "../sources/music_off.png");
        this.load.image("back", "../sources/back.png");
    }
    create(){
        /*black background*/
        let hover = this.add.image(this.game.renderer.width / 2, this.game.renderer.height /2, "black").setDepth(0).setAlpha(0);

        let title = this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.3, "optionsTitle").setScale(0.7).setDepth(1).setAlpha(0);
        /*buttons*/
        let btn = [];
        btn[0] = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2.5 + 30, "portalColor").setScale(0.5).setDepth(1).setAlpha(0);

        if(this.sound.mute){btn[1] = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2.5 + 60, "musicOff").setScale(0.5).setDepth(1).setAlpha(0);}
        else{btn[1] = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2.5 + 60, "musicOn").setScale(0.5).setDepth(1).setAlpha(0);}

        btn[2] = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2.5 + 90, "back").setScale(0.5).setDepth(1).setAlpha(0);
        /*set interactivity*/
        for(let i = 0; i < 3; i++){
            btn[i].setInteractive();

            btn[i].on("pointerover", ()=>{
                btn[i].setScale(0.6);
            });

            btn[i].on("pointerout", ()=>{
                btn[i].setScale(0.5);
            });

            btn[i].on("pointerup", ()=>{
                console.log("UP");
                switch (i) {
                    case 0:

                        break;
                    case 1:
                        if(this.sound.mute){
                            this.sound.mute = false;
                            btn[1].setTexture("musicOn");
                            break;
                        }
                        this.sound.mute = true;
                        btn[1].setTexture("musicOff");
                        break;
                    case 2:
                        this.scene.start(this.data);
                        break;
                }
            });
        }
        /*animation*/
        let id = setInterval(frame, 5);
        let percent = 0.00;

        function frame() {
            if (percent === 1) {
                clearInterval(id);
            } else {
                percent += 0.01;
                hover.setAlpha(percent);
                title.setAlpha(percent);
                for(let i = 0; i < 3; i++){
                    btn[i].setAlpha(percent);
                }
            }
        }
    }
}