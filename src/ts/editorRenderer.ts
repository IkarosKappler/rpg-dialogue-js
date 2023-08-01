/**
 * A renderer for the graph editor.
 *
 * @require PlotBoilerplate
 *
 * @author   Ikaros Kappler
 * @date     2023-07-28
 * @version  1.0.0
 **/
import { FontOptions, MouseHandler, PlotBoilerplate, Vertex, XMouseEvent, XYCoords, XYDimension } from "plotboilerplate";
import { IDialogueConfig, IMiniQuestionaire, IMiniQuestionaireWithPosition } from "./interfaces";
import { EditorHelper } from "./editorHelpers";

export class EditorRenderer {
  pb: PlotBoilerplate;
  boxSize: XYDimension;
  editorHelpers: EditorHelper;
  fontOptions: FontOptions;

  constructor(pb: PlotBoilerplate, boxSize: XYDimension, editorHelpers: EditorHelper) {
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

  renderBoxes(dialogConfig: IDialogueConfig<IMiniQuestionaireWithPosition>) {
    const nodeNames: string[] = Object.keys(dialogConfig.graph);
    const count: number = nodeNames.length;
    const textMaxLength = 20;
    for (var i = 0; i < count; i++) {
      //   console.log("i", i);
      const nodeName = nodeNames[i];
      const graphNode: IMiniQuestionaireWithPosition = dialogConfig.graph[nodeName];
      const nodeIsSelected: boolean = this.editorHelpers.selectedNodeName === nodeName;
      this.pb.draw.rect(
        graphNode.editor.position,
        this.boxSize.width,
        this.boxSize.height,
        nodeIsSelected ? "red" : "green",
        1.0
      );
      // Show initial and terminal nodes with second frame border
      if (!graphNode.o || graphNode.o.length === 0 || nodeName === "intro") {
        this.pb.draw.rect(
          { x: graphNode.editor.position.x - 3, y: graphNode.editor.position.y - 3 },
          this.boxSize.width + 6,
          this.boxSize.height + 6,
          nodeIsSelected ? "red" : "green",
          1.0
        );
      }
      this.pb.fill.text(
        graphNode.q ? (nodeIsSelected ? EditorHelper.ellipsify(graphNode.q, textMaxLength) : graphNode.q) : "-no text-",
        graphNode.editor.position.x,
        graphNode.editor.position.y,
        this.fontOptions
      );
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
          new Vertex(graphNode.editor.position).addXY(this.boxSize.width, this.boxSize.height),
          new Vertex(successorNode.editor.position),
          "red",
          1
        );
      }
    }
  }
}
