var game = new Phaser.Game(890, 600, Phaser.CANVAS, 'phaser03',
    {
        preload: preload,
        create: create,
        update: update
    });

var map;
var layer;

var tower;
var sprite;
var cursors;

function preload() {
    game.load.tilemap('map', 'assets/tilemaps/maps/tile_collision_test.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
    game.load.image('arrow', 'assets/sprites/arrow.png');
    game.load.image('tower', 'assets/sprites/tower.jpg');

    game.load.spritesheet('coin', 'assets/sprites/coin.png', 32, 32);
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    map = game.add.tilemap('map');

    map.addTilesetImage('ground_1x1');
    map.addTilesetImage('coin');

    map.setCollisionBetween(1, 2);

    //  This will set Tile ID 26 (the coin) to call the hitCoin function when collided with
    map.setTileIndexCallback(3, hitCoin, this);

    layer = map.createLayer('Tile Layer 1');

    //layer.resizeWorld();

    var style1 = { font: "11px Arial", fill: "#FFFFFF", align: "center" };
    var style2 = { font: "16px Arial", fill: "#FFFFFF", align: "center" };

    // Create tool for making Towers
    tower = game.add.sprite(this.game.width - 70, this.game.height - 250, 'tower');
    tower.inputEnabled = true;
    tower.input.enableDrag();
    tower.input.enableSnap(32, 32, true, true);
    tower.events.onDragStop.add(addOneTower, this);
    text = "Tower";
    game.add.text(this.game.width - 50, this.game.height - 290, text, style1);
    text = "$100";
    game.add.text(this.game.width - 50, this.game.height - 275, text, style2);

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
}

// add a tower at the mouse position
function addOneTower(sprite, pointer) {
    var x = pointer.x;
    var y = pointer.y;

    console.log("adding a tower at " + x + " " + y);
}

function hitCoin(sprite, tile) {
    tile.alpha = 0.2; // make the tile fade out

    layer.dirty = true;

    return false;
}

function update() {
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
