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
        );

    function preload() {}
    
    function create() {}

    function update() {
        this.game.input.keyboard.onDownCallback = function(e) {
            console.log(e.keyCode);

            if (37 === e.keyCode) {
                console.log('key left pressed');
            } else if (38 === e.keyCode) {
                console.log('key up pressed');
            } else if (39 === e.keyCode) {
                console.log('key right pressed');
            } else if (40 === e.keyCode) {
                console.log('key down pressed');
            }
        };
    }
}(Phaser));
