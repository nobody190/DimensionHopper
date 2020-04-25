"use strict"
class Player{
    constructor(object){
        this.object = object;
    }

    jumpUp(){
        this.object.setVelocitY(-100);
    }
    moveLeft(){
        this.object.setVelocityX(-100)
    }
    moveRight(){
        this.object.setVelocityX(100)
    }
}




//este vai mais ou menos ser o código genérico a usar sempre que queremos criar o jogador

//nas funções create()
var playerObject = game.add.sprite(0, 0, "player");
var left = game.input.keyboard.addKey("A");
var right = game.input.keyboard.addKey("D");
var up = game.input.keyboard.addKey("W");
game.physics.enable(player, Phaser.Physics.ARCADE);

var player = new Player(playerObject);


//nas funções update()

/*
 * jogador sobe infinitamente se for feito desta maneira
 */
if(up.isDown){
    player.jumpUp();
}
if(left.isDown){
    player.moveLeft();
}
else if(right.isDown){
    player.moveRight();
}
//é também preciso o atrito entre o chão e o jogador