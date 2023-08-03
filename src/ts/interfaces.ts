/**
 * @author  Ikaros Kappler
 * @date    2023-07-25
 * @version 1.0.0
 */

import { XYCoords } from "plotboilerplate";

/**
 * Identifiyer for any type of question + answers in a named set.
 */
export type TDialogueIdentifyer = string;

/**
 * An answer: consists of the answer string itself and the identifyer of the next mini questionaire.
 */
export interface IAnswer {
  a: string;
  next: string;
}

/**
 * A mini questionaire consists of a question.
 */
export interface IMiniQuestionaire {
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

/**
 * A general-use dialog config containing the graph.
 */
export interface IDialogueConfig<T extends IDialogueNodeType> {
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
