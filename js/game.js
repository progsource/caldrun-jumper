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
        fxpu,
        sprite,
        tween,
        platforms,
        graphics,
        neko,
        collectiblesLength = 37,
        collectibleTimes = [10, 30],
        collectibleItems,
        isKillItemTriggered = false,
        score = 0,
        scoreText,
        isAnItemVisible = false,
        lastItemPositionX = 0,
        itemMinDistance = 70,
        timeElapsed = 90,
        timeText,
        nekoSpeed = 500,
        gameTimer,
        bgfx,
        isGameStop = false,
        gameOverText,
        isGameOverShown,
        caldrun,
        colors = [
            0x0000cc,
            0xcccccc,
            0x00ffff,
            0xffff00
        ],
        colorsLength = colors.length;


// -----------------------------------------------------------------------------
    function getRand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandAwayFromX(min, max) {
        var newRand;

        while (true) {
            newRand = getRand(min, max);
            if (
                (newRand < lastItemPositionX && newRand < lastItemPositionX - itemMinDistance) ||
                (newRand > lastItemPositionX && newRand > lastItemPositionX + itemMinDistance)
            ) {
                return newRand;
            }
        }
    }

    function setTime() {
        --timeElapsed;
    }

    function startTimer() {
        gameTimer = setInterval(setTime, 1000);
    }

    function storageAvailable(type) {
    	try {
    		var storage = window[type],
    			x = '__storage_test__';
    		storage.setItem(x, x);
    		storage.removeItem(x);
    		return true;
    	}
    	catch(e) {
    		return false;
    	}
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

    function updateScoreText() {
        scoreText.text = 'score: ' + score;
    }

// -----------------------------------------------------------------------------

    function onUp(event) {
        if (!isGameStop) {
            if (neko.body.touching.down) {
                neko.body.velocity.y = -900;
            }

            neko.animations.stop();
            neko.animations.frame = 16;
            fx.play();
        }
    }

    function onRight(event) {
        if (!isGameStop) {
            neko.body.velocity.x = nekoSpeed;
            displayGoRight();
        }
    }

    function onDown(event) {
        if (!isGameStop) {
            neko.body.velocity.x = 0;
            displayIdle();
        }
    }

    function onLeft(event) {
        if (!isGameStop) {
            neko.body.velocity.x = -1 * nekoSpeed;
            displayGoLeft();
        }
    }

    function onSpace(event) {
        if (!isGameStop) {
            if (neko.body.touching.down) {
                neko.body.velocity.y = -900;

                neko.animations.stop();
                neko.animations.frame = 16;
                fx.play();
            }
        } else {
            reset();
        }
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
        fxpu.play();
        if (!isKillItemTriggered) {
            isKillItemTriggered = true;
            setTimeout(function() {
                item.destroy();
                score += 10;
                updateScoreText();
                isKillItemTriggered = false;
                isAnItemVisible = false;
            }, 500);
        }
    }

    function showANewItem() {
        var randNr = getRand(0, collectiblesLength - 1);
        lastItemPositionX = getRandAwayFromX(20, game.world.width - 40);

        var item = collectibleItems.create(
            lastItemPositionX,
            getRand(300, 400),
            'items'
        );
        item.animations.frame = randNr;
        isAnItemVisible = true;
    }


    function reset() {
        timeElapsed = 90;
        isGameOverShown = false;
        gameOverText.destroy();
        neko.x = 0;
        neko.y = game.height - 100;
        score = 0;
        isGameStop = false;
        startTimer();
        scoreText.text = 'score: 0';
        caldrun.destroy();
        neko.tint = colors[getRand(0, colorsLength - 1)];
        bgfx.play();
    }
// -----------------------------------------------------------------------------

    function preload() {
        game.load.image('background1', 'img/background.jpg');
        game.load.spritesheet('sprite', 'img/spritesheet.png', 20, 30);

        game.load.spritesheet('neko', 'img/Neko_edited.png', 32, 32, 17);

        game.load.spritesheet('items', 'img/items.png', 32, 32);
        game.load.spritesheet('caldrun', 'img/boil.png', 32, 32);

        game.load.audio('sfx', 'sounds/sound5.ogg');
        game.load.audio('sfxpickup', 'sounds/sound4.ogg');
        game.load.audio('bgsfx', 'sounds/An_Adventure_Awaits.mp3');
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
        fxpu = game.add.audio('sfxpickup');
        bgfx = game.add.audio('bgsfx');
        bgfx.play();

        // setTimeout(showANewItem, 100);

        scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff' });

        timeText = game.add.text(16, 64, '0', { fontSize: '32px', fill: '#fff' });
        startTimer();

        if (storageAvailable('localStorage') && !localStorage.getItem('score')) {
            localStorage.setItem('playerName', '');
            localStorage.setItem('score', 0);
        }
    }

    function updateHighscore() {
        if (storageAvailable('localStorage')) {
            if (score > localStorage['score']) {
                var playerName = prompt('Please enter your name', 'unknown player');
                localStorage.setItem('playerName', playerName);
                localStorage.setItem('score', score);
            }
        }
    }

    function getHighscore() {
        return {
            score: localStorage['score'],
            playerName: localStorage['playerName']
        };
    }

    function update() {

        if (0 >= timeElapsed && !isGameOverShown) {
            neko.animations.stop();
            clearInterval(gameTimer);

            timeText.text = 0;
            bgfx.stop();
            isGameStop = true;
            isGameOverShown = true;

            setTimeout(function() {
                updateHighscore();
                caldrun = game.add.sprite(200, game.world.height - 150, 'caldrun');
                caldrun.animations.add('boil', [0,1,2,3]);
                caldrun.animations.play('boil', 10, true);
                var highscore = getHighscore();
                gameOverText = game.add.text(
                    game.world.width / 6,
                    game.world.height / 4,
                    "finish!\nhighscore player: " + highscore.playerName + "\nhighscore: " + highscore.score + "\nyour score: " + score + "\npress space",
                    {fontSize: '42px', fill: '#fff'}
                );
            }, 200);
        }

        if (!isGameStop) {
            game.physics.arcade.collide(neko, platforms);
            game.physics.arcade.overlap(neko, collectibleItems, collectItem, null, this);

            if (neko.body.touching.down && neko.body.velocity.x < 0) {
                displayGoLeft();
            }
            if (neko.body.touching.down && neko.body.velocity.x > 0) {
                displayGoRight();
            }
            if (neko.body.touching.down && neko.body.velocity.x === 0) {
                displayIdle();
            }

            if (!isAnItemVisible) {
                showANewItem();
            }

            timeText.text = timeElapsed;
        }

    }

    function render() {
        // game.debug.spriteInfo(neko, 20, 32);

    }
}(Phaser));
