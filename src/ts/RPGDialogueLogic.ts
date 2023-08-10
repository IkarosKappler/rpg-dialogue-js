/**
 * @author  Ikaros Kappler
 * @date    2023-07-25
 * @version 1.0.0
 */

import axios from "axios";
import { IAnswer, IDialogueConfig, IDialogueGraph, IDialogueListener, IDialogueNodeType, IMiniQuestionaire } from "./interfaces";

export class RPGDialogueLogic<T extends IDialogueNodeType> {
  name: string;
  structure: IDialogueConfig<T>;
  private currentQuestionaireName: string | undefined;
  private currentQuestionaire: IMiniQuestionaire | undefined;
  private listeners: Array<IDialogueListener<T>>;

  constructor(dialogueStruct: IDialogueConfig<T>, validateStructure: boolean) {
    // this.name = "RPGDialogue";
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

  loadCurrentQuestionaire(
    setQuestionText: (questionText: string, npcName: string | undefined) => void,
    addOptionNode: (answerText: string, index: number) => void
  ): boolean {
    if (this.currentQuestionaire) {
      const npcName = this.getCurrentNpcName();
      setQuestionText(this.currentQuestionaire.q, npcName);
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
      throw "Cannot initialize RPGDialogueLogic: structure does not have an 'intro' entry";
    }
  }

  /**
   * Check if the current dialogue is still valid or reached its end.
   */
  private validate() {
    // ...
  }

  private getHTMLElement(nodeId: string | HTMLElement): HTMLElement {
    return typeof nodeId === "string" ? document.getElementById(nodeId) : nodeId;
  }

  /**
   * This is a convenient function for quickly integrating the dialogue logic into
   * an existing HTML document with prepared two <div> elements for displaying
   * the question and possible answers.
   *
   * @param {string|HTMLElement} questionNodeId - The output container (or ID) for questions.
   * @param {string|HTMLElement} optionsNodeId - The output container (or ID) for answer options.
   * @param {string} alternateStartNodeName - If you don't want to start at 'intro' specify your start node name here.
   * @returns
   */
  beginConversation(
    questionNodeId: string | HTMLElement,
    optionsNodeId: string | HTMLElement,
    alternateStartNodeName?: string
  ): void {
    const questionNode: HTMLElement = this.getHTMLElement(questionNodeId);
    const optionsNode: HTMLElement = this.getHTMLElement(optionsNodeId);

    /**
     * Set the text in the question node.
     * @param {*} questionText
     */
    const setQuestionText = (questionText: string, npcName: string | undefined) => {
      if (npcName) {
        questionNode.innerHTML = `<span class="rpg-npcname">${npcName}:</span> ${questionText}`;
      } else {
        questionNode.innerHTML = questionText;
      }
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
    var addOptionNode = (answerText: string, optionIndex: number) => {
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
    var sendAnswer = (index: number) => {
      _self.sendAnswer(index);
      if (_self.isEndReached()) {
        setQuestionText("---END OF CONVERSATION---", undefined);
        clearOptionsNode();
      }
      clearOptionsNode();
      _self.loadCurrentQuestionaire(setQuestionText, addOptionNode);
    };

    // Initialize the first question.
    _self.resetToBeginning(alternateStartNodeName);
    _self.loadCurrentQuestionaire(setQuestionText, addOptionNode);
    _self.fireStateChange(this.currentQuestionaireName, null, -1);
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
