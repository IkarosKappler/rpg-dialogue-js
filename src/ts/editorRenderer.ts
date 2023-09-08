/**
 * A renderer for the graph editor.
 *
 * @require PlotBoilerplate
 *
 * @author   Ikaros Kappler
 * @date     2023-07-28
 * @version  1.0.0
 **/
import { FontOptions, PlotBoilerplate, Vertex, XYCoords, XYDimension, drawutils } from "plotboilerplate";
import { IAnswer, IDialogueConfig, IMiniQuestionaireWithPosition } from "./interfaces";
import { EditorHelper } from "./editorHelpers";
import { getContrastColor } from "plotboilerplate/src/cjs/utils/algorithms/getContrastColor";
import { Color } from "plotboilerplate/src/cjs/utils/datastructures/Color";

export class EditorRenderer {
  pb: PlotBoilerplate;
  boxSize: XYDimension;
  editorHelpers: EditorHelper;
  fontOptions: FontOptions;

  TEXT_MAX_LENGTH = 20;
  static OPTION_OFFSET_X = 16;

  constructor(pb: PlotBoilerplate, boxSize: XYDimension, editorHelpers: EditorHelper, isDarkmode: boolean) {
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

    const backgroundColor = isDarkmode ? Color.parse("#000000") : Color.parse("#ffffff");
    this.fontOptions.color = getContrastColor(backgroundColor).setAlpha(0.8).cssRGBA();
  }

  renderBoxes(dialogConfig: IDialogueConfig<IMiniQuestionaireWithPosition>) {
    const nodeNames: string[] = Object.keys(dialogConfig.graph);
    const count: number = nodeNames.length;
    for (var i = 0; i < count; i++) {
      const nodeName = nodeNames[i];
      const graphNode: IMiniQuestionaireWithPosition = dialogConfig.graph[nodeName];
      this.renderGraphNode(nodeName, graphNode);
      this.renderOptions(nodeName, graphNode);
    }
    // Render suggested new connection
    this.renderSuggestedConnection();
  }

  private renderSuggestedConnection() {
    if (this.editorHelpers.selectedOption) {
      const isMousePosInsideOption: boolean = this.editorHelpers.isPosInOptionNodeBox(
        this.editorHelpers.relativeMousePosition,
        this.editorHelpers.selectedOption.node,
        this.editorHelpers.selectedOption.optionIndex
      );
      const bezierTargetPosition = this.editorHelpers.highlightedNode
        ? this.editorHelpers.highlightedNode.editor.position
        : isMousePosInsideOption
        ? null
        : this.editorHelpers.relativeMousePosition;
      if (bezierTargetPosition) {
        this.drawBezierConnection(
          this.editorHelpers.selectedOption.node,
          this.editorHelpers.selectedOption.optionIndex,
          bezierTargetPosition,
          true,
          true
        );
      }
    }
  }

  private renderGraphNode(nodeName: string, graphNode: IMiniQuestionaireWithPosition) {
    const isNodeSelected: boolean = this.editorHelpers.selectedNodeName === nodeName;
    const isNodeHighlighted: boolean = this.editorHelpers.isNodeHighlighted(nodeName);
    this.pb.fill.text(nodeName, graphNode.editor.position.x, graphNode.editor.position.y - this.boxSize.height, {
      ...this.fontOptions,
      color: "grey"
    });
    this.pb.draw.rect(
      graphNode.editor.position,
      this.boxSize.width,
      this.boxSize.height,
      isNodeSelected ? "rgba(255,128,0,1.0)" : "rgba(0,255,0,1.0)",
      1.0
    );
    // Show initial and terminal nodes with fill color
    if (!graphNode.o || graphNode.o.length === 0 || nodeName === "intro" || isNodeHighlighted) {
      this.pb.fill.rect(
        { x: graphNode.editor.position.x, y: graphNode.editor.position.y },
        this.boxSize.width,
        this.boxSize.height,
        isNodeHighlighted ? "rgba(255,128,0,0.5)" : isNodeSelected ? "rgba(255,128,0,0.3)" : "rgba(0,255,0,0.3)",
        1.0
      );
    }
    this.pb.fill.text(
      graphNode.q ? (isNodeSelected ? graphNode.q : EditorHelper.ellipsify(graphNode.q, this.TEXT_MAX_LENGTH)) : "-no text-",
      graphNode.editor.position.x,
      graphNode.editor.position.y,
      this.fontOptions
    );
  }

