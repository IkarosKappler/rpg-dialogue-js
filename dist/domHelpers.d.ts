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
import { IDialogueConfig, IMiniQuestionaire, IMiniQuestionaireWithPosition } from "./interfaces";
export declare class RPGDOMHelpers {
    editorHelpers: EditorHelper;
    dialogConfigWithPositions: IDialogueConfig<IMiniQuestionaireWithPosition>;
    editorElement: HTMLDivElement;
    keyElement: HTMLInputElement;
    qElement: HTMLInputElement;
    optionsElement: HTMLDivElement;
    currentNodeName: string | null;
    currentGraphNode: IMiniQuestionaire;
    constructor(editorHelpers: EditorHelper, dialogConfigWithPositions: IDialogueConfig<IMiniQuestionaireWithPosition>);
    exportJSON(_self: RPGDOMHelpers): () => void;
    setDialogConfig(dialogConfigWithPositions: IDialogueConfig<IMiniQuestionaireWithPosition>): void;
    toggleVisibility(isVisible: boolean): void;
    private handleQChanged;
    private handleATextChanged;
    private handleASuccessorChanged;
    showAnswerOptions(nodeName: string, graphNode: IMiniQuestionaireWithPosition | null): void;
    private makeADropArea;
    private createNodeSelectElement;
}
