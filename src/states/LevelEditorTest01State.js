import TreeState from './TreeState';

class LevelEditorTest01State extends Phaser.State {

    constructor() {
        super();
    }

    preload() {
        /*
         ms_EditorLevelResourcesAutomate.parseCode();

         while( ms_EditorLevelResourcesAutomate.nextStep() )
         {
         if( ms_OnBlocklyLevelEditorResources )
         while( ms_OnBlocklyLevelEditorResources.go( this ) )
         {}

         ms_OnBlocklyLevelEditorResources = null;
         }
         */
    }

    create() {
        this.game.ms_EditorLevelCreateAutomate.parseCode();

        while (this.game.ms_EditorLevelCreateAutomate.nextStep()) {
            if (this.game.ms_OnBlocklyLevelEditorCreate)
                while (this.game.ms_OnBlocklyLevelEditorCreate.go(this)) {
                }

            this.game.ms_OnBlocklyLevelEditorCreate = null;
        }

        let aGoBackButton = this.game.add.button(this.game.width, this.game.height, "backtotree", this.getGoToState(TreeState.getStateName()), this);
        aGoBackButton.anchor.setTo(1.0, 1.0);
    }

    update() {
        /*
         ms_EditorLevelUpdateAutomate.parseCode();

         while( ms_EditorLevelUpdateAutomate.nextStep() )
         {
         if( ms_OnBlocklyLevelEditorUdpate )
         while( ms_OnBlocklyLevelEditorUdpate.go( this ) )
         {}

         ms_OnBlocklyLevelEditorUdpate = null;
         }
         */
        if (this.game.ms_OnBlocklyUpdate) {
            if (!this.game.ms_OnBlocklyUpdate.go(this)) {
                this.game.ms_OnBlocklyUpdate.clear();

                this.game.ms_GameUpdateAutomate.nextStep();
            }
        }
    }

    getGoToState(inStateName) {
        return () => {
            this.game.state.start(inStateName);
        };
    }

    static getStateName() {
        return "level_editor_test_01";
    }
}

export default LevelEditorTest01State;