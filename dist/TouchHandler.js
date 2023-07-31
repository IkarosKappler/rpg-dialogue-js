"use strict";
/**
 * A wrapper class for AlloyFinger.
 *
 * @author  Ikaros Kappler
 * @date    2023-07-31
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TouchHandler = void 0;
var plotboilerplate_1 = require("plotboilerplate");
var TouchHandler = /** @class */ (function () {
    function TouchHandler(pb, dialogConfigWithPositions, editorHelper) {
        var _self = this;
        // Install a touch handler on the canvas.
        var relPos = function (pos) {
            var bounds = pb.canvas.getBoundingClientRect();
            return { x: pos.x - bounds.left, y: pos.y - bounds.top };
        };
        var draggedElements = null;
        var draggedElementName = null;
        var draggedNode = null;
        var touchMovePos = null;
        var touchDownPos = null;
        // var draggedElement: IDraggable | undefined | null = null;
        var multiTouchStartScale = null;
        var clearTouch = function () {
            touchMovePos = null;
            touchDownPos = null;
            //   draggedElement = null;
            draggedElementName = null;
            draggedElementName = null;
            multiTouchStartScale = null;
            draggedElements = [];
        };
        var afProps = {
            touchStart: function (evt) {
                console.log("Touchstart");
                if (evt.touches.length == 1) {
                    touchMovePos = new plotboilerplate_1.Vertex(relPos({ x: evt.touches[0].clientX, y: evt.touches[0].clientY }));
                    touchDownPos = new plotboilerplate_1.Vertex(relPos({ x: evt.touches[0].clientX, y: evt.touches[0].clientY }));
                    draggedElementName = editorHelper.locateBoxNameAtPos(pb.transformMousePosition(touchMovePos.x, touchMovePos.y), dialogConfigWithPositions);
                    if (draggedElementName) {
                        draggedNode = dialogConfigWithPositions.graph[draggedElementName];
                    }
                }
            },
            touchMove: function (evt) {
                if (evt.touches.length == 1 && draggedNode) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    if (!touchDownPos || !touchMovePos) {
                        return;
                    }
                    var rel = relPos({ x: evt.touches[0].clientX, y: evt.touches[0].clientY });
                    var trans = pb.transformMousePosition(rel.x, rel.y);
                    var diff = new plotboilerplate_1.Vertex(pb.transformMousePosition(touchMovePos.x, touchMovePos.y)).difference(trans);
                    draggedNode.editor.position.x += diff.x;
                    draggedNode.editor.position.y += diff.y;
                    touchMovePos = new plotboilerplate_1.Vertex(relPos({ x: evt.touches[0].clientX, y: evt.touches[0].clientY }));
                    pb.redraw();
                }
            },
            touchEnd: function (evt) {
                // Note: e.touches.length is 0 here
                if (draggedNode) {
                    if (!touchDownPos) {
                        return;
                    }
                }
                clearTouch();
            },
            touchCancel: function (evt) {
                clearTouch();
            }
        }; // END afProps
        /* tslint:disable-next-line */
        // new AlloyFinger(pb.eventCatcher ? pb.eventCatcher : pb.canvas, afProps);
        _self.alloyFinger = globalThis.createAlloyFinger(pb.eventCatcher ? pb.eventCatcher : pb.canvas, afProps);
    }
    TouchHandler.prototype.destroy = function () {
        this.alloyFinger.destroy();
    };
    return TouchHandler;
}());
exports.TouchHandler = TouchHandler;
//# sourceMappingURL=TouchHandler.js.map