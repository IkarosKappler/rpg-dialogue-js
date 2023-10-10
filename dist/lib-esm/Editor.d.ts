/**
 * A script for demonstrating the line-point-distance.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui
 *
 * @author   Ikaros Kappler
 * @date     2023-07-25
 * @modified 2023-10-10 Renamed private method `showJSON` to `requestShowJSON`.
 * @version  1.0.0
 **/
import { MouseHandler, PlotBoilerplate } from "plotboilerplate";
import { IDialogueConfig, IGlobalLibs, IMiniQuestionaireWithPosition } from "./interfaces";
import { EditorHelper } from "./editorHelpers";
import { EditorRenderer } from "./editorRenderer";
import { TouchHandler } from "./TouchHandler";
export declare class Editor {
    currentMouseHandler: MouseHandler | null;
    currentTouchHandler: TouchHandler | null;
    editorHelpers: EditorHelper;
    editorRenderer: EditorRenderer;
    dialogConfig: IDialogueConfig<IMiniQuestionaireWithPosition> | null;
    pb: PlotBoilerplate;
    private autosaveTimer;
    constructor(dialogueConfigJSONPath: string, isRecoveryFromLocalStorageActive: boolean, globalLibs: IGlobalLibs);
    private tryStartAutosaveLoop;
    private tryAutoSave;
    requestCreateNewGraph(): () => void;
    private performNewGraph;
    private requestShowJSON;
    /**
     * Open a modal and test the current dialogue config (runs a RPGDialogueLogic instant).
     */
    testCurrentDialogueConfig(): void;
    private handleDialogConfigLoaded;
    private putToLocalStorage;
    private tryLoadFromJSON;
    private tryLoadFromLocalStorage;
}