  private renderOptions(nodeName: string, graphNode: IMiniQuestionaireWithPosition) {
    const isNodeSelected: boolean = this.editorHelpers.selectedNodeName === nodeName;

    var offsetY = graphNode.editor.position.y + this.boxSize.height;
    var offsetX = graphNode.editor.position.x + EditorRenderer.OPTION_OFFSET_X;
    for (var j = 0; j < graphNode.o.length; j++) {
      const option: IAnswer = graphNode.o[j];

      // Render highlighted option?
      const otherOptionIsSelected: boolean =
        this.editorHelpers.selectedOption !== null && !this.editorHelpers.isOptionSelected(nodeName, j);
      const isHighlighted = !otherOptionIsSelected && this.editorHelpers.isOptionHighlighted(nodeName, j);
      const isSelected = this.editorHelpers.isOptionSelected(nodeName, j);
      if (isHighlighted || isSelected) {
        this.pb.fill.rect({ x: offsetX, y: offsetY }, this.boxSize.width, this.boxSize.height, "rgba(255,192,0,0.5)", 1);
      }
      this.pb.draw.rect({ x: offsetX, y: offsetY }, this.boxSize.width, this.boxSize.height, "grey", 1);
      this.pb.fill.text(
        option.a ? (isNodeSelected ? option.a : EditorHelper.ellipsify(option.a, this.TEXT_MAX_LENGTH)) : "-no text-",
        offsetX,
        offsetY,
        { ...this.fontOptions, color: isHighlighted || isSelected ? "black" : "grey" }
      );
      if (isHighlighted || isSelected) {
        // Draw connect indicator when highlighted
        const zA = new Vertex(graphNode.editor.position).addXY(
          this.boxSize.width + 16,
          this.boxSize.height / 2.0 + (j + 1) * (this.boxSize.height + 2) - 2
        );
        this.pb.fill.circle(zA, 5, "orange");
      }

      offsetY += this.boxSize.height + 2;
    }
  }

  renderConnections(dialogConfig: IDialogueConfig<IMiniQuestionaireWithPosition>) {
    const nodeNames: string[] = Object.keys(dialogConfig.graph);
    const count: number = nodeNames.length;
    for (var i = 0; i < count; i++) {
      const nodeName = nodeNames[i];
      const graphNode: IMiniQuestionaireWithPosition = dialogConfig.graph[nodeName];
      for (var j = 0; j < graphNode.o.length; j++) {
        const successorName: string = graphNode.o[j].next;
        if (!successorName) {
          continue;
        }
        const successorNode: IMiniQuestionaireWithPosition = dialogConfig.graph[successorName];
        if (!successorNode) {
          continue;
        }
        const isHighlighted = this.editorHelpers.isOptionHighlighted(nodeName, j);
        const otherOptionIsSelected: boolean =
          this.editorHelpers.selectedOption !== null && !this.editorHelpers.isOptionSelected(nodeName, j);

        const isSelected = this.editorHelpers.isOptionSelected(nodeName, j);

        // this.drawLinearConnection(graphNode, successorNode, j);
        this.drawBezierConnection(
          graphNode,
          j,
          successorNode.editor.position,
          isHighlighted && !otherOptionIsSelected,
          isSelected
        );
      }
    }
  }

  drawBezierConnection(
    graphNode: IMiniQuestionaireWithPosition,
    j: number,
    successorNodePosition: XYCoords,
    isHighlighted: boolean,
    isSelected: boolean
  ) {
    // Construct Bézier handles.
    const zA = new Vertex(graphNode.editor.position).addXY(
      this.boxSize.width + 16,
      this.boxSize.height / 2.0 + (j + 1) * (this.boxSize.height + 2) - 2
    );
    const alternateSuccessorNodePosition = { x: successorNodePosition.x, y: successorNodePosition.y + this.boxSize.height };
    // Which left box point to use for destination?
    var distA = zA.difference(successorNodePosition).y;
    var distB = zA.difference(alternateSuccessorNodePosition).y;
    const useAlternate: boolean = Math.abs(distA) >= Math.abs(distB);

    const zB = new Vertex(useAlternate ? alternateSuccessorNodePosition : successorNodePosition);
    const cA = zA.clone().addXY(50, 0);
    const cB = zB.clone().subXY(50, useAlternate ? -50 : 50);

    const isCanvas = this.pb.canvas instanceof HTMLCanvasElement;
    if (isCanvas) {
      // Maybe future versions of PlotBoilerplate support this for Canvas & SVG nodes
      if (isHighlighted) {
        (this.pb.draw as drawutils).ctx.setLineDash([10, 6]);
      } else {
        (this.pb.draw as drawutils).ctx.setLineDash([0]);
      }
    }
    this.cubicBezierArrow(zA, zB, cA, cB, isHighlighted || isSelected ? "rgba(0,192,255,0.5)" : "rgba(255,192,0,0.5)", 2);

    if (isCanvas) {
      (this.pb.draw as drawutils).ctx.setLineDash([0]);
    }
  }

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
  cubicBezierArrow(zA: Vertex, zB: Vertex, cA: Vertex, cB: Vertex, color: string, lineWidth?: number) {
    var headlen: number = 8; // length of head in pixels
    var vertices: Array<Vertex> = Vertex.utils
      .buildArrowHead(cB, zB, headlen, 1.0, 1.0) // this.pb.draw.scale.x, this.pb.draw.scale.y);
      .map((vertex: Vertex) => {
        return vertex.scale(1.0 / this.pb.draw.scale.x, zB);
      });
    this.pb.draw.cubicBezier(zA, zB, cA, cB, color, lineWidth);
    this.pb.fill.polyline(vertices, false, color, lineWidth);

    // Draw bezier control lines?
    // this.pb.draw.line(zA, cA, "grey", 1);
    // this.pb.draw.line(zB, cB, "grey", 1);
  }
}
