define(['Phaser'], function (Phaser) {
    // Create our container extending Phaser.Group
    var Container = function (game, parent) {
        // Super call to Phaser.Group
        Container.Group.call(this, game, parent);
    };

    Container.prototype = Object.create(Phaser.Group.prototype);
    Container.constructor = Container;

    Container.layout = function () {
        var y = 0;
        // this is vertical
        for (child in this.children) {
            child.x = 0;
            child.y = y;
            y += child.height;
        }
    };

    return Container;
});

