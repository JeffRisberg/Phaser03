define(['extensions/Container'], function (Container) {
    'use strict';

    var game;

    var map;
    var layer;
    var tileSize;

    var tools;
    var tower;
    var sprite;
    var cursors;

    function Play(_game) {
        game = _game;
    }

    Play.prototype = {
        preload: function () {
            this.game.load.image('arrow', 'assets/sprites/arrow.png');
            this.game.load.image('tower', 'assets/sprites/tower.jpg');

            this.game.load.tilemap('map', 'assets/tilemaps/maps/map_data.json', null, Phaser.Tilemap.TILED_JSON);

            this.game.load.spritesheet('ground', 'assets/tilemaps/tiles/ground.png', 32, 32);
            this.game.load.spritesheet('tiles', 'assets/tilemaps/tiles/tiles.png', 32, 32);
        },

        create: function () {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            map = this.game.add.tilemap('map');

            map.addTilesetImage('ground', 'ground');
            map.addTilesetImage('tiles', 'tiles');

            map.setCollisionBetween(2, 3);

            map.setTileIndexCallback(3, this.hitCoin, this);
            map.setTileIndexCallback(4, this.hitTower, this);

            layer = map.createLayer('Tile Layer 1');
            tileSize = 32;

            var style1 = { font: "11px Arial", fill: "#FFFFFF", align: "center" };
            var style2 = { font: "16px Arial", fill: "#FFFFFF", align: "center" };

            tools = new Container(this.game, null, Container.prototype.VERTICAL, 0, 2);
            Container.prototype.reset(tools, this.game.width - 70, 10);
            game.world.add(tools);

            var tool1 = game.add.sprite(0, 0, "tower");
            tool1.width = 64;
            tool1.height = 64;
            tools.add(tool1);
            var tool2 = game.add.sprite(0, 0, "tower");
            tool2.width = 64;
            tool2.height = 64;
            tools.add(tool2);

            Container.prototype.doLayout(tools);

            // Create tool for making Towers (two sprites, with the top one being dragged around)
            game.add.sprite(this.game.width - 70, this.game.height - 150, 'tower');
            tower = game.add.sprite(this.game.width - 70, this.game.height - 150, 'tower');
            tower.inputEnabled = true;
            tower.input.enableDrag();
            tower.events.onDragStop.add(this.addOneTower, this);
            var text = "Tower";
            game.add.text(this.game.width - 58, this.game.height - 190, text, style1);
            text = "$100";
            game.add.text(this.game.width - 58, this.game.height - 175, text, style2);

            sprite = game.add.sprite(260, 100, 'arrow');
            sprite.anchor.set(0.5);
            game.physics.enable(sprite);

            sprite.body.setSize(16, 16, 8, 8);

            //  We'll set a lower max angular velocity here to keep it from going totally nuts
            sprite.body.maxAngular = 500;

            //  Apply a drag otherwise the sprite will just spin and never slow down
            sprite.body.angularDrag = 50;

            game.camera.follow(sprite);

            cursors = game.input.keyboard.createCursorKeys();
        },

        // Add a tower at the mouse position
        addOneTower: function (sprite, pointer) {
            var x = sprite.x + tileSize / 2;
            var y = sprite.y + tileSize / 2;

            var xTile = Math.round(x / tileSize);
            var yTile = Math.round(y / tileSize);

            map.putTile(4, xTile, yTile);

            sprite.x = game.width - 70;
            sprite.y = game.height - 250;
        },

        hitCoin: function (sprite, tile) {
            var xTile = tile.x;
            var yTile = tile.y;

            console.log("hit Coin " + xTile + " " + yTile);

            map.putTile(1, xTile, yTile);
            layer.dirty = true;

            return false;
        },

        hitTower: function (sprite, tile) {
            var xTile = tile.x;
            var yTile = tile.y;

            console.log("hit Tower " + xTile + " " + yTile);

            map.putTile(1, xTile, yTile);
            layer.dirty = true;

            return false;
        },

        update: function () {
            game.physics.arcade.collide(sprite, layer);

            sprite.body.velocity.x = 0;
            sprite.body.velocity.y = 0;
            sprite.body.angularVelocity = 0;

            if (cursors.left.isDown) {
                sprite.body.angularVelocity = -200;
            }
            else if (cursors.right.isDown) {
                sprite.body.angularVelocity = 200;
            }

            if (cursors.up.isDown) {
                game.physics.arcade.velocityFromAngle(sprite.angle, 200, sprite.body.velocity);
            }
        }
    };

    return Play;
});