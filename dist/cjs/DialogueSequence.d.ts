/**
 * A dialogue sequence will use multiple dialogues (RPGDialogueLogic) and
 * put them together to a 'scene experience' with multiple NPCs.
 *
 * E.g.: first talk to NPC A and when that is done talking to NPC B is
 * available.
 */
import { IDialogueNodeType } from "./interfaces";
export declare class DialogueSequence<T extends IDialogueNodeType> {
    private dialogues;
    constructor();
    loadDialogues(sources: Array<{
        npcName: string;
        filePath: string;
    }>): Promise;
}
