/**
 * A renderer for the graph editor.
 *
 * @require PlotBoilerplate
 *
 * @author   Ikaros Kappler
 * @date     2023-07-28
 * @version  1.0.0
 **/
import { FontOptions, PlotBoilerplate, XYDimension } from "plotboilerplate";
import { IDialogueConfig, IMiniQuestionaireWithPosition } from "./interfaces";
import { EditorHelper } from "./editorHelpers";
export declare class EditorRenderer {
    pb: PlotBoilerplate;
    boxSize: XYDimension;
    editorHelpers: EditorHelper;
    fontOptions: FontOptions;
    constructor(pb: PlotBoilerplate, boxSize: XYDimension, editorHelpers: EditorHelper);
    renderBoxes(dialogConfig: IDialogueConfig<IMiniQuestionaireWithPosition>): void;
    renderConnections(dialogConfig: IDialogueConfig<IMiniQuestionaireWithPosition>): void;
}
