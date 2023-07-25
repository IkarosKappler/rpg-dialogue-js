/**
 * @author  Ikaros Kappler
 * @date    2023-07-25
 * @version 1.0.0
 */

import axios from "axios";
import { IAnswer, IDialogueStructure, IMiniQuestionaire } from "./interfaces";

export class RPGDialogueLogic {
  name: string;
  structure: IDialogueStructure;
  private currentQuestionaire: IMiniQuestionaire | undefined;

  constructor(dialogueStruct: IDialogueStructure, validateStructure: boolean) {
    this.name = "RPGDialogue";
    this.structure = dialogueStruct;

    this.resetToBeginning();
    if (validateStructure) {
      this.validate();
    }
  }

  loadCurrentQuestionaire(
    setQuestionText: (questionText: string) => void,
    addOptionNode: (answerText: string, index: number) => void
  ): boolean {
    if (this.currentQuestionaire) {
      setQuestionText(this.currentQuestionaire.q);
      for (var i = 0; i < this.currentQuestionaire.o.length; i++) {
        addOptionNode(this.currentQuestionaire.o[i].a, i);
      }
      return true;
    }
    return false;
  }

  /**
   * Get the current mini questionaire or null if no current or next questionaire is available.
   * @returns
   */
  getCurrentQuestionaire(): IMiniQuestionaire | undefined {
    return this.currentQuestionaire;
  }

  /**
   * Check if the end was reached or if there are more questions available
   * @returns {boolean} false if there is a current question active.
   */
  isEndReached(): boolean {
    return this.currentQuestionaire === null || this.currentQuestionaire === undefined;
  }

  /**
   * Give an answer to the current questionaire. Only valid answer indices will be acceped.
   * @param {number} index
   * @returns {boolean} true if the the index is valid.
   */
  sendAnswer(index: number): boolean {
    if (index < 0 || index >= this.currentQuestionaire.o.length) {
      return false;
    }
    const selectedAnswer: IAnswer = this.currentQuestionaire.o[index];
    if (!selectedAnswer) {
      return false;
    }
    if (!selectedAnswer.next) {
      this.currentQuestionaire = null;
    } else {
      const nextQuestionaire = this.structure[selectedAnswer.next];
      // Can be null
      this.currentQuestionaire = nextQuestionaire;
    }
    console.log("Next questionaire", this.currentQuestionaire);
    return true;
  }

  /**
   * Find the initial mini questionaire.
   */
  resetToBeginning() {
    this.currentQuestionaire = this.structure["intro"];
    if (!this.currentQuestionaire) {
      throw "Cannot initialize RPGDialogueLogic: structure does not have an 'intro' entry";
    }
  }

  /**
   * Check if the current dialogue is still valid or reached its end.
   */
  private validate() {
    // ...
  }

  /**
   * This is a convenient function for quickly integrating the dialogue logic into
   * an existing HTML document with prepared two <div> elements for displaying
   * the question and possible answers.
   *
   * @param {string} questionNodeId
   * @param {string} optionsNodeId
   * @returns
   */
  beginConversation(questionNodeId: string, optionsNodeId: string): Promise<boolean> {
    return new Promise<boolean>((accept, reject) => {
      const questionNode = document.getElementById(questionNodeId);
      const optionsNode = document.getElementById(optionsNodeId);

      /**
       * Set the text in the question node.
       * @param {*} questionText
       */
      const setQuestionText = (questionText: string) => {
        questionNode.innerHTML = questionText;
      };

      /**
       * Clear the options node. Just for upper level use here.
       */
      var clearOptionsNode = function () {
        optionsNode.innerHTML = "";
      };

      /**
       * Add a new option node with the given answer text and option index. Use
       * the option index to send the answer.
       *
       * @param {*} answerText
       * @param {*} optionIndex
       */
      var addOptionNode = function (answerText, optionIndex) {
        var answerNode = document.createElement("li");
        var answerLinkNode = document.createElement("a");
        answerLinkNode.innerHTML = answerText;
        answerLinkNode.setAttribute("href", "#");
        answerLinkNode.addEventListener("click", function () {
          sendAnswer(optionIndex);
        });
        answerNode.appendChild(answerLinkNode);
        optionsNode.appendChild(answerNode);
      };

      const _self = this;

      /**
       * Send the selected answer (by index).
       * @param {number} index
       */
      var sendAnswer = function (index) {
        _self.sendAnswer(index);
        if (_self.isEndReached()) {
          setQuestionText("---END OF CONVERSATION---");
          clearOptionsNode();
        }
        clearOptionsNode();
        _self.loadCurrentQuestionaire(setQuestionText, addOptionNode);
      };

      // Initialize the first question.
      _self.loadCurrentQuestionaire(setQuestionText, addOptionNode);
    });
  }

  /**
   * Load the dialogue structure from the JSON document at the given path.
   *
   * @param {string} path
   * @returns {Promise<RPGDialogueLogic>}
   */
  static loadStructureFromJSON(path: string): Promise<IDialogueStructure> {
    console.log("axios", axios);
    return new Promise<IDialogueStructure>((accept: (dialogueStruct: IDialogueStructure) => void, reject: () => void) => {
      axios
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
  }

  /**
   * Load the dialogue structure from the JSON document at the given path.
   *
   * @param {string} path
   * @returns {Promise<RPGDialogueLogic>}
   */
  static loadFromJSON(path: string): Promise<RPGDialogueLogic> {
    return new Promise<RPGDialogueLogic>((accept: (dialogueStruct: RPGDialogueLogic) => void, reject: () => void) => {
      RPGDialogueLogic.loadStructureFromJSON(path).then((struct: IDialogueStructure) => {
        accept(new RPGDialogueLogic(struct, true));
      });
    });
  }
}
