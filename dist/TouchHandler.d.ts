/**
 * A wrapper class for AlloyFinger.
 *
 * @author  Ikaros Kappler
 * @date    2023-07-31
 * @version 1.0.0
 */
import { PlotBoilerplate } from "plotboilerplate";
import { EditorHelper } from "./editorHelpers";
import { IDialogueConfig, IMiniQuestionaireWithPosition } from "./interfaces";
export declare class TouchHandler {
    private alloyFinger;
    constructor(pb: PlotBoilerplate, dialogConfigWithPositions: IDialogueConfig<IMiniQuestionaireWithPosition>, editorHelper: EditorHelper);
    destroy(): void;
}
/**
 * A class simulating non existing touchenter and touchleave events.
 * Inspired by
 *    https://stackoverflow.com/questions/23111671/touchenter-and-touchleave-events-support
 */
export declare class TouchEnterLeaveHandler {
    private onTouchLeaveEvents;
    private onTouchEnterEvents;
    constructor();
    onTouchEnter(selector: any, fn: any): () => void;
    onTouchLeave: (selector: any, fn: any) => () => void;
    private _init;
}
