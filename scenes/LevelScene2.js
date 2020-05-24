import {CST} from "../js/CST.js"
import {game} from "../js/main.js"

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

    }
    update(){

    }
}