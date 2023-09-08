import { IDialogueRenderer } from "./interfaces";
export declare class DefaultDialogueRenderer implements IDialogueRenderer {
    private questionNode;
    private optionsNode;
    endOfConversationText: string;
    /**
     * Creates a new default dialogue renderer for quickly integrating the dialogue logic into
     * an existing HTML document with prepared two <div> elements for displaying
     * the question and possible answers.
     *
     * @param {string|HTMLElement} questionNodeId - The output container (or ID) for questions.
     * @param {string|HTMLElement} optionsNodeId - The output container (or ID) for answer options.
     * @constructor
     */
    constructor(questionNodeId: string | HTMLElement, optionsNodeId: string | HTMLElement);
    private getHTMLElement;
    /**
     * Indicate that the current conversation has ended.
     * @returns
     */
    renderConversationTerminated(): void;
    /**
     * Set the text in the question node.
     * @param {string} questionText - The question text to use.
     * @param {string|null} npcName - The NPC name to use; if no name was defined this is `null`.
     */
    setQuestionText(questionText: string, npcName: string | null | undefined): void;
    /**
     * Clear the options node. Just for upper level use here.
     */
    clearAllOptions(): void;
    /**
     * Add a new option node with the given answer text and option index. Use
     * the option index to send the answer.
     *
     * @param {number} answerText - The answer text option.
     * @param {number} optionIndex - The answer option index in the dialogue structure.
     * @param {function} onOptionSelected - A callback you must trigger when the option is clicked.
     */
    addAnswerOption(answerText: string, optionIndex: number, onOptionSelected: () => void): void;
}
