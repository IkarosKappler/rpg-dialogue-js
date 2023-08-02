/**
 * A renderer for the graph editor.
 *
 * @require PlotBoilerplate
 *
 * @author   Ikaros Kappler
 * @date     2023-07-28
 * @version  1.0.0
 **/
import { FontOptions, PlotBoilerplate, Vertex, XYDimension } from "plotboilerplate";
import { IDialogueConfig, IMiniQuestionaireWithPosition } from "./interfaces";
import { EditorHelper } from "./editorHelpers";
export declare class EditorRenderer {
    pb: PlotBoilerplate;
    boxSize: XYDimension;
    editorHelpers: EditorHelper;
    fontOptions: FontOptions;
    TEXT_MAX_LENGTH: number;
    constructor(pb: PlotBoilerplate, boxSize: XYDimension, editorHelpers: EditorHelper, isDarkmode: boolean);
    renderBoxes(dialogConfig: IDialogueConfig<IMiniQuestionaireWithPosition>): void;
    private renderGraphNode;
    private renderOptions;
    renderConnections(dialogConfig: IDialogueConfig<IMiniQuestionaireWithPosition>): void;
    drawBezierConnection(graphNode: IMiniQuestionaireWithPosition, successorNode: IMiniQuestionaireWithPosition, j: number): void;
    /**
     * Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
     *
     * @method arrow
     * @param {Vertex} zA - The start point of the arrow-line.
     * @param {Vertex} zB - The end point of the arrow-line.
     * @param {string} color - Any valid CSS color string.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    cubicBezierArrow(zA: Vertex, zB: Vertex, cA: Vertex, cB: Vertex, color: string, lineWidth?: number): void;
}
