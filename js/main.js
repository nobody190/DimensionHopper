import '../lib/phaser.js'

import {LoadScene} from "../scenes/LoadScene.js";
import {MenuScene} from "../scenes/MenuScene.js";
/*
var load = new LoadScene();
var menu = new MenuScene();
*/
let game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene:[MenuScene]
});
/*
game.scene.add('LoadScreen', load);
game.scene.add('MenuScreen', menu);

game.scene.start('LoadScreen');
*/