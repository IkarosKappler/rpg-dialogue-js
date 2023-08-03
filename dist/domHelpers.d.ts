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
import { IMiniQuestionaire, IMiniQuestionaireWithPosition } from "./interfaces";
export declare class RPGDOMHelpers {
    editorHelpers: EditorHelper;
    editorElement: HTMLDivElement;
    keyElement: HTMLInputElement;
    qElement: HTMLInputElement;
    optionsElement: HTMLDivElement;
    currentNodeName: string | null;
    currentGraphNode: IMiniQuestionaire;
    constructor(editorHelpers: EditorHelper);
    isExportWithoutPositions(): boolean;
    exportJSON(_self: RPGDOMHelpers): () => void;
    addAnswerOption(_self: RPGDOMHelpers): () => void;
    private addDialogueNode;
    private removeDialogueNode;
    toggleVisibility(isVisible: boolean): void;
    private handleQChanged;
    private handleKeyChanged;
    private handleATextChanged;
    private handleASuccessorChanged;
    updateAnswerOptions(): void;
    showAnswerOptions(nodeName: string, graphNode: IMiniQuestionaireWithPosition | null): void;
    private makeAnswerControlElement;
    private handleDelete;
    private makeADropArea;
    private createNodeSelectElement;
    private createNodeSelectOptionElement;
}
