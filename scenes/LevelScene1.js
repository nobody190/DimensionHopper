import {CST} from "../js/CST.js"
import {game} from "../js/main.js"
var cursors;
var player;

export class LevelScene1 extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.LEVEL1
        })
    }
    preload(){
        //load images
        this.load.image("door", "../sources/olddoor.png");

        this.load.image("exit", "../sources/door.png");
        /*this.load.image("spikes", "../sources/sharp.png");
        this.load.image("ground", "../sources/ground.png");*/
        this.load.image("sky", "../sources/sky.png");

        this.load.image("tileset", "../sources/tileset.png");
        this.load.tilemapTiledJSON("level", "../sources/Level1Tilemap.json");
    }
    create(){

        this.add.image(0, 0, 'sky').setOrigin(0, 0);
        this.matter.world.setBounds(0, 0, game.config.width, game.config.height);        

        var level = this.make.tilemap({key: "level"});
        var tileset = level.addTilesetImage("DimensionHopperTileset", "tileset");

        var levelLayer = level.createStaticLayer("levelLayer", tileset, 0, 0);
        levelLayer.setCollisionByProperty({ collides: true });
        this.matter.world.convertTilemapLayer(levelLayer);

        var exit = this.matter.add.sprite(0, 267, "exit");
        exit.setStatic(true);

        player = this.matter.add.sprite(150, 150, "door");
        player.setFriction(0.1);

        cursors = this.input.keyboard.createCursorKeys();
        //tipo de lógica para os picos e botões (talvez também para o fim)

        //collision type on start only (so doesn't trigger during a collision, or after it stops)
        this.matter.world.on("collisionstart", event => {
        
            //
            event.pairs.forEach(pair => {

                const { bodyA, bodyB } = pair;

                //console.log(bodyB.id);
                //console.log(bodyB.id == player.body.id && (bodyA.parent.gameObject.body.gameObject.tile.properties.kills));//I got to the tile through a fairly ugly and unpleasant rummage of the matter object properties
                //console.log("jogador " + player.body.id);

                
                if(bodyA.parent.gameObject.body.gameObject.tile instanceof Phaser.Tilemaps.Tile){
                    //if (bodyB is the player AND bodyA is a hazard (spike or poison)) OR (if bodyB is a hazard AND bodyA is the player)
                    if ((bodyB.id == player.body.id && (bodyA.parent.gameObject.body.gameObject.tile.properties.kills)) || ((bodyA.parent.gameObject.body.gameObject.tile.properties.kills) && bodyA.id == player.body.id)) {
                        console.log("MORRESTE");
                        this.scene.restart();
                    }
                }
            });
        });


        this.matter.world.on("collisionstart", event => {
        
            //
            event.pairs.forEach(pair => {

                const { bodyA, bodyB } = pair;

                //console.log(bodyB.id);
                //console.log(bodyA);
                //console.log("jogador " + player.body.id);

                if (bodyA.id == exit.body.id && bodyB.id == player.body.id) {
                    
                    this.scene.launch(CST.SCENES.LEVEL_END);
                    console.log("Ganhaste!");
                    this.scene.start(CST.SCENES.LEVEL2);
                }
            });
        });
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