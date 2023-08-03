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
        var draggedNodeName = null;
        var draggedNode = null;
        var draggedOption;
        var wasDragged = false;
        var touchMovePos = null;
        var touchDownPos = null;
        var clearTouch = function () {
            touchMovePos = null;
            touchDownPos = null;
            draggedNodeName = null;
        };
        var afProps = {
            touchStart: function (evt) {
                console.log("Touchstart");
                if (evt.touches.length == 1) {
                    touchMovePos = new plotboilerplate_1.Vertex(relPos({ x: evt.touches[0].clientX, y: evt.touches[0].clientY }));
                    touchDownPos = new plotboilerplate_1.Vertex(relPos({ x: evt.touches[0].clientX, y: evt.touches[0].clientY }));
                    draggedNodeName = editorHelper.locateNodeBoxNameAtPos(pb.transformMousePosition(touchMovePos.x, touchMovePos.y));
                    if (draggedNodeName) {
                        draggedNode = dialogConfigWithPositions.graph[draggedNodeName];
                    }
                    else {
                        draggedOption = editorHelper.locateOptionBoxNameAtPos(pb.transformMousePosition(touchMovePos.x, touchMovePos.y));
                    }
                    wasDragged = false;
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
                    wasDragged = true;
                    pb.redraw();
                }
            },
            touchEnd: function (evt) {
                // Note: e.touches.length is 0 here
                if (draggedNode) {
                    if (!touchDownPos) {
                        return;
                    }
                    if (!wasDragged) {
                        wasDragged = false;
                        if (draggedNode) {
                            if (editorHelper.selectedOption) {
                                // reconnect
                                editorHelper.handleOptionReconnect(draggedNodeName);
                            }
                            else {
                                editorHelper.setSelectedOption(null, false);
                                editorHelper.setSelectedNode(draggedNodeName, draggedNode);
                            }
                        }
                        else {
                            // Option can be null, too.
                            editorHelper.setSelectedOption(draggedOption, true);
                            editorHelper.setSelectedNode(null, null);
                        }
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