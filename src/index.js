import BootState from './states/BootState';
import PreloaderState from './states/PreloaderState';
import TreeState from './states/TreeState';
import PhaserDemo1State from './states/PhaserDemo1State';
import GlassMarblesState from './states/GlassMarblesState';
import GlassMarbles2State from './states/GlassMarbles2State';
import LevelEditorTest01State from './states/LevelEditorTest01State';

class Game extends Phaser.Game {

    constructor() {
        super(800, 600, Phaser.AUTO, 'phaserGame', null);
        this.ms_OnBlocklyUpdate = new BlockInstructionEmpty();
        this.ms_OnBlocklyLevelEditorResources = new BlockInstructionEmpty();
        this.ms_OnBlocklyLevelEditorCreate = new BlockInstructionEmpty();
        this.ms_OnBlocklyLevelEditorUdpate = new BlockInstructionEmpty();
        this.m_CurrentStage = null;

        this.state.add(BootState.getStateName(), BootState);
        this.state.add(PreloaderState.getStateName(), PreloaderState);
        this.state.add(TreeState.getStateName(), TreeState);
        this.state.add(PhaserDemo1State.getStateName(), PhaserDemo1State);
        this.state.add(GlassMarblesState.getStateName(), GlassMarblesState);
        this.state.add(GlassMarbles2State.getStateName(), GlassMarbles2State);
        this.state.add(LevelEditorTest01State.getStateName(), LevelEditorTest01State);

        this.state.start(BootState.getStateName());
    }

    getCurrentStage() {
        if (!this.m_CurrentStage) {
            alert("Game.m_CurrentStage is null.");
        }
        return this.m_CurrentStage;
    };
}

new Game();