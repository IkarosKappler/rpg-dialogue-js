/**
 * A renderer for the graph editor.
 *
 * @require PlotBoilerplate
 *
 * @author   Ikaros Kappler
 * @date     2023-07-28
 * @version  1.0.0
 **/
import { FontOptions, PlotBoilerplate, Vertex, XYDimension } from "plotboilerplate";
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
    this.pb.draw.rect(graphNode.editor.position, this.boxSize.width, this.boxSize.height, isNodeSelected ? "red" : "green", 1.0);
    // Show initial and terminal nodes with second frame border
    if (!graphNode.o || graphNode.o.length === 0 || nodeName === "intro") {
      this.pb.draw.rect(
        { x: graphNode.editor.position.x - 3, y: graphNode.editor.position.y - 3 },
        this.boxSize.width + 6,
        this.boxSize.height + 6,
        isNodeSelected ? "red" : "green",
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
    var offsetX = graphNode.editor.position.x + 16;
    for (var i in graphNode.o) {
      const option: IAnswer = graphNode.o[i];

      this.pb.draw.rect({ x: offsetX, y: offsetY }, this.boxSize.width, this.boxSize.height, "grey", 1);
      this.pb.fill.text(
        option.a ? (isNodeSelected ? option.a : EditorHelper.ellipsify(option.a, this.TEXT_MAX_LENGTH)) : "-no text-",
        offsetX,
        offsetY,
        { ...this.fontOptions, color: "grey" }
      );

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
        this.pb.draw.arrow(
          new Vertex(graphNode.editor.position).addXY(
            this.boxSize.width + 16,
            this.boxSize.height / 2.0 + (j + 1) * (this.boxSize.height + 2)
          ),
          new Vertex(successorNode.editor.position),
          "rgba(255,192,0,0.5)",
          2
        );
      }
    }
  }
}
