import BootState from './states/BootState';
import PreloaderState from './states/PreloaderState';
import TreeState from './states/TreeState';
import PhaserDemo1State from './states/PhaserDemo1State';
import GlassMarblesState from './states/GlassMarblesState';
import GlassMarbles2State from './states/GlassMarbles2State';
import LevelEditorTest01State from './states/LevelEditorTest01State';
import Automate from './Automate';

class Game extends Phaser.Game {

    constructor() {
        super(800, 600, Phaser.AUTO, 'phaserGame', null);
        this.ms_OnBlocklyUpdate = new BlockInstructionEmpty();
        this.ms_OnBlocklyLevelEditorResources = new BlockInstructionEmpty();
        this.ms_OnBlocklyLevelEditorCreate = new BlockInstructionEmpty();
        this.ms_OnBlocklyLevelEditorUdpate = new BlockInstructionEmpty();
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
        let aGameUpdatePointerAcces = {
            get() {
                return this.ms_OnBlocklyUpdate;
            },
            set(inInstruction) {
                this.ms_OnBlocklyUpdate = inInstruction;
            }
        };
        this.ms_GameUpdateAutomate = new Automate(aGameUpdatePointerAcces,
            'blocklyGameMenu',
            'gametoolbox',
            'consoleTextarea',
            'stepButton');

        let aEditorLevelResourcesPointerAcces =
        {
            get() {
                return this.ms_OnBlocklyLevelEditorResources;
            },
            set: function (inInstruction) {
                this.ms_OnBlocklyLevelEditorResources = inInstruction;
            }
        };
        this.ms_EditorLevelResourcesAutomate = new Automate(aEditorLevelResourcesPointerAcces,
            'blocklyLevelEditorResourcesMenu',
            'leveleditorresourcestoolbox',
            '',
            '');

        let aEditorLevelCreatePointerAcces =
        {
            get() {
                return this.ms_OnBlocklyLevelEditorCreate;
            },
            set(inInstruction) {
                this.ms_OnBlocklyLevelEditorCreate = inInstruction;
            }
        };
        this.ms_EditorLevelCreateAutomate = new Automate(aEditorLevelCreatePointerAcces,
            'blocklyLevelEditorCreateMenu',
            'leveleditorcreatetoolbox',
            '',
            '');

        let aEditorLevelUpdatePointerAcces =
        {
            get() {
                return this.ms_OnBlocklyLevelEditorUdpate;
            },
            set(inInstruction) {
                this.ms_OnBlocklyLevelEditorUdpate = inInstruction;
            }
        };
        this.ms_EditorLevelUpdateAutomate = new Automate(aEditorLevelUpdatePointerAcces,
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
            ms_CounterStep = 0;
            this.ms_OnBlocklyUpdate = null;
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

            this.state.start(ms_Phaser.m_Game.state.current);
        });

        $("#resetlevelButton").click(() => {
            ms_CounterStep = 0;

            this.ms_OnBlocklyLevelEditorResources = null;
            this.ms_OnBlocklyLevelEditorCreate = null;
            this.ms_OnBlocklyLevelEditorUdpate = null;

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