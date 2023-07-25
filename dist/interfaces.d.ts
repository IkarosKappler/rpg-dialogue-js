/**
 * @author  Ikaros Kappler
 * @date    2023-07-25
 * @version 1.0.0
 */
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
    o: [IAnswer];
}
/**
 * A whole dialogue is a set of named questionaires.
 */
export interface IDialogueStructure extends Record<TDialogueIdentifyer, IMiniQuestionaire | null> {
}
