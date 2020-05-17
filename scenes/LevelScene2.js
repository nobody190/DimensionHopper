import {CST} from "../js/CST.js"
import {game} from "../js/main.js"
var cursors;
var player;

export class LevelScene2 extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.LEVEL2
        })
    }
    preload(){
        this.load.image("sky", "../sources/sky.png");
        this.load.tilemapTiledJSON("level2", "../sources/Level2Tilemap.json");
    }
    create(){

        this.add.image(0, 0, 'sky').setOrigin(0, 0);
        this.matter.world.setBounds(0, 0, game.config.width, game.config.height);        

        var level = this.make.tilemap({key: "level2"});
        var tileset = level.addTilesetImage("DimensionHopperTileset", "tileset");

        var levelLayer = level.createStaticLayer("levelLayer", tileset, 0, 0);
        levelLayer.setCollisionByProperty({ collides: true });
        this.matter.world.convertTilemapLayer(levelLayer);

        var exit = this.matter.add.sprite(736, 267, "exit");
        exit.setStatic(true);

    }
    update(){
        
        if(cursors.left.isDown){
            player.setVelocityX(-2);
        }
        else if(cursors.right.isDown){
            player.setVelocityX(2);
        }
        player.setRotation(0);

        


        
    }
}