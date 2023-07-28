/**
 * A renderer for the graph editor.
 *
 * @require PlotBoilerplate
 *
 * @author   Ikaros Kappler
 * @date     2023-07-28
 * @version  1.0.0
 **/
import { MouseHandler, PlotBoilerplate, Vertex, XMouseEvent, XYCoords, XYDimension } from "plotboilerplate";
import { IDialogueConfig, IMiniQuestionaire, IMiniQuestionaireWithPosition } from "./interfaces";

export class EditorRenderer {
  pb: PlotBoilerplate;
  boxSize: XYDimension;

  constructor(pb: PlotBoilerplate, boxSize: XYDimension) {
    this.pb = pb;
    this.boxSize = boxSize;
  }

  renderBoxes(dialogConfig: IDialogueConfig<IMiniQuestionaireWithPosition>) {
    const nodeNames: string[] = Object.keys(dialogConfig.graph);
    const count: number = nodeNames.length;
    for (var i = 0; i < count; i++) {
      //   console.log("i", i);
      const nodeName = nodeNames[i];
      const graphNode: IMiniQuestionaireWithPosition = dialogConfig.graph[nodeName];
      this.pb.draw.rect(graphNode.editor.position, this.boxSize.width, this.boxSize.height, "red", 1.0);
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
        this.pb.draw.line(new Vertex(graphNode.editor.position), new Vertex(successorNode.editor.position), "red", 1);
      }
    }
  }
}
