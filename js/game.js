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
                update: update
            }
        ),
        cursors = [],
        otherCursors,
        fx;

// -----------------------------------------------------------------------------

    function onUp(event) {
        console.group('onUp');
        console.log(event);
        console.groupEnd();
    }

    function onRight(event) {
        console.group('onRight');
        console.log(event);
        console.groupEnd();
    }

    function onDown(event) {
        console.group('onDown');
        console.log(event);
        console.groupEnd();
    }

    function onLeft(event) {
        console.group('onLeft');
        console.log(event);
        console.groupEnd();
    }

    function onSpace(event) {
        console.group('onSpace');
        console.log(event);
        console.groupEnd();
        fx.play();
    }

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

    function preload() {
        game.load.image('background1', 'img/background.jpg');

        game.load.audio('sfx', 'sounds/sound5.ogg');
    }

    function create() {
        game.add.sprite(0, 0, 'background1');

        keyBoardSetup();

        fx = game.add.audio('sfx');
    }

    function update() {


    }
}(Phaser));
