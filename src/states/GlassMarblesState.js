import TreeState from './TreeState';

class GlassMarblesState extends Phaser.State {

    constructor() {
        super();

        this.m_Player = null;
        this.m_Cursors = null;
        this.m_Balls = null;
        this.m_MaxBallsLenght = 200;
        this.m_WaitToAddBallCounter = 0; // TODO remove if unused outside class
        this.m_WaitToAddBall = 1333; //milliseconds
        this.m_BallAnimeFPS = 2; // image per second

        this.m_BluePath = null;
        this.m_RedPath = null;
        this.m_GreenPath = null;
        this.m_Rocks = null;

        this.m_Score = 0;
        this.m_ScoreText = 'score: 0';

        this.m_PhysicDebug = false;

    }

    preload() {
        this.game.load.image('sky', '../assets/sky.png');

        this.game.load.image('rocks', '../assets/glassmarbles_01.png');
        this.game.load.image('path_green', '../assets/glassmarbles_01-green.png');
        this.game.load.image('path_blue', '../assets/glassmarbles_01-blue.png');
        this.game.load.image('path_red', '../assets/glassmarbles_01-red.png');

        this.game.load.physics("sprite_physics", "../assets/glassmarbles_01.json");

        this.game.load.image('backtotree', '../assets/back_to_tree_01.png');
        this.game.load.spritesheet('dude', '../assets/dude.png', 32, 48);
        this.game.load.spritesheet('balls', '../assets/balls.png', 17, 17);
    }

    create() {
        // Start the P2 Physics Engine
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.setImpactEvents(true);

        // Set the gravity
        this.game.physics.p2.gravity.y = 1000;

        //  A simple background for our game
        this.game.add.sprite(0, 0, 'sky');

        // Balls Paths
        this.m_BluePath = this.game.add.sprite(0, 0, 'path_blue');
        this.m_RedPath = this.game.add.sprite(0, 0, 'path_red');
        this.m_GreenPath = this.game.add.sprite(0, 0, 'path_green');

        this.m_Rocks = this.game.add.sprite(this.game.world.width * 0.5, this.game.world.height * 0.5, 'rocks');

        // The player and its settings
        this.m_Player = this.game.add.sprite(32, this.game.world.height - 50, 'dude');
        this.game.physics.p2.enable([this.m_Player], this.m_PhysicDebug);
        this.m_Player.body.fixedRotation = true;

        let aSpritesPhysics = [];
        //aSpritesPhysics.push( this.m_BluePath );
        //aSpritesPhysics.push( this.m_RedPath );
        //aSpritesPhysics.push( this.m_GreenPath );
        aSpritesPhysics.push(this.m_Rocks);

        this.game.physics.p2.enable(aSpritesPhysics, this.m_PhysicDebug);

        //this.m_BluePath.body.clearShapes();
        //this.m_BluePath.body.loadPolygon( 'sprite_physics', 'glassmarbles_01-blue');

        //this.m_RedPath.body.clearShapes();
        //this.m_RedPath.body.loadPolygon( 'sprite_physics', 'glassmarbles_01-red');

        //this.m_GreenPath.body.clearShapes();
        //this.m_GreenPath.body.loadPolygon( 'sprite_physics', 'glassmarbles_01-green');

        this.m_Rocks.body.clearShapes();
        this.m_Rocks.body.loadPolygon('sprite_physics', 'glassmarbles_01');

        for (let i = 0; i < aSpritesPhysics.length; i++) {
            aSpritesPhysics[i].body.static = true;
        }

        //  Player physics properties. Give the little guy a slight bounce.
        //this.m_Player.body.bounce.y = 0.2;
        //this.m_Player.body.gravity.y = 300;
        //this.m_Player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        this.m_Player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.m_Player.animations.add('right', [5, 6, 7, 8], 10, true);

        this.m_Cursors = this.game.input.keyboard.createCursorKeys();

        this.m_Balls = this.game.add.physicsGroup(Phaser.Physics.P2JS);

        // delay (ms), callbacks, context
        this.game.time.events.loop(this.m_WaitToAddBall, this.createBalls, this);

        this.m_ScoreText = this.game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff' });

        var aGoBackButton = this.game.add.button(this.game.width, this.game.height, "backtotree", this.getGoToState(TreeState.getStateName()), this);
        aGoBackButton.anchor.setTo(1.0, 1.0);
    }

    update() {
        if (this.game.ms_OnBlocklyUpdate) {
            if (!this.game.ms_OnBlocklyUpdate.go(this)) {
                this.game.ms_OnBlocklyUpdate = null;

                this.game.ms_GameUpdateAutomate.nextStep();// TODO how to access automate/workspace ?
            }
        }
    }

    render() {
        //this.game.debug.text( "Group size: " + this.m_Balls.total, 32, 32 );
    }

    getGoToState(inStateName) {
        return () => {
            this.game.state.start(inStateName);
        };
    }

    collectBall(inPlayer, inBall) {
        // Removes the ball from the screen
        //try
        {
            //this.m_Balls.remove( inBall.sprite, true );
        }
        //catch( e )
        {
            try {
                inBall.sprite.kill();
            }
            catch (e) {
                console.log(inBall.sprite);
            }
        }

        //  Add and update the score
        this.m_Score += 10;
        this.m_ScoreText.text = 'Score: ' + this.m_Score;
    }

    createBalls() {
        if (this.m_Balls.total < this.m_MaxBallsLenght) {
            this.m_WaitToAddBallCounter = 0; // TODO remove if unused outside class

            var aBall = this.m_Balls.create(this.game.width * 0.5 + this.game.rnd.integerInRange(-70, -10), 10, 'balls');

            aBall.body.setCircle(9);
            aBall.body.fixedRotation = true;

            aBall.frame = this.game.rnd.integerInRange(0, 6);

            this.m_Player.body.createBodyCallback(aBall, this.collectBall, this);
        }
    }

    static getStateName() {
        return "glassmarbles";
    }
}

export default GlassMarblesState;