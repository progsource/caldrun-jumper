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
        cursors,
        wasdCursors;

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

    function keyBoardSetup() {
        cursors = game.input.keyboard.createCursorKeys();
        wasdCursors = game.input.keyboard.addKeys({
            'up': Phaser.KeyCode.W,
            'right': Phaser.KeyCode.D,
            'down': Phaser.KeyCode.S,
            'left': Phaser.KeyCode.A
        });

        cursors.up.onUp.add(function(e) {
            onUp(e);
        });
        wasdCursors.up.onUp.add(function(e) {
            onUp(e);
        });

        cursors.right.onUp.add(function(e) {
            onRight(e);
        });
        wasdCursors.right.onUp.add(function(e) {
            onRight(e);
        });

        cursors.down.onUp.add(function(e) {
            onDown(e);
        });
        wasdCursors.down.onUp.add(function(e) {
            onDown(e);
        });

        cursors.left.onUp.add(function(e) {
            onLeft(e);
        });
        wasdCursors.left.onUp.add(function(e) {
            onLeft(e);
        });
    }

// -----------------------------------------------------------------------------

    function preload() {
        game.load.image('background1', 'img/background.jpg');
    }

    function create() {
        game.add.sprite(0, 0, 'background1');

        keyBoardSetup();
    }

    function update() {


    }
}(Phaser));
