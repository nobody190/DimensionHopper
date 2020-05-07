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

        var exit = this.matter.add.sprite(736, 267, "exit");
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
                //console.log(bodyA);
                //console.log("jogador " + player.body.id);

                //if (bodyB is the player AND bodyA is a spike) OR (if bodyB is a spike AND bodyA is the player)
                if ((bodyB.id == player.body.id && (bodyA.id < 157 && bodyA.id > 123)) || ((bodyB.id < 157 && bodyB.id > 123 && bodyB.id != player.body.id) && bodyA.id == player.body.id)) {
                    console.log("MORRESTE");
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
                    console.log("Ganhaste!");
                }
            });
        });



        /*
        //Platforms are all going to be part of the same physics group
        //All they do is provide something to support the player so he can move and jump
        var platforms = this.physics.add.staticGroup();
        
        var platform1 = platforms.create(0, 350, "ground").setOrigin(0, 0);
        platform1.scaleX = 0.6;
        platform1.scaleY = 8;
        platform1.refreshBody();//refresh body is needed, otherwise add.collider would create a hitbox for the old unscaled sprite

        var platform2 = platforms.create(800, 350, "ground").setOrigin(1, 0);
        platform2.scaleX = 0.6;
        platform2.scaleY = 8;
        platform2.refreshBody();

        var traps = this.add.sprite(245, 500, "spikes").setOrigin(0, 0);//need collision detection to kill player if he touches spikes
        //gtraps.scaleX = 0.39;

        var exit = this.add.sprite(800, 350, "door").setOrigin(1, 1);//need collision detection to advance player to next level if he reaches the exit

        //Player sprite and controls initialisation
        player = this.physics.add.sprite(0, 250, "door").setOrigin(1, 1);
        cursors = this.input.keyboard.createCursorKeys();
        player.setCollideWorldBounds(true);//boundaries of the screen count as walls/ground

        this.physics.add.collider(player, platforms);*/
    }
    update(){
        /*if(cursors.up.isDown && player.body.touching.down){
            player.setVelocityY(-5);
        }*/
        
        if(cursors.left.isDown){
            player.setVelocityX(-2)
        }
        else if(cursors.right.isDown){
            player.setVelocityX(2);
        }
        player.setRotation(0);

        


        
    }
}