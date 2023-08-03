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
import { IDialogueConfig, IMiniQuestionaire, IMiniQuestionaireWithPosition, IOptionIdentifyer } from "./interfaces";
import { RPGDOMHelpers } from "./domHelpers";
export declare class EditorHelper {
    pb: PlotBoilerplate;
    boxSize: XYDimension;
    /**
     * The highlighted node's name or null if none is highlighted.
     * Used to highlight nodes when the mouse is over.
     */
    highlightedNodeName: string | null;
    /**
     * The highlighted node itself or null if none is highligted.
     * Used to determine rendering colors.
     */
    highlightedNode: IMiniQuestionaireWithPosition | null;
    /**
     * The selected node's name or null if none is selected.
     * Used to determine the node editor's contents.
     */
    selectedNodeName: string | null;
    /**
     * The selected node itself or null if none is selected.
     * Used to determine the node editor's contents.
     */
    selectedNode: IMiniQuestionaireWithPosition | null;
    /**
     * The currently selected option or null if none is selected.
     * Used to re-connect an option with a new successor node.
     */
    selectedOption: IOptionIdentifyer | null;
    /**
     * The currently highlighted option.
     * Used to draw on-mouse-over options with a different color.
     */
    hightlightedOption: IOptionIdentifyer | null;
    /**
     * The current mouse position (or null if mouse is not on canvas).
     * In local relative coordinate system.
     */
    relativeMousePosition: XYCoords | null;
    domHelper: RPGDOMHelpers;
    dialogConfigWithPositions: IDialogueConfig<IMiniQuestionaireWithPosition>;
    constructor(pb: PlotBoilerplate, boxSize: XYDimension);
    setDialogConfig(dialogConfigWithPositions: IDialogueConfig<IMiniQuestionaireWithPosition>): void;
    setSelectedOption(selectedOption: IOptionIdentifyer | null, noRedraw?: boolean): void;
    setHighlightedOption(hightlightedOption: IOptionIdentifyer | null): void;
    setHighlightedNode(nodeName: string, noRedraw?: boolean): void;
    /**
     * A helper function to create random safe positions in the viewport area.
     * @param {PlotBoilerplate} pb
     * @param {XYDimension} boxSize
     * @returns
     */
    getRandomPosition(): XYCoords;
    setSelectedNode(nodeName: string, node: IMiniQuestionaireWithPosition): void;
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
    isPosInOptionNodeBox(pos: XYCoords, graphNode: IMiniQuestionaireWithPosition, optionIndex: number): boolean;
    locateNodeBoxNameAtPos(pos: XYCoords): string | null;
    locateOptionBoxNameAtPos(pos: XYCoords): IOptionIdentifyer;
    isNodeHighlighted(nodName: string): boolean;
    isOptionHighlighted(nodeName: string, optionIndex: number): boolean;
    isOptionSelected(nodeName: string, optionIndex: number): boolean;
    addNewDialogueNode(): void;
    removeNewDialogueNode(nodeName: string): void;
    boxMovehandler(): MouseHandler;
    handleClick(mouseClickPos: XYCoords): void;
    handleOptionReconnect(clickedNodeName: string): void;
    static ellipsify(text: string, maxLength: number): string;
    static fromObject(object: object): IDialogueConfig<IMiniQuestionaire>;
    private randomNodeKey;
}
