//DE MOMENTO ISTO NÃO ESTÁ A SER USADO

import {CST} from "../js/CST.js"
import {MenuScene} from "../scenes/MenuScene.js";
import {LevelScene1} from "../scenes/LevelScene1.js";
import {OptionScene} from "../scenes/OptionScene.js";

export class LoadScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.LOAD
        })
    }
    init(){

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
        this.load.image("black", "../sources/black.png");
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
        /*add scenes dynamically*/
        this.scene.add(CST.SCENES.MENU, MenuScene, false);
        this.scene.add(CST.SCENES.OPTIONS, OptionScene, false);
        this.scene.add(CST.SCENES.LEVEL1, LevelScene1, false);
        /*start scenes dynamically*/
        this.scene.start(CST.SCENES.MENU);
    }
}