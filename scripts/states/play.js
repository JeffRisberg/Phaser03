define(['extensions/Container'], function (Container) {
    'use strict';

    var game;

    var map;
    var layer;
    var tileSize;
    var towerTool;

    var playerX, playerY;
    var player;
    var score;
    var scoreText;
    var cursors;
    var fx;

    function Play(_game) {
        game = _game;
    }

    Play.prototype = {
        preload: function () {
            this.game.load.image('player', 'assets/sprites/player.png');
            this.game.load.image('tower', 'assets/sprites/tower.jpg');

            this.game.load.spritesheet('map1Button', 'assets/sprites/map1_button_sprite_sheet.png', 70, 25);
            this.game.load.spritesheet('map2Button', 'assets/sprites/map2_button_sprite_sheet.png', 70, 25);

            this.game.load.tilemap('map1', 'assets/tilemaps/maps/map1_data.json', null, Phaser.Tilemap.TILED_JSON);
            this.game.load.tilemap('map2', 'assets/tilemaps/maps/map2_data.json', null, Phaser.Tilemap.TILED_JSON);

            this.game.load.spritesheet('ground', 'assets/tilemaps/tiles/ground.png', 32, 32);
            this.game.load.spritesheet('tiles', 'assets/tilemaps/tiles/tiles.png', 32, 32);

            this.game.load.audio('sfx', 'assets/audio/fx_mixdown.ogg');
        },

        create: function () {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            this.setupMap('map1');

            // Un-comment this on to see the collision tiles
            //layer.debug = true;

            // Create example of a Container holding a set of buttons
            var buttonBox = new Container(this.game, null, Container.prototype.VERTICAL, 0, 2);
            Container.prototype.reset(buttonBox, this.game.width - 95, 10);
            game.world.add(buttonBox);

            var button1 = this.game.add.button(0, 0, 'map1Button', this.map1Click, this, 2, 1, 0);
            buttonBox.add(button1);
            var button2 = this.game.add.button(0, 0, 'map2Button', this.map2Click, this, 2, 1, 0);
            buttonBox.add(button2);

            Container.prototype.doLayout(buttonBox);

            var style1 = {font: "11px Arial", fill: "#FFFFFF", align: "center"};
            var style2 = {font: "16px Arial", fill: "#FFFFFF", align: "center"};

            // Create tool for making Towers (two sprites, with the top one being dragged around)
            game.add.sprite(this.game.width - 90, this.game.height - 150, 'tower');
            towerTool = game.add.sprite(this.game.width - 90, this.game.height - 150, 'tower');
            towerTool.inputEnabled = true;
            towerTool.input.enableDrag();
            towerTool.events.onDragStop.add(this.addOneTower, this);
            var text = "Tower";
            game.add.text(this.game.width - 78, this.game.height - 190, text, style1);
            text = "$100";
            game.add.text(this.game.width - 78, this.game.height - 175, text, style2);

            player = game.add.sprite(260, 100, 'player');
            game.physics.enable(player);
            player.anchor.set(0.5);

            player.body.setSize(31, 31, 0, 0);

            this.positionPlayer();

            game.camera.follow(player);

            score = 0;
            scoreText = this.game.add.text(this.game.width - 82, this.game.height - 270, '' + score,
                {font: "30px Arial", fill: "#fff", align: "center"});

            cursors = game.input.keyboard.createCursorKeys();

            fx = game.add.audio('sfx');
            fx.addMarker('ping', 10, 1.0);
        },

        // Add a tower at the mouse position
        addOneTower: function (sprite, pointer) {
            var x = sprite.x + tileSize / 2;
            var y = sprite.y + tileSize / 2;

            var xTile = Math.round(x / tileSize);
            var yTile = Math.round(y / tileSize);

            map.putTile(4, xTile, yTile);

            sprite.x = game.width - 90;
            sprite.y = game.height - 150;
        },

        hitCoin: function (sprite, tile) {
            var xTile = tile.x;
            var yTile = tile.y;

            map.putTile(1, xTile, yTile);
            layer.dirty = true;
            fx.play("ping");

            score += 5;
            scoreText.text = '' + score;

            return false;
        },

        hitTower: function (sprite, tile) {
            var xTile = tile.x;
            var yTile = tile.y;

            console.log("hit Tower " + xTile + " " + yTile);

            map.putTile(1, xTile, yTile);
            layer.dirty = true;
            fx.play("ping");

            return false;
        },

        map1Click: function (e) {
            this.setupMap("map1");
            this.positionPlayer();
        },

        map2Click: function (e) {
            this.setupMap("map2");
            this.positionPlayer();
        },

        update: function () {
            game.physics.arcade.collide(player, layer);

            player.body.velocity.y = 0;
            player.body.velocity.x = 0;

            if (cursors.up.isDown) {
                player.body.velocity.y -= 100;
            }
            else if (cursors.down.isDown) {
                player.body.velocity.y += 100;
            }
            if (cursors.left.isDown) {
                player.body.velocity.x -= 100;
            }
            else if (cursors.right.isDown) {
                player.body.velocity.x += 100;
            }
        },

        setupMap: function (mapName) {
            map = this.game.add.tilemap(mapName);

            map.addTilesetImage('ground', 'ground');
            map.addTilesetImage('tiles', 'tiles');

            map.setCollisionBetween(2, 3);

            map.setTileIndexCallback(3, this.hitCoin, this);
            map.setTileIndexCallback(4, this.hitTower, this);

            layer = map.createLayer('Tile Layer 1');
            tileSize = 32;
        },

        positionPlayer: function () {
            var found = false;
            for (var x = 0; x < layer.layer.width && !found; x++)
                for (var y = 0; y < layer.layer.height && !found; y++) {
                    var cell = map.getTile(x, y, layer, true);

                    if (cell.index == 1) {
                        player.x = x * tileSize + tileSize / 2;
                        player.y = y * tileSize + tileSize / 2;
                        found = true;
                        player.dirty = true;
                    }
                }

            this.game.world.bringToTop(player);
        }

    };

    return Play;
});