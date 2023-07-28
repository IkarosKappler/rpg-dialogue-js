/**
 * Helpers for the graph editor.
 *
 * @require PlotBoilerplate
 *
 * @author   Ikaros Kappler
 * @date     2023-07-28
 * @version  1.0.0
 **/

import { MouseHandler, PlotBoilerplate, XMouseEvent, XYCoords, XYDimension } from "plotboilerplate";
import { IDialogueConfig, IMiniQuestionaire, IMiniQuestionaireWithPosition } from "./interfaces";

export class EditorHelper {
  pb: PlotBoilerplate;
  boxSize: XYDimension;

  constructor(pb: PlotBoilerplate, boxSize: XYDimension) {
    this.pb = pb;
    this.boxSize = boxSize;
  }

  /**
   * A helper function to create random safe positions in the viewport area.
   * @param {PlotBoilerplate} pb
   * @param {XYDimension} boxSize
   * @returns
   */
  getRandomPosition(): XYCoords {
    const viewport = this.pb.viewport();
    return {
      x: viewport.min.x + this.boxSize.width + (viewport.width - 2 * this.boxSize.width) * Math.random(),
      y: viewport.min.y + this.boxSize.height + (viewport.height - 2 * this.boxSize.height) * Math.random()
    };
  }

  /**
   * A helper function to make sure all graph nodes have valid positions. Those without
   * valid positions (eg like those being loaded from an incomplete JSON file) will be
   * assigned to a random position inside the viewport.
   *
   * @param {PlotBoilerplate} pb
   * @param {XYDimension} boxSize
   * @returns
   */
  enrichPositions(baseConfig: IDialogueConfig<IMiniQuestionaire>): IDialogueConfig<IMiniQuestionaireWithPosition> {
    // Clone?
    const configWithPositions: IDialogueConfig<IMiniQuestionaireWithPosition> =
      baseConfig as IDialogueConfig<IMiniQuestionaireWithPosition>;

    for (var nodeName in configWithPositions.graph) {
      console.log("nodeName", nodeName);
      const graphNode: IMiniQuestionaireWithPosition = configWithPositions.graph[nodeName];
      if (!graphNode) {
        console.warn(`Warning: graph node ${nodeName} is null or undefined!`);
        continue;
      }
      // Anonymous member check
      if (!graphNode.hasOwnProperty("editor")) {
        graphNode.editor = { position: this.getRandomPosition() };
      } else if (!graphNode.editor.hasOwnProperty("position")) {
        graphNode.editor.position = this.getRandomPosition();
      } else {
        if (!graphNode.editor.position.hasOwnProperty("x") || isNaN(graphNode.editor.position.x)) {
          graphNode.editor.position.x = this.getRandomPosition().x;
        }
        if (!graphNode.editor.position.hasOwnProperty("y") || isNaN(graphNode.editor.position.y)) {
          graphNode.editor.position.y = this.getRandomPosition().y;
        }
      }
    }

    return configWithPositions;
  }

  isPosInGraphNodeBox(pos: XYCoords, graphNode: IMiniQuestionaireWithPosition): boolean {
    return (
      graphNode.editor.position.x <= pos.x &&
      graphNode.editor.position.y <= pos.y &&
      graphNode.editor.position.x + this.boxSize.width > pos.x &&
      graphNode.editor.position.y + this.boxSize.height > pos.y
    );
  }

  locateBoxNameAtPos(pos: XYCoords, dialogConfigWithPositions: IDialogueConfig<IMiniQuestionaireWithPosition>): string | null {
    for (var nodeName in dialogConfigWithPositions.graph) {
      const graphNode: IMiniQuestionaireWithPosition = dialogConfigWithPositions.graph[nodeName];
      if (this.isPosInGraphNodeBox(pos, graphNode)) {
        return nodeName;
      }
    }
    return null;
  }

  boxMovehandler(dialogConfigWithPositions: IDialogueConfig<IMiniQuestionaireWithPosition>) {
    // +---------------------------------------------------------------------------------
    // | Add a mouse listener to track the mouse position.
    // +-------------------------------
    var mouseDownPos: XYCoords = null;
    var selectedNode: IMiniQuestionaireWithPosition = null;
    const handler = new MouseHandler(this.pb.eventCatcher)
      .down((evt: XMouseEvent) => {
        mouseDownPos = this.pb.transformMousePosition(evt.params.mouseDownPos.x, evt.params.mouseDownPos.y);
        const selectedNodeName = this.locateBoxNameAtPos(mouseDownPos, dialogConfigWithPositions);
        if (selectedNodeName) {
          selectedNode = dialogConfigWithPositions.graph[selectedNodeName];
        }
      })
      .up((_evt: XMouseEvent) => {
        mouseDownPos = null;
        selectedNode = null;
      })
      .drag((evt: XMouseEvent) => {
        if (!mouseDownPos || !selectedNode) {
          return;
        }
        // const diff = evt.params.dragAmount;
        selectedNode.editor.position.x += evt.params.dragAmount.x;
        selectedNode.editor.position.y += evt.params.dragAmount.y;
      });

    return handler;
  }
}
