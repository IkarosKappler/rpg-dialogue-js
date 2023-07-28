/**
 * Helpers for the graph editor.
 *
 * @require PlotBoilerplate
 *
 * @author   Ikaros Kappler
 * @date     2023-07-28
 * @version  1.0.0
 **/
import { MouseHandler, PlotBoilerplate, XYCoords, XYDimension } from "plotboilerplate";
import { IDialogueConfig, IMiniQuestionaire, IMiniQuestionaireWithPosition } from "./interfaces";
export declare class EditorHelper {
    pb: PlotBoilerplate;
    boxSize: XYDimension;
    constructor(pb: PlotBoilerplate, boxSize: XYDimension);
    /**
     * A helper function to create random safe positions in the viewport area.
     * @param {PlotBoilerplate} pb
     * @param {XYDimension} boxSize
     * @returns
     */
    getRandomPosition(): XYCoords;
    /**
     * A helper function to make sure all graph nodes have valid positions. Those without
     * valid positions (eg like those being loaded from an incomplete JSON file) will be
     * assigned to a random position inside the viewport.
     *
     * @param {PlotBoilerplate} pb
     * @param {XYDimension} boxSize
     * @returns
     */
    enrichPositions(baseConfig: IDialogueConfig<IMiniQuestionaire>): IDialogueConfig<IMiniQuestionaireWithPosition>;
    isPosInGraphNodeBox(pos: XYCoords, graphNode: IMiniQuestionaireWithPosition): boolean;
    locateBoxNameAtPos(pos: XYCoords, dialogConfigWithPositions: IDialogueConfig<IMiniQuestionaireWithPosition>): string | null;
    boxMovehandler(dialogConfigWithPositions: IDialogueConfig<IMiniQuestionaireWithPosition>): MouseHandler;
}
