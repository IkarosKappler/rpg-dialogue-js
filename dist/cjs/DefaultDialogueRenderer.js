"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultDialogueRenderer = void 0;
var DefaultDialogueRenderer = /** @class */ (function () {
    /**
     * Creates a new default dialogue renderer for quickly integrating the dialogue logic into
     * an existing HTML document with prepared two <div> elements for displaying
     * the question and possible answers.
     *
     * @param {string|HTMLElement} questionNodeId - The output container (or ID) for questions.
     * @param {string|HTMLElement} optionsNodeId - The output container (or ID) for answer options.
     * @constructor
     */
    function DefaultDialogueRenderer(questionNodeId, optionsNodeId) {
        // onConversationTerminated: (() => void) | null = null;
        this.endOfConversationText = "---END OF CONVERSATION---";
        // }, onConversationTerminated?: () => void) {
        this.questionNode = this.getHTMLElement(questionNodeId);
        this.optionsNode = this.getHTMLElement(optionsNodeId);
        // this.onConversationTerminated = onConversationTerminated;
        if (!this.questionNode) {
            console.warn("[DefaultDialogueRenderer] Warning: the passed questionNode od element id does not exist.");
        }
        if (!this.optionsNode) {
            console.warn("[DefaultDialogueRenderer] Warning: the passed optionsNode od element id does not exist.");
        }
    }
    DefaultDialogueRenderer.prototype.getHTMLElement = function (nodeId) {
        return typeof nodeId === "string" ? document.getElementById(nodeId) : nodeId;
    };
    //---BEGIN---IDialogueRenderer------------------------------
    /**
     * Indicate that the current conversation has ended.
     * @returns
     */
    DefaultDialogueRenderer.prototype.renderConversationTerminated = function () {
        this.setQuestionText(this.endOfConversationText, undefined);
        // if (this.onConversationTerminated) {
        //   this.onConversationTerminated();
        // }
    };
    /**
     * Set the text in the question node.
     * @param {string} questionText - The question text to use.
     * @param {string|null} npcName - The NPC name to use; if no name was defined this is `null`.
     */
    DefaultDialogueRenderer.prototype.setQuestionText = function (questionText, npcName) {
        if (npcName) {
            this.questionNode.innerHTML = "<span class=\"rpg-npcname\">".concat(npcName, ":</span> ").concat(questionText);
        }
        else {
            this.questionNode.innerHTML = questionText;
        }
    };
    /**
     * Clear the options node. Just for upper level use here.
     */
    DefaultDialogueRenderer.prototype.clearAllOptions = function () {
        this.optionsNode.innerHTML = "";
    };
    /**
     * Add a new option node with the given answer text and option index. Use
     * the option index to send the answer.
     *
     * @param {number} answerText - The answer text option.
     * @param {number} optionIndex - The answer option index in the dialogue structure.
     * @param {function} onOptionSelected - A callback you must trigger when the option is clicked.
     */
    DefaultDialogueRenderer.prototype.addAnswerOption = function (answerText, optionIndex, onOptionSelected) {
        var answerNode = document.createElement("li");
        var answerLinkNode = document.createElement("a");
        answerLinkNode.innerHTML = answerText;
        answerLinkNode.setAttribute("href", "#");
        answerLinkNode.addEventListener("click", onOptionSelected);
        answerNode.appendChild(answerLinkNode);
        this.optionsNode.appendChild(answerNode);
    };
    return DefaultDialogueRenderer;
}());
exports.DefaultDialogueRenderer = DefaultDialogueRenderer;
//# sourceMappingURL=DefaultDialogueRenderer.js.map