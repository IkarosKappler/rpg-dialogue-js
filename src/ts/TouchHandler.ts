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
import { IDialogueConfig, IMiniQuestionaireWithPosition, IOptionIdentifyer } from "./interfaces";

export class TouchHandler {
  private alloyFinger: AlloyFinger;
  wasTouchUsed: boolean = false;

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

    var draggedNodeName: string | null = null;
    var draggedNode: IMiniQuestionaireWithPosition | null = null;
    var draggedOption: IOptionIdentifyer | null;
    var wasDragged: boolean = false;

    var touchMovePos: Vertex | undefined | null = null;
    var touchDownPos: Vertex | undefined | null = null;
    const clearTouch = () => {
      touchMovePos = null;
      touchDownPos = null;
      draggedNodeName = null;
    };
    const afProps: AlloyFingerOptions = {
      touchStart: (evt: TouchEvent) => {
        console.log("Touchstart");
        _self.wasTouchUsed = true;
        if (evt.touches.length == 1) {
          touchMovePos = new Vertex(relPos({ x: evt.touches[0].clientX, y: evt.touches[0].clientY }));
          touchDownPos = new Vertex(relPos({ x: evt.touches[0].clientX, y: evt.touches[0].clientY }));
          draggedNodeName = editorHelper.locateNodeBoxNameAtPos(pb.transformMousePosition(touchMovePos.x, touchMovePos.y));
          if (draggedNodeName) {
            draggedNode = dialogConfigWithPositions.graph[draggedNodeName];
          } else {
            draggedOption = editorHelper.locateOptionBoxNameAtPos(pb.transformMousePosition(touchMovePos.x, touchMovePos.y));
          }
          wasDragged = false;
        }
      },
      touchMove: (evt: TouchEvent) => {
        console.log("touchMove");
        _self.wasTouchUsed = true;
        if (evt.touches.length == 1 && draggedNode) {
          evt.preventDefault();
          evt.stopPropagation();
          if (!touchDownPos || !touchMovePos) {
            return;
          }
          var rel: XYCoords = relPos({ x: evt.touches[0].clientX, y: evt.touches[0].clientY });
          var trans: XYCoords = pb.transformMousePosition(rel.x, rel.y);
          var diff: Vertex = new Vertex(pb.transformMousePosition(touchMovePos.x, touchMovePos.y)).difference(trans);
          if (draggedNode.editor?.position) {
            draggedNode.editor.position.x += diff.x;
            draggedNode.editor.position.y += diff.y;
          }
          touchMovePos = new Vertex(relPos({ x: evt.touches[0].clientX, y: evt.touches[0].clientY }));
          wasDragged = true;
          pb.redraw();
        }
      },
      touchEnd: (evt: TouchEvent) => {
        console.log("touchEnd");
        _self.wasTouchUsed = true;
        // Note: e.touches.length is 0 here
        if (draggedNode) {
          if (!touchDownPos) {
            return;
          }
          if (!wasDragged) {
            wasDragged = false;
            if (draggedNode) {
              if (editorHelper.selectedOption) {
                // reconnect?
                if (draggedNodeName) {
                  editorHelper.handleOptionReconnect(draggedNodeName);
                }
              } else {
                editorHelper.setSelectedOption(null, false);
                editorHelper.setSelectedNode(draggedNodeName, draggedNode);
              }
            } else {
              // Option can be null, too.
              editorHelper.setSelectedOption(draggedOption, true);
              editorHelper.setSelectedNode(null, null);
            }
          }
        }
        clearTouch();
      },
      touchCancel: (evt: TouchEvent) => {
        console.log("touchCancel");
        _self.wasTouchUsed = true;
        clearTouch();
      }
    } as unknown as AlloyFingerOptions; // END afProps

    /* tslint:disable-next-line */
    _self.alloyFinger = globalThis.createAlloyFinger(pb.eventCatcher ? pb.eventCatcher : pb.canvas, afProps);
  }

  destroy() {
    this.alloyFinger.destroy();
  }
}

/**
 * A class simulating non existing touchenter and touchleave events.
 * Inspired by
 *    https://stackoverflow.com/questions/23111671/touchenter-and-touchleave-events-support
 */
type TouchEnterLeaveListener = (element: HTMLElement, event: TouchEvent) => void;
export class TouchEnterLeaveHandler {
  private onTouchLeaveEvents: Array<[string, TouchEnterLeaveListener]> = [];
  private onTouchEnterEvents: Array<[string, TouchEnterLeaveListener]> = [];

  constructor() {
    this._init();
  }

  onTouchEnter(selector: string, fn: TouchEnterLeaveListener) {
    this.onTouchEnterEvents.push([selector, fn]);
    return () => {
      this.onTouchEnterEvents.slice().map((e, i) => {
        if (e[0] === selector && e[1] === fn) {
          this.onTouchEnterEvents.splice(1, i);
        }
      });
    };
  }

  onTouchLeave(selector: string, fn: TouchEnterLeaveListener) {
    this.onTouchLeaveEvents.push([selector, fn]);
    return function () {
      this.onTouchLeaveEvents.slice().map((e, i) => {
        if (e[0] === selector && e[1] === fn) {
          this.onTouchLeaveEvents.splice(1, i);
        }
      });
    };
  }

  private _init() {
    let lastTouchLeave: Element | null;
    let lastTouchEnter: Element | null;
    const _self = this;
    document.addEventListener("touchmove", e => {
      const el: Element | null = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
      if (!el) {
        return;
      }

      _self.onTouchLeaveEvents.map(event => {
        if (el != lastTouchEnter && lastTouchEnter && lastTouchEnter.matches(event[0])) {
          if (lastTouchEnter !== lastTouchLeave) {
            event[1](lastTouchEnter as HTMLElement, e);
            lastTouchLeave = lastTouchEnter;
            lastTouchEnter = null;
          }
        }
      });

      _self.onTouchEnterEvents.map(event => {
        if (el.matches(event[0]) && el !== lastTouchEnter) {
          lastTouchEnter = el;
          lastTouchLeave = null;
          event[1](el as HTMLElement, e);
        }
      });
    });
  }
}

// Test
// onTouchEnter('.area',function(el,e){
//   el.classList.add('hover')
// })
// onTouchLeave('.area',function(el,e){
//   el.classList.remove('hover')
// })
