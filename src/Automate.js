class Automate {
    constructor(inBlockInstructions, inBlocklyBoardId, inBlocklyToolBoxId, inBlocklyConsoleId, inStepButtonId) {
        this.m_blockInstructions = inBlockInstructions;
        this.m_BlocklyConsoleId = inBlocklyConsoleId;
        this.m_StepButtonId = inStepButtonId;

        this.m_WorkSpace = Blockly.inject(inBlocklyBoardId, {
            media: 'media/blockly/',
            toolbox: document.getElementById(inBlocklyToolBoxId)
        });

        this.m_Interpreter = null;

        /** For the state mod
         *    @todo Pierre : fix the step mod. It's continuous.
         */
        this.m_HighlightPause = false;
    }

    getAutomateInstance() {
        return eval(this.m_StrAutomateInstance); // TODO m_StrAutomateInstance is undefined ?
    }

    updateCode() {
        if (this.m_BlocklyConsoleId) {
            let aCode = Blockly.JavaScript.workspaceToCode(this.m_WorkSpace);
            document.getElementById(this.m_BlocklyConsoleId).value = aCode;
        }
    }

    highlightBlock(id) {
        this.m_WorkSpace.highlightBlock(id);
        this.m_HighlightPause = true;
    }

    /**
     @param {object} []inWorkspace] To avoid this bug :
     Context problem m_WorkSpace is not
     define.
     @link http://hugoware.net/blog/passing-context-with-javascript
     @link http://ejohn.org/apps/learn/#25
     */
    initApi(inWorkspace) {
        return (inInterpreter, inScope) => {
            // Add an API function for the eval() block.
            let aWrapper = (text) => {
                text = text ? text.toString() : '';
                return inInterpreter.createPrimitive(eval(text));
            };
            inInterpreter.setProperty(inScope, 'eval', inInterpreter.createNativeFunction(aWrapper));

            // Add an API function for the alert() block.
            aWrapper = (text) => {
                text = text ? text.toString() : '';
                return inInterpreter.createPrimitive(alert(text));
            };
            inInterpreter.setProperty(inScope, 'alert', inInterpreter.createNativeFunction(aWrapper));

            // Add an API function for the prompt() block.
            aWrapper = (text) => {
                text = text ? text.toString() : '';
                return inInterpreter.createPrimitive(prompt(text));
            };
            inInterpreter.setProperty(inScope, 'prompt', inInterpreter.createNativeFunction(aWrapper));

            // Add an API function for highlighting blocks.
            aWrapper = (id) => {
                id = id ? id.toString() : '';

                return inInterpreter.createPrimitive(inWorkspace.highlightBlock(id));
            };
            inInterpreter.setProperty(inScope, 'highlightBlock', inInterpreter.createNativeFunction(aWrapper));
        }
    }

    parseCode() {
        Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
        Blockly.JavaScript.addReservedWords('highlightBlock');

        this.m_blockInstructions.clear();

        let aCode = Blockly.JavaScript.workspaceToCode(this.m_WorkSpace);

        this.m_Interpreter = new Interpreter(aCode, this.initApi(this.m_WorkSpace));

        if (this.m_StepButtonId) {
            document.getElementById(this.m_StepButtonId).disabled = '';
        }

        this.m_HighlightPause = false;

        this.m_WorkSpace.traceOn(true);
        this.m_WorkSpace.highlightBlock(null);
    }

    nextStep() {
        //try
        {
            if (this.m_Interpreter) {
                while (!this.m_Interpreter.paused_ && this.m_Interpreter.step() && !this.m_blockInstructions.isEmpty()) {
                }
            }
        }
        //catch( aError )
        //{
        //	alert( aError );
        //}
    }

    stepClick() {
        if (this.m_Interpreter && !this.m_blockInstructions.isEmpty()) {
            //try
            //{
            this.nextStep();

            if (this.m_HighlightPause) {
                // A block has been highlighted.  Pause execution here.
                this.m_HighlightPause = false;
            }
            else {
                // Keep executing until a highlight statement is reached.
                this.stepClick();
            }
            //}
            //finally
            //{
            //	if( this.m_StepButtonId )
            //	{
            //		// Program complete, no more code to execute.
            //		document.getElementById( this.m_StepButtonId ).disabled = '';
            //	}
            //}
        }
    }
}

export default Automate;