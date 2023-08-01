"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorRenderer = void 0;
/**
 * A renderer for the graph editor.
 *
 * @require PlotBoilerplate
 *
 * @author   Ikaros Kappler
 * @date     2023-07-28
 * @version  1.0.0
 **/
var plotboilerplate_1 = require("plotboilerplate");
var editorHelpers_1 = require("./editorHelpers");
var EditorRenderer = /** @class */ (function () {
    function EditorRenderer(pb, boxSize, editorHelpers) {
        this.pb = pb;
        this.boxSize = boxSize;
        this.editorHelpers = editorHelpers;
        this.fontOptions = {
            color: "black",
            fontFamily: "Arial",
            fontSize: 12,
            fontStyle: "italic",
            fontWeight: "normal",
            lineHeight: 26,
            textAlign: "left",
            rotation: 0
        };
    }
    EditorRenderer.prototype.renderBoxes = function (dialogConfig) {
        var nodeNames = Object.keys(dialogConfig.graph);
        var count = nodeNames.length;
        var textMaxLength = 20;
        for (var i = 0; i < count; i++) {
            //   console.log("i", i);
            var nodeName = nodeNames[i];
            var graphNode = dialogConfig.graph[nodeName];
            var nodeIsSelected = this.editorHelpers.selectedNodeName === nodeName;
            this.pb.draw.rect(graphNode.editor.position, this.boxSize.width, this.boxSize.height, nodeIsSelected ? "red" : "green", 1.0);
            // Show initial and terminal nodes with second frame border
            if (!graphNode.o || graphNode.o.length === 0 || nodeName === "intro") {
                this.pb.draw.rect({ x: graphNode.editor.position.x - 3, y: graphNode.editor.position.y - 3 }, this.boxSize.width + 6, this.boxSize.height + 6, nodeIsSelected ? "red" : "green", 1.0);
            }
            this.pb.fill.text(graphNode.q ? (nodeIsSelected ? editorHelpers_1.EditorHelper.ellipsify(graphNode.q, textMaxLength) : graphNode.q) : "-no text-", graphNode.editor.position.x, graphNode.editor.position.y, this.fontOptions);
        }
    };
    EditorRenderer.prototype.renderConnections = function (dialogConfig) {
        var nodeNames = Object.keys(dialogConfig.graph);
        var count = nodeNames.length;
        for (var i = 0; i < count; i++) {
            var nodeName = nodeNames[i];
            var graphNode = dialogConfig.graph[nodeName];
            for (var j = 0; j < graphNode.o.length; j++) {
                var successorName = graphNode.o[j].next;
                if (!successorName) {
                    continue;
                }
                var successorNode = dialogConfig.graph[successorName];
                if (!successorNode) {
                    continue;
                }
                this.pb.draw.arrow(new plotboilerplate_1.Vertex(graphNode.editor.position).addXY(this.boxSize.width, this.boxSize.height), new plotboilerplate_1.Vertex(successorNode.editor.position), "red", 1);
            }
        }
    };
    return EditorRenderer;
}());
exports.EditorRenderer = EditorRenderer;
//# sourceMappingURL=editorRenderer.js.map