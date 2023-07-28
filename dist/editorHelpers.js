"use strict";
/**
 * Helpers for the graph editor.
 *
 * @require PlotBoilerplate
 *
 * @author   Ikaros Kappler
 * @date     2023-07-28
 * @version  1.0.0
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorHelper = void 0;
var plotboilerplate_1 = require("plotboilerplate");
var EditorHelper = /** @class */ (function () {
    function EditorHelper(pb, boxSize) {
        this.pb = pb;
        this.boxSize = boxSize;
    }
    /**
     * A helper function to create random safe positions in the viewport area.
     * @param {PlotBoilerplate} pb
     * @param {XYDimension} boxSize
     * @returns
     */
    EditorHelper.prototype.getRandomPosition = function () {
        var viewport = this.pb.viewport();
        return {
            x: viewport.min.x + this.boxSize.width + (viewport.width - 2 * this.boxSize.width) * Math.random(),
            y: viewport.min.y + this.boxSize.height + (viewport.height - 2 * this.boxSize.height) * Math.random()
        };
    };
    /**
     * A helper function to make sure all graph nodes have valid positions. Those without
     * valid positions (eg like those being loaded from an incomplete JSON file) will be
     * assigned to a random position inside the viewport.
     *
     * @param {PlotBoilerplate} pb
     * @param {XYDimension} boxSize
     * @returns
     */
    EditorHelper.prototype.enrichPositions = function (baseConfig) {
        // Clone?
        var configWithPositions = baseConfig;
        for (var nodeName in configWithPositions.graph) {
            console.log("nodeName", nodeName);
            var graphNode = configWithPositions.graph[nodeName];
            if (!graphNode) {
                console.warn("Warning: graph node ".concat(nodeName, " is null or undefined!"));
                continue;
            }
            // Anonymous member check
            if (!graphNode.hasOwnProperty("editor")) {
                graphNode.editor = { position: this.getRandomPosition() };
            }
            else if (!graphNode.editor.hasOwnProperty("position")) {
                graphNode.editor.position = this.getRandomPosition();
            }
            else {
                if (!graphNode.editor.position.hasOwnProperty("x") || isNaN(graphNode.editor.position.x)) {
                    graphNode.editor.position.x = this.getRandomPosition().x;
                }
                if (!graphNode.editor.position.hasOwnProperty("y") || isNaN(graphNode.editor.position.y)) {
                    graphNode.editor.position.y = this.getRandomPosition().y;
                }
            }
        }
        return configWithPositions;
    };
    EditorHelper.prototype.isPosInGraphNodeBox = function (pos, graphNode) {
        return (graphNode.editor.position.x <= pos.x &&
            graphNode.editor.position.y <= pos.y &&
            graphNode.editor.position.x + this.boxSize.width > pos.x &&
            graphNode.editor.position.y + this.boxSize.height > pos.y);
    };
    EditorHelper.prototype.locateBoxNameAtPos = function (pos, dialogConfigWithPositions) {
        for (var nodeName in dialogConfigWithPositions.graph) {
            var graphNode = dialogConfigWithPositions.graph[nodeName];
            if (this.isPosInGraphNodeBox(pos, graphNode)) {
                return nodeName;
            }
        }
        return null;
    };
    EditorHelper.prototype.boxMovehandler = function (dialogConfigWithPositions) {
        var _this = this;
        // +---------------------------------------------------------------------------------
        // | Add a mouse listener to track the mouse position.
        // +-------------------------------
        var mouseDownPos = null;
        var selectedNode = null;
        var handler = new plotboilerplate_1.MouseHandler(this.pb.eventCatcher)
            .down(function (evt) {
            mouseDownPos = _this.pb.transformMousePosition(evt.params.mouseDownPos.x, evt.params.mouseDownPos.y);
            var selectedNodeName = _this.locateBoxNameAtPos(mouseDownPos, dialogConfigWithPositions);
            if (selectedNodeName) {
                selectedNode = dialogConfigWithPositions.graph[selectedNodeName];
            }
        })
            .up(function (_evt) {
            mouseDownPos = null;
            selectedNode = null;
        })
            .drag(function (evt) {
            if (!mouseDownPos || !selectedNode) {
                return;
            }
            // const diff = evt.params.dragAmount;
            selectedNode.editor.position.x += evt.params.dragAmount.x;
            selectedNode.editor.position.y += evt.params.dragAmount.y;
        });
        return handler;
    };
    return EditorHelper;
}());
exports.EditorHelper = EditorHelper;
//# sourceMappingURL=editorHelpers.js.map