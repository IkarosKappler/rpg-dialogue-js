/**
 * A renderer for the graph editor.
 *
 * @require PlotBoilerplate
 *
 * @author   Ikaros Kappler
 * @date     2023-07-28
 * @version  1.0.0
 **/
import { PlotBoilerplate, XYDimension } from "plotboilerplate";
import { IDialogueConfig, IMiniQuestionaireWithPosition } from "./interfaces";
export declare class EditorRenderer {
    pb: PlotBoilerplate;
    boxSize: XYDimension;
    constructor(pb: PlotBoilerplate, boxSize: XYDimension);
    renderBoxes(dialogConfig: IDialogueConfig<IMiniQuestionaireWithPosition>): void;
    renderConnections(dialogConfig: IDialogueConfig<IMiniQuestionaireWithPosition>): void;
}
