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
    setQuestionText: (questionText: string) => HTMLElement,
    addOptionNode: (answerText: string, index: number) => HTMLElement
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
   * Load the dialogue structure from the JSON document at the given path.
   *
   * @param {string} path
   * @returns {Promise<RPGDialogueLogic>}
   */
  static loadFromJSON(path: string): Promise<RPGDialogueLogic> {
    console.log("axios", axios);
    return new Promise<RPGDialogueLogic>((accept: (dialogueStruct: RPGDialogueLogic) => void, reject: () => void) => {
      axios
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
  }
}
