/**
 * A script for demonstrating the line-point-distance.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui
 *
 * @author   Ikaros Kappler
 * @date     2023-08-01
 * @version  1.0.0
 **/
import { TouchEnterLeaveHandler } from "./TouchHandler";
import { EditorHelper } from "./editorHelpers";
import { IMiniQuestionaire, IMiniQuestionaireWithPosition } from "./interfaces";
import { Modal } from "./modal";
export declare class RPGDOMHelpers {
    editorHelpers: EditorHelper;
    editorElement: HTMLDivElement;
    keyElement: HTMLInputElement;
    npcElement: HTMLSelectElement;
    qElement: HTMLInputElement;
    optionsElement: HTMLDivElement;
    modal: Modal;
    currentNodeName: string | null;
    currentGraphNode: IMiniQuestionaire;
    currentDraggedAnswerIndex: number;
    currentDropAnswerIndex: number;
    touchEnterLeaveHandler: TouchEnterLeaveHandler;
    constructor(editorHelpers: EditorHelper);
    isExportWithoutPositions(): boolean;
    exportJSON(_self: RPGDOMHelpers): () => void;
    addAnswerOption(_self: RPGDOMHelpers): () => void;
    private addDialogueNode;
    private requestRemoveDialogueNode;
    private removeDialogueNode;
    toggleVisibility(isVisible: boolean): void;
    private handleQChanged;
    private handleNPCIndexChanged;
    private handleKeyChanged;
    private handleATextChanged;
    private handleASuccessorChanged;
    updateAnswerOptions(): void;
    getSelectedNpcIndex(): number;
    updateNpcSelector(): void;
    toggleDragEnterStyles(target: HTMLElement): void;
    toggleDragLeaveStyles(target: HTMLElement): void;
    showAnswerOptions(nodeName: string, graphNode: IMiniQuestionaireWithPosition | null): void;
    /**
     * Create a new answer element (consisting of labels, input fields and buttons).
     * If `isTouchDevice` is true, then a drag element will be added.
     * Otherwise two up/down-buttons will be added.
     *
     * @param {number} index - The answer option index inside the config.
     * @param {boolean} isTouchDevice - Set to `true` if drag-and-drop handles should be added instead of buttons.
     * @returns {HTMLDivElement}
     */
    private makeAnswerControlElement;
    private performDrop;
    private requestDeleteOption;
    private handleDeleteOption;
    private makeADropArea;
    private createNodeSelectElement;
    private createNodeSelectOptionElement;
}
