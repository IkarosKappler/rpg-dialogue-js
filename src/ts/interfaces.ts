/**
 * @author  Ikaros Kappler
 * @date    2023-07-25
 * @version 1.0.0
 */

import { XYCoords } from "plotboilerplate";
import { RPGDialogueLogic } from "./RPGDialogueLogic";
import type axios from "axios";

/**
 * Identifiyer for any type of question + answers in a named set.
 */
export type TDialogueIdentifyer = string;

/**
 * An answer: consists of the answer string itself and the identifyer of the next mini questionaire.
 */
export interface IAnswer {
  a: string;
  next: string | null;
}

/**
 * A mini questionaire consists of a question.
 */
export interface IMiniQuestionaire {
  npcIndex?: number;
  q: string;
  o: IAnswer[];
}

/**
 * A mini questionaire consists of a question.
 */
export interface IMiniQuestionaireWithPosition extends IMiniQuestionaire {
  editor?: {
    position?: XYCoords;
  };
}

export type IDialogueNodeType = IMiniQuestionaire | IMiniQuestionaireWithPosition;

/**
 * A whole dialogue is a set of named questionaires.
 */
export interface IDialogueGraph<T extends IDialogueNodeType> extends Record<TDialogueIdentifyer, T> {}

export interface IDialogueNPC {
  name: string;
}

export interface IDialogueMeta {
  name: string;
  npcs: Array<IDialogueNPC>;
}

/**
 * A general-use dialog config containing the graph.
 */
export interface IDialogueConfig<T extends IDialogueNodeType> {
  meta: IDialogueMeta;
  graph: IDialogueGraph<T>;
}

/**
 * Used to identify options.
 */
export interface IOptionIdentifyer {
  nodeName: string;
  node: IMiniQuestionaireWithPosition;
  optionIndex: number;
}

/**
 * A simple callback function type for receiving state changes is the dialogue logic.
 */
export type IDialogueListener<T extends IDialogueNodeType> = (
  dialogueConfig: IDialogueConfig<T>,
  nextNodeName: string | null,
  oldNodeName: string | null,
  selectedOptionIndex: number
) => void;

/**
 * A simple interface to pass custom HTML renderers to the dialigue logic.
 */
export interface IDialogueRenderer {
  /**
   * Indicate that the current conversation has ended.
   * @returns
   */
  renderConversationTerminated: () => void;

  /**
   * Set the text in the question node.
   * @param {string} questionText - The question text to use.
   * @param {string|null} npcName - The NPC name to use; if no name was defined this is `null`.
   */
  setQuestionText: (questionText: string, npcName: string | null | undefined) => void;

  /**
   * Clear the options node. Just for upper level use here.
   */
  clearAllOptions: () => void;

  /**
   * Add a new option node with the given answer text and option index. Use
   * the option index to send the answer.
   *
   * @param {number} answerText - The answer text option.
   * @param {number} optionIndex - The answer option index in the dialogue structure.
   * @param {function} onOptionSelected - A callback you must trigger when the option is clicked.
   */
  addAnswerOption: (answerText: string, optionIndex: number, onOptionSelected: () => void) => void;
}

// export interface INpcDialoguePair <T extends IDialogueNodeType> {
//   npcName: string;
//   dialogue: T;
// }

export type NPCName = string;

export type INpcPathMapping = Record<NPCName, string>;

export type INpcDialogueMapping<T extends IDialogueNodeType> = Record<NPCName, RPGDialogueLogic<T>>;

export interface SequenceMatchingRule {
  npcName: string;
  nodeName: string;
  callback: Function;
}

export interface IGlobalLibs {
  axios: typeof axios;
}
