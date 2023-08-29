/**
 * @author  Ikaros Kappler
 * @date    2023-07-25
 * @version 1.0.0
 */

import axios from "axios";
import {
  IAnswer,
  IDialogueConfig,
  IDialogueListener,
  IDialogueNodeType,
  IDialogueRenderer,
  IMiniQuestionaire
} from "./interfaces";

export class RPGDialogueLogic<T extends IDialogueNodeType> {
  name: string;
  structure: IDialogueConfig<T>;
  private currentQuestionaireName: string | undefined;
  private currentQuestionaire: IMiniQuestionaire | undefined;
  private listeners: Array<IDialogueListener<T>>;

  constructor(dialogueStruct: IDialogueConfig<T>, validateStructure: boolean) {
    this.structure = dialogueStruct;
    this.listeners = [];

    this.resetToBeginning();
    if (validateStructure) {
      this.validate();
    }
  }

  addDialogueChangeListener(listener: IDialogueListener<T>) {
    for (var i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i] === listener) {
        return false;
      }
    }
    this.listeners.push(listener);
    return true;
  }

  removeDialogueChangeListener(listener: IDialogueListener<T>) {
    for (var i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i] === listener) {
        this.listeners.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  private fireStateChange(nextNodeName: string, oldNodeName: string, selectedOptionIndex: number) {
    for (var i = 0; i < this.listeners.length; i++) {
      this.listeners[i](this.structure, nextNodeName, oldNodeName, selectedOptionIndex);
    }
  }

  private getCurrentNpcName(): string {
    const npcIndex = this.currentQuestionaire.npcIndex ?? 0;
    const npcName = this.structure.meta?.npcs?.length > 0 ? this.structure.meta.npcs[npcIndex].name : null;
    return npcName;
  }

  private createSendAnswerCallback = (dialogueRenderer: IDialogueRenderer, optionIndex: number) => {
    const _self = this;
    var sendAnswer = () => {
      // optionIndex: number) => {
      _self.sendAnswer(optionIndex);
      if (_self.isEndReached()) {
        dialogueRenderer.renderConversationTerminated();
        // setQuestionText("---END OF CONVERSATION---", undefined);
        // dialogueRenderer.clearAllOptions();
      }
      dialogueRenderer.clearAllOptions();
      _self.loadCurrentQuestionaire(dialogueRenderer); //setQuestionText, addOptionNode);
    };
    return sendAnswer;
  };

  loadCurrentQuestionaire(
    // setQuestionText: (questionText: string, npcName: string | undefined) => void,
    // addOptionNode: (answerText: string, index: number) => void
    dialogueRenderer: IDialogueRenderer
  ): boolean {
    if (this.currentQuestionaire) {
      const npcName = this.getCurrentNpcName();
      dialogueRenderer.setQuestionText(this.currentQuestionaire.q, npcName);
      for (var i = 0; i < this.currentQuestionaire.o.length; i++) {
        const answerCallback = this.createSendAnswerCallback(dialogueRenderer, i);
        dialogueRenderer.addAnswerOption(this.currentQuestionaire.o[i].a, i, answerCallback);
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
    const oldQuestionaireName = this.currentQuestionaireName;
    const selectedAnswer: IAnswer = this.currentQuestionaire.o[index];
    if (!selectedAnswer) {
      return false;
    }
    if (!selectedAnswer.next) {
      this.currentQuestionaireName = null;
      this.currentQuestionaire = null;
    } else {
      this.currentQuestionaireName = selectedAnswer.next;
      const nextQuestionaire: T = this.structure.graph[this.currentQuestionaireName];
      // Can be the final one!
      if (!nextQuestionaire.o || nextQuestionaire.o.length === 0) {
        this.currentQuestionaireName = null;
        this.currentQuestionaire = null;
      } else {
        this.currentQuestionaire = nextQuestionaire;
      }
    }
    this.fireStateChange(this.currentQuestionaireName, oldQuestionaireName, index);
    console.log("Next questionaire", this.currentQuestionaire);
    return true;
  }

  /**
   * Find the initial mini questionaire.
   */
  resetToBeginning(alternateStartNodeName?: string) {
    this.currentQuestionaireName = alternateStartNodeName ?? "intro";
    this.currentQuestionaire = this.structure.graph[this.currentQuestionaireName];
    if (!this.currentQuestionaire) {
      throw "Cannot initialize RPGDialogueLogic: structure does not have an initial ('intro') entry";
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
   * @param {IDialogueRenderer} dialogueRenderer - The dialogue renderer to use.
   * @param {string?} alternateStartNodeName - If you don't want to start at 'intro' specify your start node name here.
   * @returns
   */
  beginConversation(dialogueRenderer: IDialogueRenderer, alternateStartNodeName?: string): void {
    const _self = this;
    // Initialize the first question.
    this.resetToBeginning(alternateStartNodeName);
    this.loadCurrentQuestionaire(dialogueRenderer);
    this.fireStateChange(this.currentQuestionaireName, null, -1);
  }

  /**
   * Load the dialogue structure from the JSON document at the given path.
   *
   * @param {string} path
   * @returns {Promise<RPGDialogueLogic>}
   */
  static loadConfigFromJSON<T extends IDialogueNodeType>(path: string): Promise<IDialogueConfig<T>> {
    console.log("axios", axios);
    return new Promise<IDialogueConfig<T>>((accept: (dialogueStruct: IDialogueConfig<T>) => void, reject: () => void) => {
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
  static loadFromJSON<T extends IDialogueNodeType>(path: string): Promise<RPGDialogueLogic<T>> {
    return new Promise<RPGDialogueLogic<T>>((accept: (dialogueStruct: RPGDialogueLogic<T>) => void, reject: () => void) => {
      RPGDialogueLogic.loadConfigFromJSON(path).then((struct: IDialogueConfig<T>) => {
        accept(new RPGDialogueLogic(struct, true));
      });
    });
  }
}
