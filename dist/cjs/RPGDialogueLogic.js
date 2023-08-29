"use strict";
/**
 * @author  Ikaros Kappler
 * @date    2023-07-25
 * @version 1.0.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPGDialogueLogic = void 0;
var axios_1 = __importDefault(require("axios"));
var RPGDialogueLogic = /** @class */ (function () {
    function RPGDialogueLogic(dialogueStruct, validateStructure) {
        var _this = this;
        this.createSendAnswerCallback = function (dialogueRenderer, optionIndex) {
            var _self = _this;
            var sendAnswerCallback = function () {
                // optionIndex: number) => {
                _self.sendAnswer(optionIndex);
                if (_self.isEndReached()) {
                    dialogueRenderer.renderConversationTerminated();
                }
                dialogueRenderer.clearAllOptions();
                if (!_self.isEndReached()) {
                    _self.loadCurrentQuestionaire(dialogueRenderer);
                }
            };
            return sendAnswerCallback;
        };
        this.structure = dialogueStruct;
        this.listeners = [];
        this.resetToBeginning();
        if (validateStructure) {
            this.validate();
        }
    }
    RPGDialogueLogic.prototype.addDialogueChangeListener = function (listener) {
        for (var i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i] === listener) {
                return false;
            }
        }
        this.listeners.push(listener);
        return true;
    };
    RPGDialogueLogic.prototype.removeDialogueChangeListener = function (listener) {
        for (var i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i] === listener) {
                this.listeners.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    RPGDialogueLogic.prototype.fireStateChange = function (nextNodeName, oldNodeName, selectedOptionIndex) {
        for (var i = 0; i < this.listeners.length; i++) {
            this.listeners[i](this.structure, nextNodeName, oldNodeName, selectedOptionIndex);
        }
    };
    RPGDialogueLogic.prototype.getCurrentNpcName = function () {
        var _a, _b, _c;
        var npcIndex = (_a = this.currentQuestionaire.npcIndex) !== null && _a !== void 0 ? _a : 0;
        var npcName = ((_c = (_b = this.structure.meta) === null || _b === void 0 ? void 0 : _b.npcs) === null || _c === void 0 ? void 0 : _c.length) > 0 ? this.structure.meta.npcs[npcIndex].name : null;
        return npcName;
    };
    RPGDialogueLogic.prototype.loadCurrentQuestionaire = function (dialogueRenderer) {
        if (this.currentQuestionaire) {
            var npcName = this.getCurrentNpcName();
            dialogueRenderer.setQuestionText(this.currentQuestionaire.q, npcName);
            for (var i = 0; i < this.currentQuestionaire.o.length; i++) {
                var answerCallback = this.createSendAnswerCallback(dialogueRenderer, i);
                dialogueRenderer.addAnswerOption(this.currentQuestionaire.o[i].a, i, answerCallback);
            }
            return true;
        }
        return false;
    };
    /**
     * Get the current mini questionaire or null if no current or next questionaire is available.
     * @returns
     */
    RPGDialogueLogic.prototype.getCurrentQuestionaire = function () {
        return this.currentQuestionaire;
    };
    /**
     * Check if the end was reached or if there are more questions available
     * @returns {boolean} false if there is a current question active.
     */
    RPGDialogueLogic.prototype.isEndReached = function () {
        return this.currentQuestionaire === null || this.currentQuestionaire === undefined;
    };
    /**
     * Give an answer to the current questionaire. Only valid answer indices will be acceped.
     * @param {number} index
     * @returns {boolean} true if the the index is valid.
     */
    RPGDialogueLogic.prototype.sendAnswer = function (index) {
        if (index < 0 || index >= this.currentQuestionaire.o.length) {
            return false;
        }
        var oldQuestionaireName = this.currentQuestionaireName;
        var selectedAnswer = this.currentQuestionaire.o[index];
        if (!selectedAnswer) {
            return false;
        }
        if (!selectedAnswer.next) {
            this.currentQuestionaireName = null;
            this.currentQuestionaire = null;
        }
        else {
            this.currentQuestionaireName = selectedAnswer.next;
            var nextQuestionaire = this.structure.graph[this.currentQuestionaireName];
            // Can be the final one!
            if (!nextQuestionaire.o || nextQuestionaire.o.length === 0) {
                this.currentQuestionaireName = null;
                this.currentQuestionaire = null;
            }
            else {
                this.currentQuestionaire = nextQuestionaire;
            }
        }
        this.fireStateChange(this.currentQuestionaireName, oldQuestionaireName, index);
        // console.log("Next questionaire", this.currentQuestionaire);
        return true;
    };
    /**
     * Find the initial mini questionaire.
     */
    RPGDialogueLogic.prototype.resetToBeginning = function (alternateStartNodeName) {
        this.currentQuestionaireName = alternateStartNodeName !== null && alternateStartNodeName !== void 0 ? alternateStartNodeName : "intro";
        this.currentQuestionaire = this.structure.graph[this.currentQuestionaireName];
        if (!this.currentQuestionaire) {
            throw "Cannot initialize RPGDialogueLogic: structure does not have an initial ('intro') entry";
        }
    };
    /**
     * Check if the current dialogue is still valid or reached its end.
     */
    RPGDialogueLogic.prototype.validate = function () {
        // ...
    };
    /**
     * This is a convenient function for quickly integrating the dialogue logic into
     * an existing HTML document with prepared two <div> elements for displaying
     * the question and possible answers.
     *
     * @param {IDialogueRenderer} dialogueRenderer - The dialogue renderer to use.
     * @param {string?} alternateStartNodeName - If you don't want to start at 'intro' specify your start node name here.
     * @returns
     */
    RPGDialogueLogic.prototype.beginConversation = function (dialogueRenderer, alternateStartNodeName) {
        var _self = this;
        // Initialize the first question.
        this.resetToBeginning(alternateStartNodeName);
        this.loadCurrentQuestionaire(dialogueRenderer);
        this.fireStateChange(this.currentQuestionaireName, null, -1);
    };
    /**
     * Load the dialogue structure from the JSON document at the given path.
     *
     * @param {string} path
     * @returns {Promise<RPGDialogueLogic>}
     */
    RPGDialogueLogic.loadConfigFromJSON = function (path) {
        console.log("axios", axios_1.default);
        return new Promise(function (accept, reject) {
            axios_1.default
                .get(path)
                .then(function (response) {
                // handle success
                console.log(response);
                // Validate response data?
                accept(response.data);
            })
                .catch(function (error) {
                // handle error
                console.log(error);
                reject();
            })
                .finally(function () {
                // always executed
            });
        });
    };
    /**
     * Load the dialogue structure from the JSON document at the given path.
     *
     * @param {string} path
     * @returns {Promise<RPGDialogueLogic>}
     */
    RPGDialogueLogic.loadFromJSON = function (path) {
        return new Promise(function (accept, reject) {
            RPGDialogueLogic.loadConfigFromJSON(path).then(function (struct) {
                accept(new RPGDialogueLogic(struct, true));
            });
        });
    };
    return RPGDialogueLogic;
}());
exports.RPGDialogueLogic = RPGDialogueLogic;
//# sourceMappingURL=RPGDialogueLogic.js.map