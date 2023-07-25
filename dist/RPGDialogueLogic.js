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
        this.name = "RPGDialogue";
        this.structure = dialogueStruct;
        this.resetToBeginning();
        if (validateStructure) {
            this.validate();
        }
    }
    RPGDialogueLogic.prototype.loadCurrentQuestionaire = function (setQuestionText, addOptionNode) {
        if (this.currentQuestionaire) {
            setQuestionText(this.currentQuestionaire.q);
            for (var i = 0; i < this.currentQuestionaire.o.length; i++) {
                addOptionNode(this.currentQuestionaire.o[i].a, i);
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
        var selectedAnswer = this.currentQuestionaire.o[index];
        if (!selectedAnswer) {
            return false;
        }
        if (!selectedAnswer.next) {
            this.currentQuestionaire = null;
        }
        else {
            var nextQuestionaire = this.structure[selectedAnswer.next];
            // Can be null
            this.currentQuestionaire = nextQuestionaire;
        }
        console.log("Next questionaire", this.currentQuestionaire);
        return true;
    };
    /**
     * Find the initial mini questionaire.
     */
    RPGDialogueLogic.prototype.resetToBeginning = function () {
        this.currentQuestionaire = this.structure["intro"];
        if (!this.currentQuestionaire) {
            throw "Cannot initialize RPGDialogueLogic: structure does not have an 'intro' entry";
        }
    };
    /**
     * Check if the current dialogue is still valid or reached its end.
     */
    RPGDialogueLogic.prototype.validate = function () {
        // ...
    };
    /**
     * Load the dialogue structure from the JSON document at the given path.
     *
     * @param {string} path
     * @returns {Promise<RPGDialogueLogic>}
     */
    RPGDialogueLogic.loadFromJSON = function (path) {
        console.log("axios", axios_1.default);
        return new Promise(function (accept, reject) {
            axios_1.default
                .get(path)
                .then(function (response) {
                // handle success
                console.log(response);
                // Validate response data?
                accept(new RPGDialogueLogic(response.data, true));
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
    return RPGDialogueLogic;
}());
exports.RPGDialogueLogic = RPGDialogueLogic;
//# sourceMappingURL=RPGDialogueLogic.js.map