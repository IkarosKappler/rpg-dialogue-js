import { IDialogueRenderer } from "./interfaces";

export class DefaultDialogueRenderer implements IDialogueRenderer {
  private questionNode: HTMLElement;
  private optionsNode: HTMLElement;
  // onConversationTerminated: (() => void) | null = null;

  endOfConversationText: string = "---END OF CONVERSATION---";

  /**
   * Creates a new default dialogue renderer for quickly integrating the dialogue logic into
   * an existing HTML document with prepared two <div> elements for displaying
   * the question and possible answers.
   *
   * @param {string|HTMLElement} questionNodeId - The output container (or ID) for questions.
   * @param {string|HTMLElement} optionsNodeId - The output container (or ID) for answer options.
   * @constructor
   */
  constructor(questionNodeId: string | HTMLElement, optionsNodeId: string | HTMLElement) {
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

  private getHTMLElement(nodeId: string | HTMLElement): HTMLElement {
    return typeof nodeId === "string" ? document.getElementById(nodeId) : nodeId;
  }

  //---BEGIN---IDialogueRenderer------------------------------
  /**
   * Indicate that the current conversation has ended.
   * @returns
   */
  renderConversationTerminated(): void {
    this.setQuestionText(this.endOfConversationText, undefined);
    // if (this.onConversationTerminated) {
    //   this.onConversationTerminated();
    // }
  }

  /**
   * Set the text in the question node.
   * @param {string} questionText - The question text to use.
   * @param {string|null} npcName - The NPC name to use; if no name was defined this is `null`.
   */
  setQuestionText(questionText: string, npcName: string | undefined): void {
    if (npcName) {
      this.questionNode.innerHTML = `<span class="rpg-npcname">${npcName}:</span> ${questionText}`;
    } else {
      this.questionNode.innerHTML = questionText;
    }
  }

  /**
   * Clear the options node. Just for upper level use here.
   */
  clearAllOptions(): void {
    this.optionsNode.innerHTML = "";
  }

  /**
   * Add a new option node with the given answer text and option index. Use
   * the option index to send the answer.
   *
   * @param {number} answerText - The answer text option.
   * @param {number} optionIndex - The answer option index in the dialogue structure.
   * @param {function} onOptionSelected - A callback you must trigger when the option is clicked.
   */
  addAnswerOption(answerText: string, optionIndex: number, onOptionSelected: () => void): void {
    var answerNode = document.createElement("li");
    var answerLinkNode = document.createElement("a");
    answerLinkNode.innerHTML = answerText;
    answerLinkNode.setAttribute("href", "#");
    answerLinkNode.addEventListener("click", onOptionSelected);
    answerNode.appendChild(answerLinkNode);
    this.optionsNode.appendChild(answerNode);
  }
  //---END---IDialogueRenderer------------------------------
}
