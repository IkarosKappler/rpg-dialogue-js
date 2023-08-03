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
// import { FileDrop } from "plotboilerplate/src/cjs/utils/io/FileDrop";

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
      //   console.log("i", i);
      const nodeName = nodeNames[i];
      const graphNode: IMiniQuestionaireWithPosition = dialogConfig.graph[nodeName];
      this.renderGraphNode(nodeName, graphNode);
      this.renderOptions(nodeName, graphNode);
    }
  }

  private renderGraphNode(nodeName: string, graphNode: IMiniQuestionaireWithPosition) {
    const isNodeSelected: boolean = this.editorHelpers.selectedNodeName === nodeName;
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
    if (!graphNode.o || graphNode.o.length === 0 || nodeName === "intro") {
      this.pb.fill.rect(
        { x: graphNode.editor.position.x, y: graphNode.editor.position.y },
        this.boxSize.width,
        this.boxSize.height,
        isNodeSelected ? "rgba(255,128,0,0.3)" : "rgba(0,255,0,0.3)",
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
    for (var i = 0; i < graphNode.o.length; i++) {
      const option: IAnswer = graphNode.o[i];

      // Render highlighted option?
      const isHighlighted = this.editorHelpers.isOptionHighlighted(nodeName, i);
      if (isHighlighted) {
        this.pb.fill.rect({ x: offsetX, y: offsetY }, this.boxSize.width, this.boxSize.height, "rgba(255,192,0,0.5)", 1);
      }
      this.pb.draw.rect({ x: offsetX, y: offsetY }, this.boxSize.width, this.boxSize.height, "grey", 1);
      this.pb.fill.text(
        option.a ? (isNodeSelected ? option.a : EditorHelper.ellipsify(option.a, this.TEXT_MAX_LENGTH)) : "-no text-",
        offsetX,
        offsetY,
        { ...this.fontOptions, color: isHighlighted ? "black" : "grey" }
      );
      if (isHighlighted) {
        // Draw connect indicator when highlighted
        const zA = new Vertex(graphNode.editor.position).addXY(
          this.boxSize.width + 16,
          this.boxSize.height / 2.0 + (i + 1) * this.boxSize.height
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

        // this.drawLinearConnection(graphNode, successorNode, j);
        this.drawBezierConnection(graphNode, successorNode, j, isHighlighted);
      }
    }
  }

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

  drawBezierConnection(
    graphNode: IMiniQuestionaireWithPosition,
    successorNode: IMiniQuestionaireWithPosition,
    j: number,
    isHighlighted: boolean
  ) {
    const zA = new Vertex(graphNode.editor.position).addXY(
      this.boxSize.width + 16,
      this.boxSize.height / 2.0 + (j + 1) * this.boxSize.height
    );
    const zB = new Vertex(successorNode.editor.position);
    const cA = zA.clone().addXY(50, 0);
    const cB = zB.clone().subXY(50, 50);

    // console.log("canvas", typeof this.pb.canvas);
    const isCanvas = this.pb.canvas instanceof HTMLCanvasElement;
    if (isCanvas) {
      // Maybe future versions of PlotBoilerplate support this for Canvas & SVG nodes
      if (isHighlighted) {
        (this.pb.draw as drawutils).ctx.setLineDash([10, 6]);
      } else {
        (this.pb.draw as drawutils).ctx.setLineDash([0]);
      }
    }
    this.cubicBezierArrow(zA, zB, cA, cB, isHighlighted ? "rgba(0,192,255,0.5)" : "rgba(255,192,0,0.5)", 2);

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
