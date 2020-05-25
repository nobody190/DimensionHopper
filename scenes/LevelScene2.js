import {CST} from "../js/CST.js"
import {game} from "../js/main.js"
import Player from "../js/player.js";

export class LevelScene2 extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.LEVEL2
        })
    }
    preload(){
        this.load.image("sky", "../sources/sky.png");
        this.load.tilemapTiledJSON("level3", "../sources/Level3Tilemap.json");
    }
    create(){
        /*background*/
        this.add.image(0, 0, 'sky').setOrigin(0, 0).setDepth(0);
        this.matter.world.setBounds(0, 0, game.config.width, game.config.height);
        /*load tilemap and tileset*/
        const map = this.make.tilemap({key: "level3"});
        const tileset = map.addTilesetImage("tileset", "tileset");
        /*get layers*/
        const groundLayer = map.createDynamicLayer("ground", tileset, 0, 0);
        const ceilingLayer = map.createDynamicLayer("ceiling", tileset, 0, 0);
        const leftWallLayer = map.createDynamicLayer("left_wall", tileset, 0, 0);

        groundLayer.setCollisionByProperty({ collides: true });
        ceilingLayer.setCollisionByProperty({ collides: true });
        leftWallLayer.setCollisionByProperty({ collides: true });

        this.matter.world.convertTilemapLayer(groundLayer);
        this.matter.world.convertTilemapLayer(ceilingLayer);
        this.matter.world.convertTilemapLayer(leftWallLayer);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        const { x_, y_ } = map.findObject("Door", obj => obj.name === "Point");
        this.door = this.add.image(x_, y_, 'exit_closed').setDepth(1);
        /*add player in spawn point*/
        const {x , y} = map.findObject("Spawn", obj => obj.name === "Point");
        this.player = new Player(this, x, y);
        /*add door*/

        this.unsubscribePlayerCollide = this.matterCollision.addOnCollideStart({
            objectA: this.player.sprite,
            callback: this.onPlayerCollide,
            context: this
        });
        /*add door sensor*/
        const rect = map.findObject("Door", obj => obj.name === "Sensor");
        const levelClear = this.matter.add.rectangle(rect.x + rect.width / 2, rect.y + rect.height / 2, rect.width, rect.height,{isSensor: true, isStatic: true}
        );
        this.levelClear = this.matterCollision.addOnCollideStart({
            objectA: this.player.sprite,
            objectB: levelClear,
            callback: this.onLevelClear,
            context: this
        });
    }
    onLevelClear() {
        const door = this.door;
        const cam = this.cameras.main;
        const scene = this.scene;
        const nextScene = CST.SCENES.LEVEL3;
        /*door opening animations happens only once*/
        this.levelClear();
        this.player.freeze();
        /*change door texture to opening*/
        door.setTexture('exit_opening');
        /*delay*/
        setTimeout(function(){
            /*change door texture to opened*/
            door.setTexture('exit_opened');
            /*fade out to next level*/
            cam.fade(250, 0, 0, 0);
            cam.once("camerafadeoutcomplete", () => scene.start(nextScene));
        }, 2000);
    }
    onPlayerCollide({ gameObjectB }) {
        if (!gameObjectB || !(gameObjectB instanceof Phaser.Tilemaps.Tile)) return;

        const tile = gameObjectB;
        if (tile.properties.kills) {
            this.unsubscribePlayerCollide();
            this.player.freeze();
            const cam = this.cameras.main;
            cam.fade(250, 0, 0, 0);
            cam.once("camerafadeoutcomplete", () => this.scene.restart());
        }
    }
    update(){

    }
}