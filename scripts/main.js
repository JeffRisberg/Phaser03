'use strict';

requirejs.config({
    paths: {
        //libs
        phaser: '../bower_components/phaser/build/phaser.min'
    }
});

require([
    '../bower_components/phaser/build/phaser.min',
    'states/PlayState'
], function (phaser, playState) {
    var phaserGame = new Phaser.Game(920, 577, Phaser.CANVAS, 'Phaser03');

    phaserGame.state.add('play', playState);

    phaserGame.state.start('play');

    return phaserGame;
});

