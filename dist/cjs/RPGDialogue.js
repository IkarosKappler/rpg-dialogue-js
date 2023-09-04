"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPGDialogue = void 0;
var gup_1 = require("./gup");
var detectDarkMode_1 = require("./detectDarkMode");
var RPGDialogueLogic_1 = require("./RPGDialogueLogic");
var domHelpers_1 = require("./domHelpers");
var metaHelpers_1 = require("./metaHelpers");
var modal_1 = require("./modal");
var editorHelpers_1 = require("./editorHelpers");
var TouchHandler_1 = require("./TouchHandler");
var editorRenderer_1 = require("./editorRenderer");
var Editor_1 = require("./Editor");
var RPGDialogueSequence_1 = require("./RPGDialogueSequence");
var DefaultDialogueRenderer_1 = require("./DefaultDialogueRenderer");
var RPGDialogue = function () { return ({
    gup: gup_1.gup,
    detectDarkMode: detectDarkMode_1.detectDarkMode,
    RPGDialogueLogic: RPGDialogueLogic_1.RPGDialogueLogic,
    RPGDOMHelpers: domHelpers_1.RPGDOMHelpers,
    DialogueMetaHelpers: metaHelpers_1.DialogueMetaHelpers,
    Modal: modal_1.Modal,
    EditorHelper: editorHelpers_1.EditorHelper,
    TouchHandler: TouchHandler_1.TouchHandler,
    EditorRenderer: editorRenderer_1.EditorRenderer,
    Editor: Editor_1.Editor,
    RPGDialogueSequence: RPGDialogueSequence_1.RPGDialogueSequence,
    DefaultDialogueRenderer: DefaultDialogueRenderer_1.DefaultDialogueRenderer
}); };
exports.RPGDialogue = RPGDialogue;
//# sourceMappingURL=RPGDialogue.js.map