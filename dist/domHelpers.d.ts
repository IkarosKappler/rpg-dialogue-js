/**
 * A script for demonstrating the line-point-distance.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui
 *
 * @author   Ikaros Kappler
 * @date     2023-08-01
 * @version  1.0.0
 **/
import { EditorHelper } from "./editorHelpers";
import { IDialogueConfig, IMiniQuestionaireWithPosition } from "./interfaces";
export declare class RPGDOMHelpers {
    editorHelpers: EditorHelper;
    dialogConfigWithPositions: IDialogueConfig<IMiniQuestionaireWithPosition>;
    editorElement: HTMLDivElement;
    optionsElement: HTMLDivElement;
    constructor(editorHelpers: EditorHelper, dialogConfigWithPositions: IDialogueConfig<IMiniQuestionaireWithPosition>);
    setDialogConfig(dialogConfigWithPositions: IDialogueConfig<IMiniQuestionaireWithPosition>): void;
    toggleVisibility(isVisible: boolean): void;
    private handleQChanged;
    private handleAChanged;
    showOptions(nodeName: string, graphNode: IMiniQuestionaireWithPosition | null): void;
    private createNodeSelectElement;
}
