/**
 * A wrapper class for AlloyFinger.
 *
 * @author  Ikaros Kappler
 * @date    2023-07-31
 * @version 1.0.0
 */

import { AlloyFingerOptions } from "alloyfinger-typescript/src/cjs/alloy_finger";
import AlloyFinger from "alloyfinger-typescript";
import { PlotBoilerplate, Vertex, XYCoords } from "plotboilerplate";
import { EditorHelper } from "./editorHelpers";
import { IDialogueConfig, IMiniQuestionaireWithPosition } from "./interfaces";

export class TouchHandler {
  private alloyFinger: AlloyFinger;

  constructor(
    pb: PlotBoilerplate,
    dialogConfigWithPositions: IDialogueConfig<IMiniQuestionaireWithPosition>,
    editorHelper: EditorHelper
  ) {
    const _self = this;

    // Install a touch handler on the canvas.
    const relPos = (pos: XYCoords): XYCoords => {
      const bounds = pb.canvas.getBoundingClientRect();
      return { x: pos.x - bounds.left, y: pos.y - bounds.top };
    };

    var draggedElements = null;
    var draggedElementName: string = null;
    var draggedNode: IMiniQuestionaireWithPosition = null;
    var wasDragged: boolean = false;

    var touchMovePos: Vertex | undefined | null = null;
    var touchDownPos: Vertex | undefined | null = null;
    // var draggedElement: IDraggable | undefined | null = null;
    var multiTouchStartScale: Vertex | undefined | null = null;
    const clearTouch = () => {
      touchMovePos = null;
      touchDownPos = null;
      //   draggedElement = null;
      draggedElementName = null;
      draggedElementName = null;
      multiTouchStartScale = null;
      draggedElements = [];
    };
    const afProps: AlloyFingerOptions = {
      touchStart: (evt: TouchEvent) => {
        console.log("Touchstart");
        if (evt.touches.length == 1) {
          touchMovePos = new Vertex(relPos({ x: evt.touches[0].clientX, y: evt.touches[0].clientY }));
          touchDownPos = new Vertex(relPos({ x: evt.touches[0].clientX, y: evt.touches[0].clientY }));
          draggedElementName = editorHelper.locateNodeBoxNameAtPos(pb.transformMousePosition(touchMovePos.x, touchMovePos.y));
          if (draggedElementName) {
            draggedNode = dialogConfigWithPositions.graph[draggedElementName];
          }
          wasDragged = false;
        }
      },
      touchMove: (evt: TouchEvent) => {
        if (evt.touches.length == 1 && draggedNode) {
          evt.preventDefault();
          evt.stopPropagation();
          if (!touchDownPos || !touchMovePos) {
            return;
          }
          var rel: XYCoords = relPos({ x: evt.touches[0].clientX, y: evt.touches[0].clientY });
          var trans: XYCoords = pb.transformMousePosition(rel.x, rel.y);
          var diff: Vertex = new Vertex(pb.transformMousePosition(touchMovePos.x, touchMovePos.y)).difference(trans);
          draggedNode.editor.position.x += diff.x;
          draggedNode.editor.position.y += diff.y;
          touchMovePos = new Vertex(relPos({ x: evt.touches[0].clientX, y: evt.touches[0].clientY }));
          wasDragged = true;
          pb.redraw();
        }
      },
      touchEnd: (evt: TouchEvent) => {
        // Note: e.touches.length is 0 here
        if (draggedNode) {
          if (!touchDownPos) {
            return;
          }
          if (!wasDragged) {
            wasDragged = false;
            editorHelper.setSelectedNode(draggedElementName, draggedNode);
            // pb.redraw();
          }
        }
        clearTouch();
      },
      touchCancel: (evt: TouchEvent) => {
        clearTouch();
      }
    } as unknown as AlloyFingerOptions; // END afProps

    /* tslint:disable-next-line */
    // new AlloyFinger(pb.eventCatcher ? pb.eventCatcher : pb.canvas, afProps);
    _self.alloyFinger = globalThis.createAlloyFinger(pb.eventCatcher ? pb.eventCatcher : pb.canvas, afProps);
  }

  destroy() {
    this.alloyFinger.destroy();
  }
}
