import '../lib/phaser.js'

import {LoadScene} from "../scenes/LoadScene.js";
/*
var load = new LoadScene();
var menu = new MenuScene();
*/
export var game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 832,
    height: 640,
    physics: {
        default: 'matter',
        arcade:{
            gravity: {y: 1},
            debug: true
        }
    },
    scene:[LoadScene]
});
/*
game.scene.add('LoadScreen', load);
game.scene.add('MenuScreen', menu);

game.scene.start('LoadScreen');
*/