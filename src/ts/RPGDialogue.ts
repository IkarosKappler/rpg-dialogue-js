import { gup } from "./gup";
import { detectDarkMode } from "./detectDarkMode";
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

export const RPGDialogue = () => ({
  gup: gup,
  detectDarkMode: detectDarkMode,
  RPGDialogueLogic: RPGDialogueLogic,
  RPGDOMHelpers: RPGDOMHelpers,
  DialogueMetaHelpers: DialogueMetaHelpers,
  Modal: Modal,
  EditorHelper: EditorHelper,
  TouchHandler: TouchHandler,
  EditorRenderer: EditorRenderer,
  Editor: Editor,
  RPGDialogueSequence: RPGDialogueSequence,
  DefaultDialogueRenderer: DefaultDialogueRenderer
});
