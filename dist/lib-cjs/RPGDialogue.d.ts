/**
 * This is the main exported library that shozld be exposed to the browser.
 *
 * @author  Ikaros Kappler
 * @date    2023-09-07
 * @version 1.0.0
 */
import { RPGDialogueLogic } from "./RPGDialogueLogic";
import { RPGDOMHelpers } from "./domHelpers";
import { DialogueMetaHelpers } from "./metaHelpers";
import { Modal } from "./modal";
import { EditorHelper } from "./editorHelpers";
import { TouchHandler } from "./TouchHandler";
import { EditorRenderer } from "./editorRenderer";
import { Editor } from "./Editor";
import { RPGDialogueSequence } from "./RPGDialogueSequence";
import { DefaultDialogueRenderer } from "./DefaultDialogueRenderer";
export declare const RPGDialogue: () => {
    gup: () => {};
    detectDarkMode: (GUP: Record<string, string>) => boolean;
    RPGDialogueLogic: typeof RPGDialogueLogic;
    RPGDOMHelpers: typeof RPGDOMHelpers;
    DialogueMetaHelpers: typeof DialogueMetaHelpers;
    Modal: typeof Modal;
    EditorHelper: typeof EditorHelper;
    TouchHandler: typeof TouchHandler;
    EditorRenderer: typeof EditorRenderer;
    Editor: typeof Editor;
    RPGDialogueSequence: typeof RPGDialogueSequence;
    DefaultDialogueRenderer: typeof DefaultDialogueRenderer;
};
