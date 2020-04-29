import {CST} from "../js/CST.js"

var cursors;
var player;

export class LevelScene1 extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.LEVEL1
        })
    }
    preload(){
        this.load.image("door", "../sources/door.png");
        this.load.image("sky", "../sources/sky.png");
        this.load.image("spikes", "../sources/sharp.png");
        this.load.image("ground", "../sources/ground.png");
        this.load.spritesheet("walk", "../sources/player_walk.png", {frameWidth: 295, frameHeight: 470});
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

        var traps = this.add.sprite(240, 545, "spikes").setOrigin(0, 0);//need collision detection to kill player if he touches spikes
        traps.setScale(0.40);

        var exit = this.add.sprite(800, 350, "door").setOrigin(1, 1);//need collision detection to advance player to next level if he reaches the exit

        //Player sprite and controls initialisation
        player = this.physics.add.sprite(0, 250, "walk").setOrigin(1, 1).setScale(0.2);
        cursors = this.input.keyboard.createCursorKeys();
        player.setCollideWorldBounds(true);//boundaries of the screen count as walls/ground
        /*player animations*/
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('walk', { start: 0, end: 4 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('walk', { start: 5, end: 9 }),
            frameRate: 15,
            repeat: -1
        });

        this.physics.add.collider(player, platforms);
    }
    update(){
        if (cursors.left.isDown) {
            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown) {
            player.setVelocityX(160);

            player.anims.play('right', true);
        }
        else {
            player.setVelocityX(0); //this has to be changed to be based off of atrition between materials, otherwise level 3 will not work
            player.anims.stop();
        }

        if (cursors.up.isDown && player.body.touching.down)
        {
            player.setVelocityY(-330);
        }

    }
}