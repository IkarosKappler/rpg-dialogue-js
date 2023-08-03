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
var Editor = /** @class */ (function () {
    function Editor(dialogueConfigJSONPath) {
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
        var dialogConfig = null;
        var boxSize = {
            width: 120,
            height: 20
        };
        var currentMouseHandler = null;
        var currentTouchHandler = null;
        var editorHelpers = new editorHelpers_1.EditorHelper(pb, boxSize);
        var editorRenderer = new editorRenderer_1.EditorRenderer(pb, boxSize, editorHelpers, isDarkmode);
        // +---------------------------------------------------------------------------------
        // | The render method.
        // +-------------------------------
        pb.config.postDraw = function (draw, fill) {
            if (!dialogConfig) {
                return;
            }
            editorRenderer.renderBoxes(dialogConfig);
            editorRenderer.renderConnections(dialogConfig);
        };
        RPGDialogueLogic_1.RPGDialogueLogic.loadConfigFromJSON(dialogueConfigJSONPath).then(function (config) {
            console.log("structure", config);
            handleDialogConfigLoaded(config);
        });
        var handleDialogConfigLoaded = function (config) {
            // Check if all graph nodes have positions to render.
            dialogConfig = editorHelpers.enrichPositions(config);
            editorHelpers.setDialogConfig(dialogConfig);
            // Ad DnD support for boxes.
            if (currentMouseHandler) {
                currentMouseHandler.destroy();
                currentMouseHandler = null;
            }
            currentMouseHandler = editorHelpers.boxMovehandler(); // dialogConfig);
            // Ad DnD support for boxes.
            if (currentTouchHandler) {
                currentTouchHandler.destroy();
                currentTouchHandler = null;
            }
            currentTouchHandler = new TouchHandler_1.TouchHandler(pb, dialogConfig, editorHelpers);
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
        document.getElementById("input-upload-file").addEventListener("change", function (evt) {
            var fileInput = document.getElementById("input-upload-file");
            if (!fileInput.files || fileInput.files.length === 0) {
                return;
            }
            console.log("pictureFile", fileInput.files[0]);
            var reader = new FileReader();
            reader.onload = function () {
                var jsonText = reader.result;
                console.log(reader.result);
                handleDialogConfigLoaded(editorHelpers_1.EditorHelper.fromObject(JSON.parse(jsonText)));
            };
            reader.readAsText(fileInput.files[0]);
        });
        // +---------------------------------------------------------------------------------
        // | END Editor
        // +-------------------------------
    }
    return Editor;
}());
exports.Editor = Editor;
//# sourceMappingURL=Editor.js.map