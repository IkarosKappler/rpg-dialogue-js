/**
 * Helper to edit dialogue meta data.
 *
 * @author  Ikaros Kappler
 * @date    2023-08-09
 * @version 1.0.0
 */
import { EditorHelper } from "./editorHelpers";
import { IDialogueMeta } from "./interfaces";
export declare class DialogueMetaHelpers {
    private editorHelpers;
    private inputName;
    private inputsNpcNames;
    private metaCopy;
    constructor(editorHelpers: EditorHelper);
    private handleModalOpen;
    private updateModalBody;
    private buildMetaBody;
    private handleUpdateMetaName;
    private handleNpcNameChange;
    private handleDeleteNpc;
    private handleAddNpc;
    private handleSave;
    static cloneMeta(meta: IDialogueMeta): IDialogueMeta;
}
