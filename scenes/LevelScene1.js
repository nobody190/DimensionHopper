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
        this.load.image("exit_closed", "../sources/DoorLocked.png");
        this.load.image("exit_opening", "../sources/DoorUnlocked.png");
        this.load.image("exit_opened", "../sources/DoorOpen.png");
        this.load.image("sky", "../sources/sky.png");
        this.load.image("tileset", "../sources/tileset.png");
        this.load.tilemapTiledJSON("level", "../sources/Level1Tilemap.json");
        /*player atlas*/
        this.load.atlas("player", "../sources/characterMoves.png", "../sources/characterMoves.json");
    }
    create(){
        /*background*/
        this.add.image(0, 0, 'sky').setOrigin(0, 0);
        this.matter.world.setBounds(0, 0, game.config.width, game.config.height);
        /*load tilemap and tileset*/
        const map = this.make.tilemap({key: "level"});
        const tileset = map.addTilesetImage("DimensionHopperTileset", "tileset");
        /*get layers*/
        const levelLayer = map.createStaticLayer("levelLayer", tileset, 0, 0);

        levelLayer.setCollisionByProperty({ collides: true });

        this.matter.world.convertTilemapLayer(levelLayer);

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
        /*add door*/
        map.getObjectLayer("Door").objects.forEach(point => {
            this.door = this.add.image(point.x, point.y, 'exit_closed');
        });
        /*add door sensor*/
        const rect = map.findObject("Sensors", obj => obj.name === "End");
        const celebrateSensor = this.matter.add.rectangle(
            rect.x + rect.width / 2,
            rect.y + rect.height / 2,
            rect.width,
            rect.height,
            {
                isSensor: true, // It shouldn't physically interact with other bodies
                isStatic: true // It shouldn't move
            }
        );
        this.unsubscribeOpenDoor = this.matterCollision.addOnCollideStart({
            objectA: this.player.sprite,
            objectB: celebrateSensor,
            callback: this.onPlayerWin,
            context: this
        });
    }
    onPlayerWin() {
        const door = this.door;
        const player = this.player;
        const cam = this.cameras.main;
        const scene = this.scene;
        const nextScene = CST.SCENES.LEVEL2;
        /*door opening animations happens only once*/
        this.unsubscribeOpenDoor();
        /*change door texture to opening*/
        door.setTexture('exit_opening');
        /*delay*/
        setTimeout(function(){
            /*change door texture to opened*/
            door.setTexture('exit_opened');
            /*fade out to next level*/
            player.freeze();
            cam.fade(250, 0, 0, 0);
            cam.once("camerafadeoutcomplete", () => scene.start(nextScene));
        }, 2000);
    }
    onPlayerCollide({ gameObjectB }) {
        if (!gameObjectB || !(gameObjectB instanceof Phaser.Tilemaps.Tile)) return;

        const tile = gameObjectB;

        // Check the tile property set in Tiled (you could also just check the index if you aren't using
        // Tiled in your game)
        if (tile.properties.kills) {
            // Unsubscribe from collision events so that this logic is run only once
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