/**
 * A renderer for the graph editor.
 *
 * @require PlotBoilerplate
 *
 * @author   Ikaros Kappler
 * @date     2023-07-28
 * @version  1.0.0
 **/
import { FontOptions, PlotBoilerplate, XYCoords, XYDimension } from "plotboilerplate";
import { IDialogueConfig, IMiniQuestionaireWithPosition } from "./interfaces";
import { EditorHelper } from "./editorHelpers";
export declare class EditorRenderer {
    pb: PlotBoilerplate;
    boxSize: XYDimension;
    editorHelpers: EditorHelper;
    fontOptions: FontOptions;
    TEXT_MAX_LENGTH: number;
    static OPTION_OFFSET_X: number;
    constructor(pb: PlotBoilerplate, boxSize: XYDimension, editorHelpers: EditorHelper, isDarkmode: boolean);
    renderBoxes(dialogConfig: IDialogueConfig<IMiniQuestionaireWithPosition>): void;
    private renderSuggestedConnection;
    private renderGraphNode;
    private renderOptions;
    renderConnections(dialogConfig: IDialogueConfig<IMiniQuestionaireWithPosition>): void;
    drawBezierConnection(graphNode: IMiniQuestionaireWithPosition, j: number, successorNodePosition: XYCoords, isHighlighted: boolean, isSelected: boolean): void;
}
