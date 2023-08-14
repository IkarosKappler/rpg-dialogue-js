"use strict";
/**
 * A script for demonstrating the line-point-distance.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui
 *
 * @author   Ikaros Kappler
 * @date     2023-07-25
 * @version  1.0.0
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Editor = void 0;
var gup_1 = require("./gup");
var detectDarkMode_1 = require("./detectDarkMode");
var plotboilerplate_1 = require("plotboilerplate");
var RPGDialogueLogic_1 = require("./RPGDialogueLogic");
var editorHelpers_1 = require("./editorHelpers");
var editorRenderer_1 = require("./editorRenderer");
var TouchHandler_1 = require("./TouchHandler");
var FileDrop_1 = require("plotboilerplate/src/cjs/utils/io/FileDrop");
var modal_1 = require("./modal");
var Editor = /** @class */ (function () {
    function Editor(dialogueConfigJSONPath, isRecoveryFromLocalStorageActive) {
        this.currentMouseHandler = null;
        this.currentTouchHandler = null;
        var _self = this;
        console.log("Initialize plotboilerplate");
        // Fetch the GET params
        var GUP = (0, gup_1.gup)();
        var isDarkmode = (0, detectDarkMode_1.detectDarkMode)(GUP);
        // All config params are optional.
        this.pb = new plotboilerplate_1.PlotBoilerplate(plotboilerplate_1.PlotBoilerplate.utils.safeMergeByKeys({
            canvas: document.getElementById("my-canvas"),
            fullSize: true,
            fitToParent: true,
            scaleX: 1.0,
            scaleY: 1.0,
            rasterGrid: true,
            drawOrigin: false,
            rasterAdjustFactor: 2.0,
            redrawOnResize: true,
            defaultCanvasWidth: 1024,
            defaultCanvasHeight: 768,
            canvasWidthFactor: 1.0,
            canvasHeightFactor: 1.0,
            cssScaleX: 1.0,
            cssScaleY: 1.0,
            cssUniformScale: true,
            autoAdjustOffset: true,
            offsetAdjustXPercent: 50,
            offsetAdjustYPercent: 50,
            backgroundColor: isDarkmode ? "#000000" : "#ffffff",
            enableMouse: true,
            enableKeys: true
        }, GUP));
        var boxSize = {
            width: 120,
            height: 20
        };
        this.editorHelpers = new editorHelpers_1.EditorHelper(this, this.pb, boxSize);
        this.editorRenderer = new editorRenderer_1.EditorRenderer(this.pb, boxSize, this.editorHelpers, isDarkmode);
        // +---------------------------------------------------------------------------------
        // | The render method.
        // +-------------------------------
        this.pb.config.postDraw = function (draw, fill) {
            if (!_self.dialogConfig) {
                return;
            }
            _self.editorRenderer.renderBoxes(_self.dialogConfig);
            _self.editorRenderer.renderConnections(_self.dialogConfig);
        };
        if (isRecoveryFromLocalStorageActive) {
            console.log("Trying to recover config from localstorage.");
            this.tryLoadFromLocalStorage()
                .then(function (dc) {
                _self.handleDialogConfigLoaded(dc);
            })
                .catch(function () {
                console.log("Loading from localstorage failed. Falling back loading from specified path.");
                _self.tryLoadFromJSON(dialogueConfigJSONPath);
            });
        }
        else {
            _self.tryLoadFromJSON(dialogueConfigJSONPath);
        }
        // Install DnD with FileDrop
        var fileDrop = new FileDrop_1.FileDrop(this.pb.eventCatcher);
        fileDrop.onFileJSONDropped(function (jsonObject) {
            console.log("[onFileJSONDropped] jsonObject", jsonObject);
            // TODO: properly convert to dialog-config
            _self.handleDialogConfigLoaded(editorHelpers_1.EditorHelper.fromObject(jsonObject));
        });
        // Also accept uploads via button
        var importJSON = function () {
            document.getElementById("input-upload-file").click();
        };
        document.getElementById("b-import-json").addEventListener("click", importJSON);
        document.getElementById("input-upload-file").addEventListener("change", function (_evt) {
            var fileInput = document.getElementById("input-upload-file");
            if (!fileInput.files || fileInput.files.length === 0) {
                return;
            }
            console.log("inputFile", fileInput.files[0]);
            var reader = new FileReader();
            reader.onload = function () {
                var jsonText = reader.result;
                console.log(reader.result);
                _self.handleDialogConfigLoaded(editorHelpers_1.EditorHelper.fromObject(JSON.parse(jsonText)));
            };
            reader.readAsText(fileInput.files[0]);
        });
        document.getElementById("b-run-test").addEventListener("click", function () {
            _self.testCurrentDialogueConfig();
        });
        document.getElementById("b-new").addEventListener("click", _self.requestCreateNewGraph());
        document.getElementById("b-show-json").addEventListener("click", _self.showJSON());
        document.getElementById("b-goto-github").addEventListener("click", function () {
            window.open("https://github.com/IkarosKappler/rpg-dialogue", "_blank");
        });
    }
    Editor.prototype.tryStartAutosaveLoop = function () {
        if (this.autosaveTimer) {
            return;
        }
        var _self = this;
        this.autosaveTimer = globalThis.setInterval(function () {
            _self.tryAutoSave();
        }, 10000);
    };
    Editor.prototype.tryAutoSave = function () {
        if (this.editorHelpers.domHelper.isAutoSave()) {
            // console.log("Putting to localstorage.");
            this.putToLocalStorage();
        }
    };
    Editor.prototype.requestCreateNewGraph = function () {
        var _self = this;
        return function () {
            _self.editorHelpers.domHelper.modal.setTitle("Drop current graph?");
            _self.editorHelpers.domHelper.modal.setBody("Do you really want to create a new graph and lose unsaved changes?");
            _self.editorHelpers.domHelper.modal.setFooter("");
            _self.editorHelpers.domHelper.modal.setActions([
                modal_1.Modal.ACTION_CANCEL,
                {
                    label: "Yes",
                    action: function () {
                        _self.editorHelpers.domHelper.modal.close();
                        _self.performNewGraph();
                    }
                }
            ]);
            _self.editorHelpers.domHelper.modal.open();
        };
    };
    Editor.prototype.performNewGraph = function () {
        var newConfig = {
            meta: { name: "dialogue_A", npcs: [{ name: "NPC #0" }] },
            graph: {
                intro: { q: "Hello world!", o: [{ a: "Hello, NPC!", next: null }], editor: { position: { x: 0, y: 0 } } }
            }
        };
        this.handleDialogConfigLoaded(newConfig);
    };
    Editor.prototype.showJSON = function () {
        var _self = this;
        return function () {
            var removePositions = _self.editorHelpers.domHelper.isExportWithoutPositions();
            var dConfig = removePositions
                ? editorHelpers_1.EditorHelper.removePositions(_self.editorHelpers.dialogConfigWithPositions)
                : _self.editorHelpers.dialogConfigWithPositions;
            var jsonString = JSON.stringify(dConfig, null, 4);
            var jsonArea = document.createElement("textarea");
            jsonArea.setAttribute("readonly", "true");
            jsonArea.innerHTML = jsonString;
            jsonArea.classList.add("json-preview");
            _self.editorHelpers.domHelper.modal.setTitle("Current Graph as JSON");
            _self.editorHelpers.domHelper.modal.setBody(jsonArea);
            _self.editorHelpers.domHelper.modal.setFooter("");
            _self.editorHelpers.domHelper.modal.setActions([modal_1.Modal.ACTION_CLOSE]);
            _self.editorHelpers.domHelper.modal.open();
        };
    };
    /**
     * Open a modal and test the current dialogue config (runs a RPGDialogueLogic instant).
     */
    Editor.prototype.testCurrentDialogueConfig = function () {
        var _self = this;
        // Create this structure:
        // <div class="rpg-output">
        //    <div class="rpg-output-question"></div>
        //    <ul class="rpg-output-options"></ul>
        // </div>
        var outputContainer = document.createElement("div");
        var outputQuestion = document.createElement("div");
        var outputOptions = document.createElement("ul");
        outputContainer.classList.add("rpg-output");
        outputQuestion.classList.add("rpg-output-question");
        outputOptions.classList.add("rpg-output-options");
        outputContainer.appendChild(outputQuestion);
        outputContainer.appendChild(outputOptions);
        var dialogueListener = function (dialogueConfig, nextNodeName, oldNodeName, selectedOptionIndex) {
            // Highlight current node in the graph editor :)
            // console.log("nextNodeName", nextNodeName, "oldNodeName", oldNodeName, "selectedOptionIndex", selectedOptionIndex);
            _self.editorHelpers.setHighlightedNode(nextNodeName);
        };
        var rpgLogic = new RPGDialogueLogic_1.RPGDialogueLogic(this.dialogConfig, false);
        rpgLogic.addDialogueChangeListener(dialogueListener);
        var alternateStartNodeName = this.editorHelpers.selectedNodeName;
        this.editorHelpers.setSelectedNode(null, null);
        rpgLogic.beginConversation(outputQuestion, outputOptions, alternateStartNodeName);
        this.editorHelpers.domHelper.modal.setTitle("Test");
        this.editorHelpers.domHelper.modal.setBody(outputContainer);
        this.editorHelpers.domHelper.modal.setFooter("");
        this.editorHelpers.domHelper.modal.setActions([modal_1.Modal.ACTION_CLOSE]);
        this.editorHelpers.domHelper.modal.open();
    };
    Editor.prototype.handleDialogConfigLoaded = function (config) {
        // Check if all graph nodes have positions to render.
        this.dialogConfig = this.editorHelpers.enrichPositions(config);
        this.editorHelpers.enrichMetaData(this.dialogConfig);
        console.log("Enriched meta data", this.dialogConfig);
        this.editorHelpers.setDialogConfig(this.dialogConfig);
        // Ad DnD support for boxes.
        if (this.currentMouseHandler) {
            this.currentMouseHandler.destroy();
            this.currentMouseHandler = null;
        }
        this.currentMouseHandler = this.editorHelpers.boxMovehandler(); // dialogConfig);
        // Ad DnD support for boxes.
        if (this.currentTouchHandler) {
            this.currentTouchHandler.destroy();
            this.currentTouchHandler = null;
        }
        this.currentTouchHandler = new TouchHandler_1.TouchHandler(this.pb, this.dialogConfig, this.editorHelpers);
        this.pb.redraw();
        this.tryStartAutosaveLoop();
    };
    Editor.prototype.putToLocalStorage = function () {
        var jsonString = JSON.stringify(this.dialogConfig);
        globalThis.localStorage.setItem("__rpgeditor.dialogueconfig", jsonString);
    };
    Editor.prototype.tryLoadFromJSON = function (dialogueConfigJSONPath) {
        var _self = this;
        RPGDialogueLogic_1.RPGDialogueLogic.loadConfigFromJSON(dialogueConfigJSONPath).then(function (config) {
            console.log("structure", config);
            _self.handleDialogConfigLoaded(config);
        });
    };
    Editor.prototype.tryLoadFromLocalStorage = function () {
        return new Promise(function (accept, reject) {
            var jsonString = globalThis.localStorage.getItem("__rpgeditor.dialogueconfig");
            if (!jsonString || jsonString === "") {
                reject();
            }
            try {
                var jsonObject = JSON.parse(jsonString);
                if (!jsonObject) {
                    reject();
                    return;
                }
                var dialogueConfig = editorHelpers_1.EditorHelper.fromObject(jsonObject);
                accept(dialogueConfig);
            }
            catch (exception) {
                console.warn(exception);
                reject();
            }
        });
    };
    return Editor;
}());
exports.Editor = Editor;
//# sourceMappingURL=Editor.js.map