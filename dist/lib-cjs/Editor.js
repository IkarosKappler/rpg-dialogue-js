"use strict";
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
var detectMobileDevice_1 = require("./detectMobileDevice");
var DefaultDialogueRenderer_1 = require("./DefaultDialogueRenderer");
var Editor = /** @class */ (function () {
    function Editor(dialogueConfigJSONPath, isRecoveryFromLocalStorageActive, globalLibs) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f;
        this.currentMouseHandler = null;
        this.currentTouchHandler = null;
        var _self = this;
        console.log("Initializing plotboilerplate");
        // Fetch the GET params
        var GUP = (0, gup_1.gup)();
        var isDarkmode = (0, detectDarkMode_1.detectDarkMode)(GUP);
        var isMobileDevice = (0, detectMobileDevice_1.detectMobileDevice)(GUP);
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
        // | On 'escape' key press un-select selected items.
        // +-------------------------------
        var keyHandler = new plotboilerplate_1.KeyHandler({ element: document.getElementsByTagName("body")[0], trackAll: false }).down("escape", function () {
            // Esc?
            console.log("Escape down");
            if (_this.editorHelpers.selectedOption) {
                _this.editorHelpers.setSelectedOption(null);
            }
            else if (_this.editorHelpers.selectedNode) {
                _this.editorHelpers.setSelectedNode(null, null);
                _this.editorHelpers.setSelectedOption(null);
            }
        });
        // +---------------------------------------------------------------------------------
        // | Make HTML buttons a bit larger on mobile devices.
        // +-------------------------------
        console.debug("isMobileDevice", isMobileDevice);
        if (isMobileDevice) {
            document.getElementsByTagName("body")[0].classList.add("is-mobile-device");
        }
        // +---------------------------------------------------------------------------------
        // | The render method.
        // +-------------------------------
        this.pb.config.postDraw = function (_draw, _fill) {
            if (!_self.dialogConfig) {
                return;
            }
            _self.editorRenderer.renderBoxes(_self.dialogConfig);
            _self.editorRenderer.renderConnections(_self.dialogConfig);
        };
        if (isRecoveryFromLocalStorageActive) {
            console.debug("Trying to recover config from localstorage.");
            this.tryLoadFromLocalStorage()
                .then(function (dc) {
                _self.handleDialogConfigLoaded(dc);
            })
                .catch(function () {
                console.debug("Loading from localstorage failed. Falling back loading from specified path.");
                _self.tryLoadFromJSON(dialogueConfigJSONPath, globalLibs);
            });
        }
        else {
            _self.tryLoadFromJSON(dialogueConfigJSONPath, globalLibs);
        }
        // Install DnD with FileDrop
        var fileDrop = new FileDrop_1.FileDrop(this.pb.eventCatcher);
        fileDrop.onFileJSONDropped(function (jsonObject) {
            console.debug("[onFileJSONDropped] jsonObject", jsonObject);
            // TODO: properly convert to dialog-config
            _self.handleDialogConfigLoaded(editorHelpers_1.EditorHelper.fromObject(jsonObject));
        });
        // Also accept uploads via button
        var importJSON = function () {
            var _a;
            (_a = document.getElementById("input-upload-file")) === null || _a === void 0 ? void 0 : _a.click();
        };
        (_a = document.getElementById("b-import-json")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", importJSON);
        (_b = document.getElementById("input-upload-file")) === null || _b === void 0 ? void 0 : _b.addEventListener("change", function (_evt) {
            var fileInput = document.getElementById("input-upload-file");
            if (!fileInput.files || fileInput.files.length === 0) {
                return;
            }
            // console.log("inputFile", fileInput.files[0]);
            var reader = new FileReader();
            reader.onload = function () {
                var jsonText = reader.result;
                console.log(reader.result);
                _self.handleDialogConfigLoaded(editorHelpers_1.EditorHelper.fromObject(JSON.parse(jsonText)));
            };
            reader.readAsText(fileInput.files[0]);
        });
        (_c = document.getElementById("b-run-test")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", function () {
            _self.testCurrentDialogueConfig();
        });
        (_d = document.getElementById("b-new")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", _self.requestCreateNewGraph());
        (_e = document.getElementById("b-show-json")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", _self.requestShowJSON());
        (_f = document.getElementById("b-goto-github")) === null || _f === void 0 ? void 0 : _f.addEventListener("click", function () {
            window.open("https://github.com/IkarosKappler/rpg-dialogue", "_blank");
        });
    }
    // END constructor
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
    Editor.prototype.requestShowJSON = function () {
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
        if (!this.dialogConfig) {
            console.warn("Warning: cannot test null dialogue.");
            return;
        }
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
        var dialogueListener = function (_dialogueConfig, nextNodeName, _oldNodeName, _selectedOptionIndex) {
            // Highlight current node in the graph editor :)
            _self.editorHelpers.setHighlightedNode(nextNodeName);
        };
        var rpgLogic = new RPGDialogueLogic_1.RPGDialogueLogic(this.dialogConfig, false);
        rpgLogic.addDialogueChangeListener(dialogueListener);
        var alternateStartNodeName = this.editorHelpers.selectedNodeName;
        this.editorHelpers.setSelectedNode(null, null);
        rpgLogic.beginConversation(new DefaultDialogueRenderer_1.DefaultDialogueRenderer(outputQuestion, outputOptions), alternateStartNodeName);
        this.editorHelpers.domHelper.modal.setTitle("Test"); // Will be changed later when invoked.
        this.editorHelpers.domHelper.modal.setBody(outputContainer);
        this.editorHelpers.domHelper.modal.setFooter("");
        this.editorHelpers.domHelper.modal.setActions([modal_1.Modal.ACTION_CLOSE]);
        this.editorHelpers.domHelper.modal.open();
    };
    Editor.prototype.handleDialogConfigLoaded = function (config) {
        // Check if all graph nodes have positions to render.
        this.dialogConfig = this.editorHelpers.enrichPositions(config);
        this.editorHelpers.enrichMetaData(this.dialogConfig);
        // console.debug("Enriched meta data", this.dialogConfig);
        this.editorHelpers.setDialogConfig(this.dialogConfig);
        // Ad DnD support for boxes.
        if (this.currentMouseHandler) {
            this.currentMouseHandler.destroy();
            this.currentMouseHandler = null;
        }
        this.currentMouseHandler = this.editorHelpers.boxMovehandler();
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
    Editor.prototype.tryLoadFromJSON = function (dialogueConfigJSONPath, globalLibs) {
        var _self = this;
        RPGDialogueLogic_1.RPGDialogueLogic.loadConfigFromJSON(dialogueConfigJSONPath, globalLibs).then(function (config) {
            console.debug("structure", config);
            _self.handleDialogConfigLoaded(config);
        });
    };
    Editor.prototype.tryLoadFromLocalStorage = function () {
        return new Promise(function (accept, reject) {
            var jsonString = globalThis.localStorage.getItem("__rpgeditor.dialogueconfig");
            if (!jsonString || jsonString === "") {
                reject();
            }
            else {
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
            }
        });
    };
    return Editor;
}());
exports.Editor = Editor;
//# sourceMappingURL=Editor.js.map