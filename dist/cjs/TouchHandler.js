"use strict";
/**
 * A wrapper class for AlloyFinger.
 *
 * @author  Ikaros Kappler
 * @date    2023-07-31
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TouchEnterLeaveHandler = exports.TouchHandler = void 0;
var plotboilerplate_1 = require("plotboilerplate");
var TouchHandler = /** @class */ (function () {
    function TouchHandler(pb, dialogConfigWithPositions, editorHelper) {
        this.wasTouchUsed = false;
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
                _self.wasTouchUsed = true;
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
                console.log("touchMove");
                _self.wasTouchUsed = true;
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
                console.log("touchCancel");
                _self.wasTouchUsed = true;
                clearTouch();
            }
        }; // END afProps
        /* tslint:disable-next-line */
        _self.alloyFinger = globalThis.createAlloyFinger(pb.eventCatcher ? pb.eventCatcher : pb.canvas, afProps);
    }
    TouchHandler.prototype.destroy = function () {
        this.alloyFinger.destroy();
    };
    return TouchHandler;
}());
exports.TouchHandler = TouchHandler;
var TouchEnterLeaveHandler = /** @class */ (function () {
    function TouchEnterLeaveHandler() {
        this.onTouchLeaveEvents = [];
        this.onTouchEnterEvents = [];
        this._init();
    }
    TouchEnterLeaveHandler.prototype.onTouchEnter = function (selector, fn) {
        var _this = this;
        this.onTouchEnterEvents.push([selector, fn]);
        return function () {
            _this.onTouchEnterEvents.slice().map(function (e, i) {
                if (e[0] === selector && e[1] === fn) {
                    this.onTouchEnterEvents.splice(1, i);
                }
            });
        };
    };
    TouchEnterLeaveHandler.prototype.onTouchLeave = function (selector, fn) {
        this.onTouchLeaveEvents.push([selector, fn]);
        return function () {
            this.onTouchLeaveEvents.slice().map(function (e, i) {
                if (e[0] === selector && e[1] === fn) {
                    this.onTouchLeaveEvents.splice(1, i);
                }
            });
        };
    };
    TouchEnterLeaveHandler.prototype._init = function () {
        var lastTouchLeave;
        var lastTouchEnter;
        var _self = this;
        document.addEventListener("touchmove", function (e) {
            var el = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
            if (!el) {
                return;
            }
            _self.onTouchLeaveEvents.map(function (event) {
                if (el != lastTouchEnter && lastTouchEnter && lastTouchEnter.matches(event[0])) {
                    if (lastTouchEnter !== lastTouchLeave) {
                        event[1](lastTouchEnter, e);
                        lastTouchLeave = lastTouchEnter;
                        lastTouchEnter = null;
                    }
                }
            });
            _self.onTouchEnterEvents.map(function (event) {
                if (el.matches(event[0]) && el !== lastTouchEnter) {
                    lastTouchEnter = el;
                    lastTouchLeave = null;
                    event[1](el, e);
                }
            });
        });
    };
    return TouchEnterLeaveHandler;
}());
exports.TouchEnterLeaveHandler = TouchEnterLeaveHandler;
// Test
// onTouchEnter('.area',function(el,e){
//   el.classList.add('hover')
// })
// onTouchLeave('.area',function(el,e){
//   el.classList.remove('hover')
// })
//# sourceMappingURL=TouchHandler.js.map