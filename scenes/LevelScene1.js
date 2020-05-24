import {CST} from "../js/CST.js"
import {game} from "../js/main.js"
import Player from "../js/player.js";

export class LevelScene1 extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.LEVEL1
        })
    }
    preload(){
        //load images
        this.load.tilemapTiledJSON("level", "../sources/Level1Tilemap.json");
        /*player atlas*/
    }
    create(){
        /*background*/
        this.add.image(0, 0, 'sky').setOrigin(0, 0).setDepth(0);
        this.matter.world.setBounds(0, 0, game.config.width, game.config.height);
        /*load tilemap and tileset*/
        const map = this.make.tilemap({key: "level"});
        const tileset = map.addTilesetImage("DimensionHopperTileset", "tileset");
        /*get layers*/
        const groundLayer = map.createStaticLayer("ground", tileset, 0, 0);
        const ceilingLayer = map.createStaticLayer("ceiling", tileset, 0, 0);

        groundLayer.setCollisionByProperty({ collides: true });
        ceilingLayer.setCollisionByProperty({ collides: true });

        this.matter.world.convertTilemapLayer(groundLayer);
        this.matter.world.convertTilemapLayer(ceilingLayer);
        /*add door*/
        map.getObjectLayer("Door").objects.forEach(point => {
            this.door = this.add.image(point.x, point.y, 'exit_closed').setDepth(1);;
        });

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        const help = this.add.text(16, 16, "Arrows/WASD to move the player.", {
            fontSize: "18px",
            padding: { x: 10, y: 5 },
            backgroundColor: "#ffffff",
            fill: "#000000"
        });
        help.setScrollFactor(0).setDepth(1000);
        /*add player in spawn point*/
        const { x, y } = map.findObject("Spawn", obj => obj.name === "Spawn Point");
        this.player = new Player(this, x, y);
        /*add door*/

        this.unsubscribePlayerCollide = this.matterCollision.addOnCollideStart({
            objectA: this.player.sprite,
            callback: this.onPlayerCollide,
            context: this
        });
        /*add door sensor*/
        const rect = map.findObject("Sensors", obj => obj.name === "End");
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
        const nextScene = CST.SCENES.LEVEL2;
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