define(['Phaser'], function (Phaser) {
    // Create our container extending Phaser.Group
    var Container = function (game, parent) {
        // Super call to Phaser.Group
        Container.Group.call(this, game, parent);
    };

    Container.prototype = Object.create(Phaser.Group.prototype);
    Container.constructor = Container;

    return Container;
});

