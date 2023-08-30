/**
 * A dialogue sequence will use multiple dialogues (RPGDialogueLogic) and
 * put them together to a 'scene experience' with multiple NPCs.
 *
 * E.g.: first talk to NPC A and when that is done talking to NPC B is
 * available.
 */

import { RPGDialogueLogic } from "./RPGDialogueLogic";
import { IDialogueConfig, IDialogueListener, IDialogueNodeType, IDialogueRenderer, SequenceMatchingRule } from "./interfaces";

export class RPGDialogueSequence<T extends IDialogueNodeType> {
  private dialogues: Record<string, RPGDialogueLogic<T>>;
  private rules: Array<SequenceMatchingRule>;

  /**
   * Create a sequence from a set of dialgues, each mapped to an NPC name.
   * @param {Record<string, RPGDialogueLogic<T>>} dialogues
   */
  constructor(dialogues: Record<string, RPGDialogueLogic<T>>) {
    // NOOP
    this.dialogues = dialogues;
    this.rules = [];
    const keys = Object.keys(this.dialogues);
    for (var i in keys) {
      const npcName = keys[i];
      const dlg = this.dialogues[npcName];
      dlg.addDialogueChangeListener(this.handleDialogueStateChanged(npcName));
    }
  }

  private handleDialogueStateChanged(npcName: string): IDialogueListener<T> {
    return (
      _dialogueConfig: IDialogueConfig<T>,
      nextNodeName: string | null,
      oldNodeName: string | null,
      selectedOptionIndex: number
    ) => {
      // Try to locate matching callback.
      const matchingRule = this.findRule(npcName, nextNodeName);
      console.log("matchingRule found?", matchingRule !== null);
      if (matchingRule) {
        matchingRule.callback();
      }
    };
  }

  private findRule(npcName: string, nodeName: string): SequenceMatchingRule | null {
    for (var i in this.rules) {
      const rule = this.rules[i];
      if (rule.npcName === npcName && rule.nodeName === nodeName) {
        return rule;
      }
    }
    return null;
  }

  /**
   * Add a rule for node changes to this sequence. Use nodeName=null for end-of-conversation.
   * The passed callback will be triggered if any of the passed dialogues
   * enters a state that matches the given rule.
   *
   * @param npcName
   * @param nodeName
   * @param callback
   */
  addRule(npcName: string, nodeName: string | null, callback: (npcName?: string, nodeName?: string) => void) {
    this.rules.push({ npcName, nodeName, callback });
  }

  beginConversation(dialogueRenderer: IDialogueRenderer, npcName: string, alternateStartNodeName?: string) {
    const dialogue = this.dialogues[npcName];
    dialogue.beginConversation(dialogueRenderer, alternateStartNodeName);
  }
}
