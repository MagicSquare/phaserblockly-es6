class BlockInstructions {
    constructor() {
        /** Step counter to naming the highlight tag
         *    @remarks Before to run the instructions reinit this one.
         */
        this.ms_CounterStep = 0;

        this.initBlocks();
    }

    isEmpty() {
        return false; // TODO instructions are empty ?
    }

    clear() {
        this.ms_CounterStep = 0;
        // TODO clear instructions
    }

    /** To show step by step mod */
    getEndBlockCode() {
        let aCounter = this.ms_CounterStep;
        this.ms_CounterStep++;
        return 'highlightBlock( ' + aCounter + ' );';
    }

    /**    Each update the state class has to call the go function.
     *
     *    @param {object} [inState] - use that to access at the state variables.
     *
     *    @method BlockInstructionEmpty#go
     */
    go(inState) {
        return false;
    }

    /** Template str basic instruction
     *
     *    @param {string[]} [inMembers] - str members arrays
     *
     *   @param {string} [inStrFuncGo] string function definition: Has to return false to close
     *                                  the instruction
     *
     *    @remarks got to the blockfactory @link https://blockly-demo.appspot.com/static/demos/blockfactory/index.html
     *             to create your own block.
     */
    getStrBlockInstruction(inMembers, inStrFuncGo) {
        let aResult = "";

        aResult += "function()";
        aResult += "{";

        for (let i = 0; i < inMembers.length; i++) {
            aResult += "this." + inMembers[i] + ";"
        }

        aResult += "this.go = function( inState )";
        aResult += "{";
        aResult += inStrFuncGo;
        aResult += "};";
        aResult += "}";

        //eval(aResult);

        return aResult;
    }

    /** Create a basic class instructions
     *
     *    @param {string[]} [inMembers array] of members example : ["m_Count=10"]
     *
     *    @param {string} [inStrFuncGo] go str function example :
     *
     *          aGoFunc =  "if( 0 < this.m_Count )"
     *          aGoFunc += "{"
    *		   aGoFunc +=		"inState.m_Player.body.velocity.y = -350;"
    *		   aGoFunc +=      "this.m_Count--;"
    *		   aGoFunc +=		"return true;" // It's not the instruction end. We have to continue.
    *		   aGoFunc += "}"
     *          aGoFunc += "else"
     *          aGoFunc += "{"
    *		   aGoFunc +=		"return false;" // Instruction end.
    *		   aGoFunc += "}"
     */
    createBasicFunction(inMembers, inStrFuncGo) {
        const aGoFunc = 'ms_OnBlocklyUpdate = new ' + this.getStrBlockInstruction(inMembers, inStrFuncGo) + ';';

        let aResult = '';

        aResult += 'eval( "' + aGoFunc + '" );';
        aResult += this.getEndBlockCode(); //Step by Step

        //eval( aResult ); //Debug to see if the code works

        return aResult;
    }

    gotoColor(inColorPosVarName, inColorOverLapVarName) {
        let aGetAnimFunc = "";
        aGetAnimFunc += "getAnim = function( inSign )";
        aGetAnimFunc += "{";
        aGetAnimFunc += "var aResult = 'right';";
        aGetAnimFunc += "if( inSign < 0 )";
        aGetAnimFunc += "{";
        aGetAnimFunc += "aResult = 'left';";
        aGetAnimFunc += "}";
        aGetAnimFunc += "return aResult;";
        aGetAnimFunc += "}";

        const aMembers = ["m_IsComingBack = false", aGetAnimFunc];

        let aGoFunc = "";
        //  Reset the players velocity (movement)
        aGoFunc += "inState.m_Player.body.velocity.x = 0;";

        aGoFunc += "if( !this.m_IsComingBack && !inState.isCloseToPalyer( inState." + inColorPosVarName + " ) )";
        aGoFunc += "{";
        aGoFunc += "var aDirectionX = inState." + inColorPosVarName + " - inState.m_Player.body.x;";
        aGoFunc += "var aSign = Phaser.Math.sign( aDirectionX );";
        aGoFunc += "inState.m_Player.body.velocity.x = aSign * inState.m_PlayerVelocityX;"
        aGoFunc += "inState.m_Player.animations.play( this.getAnim( aSign ) ) ;";
        aGoFunc += "return true;";
        aGoFunc += "}";
        aGoFunc += "else";
        aGoFunc += "{";
        aGoFunc += "if( !this.m_IsComingBack && inState." + inColorOverLapVarName + " )";
        aGoFunc += "{";
        aGoFunc += "inState.m_Player.animations.play( 'idle' );";
        aGoFunc += "return true;";
        aGoFunc += "}";
        aGoFunc += "else";
        aGoFunc += "{";
        aGoFunc += "this.m_IsComingBack = true;";
        aGoFunc += "if( !inState.isCloseToPalyer( inState.m_Origin ) )";
        aGoFunc += "{";
        aGoFunc += "var aDirectionX = inState.m_Origin - inState.m_Player.body.x;";
        aGoFunc += "var aSign = Phaser.Math.sign( aDirectionX );";
        aGoFunc += "inState.m_Player.body.velocity.x = aSign * inState.m_PlayerVelocityX;"
        aGoFunc += "inState.m_Player.animations.play( this.getAnim( aSign ) );";
        aGoFunc += "return true;";
        aGoFunc += "}";
        aGoFunc += "else";
        aGoFunc += "{";
        aGoFunc += "inState.m_Player.animations.play( 'idle' );";
        aGoFunc += "return false;";
        aGoFunc += "}";
        aGoFunc += "}";
        aGoFunc += "}";

        return this.createBasicFunction(aMembers, aGoFunc);
    }

    initBlocks() {
        this.initBlockBugMoveLeft();
        this.initBlockBugMoveRight();
        this.initBlockBugJump();
        this.initBlockBugWait();
        this.initBlockControlsLoop();
        this.initBlockInfiniteLoop();
        this.initBlockLoadImage();
        this.initBlockBugAddSprite();
        this.initBlockMoveToBlue();
        this.initBlockMoveToGreen();
        this.initBlockMoveToRed();
        this.initBlockIfColorName();
    }

    initBlockBugMoveLeft() {
        /** Move Left @see index.html toolbox */
        Blockly.Blocks['bug_move_left'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("Left")
                    .appendField(new Blockly.FieldTextInput("1"), "cycle")
                    .appendField("cycle(s)");
                this.setInputsInline(true);
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setColour(0);
                this.setTooltip('');
                this.setHelpUrl('http://www.example.com/');
            }
        };

        Blockly.JavaScript['bug_move_left'] = (inBlock) => {
            const aTextCycle = inBlock.getFieldValue('cycle');

            const aMembers = ["m_Count = " + aTextCycle];

            let aGoFunc = "";

            aGoFunc += "inState.m_Player.body.velocity.x = 0;"; //  Reset the players velocity (movement)

            aGoFunc += "if( 0 < this.m_Count )";
            aGoFunc += "{";
            aGoFunc += "inState.m_Player.body.velocity.x = -150;"; //  Move to the right
            aGoFunc += "inState.m_Player.animations.play('left');";
            aGoFunc += "this.m_Count--;";
            aGoFunc += "return true;";
            aGoFunc += "}";
            aGoFunc += "else";
            aGoFunc += "{";
            aGoFunc += "inState.m_Player.animations.stop();"; //  Stand still
            aGoFunc += "inState.m_Player.frame = 4;";
            aGoFunc += "return false;";
            aGoFunc += "}";

            return this.createBasicFunction(aMembers, aGoFunc);
        };
    }

    initBlockBugMoveRight() {
        /** Move Right @see index.html toolbox */
        Blockly.Blocks['bug_move_right'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("Right")
                    .appendField(new Blockly.FieldTextInput("1"), "cycle")
                    .appendField("cycle(s)");
                this.setInputsInline(true);
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setColour(0);
                this.setTooltip('');
                this.setHelpUrl('http://www.example.com/');
            }
        };

        Blockly.JavaScript['bug_move_right'] = (inBlock) => {
            const aTextCycle = inBlock.getFieldValue('cycle');

            const aMembers = ["m_Count = " + aTextCycle];

            let aGoFunc = "";

            aGoFunc += "inState.m_Player.body.velocity.x = 0;"; //  Reset the players velocity (movement)

            aGoFunc += "if( 0 < this.m_Count )";
            aGoFunc += "{";
            aGoFunc += "inState.m_Player.body.velocity.x = 150;"; //  Move to the right
            aGoFunc += "inState.m_Player.animations.play('right');";
            aGoFunc += "this.m_Count--;";
            aGoFunc += "return true;";
            aGoFunc += "}";
            aGoFunc += "else";
            aGoFunc += "{";
            aGoFunc += "inState.m_Player.animations.stop();"; //  Stand still
            aGoFunc += "inState.m_Player.frame = 4;";
            aGoFunc += "return false;";
            aGoFunc += "}";

            return this.createBasicFunction(aMembers, aGoFunc);
        };
    }

    initBlockBugJump() {
        /** Jump @see index.html toolbox */
        Blockly.Blocks['bug_jump'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("Jump")
                    .appendField(new Blockly.FieldTextInput("1"), "cycle")
                    .appendField("cycle(s)");
                this.setInputsInline(true);
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setColour(0);
                this.setTooltip('');
                this.setHelpUrl('http://www.example.com/');
            }
        };

        Blockly.JavaScript['bug_jump'] = (inBlock) => {
            const aTextCycle = inBlock.getFieldValue('cycle');

            const aMembers = ["m_Count = " + aTextCycle];

            // Allow the player to jump if they are touching the ground.
            let aGoFunc = "";

            aGoFunc += "if( 0 < this.m_Count )";
            aGoFunc += "{";
            aGoFunc += "inState.m_Player.body.velocity.y = -350;";
            aGoFunc += "this.m_Count--;";
            aGoFunc += "return true;";
            aGoFunc += "}";
            aGoFunc += "else";
            aGoFunc += "{";
            aGoFunc += "inState.m_Player.animations.stop();"; //  Stand still
            aGoFunc += "inState.m_Player.frame = 4;";
            aGoFunc += "return false;";
            aGoFunc += "}";

            return this.createBasicFunction(aMembers, aGoFunc);
        };
    }

    initBlockBugWait() {
        /** Wait @see index.html toolbox */
        Blockly.Blocks['bug_wait'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("Wait")
                    .appendField(new Blockly.FieldTextInput("1"), "cycle")
                    .appendField("cycle(s)");
                this.setInputsInline(true);
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setColour(0);
                this.setTooltip('');
                this.setHelpUrl('http://www.example.com/');
            }
        };

        Blockly.JavaScript['bug_wait'] = (inBlock) => {
            const aTextCycle = inBlock.getFieldValue('cycle');

            const aMembers = ["m_Count = " + aTextCycle];

            // Allow the player to jump if they are touching the ground.
            let aGoFunc = "";

            aGoFunc += "if( 0 < this.m_Count )";
            aGoFunc += "{";
            aGoFunc += "inState.m_Player.animations.stop();"; //  Stand still
            aGoFunc += "inState.m_Player.frame = 4;";
            aGoFunc += "this.m_Count--;";
            aGoFunc += "return true;";
            aGoFunc += "}";
            aGoFunc += "else";
            aGoFunc += "{";
            aGoFunc += "return false;";
            aGoFunc += "}";

            return this.createBasicFunction(aMembers, aGoFunc);
        };
    }

    initBlockControlsLoop() {
        /** Move Loop @see index.html toolbox */
        Blockly.Blocks['bug_controls_loop'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("Repeat")
                    .appendField(new Blockly.FieldTextInput("2"), "count")
                    .appendField("times.");
                this.appendStatementInput("innerCode");
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setColour(135);
                this.setTooltip('');
                this.setHelpUrl('http://www.example.com/');
            }
        };

        Blockly.JavaScript['bug_controls_loop'] = function (inBlock) {
            var aTextCount = inBlock.getFieldValue('count');
            var aStatementsName = Blockly.JavaScript.statementToCode(inBlock, 'innerCode');

            var aCode = 'for( var i=0; i < ' + aTextCount + '; i++ ) {' + aStatementsName + '}';
            aCode += getEndBlockCode();
            return aCode;
        };
    }

    initBlockInfiniteLoop() {
        /** Infinite loop @see index.html toolbox */
        Blockly.Blocks['bug_infinite_loop'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("Infinite loop")
                this.appendStatementInput("innerCode");
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setColour(135);
                this.setTooltip('');
                this.setHelpUrl('http://www.example.com/');
            }
        };

        Blockly.JavaScript['bug_infinite_loop'] = (inBlock) => {
            const aStatementsName = Blockly.JavaScript.statementToCode(inBlock, 'innerCode');

            let aCode = 'while( true ) {' + aStatementsName + '}';
            aCode += this.getEndBlockCode();
            return aCode;
        };
    }

    initBlockLoadImage() {
        /** Load image
         *    Phase equivalent example :
         *        this.game.load.image( 'sky', 'assets/sky.png' );
         */
        Blockly.Blocks['bug_loadimage'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("Id")
                    .appendField(new Blockly.FieldTextInput("default"), "ID");
                this.appendDummyInput()
                    .appendField("Path")
                    .appendField(new Blockly.FieldTextInput("asset/default.png"), "PATH");
                this.setInputsInline(true);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(20);
                this.setTooltip('');
                this.setHelpUrl('http://www.example.com/');
            }
        };

        Blockly.JavaScript['bug_loadimage'] = (inBlock) => {
            const aTextId = inBlock.getFieldValue('ID');
            const aTextPath = inBlock.getFieldValue('PATH');

            const aMembers = ["m_Image = null"];

            // Allow the player to jump if they are touching the ground.
            let aGoFunc = "";

            aGoFunc += "this.m_Image = inState.game.load.image( '" + aTextId + "', '" + aTextPath + "' );";
            aGoFunc += "return false;";

            return this.createBasicFunction(aMembers, aGoFunc);
        };
    }

    initBlockBugAddSprite() {

        /** Add sprite :
         *    Phase equivalent example :
         *        this.game.add.sprite( 0, 0, 'sky' );
         */
        Blockly.Blocks['bug_addsprite'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("x")
                    .appendField(new Blockly.FieldTextInput("0"), "X");
                this.appendDummyInput()
                    .appendField("y")
                    .appendField(new Blockly.FieldTextInput("0"), "Y");
                this.appendDummyInput()
                    .appendField("Image id")
                    .appendField(new Blockly.FieldTextInput("default"), "ID");
                this.setInputsInline(true);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(230);
                this.setTooltip('');
                this.setHelpUrl('http://www.example.com/');
            }
        };

        Blockly.JavaScript['bug_addsprite'] = (inBlock) => {
            const aTextx = inBlock.getFieldValue('X');
            const aTexty = inBlock.getFieldValue('Y');
            const aTextId = inBlock.getFieldValue('ID');

            const aMembers = ["m_Sprite = null"];

            // Allow the player to jump if they are touching the ground.
            let aGoFunc = "";

            aGoFunc += "this.m_Sprite = inState.game.add.sprite( " + aTextx + ", " + aTexty + ", '" + aTextId + "' );";
            aGoFunc += "return false;";

            return this.createBasicFunction(aMembers, aGoFunc);
        };
    }

    initBlockMoveToBlue() {
        /** Move to blue @see index.html toolbox */
        Blockly.Blocks['bug_move_to_blue'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("Move to blue pipe");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(230);
                this.setTooltip('');
                this.setHelpUrl('http://www.example.com/');
            }
        };

        Blockly.JavaScript['bug_move_to_blue'] = (inBlock) => {
            return this.gotoColor("m_BluePos", "m_BlueOverLap");
        };
    }

    initBlockMoveToGreen() {
        /** Move to green @see index.html toolbox */
        Blockly.Blocks['bug_move_to_green'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("Move to green pipe");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(230);
                this.setTooltip('');
                this.setHelpUrl('http://www.example.com/');
            }
        };

        Blockly.JavaScript['bug_move_to_green'] = (inBlock) => {
            return this.gotoColor("m_GreenPos", "m_GreenOverLap");
        };
    }

    initBlockMoveToRed() {
        /** Move to red @see index.html toolbox */
        Blockly.Blocks['bug_move_to_red'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("Move to red pipe");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(230);
                this.setTooltip('');
                this.setHelpUrl('http://www.example.com/');
            }
        };

        Blockly.JavaScript['bug_move_to_red'] = (inBlock) => {
            return this.gotoColor("m_RedPos", "m_RedOverLap");
        };
    }

    initBlockIfColorName() {
        /** If the glass marble is COLORNAME */
        Blockly.Blocks['bug_if_glassmarble_is_colorname'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("If the glass marble is")
                    .appendField(new Blockly.FieldDropdown([["blue", "blue"], ["green", "green"], ["red", "red"]]), "colorname")
                    .appendField(".");
                this.appendStatementInput("innerCode");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(230);
                this.setTooltip('');
                this.setHelpUrl('http://www.example.com/');
            }
        };

        Blockly.JavaScript['bug_if_glassmarble_is_colorname'] = (inBlock) => {
            const aDropdownColorName = inBlock.getFieldValue('colorname');

            let aColorVarName = '';

            if (aDropdownColorName == "red") {
                aColorVarName = 'm_RedOverLap';
            }

            if (aDropdownColorName == "blue") {
                aColorVarName = 'm_BlueOverLap';
            }

            if (aDropdownColorName == "green") {
                aColorVarName = 'm_GreenOverLap';
            }

            const aStrCondition = 'eval( "ms_Phaser.getCurrentStage().' + aColorVarName + '" )';
            //var aStrCondition = 'eval( "glassmarbles2.'+ aColorVarName + '" )' ;

            //alert( eval( aStrCondition ) );

            const aStatementsName = Blockly.JavaScript.statementToCode(inBlock, 'innerCode');

            let aCode = 'if( ' + aStrCondition + ' ) {' + aStatementsName + '}';
            aCode += this.getEndBlockCode();
            return aCode;
        };
    }
}

export default BlockInstructions;