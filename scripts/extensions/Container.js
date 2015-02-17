define(['Phaser'], function (Phaser) {

    // Create our container extending Phaser.Group
    var Container = function (game, parent, direction, hGap, vGap) {

        // Super call to Phaser.Group
        Phaser.Group.call(this, game, parent);

        this.invalid = true;
        this.direction = (direction != undefined) ? direction : 0;
        this.hGap = (hGap != undefined) ? hGap : 2;
        this.vGap = (vGap != undefined) ? vGap : 2;
    };

    Container.prototype = Object.create(Phaser.Group.prototype);
    Container.constructor = Container;

    Container.prototype.VERTICAL = 0;
    Container.prototype.HORIZONTAL = 1;

    Container.prototype.doLayout = function (container) {
        if (container.direction == Container.prototype.HORIZONTAL) {
            var x = container.hGap;
            var maxHeight = 0;

            container.forEach(function (child) {
                child.x = x;
                child.y = container.vGap;

                if (child.__proto__ == Container.prototype) {
                    Container.prototype.doLayout(child);
                }

                x += child.width + container.hGap;
                if (child.height > maxHeight) maxHeight = child.height;
            });
            container.width = x;
            container.height = maxHeight + 2 * container.vGap;
        }
        else if (container.direction == Container.prototype.VERTICAL) {
            var y = container.vGap;
            var maxWidth = 0;

            container.forEach(function (child) {
                child.x = container.hGap;
                child.y = y;

                if (child.__proto__ == Container.prototype) {
                    Container.prototype.doLayout(child);
                }

                y += child.height + container.vGap;
                if (child.width > maxWidth) maxWidth = child.width;
            });
            container.width = maxWidth + 2 * container.hGap;
            container.height = y;
        }
        else {
            console.log("Unknown layout mode");
            return;
        }
        container.invalid = false;
    };

    Container.prototype.reset = function (container, x, y) {
        container.x = x;
        container.y = y;
        container.invalid = true;
    };

    return Container;
});

