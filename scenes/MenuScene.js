import {CST} from "../js/CST.js"

export class MenuScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.MENU
        })
    }
    init(){

    }
    preload(){

    }

    create(){
        /*title*/
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height *0.20, "title").setScale(0.15).setDepth(1);
        /*space background*/
        this.add.image(0, 0, "background").setOrigin(0).setDepth(0);
        /*play music*/
        this.sound.pauseOnBlur = false;
        this.sound.play("mainTheme", {loop: true});
        /*buttons*/
        let btn = [];
        btn[0] = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2.5, "play").setScale(0.5).setDepth(1);
        btn[1] = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2.5 + 30, "continue").setScale(0.5).setDepth(1);
        btn[2] = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2.5 + 60, "options").setScale(0.5).setDepth(1);
        btn[3] = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2.5 + 90, "ranking").setScale(0.5).setDepth(1);
        btn[4] = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2.5 + 120, "quit").setScale(0.5).setDepth(1);
        /*set interactivity*/
        for(let i = 0; i < 5; i++){
            btn[i].setInteractive();

            btn[i].on("pointerover", ()=>{
                btn[i].setScale(0.6);
                this.sound.play("hoverSound");
            });

            btn[i].on("pointerout", ()=>{
                btn[i].setScale(0.5);
                this.sound.removeByKey("hoverSound");
            });

            btn[i].on("pointerup", ()=>{
                switch (i) {
                    case 0:
                        /*load new game*/
                        this.scene.start(CST.SCENES.LEVEL3);
                        break;
                    case 1:
                        /*load continue*/
                        break;
                    case 2:
                        /*start in parallel*/
                        this.scene.launch(CST.SCENES.OPTIONS);
                        this.scene.pause(CST.SCENES.MENU);
                        break;
                    case 4:
                        /*load ranking*/
                        break;
                    case 5:
                        /*quit*/
                        break;
                }
            });
        }
    }
}
