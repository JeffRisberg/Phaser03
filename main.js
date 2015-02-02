var game = new Phaser.Game(890, 600, Phaser.CANVAS, 'phaser03',
    {
        preload: preload,
        create: create,
        update: update
    });

var map;
var layer;
var tileSize;

var tower;
var sprite;
var cursors;

function preload() {
    game.load.image('arrow', 'assets/sprites/arrow.png');
    game.load.image('tower', 'assets/sprites/tower.jpg');

    game.load.tilemap('map', 'assets/tilemaps/maps/tile_collision_test.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
    game.load.spritesheet('tiles', 'assets/tilemaps/tiles/tiles.png', 32, 32);
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    map = game.add.tilemap('map');

    map.addTilesetImage('ground_1x1');
    map.addTilesetImage('tiles', 'tiles');

    map.setCollisionBetween(1, 2);

    map.setTileIndexCallback(3, hitCoin, this);
    map.setTileIndexCallback(4, hitTower, this);

    layer = map.createLayer('Tile Layer 1');
    tileSize = 32;

    var style1 = { font: "11px Arial", fill: "#FFFFFF", align: "center" };
    var style2 = { font: "16px Arial", fill: "#FFFFFF", align: "center" };

    // Create tool for making Towers (two sprites, with the top one being dragged around)
    game.add.sprite(this.game.width - 70, this.game.height - 250, 'tower');
    tower = game.add.sprite(this.game.width - 70, this.game.height - 250, 'tower');
    tower.inputEnabled = true;
    tower.input.enableDrag();
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
    var x = sprite.x + tileSize / 2;
    var y = sprite.y + tileSize / 2;

    var xTile = Math.round(x / tileSize);
    var yTile = Math.round(y / tileSize);

    map.putTile(4, xTile, yTile);

    sprite.x = game.width - 70;
    sprite.y = game.height - 250;
}

function hitCoin(sprite, tile) {
    var xTile = tile.x;
    var yTile = tile.y;

    console.log("hit Coin " + xTile + " " + yTile);

    map.putTile(0, xTile, yTile);
    layer.dirty = true;

    return false;
}

function hitTower(sprite, tile) {
    var xTile = tile.x;
    var yTile = tile.y;

    console.log("hit Tower " + xTile + " " + yTile);

    map.putTile(0, xTile, yTile);
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
