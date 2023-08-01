"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var getContrastColor_1 = require("plotboilerplate/src/cjs/utils/algorithms/getContrastColor");
var Color_1 = require("plotboilerplate/src/cjs/utils/datastructures/Color");
// import { FileDrop } from "plotboilerplate/src/cjs/utils/io/FileDrop";
var EditorRenderer = /** @class */ (function () {
    function EditorRenderer(pb, boxSize, editorHelpers, isDarkmode) {
        this.TEXT_MAX_LENGTH = 20;
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
        var backgroundColor = isDarkmode ? Color_1.Color.parse("#000000") : Color_1.Color.parse("#ffffff");
        this.fontOptions.color = (0, getContrastColor_1.getContrastColor)(backgroundColor).setAlpha(0.8).cssRGBA();
    }
    EditorRenderer.prototype.renderBoxes = function (dialogConfig) {
        var nodeNames = Object.keys(dialogConfig.graph);
        var count = nodeNames.length;
        for (var i = 0; i < count; i++) {
            //   console.log("i", i);
            var nodeName = nodeNames[i];
            var graphNode = dialogConfig.graph[nodeName];
            this.renderGraphNode(nodeName, graphNode);
            this.renderOptions(nodeName, graphNode);
        }
    };
    EditorRenderer.prototype.renderGraphNode = function (nodeName, graphNode) {
        var isNodeSelected = this.editorHelpers.selectedNodeName === nodeName;
        this.pb.draw.rect(graphNode.editor.position, this.boxSize.width, this.boxSize.height, isNodeSelected ? "red" : "green", 1.0);
        // Show initial and terminal nodes with second frame border
        if (!graphNode.o || graphNode.o.length === 0 || nodeName === "intro") {
            this.pb.draw.rect({ x: graphNode.editor.position.x - 3, y: graphNode.editor.position.y - 3 }, this.boxSize.width + 6, this.boxSize.height + 6, isNodeSelected ? "red" : "green", 1.0);
        }
        this.pb.fill.text(graphNode.q ? (isNodeSelected ? graphNode.q : editorHelpers_1.EditorHelper.ellipsify(graphNode.q, this.TEXT_MAX_LENGTH)) : "-no text-", graphNode.editor.position.x, graphNode.editor.position.y, this.fontOptions);
    };
    EditorRenderer.prototype.renderOptions = function (nodeName, graphNode) {
        var isNodeSelected = this.editorHelpers.selectedNodeName === nodeName;
        var offsetY = graphNode.editor.position.y + this.boxSize.height;
        var offsetX = graphNode.editor.position.x + 16;
        for (var i in graphNode.o) {
            var option = graphNode.o[i];
            this.pb.draw.rect({ x: offsetX, y: offsetY }, this.boxSize.width, this.boxSize.height, "grey", 1);
            this.pb.fill.text(option.a ? (isNodeSelected ? option.a : editorHelpers_1.EditorHelper.ellipsify(option.a, this.TEXT_MAX_LENGTH)) : "-no text-", offsetX, offsetY, __assign(__assign({}, this.fontOptions), { color: "grey" }));
            offsetY += this.boxSize.height + 2;
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
                this.pb.draw.arrow(new plotboilerplate_1.Vertex(graphNode.editor.position).addXY(this.boxSize.width + 16, this.boxSize.height / 2.0 + (j + 1) * (this.boxSize.height + 2)), new plotboilerplate_1.Vertex(successorNode.editor.position), "rgba(255,192,0,0.5)", 2);
            }
        }
    };
    return EditorRenderer;
}());
exports.EditorRenderer = EditorRenderer;
//# sourceMappingURL=editorRenderer.js.map