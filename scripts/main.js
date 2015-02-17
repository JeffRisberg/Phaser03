'use strict';

requirejs.config({
    paths: {
        //libs
        almond: '../bower_components/almond/almond',
        phaser: '../bower_components/phaser/build/phaser.min',

        //states
        playState: 'states/play'
    }
});

require([
    'phaser',
    'playState'
], function (phaser, play) {
    var phaserGame = new Phaser.Game(920, 577, Phaser.CANVAS, 'Phaser03');

    phaserGame.state.add('play', play);

    phaserGame.state.start('play');

    return phaserGame;
});

