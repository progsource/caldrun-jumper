(function(Phaser) {
    'use strict';

    var GAME_WIDTH = 800,
        GAME_HEIGHT = 600,
        GAME_CONTAINER_ID = 'game',
        game = new Phaser.Game(
            GAME_WIDTH,
            GAME_HEIGHT,
            Phaser.AUTO,
            GAME_CONTAINER_ID,
            {
                preload: preload,
                create: create,
                update: update,
                render: render
            }
        ),
        cursors = [],
        otherCursors,
        fx,
        sprite,
        tween,
        platforms,
        graphics,
        neko,
        collectibles = [
            {
                name: 'paperRoll',
                imgFrame: 1
            },
            {
                name: 'blueCrystal',
                imgFrame: 2
            }
        ],
        collectiblesLength = collectibles.length,
        collectibleTimes = [10, 30],
        collectibleItems,
        isKillItemTriggered = false;


// -----------------------------------------------------------------------------
    function getRand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
// -----------------------------------------------------------------------------

    function displayGoLeft() {
        neko.animations.play('walkLeft', 10, true);
    }

    function displayGoRight() {
        neko.animations.play('walkRight', 10, true);
    }

    function displayIdle() {
        neko.animations.play('idle', 5, true);
    }

// -----------------------------------------------------------------------------

    function onUp(event) {
        console.group('onUp');
        console.log(event);
        console.groupEnd();
    }

    function onRight(event) {
        neko.body.velocity.x = 150;
        displayGoRight();
    }

    function onDown(event) {
        neko.body.velocity.x = 0;
        displayIdle();
    }

    function onLeft(event) {
        neko.body.velocity.x = -150;
        displayGoLeft();
    }

    function onSpace(event) {

        // neko.body.velocity.x = 0;
        if (neko.body.touching.down) {
            neko.body.velocity.y = -900;
        }

        neko.animations.stop();
        neko.animations.frame = 16;
        fx.play();
    }

// -----------------------------------------------------------------------------

    function bindKeys(cursorType) {
        cursorType.up.onUp.add(function(e) {
            onUp(e);
        });
        cursorType.right.onUp.add(function(e) {
            onRight(e);
        });
        cursorType.down.onUp.add(function(e) {
            onDown(e);
        });
        cursorType.left.onUp.add(function(e) {
            onLeft(e);
        });
    }

    function keyBoardSetup() {
        cursors[cursors.length] = game.input.keyboard.createCursorKeys();
        cursors[cursors.length] = game.input.keyboard.addKeys({
            'up': Phaser.KeyCode.W,
            'right': Phaser.KeyCode.D,
            'down': Phaser.KeyCode.S,
            'left': Phaser.KeyCode.A
        });
        cursors[cursors.length] = game.input.keyboard.addKeys({
            'up': Phaser.KeyCode.NUMPAD_8,
            'right': Phaser.KeyCode.NUMPAD_6,
            'down': Phaser.KeyCode.NUMPAD_2,
            'left': Phaser.KeyCode.NUMPAD_4
        });

        var i = 0,
            cursorLength = cursors.length;

        for (; i < cursorLength; ++i) {
            bindKeys(cursors[i]);
        }

        otherCursors = game.input.keyboard.addKeys({
            'space': Phaser.KeyCode.SPACEBAR
        });

        otherCursors.space.onUp.add(function(e) {
            onSpace(e);
        });
    }

// -----------------------------------------------------------------------------

    function collectItem(player, item) {
        item.body.velocity.y = -200;
        if (!isKillItemTriggered) {
            isKillItemTriggered = true;
            setTimeout(function() {
                item.kill();
                console.log('got item');
                isKillItemTriggered = false;
            }, 300);
        }
    }

// -----------------------------------------------------------------------------

    function preload() {
        game.load.image('background1', 'img/background.jpg');
        game.load.spritesheet('sprite', 'img/spritesheet.png', 20, 30);

        game.load.spritesheet('neko', 'img/Neko_edited.png', 32, 32, 17);
        game.load.spritesheet('items', 'img/items.png', 32, 32);

        game.load.audio('sfx', 'sounds/sound5.ogg');
    }

    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.sprite(0, 0, 'background1');
        platforms = game.add.group();
        platforms.enableBody = true;

        collectibleItems = game.add.group();
        collectibleItems.enableBody = true;

        var bmd = game.add.bitmapData(game.width, 20, 'bottomLine', true);
        bmd.ctx.beginPath();
        bmd.ctx.rect(0, 0, game.width, 20);
        bmd.ctx.fillStyle = '#333333';
        bmd.ctx.fill();
        var drawnObject = game.add.sprite(0, game.height - 20, bmd);
        // var ground = platforms.create(0, game.world.height - 64, 'bottomLine');
        platforms.add(drawnObject);
        drawnObject.body.immovable = true;


        neko = game.add.sprite(0, game.height - 100, 'neko');
        neko.animations.add('walkRight', [0, 1, 2, 3, 4, 5]);
        neko.animations.add('walkLeft', [6, 7, 8, 9, 10, 11]);
        neko.animations.add('idle', [12, 13, 14, 15]);
        displayIdle();

        game.physics.arcade.enable(neko);
        neko.body.bounce.y = 0.2;
        neko.body.gravity.y = 1000;
        neko.body.collideWorldBounds = true;

        keyBoardSetup();

        fx = game.add.audio('sfx');

        setTimeout(function() {
            var randNr = getRand(0, collectiblesLength - 1);
            var item = collectibleItems.create(game.world.centerX, 300, 'items');
            item.animations.frame = collectibles[randNr].imgFrame;
            // game.physics.arcade.enable(item);
        }, 100)
    }

    function update() {

        game.physics.arcade.collide(neko, platforms);
        game.physics.arcade.overlap(neko, collectibleItems, collectItem, null, this);
        // game.physics.arcade.collide(collectibleItems, neko);

        if (neko.body.touching.down && neko.body.velocity.x < 0) {
            displayGoLeft();
        }
        if (neko.body.touching.down && neko.body.velocity.x > 0) {
            displayGoRight();
        }
        if (neko.body.touching.down && neko.body.velocity.x === 0) {
            displayIdle();
        }

    }

    function render() {
        // game.debug.spriteInfo(neko, 20, 32);

    }
}(Phaser));
