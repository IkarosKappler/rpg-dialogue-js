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
var EditorRenderer = /** @class */ (function () {
    function EditorRenderer(pb, boxSize) {
        this.pb = pb;
        this.boxSize = boxSize;
    }
    EditorRenderer.prototype.renderBoxes = function (dialogConfig) {
        var nodeNames = Object.keys(dialogConfig.graph);
        var count = nodeNames.length;
        for (var i = 0; i < count; i++) {
            //   console.log("i", i);
            var nodeName = nodeNames[i];
            var graphNode = dialogConfig.graph[nodeName];
            this.pb.draw.rect(graphNode.editor.position, this.boxSize.width, this.boxSize.height, "red", 1.0);
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
                this.pb.draw.line(new plotboilerplate_1.Vertex(graphNode.editor.position), new plotboilerplate_1.Vertex(successorNode.editor.position), "red", 1);
            }
        }
    };
    return EditorRenderer;
}());
exports.EditorRenderer = EditorRenderer;
//# sourceMappingURL=editorRenderer.js.map