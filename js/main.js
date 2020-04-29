import '../lib/phaser.js'

import {LoadScene} from "../scenes/LoadScene.js";
/*
var load = new LoadScene();
var menu = new MenuScene();
*/
export var game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade:{
            gravity: {y: 1000},
        }
    },
    scene:[LoadScene]
});
/*
game.scene.add('LoadScreen', load);
game.scene.add('MenuScreen', menu);

game.scene.start('LoadScreen');
*/