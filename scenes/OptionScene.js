import {CST} from "../js/CST.js"

export class OptionScene extends Phaser.scene{
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
        this.load.image("musicoptions", "../sources/musicoptions.png");
        this.load.image("portalcolors", "../sources/portalcolors.png");
        this.load.image("continue", "../sources/continue.png");
        this.load.image("back", "../sources/back.png");
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
        btn[0] = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2.5, "musicoptions").setScale(0.5).setDepth(1);
        btn[1] = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2.5 + 30, "portalcolors").setScale(0.5).setDepth(1);
        btn[2] = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2.5 + 60, "continue").setScale(0.5).setDepth(1);
        btn[3] = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2.5 + 90, "back").setScale(0.5).setDepth(1);
        /*set interactivity*/
        for(let i = 0; i < 4; i++){
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
                        /*music options*/
                        break;
                    case 1:
                        /*portal color*/
                        break;
                    case 2:
                        /*continue to the game*/
                        break;
                    case 4:
                        /*back*/
                        break;
                }
            });
        }
    }
}