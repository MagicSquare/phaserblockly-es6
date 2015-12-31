import PhaserDemo1State from './PhaserDemo1State';
import GlassMarblesState from './GlassMarblesState';
import GlassMarbles2State from './GlassMarbles2State';
import LevelEditorTest01State from './LevelEditorTest01State';

class TreeState extends Phaser.State {

    preload() {
        this.game.load.image("tree", "../assets/tree.png");
        this.game.load.image("spot", "../assets/tree_level_spot_01.png");
    }

    create() {
        this.game.add.sprite(0, 0, 'tree');

        this.addState(this.game.width * 0.5, this.game.height, PhaserDemo1State.getStateName(), 'Demo 1');
        this.addState(this.game.width * 0.5, this.game.height - 60, GlassMarblesState.getStateName(), 'Glass Marbles');
        this.addState(this.game.width * 0.5, this.game.height - 120, GlassMarbles2State.getStateName(), 'Glass Marbles2');
        this.addState(this.game.width * 0.5, this.game.height - 180, LevelEditorTest01State.getStateName(), 'Level Editor Test 01');
    }

    addState(x, y, inStateName, inTitle) {
        var aPlayButton = this.game.add.button(x, y, "spot", this.getGoToState(inStateName), this);
        aPlayButton.anchor.setTo(0.5, 1.0);

        var aText = this.game.add.text(x, y - aPlayButton.height * 0.5, inTitle, { fontSize: '10px', fill: '#000' });
        aText.anchor.setTo(0.5, 0.5);
    }

    getGoToState(inStateName) {
        return () => {
            this.game.state.start(inStateName);
        };
    }

    static getStateName() {
        return "Tree";
    }
}

export default TreeState;