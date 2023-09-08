/**
 * A dialogue sequence will use multiple dialogues (RPGDialogueLogic) and
 * put them together to a 'scene experience' with multiple NPCs.
 *
 * E.g.: first talk to NPC A and when that is done talking to NPC B is
 * available.
 */
var RPGDialogueSequence = /** @class */ (function () {
    /**
     * Create a sequence from a set of dialgues, each mapped to an NPC name.
     * @param {Record<string, RPGDialogueLogic<T>>} dialogues
     */
    function RPGDialogueSequence(dialogues) {
        // NOOP
        this.dialogues = dialogues;
        this.rules = [];
        var keys = Object.keys(this.dialogues);
        for (var i in keys) {
            var npcName = keys[i];
            var dlg = this.dialogues[npcName];
            dlg.addDialogueChangeListener(this.handleDialogueStateChanged(npcName));
        }
    }
    RPGDialogueSequence.prototype.handleDialogueStateChanged = function (npcName) {
        var _this = this;
        return function (_dialogueConfig, nextNodeName, oldNodeName, selectedOptionIndex) {
            // Try to locate matching callback.
            var matchingRule = _this.findRule(npcName, nextNodeName);
            console.log("matchingRule found?", matchingRule !== null);
            if (matchingRule) {
                matchingRule.callback();
            }
        };
    };
    RPGDialogueSequence.prototype.findRule = function (npcName, nodeName) {
        for (var i in this.rules) {
            var rule = this.rules[i];
            if (rule.npcName === npcName && rule.nodeName === nodeName) {
                return rule;
            }
        }
        return null;
    };
    /**
     * Add a rule for node changes to this sequence. Use nodeName=null for end-of-conversation.
     * The passed callback will be triggered if any of the passed dialogues
     * enters a state that matches the given rule.
     *
     * @param npcName
     * @param nodeName
     * @param callback
     */
    RPGDialogueSequence.prototype.addRule = function (npcName, nodeName, callback) {
        this.rules.push({ npcName: npcName, nodeName: nodeName, callback: callback });
    };
    RPGDialogueSequence.prototype.beginConversation = function (dialogueRenderer, npcName, alternateStartNodeName) {
        var dialogue = this.dialogues[npcName];
        dialogue.beginConversation(dialogueRenderer, alternateStartNodeName);
    };
    return RPGDialogueSequence;
}());
export { RPGDialogueSequence };
//# sourceMappingURL=RPGDialogueSequence.js.map