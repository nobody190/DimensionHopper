import {CST} from "../js/CST.js"
import {OptionScene} from "../scenes/OptionScene.js";
import {LevelScene1} from "../scenes/LevelScene1.js";

export class MenuScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.MENU
        })
    }
    init(data){
        console.log(data);
        console.log("I got it");
    }

    preload(){
        /*load images and sound*/
        this.load.image("title", "../sources/title.png");
        this.load.image("background", "../sources/background.png");
        this.load.image("play", "../sources/play.png");
        this.load.image("continue", "../sources/continue.png");
        this.load.image("options", "../sources/options.png");
        this.load.image("ranking", "../sources/ranking.png");
        this.load.image("quit", "../sources/quit.png");
        /*loading bar*/
        let loadingBar = this.add.graphics({
            fillStyle:{
                color: 0xffffff
            }
        });

        this.load.on("progress", (percent) =>{
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
            console.log(percent)
        });

        this.load.on("complete",() => {

        });
    }




    create(){
        /*title*/
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height *0.20, "title").setScale(0.15).setDepth(1);
        /*space background*/
        this.add.image(0, 0, "background").setOrigin(0).setDepth(0);
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
                console.log("HOVER");
            });

            btn[i].on("pointerout", ()=>{
                btn[i].setScale(0.5);
                console.log("OUT");
            });

            btn[i].on("pointerup", ()=>{
                console.log("UP");
                switch (i) {
                    case 0:
                        /*load new game*/
                        //this.scene.add("LevelScene1", LevelScene1, false);
                        this.scene.start(CST.SCENES.LEVEL1, "hello from MenuScene");
                        break;
                    case 1:
                        /*load continue*/
                        break;
                    case 2:
                        this.scene.start(CST.SCENES.OPTIONS, "hello from MenuScene");
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
