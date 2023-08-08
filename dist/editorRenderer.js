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
        // Render suggested new connection
        this.renderSuggestedConnection();
    };
    EditorRenderer.prototype.renderSuggestedConnection = function () {
        if (this.editorHelpers.selectedOption) {
            // console.log("MousePosition", this.editorHelpers.relativeMousePosition);
            var isMousePosInsideOption = this.editorHelpers.isPosInOptionNodeBox(this.editorHelpers.relativeMousePosition, this.editorHelpers.selectedOption.node, this.editorHelpers.selectedOption.optionIndex);
            var bezierTargetPosition = this.editorHelpers.highlightedNode
                ? this.editorHelpers.highlightedNode.editor.position
                : isMousePosInsideOption
                    ? null
                    : this.editorHelpers.relativeMousePosition;
            // console.log("render recommended connection");
            if (bezierTargetPosition) {
                this.drawBezierConnection(this.editorHelpers.selectedOption.node, this.editorHelpers.selectedOption.optionIndex, bezierTargetPosition, true, true);
            }
        }
    };
    EditorRenderer.prototype.renderGraphNode = function (nodeName, graphNode) {
        var isNodeSelected = this.editorHelpers.selectedNodeName === nodeName;
        var isNodeHighlighted = this.editorHelpers.isNodeHighlighted(nodeName);
        this.pb.fill.text(nodeName, graphNode.editor.position.x, graphNode.editor.position.y - this.boxSize.height, __assign(__assign({}, this.fontOptions), { color: "grey" }));
        this.pb.draw.rect(graphNode.editor.position, this.boxSize.width, this.boxSize.height, isNodeSelected ? "rgba(255,128,0,1.0)" : "rgba(0,255,0,1.0)", 1.0);
        // Show initial and terminal nodes with fill color
        if (!graphNode.o || graphNode.o.length === 0 || nodeName === "intro" || isNodeHighlighted) {
            this.pb.fill.rect({ x: graphNode.editor.position.x, y: graphNode.editor.position.y }, this.boxSize.width, this.boxSize.height, isNodeHighlighted ? "rgba(255,128,0,0.5)" : isNodeSelected ? "rgba(255,128,0,0.3)" : "rgba(0,255,0,0.3)", 1.0);
        }
        this.pb.fill.text(graphNode.q ? (isNodeSelected ? graphNode.q : editorHelpers_1.EditorHelper.ellipsify(graphNode.q, this.TEXT_MAX_LENGTH)) : "-no text-", graphNode.editor.position.x, graphNode.editor.position.y, this.fontOptions);
    };
    EditorRenderer.prototype.renderOptions = function (nodeName, graphNode) {
        var isNodeSelected = this.editorHelpers.selectedNodeName === nodeName;
        var offsetY = graphNode.editor.position.y + this.boxSize.height;
        var offsetX = graphNode.editor.position.x + EditorRenderer.OPTION_OFFSET_X;
        for (var j = 0; j < graphNode.o.length; j++) {
            var option = graphNode.o[j];
            // Render highlighted option?
            var otherOptionIsSelected = this.editorHelpers.selectedOption !== null && !this.editorHelpers.isOptionSelected(nodeName, j);
            var isHighlighted = !otherOptionIsSelected && this.editorHelpers.isOptionHighlighted(nodeName, j);
            var isSelected = this.editorHelpers.isOptionSelected(nodeName, j);
            if (isHighlighted || isSelected) {
                this.pb.fill.rect({ x: offsetX, y: offsetY }, this.boxSize.width, this.boxSize.height, "rgba(255,192,0,0.5)", 1);
            }
            this.pb.draw.rect({ x: offsetX, y: offsetY }, this.boxSize.width, this.boxSize.height, "grey", 1);
            this.pb.fill.text(option.a ? (isNodeSelected ? option.a : editorHelpers_1.EditorHelper.ellipsify(option.a, this.TEXT_MAX_LENGTH)) : "-no text-", offsetX, offsetY, __assign(__assign({}, this.fontOptions), { color: isHighlighted || isSelected ? "black" : "grey" }));
            if (isHighlighted || isSelected) {
                // Draw connect indicator when highlighted
                var zA = new plotboilerplate_1.Vertex(graphNode.editor.position).addXY(this.boxSize.width + 16, this.boxSize.height / 2.0 + (j + 1) * (this.boxSize.height + 2) - 2);
                this.pb.fill.circle(zA, 5, "orange");
            }
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
                var isHighlighted = this.editorHelpers.isOptionHighlighted(nodeName, j);
                var otherOptionIsSelected = this.editorHelpers.selectedOption !== null && !this.editorHelpers.isOptionSelected(nodeName, j);
                var isSelected = this.editorHelpers.isOptionSelected(nodeName, j);
                // this.drawLinearConnection(graphNode, successorNode, j);
                this.drawBezierConnection(graphNode, j, successorNode.editor.position, isHighlighted && !otherOptionIsSelected, isSelected);
            }
        }
    };
    // Not in use
    /* drawLinearConnection(graphNode: IMiniQuestionaireWithPosition, successorNode: IMiniQuestionaireWithPosition, j: number) {
      this.pb.draw.arrow(
        new Vertex(graphNode.editor.position).addXY(
          this.boxSize.width + 16,
          this.boxSize.height / 2.0 + (j + 1) * (this.boxSize.height + 2)
        ),
        new Vertex(successorNode.editor.position),
        "rgba(255,192,0,0.5)",
        2
      );
    } */
    EditorRenderer.prototype.drawBezierConnection = function (graphNode, j, successorNodePosition, isHighlighted, isSelected) {
        var zA = new plotboilerplate_1.Vertex(graphNode.editor.position).addXY(this.boxSize.width + 16, this.boxSize.height / 2.0 + (j + 1) * (this.boxSize.height + 2) - 2);
        var zB = new plotboilerplate_1.Vertex(successorNodePosition);
        var cA = zA.clone().addXY(50, 0);
        var cB = zB.clone().subXY(50, 50);
        // console.log("canvas", typeof this.pb.canvas);
        var isCanvas = this.pb.canvas instanceof HTMLCanvasElement;
        if (isCanvas) {
            // Maybe future versions of PlotBoilerplate support this for Canvas & SVG nodes
            if (isHighlighted) {
                this.pb.draw.ctx.setLineDash([10, 6]);
            }
            else {
                this.pb.draw.ctx.setLineDash([0]);
            }
        }
        this.cubicBezierArrow(zA, zB, cA, cB, isHighlighted || isSelected ? "rgba(0,192,255,0.5)" : "rgba(255,192,0,0.5)", 2);
        if (isCanvas) {
            this.pb.draw.ctx.setLineDash([0]);
        }
    };
    /**
     * Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
     *
     * @method arrow
     * @param {Vertex} zA - The start point of the arrow-line.
     * @param {Vertex} zB - The end point of the arrow-line.
     * @param {string} color - Any valid CSS color string.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    EditorRenderer.prototype.cubicBezierArrow = function (zA, zB, cA, cB, color, lineWidth) {
        var _this = this;
        var headlen = 8; // length of head in pixels
        var vertices = plotboilerplate_1.Vertex.utils
            .buildArrowHead(cB, zB, headlen, 1.0, 1.0) // this.pb.draw.scale.x, this.pb.draw.scale.y);
            .map(function (vertex) {
            return vertex.scale(1.0 / _this.pb.draw.scale.x, zB);
        });
        this.pb.draw.cubicBezier(zA, zB, cA, cB, color, lineWidth);
        this.pb.fill.polyline(vertices, false, color, lineWidth);
        // Draw bezier control lines?
        // this.pb.draw.line(zA, cA, "grey", 1);
        // this.pb.draw.line(zB, cB, "grey", 1);
    };
    EditorRenderer.OPTION_OFFSET_X = 16;
    return EditorRenderer;
}());
exports.EditorRenderer = EditorRenderer;
//# sourceMappingURL=editorRenderer.js.map