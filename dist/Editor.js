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
    function Editor(dialogueConfigJSONPath) {
        var _this = this;
        this.currentMouseHandler = null;
        this.currentTouchHandler = null;
        var _self = this;
        console.log("Initialize plotboilerplate");
        // Fetch the GET params
        var GUP = (0, gup_1.gup)();
        var isDarkmode = (0, detectDarkMode_1.detectDarkMode)(GUP);
        // All config params are optional.
        var pb = new plotboilerplate_1.PlotBoilerplate(plotboilerplate_1.PlotBoilerplate.utils.safeMergeByKeys({
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
        this.editorHelpers = new editorHelpers_1.EditorHelper(this, pb, boxSize);
        this.editorRenderer = new editorRenderer_1.EditorRenderer(pb, boxSize, this.editorHelpers, isDarkmode);
        // +---------------------------------------------------------------------------------
        // | The render method.
        // +-------------------------------
        pb.config.postDraw = function (draw, fill) {
            if (!_self.dialogConfig) {
                return;
            }
            _self.editorRenderer.renderBoxes(_self.dialogConfig);
            _self.editorRenderer.renderConnections(_self.dialogConfig);
        };
        RPGDialogueLogic_1.RPGDialogueLogic.loadConfigFromJSON(dialogueConfigJSONPath).then(function (config) {
            console.log("structure", config);
            handleDialogConfigLoaded(config);
        });
        var handleDialogConfigLoaded = function (config) {
            // Check if all graph nodes have positions to render.
            _self.dialogConfig = _this.editorHelpers.enrichPositions(config);
            _this.editorHelpers.enrichMetaData(_self.dialogConfig);
            console.log("Enriched meta data", _self.dialogConfig);
            _this.editorHelpers.setDialogConfig(_self.dialogConfig);
            // Ad DnD support for boxes.
            if (_this.currentMouseHandler) {
                _this.currentMouseHandler.destroy();
                _this.currentMouseHandler = null;
            }
            _this.currentMouseHandler = _this.editorHelpers.boxMovehandler(); // dialogConfig);
            // Ad DnD support for boxes.
            if (_this.currentTouchHandler) {
                _this.currentTouchHandler.destroy();
                _this.currentTouchHandler = null;
            }
            _this.currentTouchHandler = new TouchHandler_1.TouchHandler(pb, _self.dialogConfig, _this.editorHelpers);
            pb.redraw();
        };
        // Install DnD with FileDrop
        var fileDrop = new FileDrop_1.FileDrop(pb.eventCatcher);
        fileDrop.onFileJSONDropped(function (jsonObject) {
            console.log("[onFileJSONDropped] jsonObject", jsonObject);
            // TODO: properly convert to dialog-config
            handleDialogConfigLoaded(editorHelpers_1.EditorHelper.fromObject(jsonObject));
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
                handleDialogConfigLoaded(editorHelpers_1.EditorHelper.fromObject(JSON.parse(jsonText)));
            };
            reader.readAsText(fileInput.files[0]);
        });
        document.getElementById("b-run-test").addEventListener("click", function () {
            _self.testCurrentDialogueConfig();
        });
    }
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
    return Editor;
}());
exports.Editor = Editor;
//# sourceMappingURL=Editor.js.map