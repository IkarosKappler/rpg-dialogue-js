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
var domHelpers_1 = require("./domHelpers");
var EditorHelper = /** @class */ (function () {
    function EditorHelper(pb, boxSize) {
        this.pb = pb;
        this.boxSize = boxSize;
        this.selectedNodeName = null;
        this.domHelper = new domHelpers_1.RPGDOMHelpers(this, null);
    }
    EditorHelper.prototype.setDialogConfig = function (dialogConfigWithPositions) {
        this.dialogConfigWithPositions = dialogConfigWithPositions;
    };
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
    EditorHelper.prototype.setSelectedNode = function (nodeName, node) {
        this.selectedNodeName = nodeName;
        if (nodeName) {
            this.selectedNodeName = nodeName;
            this.selectedNode = node;
            // this.domHelper.editorElement.classList.remove("d-none");
            this.domHelper.toggleVisibility(true);
            this.domHelper.showAnswerOptions(nodeName, this.selectedNode);
        }
        else {
            // this.domHelper.editorElement.classList.add("d-none");
            this.domHelper.toggleVisibility(false);
            this.domHelper.showAnswerOptions(null, null);
        }
        this.pb.redraw();
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
    EditorHelper.prototype.addNewDialogueNode = function () {
        // graph: IDialogueGraph<IMiniQuestionaireWithPosition>
        // const graph: IDialogueGraph<IMiniQuestionaireWithPosition> = _self.editorHelpers.dialogConfigWithPositions.graph;
        var nodeName = this.randomNodeKey();
        var newNode = {
            q: "",
            o: [{ a: "", next: null }],
            editor: {
                position: this.getRandomPosition()
            }
        };
        this.dialogConfigWithPositions.graph[nodeName] = newNode;
        this.selectedNodeName = nodeName;
        this.selectedNode = newNode;
        // _self.currentGraphNode[nodeName] = newNode;
        this.domHelper.showAnswerOptions(nodeName, newNode);
        // _self.updateAnswerOptions();
        this.pb.redraw();
    };
    EditorHelper.prototype.boxMovehandler = function (dialogConfigWithPositions) {
        var _this = this;
        // +---------------------------------------------------------------------------------
        // | Add a mouse listener to track the mouse position.
        // +-------------------------------
        var mouseDownPos = null;
        var lastMouseDownPos = null;
        var draggingNode = null;
        var draggingNodeName = null;
        var handler = new plotboilerplate_1.MouseHandler(this.pb.eventCatcher)
            .down(function (evt) {
            mouseDownPos = _this.pb.transformMousePosition(evt.params.mouseDownPos.x, evt.params.mouseDownPos.y);
            lastMouseDownPos = { x: evt.params.mouseDownPos.x, y: evt.params.mouseDownPos.y };
            draggingNodeName = _this.locateBoxNameAtPos(mouseDownPos, dialogConfigWithPositions);
            if (draggingNodeName) {
                draggingNode = dialogConfigWithPositions.graph[draggingNodeName];
            }
        })
            .up(function (_evt) {
            mouseDownPos = null;
            draggingNode = null;
        })
            .drag(function (evt) {
            if (!mouseDownPos || !draggingNode) {
                return;
            }
            // const diff = evt.params.dragAmount;
            draggingNode.editor.position.x += evt.params.dragAmount.x / _this.pb.draw.scale.x;
            draggingNode.editor.position.y += evt.params.dragAmount.y / _this.pb.draw.scale.y;
        })
            .click(function (evt) {
            // Stop if mouse was moved
            console.log("lastMouseDownPos", lastMouseDownPos, " evt.params.pos", evt.params.pos);
            if (lastMouseDownPos && (lastMouseDownPos.x !== evt.params.pos.x || lastMouseDownPos.y !== evt.params.pos.y)) {
                return;
            }
            var mouseClickPos = _this.pb.transformMousePosition(evt.params.pos.x, evt.params.pos.y);
            var clickedNodeName = _this.locateBoxNameAtPos(mouseClickPos, dialogConfigWithPositions);
            console.log("Click", clickedNodeName);
            if (clickedNodeName) {
                _this.setSelectedNode(clickedNodeName, dialogConfigWithPositions.graph[clickedNodeName]);
                // this.pb.redraw();
            }
            else {
                _this.setSelectedNode(null, null);
                // this.selectedNode = null;
                // this.pb.redraw();
            }
        });
        return handler;
    };
    EditorHelper.ellipsify = function (text, maxLength) {
        if (!text || text.length <= maxLength) {
            return text;
        }
        return "".concat(text.substring(0, maxLength), "...");
    };
    EditorHelper.fromObject = function (object) {
        // Must be of type object
        if (typeof object !== "object") {
            throw "Cannot convert non-objects to dialogue config: type is ".concat(typeof object, ".");
        }
        // Must have a 'graph' member.
        if (!object.hasOwnProperty("graph")) {
            throw "Cannot convert object to dialogue config: object missing member `graph`.";
        }
        var graph = object["graph"];
        // Check if 'intro' is present?
        // All members must be of correct type
        for (var key in object) {
            if (!object.hasOwnProperty(key)) {
                continue;
            }
            var questionaire = object[key];
            if (typeof questionaire !== "object") {
                throw "Cannot converto bject to dialogue config: all graph members must be objects.";
            }
            // Check if 'q' (string) and 'o' (array) attributes are present?
        }
        return object;
    };
    EditorHelper.prototype.randomNodeKey = function () {
        var keys = Object.keys(this.dialogConfigWithPositions.graph);
        var count = keys.length;
        var key = "New " + count;
        while (this.dialogConfigWithPositions.graph.hasOwnProperty(key)) {
            key = "New " + count;
            count++;
        }
        return key;
    };
    return EditorHelper;
}());
exports.EditorHelper = EditorHelper;
//# sourceMappingURL=editorHelpers.js.map