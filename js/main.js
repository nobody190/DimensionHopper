import '../lib/phaser.js'

import {LoadScene} from "../scenes/LoadScene.js";
import {MenuScene} from "../scenes/MenuScene.js";
/*
var load = new LoadScene();
var menu = new MenuScene();
*/
export var game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 840,
    height: 672,
    physics: {
        default: 'matter',
        arcade:{
            gravity: {y: 1},
            debug:true
        }
    },
    scene:[MenuScene]
});
/*
game.scene.add('LoadScreen', load);
game.scene.add('MenuScreen', menu);

game.scene.start('LoadScreen');
*/