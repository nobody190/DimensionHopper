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
        this.load.image("title", "../sources/title.png");
        this.load.image("door", "../sources/door.png");
        this.load.image("sky", "../sources/sky.png");
        this.load.image("spikes", "../sources/sharp.png");
        this.load.image("ground", "../sources/ground.png");
        this.load.image("background", "../sources/background.png");
    }
    create(){

        this.add.image(400, 300, 'sky');

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
        traps.scaleX = 0.39;

        var exit = this.add.sprite(800, 350, "door").setOrigin(1, 1);//need collision detection to advance player to next level if he reaches the exit

        //Player sprite and controls initialisation
        player = this.physics.add.sprite(0, 250, "door").setOrigin(1, 1);
        cursors = this.input.keyboard.createCursorKeys();
        player.setCollideWorldBounds(true);//boundaries of the screen count as walls/ground

        this.physics.add.collider(player, platforms);
    }
    update(){
        if(cursors.up.isDown && player.body.touching.down){
            player.setVelocityY(-500);
        }
        if(cursors.left.isDown){
            player.setVelocityX(-200);
        }
        else if(cursors.right.isDown){
            player.setVelocityX(200);
        }

        else{
            player.setVelocityX(0);//this has to be changed to be based off of atrition between materials, otherwise level 3 will not work
        }
        
    }
}