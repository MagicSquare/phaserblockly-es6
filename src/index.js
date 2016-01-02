import BootState from './states/BootState';
import PreloaderState from './states/PreloaderState';
import TreeState from './states/TreeState';
import PhaserDemo1State from './states/PhaserDemo1State';
import GlassMarblesState from './states/GlassMarblesState';
import GlassMarbles2State from './states/GlassMarbles2State';
import LevelEditorTest01State from './states/LevelEditorTest01State';
import Automate from './Automate';
import BlockInstructions from './BlockInstructions';

class Game extends Phaser.Game {

    constructor() {
        super(800, 600, Phaser.AUTO, 'phaserGame', null);
        this.ms_OnBlocklyUpdate = new BlockInstructions();
        this.ms_OnBlocklyLevelEditorResources = new BlockInstructions();
        this.ms_OnBlocklyLevelEditorCreate = new BlockInstructions();
        this.ms_OnBlocklyLevelEditorUdpate = new BlockInstructions();
        this.ms_GameUpdateAutomate = null;
        this.ms_EditorLevelResourcesAutomate = null;
        this.ms_EditorLevelCreateAutomate = null;
        this.ms_EditorLevelUpdateAutomate = null;
        this.m_CurrentStage = null;

        this.initStates();
        this.initAutomate();
        this.initWorkspace();

        this.state.start(BootState.getStateName());
    }

    initStates() {
        this.state.add(BootState.getStateName(), BootState);
        this.state.add(PreloaderState.getStateName(), PreloaderState);
        this.state.add(TreeState.getStateName(), TreeState);
        this.state.add(PhaserDemo1State.getStateName(), PhaserDemo1State);
        this.state.add(GlassMarblesState.getStateName(), GlassMarblesState);
        this.state.add(GlassMarbles2State.getStateName(), GlassMarbles2State);
        this.state.add(LevelEditorTest01State.getStateName(), LevelEditorTest01State);
    }

    initAutomate() {
        this.ms_GameUpdateAutomate = new Automate(this.ms_OnBlocklyUpdate,
            'blocklyGameMenu',
            'gametoolbox',
            'consoleTextarea',
            'stepButton');

        this.ms_EditorLevelResourcesAutomate = new Automate(this.ms_OnBlocklyLevelEditorResources,
            'blocklyLevelEditorResourcesMenu',
            'leveleditorresourcestoolbox',
            '',
            '');

        this.ms_EditorLevelCreateAutomate = new Automate(this.ms_OnBlocklyLevelEditorCreate,
            'blocklyLevelEditorCreateMenu',
            'leveleditorcreatetoolbox',
            '',
            '');

        this.ms_EditorLevelUpdateAutomate = new Automate(this.ms_OnBlocklyLevelEditorUdpate,
            'blocklyLevelEditorUpdateMenu',
            'leveleditorupdatetoolbox',
            '',
            '');
    }

    initWorkspace() {
        $('#tabs').tab();

        $("#buildandrunButton").click(() => {
            this.ms_GameUpdateAutomate.parseCode();

            this.ms_GameUpdateAutomate.nextStep();
        });

        $("#resetButton").click(() => {
            this.ms_OnBlocklyUpdate.clear();
            this.state.start(this.state.current);
        });

        $("#buildButton").click(() => {
            this.ms_GameUpdateAutomate.parseCode();
        });

        $("#stepButton").click(() => {
            this.ms_GameUpdateAutomate.stepClick();
        });

        $("#buildlevelButton").click(() => {
            //this.ms_EditorLevelResourcesAutomate.parseCode();
            //this.ms_EditorLevelResourcesAutomate.nextStep();

            //this.ms_EditorLevelCreateAutomate.parseCode();
            //this.ms_EditorLevelCreateAutomate.nextStep();

            //this.ms_EditorLevelUpdateAutomate.parseCode();
            //this.ms_EditorLevelUpdateAutomate.nextStep();

            this.state.start(this.state.current);
        });

        $("#resetlevelButton").click(() => {
            this.ms_OnBlocklyLevelEditorResources.clear();
            this.ms_OnBlocklyLevelEditorCreate.clear();
            this.ms_OnBlocklyLevelEditorUdpate.clear();

            this.state.start(this.state.current);
        });
    }

    getCurrentStage() {
        if (!this.m_CurrentStage) {
            alert("Game.m_CurrentStage is null.");
        }
        return this.m_CurrentStage;
    };
}

new Game();