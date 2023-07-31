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
