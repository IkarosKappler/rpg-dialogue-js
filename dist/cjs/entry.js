globalThis.gup = globalThis.gup || require("./gup").gup;
console.log("gup", gup);
globalThis.detectDarkMode = require("./detectDarkMode").detectDarkMode;
globalThis.RPGDialogueLogic = require("./RPGDialogueLogic").RPGDialogueLogic;
globalThis.RPGDOMHelpers = require("./domHelpers").RPGDOMHelpers;
globalThis.DialogueMetaHelpers = require("./metaHelpers").DialogueMetaHelpers;
globalThis.Modal = require("./modal").Modal;
globalThis.EditorHelper = require("./editorHelpers").EditorHelper;
globalThis.TouchHandler = require("./TouchHandler").TouchHandler;
globalThis.Editor = require("./DefaultDialogueRenderer").DefaultDialogueRenderer;
globalThis.Editor = require("./Editor").Editor;
globalThis.RPGDialogue = require("./RPGDialogue").RPGDialogue;

// module.exports = require("./index").RPGDialogue;

console.log("RPGDialogue", RPGDialogue);
