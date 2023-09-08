/**
 * A dialogue sequence will use multiple dialogues (RPGDialogueLogic) and
 * put them together to a 'scene experience' with multiple NPCs.
 *
 * E.g.: first talk to NPC A and when that is done talking to NPC B is
 * available.
 */
import { RPGDialogueLogic } from "./RPGDialogueLogic";
import { IDialogueNodeType, IDialogueRenderer } from "./interfaces";
export declare class RPGDialogueSequence<T extends IDialogueNodeType> {
    private dialogues;
    private rules;
    /**
     * Create a sequence from a set of dialgues, each mapped to an NPC name.
     * @param {Record<string, RPGDialogueLogic<T>>} dialogues
     */
    constructor(dialogues: Record<string, RPGDialogueLogic<T>>);
    private handleDialogueStateChanged;
    private findRule;
    /**
     * Add a rule for node changes to this sequence. Use nodeName=null for end-of-conversation.
     * The passed callback will be triggered if any of the passed dialogues
     * enters a state that matches the given rule.
     *
     * @param npcName
     * @param nodeName
     * @param callback
     */
    addRule(npcName: string, nodeName: string | null, callback: (npcName?: string, nodeName?: string) => void): void;
    beginConversation(dialogueRenderer: IDialogueRenderer, npcName: string, alternateStartNodeName?: string): void;
}
