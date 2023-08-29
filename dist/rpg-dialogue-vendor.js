"use strict";
(self["webpackChunkrpg_dialogue"] = self["webpackChunkrpg_dialogue"] || []).push([["vendor"],{

/***/ "./node_modules/alloyfinger-typescript/src/esm/alloy_finger.js":
/*!*********************************************************************!*\
  !*** ./node_modules/alloyfinger-typescript/src/esm/alloy_finger.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AlloyFinger: () => (/* binding */ AlloyFinger),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* Port from AlloyFinger v0.1.15
 * Original by dntzhang
 * Typescript port by Ikaros Kappler
 * Github: https://github.com/IkarosKappler/AlloyFinger-Typescript
 *
 * @date    2021-02-10 (Typescript port)
 * @version 0.1.18
 */
;
/**
 * Tiny math function to calculate the length of a vector in euclidean space.
 *
 * @param {XYCoords} v - The vector in {x,y} notation.
 * @return {number} The length of the vector.
 */
const getLen = (v) => {
    return Math.sqrt(v.x * v.x + v.y * v.y);
};
/**
 * Tiny math function to calculate the dot product of two vectors.
 *
 * @param {XYCoords} v1 - The first vector in {x,y} notation.
 * @param {XYCoords} v2 - The second vector in {x,y} notation.
 * @return {number} The dot product of both vectors.
 */
const dot = (v1, v2) => {
    return v1.x * v2.x + v1.y * v2.y;
};
/**
 * Tiny math function to calculate the angle between two vectors.
 *
 * @param {XYCoords} v1 - The first vector in {x,y} notation.
 * @param {XYCoords} v2 - The second vector in {x,y} notation.
 * @return {number} The angle (in radians) between the two vectors.
 */
const getAngle = (v1, v2) => {
    const mr = getLen(v1) * getLen(v2);
    if (mr === 0)
        return 0;
    var r = dot(v1, v2) / mr;
    if (r > 1)
        r = 1;
    return Math.acos(r);
};
/**
 * Tiny math function to calculate the cross product of two vectors.
 *
 * @param {XYCoords} v1 - The first vector in {x,y} notation.
 * @param {XYCoords} v2 - The second vector in {x,y} notation.
 * @return {number} The cross product of both vectors.
 */
const cross = (v1, v2) => {
    return v1.x * v2.y - v2.x * v1.y;
};
/**
 * Tiny math function to calculate the rotate-angle (in degrees) for two vectors.
 *
 * @param {XYCoords} v1 - The first vector in {x,y} notation.
 * @param {XYCoords} v2 - The second vector in {x,y} notation.
 * @return {number} The rotate-angle in degrees for the two vectors.
 */
const getRotateAngle = (v1, v2) => {
    var angle = getAngle(v1, v2);
    if (cross(v1, v2) > 0) {
        angle *= -1;
    }
    return angle * 180 / Math.PI;
};
/**
 * A HandlerAdmin holds all the added event handlers for one kind of event type.
 */
class HandlerAdmin {
    constructor(el) {
        this.handlers = [];
        this.el = el;
    }
    ;
    add(handler) {
        this.handlers.push(handler);
    }
    ;
    del(handler) {
        if (!handler)
            this.handlers = [];
        for (var i = this.handlers.length; i >= 0; i--) {
            if (this.handlers[i] === handler) {
                this.handlers.splice(i, 1);
            }
        }
    }
    ;
    dispatch(..._args) {
        for (var i = 0, len = this.handlers.length; i < len; i++) {
            const handler = this.handlers[i];
            if (typeof handler === 'function') {
                handler.apply(this.el, arguments);
            }
        }
    }
    ;
} // END class HandlerAdmin
/**
 * A wrapper for handler functions; converts the passed handler function into a HadlerAdmin instance..
 */
const wrapFunc = (el, handler) => {
    const handlerAdmin = new HandlerAdmin(el);
    handlerAdmin.add(handler);
    return handlerAdmin;
};
/**
 * @classdesc The AlloyFinger main class. Use this to add handler functions for
 *            touch events to any HTML- or SVG-Element.
 **/
class AlloyFinger {
    constructor(el, option) {
        this.element = typeof el == 'string' ? document.querySelector(el) : el;
        // Fancy stuff: change `this` from the start-, move-, end- and cancel-function.
        //    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind
        this.start = this.start.bind(this);
        this.move = this.move.bind(this);
        this.end = this.end.bind(this);
        this.cancel = this.cancel.bind(this);
        this.element.addEventListener("touchstart", this.start, false);
        this.element.addEventListener("touchmove", this.move, false);
        this.element.addEventListener("touchend", this.end, false);
        this.element.addEventListener("touchcancel", this.cancel, false);
        this.preV = { x: null, y: null };
        this.pinchStartLen = null;
        this.zoom = 1;
        this.isDoubleTap = false;
        const noop = () => { };
        this.rotate = wrapFunc(this.element, option.rotate || noop);
        this.touchStart = wrapFunc(this.element, option.touchStart || noop);
        this.multipointStart = wrapFunc(this.element, option.multipointStart || noop);
        this.multipointEnd = wrapFunc(this.element, option.multipointEnd || noop);
        this.pinch = wrapFunc(this.element, option.pinch || noop);
        this.swipe = wrapFunc(this.element, option.swipe || noop);
        this.tap = wrapFunc(this.element, option.tap || noop);
        this.doubleTap = wrapFunc(this.element, option.doubleTap || noop);
        this.longTap = wrapFunc(this.element, option.longTap || noop);
        this.singleTap = wrapFunc(this.element, option.singleTap || noop);
        this.pressMove = wrapFunc(this.element, option.pressMove || noop);
        this.twoFingerPressMove = wrapFunc(this.element, option.twoFingerPressMove || noop);
        this.touchMove = wrapFunc(this.element, option.touchMove || noop);
        this.touchEnd = wrapFunc(this.element, option.touchEnd || noop);
        this.touchCancel = wrapFunc(this.element, option.touchCancel || noop);
        this._cancelAllHandler = this.cancelAll.bind(this);
        if (globalThis && typeof globalThis.addEventListener === "function") {
            globalThis.addEventListener('scroll', this._cancelAllHandler);
        }
        this.delta = null;
        this.last = null;
        this.now = null;
        this.tapTimeout = null;
        this.singleTapTimeout = null;
        this.longTapTimeout = null;
        this.swipeTimeout = null;
        this.x1 = this.x2 = this.y1 = this.y2 = null;
        this.preTapPosition = { x: null, y: null };
    }
    ;
    start(evt) {
        if (!evt.touches)
            return;
        const _self = this;
        this.now = Date.now();
        this.x1 = evt.touches[0].pageX;
        this.y1 = evt.touches[0].pageY;
        this.delta = this.now - (this.last || this.now);
        this.touchStart.dispatch(evt, this.element);
        if (this.preTapPosition.x !== null) {
            this.isDoubleTap = (this.delta > 0 && this.delta <= 250 && Math.abs(this.preTapPosition.x - this.x1) < 30 && Math.abs(this.preTapPosition.y - this.y1) < 30);
            if (this.isDoubleTap)
                clearTimeout(this.singleTapTimeout);
        }
        this.preTapPosition.x = this.x1;
        this.preTapPosition.y = this.y1;
        this.last = this.now;
        const preV = this.preV;
        const len = evt.touches.length;
        if (len > 1) {
            this._cancelLongTap();
            this._cancelSingleTap();
            const v = { x: evt.touches[1].pageX - this.x1, y: evt.touches[1].pageY - this.y1 };
            preV.x = v.x;
            preV.y = v.y;
            this.pinchStartLen = getLen(preV);
            this.multipointStart.dispatch(evt, this.element);
        }
        this._preventTap = false;
        this.longTapTimeout = setTimeout((() => {
            _self.longTap.dispatch(evt, _self.element);
            _self._preventTap = true;
        }).bind(_self), 750);
    }
    ;
    move(event) {
        if (!event.touches)
            return;
        const afEvent = event;
        const preV = this.preV;
        const len = event.touches.length;
        const currentX = event.touches[0].pageX;
        const currentY = event.touches[0].pageY;
        this.isDoubleTap = false;
        if (len > 1) {
            const sCurrentX = afEvent.touches[1].pageX;
            const sCurrentY = afEvent.touches[1].pageY;
            const v = { x: afEvent.touches[1].pageX - currentX, y: afEvent.touches[1].pageY - currentY };
            if (preV.x !== null) {
                if (this.pinchStartLen > 0) {
                    afEvent.zoom = getLen(v) / this.pinchStartLen;
                    this.pinch.dispatch(afEvent, this.element);
                }
                afEvent.angle = getRotateAngle(v, preV);
                this.rotate.dispatch(afEvent, this.element);
            }
            preV.x = v.x;
            preV.y = v.y;
            if (this.x2 !== null && this.sx2 !== null) {
                afEvent.deltaX = (currentX - this.x2 + sCurrentX - this.sx2) / 2;
                afEvent.deltaY = (currentY - this.y2 + sCurrentY - this.sy2) / 2;
            }
            else {
                afEvent.deltaX = 0;
                afEvent.deltaY = 0;
            }
            this.twoFingerPressMove.dispatch(afEvent, this.element);
            this.sx2 = sCurrentX;
            this.sy2 = sCurrentY;
        }
        else {
            if (this.x2 !== null) {
                afEvent.deltaX = currentX - this.x2;
                afEvent.deltaY = currentY - this.y2;
                //move事件中添加对当前触摸点到初始触摸点的判断，
                //如果曾经大于过某个距离(比如10),就认为是移动到某个地方又移回来，应该不再触发tap事件才对。
                //
                // translation:
                //    Add the judgment of the current touch point to the initial touch point in the event,
                //    If it has been greater than a certain distance (such as 10), it is considered to be
                //    moved to a certain place and then moved back, and the tap event should no longer be triggered.
                const movedX = Math.abs(this.x1 - this.x2);
                const movedY = Math.abs(this.y1 - this.y2);
                if (movedX > 10 || movedY > 10) {
                    this._preventTap = true;
                }
            }
            else {
                afEvent.deltaX = 0;
                afEvent.deltaY = 0;
            }
            this.pressMove.dispatch(afEvent, this.element);
        }
        this.touchMove.dispatch(afEvent, this.element);
        this._cancelLongTap();
        this.x2 = currentX;
        this.y2 = currentY;
        if (len > 1) {
            event.preventDefault();
        }
    }
    ; // END move
    end(event) {
        if (!event.changedTouches)
            return;
        const afEvent = event;
        this._cancelLongTap();
        const self = this;
        if (afEvent.touches.length < 2) {
            this.multipointEnd.dispatch(afEvent, this.element);
            this.sx2 = this.sy2 = null;
        }
        //swipe
        if ((this.x2 && Math.abs(this.x1 - this.x2) > 30) ||
            (this.y2 && Math.abs(this.y1 - this.y2) > 30)) {
            afEvent.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2);
            this.swipeTimeout = setTimeout(function () {
                self.swipe.dispatch(afEvent, self.element);
            }, 0);
        }
        else {
            this.tapTimeout = setTimeout(function () {
                if (!self._preventTap) {
                    self.tap.dispatch(afEvent, self.element);
                }
                // trigger double tap immediately
                if (self.isDoubleTap) {
                    self.doubleTap.dispatch(afEvent, self.element);
                    self.isDoubleTap = false;
                }
            }, 0);
            if (!self.isDoubleTap) {
                self.singleTapTimeout = setTimeout(function () {
                    self.singleTap.dispatch(afEvent, self.element);
                }, 250);
            }
        }
        this.touchEnd.dispatch(afEvent, this.element);
        this.preV.x = 0;
        this.preV.y = 0;
        this.zoom = 1;
        this.pinchStartLen = null;
        this.x1 = this.x2 = this.y1 = this.y2 = null;
    }
    ; // END end
    cancelAll() {
        this._preventTap = true;
        clearTimeout(this.singleTapTimeout);
        clearTimeout(this.tapTimeout);
        clearTimeout(this.longTapTimeout);
        clearTimeout(this.swipeTimeout);
    }
    ;
    cancel(evt) {
        this.cancelAll();
        this.touchCancel.dispatch(evt, this.element);
    }
    ;
    _cancelLongTap() {
        clearTimeout(this.longTapTimeout);
    }
    ;
    _cancelSingleTap() {
        clearTimeout(this.singleTapTimeout);
    }
    ;
    _swipeDirection(x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
    }
    ;
    on(evt, handler) {
        if (this[evt]) {
            // Force the generic parameter into it's expected candidate here ;)
            const admin = this[evt];
            admin.add(handler);
        }
    }
    ;
    off(evt, handler) {
        if (this[evt]) {
            // Force the generic parameter into it's expected candidate here ;)
            const admin = this[evt];
            admin.del(handler);
        }
    }
    ;
    destroy() {
        if (this.singleTapTimeout) {
            clearTimeout(this.singleTapTimeout);
        }
        if (this.tapTimeout) {
            clearTimeout(this.tapTimeout);
        }
        if (this.longTapTimeout) {
            clearTimeout(this.longTapTimeout);
        }
        if (this.swipeTimeout) {
            clearTimeout(this.swipeTimeout);
        }
        this.element.removeEventListener("touchstart", this.start);
        this.element.removeEventListener("touchmove", this.move);
        this.element.removeEventListener("touchend", this.end);
        this.element.removeEventListener("touchcancel", this.cancel);
        this.rotate.del();
        this.touchStart.del();
        this.multipointStart.del();
        this.multipointEnd.del();
        this.pinch.del();
        this.swipe.del();
        this.tap.del();
        this.doubleTap.del();
        this.longTap.del();
        this.singleTap.del();
        this.pressMove.del();
        this.twoFingerPressMove.del();
        this.touchMove.del();
        this.touchEnd.del();
        this.touchCancel.del();
        this.preV = this.pinchStartLen = this.zoom = this.isDoubleTap = this.delta = this.last = this.now = this.tapTimeout = this.singleTapTimeout = this.longTapTimeout = this.swipeTimeout = this.x1 = this.x2 = this.y1 = this.y2 = this.preTapPosition = this.rotate = this.touchStart = this.multipointStart = this.multipointEnd = this.pinch = this.swipe = this.tap = this.doubleTap = this.longTap = this.singleTap = this.pressMove = this.touchMove = this.touchEnd = this.touchCancel = this.twoFingerPressMove = null;
        if (globalThis && typeof globalThis.removeEventListener === "function") {
            globalThis.removeEventListener('scroll', this._cancelAllHandler);
        }
    }
    ; // END destroy
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AlloyFinger);
//# sourceMappingURL=alloy_finger.js.map

/***/ }),

/***/ "./node_modules/alloyfinger-typescript/src/esm/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/alloyfinger-typescript/src/esm/index.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AlloyFinger: () => (/* reexport safe */ _alloy_finger__WEBPACK_IMPORTED_MODULE_0__.AlloyFinger),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _alloy_finger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./alloy_finger */ "./node_modules/alloyfinger-typescript/src/esm/alloy_finger.js");
/**
 * TypeScript port by Ikaros Kappler.
 *
 * Original file from https://github.com/AlloyTeam/AlloyFinger
 *
 * @date 2021-02-10
 */


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_alloy_finger__WEBPACK_IMPORTED_MODULE_0__.AlloyFinger);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/cjs/utils/algorithms/getContrastColor.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/plotboilerplate/src/cjs/utils/algorithms/getContrastColor.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/**
 * @author Original from Martin Sojka. Ported to TypesScript by Ikaros Kappler
 * @date   2020-11-10
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getContrastColor = void 0;
var Color_1 = __webpack_require__(/*! ../datastructures/Color */ "./node_modules/plotboilerplate/src/cjs/utils/datastructures/Color.js");
var BLACK = Color_1.Color.makeRGB(0, 0, 0);
var WHITE = Color_1.Color.makeRGB(255, 255, 255);
/**
 * Contrast color algorithm by Martin Sojka's.
 * Found at
 *    https://gamedev.stackexchange.com/questions/38536/given-a-rgb-color-x-how-to-find-the-most-contrasting-color-y/38542#38542
 *
 * @requires Color
 */
var getContrastColor = function (color) {
    // r,g,b in [0..1]
    var gamma = 2.2;
    var L = 0.2126 * Math.pow(color.r, gamma) + 0.7152 * Math.pow(color.g, gamma) + 0.0722 * Math.pow(color.b, gamma);
    var use_black = L > Math.pow(0.5, gamma);
    return use_black ? BLACK : WHITE;
};
exports.getContrastColor = getContrastColor;
//# sourceMappingURL=getContrastColor.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/cjs/utils/datastructures/Color.js":
/*!****************************************************************************!*\
  !*** ./node_modules/plotboilerplate/src/cjs/utils/datastructures/Color.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


/**
 * @author Extended, bugfixed and ported to TypeScript by Ikaros Kappler.
 * @modified 2018-xx-xx Added a clone() function.
 * @modified 2018-xx-xx Allowing leading '#' in the makeHEX() function.
 * @modified 2018-11-28 Fixed the checkHEX() function to accept 000000.
 * @modified 2019-11-18 Added a generic parse(string) function that detects the format.
 * @modified 2020-01-09 Fixed a bug in the parse(string) function. Hex colors with only three elements were considered faulty.
 * @modified 2020-10-23 Ported to Typescript.
 * @modified 2021-02-08 Fixed a lot of es2015 compatibility issues.
 * @modified 2021-02-08 Added basic tsdoc/jsdoc comments.
 * @modified 2021-11-05 Fixing the regex to parse rgba-strings.
 * @modified 2021-11-05 Added return value `this` to all modifier functions (for chaining).
 * @modified 2021-11-07 Changed the behavior of `darken` and `lighten`: the passed value is handled relative now which makes values much easier predictable and makes the change feel more 'natural'.
 * @modified 2021-11-07 Did the same with `saturate` and `desaturate`.
 * @modified 2021-11-07 Did the same with the `fadein` and `fadeout` functions.
 * @modified 2021-11-07 Added setRed, setGreen, setBlue, setHue, setSaturation, setLiminance functions.
 * @modified 2022-05-11 Modified the `clone` function by just copying the numeric calues, not re-calculating the whole color.
 * @modified 2022-05-11 Fixed the `interpolate` function.
 * @modified 2023-01-23 Added `Color.set(Color)` function to set all values (r,g,b,h,s,l,a) simultanoeusly.
 * @version 0.0.12
 **/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Color = void 0;
/**
 * @classdesc A color class, inspired by neolitec's Javascript class.
 *    Original found at
 *      https://gist.github.com/neolitec/1344610
 *    Thanks to neolitec
 */
var Color = /** @class */ (function () {
    /**
     * Construct a new color with `r=0 g=0 b=0`.
     *
     * Consider using the `makeHex`, `makeRGB` or `makeHSL` functions.
     *
     * @constructor
     * @instance
     * @memberof Color
     */
    function Color() {
        this.r = this.g = this.b = 0;
        this.h = this.s = this.l = 0;
        this.a = 1;
    }
    // --- RGB ----------------------------------
    /**
     * Get this color as a CSS `rgb` string.
     *
     * Consult this for details: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
     *
     * @method cssRGB
     * @instance
     * @memberof Color
     * @return {string} This color as a CSS rgb string.
     */
    Color.prototype.cssRGB = function () {
        return "rgb(" + Math.round(255 * this.r) + "," + Math.round(255 * this.g) + "," + Math.round(255 * this.b) + ")";
    };
    /**
     * Get this color as a CSS `rgba` string.
     *
     * Consult this for details: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
     *
     * @method cssRGBA
     * @instance
     * @memberof Color
     * @return {string} This color as a CSS rgba string.
     */
    Color.prototype.cssRGBA = function () {
        return "rgba(" + Math.round(255 * this.r) + "," + Math.round(255 * this.g) + "," + Math.round(255 * this.b) + "," + this.a + ")";
    };
    /**
     * Get the red component of this RGB(A)color. This method just returns the `r` color attribute.
     *
     * @method red
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    Color.prototype.red = function () {
        return this.r;
    };
    /**
     * Get the green component of this RGB(A) color. This method just returns the `g` color attribute.
     *
     * @method green
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    Color.prototype.green = function () {
        return this.g;
    };
    /**
     * Get the blue component of this RGB(A) color. This method just returns the `b` color attribute.
     *
     * @method blue
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    Color.prototype.blue = function () {
        return this.b;
    };
    Color.prototype.set = function (color) {
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
        this.a = color.a;
        this.h = color.h;
        this.s = color.s;
        this.l = color.l;
        return this;
    };
    Color.prototype.setRed = function (r) {
        this.r = r;
        return this;
    };
    Color.prototype.setBlue = function (b) {
        this.b = b;
        Color.Converter.RGBToHSL(this);
        return this;
    };
    Color.prototype.setAlpha = function (a) {
        this.a = a;
        Color.Converter.RGBToHSL(this);
        return this;
    };
    Color.prototype.setGreen = function (g) {
        this.g = g;
        Color.Converter.RGBToHSL(this);
        return this;
    };
    Color.prototype.setHue = function (h) {
        this.h = h;
        Color.Converter.HSLToRGB(this);
        return this;
    };
    Color.prototype.setSaturation = function (s) {
        this.s = s;
        Color.Converter.HSLToRGB(this);
        return this;
    };
    Color.prototype.setLuminance = function (l) {
        this.l = l;
        Color.Converter.HSLToRGB(this);
        return this;
    };
    // --- HSL ----------------------------------
    /**
     * Get this color as a CSS `hsl` string.
     *
     * @method cssHSL
     * @instance
     * @memberof Color
     * @return {string} This color as a CSS hsl string.
     */
    Color.prototype.cssHSL = function () {
        return "hsl(" + Math.round(360 * this.h) + "," + Math.round(100 * this.s) + "%," + Math.round(100 * this.l) + "%)";
    };
    /**
     * Get this color as a CSS `hsla` string.
     *
     * @method cssHSLA
     * @instance
     * @memberof Color
     * @return {string} This color as a CSS hsla string.
     */
    Color.prototype.cssHSLA = function () {
        return ("hsla(" +
            Math.round(360 * this.h) +
            "," +
            Math.round(100 * this.s) +
            "%," +
            Math.round(100 * this.l) +
            "%," +
            Math.round(this.a) +
            ")");
    };
    /**
     * Get the hue component of this HSL(A) color. This method just returns the `h` color attribute.
     *
     * @method hue
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    Color.prototype.hue = function () {
        return this.h;
    };
    /**
     * Get the saturation component of this HSL(A) color. This method just returns the `s` color attribute.
     *
     * @method saturation
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    Color.prototype.saturation = function () {
        return this.s;
    };
    /**
     * Get the lightness component of this HSL(A) color. This method just returns the `l` color attribute.
     *
     * @method lightness
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    Color.prototype.lightness = function () {
        return this.l;
    };
    // --- HEX ----------------------------------
    /**
     * Get this color as a CSS-HEX string (non-alpha): #rrggbb
     *
     * @method cssHEX
     * @instance
     * @memberof Color
     * @return {string} This color as a CSS-HEX string.
     */
    Color.prototype.cssHEX = function () {
        return ("#" +
            (255 * this.r < 16 ? "0" : "") +
            Math.round(255 * this.r).toString(16) +
            (255 * this.g < 16 ? "0" : "") +
            Math.round(255 * this.g).toString(16) +
            (255 * this.b < 16 ? "0" : "") +
            Math.round(255 * this.b).toString(16));
    };
    // --- Transparency ----------------------------------
    /**
     * Get the alpha channel (transparency) of this color.
     *
     * @method alpha
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    Color.prototype.alpha = function () {
        return this.a;
    };
    // --- Modifiers ----------------------------------
    //   saturate(v: string | number): Color {
    //     if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
    //       this.s += v / 100;
    //     } else if ("number" == typeof v) {
    //       // range 255
    //       this.s += v / 255;
    //     } else {
    //       throw new Error("error: bad modifier format (percent or number)");
    //     }
    //     if (this.s > 1) this.s = 1;
    //     else if (this.s < 0) this.s = 0;
    //     Color.Converter.HSLToRGB(this);
    //     return this;
    //   }
    Color.prototype.saturate = function (v) {
        if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
            this.s += (1 - this.s) * (v / 100);
        }
        else if ("number" == typeof v) {
            if (v >= -0.0 && v <= 1.0) {
                // range 255
                this.s += (1 - this.s) * v;
            }
            else {
                // range 0-1
                this.s += (1 - this.s) * (v / 255);
            }
        }
        else {
            throw new Error("error: bad modifier format (percent or number)");
        }
        if (this.s > 1)
            this.s = 1;
        else if (this.s < 0)
            this.s = 0;
        Color.Converter.HSLToRGB(this);
        return this;
    };
    Color.prototype.desaturate = function (v) {
        if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
            this.s -= v / 100;
        }
        else if ("number" == typeof v) {
            if (v >= 0.0 && v <= 1.0) {
                // range 255
                this.s -= this.s * v;
            }
            else {
                // range 0-1
                this.s -= this.s * (v / 255);
            }
        }
        else {
            throw new Error("error: bad modifier format (percent or number)");
        }
        if (this.s > 1)
            this.s = 1;
        else if (this.s < 0)
            this.s = 0;
        Color.Converter.HSLToRGB(this);
        return this;
    };
    //   lighten(v: string | number): Color {
    //     if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
    //       this.l += v / 100;
    //     } else if ("number" == typeof v) {
    //       if (v >= -1.0 && v <= 1.0) {
    //         // range 0.0...1.0
    //         this.l += v;
    //       } else {
    //         // range 255
    //         this.l += v / 255;
    //       }
    //     } else {
    //       throw new Error("error: bad modifier format (percent or number)");
    //     }
    //     if (this.l > 1) this.l = 1;
    //     else if (this.l < 0) this.l = 0;
    //     Color.Converter.HSLToRGB(this);
    //     return this;
    //   }
    Color.prototype.lighten = function (v) {
        if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
            this.l += (1 - this.l) * (v / 100);
        }
        else if ("number" == typeof v) {
            if (v >= 0.0 && v <= 1.0) {
                // range 0.0...1.0
                this.l += (1 - this.l) * v;
            }
            else {
                // range 255
                this.l += (1 - this.l) * (v / 255);
            }
        }
        else {
            throw new Error("error: bad modifier format (percent or number)");
        }
        if (this.l > 1)
            this.l = 1;
        else if (this.l < 0)
            this.l = 0;
        Color.Converter.HSLToRGB(this);
        return this;
    };
    Color.prototype.darken = function (v) {
        if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
            this.l -= this.l * (v / 100);
        }
        else if ("number" == typeof v) {
            if (v >= 0.0 && v <= 1.0) {
                // range 0.0...1.0
                this.l -= this.l * v;
            }
            else {
                // range 255
                this.l -= this.l * (v / 255);
            }
        }
        else {
            throw new Error("error: bad modifier format (percent or number)");
        }
        if (this.l > 1)
            this.l = 1;
        else if (this.l < 0)
            this.l = 0;
        Color.Converter.HSLToRGB(this);
        return this;
    };
    Color.prototype.fadein = function (v) {
        if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
            this.a += (1 - this.a) * (v / 100);
        }
        else if ("number" == typeof v) {
            if (v >= 0.0 && v <= 1.0) {
                // range 0-1
                this.a += (1 - this.a) * v;
            }
            else {
                // range 255
                this.a += (1 - this.a) * (v / 255);
            }
        }
        else {
            throw new Error("error: bad modifier format (percent or number)");
        }
        console.log("New alpha", this.a);
        if (this.a > 1)
            this.a = 1;
        else if (this.a < 0)
            this.a = 0;
        Color.Converter.HSLToRGB(this);
        return this;
    };
    Color.prototype.fadeout = function (v) {
        if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
            this.a -= v / 100;
        }
        else if ("number" == typeof v) {
            if (v >= 0.0 && v <= 1.0) {
                // range 0-1
                this.a -= v;
            }
            else {
                // range 255
                this.a -= v / 255;
            }
        }
        else {
            throw new Error("error: bad modifier format (percent or number)");
        }
        if (this.a > 1)
            this.a = 1;
        else if (this.a < 0)
            this.a = 0;
        Color.Converter.HSLToRGB(this);
        return this;
    };
    Color.prototype.spin = function (v) {
        if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN)
            this.h += v / 100;
        else if ("number" == typeof v)
            // range 360
            this.h += v / 360;
        else
            throw new Error("error: bad modifier format (percent or number)");
        if (this.h > 1)
            this.h = 1;
        else if (this.h < 0)
            this.h = 0;
        Color.Converter.HSLToRGB(this);
        return this;
    };
    Color.makeRGB = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var c = new Color();
        var sanitized;
        if (arguments.length < 3 || arguments.length > 4)
            throw new Error("error: 3 or 4 arguments");
        sanitized = Color.Sanitizer.RGB(arguments[0], arguments[1], arguments[2]);
        c.r = sanitized[0];
        c.g = sanitized[1];
        c.b = sanitized[2];
        if (arguments.length == 4) {
            c.a = arguments[3];
        }
        else {
            c.a = 1.0;
        }
        Color.Converter.RGBToHSL(c);
        return c;
    };
    Color.makeHSL = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var c = new Color();
        var sanitized;
        if (arguments.length < 3 || arguments.length > 4)
            throw new Error("error: 3 or 4 arguments");
        sanitized = Color.Sanitizer.HSL(arguments[0], arguments[1], arguments[2]);
        c.h = sanitized[0];
        c.s = sanitized[1];
        c.l = sanitized[2];
        if (arguments.length == 4)
            c.a = arguments[3];
        else
            c.a = 1.0;
        Color.Converter.HSLToRGB(c);
        return c;
    };
    Color.makeHEX = function (value) {
        var c = new Color(), sanitized;
        // Edit Ika 2018-0308
        // Allow leading '#'
        if (value && value.startsWith("#"))
            value = value.substr(1);
        Color.Validator.checkHEX(value);
        if (value.length == 3) {
            sanitized = Color.Sanitizer.RGB(parseInt(value.substr(0, 1) + value.substr(0, 1), 16), parseInt(value.substr(1, 1) + value.substr(1, 1), 16), parseInt(value.substr(2, 1) + value.substr(2, 1), 16));
        }
        else if (value.length == 6) {
            sanitized = Color.Sanitizer.RGB(parseInt(value.substr(0, 2), 16), parseInt(value.substr(2, 2), 16), parseInt(value.substr(4, 2), 16));
        }
        else
            throw new Error("error: 3 or 6 arguments");
        c.r = sanitized[0];
        c.g = sanitized[1];
        c.b = sanitized[2];
        c.a = 1.0; // TODO: Accept #xxxxxxxx (8 chars, too, for alpha)
        Color.Converter.RGBToHSL(c);
        return c;
    };
    /**
     * Parse the given color string. Currently only these formate are recognized: hex, rgb, rgba.
     *
     * @method parse
     * @static
     * @memberof Color
     * @param {string} str - The string representation to parse.
     * @return {Color} The color instance that's represented by the given string.
     */
    Color.parse = function (str) {
        if (typeof str == "undefined") {
            return null;
        }
        if ((str = str.trim().toLowerCase()).length == 0) {
            return null;
        }
        if (str.startsWith("#"))
            return Color.makeHEX(str.substring(1, str.length));
        if (str.startsWith("rgb")) {
            var parts = str.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,?\s*(\d*(?:\.\d+\s*)?)\)$/);
            if (!parts) {
                throw "Unrecognized color format (2): " + str;
            }
            // [ str, r, g, b, a|undefined ]
            //   console.log("parts", parts);
            if (parts.length <= 4 || typeof parts[4] == "undefined" || parts[4] == "") {
                return Color.makeRGB(parts[1], parts[2], parts[3]);
            }
            else {
                return Color.makeRGB(parts[1], parts[2], parts[3], Number(parts[4]));
            }
        }
        else {
            throw "Unrecognized color format (1): " + str;
        }
    };
    /**
     * Create a clone of this color (RGB).
     *
     * @method clone
     * @instance
     * @memberof Color
     * @return {Color} A clone of this color (in RGB mode).
     */
    Color.prototype.clone = function () {
        // return Color.makeRGB(this.r, this.g, this.b, this.a);
        var col = new Color();
        col.r = this.r;
        col.g = this.g;
        col.b = this.b;
        col.a = this.a;
        col.h = this.h;
        col.s = this.s;
        col.l = this.l;
        return col;
    };
    /**
     * Interpolate this color on the RGB scale.
     *
     * @method interpolate
     * @instance
     * @memberof Color
     * @param {Color} c - The color to interpolate to.
     * @param {number} t - An interpolation value between 0.0 and 1.0.
     * @return {Color} A clone of this color (in RGB mode).
     */
    Color.prototype.interpolate = function (c, t) {
        this.r += (c.r - this.r) * t;
        this.g += (c.g - this.g) * t;
        this.b += (c.b - this.b) * t;
        this.a += (c.a - this.a) * t;
        return this;
    };
    Color.Sanitizer = {
        RGB: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var o = [];
            if (arguments.length == 0) {
                return [];
            }
            // const allAreFrac = Color.testFrac( arguments );
            for (var i = 0; i < arguments.length; i++) {
                var c = arguments[i];
                if ("string" == typeof c && c.indexOf("%") > -1) {
                    if ((c = parseInt(c)) == NaN)
                        throw new Error("Bad format");
                    if (c < 0 || c > 100)
                        throw new Error("Bad format");
                    o[i] = c / 100;
                }
                else {
                    if ("string" == typeof c && (c = parseInt(c)) == NaN) {
                        throw new Error("Bad format");
                    }
                    if (c < 0) {
                        throw new Error("Bad format");
                    }
                    //else if( allAreFrac ) o[i] = c; // c >= 0 && c <= 1 (all)
                    else if (c >= 0 && c < 1) {
                        o[i] = c;
                    }
                    // else if(c >= 0.0 && c <= 1.0) o[i] = c;
                    else if (c >= 1 && c < 256) {
                        o[i] = c / 255;
                    }
                    // ???
                    // else if(c >= 0 && c < 256) o[i] = c/255;
                    else
                        throw new Error("Bad format (" + c + ")");
                }
            }
            return o;
        },
        HSL: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (arguments.length < 3 || arguments.length > 4)
                throw new Error("3 or 4 arguments required");
            var h = arguments[0], s = arguments[1], l = arguments[2];
            if ("string" == typeof h && (h = parseFloat(h)) == NaN)
                throw new Error("Bad format for hue");
            if (h < 0 || h > 360)
                throw new Error("Hue out of range (0..360)");
            else if ((("" + h).indexOf(".") > -1 && h > 1) || ("" + h).indexOf(".") == -1)
                h /= 360;
            if ("string" == typeof s && s.indexOf("%") > -1) {
                if ((s = parseInt(s)) == NaN)
                    throw new Error("Bad format for saturation");
                if (s < 0 || s > 100)
                    throw new Error("Bad format for saturation");
                s /= 100;
            }
            else if (s < 0 || s > 1)
                throw new Error("Bad format for saturation");
            if ("string" == typeof l && l.indexOf("%") > -1) {
                if ((l = parseInt(l)) == NaN)
                    throw new Error("Bad format for lightness");
                if (l < 0 || l > 100)
                    throw new Error("Bad format for lightness");
                l /= 100;
            }
            else if (l < 0 || l > 1)
                throw new Error("Bad format for lightness");
            return [h, s, l];
        }
    }; // ENd sanitizer
    Color.Validator = {
        /**
         * Check a hexa color (without #)
         */
        checkHEX: function (value) {
            if (value.length != 6 && value.length != 3)
                throw new Error("Hexa color: bad length (" + value.length + ")," + value);
            value = value.toLowerCase();
            //for( var i in value ) {
            for (var i = 0; i < value.length; i++) {
                var c = value.charCodeAt(i);
                if (!((c >= 48 && c <= 57) || (c >= 97 && c <= 102)))
                    throw new Error("Hexa color: out of range for \"" + value + "\" at position " + i + ".");
            }
        }
    };
    Color.Converter = {
        /**
         * Calculates HSL Color.
         * RGB must be normalized.
         * http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
         */
        RGBToHSL: function (color) {
            var r = color.r;
            var g = color.g;
            var b = color.b;
            var max = Math.max(r, g, b);
            var min = Math.min(r, g, b);
            color.l = (max + min) / 2;
            if (max == min) {
                color.h = color.s = 0; // achromatic
            }
            else {
                var d = max - min;
                color.s = color.l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r:
                        color.h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        color.h = (b - r) / d + 2;
                        break;
                    case b:
                        color.h = (r - g) / d + 4;
                        break;
                }
                color.h /= 6;
            }
        },
        /**
         * Calculates RGB color (nomalized).
         * HSL must be normalized.
         *
         * http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
         */
        HSLToRGB: function (color) {
            var h = color.h;
            var s = color.s;
            var l = color.l;
            if (s == 0) {
                color.r = color.g = color.b = l; // achromatic
            }
            else {
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                color.r = Color.Converter.hue2rgb(p, q, h + 1 / 3);
                color.g = Color.Converter.hue2rgb(p, q, h);
                color.b = Color.Converter.hue2rgb(p, q, h - 1 / 3);
            }
        },
        hue2rgb: function (p, q, t) {
            if (t < 0)
                t += 1;
            if (t > 1)
                t -= 1;
            if (t < 1 / 6)
                return p + (q - p) * 6 * t;
            if (t < 1 / 2)
                return q;
            if (t < 2 / 3)
                return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }
    };
    return Color;
}()); // END class
exports.Color = Color;
//# sourceMappingURL=Color.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/cjs/utils/io/FileDrop.js":
/*!*******************************************************************!*\
  !*** ./node_modules/plotboilerplate/src/cjs/utils/io/FileDrop.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports) => {


/**
 * A basic IO handler for file drop (Drag-and-drop).
 *
 * Example use:
 * ```javascript
 *  var body = document.getElememtByTagName("body")[0];
 *  var fileDrop = new FileDrop(body);
 *    fileDrop.onFileJSONDropped(function (jsonObject) {
 *    console.log("jsonObject", jsonObject);
 *  });
 * ```
 *
 * @author   Ikaros Kappler
 * @date     2021-10-13
 * @modified 2022-01-31 (ported from the ngdg project, then generalized)
 * @modified 2023-01-03 Fixing some minor type issues and adding SVG reading capabilities.
 * @version  2.1.0
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileDrop = void 0;
var FileDrop = /** @class */ (function () {
    /**
     *
     * @param {HTMLElement} element - The element you wish to operate as the drop zone (like <body/>).
     */
    function FileDrop(element) {
        var _this = this;
        /**
         * Internally handle a drop event.
         *
         * @param {DragEvent} event
         * @returns {void}
         */
        this.handleDropEvent = function (event) {
            event.preventDefault();
            event.stopPropagation();
            _this.element.style.opacity = "1.0";
            if (!event.dataTransfer || !event.dataTransfer.files || event.dataTransfer.files.length === 0) {
                // No files were dropped
                return;
            }
            if (event.dataTransfer.files.length > 1) {
                // Multiple file drop is not nupported
                return;
            }
            // if (!this.fileDroppedCallbackJSON) {
            //   // No handling callback defined.
            //   return;
            // }
            if (event.dataTransfer.files[0]) {
                var file_1 = event.dataTransfer.files[0];
                // console.log("file", file);
                if (file_1.type.match(/json.*/) && _this.fileDroppedCallbackJSON !== null) {
                    var reader = new FileReader();
                    reader.onload = function (readEvent) {
                        if (!readEvent.target) {
                            console.warn("Cannot process JSON ProgressEvent data: target is null.");
                            return;
                        }
                        // Finished reading file data.
                        var jsonObject = JSON.parse(readEvent.target.result);
                        // TODO: what happens on fail?
                        _this.fileDroppedCallbackJSON && _this.fileDroppedCallbackJSON(jsonObject);
                    };
                    reader.readAsText(file_1); // start reading the file data.
                }
                else if (file_1.type.match(/text\/plain.*/) && _this.fileDroppedCallbackText) {
                    var reader = new FileReader();
                    reader.onload = function (readEvent) {
                        if (!readEvent.target) {
                            console.warn("Cannot process Text ProgressEvent data: target is null.");
                            return;
                        }
                        // Finished reading file data.
                        _this.fileDroppedCallbackText && _this.fileDroppedCallbackText(readEvent.target.result);
                    };
                    reader.readAsText(file_1); // start reading the file data.
                }
                else if (_this.fileDroppedCallbackBinary) {
                    var reader = new FileReader();
                    reader.onload = function (readEvent) {
                        if (!readEvent.target) {
                            console.warn("Cannot process Binary ProgressEvent data: target is null.");
                            return;
                        }
                        // Finished reading file data.
                        _this.fileDroppedCallbackBinary &&
                            _this.fileDroppedCallbackBinary(new Blob([readEvent.target.result]), file_1);
                    };
                    reader.readAsBinaryString(file_1); // start reading the file data.
                }
                else if (_this.fileDroppedCallbackSVG) {
                    var reader = new FileReader();
                    reader.onload = function (readEvent) {
                        if (!readEvent.target) {
                            console.warn("Cannot process SVG ProgressEvent data: target is null.");
                            return;
                        }
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(readEvent.target.result, "image/svg+xml");
                        // Finished reading file data.
                        _this.fileDroppedCallbackSVG && _this.fileDroppedCallbackSVG(doc);
                    };
                    reader.readAsText(file_1); // start reading the file data.
                }
            }
        };
        /**
         * Toggles the drop sensitive element's opacity to 0.5.
         *
         * @param {DragEvent} event - The event.
         */
        this.handleDragOverEvent = function (event) {
            event.preventDefault();
            event.stopPropagation();
            _this.element.style.opacity = "0.5";
        };
        /**
         * Restored the drop sensitive element's opacity back to 1.0.
         *
         * @param {DragEvent} event - The event.
         */
        this.handleDragLeaveEvent = function (event) {
            event.preventDefault();
            event.stopPropagation();
            _this.element.style.opacity = "1.0";
        };
        this.element = element;
        // Init the drop listeners
        element.addEventListener("drop", this.handleDropEvent.bind(this));
        element.addEventListener("dragover", this.handleDragOverEvent.bind(this));
        element.addEventListener("dragleave", this.handleDragLeaveEvent.bind(this));
    }
    /**
     * Install the JSON (MIME type json*) file drop callback. Note than only one callback can be installed
     * in this implementation. Calling this method multiple times will overwrite previously
     * installed listeners.
     *
     * The callback will receive the dropped file content as an object (parsed JSON).
     *
     * @param {(data:object)=>void} callback
     */
    FileDrop.prototype.onFileJSONDropped = function (callback) {
        this.fileDroppedCallbackJSON = callback;
    };
    /**
     * Install the text file (MIME type text/plain) drop callback. Note than only one callback can be installed
     * in this implementation. Calling this method multiple times will overwrite previously
     * installed listeners.
     *
     * The callback will receive the dropped file content as a string.
     *
     * @param {(data:object)=>void} callback
     */
    FileDrop.prototype.onFileTextDropped = function (callback) {
        this.fileDroppedCallbackText = callback;
    };
    FileDrop.prototype.onFileSVGDropped = function (callback) {
        this.fileDroppedCallbackSVG = callback;
    };
    /**
     * Removes all listeners (drop, dragover and dragleave).
     */
    FileDrop.prototype.destroy = function () {
        this.element.removeEventListener("drop", this.handleDropEvent);
        this.element.removeEventListener("dragover", this.handleDragOverEvent);
        this.element.removeEventListener("dragleave", this.handleDragLeaveEvent);
    };
    return FileDrop;
}());
exports.FileDrop = FileDrop;
//# sourceMappingURL=FileDrop.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/BezierPath.js":
/*!************************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/BezierPath.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BezierPath: () => (/* binding */ BezierPath)
/* harmony export */ });
/* harmony import */ var _Bounds__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Bounds */ "./node_modules/plotboilerplate/src/esm/Bounds.js");
/* harmony import */ var _CubicBezierCurve__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CubicBezierCurve */ "./node_modules/plotboilerplate/src/esm/CubicBezierCurve.js");
/* harmony import */ var _UIDGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./UIDGenerator */ "./node_modules/plotboilerplate/src/esm/UIDGenerator.js");
/* harmony import */ var _Vertex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Vertex */ "./node_modules/plotboilerplate/src/esm/Vertex.js");
/**
 * @author Ikaros Kappler
 * @date 2013-08-19
 * @modified 2018-08-16 Added closure. Removed the 'IKRS' wrapper.
 * @modified 2018-11-20 Added circular auto-adjustment.
 * @modified 2018-11-25 Added the point constants to the BezierPath class itself.
 * @modified 2018-11-28 Added the locateCurveByStartPoint() function.
 * @modified 2018-12-04 Added the toSVGString() function.
 * @modified 2019-03-23 Added JSDoc tags.
 * @modified 2019-03-23 Changed the fuctions getPoint and getPointAt to match semantics in the Line class.
 * @modified 2019-11-18 Fixed the clone function: adjustCircular attribute was not cloned.
 * @modified 2019-12-02 Removed some excessive comments.
 * @modified 2019-12-04 Fixed the missing obtainHandleLengths behavior in the adjustNeightbourControlPoint function.
 * @modified 2020-02-06 Added function locateCurveByEndPoint( Vertex ).
 * @modified 2020-02-11 Added 'return this' to the scale(Vertex,number) and to the translate(Vertex) function.
 * @modified 2020-03-24 Ported this class from vanilla-JS to Typescript.
 * @modified 2020-06-03 Made the private helper function _locateUIndex to a private function.
 * @modified 2020-06-03 Added the getBounds() function.
 * @modified 2020-07-14 Changed the moveCurvePoint(...,Vertex) to moveCurvePoint(...,XYCoords).
 * @modified 2020-07-24 Added the getClosestT(Vertex) function.
 * @modified 2020-12-29 Constructor is now private (no explicit use intended).
 * @modified 2021-05-25 Added BezierPath.fromReducedList( Array<number> ).
 * @modified 2022-01-31 Added `BezierPath.getEvenDistributionVertices(number)`.
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2022-02-02 Cleared the `toSVGString` function (deprecated). Use `drawutilssvg` instead.
 * @version 2.5.0
 *
 * @file BezierPath
 * @public
 **/




/**
 * @classdesc A BezierPath class.
 *
 * This was refactored from an older project.
 *
 * @requires Bounds
 * @requires Vertex
 * @requires CubicBezierCurve
 * @requires XYCoords
 * @requires SVGSerializable
 * @requires UID
 * @requires UIDGenerator
 **/
class BezierPath {
    /**
     * The constructor.<br>
     * <br>
     * This constructor expects a sequence of path points and will approximate
     * the location of control points by picking some between the points.<br>
     * You should consider just constructing empty paths and then add more curves later using
     * the addCurve() function.
     *
     * @constructor
     * @name BezierPath
     * @param {Vertex[]} pathPoints - An array of path vertices (no control points).
     **/
    constructor(pathPoints) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "BezierPath";
        /** @constant {number} */
        this.START_POINT = 0;
        /** @constant {number} */
        this.START_CONTROL_POINT = 1;
        /** @constant {number} */
        this.END_CONTROL_POINT = 2;
        /** @constant {number} */
        this.END_POINT = 3;
        this.uid = _UIDGenerator__WEBPACK_IMPORTED_MODULE_2__.UIDGenerator.next();
        if (!pathPoints)
            pathPoints = [];
        this.totalArcLength = 0.0;
        // Set this flag to true if you want the first point and
        // last point of the path to be auto adjusted, too.
        this.adjustCircular = false;
        this.bezierCurves = [];
    }
    /**
     * Add a cubic bezier curve to the end of this path.
     *
     * @method addCurve
     * @param {CubicBezierCurve} curve - The curve to be added to the end of the path.
     * @instance
     * @memberof BezierPath
     * @return {void}
     **/
    addCurve(curve) {
        if (curve == null || typeof curve == "undefined")
            throw "Cannot add null curve to bézier path.";
        this.bezierCurves.push(curve);
        if (this.bezierCurves.length > 1) {
            curve.startPoint = this.bezierCurves[this.bezierCurves.length - 2].endPoint;
            this.adjustSuccessorControlPoint(this.bezierCurves.length - 2, // curveIndex,
            true, // obtainHandleLength,
            true // updateArcLengths
            );
        }
        else {
            this.totalArcLength += curve.getLength();
        }
    }
    /**
     * Locate the curve with the given start point (function returns the index).
     *
     * @method locateCurveByStartPoint
     * @param {Vertex} point - The (curve start-) point to look for.
     * @instance
     * @memberof BezierPath
     * @return {number} The curve index or -1 if curve (start-) point not found
     **/
    locateCurveByStartPoint(point) {
        // for( var i in this.bezierCurves ) {
        for (var i = 0; i < this.bezierCurves.length; i++) {
            if (this.bezierCurves[i].startPoint.equals(point))
                return i;
        }
        return -1;
    }
    /**
     * Locate the curve with the given end point (function returns the index).
     *
     * @method locateCurveByEndPoint
     * @param {Vertex} point - The (curve end-) point to look for.
     * @instance
     * @memberof BezierPath
     * @return {number} The curve index or -1 if curve (end-) point not found
     **/
    locateCurveByEndPoint(point) {
        // for( var i in this.bezierCurves ) {
        for (var i = 0; i < this.bezierCurves.length; i++) {
            if (this.bezierCurves[i].endPoint.equals(point))
                return i;
        }
        return -1;
    }
    /**
     * Locate the curve with the given start point (function returns the index).
     *
     * @method locateCurveByStartControlPoint
     * @param {Vertex} point - The (curve endt-) point to look for.
     * @instance
     * @memberof BezierPath
     * @return {number} The curve index or -1 if curve (end-) point not found
     **/
    locateCurveByStartControlPoint(point) {
        // for( var i in this.bezierCurves ) {
        for (var i = 0; i < this.bezierCurves.length; i++) {
            if (this.bezierCurves[i].startControlPoint.equals(point))
                return i;
        }
        return -1;
    }
    // +---------------------------------------------------------------------------------
    // | Locate the curve with the given end control point.
    // |
    // | @param point:Vertex The point to look for.
    // | @return Number The index or -1 if not found.
    // +-------------------------------
    locateCurveByEndControlPoint(point) {
        // for( var i in this.bezierCurves ) {
        for (var i = 0; i < this.bezierCurves.length; i++) {
            if (this.bezierCurves[i].endControlPoint.equals(point))
                return i;
        }
        return -1;
    }
    /**
     * Get the total length of this path.<br>
     * <br>
     * Note that the returned value comes from the curve buffer. Unregistered changes
     * to the curve points will result in invalid path length values.
     *
     * @method getLength
     * @instance
     * @memberof BezierPath
     * @return {number} The (buffered) length of the path.
     **/
    getLength() {
        return this.totalArcLength;
    }
    /**
     * This function is internally called whenever the curve or path configuration
     * changed. It updates the attribute that stores the path length information.<br>
     * <br>
     * If you perform any unregistered changes to the curve points you should call
     * this function afterwards to update the curve buffer. Not updating may
     * result in unexpected behavior.
     *
     * @method updateArcLengths
     * @instance
     * @memberof BezierPath
     * @return {void}
     **/
    updateArcLengths() {
        this.totalArcLength = 0.0;
        for (var i = 0; i < this.bezierCurves.length; i++) {
            this.bezierCurves[i].updateArcLengths();
            this.totalArcLength += this.bezierCurves[i].getLength();
        }
    }
    /**
     * Get the number of curves in this path.
     *
     * @method getCurveCount
     * @instance
     * @memberof BezierPath
     * @return {number} The number of curves in this path.
     **/
    getCurveCount() {
        return this.bezierCurves.length;
    }
    /**
     * Get the cubic bezier curve at the given index.
     *
     * @method getCurveAt
     * @param {number} index - The curve index from 0 to getCurveCount()-1.
     * @instance
     * @memberof BezierPath
     * @return {CubicBezierCurve} The curve at the specified index.
     **/
    getCurveAt(curveIndex) {
        return this.bezierCurves[curveIndex];
    }
    /**
     * Remove the end point of this path (which removes the last curve from this path).<br>
     * <br>
     * Please note that this function does never remove the first curve, thus the path
     * cannot be empty after this call.
     *
     * @method removeEndPoint
     * @instance
     * @memberof BezierPath
     * @return {boolean} Indicating if the last curve was removed.
     **/
    /*
      BezierPath.prototype.removeEndPoint = function() {
      if( this.bezierCurves.length <= 1 )
          return false;
      
      var newArray = [ this.bezierCurves.length-1 ];
      for( var i = 0; i < this.bezierCurves.length-1; i++ ) {
          newArray[i] = this.bezierCurves[i];
      }
      
      // Update arc length
      this.totalArcLength -= this.bezierCurves[ this.bezierCurves.length-1 ].getLength();
      this.bezierCurves = newArray;
      return true;
      }
      */
    /**
     * Remove the start point of this path (which removes the first curve from this path).<br>
     * <br>
     * Please note that this function does never remove the last curve, thus the path
     * cannot be empty after this call.<br>
     *
     * @method removeStartPoint
     * @instance
     * @memberof BezierPath
     * @return {boolean} Indicating if the first curve was removed.
     **/
    /*
      BezierPath.prototype.removeStartPoint = function() {
  
      if( this.bezierCurves.length <= 1 )
          return false;
  
      var newArray = [ this.bezierCurves.length-1 ];
      for( var i = 1; i < this.bezierCurves.length; i++ ) {
  
          newArray[i-1] = this.bezierCurves[i];
  
      }
      
      // Update arc length
      this.totalArcLength -= this.bezierCurves[ 0 ].getLength();
      this.bezierCurves = newArray;
      
      return true;
      }
      */
    /**
     * Removes a path point inside the path.
     *
     * This function joins the bezier curve at the given index with
     * its predecessor, which means that the start point at the given
     * curve index will be removed.
     *
     * @method joinAt
     * @param {number} curveIndex - The index of the curve to be joined with its predecessor.
     * @instance
     * @memberof BezierPath
     * @return {boolean} True if the passed index indicated an inner vertex and the two curves were joined.
     **/
    /*
      BezierPath.prototype.joinAt = function( curveIndex ) {
  
      if( curveIndex < 0 || curveIndex >= this.bezierCurves.length )
          return false;
      
      var leftCurve  = this.bezierCurves[ curveIndex-1 ];
      var rightCurve = this.bezierCurves[ curveIndex ];
  
      // Make the length of the new handle double that long
      var leftControlPoint = leftCurve.getStartControlPoint().clone();
      leftControlPoint.sub( leftCurve.getStartPoint() );
      leftControlPoint.multiplyScalar( 2.0 );
      leftControlPoint.add( leftCurve.getStartPoint() );
      
      var rightControlPoint = rightCurve.getEndControlPoint().clone();
      rightControlPoint.sub( rightCurve.getEndPoint() );
      rightControlPoint.multiplyScalar( 2.0 );
      rightControlPoint.add( rightCurve.getEndPoint() );
  
      var newCurve = new IKRS.CubicBezierCurve( leftCurve.getStartPoint(),
                            rightCurve.getEndPoint(),
                            leftControlPoint,
                            rightControlPoint
                          );
      // Place into array
      var newArray = [ this.bezierCurves.length - 1 ];
  
      for( var i = 0; i < curveIndex-1; i++ )
          newArray[ i ] = this.bezierCurves[i];
      
      newArray[ curveIndex-1 ] = newCurve;
      
      // Shift trailing curves left
      for( var i = curveIndex; i+1 < this.bezierCurves.length; i++ )
          newArray[ i ] = this.bezierCurves[ i+1 ];
          
      this.bezierCurves = newArray;
      this.updateArcLengths();
  
      return true;
      }
      */
    /**
     * Add a new inner curve point to the path.<br>
     * <br>
     * This function splits the bezier curve at the given index and given
     * curve segment index.
     *
     * @method splitAt
     * @param {number} curveIndex - The index of the curve to split.
     * @param {nunber} segmentIndex - The index of the curve segment where the split should be performed.
     * @instance
     * @memberof BezierPath
     * @return {boolean} True if the passed indices were valid and the path was split.
     **/
    /*
      BezierPath.prototype.splitAt = function( curveIndex,
                           segmentIndex
                         ) {
      // Must be a valid curve index
      if( curveIndex < 0 || curveIndex >= this.bezierCurves.length )
          return false;
  
      var oldCurve = this.bezierCurves[ curveIndex ];
  
      // Segment must be an INNER point!
      // (the outer points are already bezier end/start points!)
      if( segmentIndex < 1 || segmentIndex-1 >= oldCurve.segmentCache.length )
          return false;
  
      // Make room for a new curve
      for( var c = this.bezierCurves.length; c > curveIndex; c-- ) {
          // Move one position to the right
          this.bezierCurves[ c ] = this.bezierCurves[ c-1 ];
      }
  
      // Accumulate segment lengths
      var u = 0;
      for( var i = 0; i < segmentIndex; i++ )
          u += oldCurve.segmentLengths[i];
      //var tangent = oldCurve.getTangentAt( u );
      var tangent = oldCurve.getTangent( u );
      tangent = tangent.multiplyScalar( 0.25 );
  
      var leftEndControlPoint = oldCurve.segmentCache[ segmentIndex ].clone();
      leftEndControlPoint.sub( tangent );
      
      var rightStartControlPoint = oldCurve.segmentCache[ segmentIndex ].clone();
      rightStartControlPoint.add( tangent );
      
      // Make the old existing handles a quarter that long
      var leftStartControlPoint = oldCurve.getStartControlPoint().clone();
      // move to (0,0)
      leftStartControlPoint.sub( oldCurve.getStartPoint() );
      leftStartControlPoint.multiplyScalar( 0.25 );
      leftStartControlPoint.add( oldCurve.getStartPoint() );
  
      var rightEndControlPoint = oldCurve.getEndControlPoint().clone();
      // move to (0,0)
      rightEndControlPoint.sub( oldCurve.getEndPoint() );
      rightEndControlPoint.multiplyScalar( 0.25 );
      rightEndControlPoint.add( oldCurve.getEndPoint() );
  
      var newLeft  = new CubicBezierCurve( oldCurve.getStartPoint(),                      // old start point
                           oldCurve.segmentCache[ segmentIndex ],         // new end point
                           leftStartControlPoint,                         // old start control point
                           leftEndControlPoint                            // new end control point
                         );
      var newRight = new CubicBezierCurve( oldCurve.segmentCache[ segmentIndex ],         // new start point
                           oldCurve.getEndPoint(),                        // old end point
                           rightStartControlPoint,                        // new start control point
                           rightEndControlPoint                           // old end control point
                         );
      
      // Insert split curve(s) at free index
      this.bezierCurves[ curveIndex ]     = newLeft;
      this.bezierCurves[ curveIndex + 1 ] = newRight;
      
      // Update total arc length, even if there is only a very little change!
      this.totalArcLength -= oldCurve.getLength();
      this.totalArcLength += newLeft.getLength();
      this.totalArcLength += newRight.getLength();
  
      return true;
      };
      */
    /*
      insertVertexAt( t:number ) : void {
      console.log('Inserting vertex at', t );
      // Find the curve index
      var u : number = 0;
      var curveIndex : number = -1;
      var localT : number = 0.0;
      for( var i = 0; curveIndex == -1 && i < this.bezierCurves.length; i++ ) {
          
      }
      }; */
    /**
     * Move the whole bezier path by the given (x,y)-amount.
     *
     * @method translate
     * @param {Vertex} amount - The amount to be added (amount.x and amount.y)
     *                          to each vertex of the curve.
     * @instance
     * @memberof BezierPath
     * @return {BezierPath} this for chaining
     **/
    translate(amount) {
        for (var i = 0; i < this.bezierCurves.length; i++) {
            var curve = this.bezierCurves[i];
            curve.getStartPoint().add(amount);
            curve.getStartControlPoint().add(amount);
            curve.getEndControlPoint().add(amount);
        }
        // Don't forget to translate the last curve's last point
        var curve = this.bezierCurves[this.bezierCurves.length - 1];
        curve.getEndPoint().add(amount);
        this.updateArcLengths();
        return this;
    }
    /**
     * Scale the whole bezier path by the given uniform factor.
     *
     * @method scale
     * @param {Vertex} anchor - The scale origin to scale from.
     * @param {number} scaleFactor - The scalar to be multiplied with.
     * @instance
     * @memberof BezierPath
     * @return {BezierPath} this for chaining.
     **/
    scale(anchor, scaleFactor) {
        // var scaleFactors : XYCoords = { x : scaleFactor, y : scaleFactor };
        // for (var i = 0; i < this.bezierCurves.length; i++) {
        //   var curve = this.bezierCurves[i];
        //   curve.getStartPoint().scale(scaleFactor, anchor);
        //   curve.getStartControlPoint().scale(scaleFactor, anchor);
        //   curve.getEndControlPoint().scale(scaleFactor, anchor);
        //   // Do NOT scale the end point here!
        //   // Don't forget that the curves are connected and on curve's end point
        //   // the the successor's start point (same instance)!
        // }
        // // Finally move the last end point (was not scaled yet)
        // if (this.bezierCurves.length > 0 && !this.adjustCircular) {
        //   this.bezierCurves[this.bezierCurves.length - 1].getEndPoint().scale(scaleFactor, anchor);
        // }
        // this.updateArcLengths();
        // return this;
        return this.scaleXY({ x: scaleFactor, y: scaleFactor }, anchor);
    }
    /**
     * Scale the whole bezier path by the given (x,y)-factors.
     *
     * @method scale
     * @param {Vertex} anchor - The scale origin to scale from.
     * @param {number} amount - The scalar to be multiplied with.
     * @instance
     * @memberof BezierPath
     * @return {BezierPath} this for chaining.
     **/
    scaleXY(scaleFactors, anchor) {
        for (var i = 0; i < this.bezierCurves.length; i++) {
            var curve = this.bezierCurves[i];
            curve.getStartPoint().scaleXY(scaleFactors, anchor);
            curve.getStartControlPoint().scaleXY(scaleFactors, anchor);
            curve.getEndControlPoint().scaleXY(scaleFactors, anchor);
            // Do NOT scale the end point here!
            // Don't forget that the curves are connected and on curve's end point
            // the the successor's start point (same instance)!
        }
        // Finally move the last end point (was not scaled yet)
        if (this.bezierCurves.length > 0 && !this.adjustCircular) {
            this.bezierCurves[this.bezierCurves.length - 1].getEndPoint().scaleXY(scaleFactors, anchor);
        }
        this.updateArcLengths();
        return this;
    }
    /**
     * Rotate the whole bezier path around a point..
     *
     * @method rotate
     * @param {Vertex} angle  - The angle to rotate this path by.
     * @param {Vertex} center - The rotation center.
     * @instance
     * @memberof BezierPath
     * @return {void}
     **/
    rotate(angle, center) {
        for (var i = 0; i < this.bezierCurves.length; i++) {
            var curve = this.bezierCurves[i];
            curve.getStartPoint().rotate(angle, center);
            curve.getStartControlPoint().rotate(angle, center);
            curve.getEndControlPoint().rotate(angle, center);
            // Do NOT rotate the end point here!
            // Don't forget that the curves are connected and on curve's end point
            // the the successor's start point (same instance)!
        }
        // Finally move the last end point (was not scaled yet)
        if (this.bezierCurves.length > 0 && !this.adjustCircular) {
            this.bezierCurves[this.bezierCurves.length - 1].getEndPoint().rotate(angle, center);
        }
    }
    /**
     * Get the 't' position on this curve with the minimal distance to point p.
     *
     * @param {Vertex} p - The point to find the closest curve point for.
     * @return {number} A value t with 0.0 <= t <= 1.0.
     **/
    getClosestT(p) {
        // Find the spline to extract the value from
        var minIndex = -1;
        var minDist = 0.0;
        var dist = 0.0;
        var curveT = 0.0;
        var uMin = 0.0;
        var u = 0.0;
        for (var i = 0; i < this.bezierCurves.length; i++) {
            curveT = this.bezierCurves[i].getClosestT(p);
            dist = this.bezierCurves[i].getPointAt(curveT).distance(p);
            if (minIndex == -1 || dist < minDist) {
                minIndex = i;
                minDist = dist;
                uMin = u + curveT * this.bezierCurves[i].getLength();
            }
            u += this.bezierCurves[i].getLength();
        }
        return Math.max(0.0, Math.min(1.0, uMin / this.totalArcLength));
    }
    /**
     * Get the point on the bézier path at the given relative path location.
     *
     * @method getPoint
     * @param {number} u - The relative path position: <pre>0 <= u <= this.getLength()</pre>
     * @instance
     * @memberof BezierPath
     * @return {Vertex} The point at the relative path position.
     **/
    getPoint(u) {
        if (u < 0 || u > this.totalArcLength) {
            console.warn("[BezierPath.getPoint(u)] u is out of bounds: " + u + ".");
            u = Math.min(this.totalArcLength, Math.max(u, 0));
        }
        // Find the spline to extract the value from
        var i = 0;
        var uTemp = 0.0;
        while (i < this.bezierCurves.length && uTemp + this.bezierCurves[i].getLength() < u) {
            uTemp += this.bezierCurves[i].getLength();
            i++;
        }
        // if u == arcLength
        //   -> i is max
        if (i >= this.bezierCurves.length)
            return this.bezierCurves[this.bezierCurves.length - 1].getEndPoint().clone();
        var bCurve = this.bezierCurves[i];
        var relativeU = u - uTemp;
        return bCurve.getPoint(relativeU);
    }
    /**
     * Get the point on the bézier path at the given path fraction.
     *
     * @method getPointAt
     * @param {number} t - The absolute path position: <pre>0.0 <= t <= 1.0</pre>
     * @instance
     * @memberof BezierPath
     * @return {Vertex} The point at the absolute path position.
     **/
    getPointAt(t) {
        return this.getPoint(t * this.totalArcLength);
    }
    /**
     * Get the tangent of the bézier path at the given path fraction.<br>
     * <br>
     * Note that the returned vector is not normalized.
     *
     * @method getTangentAt
     * @param {number} t - The absolute path position: <pre>0.0 <= t <= 1.0</pre>
     * @instance
     * @memberof BezierPath
     * @return {Vertex} The tangent vector at the absolute path position.
     **/
    getTangentAt(t) {
        return this.getTangent(t * this.totalArcLength);
    }
    /**
     *  Get the tangent of the bézier path at the given path location.<br>
     * <br>
     * Note that the returned vector is not normalized.
     *
     * @method getTangent
     * @param {number} u - The relative path position: <pre>0 <= u <= getLength()</pre>
     * @instance
     * @memberof BezierPath
     * @return {Vertex} The tangent vector at the relative path position.
     **/
    getTangent(u) {
        if (u < 0 || u > this.totalArcLength) {
            console.warn("[BezierPath.getTangent(u)] u is out of bounds: " + u + ".");
            // return undefined;
            u = Math.min(this.totalArcLength, Math.max(0, u));
        }
        // Find the spline to extract the value from
        var i = 0;
        var uTemp = 0.0;
        while (i < this.bezierCurves.length && uTemp + this.bezierCurves[i].getLength() < u) {
            uTemp += this.bezierCurves[i].getLength();
            i++;
        }
        var bCurve = this.bezierCurves[i];
        var relativeU = u - uTemp;
        return bCurve.getTangent(relativeU);
    }
    /**
     * Get the perpendicular of the bézier path at the given absolute path location (fraction).<br>
     * <br>
     * Note that the returned vector is not normalized.
     *
     * @method getPerpendicularAt
     * @param {number} t - The absolute path position: <pre>0.0 <= t <= 1.0</pre>
     * @instance
     * @memberof BezierPath
     * @return {Vertex} The perpendicluar vector at the absolute path position.
     **/
    getPerpendicularAt(t) {
        return this.getPerpendicular(t * this.totalArcLength);
    }
    /**
     * Get the perpendicular of the bézier path at the given relative path location.<br>
     * <br>
     * Note that the returned vector is not normalized.
     *
     * @method getPerpendicular
     * @param {number} u - The relative path position: <pre>0 <= u <= getLength()</pre>
     * @instance
     * @memberof BezierPath
     * @return {Vertex} The perpendicluar vector at the relative path position.
     **/
    getPerpendicular(u) {
        if (u < 0 || u > this.totalArcLength) {
            console.log("[BezierPath.getPerpendicular(u)] u is out of bounds: " + u + ".");
            u = Math.min(this.totalArcLength, Math.max(0, u));
        }
        // Find the spline to extract the value from
        var uResult = BezierPath._locateUIndex(this, u);
        var bCurve = this.bezierCurves[uResult.i];
        var relativeU = u - uResult.uPart;
        return bCurve.getPerpendicular(relativeU);
    }
    /**
     * This is a helper function to locate the curve index for a given
     * absolute path position u.
     *
     * I decided to put this into privat scope as it is really specific. Maybe
     * put this into a utils wrapper.
     *
     * Returns:
     * - {number} i - the index of the containing curve.
     * - {number} uPart - the absolute curve length sum (length from the beginning to u, should equal u itself).
     * - {number} uBefore - the absolute curve length for all segments _before_ the matched curve (usually uBefore <= uPart).
     **/
    static _locateUIndex(path, u) {
        var i = 0;
        var uTemp = 0.0;
        var uBefore = 0.0;
        while (i < path.bezierCurves.length && uTemp + path.bezierCurves[i].getLength() < u) {
            uTemp += path.bezierCurves[i].getLength();
            if (i + 1 < path.bezierCurves.length)
                uBefore += path.bezierCurves[i].getLength();
            i++;
        }
        return { i: i, uPart: uTemp, uBefore: uBefore };
    }
    /**
     * Get a specific sub path from this path. The start and end position are specified by
     * ratio number in [0..1].
     *
     * 0.0 is at the beginning of the path.
     * 1.0 is at the end of the path.
     *
     * Values below 0 or beyond 1 are cropped down to the [0..1] interval.
     *
     * startT > endT is allowed, the returned sub path will have inverse direction then.
     *
     * @method getSubPathAt
     * @param {number} startT - The start position of the sub path.
     * @param {number} endT - The end position of the sub path.
     * @instance
     * @memberof BezierPath
     * @return {BezierPath} The desired sub path in the bounds [startT..endT].
     **/
    getSubPathAt(startT, endT) {
        startT = Math.max(0, startT);
        endT = Math.min(1.0, endT);
        let startU = startT * this.totalArcLength;
        let endU = endT * this.totalArcLength;
        var uStartResult = BezierPath._locateUIndex(this, startU); // { i:int, uPart:float, uBefore:float }
        var uEndResult = BezierPath._locateUIndex(this, endU); // { i:int, uPart:float, uBefore:float }
        var firstT = (startU - uStartResult.uBefore) / this.bezierCurves[uStartResult.i].getLength();
        if (uStartResult.i == uEndResult.i) {
            // Subpath begins and ends in the same path segment (just get a simple sub curve from that path element).
            var lastT = (endU - uEndResult.uBefore) / this.bezierCurves[uEndResult.i].getLength();
            var firstCurve = this.bezierCurves[uStartResult.i].getSubCurveAt(firstT, lastT);
            return BezierPath.fromArray([firstCurve]);
        }
        else {
            var curves = [];
            if (uStartResult.i > uEndResult.i) {
                // Back to front direction
                var firstCurve = this.bezierCurves[uStartResult.i].getSubCurveAt(firstT, 0.0);
                curves.push(firstCurve);
                for (var i = uStartResult.i - 1; i > uEndResult.i; i--) {
                    curves.push(this.bezierCurves[i].clone().reverse());
                }
                var lastT = (endU - uEndResult.uBefore) / this.bezierCurves[uEndResult.i].getLength();
                curves.push(this.bezierCurves[uEndResult.i].getSubCurveAt(1.0, lastT));
            }
            else {
                // Front to back direction
                var firstCurve = this.bezierCurves[uStartResult.i].getSubCurveAt(firstT, 1.0);
                curves.push(firstCurve);
                for (var i = uStartResult.i + 1; i < uEndResult.i && i < this.bezierCurves.length; i++) {
                    curves.push(this.bezierCurves[i].clone());
                }
                var lastT = (endU - uEndResult.uBefore) / this.bezierCurves[uEndResult.i].getLength();
                curves.push(this.bezierCurves[uEndResult.i].getSubCurveAt(0, lastT));
            }
            return BezierPath.fromArray(curves);
        }
    }
    /**
     * This function moves the addressed curve point (or control point) with
     * keeping up the path's curve integrity.<br>
     * <br>
     * Thus is done by moving neighbour- and control- points as needed.
     *
     * @method moveCurvePoint
     * @param {number} curveIndex - The curve index to move a point from.
     * @param {number} pointID - One of the curve's four point IDs (START_POINT,
     *                           START_CONTROL_POINT, END_CONTRO_POINT or END_POINT).
     * @param {XYCoords} moveAmount - The amount to move the addressed vertex by.
     * @instance
     * @memberof BezierPath
     * @return {void}
     **/
    moveCurvePoint(curveIndex, pointID, moveAmount) {
        var bCurve = this.getCurveAt(curveIndex);
        bCurve.moveCurvePoint(pointID, moveAmount, true, // move control point, too
        true // updateArcLengths
        );
        // If inner point and NOT control point
        //  --> move neightbour
        if (pointID == this.START_POINT && (curveIndex > 0 || this.adjustCircular)) {
            // Set predecessor's control point!
            var predecessor = this.getCurveAt(curveIndex - 1 < 0 ? this.bezierCurves.length + (curveIndex - 1) : curveIndex - 1);
            predecessor.moveCurvePoint(this.END_CONTROL_POINT, moveAmount, true, // move control point, too
            false // updateArcLengths
            );
        }
        else if (pointID == this.END_POINT && (curveIndex + 1 < this.bezierCurves.length || this.adjustCircular)) {
            // Set successcor
            var successor = this.getCurveAt((curveIndex + 1) % this.bezierCurves.length);
            successor.moveCurvePoint(this.START_CONTROL_POINT, moveAmount, true, // move control point, too
            false // updateArcLengths
            );
        }
        else if (pointID == this.START_CONTROL_POINT && curveIndex > 0) {
            this.adjustPredecessorControlPoint(curveIndex, true, // obtain handle length?
            false // update arc lengths
            );
        }
        else if (pointID == this.END_CONTROL_POINT && curveIndex + 1 < this.getCurveCount()) {
            this.adjustSuccessorControlPoint(curveIndex, true, // obtain handle length?
            false // update arc lengths
            );
        }
        // Don't forget to update the arc lengths!
        // Note: this can be optimized as only two curves have changed their lengths!
        this.updateArcLengths();
    }
    /**
     * This helper function adjusts the given point's predecessor's control point.
     *
     * @method adjustPredecessorControlPoint
     * @param {number} curveIndex - The curve index to move a point from.
     * @param {boolean} obtainHandleLength - Moves the point with keeping the original handle length.
     * @param {boolean} updateArcLength - The amount to move the addressed vertex by.
     * @instance
     * @private
     * @memberof BezierPath
     * @return {void}
     **/
    adjustPredecessorControlPoint(curveIndex, obtainHandleLength, updateArcLengths) {
        if (!this.adjustCircular && curveIndex <= 0)
            return; // false;
        var mainCurve = this.getCurveAt(curveIndex);
        var neighbourCurve = this.getCurveAt(curveIndex - 1 < 0 ? this.getCurveCount() + (curveIndex - 1) : curveIndex - 1);
        BezierPath.adjustNeighbourControlPoint(mainCurve, neighbourCurve, mainCurve.getStartPoint(), // the reference point
        mainCurve.getStartControlPoint(), // the dragged control point
        neighbourCurve.getEndPoint(), // the neighbour's point
        neighbourCurve.getEndControlPoint(), // the neighbour's control point to adjust
        obtainHandleLength, updateArcLengths);
    }
    /**
     * This helper function adjusts the given point's successor's control point.
     *
     * @method adjustSuccessorControlPoint
     * @param {number} curveIndex - The curve index to move a point from.
     * @param {boolean} obtainHandleLength - Moves the point with keeping the original handle length.
     * @param {boolean} updateArcLength - The amount to move the addressed vertex by.
     * @instance
     * @private
     * @memberof BezierPath
     * @return {void}
     **/
    adjustSuccessorControlPoint(curveIndex, obtainHandleLength, updateArcLengths) {
        if (!this.adjustCircular && curveIndex + 1 > this.getCurveCount())
            return; //  false;
        var mainCurve = this.getCurveAt(curveIndex);
        var neighbourCurve = this.getCurveAt((curveIndex + 1) % this.getCurveCount());
        /* return */ BezierPath.adjustNeighbourControlPoint(mainCurve, neighbourCurve, mainCurve.getEndPoint(), // the reference point
        mainCurve.getEndControlPoint(), // the dragged control point
        neighbourCurve.getStartPoint(), // the neighbour's point
        neighbourCurve.getStartControlPoint(), // the neighbour's control point to adjust
        obtainHandleLength, updateArcLengths);
    }
    /**
     * This helper function adjusts the given point's successor's control point.
     *
     * @method adjustNeighbourControlPoint
     * @param {CubicBezierCurve} mainCurve
     * @param {CubicBezierCurve} neighbourCurve
     * @param {Vertex} mainPoint
     * @param {Vertex} mainControlPoint
     * @param {Vertex} neighbourPoint
     * @param {Vertex} neighbourControlPoint
     * @param {boolean} obtainHandleLengths
     * @param {boolean} updateArcLengths
     * @instance
     * @private
     * @memberof BezierPath
     * @return {void}
     **/
    static adjustNeighbourControlPoint(_mainCurve, // TODO: remove param
    neighbourCurve, mainPoint, mainControlPoint, neighbourPoint, neighbourControlPoint, obtainHandleLengths, _updateArcLengths // TODO: remove param
    ) {
        // Calculate start handle length
        var mainHandleBounds = new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex(mainControlPoint.x - mainPoint.x, mainControlPoint.y - mainPoint.y);
        var neighbourHandleBounds = new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex(neighbourControlPoint.x - neighbourPoint.x, neighbourControlPoint.y - neighbourPoint.y);
        var mainHandleLength = Math.sqrt(Math.pow(mainHandleBounds.x, 2) + Math.pow(mainHandleBounds.y, 2));
        var neighbourHandleLength = Math.sqrt(Math.pow(neighbourHandleBounds.x, 2) + Math.pow(neighbourHandleBounds.y, 2));
        if (mainHandleLength <= 0.1)
            return; // no secure length available for division? What about zoom? Use EPSILON?
        // Just invert the main handle (keep length or not?
        if (obtainHandleLengths) {
            neighbourControlPoint.set(neighbourPoint.x - mainHandleBounds.x * (neighbourHandleLength / mainHandleLength), neighbourPoint.y - mainHandleBounds.y * (neighbourHandleLength / mainHandleLength));
        }
        else {
            neighbourControlPoint.set(neighbourPoint.x - mainHandleBounds.x, neighbourPoint.y - mainHandleBounds.y);
        }
        neighbourCurve.updateArcLengths();
    }
    /**
     * Get the bounds of this Bézier path.
     *
     * Note the the curves' underlyung segment buffers are used to determine the bounds. The more
     * elements the segment buffers have, the more precise the returned bounds will be.
     *
     * @return {Bounds} The bounds of this Bézier path.
     **/
    getBounds() {
        const min = new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
        const max = new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
        var b;
        for (var i = 0; i < this.bezierCurves.length; i++) {
            b = this.bezierCurves[i].getBounds();
            min.x = Math.min(min.x, b.min.x);
            min.y = Math.min(min.y, b.min.y);
            max.x = Math.max(max.x, b.max.x);
            max.y = Math.max(max.y, b.max.y);
        }
        return new _Bounds__WEBPACK_IMPORTED_MODULE_0__.Bounds(min, max);
    }
    /**
     * Get n 'equally' distributed vertices along this Bézier path.
     *
     * As the changing curvature of the B slines makes prediction of distances difficult, the
     * returned vertices' distances are only relatively equal:
     *  - the distance grows where curvature is large.
     *  - the distance shrinks where curvature is small.
     *
     * Only the distance mean of all consecutive is 1/n-th of the total arc length.
     *
     * Usually this approximation is good enough for most use cases.
     *
     * @param {number} pointCount - (must be at least 2) The number of desired points (start and end point included).
     * @return {Array<Vertex>}
     */
    getEvenDistributionVertices(pointCount) {
        if (pointCount < 2) {
            throw new Error("pointCount must be larger than one; is " + pointCount + ".");
        }
        const result = [];
        if (this.bezierCurves.length === 0) {
            return result;
        }
        // Fetch and add the start point from the source polygon
        var polygonPoint = new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex(this.bezierCurves[0].startPoint);
        result.push(polygonPoint);
        // if (this.bezierCurves.length === 1) {
        //   return result;
        // }
        const perimeter = this.totalArcLength;
        const stepSize = perimeter / (pointCount - 1);
        const n = this.bezierCurves.length;
        let curveIndex = 0;
        let segmentLength = this.bezierCurves[0].arcLength;
        let curSegmentU = stepSize;
        let i = 1;
        while (i < pointCount && curveIndex < n) {
            // Check if next eq point is inside this segment
            if (curSegmentU < segmentLength) {
                var newPoint = this.bezierCurves[curveIndex].getPoint(curSegmentU);
                result.push(newPoint);
                curSegmentU += stepSize;
                i++;
            }
            else {
                curveIndex++;
                curSegmentU = curSegmentU - segmentLength;
                segmentLength = curveIndex < n ? this.bezierCurves[curveIndex].arcLength : 0;
            }
        }
        result.push(new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex(this.bezierCurves[n - 1].endPoint));
        return result;
    }
    /**
     * Clone this BezierPath (deep clone).
     *
     * @method clone
     * @instance
     * @memberof BezierPath
     * @return {BezierPath}
     **/
    clone() {
        var path = new BezierPath(undefined);
        for (var i = 0; i < this.bezierCurves.length; i++) {
            path.bezierCurves.push(this.bezierCurves[i].clone());
            // Connect splines
            if (i > 0)
                path.bezierCurves[i - 1].endPoint = path.bezierCurves[i].startPoint;
        }
        path.updateArcLengths();
        path.adjustCircular = this.adjustCircular;
        return path;
    }
    /**
     * Compare this and the passed Bézier path.
     *
     * @method equals
     * @param {BezierPath} path - The pass to compare with.
     * @instance
     * @memberof BezierPath
     * @return {boolean}
     **/
    equals(path) {
        if (!path)
            return false;
        // Check if path contains the credentials
        if (!path.bezierCurves)
            return false;
        if (typeof path.bezierCurves.length == "undefined")
            return false;
        if (path.bezierCurves.length != this.bezierCurves.length)
            return false;
        for (var i = 0; i < this.bezierCurves.length; i++) {
            if (!this.bezierCurves[i].equals(path.bezierCurves[i]))
                return false;
        }
        return true;
    }
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    destroy() {
        for (var i = 0; i < this.bezierCurves.length; i++) {
            this.bezierCurves[i].destroy();
        }
        this.isDestroyed = true;
    }
    /**
     * Create a JSON string representation of this bézier curve.
     *
     * @method toJSON
     * @param {boolean} prettyFormat - If true then the function will add line breaks.
     * @instance
     * @memberof BezierPath
     * @return {string} The JSON string.
     **/
    toJSON(prettyFormat) {
        var buffer = [];
        buffer.push("["); // array begin
        for (var i = 0; i < this.bezierCurves.length; i++) {
            if (i > 0)
                buffer.push(",");
            if (prettyFormat)
                buffer.push("\n\t");
            else
                buffer.push(" ");
            buffer.push(this.bezierCurves[i].toJSON(prettyFormat));
        }
        if (this.bezierCurves.length != 0)
            buffer.push(" ");
        buffer.push("]"); // array end
        return buffer.join(""); // Convert to string, with empty separator.
    }
    /**
     * Parse a BezierPath from the given JSON string.
     *
     * @method fromJSON
     * @param {string} jsonString - The string with the JSON data.
     * @throw An error if the string is not JSON or does not contain a bezier path object.
     * @static
     * @memberof BezierPath
     * @return {BezierPath} The parsed bezier path instance.
     **/
    static fromJSON(jsonString) {
        var obj = JSON.parse(jsonString);
        return BezierPath.fromArray(obj);
    }
    /**
     * Create a BezierPath instance from the given array.
     *
     * @method fromArray
     * @param {Vertex[][]} arr - A two-dimensional array containing the bezier path vertices.
     * @throw An error if the array does not contain proper bezier path data.
     * @static
     * @memberof BezierPath
     * @return {BezierPath} The bezier path instance retrieved from the array data.
     **/
    static fromArray(obj) {
        if (!Array.isArray(obj))
            throw "[BezierPath.fromArray] Passed object must be an array.";
        const arr = obj; // FORCE?
        if (arr.length < 1)
            throw "[BezierPath.fromArray] Passed array must contain at least one bezier curve (has " + arr.length + ").";
        // Create an empty bezier path
        var bPath = new BezierPath(undefined);
        var lastCurve = null;
        for (var i = 0; i < arr.length; i++) {
            // Convert object (or array?) to bezier curve
            var bCurve;
            if (_CubicBezierCurve__WEBPACK_IMPORTED_MODULE_1__.CubicBezierCurve.isInstance(arr[i])) {
                bCurve = arr[i].clone();
            }
            else if (0 in arr[i] && 1 in arr[i] && 2 in arr[i] && 3 in arr[i]) {
                if (!arr[i][0] || !arr[i][1] || !arr[i][2] || !arr[i][3])
                    throw "Cannot convert path data to BezierPath instance. At least one element is undefined (index=" + i + "): " + arr[i];
                bCurve = _CubicBezierCurve__WEBPACK_IMPORTED_MODULE_1__.CubicBezierCurve.fromArray(arr[i]);
            }
            else {
                bCurve = _CubicBezierCurve__WEBPACK_IMPORTED_MODULE_1__.CubicBezierCurve.fromObject(arr[i]);
            }
            // Set curve start point?
            // (avoid duplicate point instances!)
            if (lastCurve)
                bCurve.startPoint = lastCurve.endPoint;
            // Add to path's internal list
            bPath.bezierCurves.push(bCurve);
            // bPath.totalArcLength += bCurve.getLength();
            lastCurve = bCurve;
        }
        bPath.updateArcLengths();
        // Bezier segments added. Done
        return bPath;
    }
    /**
     * This function converts the bezier path into a string containing
     * integer values only.
     * The points' float values are rounded to 1 digit after the comma.
     *
     * The returned string represents a JSON array (with leading '[' and
     * trailing ']', the separator is ',').
     *
     * @method toReducedListRepresentation
     * @param {number} digits - The number of digits to be used after the comma '.'.
     * @instance
     * @memberof BezierPath
     * @return {string} The reduced list representation of this path.
     **/
    toReducedListRepresentation(digits) {
        if (typeof digits == "undefined")
            digits = 1;
        var buffer = [];
        buffer.push("["); // array begin
        for (var i = 0; i < this.bezierCurves.length; i++) {
            var curve = this.bezierCurves[i];
            buffer.push(curve.getStartPoint().x.toFixed(digits));
            buffer.push(",");
            buffer.push(curve.getStartPoint().y.toFixed(digits));
            buffer.push(",");
            buffer.push(curve.getStartControlPoint().x.toFixed(digits));
            buffer.push(",");
            buffer.push(curve.getStartControlPoint().y.toFixed(digits));
            buffer.push(",");
            buffer.push(curve.getEndControlPoint().x.toFixed(digits));
            buffer.push(",");
            buffer.push(curve.getEndControlPoint().y.toFixed(digits));
            buffer.push(",");
        }
        if (this.bezierCurves.length != 0) {
            var curve = this.bezierCurves[this.bezierCurves.length - 1];
            buffer.push(curve.getEndPoint().x.toFixed(digits));
            buffer.push(",");
            buffer.push(curve.getEndPoint().y.toFixed(digits));
        }
        buffer.push("]"); // array end
        return buffer.join(""); // Convert to string, with empty separator.
    }
    /**
     * Parse a BezierPath instance from the reduced list representation.<br>
     * <br>
     * The passed string must represent a JSON array containing numbers only.
     *
     * @method fromReducedListRepresentation
     * @param {string} listJSON - The number of digits to be used after the floating point.
     * @throw An error if the string is malformed.
     * @instance
     * @memberof BezierPath
     * @return {BezierPath} The bezier path instance retrieved from the string.
     **/
    static fromReducedListRepresentation(listJSON, adjustCircular) {
        // Parse the array
        var pointArray = JSON.parse(listJSON);
        if (!pointArray.length) {
            console.log("Cannot parse bezier path from non-array object nor from empty point list.");
            throw "Cannot parse bezier path from non-array object nor from empty point list.";
        }
        if (pointArray.length < 8) {
            console.log("Cannot build bezier path. The passed array must contain at least 8 elements (numbers).");
            throw "Cannot build bezier path. The passed array must contain at least 8 elements (numbers).";
        }
        return BezierPath.fromReducedList(pointArray, adjustCircular);
    }
    /**
     * Convert a reduced list representation (array of numeric coordinates) to a BezierPath instance.
     *
     * The array's length must be 6*n + 2:
     *  - [sx, sy,  scx, scy,  ecx, ecy, ... , ex,  ey ]
     *     |                               |   |     |
     *     +--- sequence of curves --------+   +-end-+
     *
     * @param {number[]} pointArray
     * @returns BezierPath
     */
    static fromReducedList(pointArray, adjustCircular) {
        // Convert to object
        var bezierPath = new BezierPath(null); // No points yet
        var startPoint = new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex();
        var startControlPoint;
        var endControlPoint;
        var endPoint;
        var i = 0;
        do {
            if (i == 0) {
                // firstStartPoint =
                startPoint = new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex(pointArray[i], pointArray[i + 1]);
            }
            startControlPoint = new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex(pointArray[i + 2], pointArray[i + 3]);
            endControlPoint = new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex(pointArray[i + 4], pointArray[i + 5]);
            // if (i + 8 >= pointArray.length) {
            //   endPoint = firstStartPoint;
            // } else {
            endPoint = new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex(pointArray[i + 6], pointArray[i + 7]);
            // }
            var bCurve = new _CubicBezierCurve__WEBPACK_IMPORTED_MODULE_1__.CubicBezierCurve(startPoint, endPoint, startControlPoint, endControlPoint);
            bezierPath.bezierCurves.push(bCurve);
            startPoint = endPoint;
            i += 6;
        } while (i + 2 < pointArray.length);
        bezierPath.adjustCircular = adjustCircular !== null && adjustCircular !== void 0 ? adjustCircular : false;
        if (adjustCircular) {
            bezierPath.bezierCurves[bezierPath.bezierCurves.length - 1].endPoint = bezierPath.bezierCurves[0].startPoint;
        }
        bezierPath.updateArcLengths();
        return bezierPath;
    }
}
// +---------------------------------------------------------------------------------
// | These constants equal the values from CubicBezierCurve.
// +-------------------------------
/** @constant {number} */
BezierPath.START_POINT = 0;
/** @constant {number} */
BezierPath.START_CONTROL_POINT = 1;
/** @constant {number} */
BezierPath.END_CONTROL_POINT = 2;
/** @constant {number} */
BezierPath.END_POINT = 3;
//# sourceMappingURL=BezierPath.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/Bounds.js":
/*!********************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/Bounds.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Bounds: () => (/* binding */ Bounds)
/* harmony export */ });
/* harmony import */ var _Polygon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Polygon */ "./node_modules/plotboilerplate/src/esm/Polygon.js");
/* harmony import */ var _Vertex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Vertex */ "./node_modules/plotboilerplate/src/esm/Vertex.js");
/**
 * @author   Ikaros Kappler
 * @date     2020-05-11
 * @modified 2020-10-30 Added the static computeFromVertices function.
 * @modified 2020-11-19 Set min, max, width and height to private.
 * @modified 2021-02-02 Added the `toPolygon` method.
 * @modified 2021-06-21 (mid-summer) Added `getCenter` method.
 * @modified 2022-02-01 Added the `toString` function.
 * @modified 2022-10-09 Added the `fromDimension` function.
 * @modified 2022-11-28 Added the `clone` method.
 * @version  1.6.0
 **/


/**
 * @classdesc A bounds class with min and max values. Implementing IBounds.
 *
 * @requires XYCoords
 * @requires Vertex
 * @requires IBounds
 **/
class Bounds {
    /**
     * The constructor.
     *
     * @constructor
     * @name Bounds
     * @param {XYCoords} min - The min values (x,y) as a XYCoords tuple.
     * @param {XYCoords} max - The max values (x,y) as a XYCoords tuple.
     **/
    constructor(min, max) {
        this.min = min;
        this.max = max;
        this.width = max.x - min.x;
        this.height = max.y - min.y;
    }
    /**
     * Convert this rectangular bounding box to a polygon with four vertices.
     *
     * @method toPolygon
     * @instance
     * @memberof Bounds
     * @return {Polygon} This bound rectangle as a polygon.
     */
    toPolygon() {
        return new _Polygon__WEBPACK_IMPORTED_MODULE_0__.Polygon([new _Vertex__WEBPACK_IMPORTED_MODULE_1__.Vertex(this.min), new _Vertex__WEBPACK_IMPORTED_MODULE_1__.Vertex(this.max.x, this.min.y), new _Vertex__WEBPACK_IMPORTED_MODULE_1__.Vertex(this.max), new _Vertex__WEBPACK_IMPORTED_MODULE_1__.Vertex(this.min.x, this.max.y)], false);
    }
    /**
     * Get the center of this boinding box.
     *
     * @method getCenter
     * @instance
     * @memberof Bounds
     * @returns {Vertex} The center of these bounds.
     */
    getCenter() {
        return new _Vertex__WEBPACK_IMPORTED_MODULE_1__.Vertex(this.min.x + (this.max.x - this.min.x) / 2.0, this.min.y + (this.max.y - this.min.y) / 2);
    }
    /**
     * Convert these bounds to a human readable form.
     *
     * Note: the returned format might change in the future, so please do not
     * rely on the returned string format.
     *
     * @method toString
     * @instance
     * @memberof Bounds
     * @returns {string} Get these bounds in a human readable form.
     */
    toString() {
        return `{ min: ${this.min.toString()}, max : ${this.max.toString()}, width: ${this.width}, height : ${this.height} }`;
    }
    /**
     * Clone this bounds object (create a deep clone).
     *
     * @method clone
     * @instance
     * @memberof Bounds
     * @returns {Bounds} Creates a deep clone of this bounds object.
     */
    clone() {
        return new Bounds({ x: this.min.x, y: this.min.y }, { x: this.max.x, y: this.max.y });
    }
    /**
     * Compute the minimal bounding box for a given set of vertices.
     *
     * An empty vertex array will return an empty bounding box located at (0,0).
     *
     * @static
     * @method computeFromVertices
     * @memberof Bounds
     * @param {Array<Vertex>} vertices - The set of vertices you want to get the bounding box for.
     * @return The minimal Bounds for the given vertices.
     **/
    static computeFromVertices(vertices) {
        if (vertices.length == 0)
            return new Bounds(new _Vertex__WEBPACK_IMPORTED_MODULE_1__.Vertex(0, 0), new _Vertex__WEBPACK_IMPORTED_MODULE_1__.Vertex(0, 0));
        let xMin = vertices[0].x;
        let xMax = vertices[0].x;
        let yMin = vertices[0].y;
        let yMax = vertices[0].y;
        let vert;
        for (var i in vertices) {
            vert = vertices[i];
            xMin = Math.min(xMin, vert.x);
            xMax = Math.max(xMax, vert.x);
            yMin = Math.min(yMin, vert.y);
            yMax = Math.max(yMax, vert.y);
        }
        return new Bounds(new _Vertex__WEBPACK_IMPORTED_MODULE_1__.Vertex(xMin, yMin), new _Vertex__WEBPACK_IMPORTED_MODULE_1__.Vertex(xMax, yMax));
    }
    /**
     * Create a new `Bounds` instance just from `width` and `height`, located at (0,0) or the optionally given origin.
     *
     * @param {number} width - The width of the bounds
     * @param {number} height  - The height of the bounds
     * @param {XYCoords={x:0,y:0}} origin - [optional] A origin to locate the new Bounds object at.
     * @returns {Bounds} A new `Bounds` instance width given width and height, located at (0,0) or the given origin..
     */
    static fromDimension(width, height, origin) {
        return new Bounds(origin !== null && origin !== void 0 ? origin : { x: 0, y: 0 }, { x: (origin ? origin.x : 0) + width, y: (origin ? origin.y : 0) + height });
    }
} // END class bounds
//# sourceMappingURL=Bounds.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/Circle.js":
/*!********************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/Circle.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Circle: () => (/* binding */ Circle)
/* harmony export */ });
/* harmony import */ var _Line__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Line */ "./node_modules/plotboilerplate/src/esm/Line.js");
/* harmony import */ var _UIDGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UIDGenerator */ "./node_modules/plotboilerplate/src/esm/UIDGenerator.js");
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Vector */ "./node_modules/plotboilerplate/src/esm/Vector.js");
/* harmony import */ var _Vertex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Vertex */ "./node_modules/plotboilerplate/src/esm/Vertex.js");
/**
 * @author   Ikaros Kappler
 * @date     2020-05-04
 * @modified 2020-05-09 Ported to typescript.
 * @modified 2020-05-25 Added the vertAt and tangentAt functions.
 * @mofidied 2020-09-07 Added the circleIntersection(Circle) function.
 * @modified 2020-09-07 Changed the vertAt function by switching sin and cos! The old version did not return the correct vertex (by angle) accoring to the assumed circle math.
 * @modified 2020-10-16 Added the containsCircle(...) function.
 * @modified 2021-01-20 Added UID.
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2022-02-02 Cleared the `toSVGString` function (deprecated). Use `drawutilssvg` instead.
 * @modified 2022-08-15 Added the `containsPoint` function.
 * @modified 2022-08-23 Added the `lineIntersection` function.
 * @modified 2022-08-23 Added the `closestPoint` function.
 * @version  1.4.0
 **/




/**
 * @classdesc A simple circle: center point and radius.
 *
 * @requires Line
 * @requires Vector
 * @requires VertTuple
 * @requires Vertex
 * @requires SVGSerializale
 * @requires UID
 * @requires UIDGenerator
 **/
class Circle {
    /**
     * Create a new circle with given center point and radius.
     *
     * @constructor
     * @name Circle
     * @param {Vertex} center - The center point of the circle.
     * @param {number} radius - The radius of the circle.
     */
    constructor(center, radius) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "Circle";
        this.uid = _UIDGenerator__WEBPACK_IMPORTED_MODULE_1__.UIDGenerator.next();
        this.center = center;
        this.radius = radius;
    }
    /**
     * Check if the given circle is fully contained inside this circle.
     *
     * @method containsPoint
     * @param {XYCoords} point - The point to check if it is contained in this circle.
     * @instance
     * @memberof Circle
     * @return {boolean} `true` if the given point is inside this circle.
     */
    containsPoint(point) {
        return this.center.distance(point) < this.radius;
    }
    /**
     * Check if the given circle is fully contained inside this circle.
     *
     * @method containsCircle
     * @param {Circle} circle - The circle to check if it is contained in this circle.
     * @instance
     * @memberof Circle
     * @return {boolean} `true` if any only if the given circle is completely inside this circle.
     */
    containsCircle(circle) {
        return this.center.distance(circle.center) + circle.radius < this.radius;
    }
    /**
     * Calculate the distance from this circle to the given line.
     *
     * * If the line does not intersect this ciecle then the returned
     *   value will be the minimal distance.
     * * If the line goes through this circle then the returned value
     *   will be max inner distance and it will be negative.
     *
     * @method lineDistance
     * @param {Line} line - The line to measure the distance to.
     * @return {number} The minimal distance from the outline of this circle to the given line.
     * @instance
     * @memberof Circle
     */
    lineDistance(line) {
        const closestPointOnLine = line.getClosestPoint(this.center);
        return closestPointOnLine.distance(this.center) - this.radius;
    }
    /**
     * Get the vertex on the this circle for the given angle.
     *
     * @method vertAt
     * @param {number} angle - The angle (in radians) to use.
     * @return {Vertex} The vertex (point) at the given angle.
     * @instance
     * @memberof Circle
     **/
    vertAt(angle) {
        // Find the point on the circle respective the angle. Then move relative to center.
        return Circle.circleUtils.vertAt(angle, this.radius).add(this.center);
    }
    /**
     * Get a tangent line of this circle for a given angle.
     *
     * Point a of the returned line is located on the circle, the length equals the radius.
     *
     * @method tangentAt
     * @instance
     * @param {number} angle - The angle (in radians) to use.
     * @return {Line} The tangent line.
     * @memberof Circle
     **/
    tangentAt(angle) {
        const pointA = Circle.circleUtils.vertAt(angle, this.radius);
        // Construct the perpendicular of the line in point a. Then move relative to center.
        return new _Vector__WEBPACK_IMPORTED_MODULE_2__.Vector(pointA, new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex(0, 0)).add(this.center).perp();
    }
    /**
     * Calculate the intersection points (if exists) with the given circle.
     *
     * @method circleIntersection
     * @instance
     * @memberof Circle
     * @param {Circle} circle
     * @return {Line|null} The intersection points (as a line) or null if the two circles do not intersect.
     **/
    circleIntersection(circle) {
        // Circles do not intersect at all?
        if (this.center.distance(circle.center) > this.radius + circle.radius) {
            return null;
        }
        // One circle is fully inside the other?
        if (this.center.distance(circle.center) < Math.abs(this.radius - circle.radius)) {
            return null;
        }
        // Based on the C++ implementation by Robert King
        //    https://stackoverflow.com/questions/3349125/circle-circle-intersection-points
        // and the 'Circles and spheres' article by Paul Bourke.
        //    http://paulbourke.net/geometry/circlesphere/
        //
        // This is the original C++ implementation:
        //
        // pair<Point, Point> intersections(Circle c) {
        //    Point P0(x, y);
        //    Point P1(c.x, c.y);
        //    float d, a, h;
        //    d = P0.distance(P1);
        //    a = (r*r - c.r*c.r + d*d)/(2*d);
        //    h = sqrt(r*r - a*a);
        //    Point P2 = P1.sub(P0).scale(a/d).add(P0);
        //    float x3, y3, x4, y4;
        //    x3 = P2.x + h*(P1.y - P0.y)/d;
        //    y3 = P2.y - h*(P1.x - P0.x)/d;
        //    x4 = P2.x - h*(P1.y - P0.y)/d;
        //    y4 = P2.y + h*(P1.x - P0.x)/d;
        //    return pair<Point, Point>(Point(x3, y3), Point(x4, y4));
        // }
        var p0 = this.center;
        var p1 = circle.center;
        var d = p0.distance(p1);
        var a = (this.radius * this.radius - circle.radius * circle.radius + d * d) / (2 * d);
        var h = Math.sqrt(this.radius * this.radius - a * a);
        var p2 = p1.clone().scale(a / d, p0);
        var x3 = p2.x + (h * (p1.y - p0.y)) / d;
        var y3 = p2.y - (h * (p1.x - p0.x)) / d;
        var x4 = p2.x - (h * (p1.y - p0.y)) / d;
        var y4 = p2.y + (h * (p1.x - p0.x)) / d;
        return new _Line__WEBPACK_IMPORTED_MODULE_0__.Line(new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex(x3, y3), new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex(x4, y4));
    }
    /**
     * Calculate the intersection points (if exists) with the given infinite line (defined by two points).
     *
     * @method lineIntersection
     * @instance
     * @memberof Circle
     * @param {Vertex} a- The first of the two points defining the line.
     * @param {Vertex} b - The second of the two points defining the line.
     * @return {Line|null} The intersection points (as a line) or null if this circle does not intersect the line given.
     **/
    lineIntersection(a, b) {
        // Based on the math from
        //    https://mathworld.wolfram.com/Circle-LineIntersection.html
        const interA = new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex();
        const interB = new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex();
        // First do a transformation, because the calculation is based on a cicle at (0,0)
        const transA = new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex(a).sub(this.center);
        const transB = new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex(b).sub(this.center);
        const diff = transA.difference(transB);
        // There is a special case if diff.y=0, where the intersection is not calcuatable.
        // Use an non-zero epsilon here to approximate this case.
        // TODO for the future: find a better solution
        if (Math.abs(diff.y) === 0) {
            diff.y = 0.000001;
        }
        const dist = transA.distance(transB);
        const det = transA.x * transB.y - transA.y * transB.x;
        const distSquared = dist * dist;
        const radiusSquared = this.radius * this.radius;
        // Check if circle and line have an intersection at all
        if (radiusSquared * distSquared - det * det < 0) {
            return null;
        }
        const belowSqrt = this.radius * this.radius * dist * dist - det * det;
        const sqrt = Math.sqrt(belowSqrt);
        interA.x = (det * diff.y + Math.sign(diff.y) * diff.x * sqrt) / distSquared;
        interB.x = (det * diff.y - Math.sign(diff.y) * diff.x * sqrt) / distSquared;
        interA.y = (-det * diff.x + Math.abs(diff.y) * sqrt) / distSquared;
        interB.y = (-det * diff.x - Math.abs(diff.y) * sqrt) / distSquared;
        return new _Line__WEBPACK_IMPORTED_MODULE_0__.Line(interA.add(this.center), interB.add(this.center));
        // return new Line(interA, interB);
    }
    /**
     * Calculate the closest point on the outline of this circle to the given point.
     *
     * @method closestPoint
     * @instance
     * @memberof Circle
     * @param {XYCoords} vert - The point to find the closest circle point for.
     * @return {Vertex} The closest point on this circle.
     **/
    closestPoint(vert) {
        const lineIntersection = this.lineIntersection(this.center, vert);
        if (!lineIntersection) {
            // Note: this case should not happen as a radial from the center always intersect this circle.
            return new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex();
        }
        // Return closed of both
        if (lineIntersection.a.distance(vert) < lineIntersection.b.distance(vert)) {
            return lineIntersection.a;
        }
        else {
            return lineIntersection.b;
        }
    }
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    destroy() {
        this.center.destroy();
        this.isDestroyed = true;
    }
} // END class
Circle.circleUtils = {
    vertAt: (angle, radius) => {
        /* return new Vertex( Math.sin(angle) * radius,
                     Math.cos(angle) * radius ); */
        return new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
};
//# sourceMappingURL=Circle.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/CircleSector.js":
/*!**************************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/CircleSector.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CircleSector: () => (/* binding */ CircleSector)
/* harmony export */ });
/* harmony import */ var _UIDGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UIDGenerator */ "./node_modules/plotboilerplate/src/esm/UIDGenerator.js");
/**
 * @author   Ikaros Kappler
 * @date     2020-12-17
 * @modified 2021-01-20 Added UID.
 * @modified 2021-02-26 Fixed an error in the svg-arc-calculation (case angle<90deg and anti-clockwise).
 * @version  1.1.1
 **/

/**
 * @classdesc A simple circle sector: circle, start- and end-angle.
 *
 * @requires Line
 * @requires SVGSerializale
 * @requires UID
 * @requires UIDGenerator
 * @requires XYCoords
 **/
class CircleSector {
    /**
     * Create a new circle sector with given circle, start- and end-angle.
     *
     * @constructor
     * @name CircleSector
     * @param {Circle} circle - The circle.
     * @param {number} startAngle - The start angle of the sector.
     * @param {number} endAngle - The end angle of the sector.
     */
    constructor(circle, startAngle, endAngle) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "CircleSector";
        this.uid = _UIDGenerator__WEBPACK_IMPORTED_MODULE_0__.UIDGenerator.next();
        this.circle = circle;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
    }
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    destroy() {
        this.circle.destroy();
        this.isDestroyed = true;
    }
} // END class
CircleSector.circleSectorUtils = {
    /**
     * Helper function to convert polar circle coordinates to cartesian coordinates.
     *
     * TODO: generalize for ellipses (two radii).
     *
     * @param {number} angle - The angle in radians.
     */
    polarToCartesian: (centerX, centerY, radius, angle) => {
        return {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        };
    },
    /**
     * Helper function to convert a circle section as SVG arc params (for the `d` attribute).
     * Found at: https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
     *
     * TODO: generalize for ellipses (two radii).
     *
     * @param {boolean} options.moveToStart - If false (default=true) the initial 'Move' command will not be used.
     * @return [ 'A', radiusx, radiusy, rotation=0, largeArcFlag=1|0, sweepFlag=0, endx, endy ]
     */
    describeSVGArc: (x, y, radius, startAngle, endAngle, options) => {
        if (typeof options === "undefined")
            options = { moveToStart: true };
        const end = CircleSector.circleSectorUtils.polarToCartesian(x, y, radius, endAngle);
        const start = CircleSector.circleSectorUtils.polarToCartesian(x, y, radius, startAngle);
        // Split full circles into two halves.
        // Some browsers have problems to render full circles (described by start==end).
        if (Math.PI * 2 - Math.abs(startAngle - endAngle) < 0.001) {
            const firstHalf = CircleSector.circleSectorUtils.describeSVGArc(x, y, radius, startAngle, startAngle + (endAngle - startAngle) / 2, options);
            const secondHalf = CircleSector.circleSectorUtils.describeSVGArc(x, y, radius, startAngle + (endAngle - startAngle) / 2, endAngle, options);
            return firstHalf.concat(secondHalf);
        }
        // Boolean stored as integers (0|1).
        const diff = endAngle - startAngle;
        var largeArcFlag;
        var sweepFlag;
        if (diff < 0) {
            largeArcFlag = Math.abs(diff) < Math.PI ? 1 : 0;
            sweepFlag = 1;
        }
        else {
            largeArcFlag = Math.abs(diff) > Math.PI ? 1 : 0;
            sweepFlag = 1;
        }
        const pathData = [];
        if (options.moveToStart) {
            pathData.push("M", start.x, start.y);
        }
        pathData.push("A", radius, radius, 0, largeArcFlag, sweepFlag, end.x, end.y);
        return pathData;
    }
};
//# sourceMappingURL=CircleSector.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/CubicBezierCurve.js":
/*!******************************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/CubicBezierCurve.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CubicBezierCurve: () => (/* binding */ CubicBezierCurve)
/* harmony export */ });
/* harmony import */ var _Bounds__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Bounds */ "./node_modules/plotboilerplate/src/esm/Bounds.js");
/* harmony import */ var _UIDGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UIDGenerator */ "./node_modules/plotboilerplate/src/esm/UIDGenerator.js");
/* harmony import */ var _Vertex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Vertex */ "./node_modules/plotboilerplate/src/esm/Vertex.js");
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Vector */ "./node_modules/plotboilerplate/src/esm/Vector.js");
/**
 * @author   Ikaros Kappler
 * @date     2013-08-15
 * @modified 2018-08-16 Added a closure. Removed the wrapper class 'IKRS'. Replaced class THREE.Vector2 by Vertex class.
 * @modified 2018-11-19 Added the fromArray(Array) function.
 * @modified 2018-11-28 Added the locateCurveByPoint(Vertex) function.
 * @modified 2018-12-04 Added the toSVGPathData() function.
 * @modified 2019-03-20 Added JSDoc tags.
 * @modified 2019-03-23 Changed the signatures of getPoint, getPointAt and getTangent (!version 2.0).
 * @modified 2019-12-02 Fixed the updateArcLength function. It used the wrong pointAt function (was renamed before).
 * @modified 2020-02-06 Added the getSubCurveAt(number,number) function.
 * @modified 2020-02-06 Fixed a serious bug in the arc lenght calculation (length was never reset, urgh).
 * @modified 2020-02-07 Added the isInstance(any) function.
 * @modified 2020-02-10 Added the reverse() function.
 * @modified 2020-02-10 Fixed the translate(...) function (returning 'this' was missing).
 * @modified 2020-03-24 Ported this class from vanilla JS to Typescript.
 * @modified 2020-06-03 Added the getBounds() function.
 * @modified 2020-07-14 Changed the moveCurvePoint(...,Vertex) to moveCurvePoint(...,XYCoords), which is more generic.
 * @modified 2020-07-24 Added the getClosestT function and the helper function locateIntervalByDistance(...).
 * @modified 2021-01-20 Added UID.
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2022-02-02 Cleared the `toSVGPathData` function (deprecated). Use `drawutilssvg` instead.
 * @modified 2022-10-17 The `CubicBezierCurve` class now implements the new `PathSegment` interface.
 * @version 2.7.1
 *
 * @file CubicBezierCurve
 * @public
 **/




/**
 * @classdesc A refactored cubic bezier curve class.
 *
 * @requires Bounds
 * @requires Vertex
 * @requires Vector
 * @requires XYCoords
 * @requires UID
 * @requires UIDGenerator
 */
class CubicBezierCurve {
    /**
     * The constructor.
     *
     * @constructor
     * @name CubicBezierCurve
     * @param {Vertex} startPoint - The Bézier curve's start point.
     * @param {Vertex} endPoint   - The Bézier curve's end point.
     * @param {Vertex} startControlPoint - The Bézier curve's start control point.
     * @param {Vertex} endControlPoint   - The Bézier curve's end control point.
     **/
    constructor(startPoint, endPoint, startControlPoint, endControlPoint) {
        /** @constant {number} */
        this.START_POINT = CubicBezierCurve.START_POINT;
        /** @constant {number} */
        this.START_CONTROL_POINT = CubicBezierCurve.START_CONTROL_POINT;
        /** @constant {number} */
        this.END_CONTROL_POINT = CubicBezierCurve.END_CONTROL_POINT;
        /** @constant {number} */
        this.END_POINT = CubicBezierCurve.END_POINT;
        this.uid = _UIDGenerator__WEBPACK_IMPORTED_MODULE_1__.UIDGenerator.next();
        this.startPoint = startPoint;
        this.startControlPoint = startControlPoint;
        this.endPoint = endPoint;
        this.endControlPoint = endControlPoint;
        this.curveIntervals = 30;
        // An array of vertices
        this.segmentCache = [];
        // An array of floats
        this.segmentLengths = [];
        // float
        // this.arcLength = null;
        this.updateArcLengths();
    }
    /**
     * Move the given curve point (the start point, end point or one of the two
     * control points).
     *
     * @method moveCurvePoint
     * @param {number} pointID - The numeric identicator of the point to move. Use one of the four eBezierPoint constants.
     * @param {XYCoords} moveAmount - The amount to move the specified point by.
     * @param {boolean} moveControlPoint - Move the control points along with their path point (if specified point is a path point).
     * @param {boolean} updateArcLengths - Specifiy if the internal arc segment buffer should be updated.
     * @instance
     * @memberof CubicBezierCurve
     * @return {void}
     **/
    moveCurvePoint(pointID, moveAmount, moveControlPoint, updateArcLengths) {
        if (pointID == this.START_POINT) {
            this.getStartPoint().add(moveAmount);
            if (moveControlPoint)
                this.getStartControlPoint().add(moveAmount);
        }
        else if (pointID == this.START_CONTROL_POINT) {
            this.getStartControlPoint().add(moveAmount);
        }
        else if (pointID == this.END_CONTROL_POINT) {
            this.getEndControlPoint().add(moveAmount);
        }
        else if (pointID == this.END_POINT) {
            this.getEndPoint().add(moveAmount);
            if (moveControlPoint)
                this.getEndControlPoint().add(moveAmount);
        }
        else {
            console.log(`[CubicBezierCurve.moveCurvePoint] pointID '${pointID}' invalid.`);
        }
        if (updateArcLengths)
            this.updateArcLengths();
    }
    /**
     * Translate the whole curve by the given {x,y} amount: moves all four points.
     *
     * @method translate
     * @param {Vertex} amount - The amount to translate this curve by.
     * @instance
     * @memberof CubicBezierCurve
     * @return {CubicBezierCurve} this (for chaining).
     **/
    translate(amount) {
        this.startPoint.add(amount);
        this.startControlPoint.add(amount);
        this.endControlPoint.add(amount);
        this.endPoint.add(amount);
        return this;
    }
    /**
     * Reverse this curve, means swapping start- and end-point and swapping
     * start-control- and end-control-point.
     *
     * @method reverse
     * @instance
     * @memberof CubicBezierCurve
     * @return {CubicBezierCurve} this (for chaining).
     **/
    reverse() {
        let tmp = this.startPoint;
        this.startPoint = this.endPoint;
        this.endPoint = tmp;
        tmp = this.startControlPoint;
        this.startControlPoint = this.endControlPoint;
        this.endControlPoint = tmp;
        return this;
    }
    /**
     * Get the total curve length.<br>
     * <br>
     * As not all Bézier curved have a closed formula to calculate their lengths, this
     * implementation uses a segment buffer (with a length of 30 segments). So the
     * returned length is taken from the arc segment buffer.<br>
     * <br>
     * Note that if the curve points were changed and the segment buffer was not
     * updated this function might return wrong (old) values.
     *
     * @method getLength
     * @instance
     * @memberof CubicBezierCurve
     * @return {number} >= 0
     **/
    getLength() {
        return this.arcLength;
    }
    /**
     * Uptate the internal arc segment buffer and their lengths.<br>
     * <br>
     * All class functions update the buffer automatically; if any
     * curve point is changed by other reasons you should call this
     * function to keep actual values in the buffer.
     *
     * @method updateArcLengths
     * @instance
     * @memberof CubicBezierCurve
     * @return {void}
     **/
    updateArcLengths() {
        let pointA = this.startPoint.clone();
        let pointB = new _Vertex__WEBPACK_IMPORTED_MODULE_2__.Vertex(0, 0);
        let curveStep = 1.0 / this.curveIntervals;
        // Clear segment cache
        this.segmentCache = [];
        // Push start point into buffer
        this.segmentCache.push(this.startPoint);
        this.segmentLengths = [];
        let newLength = 0.0;
        var t = 0.0;
        let tmpLength;
        while (t <= 1.0) {
            pointB = this.getPointAt(t);
            // Store point into cache
            this.segmentCache.push(pointB);
            // Calculate segment length
            tmpLength = pointA.distance(pointB);
            this.segmentLengths.push(tmpLength);
            newLength += tmpLength;
            pointA = pointB;
            t += curveStep;
        }
        this.arcLength = newLength;
    }
    /**
     * Get a 't' (relative position on curve) with the closest distance to point 'p'.
     *
     * The returned number is 0.0 <= t <= 1.0. Use the getPointAt(t) function to retrieve the actual curve point.
     *
     * This function uses a recursive approach by cutting the curve into several linear segments.
     *
     * @param {Vertex} p - The point to find the closest position ('t' on the curve).
     * @return {number}
     **/
    getClosestT(p) {
        // We would like to have an error that's not larger than 1.0.
        var desiredEpsilon = 1.0;
        var result = { t: 0, tPrev: 0.0, tNext: 1.0 };
        var iteration = 0;
        do {
            result = this.locateIntervalByDistance(p, result.tPrev, result.tNext, this.curveIntervals);
            iteration++;
            // Be sure: stop after 4 iterations
        } while (iteration < 4 && this.getPointAt(result.tPrev).distance(this.getPointAt(result.tNext)) > desiredEpsilon);
        return result.t;
    }
    /**
     * This helper function locates the 't' on a fixed step interval with the minimal distance
     * between the curve (at 't') and the given point.
     *
     * Furthermore you must specify a sub curve (start 't' and end 't') you want to search on.
     * Using tStart=0.0 and tEnd=1.0 will search on the full curve.
     *
     * @param {Vertex} p - The point to find the closest curve point for.
     * @param {number} tStart - The start position (start 't' of the sub curve). Should be >= 0.0.
     * @param {number} tEnd - The end position (end 't' of the sub curve). Should be <= 1.0.
     * @param {number} stepCount - The number of steps to check within the interval.
     *
     * @return {object} - An object with t, tPrev and tNext (numbers).
     **/
    locateIntervalByDistance(p, tStart, tEnd, stepCount) {
        var minIndex = -1;
        var minDist = 0;
        var t = 0.0;
        const tDiff = tEnd - tStart;
        for (var i = 0; i <= stepCount; i++) {
            t = tStart + tDiff * (i / stepCount);
            var vert = this.getPointAt(t);
            var dist = vert.distance(p);
            if (minIndex == -1 || dist < minDist) {
                minIndex = i;
                minDist = dist;
            }
        }
        return {
            t: tStart + tDiff * (minIndex / stepCount),
            tPrev: tStart + tDiff * (Math.max(0, minIndex - 1) / stepCount),
            tNext: tStart + tDiff * (Math.min(stepCount, minIndex + 1) / stepCount)
        };
    }
    /**
     * Get the bounds of this bezier curve.
     *
     * The bounds are approximated by the underlying segment buffer; the more segment there are,
     * the more accurate will be the returned bounds.
     *
     * @return {Bounds} The bounds of this curve.
     **/
    getBounds() {
        var min = new _Vertex__WEBPACK_IMPORTED_MODULE_2__.Vertex(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
        var max = new _Vertex__WEBPACK_IMPORTED_MODULE_2__.Vertex(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
        let v;
        for (var i = 0; i < this.segmentCache.length; i++) {
            v = this.segmentCache[i];
            min.x = Math.min(min.x, v.x);
            min.y = Math.min(min.y, v.y);
            max.x = Math.max(max.x, v.x);
            max.y = Math.max(max.y, v.y);
        }
        return new _Bounds__WEBPACK_IMPORTED_MODULE_0__.Bounds(min, max);
    }
    /**
     * Get the start point of the curve.<br>
     * <br>
     * This function just returns this.startPoint.
     *
     * @method getStartPoint
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex} this.startPoint
     **/
    getStartPoint() {
        return this.startPoint;
    }
    /**
     * Get the end point of the curve.<br>
     * <br>
     * This function just returns this.endPoint.
     *
     * @method getEndPoint
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex} this.endPoint
     **/
    getEndPoint() {
        return this.endPoint;
    }
    /**
     * Get the start control point of the curve.<br>
     * <br>
     * This function just returns this.startControlPoint.
     *
     * @method getStartControlPoint
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex} this.startControlPoint
     **/
    getStartControlPoint() {
        return this.startControlPoint;
    }
    /**
     * Get the end control point of the curve.<br>
     * <br>
     * This function just returns this.endControlPoint.
     *
     * @method getEndControlPoint
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex} this.endControlPoint
     **/
    getEndControlPoint() {
        return this.endControlPoint;
    }
    /**
     * Get one of the four curve points specified by the passt point ID.
     *
     * @method getEndControlPoint
     * @param {number} id - One of START_POINT, START_CONTROL_POINT, END_CONTROL_POINT or END_POINT.
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex}
     **/
    getPointByID(id) {
        if (id == this.START_POINT)
            return this.startPoint;
        if (id == this.END_POINT)
            return this.endPoint;
        if (id == this.START_CONTROL_POINT)
            return this.startControlPoint;
        if (id == this.END_CONTROL_POINT)
            return this.endControlPoint;
        throw new Error(`Invalid point ID '${id}'.`);
    }
    /**
     * Get the curve point at a given position t, where t is in [0,1].<br>
     * <br>
     * @see Line.pointAt
     *
     * @method getPointAt
     * @param {number} t - The position on the curve in [0,1] (0 means at
     *                     start point, 1 means at end point, other values address points in bertween).
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex}
     **/
    getPointAt(t) {
        // Perform some powerful math magic
        const x = this.startPoint.x * Math.pow(1.0 - t, 3) +
            this.startControlPoint.x * 3 * t * Math.pow(1.0 - t, 2) +
            this.endControlPoint.x * 3 * Math.pow(t, 2) * (1.0 - t) +
            this.endPoint.x * Math.pow(t, 3);
        const y = this.startPoint.y * Math.pow(1.0 - t, 3) +
            this.startControlPoint.y * 3 * t * Math.pow(1.0 - t, 2) +
            this.endControlPoint.y * 3 * Math.pow(t, 2) * (1.0 - t) +
            this.endPoint.y * Math.pow(t, 3);
        return new _Vertex__WEBPACK_IMPORTED_MODULE_2__.Vertex(x, y);
    }
    /**
     * Get the curve point at a given position u, where u is in [0,arcLength].<br>
     * <br>
     * @see CubicBezierCurve.getPointAt
     *
     * @method getPoint
     * @param {number} u - The position on the curve in [0,arcLength] (0 means at
     *                     start point, arcLength means at end point, other values address points in bertween).
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex}
     **/
    getPoint(u) {
        return this.getPointAt(u / this.arcLength);
    }
    /**
     * Get the curve tangent vector at a given absolute curve position t in [0,1].<br>
     * <br>
     * Note that the returned tangent vector (end point) is not normalized and relative to (0,0).
     *
     * @method getTangent
     * @param {number} t - The position on the curve in [0,1].
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex}
     **/
    getTangentAt(t) {
        const a = this.getStartPoint();
        const b = this.getStartControlPoint();
        const c = this.getEndControlPoint();
        const d = this.getEndPoint();
        // This is the shortened one
        const t2 = t * t;
        // (1 - t)^2 = (1-t)*(1-t) = 1 - t - t + t^2 = 1 - 2*t + t^2
        const nt2 = 1 - 2 * t + t2;
        const tX = -3 * a.x * nt2 + b.x * (3 * nt2 - 6 * (t - t2)) + c.x * (6 * (t - t2) - 3 * t2) + 3 * d.x * t2;
        const tY = -3 * a.y * nt2 + b.y * (3 * nt2 - 6 * (t - t2)) + c.y * (6 * (t - t2) - 3 * t2) + 3 * d.y * t2;
        // Note: my implementation does NOT normalize tangent vectors!
        return new _Vertex__WEBPACK_IMPORTED_MODULE_2__.Vertex(tX, tY);
    }
    /**
     * Get a sub curve at the given start end end offsets (values between 0.0 and 1.0).
     *
     * tStart >= tEnd is allowed, you will get a reversed sub curve then.
     *
     * @method getSubCurveAt
     * @param {number} tStart – The start offset of the desired sub curve (must be in [0..1]).
     * @param {number} tEnd – The end offset if the desired cub curve (must be in [0..1]).
     * @instance
     * @memberof CubicBezierCurve
     * @return {CubicBezierCurve} The sub curve as a new curve.
     **/
    getSubCurveAt(tStart, tEnd) {
        const startVec = new _Vector__WEBPACK_IMPORTED_MODULE_3__.Vector(this.getPointAt(tStart), this.getTangentAt(tStart));
        const endVec = new _Vector__WEBPACK_IMPORTED_MODULE_3__.Vector(this.getPointAt(tEnd), this.getTangentAt(tEnd).inv());
        // Tangents are relative. Make absolute.
        startVec.b.add(startVec.a);
        endVec.b.add(endVec.a);
        // This 'splits' the curve at the given point at t.
        startVec.scale(0.33333333 * (tEnd - tStart));
        endVec.scale(0.33333333 * (tEnd - tStart));
        // Draw the bezier curve
        // pb.draw.cubicBezier( startVec.a, endVec.a, startVec.b, endVec.b, '#8800ff', 2 );
        return new CubicBezierCurve(startVec.a, endVec.a, startVec.b, endVec.b);
    }
    /**
     * Convert a relative curve position u to the absolute curve position t.
     *
     * @method convertU2t
     * @param {number} u - The relative position on the curve in [0,arcLength].
     * @instance
     * @memberof CubicBezierCurve
     * @return {number}
     **/
    convertU2T(u) {
        return Math.max(0.0, Math.min(1.0, u / this.arcLength));
    }
    /**
     * Get the curve tangent vector at a given relative position u in [0,arcLength].<br>
     * <br>
     * Note that the returned tangent vector (end point) is not normalized.
     *
     * @method getTangent
     * @param {number} u - The position on the curve in [0,arcLength].
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex}
     **/
    getTangent(u) {
        return this.getTangentAt(this.convertU2T(u));
    }
    /**
     * Get the curve perpendicular at a given relative position u in [0,arcLength] as a vector.<br>
     * <br>
     * Note that the returned vector (end point) is not normalized.
     *
     * @method getPerpendicular
     * @param {number} u - The relative position on the curve in [0,arcLength].
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex}
     **/
    getPerpendicular(u) {
        return this.getPerpendicularAt(this.convertU2T(u));
    }
    /**
     * Get the curve perpendicular at a given absolute position t in [0,1] as a vector.<br>
     * <br>
     * Note that the returned vector (end point) is not normalized.
     *
     * @method getPerpendicularAt
     * @param {number} u - The absolute position on the curve in [0,1].
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex}
     **/
    getPerpendicularAt(t) {
        const tangentVector = this.getTangentAt(t);
        return new _Vertex__WEBPACK_IMPORTED_MODULE_2__.Vertex(tangentVector.y, -tangentVector.x);
    }
    /**
     * Clone this Bézier curve (deep clone).
     *
     * @method clone
     * @instance
     * @memberof CubicBezierCurve
     * @return {CubicBezierCurve}
     **/
    clone() {
        return new CubicBezierCurve(this.getStartPoint().clone(), this.getEndPoint().clone(), this.getStartControlPoint().clone(), this.getEndControlPoint().clone());
    }
    //---BEGIN PathSegment-------------------------
    /**
     * Get the tangent's end point at the start point of this segment.
     *
     * @method getStartTangent
     * @memberof PathSegment
     * @return {Vertex} The end point of the starting point's tangent.
     */
    getStartTangent() {
        return this.startControlPoint;
    }
    /**
     * Get the tangent's end point at the end point of this segment.
     *
     * @method getEndTangent
     * @memberof PathSegment
     * @return {Vertex} The end point of the ending point's tangent.
     */
    getEndTangent() {
        return this.endControlPoint;
    }
    //---END PathSegment-------------------------
    /**
     * Check if this and the specified curve are equal.<br>
     * <br>
     * All four points need to be equal for this, the Vertex.equals function is used.<br>
     * <br>
     * Please note that this function is not type safe (comparison with any object will fail).
     *
     * @method clone
     * @param {CubicBezierCurve} curve - The curve to compare with.
     * @instance
     * @memberof CubicBezierCurve
     * @return {boolean}
     **/
    equals(curve) {
        // Note: in the earlier vanilla-JS version this was callable with plain objects.
        //       Let's see if this restricted version works out.
        if (!curve)
            return false;
        if (!curve.startPoint || !curve.endPoint || !curve.startControlPoint || !curve.endControlPoint)
            return false;
        return (this.startPoint.equals(curve.startPoint) &&
            this.endPoint.equals(curve.endPoint) &&
            this.startControlPoint.equals(curve.startControlPoint) &&
            this.endControlPoint.equals(curve.endControlPoint));
    }
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    destroy() {
        this.startPoint.destroy();
        this.endPoint.destroy();
        this.startControlPoint.destroy();
        this.endControlPoint.destroy();
        this.isDestroyed = true;
    }
    /**
     * Quick check for class instance.
     * Is there a better way?
     *
     * @method isInstance
     * @param {any} obj - Check if the passed object/value is an instance of CubicBezierCurve.
     * @instance
     * @memberof CubicBezierCurve
     * @return {boolean}
     **/
    static isInstance(obj) {
        // Note: check this again
        /* OLD VANILLA JS IMPLEMENTATION */
        /* if( typeof obj != "object" )
            return false;
        function hasXY(v) {
            return typeof v != "undefined" && typeof v.x == "number" && typeof v.y == "number";
        }
        return typeof obj.startPoint == "object" && hasXY(obj.startPoint)
            && typeof obj.endPoint == "object" && hasXY(obj.endPoint)
            && typeof obj.startControlPoint == "object" && hasXY(obj.startControlPoint)
            && typeof obj.endControlPoint == "object" && hasXY(obj.endControlPoint);
        */
        return obj instanceof CubicBezierCurve;
    }
    /**
     * Convert this curve to a JSON string.
     *
     * @method toJSON
     * @param {boolean=} [prettyFormat=false] - If set to true the function will add line breaks.
     * @instance
     * @memberof CubicBezierCurve
     * @return {string} The JSON data.
     **/
    toJSON(prettyFormat) {
        var jsonString = "{ " + // begin object
            (prettyFormat ? "\n\t" : "") +
            '"startPoint" : [' +
            this.getStartPoint().x +
            "," +
            this.getStartPoint().y +
            "], " +
            (prettyFormat ? "\n\t" : "") +
            '"endPoint" : [' +
            this.getEndPoint().x +
            "," +
            this.getEndPoint().y +
            "], " +
            (prettyFormat ? "\n\t" : "") +
            '"startControlPoint": [' +
            this.getStartControlPoint().x +
            "," +
            this.getStartControlPoint().y +
            "], " +
            (prettyFormat ? "\n\t" : "") +
            '"endControlPoint" : [' +
            this.getEndControlPoint().x +
            "," +
            this.getEndControlPoint().y +
            "]" +
            (prettyFormat ? "\n\t" : "") +
            " }"; // end object
        return jsonString;
    }
    /**
     * Parse a Bézier curve from the given JSON string.
     *
     * @method fromJSON
     * @param {string} jsonString - The JSON data to parse.
     * @memberof CubicBezierCurve
     * @static
     * @throws An exception if the JSON string is malformed.
     * @return {CubicBezierCurve}
     **/
    static fromJSON(jsonString) {
        var obj = JSON.parse(jsonString);
        return CubicBezierCurve.fromObject(obj);
    }
    /**
     * Try to convert the passed object to a CubicBezierCurve.
     *
     * @method fromObject
     * @param {object} obj - The object to convert.
     * @memberof CubicBezierCurve
     * @static
     * @throws An exception if the passed object is malformed.
     * @return {CubicBezierCurve}
     **/
    static fromObject(obj) {
        if (typeof obj !== "object")
            throw "Can only build from object.";
        if (!obj.startPoint)
            throw 'Object member "startPoint" missing.';
        if (!obj.endPoint)
            throw 'Object member "endPoint" missing.';
        if (!obj.startControlPoint)
            throw 'Object member "startControlPoint" missing.';
        if (!obj.endControlPoint)
            throw 'Object member "endControlPoint" missing.';
        return new CubicBezierCurve(new _Vertex__WEBPACK_IMPORTED_MODULE_2__.Vertex(obj.startPoint[0], obj.startPoint[1]), new _Vertex__WEBPACK_IMPORTED_MODULE_2__.Vertex(obj.endPoint[0], obj.endPoint[1]), new _Vertex__WEBPACK_IMPORTED_MODULE_2__.Vertex(obj.startControlPoint[0], obj.startControlPoint[1]), new _Vertex__WEBPACK_IMPORTED_MODULE_2__.Vertex(obj.endControlPoint[0], obj.endControlPoint[1]));
    }
    /**
     * Convert a 4-element array of vertices to a cubic bézier curve.
     *
     * @method fromArray
     * @param {Vertex[]} arr -  [ startVertex, endVertex, startControlVertex, endControlVertex ]
     * @memberof CubicBezierCurve
     * @throws An exception if the passed array is malformed.
     * @return {CubicBezierCurve}
     **/
    static fromArray(arr) {
        if (!Array.isArray(arr))
            throw "Can only build from object.";
        if (arr.length != 4)
            throw "Can only build from array with four elements.";
        return new CubicBezierCurve(arr[0], arr[1], arr[2], arr[3]);
    }
}
/** @constant {number} */
CubicBezierCurve.START_POINT = 0;
/** @constant {number} */
CubicBezierCurve.START_CONTROL_POINT = 1;
/** @constant {number} */
CubicBezierCurve.END_CONTROL_POINT = 2;
/** @constant {number} */
CubicBezierCurve.END_POINT = 3;
//# sourceMappingURL=CubicBezierCurve.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/Grid.js":
/*!******************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/Grid.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Grid: () => (/* binding */ Grid)
/* harmony export */ });
/**
 * @author   Ikaros Kappler
 * @date     2018-11-28
 * @modified 2018-12-09 Added the utils: baseLog(Number,Number) and mapRasterScale(Number,Number).
 * @version  1.0.1
 *
 * @file Grid
 * @fileoverview Note that the PlotBoilerplate already has a Grid instance member. The Grid is not meant
 *               to be added to the canvas as a drawable as it encapsulates more an abstract concept of the canvas
 *               rather than a drawable object.
 * @public
 **/
/**
 * @classdesc A grid class with vertical and horizontal lines (or a raster).
 *
 * Note that the PlotBoilerplate already has a Grid instance member. The Grid is not meant
 * to be added to the canvas as a drawable as it encapsulates more an abstract concept of the canvas
 * rather than a drawable object.
 *
 * @requires Vertex
 */
class Grid {
    /**
     * The constructor.
     *
     * @constructor
     * @name Grid
     * @param {Vertex} center - The offset of the grid (default is [0,0]).
     * @param {Vertex} size   - The x- and y-size of the grid.
     **/
    constructor(center, size) {
        this.center = center;
        this.size = size;
    }
    ;
}
/**
 * @memberof Grid
 **/
Grid.utils = {
    /**
     * Calculate the logarithm of the given number (num) to a given base.<br>
     * <br>
     * This function returns the number l with<br>
     *  <pre>num == Math.pow(base,l)</pre>
     *
     * @member baseLog
     * @function
     * @memberof Grid
     * @inner
     * @param {number} base - The base to calculate the logarithm to.
     * @param {number} num  - The number to calculate the logarithm for.
     * @return {number} <pre>log(base)/log(num)</pre>
     **/
    baseLog: (base, num) => { return Math.log(base) / Math.log(num); },
    /**
     * Calculate the raster scale for a given logarithmic mapping.<br>
     * <br>
     * Example (with adjustFactor=2):<br>
     * <pre>
     * If scale is 4.33, then the mapping is 1/2 (because 2^2 <= 4.33 <= 2^3)<br>
     * If scale is 0.33, then the mapping is 2 because (2^(1/2) >= 0.33 >= 2^(1/4)
     * </pre>
     *
     * @member mapRasterScale
     * @function
     * @memberof Grid
     * @inner
     * @param {number} adjustFactor The base for the logarithmic raster scaling when zoomed.
     * @param {number} scale        The currently used scale factor.
     * @return {number}
     **/
    mapRasterScale: (adjustFactor, scale) => {
        var gf = 1.0;
        if (scale >= 1) {
            gf = Math.abs(Math.floor(1 / Grid.utils.baseLog(adjustFactor, scale)));
            gf = 1 / Math.pow(adjustFactor, gf);
        }
        else {
            gf = Math.abs(Math.floor(Grid.utils.baseLog(1 / adjustFactor, 1 / (scale + 1))));
        }
        return gf;
    }
};
//# sourceMappingURL=Grid.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/KeyHandler.js":
/*!************************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/KeyHandler.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KeyHandler: () => (/* binding */ KeyHandler)
/* harmony export */ });
/**
 * @author   Ikaros Kappler
 * @date     2018-11-11 (Alaaf)
 * @modified 2020-03-28 Ported this class from vanilla-JS to Typescript.
 * @modified 2020-07-28 Changed the `delete` key code from 8 to 46.
 * @modified 2020-10-04 Changed `window` to `globalThis`.
 * @modified 2020-10-04 Added extended JSDoc.
 * @modified 2022-02-02 Added the `destroy` method.
 * @version  1.1.0
 *
 * @file KeyHandler
 * @public
 **/
/**
 * @classdesc A generic key handler.
 *
 * Example
 * =======
 * @example
 *      // Javascript
 *	new KeyHandler( { trackAll : true } )
 *	    .down('enter',function() { console.log('ENTER was hit.'); } )
 *	    .press('enter',function() { console.log('ENTER was pressed.'); } )
 *	    .up('enter',function() { console.log('ENTER was released.'); } )
 *
 *          .down('e',function() { console.log('e was hit. shift is pressed?',keyHandler.isDown('shift')); } )
 *
 *	    .up('windows',function() { console.log('windows was released.'); } )
 *	;
 */
class KeyHandler {
    /**
     * The constructor.
     *
     * @constructor
     * @instance
     * @memberof KeyHandler
     * @param {HTMLElement} options.element (optional) The HTML element to listen on; if null then 'window' will be used.
     * @param {boolean} options.trackAll (optional) Set to true if you want to keep track of _all_ keys (keyStatus).
     **/
    constructor(options) {
        this.downListeners = [];
        this.pressListeners = [];
        this.upListeners = [];
        this.keyStates = {};
        options = options || {};
        this.element = options.element ? options.element : globalThis;
        this.downListeners = [];
        this.pressListeners = [];
        this.upListeners = [];
        this.keyStates = [];
        // This could be made configurable in a later version. It allows to
        // keep track of the key status no matter if there are any listeners
        // on the key or not.
        this.trackAllKeys = options.trackAll || false;
        // Install the listeners
        this.installListeners();
    }
    /**
     * A helper function to fire key events from this KeyHandler.
     *
     * @param {KeyboardEvent} event - The key event to fire.
     * @param {Array<XKeyListener>} listener - The listeners to fire to.
     */
    fireEvent(event, listeners) {
        let hasListener = false;
        for (var i in listeners) {
            var lis = listeners[i];
            if (lis.keyCode != event.keyCode)
                continue;
            lis.listener(event);
            hasListener = true;
        }
        return hasListener;
    }
    /**
     * Internal function to fire a new keydown event to all listeners.
     * You should not call this function on your own unless you know what you do.
     *
     * @name fireDownEvent
     * @memberof KeyHandler
     * @instance
     * @private
     * @param {KeyboardEvent} e
     * @param {KeyHandler} handler
     * @return {void}
     */
    fireDownEvent(e, handler) {
        if (handler.fireEvent(e, handler.downListeners) || handler.trackAllKeys) {
            // Down event has listeners. Update key state.
            handler.keyStates[e.keyCode] = "down";
        }
    }
    /**
     * Internal function to fire a new keypress event to all listeners.
     * You should not call this function on your own unless you know what you do.
     *
     * @name firePressEvent
     * @memberof KeyHandler
     * @instance
     * @private
     * @param {KeyboardEvent} e
     * @param {KeyHandler} handler
     * @return void
     */
    firePressEvent(e, handler) {
        handler.fireEvent(e, handler.pressListeners);
    }
    /**
     * Internal function to fire a new keyup event to all listeners.
     * You should not call this function on your own unless you know what you do.
     *
     * @name fireUpEvent
     * @memberof KeyHandler
     * @instance
     * @private
     * @param {KeyboardEvent} e
     * @param {KeyHandler} handler
     * @return {void}
     */
    fireUpEvent(e, handler) {
        if (handler.fireEvent(e, handler.upListeners) || handler.trackAllKeys) {
            // Up event has listeners. Clear key state.
            delete handler.keyStates[e.keyCode];
        }
    }
    /**
     * Resolve the key/name code.
     */
    static key2code(key) {
        if (typeof key == "number")
            return key;
        if (typeof key != "string")
            throw "Unknown key name or key type (should be a string or integer): " + key;
        if (KeyHandler.KEY_CODES[key])
            return KeyHandler.KEY_CODES[key];
        throw "Unknown key (cannot resolve key code): " + key;
    }
    /**
     * Install the required listeners into the initially passed element.
     *
     * By default the listeners are installed into the root element specified on
     * construction (or 'window').
     */
    installListeners() {
        var _self = this;
        this.element.addEventListener("keydown", (this._keyDownListener = (e) => {
            _self.fireDownEvent(e, _self);
        }));
        this.element.addEventListener("keypress", (this._keyPressListener = (e) => {
            _self.firePressEvent(e, _self);
        }));
        this.element.addEventListener("keyup", (this._keyUpListener = (e) => {
            _self.fireUpEvent(e, _self);
        }));
    }
    /**
     *  Remove all installed event listeners from the underlying element.
     */
    releaseListeners() {
        this.element.removeEventListener("keydown", this._keyDownListener);
        this.element.removeEventListener("keypress", this._keyPressListener);
        this.element.removeEventListener("keyup", this._keyUpListener);
    }
    /**
     * Listen for key down. This function allows chaining.
     *
     * Example: new KeyHandler().down('enter',function() {console.log('Enter hit.')});
     *
     * @name down
     * @memberof KeyHandler
     * @instance
     * @param {string|number} key -  Any key identifier, key code or one from the KEY_CODES list.
     * @param {(e:KeyboardEvent)=>void} e -  The callback to be triggered.
     * @return {KeyHandler} this
     */
    down(key, listener) {
        this.downListeners.push({ key: key, keyCode: KeyHandler.key2code(key), listener: listener });
        return this;
    }
    /**
     * Listen for key press.
     *
     * Example: new KeyHandler().press('enter',function() {console.log('Enter pressed.')});
     *
     * @name press
     * @memberof KeyHandler
     * @instance
     * @param {string|number} key - Any key identifier, key code or one from the KEY_CODES list.
     * @param {(e:KeyboardEvent)=>void} listener - The callback to be triggered.
     * @return {KeyHandler} this
     */
    press(key, listener) {
        this.pressListeners.push({ key: key, keyCode: KeyHandler.key2code(key), listener: listener });
        return this;
    }
    /**
     * Listen for key up.
     *
     * Example: new KeyHandler().up('enter',function() {console.log('Enter released.')});
     *
     * @name up
     * @memberof KeyHandler
     * @instance
     * @param {string} key - Any key identifier, key code or one from the KEY_CODES list.
     * @param {(e:KeyboardEvent)=>void)} e - The callback to be triggered.
     * @return {KeyHandler} this
     */
    up(key, listener) {
        this.upListeners.push({ key: key, keyCode: KeyHandler.key2code(key), listener: listener });
        return this;
    }
    /**
     * Check if a specific key is currently held pressed.
     *
     * @param {string|number} key - Any key identifier, key code or one from the KEY_CODES list.
     */
    isDown(key) {
        if (typeof key == "number")
            return this.keyStates[key] ? true : false;
        else
            return this.keyStates[KeyHandler.key2code(key)] ? true : false;
    }
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used any more.
     */
    destroy() {
        this.releaseListeners();
    }
}
/**
 * Source:
 * https://keycode.info/
 */
// prettier-ignore
KeyHandler.KEY_CODES = {
    'break': 3,
    'backspace': 8,
    // 'delete'	 : 8, // alternate: 46
    'tab': 9,
    'clear': 12,
    'enter': 13,
    'shift': 16,
    'ctrl': 17,
    'alt': 18,
    'pause': 19,
    // 'break'	         : 19,
    'capslock': 20,
    'hangul': 21,
    'hanja': 25,
    'escape': 27,
    'conversion': 28,
    'non-conversion': 29,
    'spacebar': 32,
    'pageup': 33,
    'pagedown': 34,
    'end': 35,
    'home': 36,
    'leftarrow': 37,
    'uparrow': 38,
    'rightarrow': 39,
    'downarrow': 40,
    'select': 41,
    'print': 42,
    'execute': 43,
    'printscreen': 44,
    'insert': 45,
    'delete': 46,
    'help': 47,
    '0': 48,
    '1': 49,
    '2': 50,
    '3': 51,
    '4': 52,
    '5': 53,
    '6': 54,
    '7': 55,
    '8': 56,
    '9': 57,
    ':': 58,
    'semicolon (firefox)': 59,
    'equals': 59,
    '<': 60,
    'equals (firefox)': 61,
    'ß': 63,
    '@ (firefox)': 64,
    'a': 65,
    'b': 66,
    'c': 67,
    'd': 68,
    'e': 69,
    'f': 70,
    'g': 71,
    'h': 72,
    'i': 73,
    'j': 74,
    'k': 75,
    'l': 76,
    'm': 77,
    'n': 78,
    'o': 79,
    'p': 80,
    'q': 81,
    'r': 82,
    's': 83,
    't': 84,
    'u': 85,
    'v': 86,
    'w': 87,
    'x': 88,
    'y': 89,
    'z': 90,
    'windows': 91,
    'leftcommand': 91,
    'chromebooksearch': 91,
    'rightwindowkey': 92,
    'windowsmenu': 93,
    'rightcommant': 93,
    'sleep': 95,
    'numpad0': 96,
    'numpad1': 97,
    'numpad2': 98,
    'numpad3': 99,
    'numpad4': 100,
    'numpad5': 101,
    'numpad6': 102,
    'numpad7': 103,
    'numpad8': 104,
    'numpad9': 105,
    'multiply': 106,
    'add': 107,
    'numpadperiod': 108,
    'subtract': 109,
    'decimalpoint': 110,
    'divide': 111,
    'f1': 112,
    'f2': 113,
    'f3': 114,
    'f4': 115,
    'f5': 116,
    'f6': 117,
    'f7': 118,
    'f8': 119,
    'f9': 120,
    'f10': 121,
    'f11': 122,
    'f12': 123,
    'f13': 124,
    'f14': 125,
    'f15': 126,
    'f16': 127,
    'f17': 128,
    'f18': 129,
    'f19': 130,
    'f20': 131,
    'f21': 132,
    'f22': 133,
    'f23': 134,
    'f24': 135,
    'numlock': 144,
    'scrolllock': 145,
    '^': 160,
    '!': 161,
    // '؛' 	 : 162 // (arabic semicolon)
    '#': 163,
    '$': 164,
    'ù': 165,
    'pagebackward': 166,
    'pageforward': 167,
    'refresh': 168,
    'closingparen': 169,
    '*': 170,
    '~+*': 171,
    // 'home'	         : 172,
    'minus': 173,
    // 'mute'           : 173,
    // 'unmute'	 : 173,
    'decreasevolumelevel': 174,
    'increasevolumelevel': 175,
    'next': 176,
    'previous': 177,
    'stop': 178,
    'play/pause': 179,
    'email': 180,
    'mute': 181,
    'unmute': 181,
    //'decreasevolumelevel'	182 // firefox
    //'increasevolumelevel'	183 // firefox
    'semicolon': 186,
    'ñ': 186,
    'equal': 187,
    'comma': 188,
    'dash': 189,
    'period': 190,
    'forwardslash': 191,
    'ç': 191,
    'grave accent': 192,
    //'ñ' 192,
    'æ': 192,
    'ö': 192,
    '?': 193,
    '/': 193,
    '°': 193,
    // 'numpadperiod'	 : 194, // chrome
    'openbracket': 219,
    'backslash': 220,
    'closebracket': 221,
    'å': 221,
    'singlequote': 222,
    'ø': 222,
    'ä': 222,
    '`': 223,
    // 'left or right ⌘ key (firefox)'	224
    'altgr': 225,
    // '< /git >, left back slash'	226
    'GNOME Compose Key': 230,
    'XF86Forward': 233,
    'XF86Back': 234,
    'alphanumeric': 240,
    'hiragana': 242,
    'katakana': 242,
    'half-width': 243,
    'full-width': 243,
    'kanji': 244,
    'unlocktrackpad': 251,
    'toggletouchpad': 255
};
//# sourceMappingURL=KeyHandler.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/Line.js":
/*!******************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/Line.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Line: () => (/* binding */ Line)
/* harmony export */ });
/* harmony import */ var _VertTuple__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VertTuple */ "./node_modules/plotboilerplate/src/esm/VertTuple.js");
/* harmony import */ var _Vertex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Vertex */ "./node_modules/plotboilerplate/src/esm/Vertex.js");
/**
 * @author   Ikaros Kappler
 * @date     2016-03-12
 * @modified 2018-12-05 Refactored the code from the morley-triangle script.
 * @modified 2019-03-20 Added JSDoc tags.
 * @modified 2019-04-28 Fixed a bug in the Line.sub( Vertex ) function (was not working).
 * @modified 2019-09-02 Added the Line.add( Vertex ) function.
 * @modified 2019-09-02 Added the Line.denominator( Line ) function.
 * @modified 2019-09-02 Added the Line.colinear( Line ) function.
 * @modified 2019-09-02 Fixed an error in the Line.intersection( Line ) function (class Point was renamed to Vertex).
 * @modified 2019-12-15 Added the Line.moveTo(Vertex) function.
 * @modified 2020-03-16 The Line.angle(Line) parameter is now optional. The baseline (x-axis) will be used if not defined.
 * @modified 2020-03-23 Ported to Typescript from JS.
 * @modified 2020-12-04 The `intersection` function returns undefined if both lines are parallel.
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2022-10-09 Changed the actual return value of the `intersection` function to null (was undefined before).
 * @modified 2022-10-17 Adding these methods from the `PathSegment` interface: getStartPoint, getEndPoint, revert.
 * @version  2.3.0
 *
 * @file Line
 * @public
 **/


/**
 * @classdesc A line consists of two vertices a and b.<br>
 * <br>
 * This is some refactored code from my 'Morley Triangle' test<br>
 *   https://github.com/IkarosKappler/morleys-trisector-theorem
 *
 * @requires Vertex
 */
class Line extends _VertTuple__WEBPACK_IMPORTED_MODULE_0__.VertTuple {
    /**
     * Creates an instance of Line.
     *
     * @constructor
     * @name Line
     * @param {Vertex} a The line's first point.
     * @param {Vertex} b The line's second point.
     **/
    constructor(a, b) {
        super(a, b, (a, b) => new Line(a, b));
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "Line";
    }
    /**
     * Get the intersection if this line and the specified line.
     *
     * @method intersection
     * @param {Line} line The second line.
     * @return {Vertex|undefined} The intersection (may lie outside the end-points) or `undefined` if both lines are parallel.
     * @instance
     * @memberof Line
     **/
    // !!! DO NOT MOVE TO VertTuple
    intersection(line) {
        const denominator = this.denominator(line);
        if (denominator == 0) {
            return null;
        }
        let a = this.a.y - line.a.y;
        let b = this.a.x - line.a.x;
        const numerator1 = (line.b.x - line.a.x) * a - (line.b.y - line.a.y) * b;
        const numerator2 = (this.b.x - this.a.x) * a - (this.b.y - this.a.y) * b;
        a = numerator1 / denominator; // NaN if parallel lines
        b = numerator2 / denominator;
        // Catch NaN?
        const x = this.a.x + a * (this.b.x - this.a.x);
        const y = this.a.y + a * (this.b.y - this.a.y);
        if (isNaN(a) || isNaN(x) || isNaN(y)) {
            return null;
        }
        // if we cast these lines infinitely in both directions, they intersect here:
        return new _Vertex__WEBPACK_IMPORTED_MODULE_1__.Vertex(x, y);
    }
    //--- Implement PathSegment ---
    /**
     * Get the start point of this path segment.
     *
     * @method getStartPoint
     * @memberof PathSegment
     * @return {Vertex} The start point of this path segment.
     */
    getStartPoint() {
        return this.a;
    }
    /**
     * Get the end point of this path segment.
     *
     * @method getEndPoint
     * @memberof PathSegment
     * @return {Vertex} The end point of this path segment.
     */
    getEndPoint() {
        return this.b;
    }
    /**
     * Get the tangent's end point at the start point of this segment.
     *
     * @method getStartTangent
     * @memberof PathSegment
     * @return {Vertex} The end point of the starting point's tangent.
     */
    getStartTangent() {
        return this.b;
    }
    /**
     * Get the tangent's end point at the end point of this segment.
     *
     * @method getEndTangent
     * @memberof PathSegment
     * @return {Vertex} The end point of the ending point's tangent.
     */
    getEndTangent() {
        return this.a;
    }
    /**
     * Inverse this path segment (in-place) and return this same instance (useful for chaining).
     *
     * @method reverse
     * @memberof PathSegment
     * @return {PathSegment} This path segment instance (for chaining).
     */
    reverse() {
        var tmp = this.a;
        this.a = this.b;
        this.b = tmp;
        return this;
    }
}
//# sourceMappingURL=Line.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/MouseHandler.js":
/*!**************************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/MouseHandler.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MouseHandler: () => (/* binding */ MouseHandler),
/* harmony export */   XMouseEvent: () => (/* binding */ XMouseEvent),
/* harmony export */   XWheelEvent: () => (/* binding */ XWheelEvent)
/* harmony export */ });
/**
 * @author   Ikaros Kappler
 * @date     2018-03-19
 * @modified 2018-04-28 Added the param 'wasDragged'.
 * @modified 2018-08-16 Added the param 'dragAmount'.
 * @modified 2018-08-27 Added the param 'element'.
 * @modified 2018-11-11 Changed the scope from a simple global var to a member of window/_context.
 * @modified 2018-11-19 Renamed the 'mousedown' function to 'down' and the 'mouseup' function to 'up'.
 * @modified 2018-11-28 Added the 'wheel' listener.
 * @modified 2018-12-09 Cleaned up some code.
 * @modified 2019-02-10 Cleaned up some more code.
 * @modified 2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @modified 2020-04-08 Fixed the click event (internally fired a 'mouseup' event) (1.0.10)
 * @modified 2020-04-08 Added the optional 'name' property. (1.0.11)
 * @modified 2020-04-08 The new version always installs internal listenrs to track drag events even
 *                      if there is no external drag listener installed (1.1.0).
 * @modified 2020-10-04 Added extended JSDoc comments.
 * @modified 2020-11-25 Added the `isTouchEvent` param.
 * @modified 2021-01-10 The mouse handler is now also working with SVGElements.
 * @modified 2022-08-16 Fixed a bug in the mouse button detection.
 * @version  1.2.1
 *
 * @file MouseHandler
 * @public
 **/
class XMouseEvent extends MouseEvent {
}
class XWheelEvent extends WheelEvent {
}
/**
 * @classdesc A simple mouse handler for demos.
 * Use to avoid load massive libraries like jQuery.
 *
 * @requires XYCoords
 */
class MouseHandler {
    /**
     * The constructor.
     *
     * Pass the DOM element you want to receive mouse events from.
     *
     * Usage
     * =====
     * @example
     *   // Javascript
     *   new MouseHandler( document.getElementById('mycanvas') )
     *	    .drag( function(e) {
     *		console.log( 'Mouse dragged: ' + JSON.stringify(e) );
     *		if( e.params.leftMouse ) ;
     *		else if( e.params.rightMouse ) ;
     *	    } )
     *	    .move( function(e) {
     *		console.log( 'Mouse moved: ' + JSON.stringify(e.params) );
     *	    } )
     *          .up( function(e) {
     *              console.log( 'Mouse up. Was dragged?', e.params.wasDragged );
     *          } )
     *          .down( function(e) {
     *              console.log( 'Mouse down.' );
     *          } )
     *          .click( function(e) {
     *              console.log( 'Click.' );
     *          } )
     *          .wheel( function(e) {
     *              console.log( 'Wheel. delta='+e.deltaY );
     *          } )
     *
     * @example
     *   // Typescript
     *   new MouseHandler( document.getElementById('mycanvas') )
     *	    .drag( (e:XMouseEvent) => {
     *		console.log( 'Mouse dragged: ' + JSON.stringify(e) );
     *		if( e.params.leftMouse ) ;
     *		else if( e.params.rightMouse ) ;
     *	    } )
     *	    .move( (e:XMouseEvent) => {
     *		console.log( 'Mouse moved: ' + JSON.stringify(e.params) );
     *	    } )
     *          .up( (e:XMouseEvent) => {
     *              console.log( 'Mouse up. Was dragged?', e.params.wasDragged );
     *          } )
     *          .down( (e:XMouseEvent) => {
     *              console.log( 'Mouse down.' );
     *          } )
     *          .click( (e:XMouseEvent) => {
     *              console.log( 'Click.' );
     *          } )
     *          .wheel( (e:XWheelEvent) => {
     *              console.log( 'Wheel. delta='+e.deltaY );
     *          } )
     *
     * @constructor
     * @instance
     * @memberof MouseHandler
     * @param {HTMLElement} element
     **/
    constructor(element, name) {
        this.mouseDownPos = undefined;
        this.mouseDragPos = undefined;
        // TODO: cc
        // private mousePos       : { x:number, y:number }|undefined = undefined;
        this.mouseButton = -1;
        this.listeners = {};
        this.installed = {};
        this.handlers = {};
        // +----------------------------------------------------------------------
        // | Some private vars to store the current mouse/position/button state.
        // +-------------------------------------------------
        this.name = name;
        this.element = element;
        this.mouseDownPos = undefined;
        this.mouseDragPos = undefined;
        // this.mousePos     = null;
        this.mouseButton = -1;
        this.listeners = {};
        this.installed = {};
        this.handlers = {};
        // +----------------------------------------------------------------------
        // | Define the internal event handlers.
        // |
        // | They will dispatch the modified event (relative mouse position,
        // | drag offset, ...) to the callbacks.
        // +-------------------------------------------------
        const _self = this;
        this.handlers["mousemove"] = (e) => {
            if (_self.listeners.mousemove)
                _self.listeners.mousemove(_self.mkParams(e, "mousemove"));
            if (_self.mouseDragPos && _self.listeners.drag)
                _self.listeners.drag(_self.mkParams(e, "drag"));
            if (_self.mouseDownPos)
                _self.mouseDragPos = _self.relPos(e);
        };
        this.handlers["mouseup"] = (e) => {
            if (_self.listeners.mouseup)
                _self.listeners.mouseup(_self.mkParams(e, "mouseup"));
            _self.mouseDragPos = undefined;
            _self.mouseDownPos = undefined;
            _self.mouseButton = -1;
        };
        this.handlers["mousedown"] = (e) => {
            _self.mouseDragPos = _self.relPos(e);
            _self.mouseDownPos = _self.relPos(e);
            _self.mouseButton = e.button;
            if (_self.listeners.mousedown)
                _self.listeners.mousedown(_self.mkParams(e, "mousedown"));
        };
        this.handlers["click"] = (e) => {
            if (_self.listeners.click)
                _self.listeners.click(_self.mkParams(e, "click"));
        };
        this.handlers["wheel"] = (e) => {
            if (_self.listeners.wheel)
                _self.listeners.wheel(_self.mkParams(e, "wheel"));
        };
        this.element.addEventListener("mousemove", this.handlers["mousemove"]);
        this.element.addEventListener("mouseup", this.handlers["mouseup"]);
        this.element.addEventListener("mousedown", this.handlers["mousedown"]);
        this.element.addEventListener("click", this.handlers["click"]);
        this.element.addEventListener("wheel", this.handlers["wheel"]);
    }
    /**
     * Get relative position from the given MouseEvent.
     *
     * @name relPos
     * @memberof MouseHandler
     * @instance
     * @private
     * @param {MouseEvent} e - The mouse event to get the relative position for.
     * @return {XYCoords} The relative mouse coordinates.
     */
    relPos(e) {
        return { x: e.offsetX, y: e.offsetY };
    }
    /**
     * Build the extended event params.
     *
     * @name mkParams
     * @memberof MouseHandler
     * @instance
     * @private
     * @param {MouseEvent} event - The mouse event to get the relative position for.
     * @param {string} eventName - The name of the firing event.
     * @return {XMouseEvent}
     */
    mkParams(event, eventName) {
        var _a, _b;
        const rel = this.relPos(event);
        const xEvent = event;
        xEvent.params = {
            element: this.element,
            name: eventName,
            isTouchEvent: false,
            pos: rel,
            button: event.button,
            leftButton: event.button === 0,
            middleButton: event.button === 1,
            rightButton: event.button === 2,
            mouseDownPos: (_a = this.mouseDownPos) !== null && _a !== void 0 ? _a : { x: NaN, y: NaN },
            draggedFrom: (_b = this.mouseDragPos) !== null && _b !== void 0 ? _b : { x: NaN, y: NaN },
            wasDragged: this.mouseDownPos != null && (this.mouseDownPos.x != rel.x || this.mouseDownPos.y != rel.y),
            dragAmount: this.mouseDragPos != null ? { x: rel.x - this.mouseDragPos.x, y: rel.y - this.mouseDragPos.y } : { x: 0, y: 0 }
        };
        return xEvent;
    }
    /**
     * Install a new listener.
     * Please note that this mouse handler can only handle one listener per event type.
     *
     * @name listenFor
     * @memberof MouseHandler
     * @instance
     * @private
     * @param {string} eventName - The name of the firing event to listen for.
     * @return {void}
     */
    listenFor(eventName) {
        if (this.installed[eventName])
            return;
        // In the new version 1.1.0 has all internal listeners installed by default.
        this.installed[eventName] = true;
    }
    /**
     * Un-install a new listener.
     *
     * @name listenFor
     * @memberof MouseHandler
     * @instance
     * @private
     * @param {string} eventName - The name of the firing event to unlisten for.
     * @return {void}
     */
    unlistenFor(eventName) {
        if (!this.installed[eventName])
            return;
        // In the new version 1.1.0 has all internal listeners installed by default.
        delete this.installed[eventName];
    }
    /**
     * Installer function to listen for a specific event: mouse-drag.
     * Pass your callbacks here.
     *
     * Note: this support chaining.
     *
     * @name drag
     * @memberof MouseHandler
     * @instance
     * @param {XMouseCallback} callback - The drag-callback to listen for.
     * @return {MouseHandler} this
     */
    drag(callback) {
        if (this.listeners.drag)
            this.throwAlreadyInstalled("drag");
        this.listeners.drag = callback;
        this.listenFor("mousedown");
        this.listenFor("mousemove");
        this.listenFor("mouseup");
        return this;
    }
    /**
     * Installer function to listen for a specific event: mouse-move.
     * Pass your callbacks here.
     *
     * Note: this support chaining.
     *
     * @name move
     * @memberof MouseHandler
     * @instance
     * @param {XMouseCallback} callback - The move-callback to listen for.
     * @return {MouseHandler} this
     */
    move(callback) {
        if (this.listeners.mousemove)
            this.throwAlreadyInstalled("mousemove");
        this.listenFor("mousemove");
        this.listeners.mousemove = callback;
        return this;
    }
    /**
     * Installer function to listen for a specific event: mouse-up.
     * Pass your callbacks here.
     *
     * Note: this support chaining.
     *
     * @name up
     * @memberof MouseHandler
     * @instance
     * @param {XMouseCallback} callback - The up-callback to listen for.
     * @return {MouseHandler} this
     */
    up(callback) {
        if (this.listeners.mouseup)
            this.throwAlreadyInstalled("mouseup");
        this.listenFor("mouseup");
        this.listeners.mouseup = callback;
        return this;
    }
    /**
     * Installer function to listen for a specific event: mouse-down.
     * Pass your callbacks here.
     *
     * Note: this support chaining.
     *
     * @name down
     * @memberof MouseHandler
     * @instance
     * @param {XMouseCallback} callback - The down-callback to listen for.
     * @return {MouseHandler} this
     */
    down(callback) {
        if (this.listeners.mousedown)
            this.throwAlreadyInstalled("mousedown");
        this.listenFor("mousedown");
        this.listeners.mousedown = callback;
        return this;
    }
    /**
     * Installer function to listen for a specific event: mouse-click.
     * Pass your callbacks here.
     *
     * Note: this support chaining.
     *
     * @name click
     * @memberof MouseHandler
     * @instance
     * @param {XMouseCallback} callback - The click-callback to listen for.
     * @return {MouseHandler} this
     */
    click(callback) {
        if (this.listeners.click)
            this.throwAlreadyInstalled("click");
        this.listenFor("click");
        this.listeners.click = callback;
        return this;
    }
    /**
     * Installer function to listen for a specific event: mouse-wheel.
     * Pass your callbacks here.
     *
     * Note: this support chaining.
     *
     * @name wheel
     * @memberof MouseHandler
     * @instance
     * @param {XWheelCallback} callback - The wheel-callback to listen for.
     * @return {MouseHandler} this
     */
    wheel(callback) {
        if (this.listeners.wheel)
            this.throwAlreadyInstalled("wheel");
        this.listenFor("wheel");
        this.listeners.wheel = callback;
        return this;
    }
    /**
     * An internal function to throw events.
     *
     * @name throwAlreadyInstalled
     * @memberof MouseHandler
     * @instance
     * @private
     * @param {string} name - The name of the event.
     * @return {void}
     */
    throwAlreadyInstalled(name) {
        throw `This MouseHandler already has a '${name}' callback. To keep the code simple there is only room for one.`;
    }
    /**
     * Call this when your work is done.
     *
     * The function will un-install all event listeners.
     *
     * @name destroy
     * @memberof MouseHandler
     * @instance
     * @private
     * @return {void}
     */
    destroy() {
        this.unlistenFor("mousedown");
        this.unlistenFor("mousemove");
        this.unlistenFor("moseup");
        this.unlistenFor("click");
        this.unlistenFor("wheel");
        this.element.removeEventListener("mousemove", this.handlers["mousemove"]);
        this.element.removeEventListener("mouseup", this.handlers["mousedown"]);
        this.element.removeEventListener("mousedown", this.handlers["mousedown"]);
        this.element.removeEventListener("click", this.handlers["click"]);
        this.element.removeEventListener("wheel", this.handlers["wheel"]);
    }
}
//# sourceMappingURL=MouseHandler.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/PBImage.js":
/*!*********************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/PBImage.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PBImage: () => (/* binding */ PBImage)
/* harmony export */ });
/* harmony import */ var _UIDGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UIDGenerator */ "./node_modules/plotboilerplate/src/esm/UIDGenerator.js");
/**
 * @author   Ikaros Kappler
 * @date     2019-01-30
 * @modified 2019-03-23 Added JSDoc tags.
 * @modified 2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @modified 2021-01-20 Added UID.
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2022-02-02 Cleared the `PBImage.toSVGString` function (deprecated). Use `drawutilssvg` instead.
 * @version 1.2.0
 *
 * @file PBImage
 * @fileoverview As native Image objects have only a position and with
 *               and height thei are not suitable for UI dragging interfaces.
 * @public
 **/

/**
 * @classdesc A wrapper for image objects. Has an upper left and a lower right corner point.
 *
 * @requires Vertex
 * @requires SVGSerializable
 * @requires UID
 * @requires UIDGenerator
 */
class PBImage {
    /**
     * The constructor.
     *
     * @constructor
     * @name PBImage
     * @param {Image} image - The actual image.
     * @param {Vertex} upperLeft - The upper left corner.
     * @param {Vertex} lowerRight - The lower right corner.
     **/
    constructor(image, upperLeft, lowerRight) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "PBImage";
        this.uid = _UIDGenerator__WEBPACK_IMPORTED_MODULE_0__.UIDGenerator.next();
        this.image = image;
        this.upperLeft = upperLeft;
        this.lowerRight = lowerRight;
    }
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    destroy() {
        this.upperLeft.destroy();
        this.lowerRight.destroy();
        this.isDestroyed = true;
    }
}
//# sourceMappingURL=PBImage.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/PBText.js":
/*!********************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/PBText.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PBText: () => (/* binding */ PBText)
/* harmony export */ });
/* harmony import */ var _UIDGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UIDGenerator */ "./node_modules/plotboilerplate/src/esm/UIDGenerator.js");
/* harmony import */ var _Vertex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Vertex */ "./node_modules/plotboilerplate/src/esm/Vertex.js");
/**
 * @author   Ikaros Kappler
 * @date     2021-11-16
 * @modified 2022-02-02 Added the `destroy` method.
 * @version  1.1.0
 **/


/**
 * @classdesc A simple text element: position, fontSize, fontFamily, color, textAlign, lineHeight and rotation.
 *
 * @requires FontOptions
 * @requires FontSize
 * @requires FontStyle
 * @requires FontWeight
 * @requires Vertex
 * @requires SVGSerializale
 * @requires UID
 * @requires UIDGenerator
 **/
class PBText {
    /**
     * Create a new circle with given center point and radius.
     *
     * @constructor
     * @name Circle
     * @param {Vertex} center - The center point of the circle.
     * @param {number} radius - The radius of the circle.
     */
    constructor(text, anchor, options) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "PBText";
        this.uid = _UIDGenerator__WEBPACK_IMPORTED_MODULE_0__.UIDGenerator.next();
        this.text = text;
        this.anchor = anchor !== null && anchor !== void 0 ? anchor : new _Vertex__WEBPACK_IMPORTED_MODULE_1__.Vertex();
        this.color = options.color;
        this.fontFamily = options.fontFamily;
        this.fontSize = options.fontSize;
        this.fontStyle = options.fontStyle;
        this.fontWeight = options.fontWeight;
        this.lineHeight = options.lineHeight;
        this.textAlign = options.textAlign;
        this.rotation = options.rotation;
    }
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    destroy() {
        this.anchor.destroy();
        this.isDestroyed = true;
    }
} // END class
//# sourceMappingURL=PBText.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/PlotBoilerplate.js":
/*!*****************************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/PlotBoilerplate.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PlotBoilerplate: () => (/* binding */ PlotBoilerplate),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var alloyfinger_typescript__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! alloyfinger-typescript */ "./node_modules/alloyfinger-typescript/src/esm/index.js");
/* harmony import */ var _draw__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./draw */ "./node_modules/plotboilerplate/src/esm/draw.js");
/* harmony import */ var _drawgl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./drawgl */ "./node_modules/plotboilerplate/src/esm/drawgl.js");
/* harmony import */ var _drawutilssvg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./drawutilssvg */ "./node_modules/plotboilerplate/src/esm/drawutilssvg.js");
/* harmony import */ var _BezierPath__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./BezierPath */ "./node_modules/plotboilerplate/src/esm/BezierPath.js");
/* harmony import */ var _Bounds__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Bounds */ "./node_modules/plotboilerplate/src/esm/Bounds.js");
/* harmony import */ var _Circle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Circle */ "./node_modules/plotboilerplate/src/esm/Circle.js");
/* harmony import */ var _CircleSector__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./CircleSector */ "./node_modules/plotboilerplate/src/esm/CircleSector.js");
/* harmony import */ var _Grid__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Grid */ "./node_modules/plotboilerplate/src/esm/Grid.js");
/* harmony import */ var _KeyHandler__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./KeyHandler */ "./node_modules/plotboilerplate/src/esm/KeyHandler.js");
/* harmony import */ var _Line__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Line */ "./node_modules/plotboilerplate/src/esm/Line.js");
/* harmony import */ var _MouseHandler__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./MouseHandler */ "./node_modules/plotboilerplate/src/esm/MouseHandler.js");
/* harmony import */ var _PBImage__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./PBImage */ "./node_modules/plotboilerplate/src/esm/PBImage.js");
/* harmony import */ var _Polygon__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./Polygon */ "./node_modules/plotboilerplate/src/esm/Polygon.js");
/* harmony import */ var _Triangle__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./Triangle */ "./node_modules/plotboilerplate/src/esm/Triangle.js");
/* harmony import */ var _VEllipse__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./VEllipse */ "./node_modules/plotboilerplate/src/esm/VEllipse.js");
/* harmony import */ var _VEllipseSector__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./VEllipseSector */ "./node_modules/plotboilerplate/src/esm/VEllipseSector.js");
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./Vector */ "./node_modules/plotboilerplate/src/esm/Vector.js");
/* harmony import */ var _Vertex__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./Vertex */ "./node_modules/plotboilerplate/src/esm/Vertex.js");
/* harmony import */ var _VertexAttr__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./VertexAttr */ "./node_modules/plotboilerplate/src/esm/VertexAttr.js");
/* harmony import */ var _PBText__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./PBText */ "./node_modules/plotboilerplate/src/esm/PBText.js");
/**
 * @author   Ikaros Kappler
 * @date     2018-10-23
 * @modified 2018-11-19 Added multi-select and multi-drag.
 * @modified 2018-12-04 Added basic SVG export.
 * @modified 2018-12-09 Extended the constructor (canvas).
 * @modified 2018-12-18 Added the config.redrawOnResize param.
 * @modified 2018-12-18 Added the config.defaultCanvas{Width,Height} params.
 * @modified 2018-12-19 Added CSS scaling.
 * @modified 2018-12-28 Removed the unused 'drawLabel' param. Added the 'enableMouse' and 'enableKeys' params.
 * @modified 2018-12-29 Added the 'drawOrigin' param.
 * @modified 2018-12-29 Renamed the 'autoCenterOffset' param to 'autoAdjustOffset'. Added the params 'offsetAdjustXPercent' and 'offsetAdjustYPercent'.
 * @modified 2019-01-14 Added params 'drawBezierHandleLines' and 'drawBezierHandlePoints'. Added the 'redraw' praam to the add() function.
 * @modified 2019-01-16 Added params 'drawHandleLines' and 'drawHandlePoints'. Added the new params to the dat.gui interface.
 * @modified 2019-01-30 Added the 'Vector' type (extending the Line class).
 * @modified 2019-01-30 Added the 'PBImage' type (a wrapper for images).
 * @modified 2019-02-02 Added the 'canvasWidthFactor' and 'canvasHeightFactor' params.
 * @modified 2019-02-03 Removed the drawBackgroundImage() function, with had no purpose at all. Just add an image to the drawables-list.
 * @modified 2019-02-06 Vertices (instace of Vertex) can now be added. Added the 'draggable' attribute to the vertex attributes.
 * @modified 2019-02-10 Fixed a draggable-bug in PBImage handling (scaling was not possible).
 * @modified 2019-02-10 Added the 'enableTouch' option (default is true).
 * @modified 2019-02-14 Added the console for debugging (setConsole(object)).
 * @modified 2019-02-19 Added two new constants: DEFAULT_CLICK_TOLERANCE and DEFAULT_TOUCH_TOLERANCE.
 * @modified 2019-02-19 Added the second param to the locatePointNear(Vertex,Number) function.
 * @modified 2019-02-20 Removed the 'loadFile' entry from the GUI as it was experimental and never in use.
 * @modified 2019-02-23 Removed the 'rebuild' function as it had no purpose.
 * @modified 2019-02-23 Added scaling of the click-/touch-tolerance with the CSS scale.
 * @modified 2019-03-23 Added JSDoc tags. Changed the default value of config.drawOrigin to false.
 * @modified 2019-04-03 Fixed the touch-drag position detection for canvas elements that are not located at document position (0,0).
 * @modified 2019-04-03 Tweaked the fit-to-parent function to work with paddings and borders.
 * @modified 2019-04-28 Added the preClear callback param (called before the canvas was cleared on redraw and before any elements are drawn).
 * @modified 2019-09-18 Added basics for WebGL support (strictly experimental).
 * @modified 2019-10-03 Added the .beginDrawCycle call in the redraw function.
 * @modified 2019-11-06 Added fetch.num, fetch.val, fetch.bool, fetch.func functions.
 * @modified 2019-11-13 Fixed an issue with the mouse-sensitive area around vertices (were affected by zoom).
 * @modified 2019-11-13 Added the 'enableMouseWheel' param.
 * @modified 2019-11-18 Added the Triangle class as a regular drawable element.
 * @modified 2019-11-18 The add function now works with arrays, too.
 * @modified 2019-11-18 Added the _handleColor helper function to determine the render color of non-draggable vertices.
 * @modified 2019-11-19 Fixed a bug in the resizeCanvas function; retina resolution was not possible.
 * @modified 2019-12-04 Added relative positioned zooming.
 * @modified 2019-12-04 Added offsetX and offsetY params.
 * @modified 2019-12-04 Added an 'Set to fullsize retina' button to the GUI config.
 * @modified 2019-12-07 Added the drawConfig for lines, polygons, ellipse, triangles, bezier curves and image control lines.
 * @modified 2019-12-08 Fixed a css scale bug in the viewport() function.
 * @modified 2019-12-08 Added the drawconfig UI panel (line colors and line widths).
 * @modified 2020-02-06 Added handling for the end- and end-control-points of non-cirular Bézier paths (was still missing).
 * @modified 2020-02-06 Fixed a drag-amount bug in the move handling of end points of Bezier paths (control points was not properly moved when non circular).
 * @modified 2020-03-28 Ported this class from vanilla-JS to Typescript.
 * @modified 2020-03-29 Fixed the enableSVGExport flag (read enableEport before).
 * @modified 2020-05-09 Included the Cirlcle class.
 * @modified 2020-06-22 Added the rasterScaleX and rasterScaleY config params.
 * @modified 2020-06-03 Fixed the selectedVerticesOnPolyon(Polygon) function: non-selectable vertices were selected too, before.
 * @modified 2020-07-06 Replacing Touchy.js by AlloyFinger.js
 * @modified 2020-07-27 Added the getVertexNear(XYCoords,number) function
 * @modified 2020-07-27 Extended the remove(Drawable) function: vertices are now removed, too.
 * @modified 2020-07-28 Added PlotBoilerplate.revertMousePosition(number,number) –  the inverse function of transformMousePosition(...).
 * @modified 2020-07-31 Added PlotBoilerplate.getDraggedElementCount() to check wether any elements are currently being dragged.
 * @modified 2020-08-19 Added the VertexAttributes.visible attribute to make vertices invisible.
 * @modified 2020-11-17 Added pure click handling (no dragEnd and !wasMoved jiggliny any more) to the PlotBoilerplate.
 * @modified 2020-12-11 Added the `removeAll(boolean)` function.
 * @modified 2020-12-17 Added the `CircleSector` drawable.
 * @modified 2021-01-04 Avoiding multiple redraw call on adding multiple Drawables (array).
 * @modified 2021-01-08 Added param `draw:DraLib<void>` to the methods `drawVertices`, `drawGrid` and `drawSelectPolygon`.
 * @modified 2021-01-08 Added the customizable `drawAll(...)` function.
 * @modified 2021-01-09 Added the `drawDrawable(...)` function.
 * @modified 2021-01-10 Added the `eventCatcher` element (used to track mouse events on SVGs).
 * @modified 2021-01-26 Fixed SVG resizing.
 * @modified 2021-01-26 Replaced the old SVGBuilder by the new `drawutilssvg` library.
 * @modified 2021-02-08 Fixed a lot of es2015 compatibility issues.
 * @modified 2021-02-18 Adding `adjustOffset(boolean)` function.
 * @modified 2021-03-01 Updated the `PlotBoilerplate.draw(...)` function: ellipses are now rotate-able.
 * @modified 2021-03-03 Added the `VEllipseSector` drawable.
 * @modified 2021-03-29 Clearing `currentClassName` and `currentId` after drawing each drawable.
 * @modified 2021-04-25 Extending `remove` to accept arrays of drawables.
 * @modified 2021-11-16 Adding the `PBText` drawable.
 * @modified 2022-08-01 Added `title` to the params.
 * @modified 2022-10-25 Added the `origin` to the default draw config.
 * @modified 2022-11-06 Adding an XML declaration to the SVG export routine.
 * @modified 2022-11-23 Added the `drawRaster` (default=true) option to the config/drawconfig.
 * @modified 2023-02-04 Fixed a bug in the `drawDrawable` function; fill's current classname was not set.
 * @modified 2023-02-10 Fixing an issue of the `style.position` setting when `fitToParent=true` from `absolute` to `static` (default).
 * @modified 2023-02-10 Cleaning up most type errors in the main class (mostly null checks).
 * @modified 2023-02-10 Adding `enableZoom` and `enablePan` (both default true) to have the option to disable these functions.
 * @version  1.17.2
 *
 * @file PlotBoilerplate
 * @fileoverview The main class.
 * @public
 **/
var _a;





















/**
 * @classdesc The main class of the PlotBoilerplate.
 *
 * @requires Vertex
 * @requires Line
 * @requires Vector
 * @requires Polygon
 * @requires PBImage
 * @requires VEllipse
 * @requires Circle
 * @requires MouseHandler
 * @requires KeyHandler
 * @requires VertexAttr
 * @requires CubicBezierCurve
 * @requires BezierPath
 * @requires Drawable
 * @requires DrawConfig
 * @requires IHooks
 * @requires PBParams
 * @requires Triangle
 * @requires drawutils
 * @requires drawutilsgl
 * @requires SVGSerializable
 * @requires XYCoords
 * @requires XYDimension
 */
class PlotBoilerplate {
    /**
     * The constructor.
     *
     * @constructor
     * @name PlotBoilerplate
     * @public
     * @param {object} config={} - The configuration.
     * @param {HTMLCanvasElement} config.canvas - Your canvas element in the DOM (required).
     * @param {boolean=} [config.fullSize=true] - If set to true the canvas will gain full window size.
     * @param {boolean=} [config.fitToParent=true] - If set to true the canvas will gain the size of its parent container (overrides fullSize).
     * @param {number=}  [config.scaleX=1.0] - The initial x-zoom. Default is 1.0.
     * @param {number=}  [config.scaleY=1.0] - The initial y-zoom. Default is 1.0.
     * @param {number=}  [config.offsetX=1.0] - The initial x-offset. Default is 0.0. Note that autoAdjustOffset=true overrides these values.
     * @param {number=}  [config.offsetY=1.0] - The initial y-offset. Default is 0.0. Note that autoAdjustOffset=true overrides these values.
     * @param {boolean=} [config.rasterGrid=true] - If set to true the background grid will be drawn rastered.
     * @param {boolean=} [config.rasterScaleX=1.0] - Define the default horizontal raster scale (default=1.0).
     * @param {boolean=} [config.rasterScaleY=1.0] - Define the default vertical raster scale (default=1.0).
     * @param {number=}  [config.rasterAdjustFactor=1.0] - The exponential limit for wrapping down the grid. (2.0 means: halve the grid each 2.0*n zoom step).
     * @param {boolean=} [config.drawOrigin=false] - Draw a crosshair at (0,0).
     * @param {boolean=} [config.autoAdjustOffset=true] -  When set to true then the origin of the XY plane will
     *                         be re-adjusted automatically (see the params
     *                         offsetAdjust{X,Y}Percent for more).
     * @param {number=}  [config.offsetAdjustXPercent=50] - The x-fallback position for the origin after
     *                         resizing the canvas.
     * @param {number=}  [config.offsetAdjustYPercent=50] - The y-fallback position for the origin after
     *                         resizing the canvas.
     * @param {number=}  [config.defaultCanvasWidth=1024] - The canvas size fallback (width) if no automatic resizing
     *                         is switched on.
     * @param {number=}  [config.defaultCanvasHeight=768] - The canvas size fallback (height) if no automatic resizing
     *                         is switched on.
     * @param {number=}  [config.canvasWidthFactor=1.0] - Scaling factor (width) upon the canvas size.
     *                         In combination with cssScale{X,Y} this can be used to obtain
     *                         sub pixel resolutions for retina displays.
     * @param {number=}  [config.canvasHeightFactor=1.0] - Scaling factor (height) upon the canvas size.
     *                         In combination with cssScale{X,Y} this can be used to obtain
     *                         sub pixel resolutions for retina displays.
     * @param {number=}  [config.cssScaleX=1.0] - Visually resize the canvas (horizontally) using CSS transforms (scale).
     * @param {number=}  [config.cssScaleY=1.0] - Visually resize the canvas (vertically) using CSS transforms (scale).
     * @param {boolan=}  [config.cssUniformScale=true] - CSS scale x and y obtaining aspect ratio.
     * @param {boolean=} [config.autoDetectRetina=true] - When set to true (default) the canvas will try to use the display's pixel ratio.
     * @param {string=}  [config.backgroundColor=#ffffff] - The backround color.
     * @param {boolean=} [config.redrawOnResize=true] - Switch auto-redrawing on resize on/off (some applications
     *                         might want to prevent automatic redrawing to avoid data loss from the draw buffer).
     * @param {boolean=} [config.drawBezierHandleLines=true] - Indicates if Bézier curve handles should be drawn (used for
     *                         editors, no required in pure visualizations).
     * @param {boolean=} [config.drawBezierHandlePoints=true] - Indicates if Bézier curve handle points should be drawn.
     * @param {function=} [config.preClear=null] - A callback function that will be triggered just before the
     *                         draw function clears the canvas (before anything else was drawn).
     * @param {function=} [config.preDraw=null] - A callback function that will be triggered just before the draw
     *                         function starts.
     * @param {function=} [config.postDraw=null] - A callback function that will be triggered right after the drawing
     *                         process finished.
     * @param {boolean=} [config.enableMouse=true] - Indicates if the application should handle mouse events for you.
     * @param {boolean=} [config.enableTouch=true] - Indicates if the application should handle touch events for you.
     * @param {boolean=} [config.enableKeys=true] - Indicates if the application should handle key events for you.
     * @param {boolean=} [config.enableMouseWheel=true] - Indicates if the application should handle mouse wheel events for you.
     * @param {boolean=} [config.enablePan=true] - (default true) Set to false if you want to disable panning completely.
     * @param {boolean=} [config.enableZoom=true] - (default true) Set to false if you want to disable zooming completely.
     * @param {boolean=} [config.enableGL=false] - Indicates if the application should use the experimental WebGL features (not recommended).
     * @param {boolean=} [config.enableSVGExport=true] - Indicates if the SVG export should be enabled (default is true).
     *                                                   Note that changes from the postDraw hook might not be visible in the export.
     * @param {string=} [config.title=null] - Specify any hover tile here. It will be attached as a `title` attribute to the most elevated element.
     */
    constructor(config) {
        var _a, _b;
        /**
         * A discrete timestamp to identify single render cycles.
         * Note that using system time milliseconds is not a safe way to identify render frames, as on modern powerful machines
         * multiple frames might be rendered within each millisecond.
         * @member {number}
         * @memberof plotboilerplate
         * @instance
         * @private
         */
        this.renderTime = 0;
        // This should be in some static block ...
        _VertexAttr__WEBPACK_IMPORTED_MODULE_19__.VertexAttr.model = {
            bezierAutoAdjust: false,
            renderTime: 0,
            selectable: true,
            isSelected: false,
            draggable: true,
            visible: true
        };
        if (typeof config.canvas == "undefined") {
            throw "No canvas specified.";
        }
        /**
         * A global config that's attached to the dat.gui control interface.
         *
         * @member {Object}
         * @memberof PlotBoilerplate
         * @instance
         */
        const f = PlotBoilerplate.utils.fetch;
        this.config = {
            canvas: config.canvas,
            fullSize: f.val(config, "fullSize", true),
            fitToParent: f.bool(config, "fitToParent", true),
            scaleX: f.num(config, "scaleX", 1.0),
            scaleY: f.num(config, "scaleY", 1.0),
            offsetX: f.num(config, "offsetX", 0.0),
            offsetY: f.num(config, "offsetY", 0.0),
            rasterGrid: f.bool(config, "rasterGrid", true),
            drawRaster: f.bool(config, "drawRaster", true),
            rasterScaleX: f.num(config, "rasterScaleX", 1.0),
            rasterScaleY: f.num(config, "rasterScaleY", 1.0),
            rasterAdjustFactor: f.num(config, "rasterAdjustdFactror", 2.0),
            drawOrigin: f.bool(config, "drawOrigin", false),
            autoAdjustOffset: f.val(config, "autoAdjustOffset", true),
            offsetAdjustXPercent: f.num(config, "offsetAdjustXPercent", 50),
            offsetAdjustYPercent: f.num(config, "offsetAdjustYPercent", 50),
            backgroundColor: config.backgroundColor || "#ffffff",
            redrawOnResize: f.bool(config, "redrawOnResize", true),
            defaultCanvasWidth: f.num(config, "defaultCanvasWidth", PlotBoilerplate.DEFAULT_CANVAS_WIDTH),
            defaultCanvasHeight: f.num(config, "defaultCanvasHeight", PlotBoilerplate.DEFAULT_CANVAS_HEIGHT),
            canvasWidthFactor: f.num(config, "canvasWidthFactor", 1.0),
            canvasHeightFactor: f.num(config, "canvasHeightFactor", 1.0),
            cssScaleX: f.num(config, "cssScaleX", 1.0),
            cssScaleY: f.num(config, "cssScaleY", 1.0),
            cssUniformScale: f.bool(config, "cssUniformScale", true),
            saveFile: () => {
                _self.hooks.saveFile(_self);
            },
            setToRetina: () => {
                _self._setToRetina();
            },
            autoDetectRetina: f.bool(config, "autoDetectRetina", true),
            enableSVGExport: f.bool(config, "enableSVGExport", true),
            // Listeners/observers
            preClear: f.func(config, "preClear", null),
            preDraw: f.func(config, "preDraw", null),
            postDraw: f.func(config, "postDraw", null),
            // Interaction
            enableMouse: f.bool(config, "enableMouse", true),
            enableTouch: f.bool(config, "enableTouch", true),
            enableKeys: f.bool(config, "enableKeys", true),
            enableMouseWheel: f.bool(config, "enableMouseWheel", true),
            enableZoom: f.bool(config, "enableZoom", true),
            enablePan: f.bool(config, "enablePan", true),
            // Experimental (and unfinished)
            enableGL: f.bool(config, "enableGL", false)
        }; // END confog
        /**
         * Configuration for drawing things.
         *
         * @member {Object}
         * @memberof PlotBoilerplate
         * @instance
         */
        this.drawConfig = {
            drawVertices: true,
            drawBezierHandleLines: f.bool(config, "drawBezierHandleLines", true),
            drawBezierHandlePoints: f.bool(config, "drawBezierHandlePoints", true),
            drawHandleLines: f.bool(config, "drawHandleLines", true),
            drawHandlePoints: f.bool(config, "drawHandlePoints", true),
            drawGrid: f.bool(config, "drawGrid", true),
            drawRaster: f.bool(config, "drawRaster", true),
            bezier: {
                color: "#00a822",
                lineWidth: 2,
                handleLine: {
                    color: "rgba(180,180,180,0.5)",
                    lineWidth: 1
                },
                pathVertex: {
                    color: "#B400FF",
                    lineWidth: 1,
                    fill: true
                },
                controlVertex: {
                    color: "#B8D438",
                    lineWidth: 1,
                    fill: true
                }
            },
            polygon: {
                color: "#0022a8",
                lineWidth: 1
            },
            triangle: {
                color: "#6600ff",
                lineWidth: 1
            },
            ellipse: {
                color: "#2222a8",
                lineWidth: 1
            },
            ellipseSector: {
                color: "#a822a8",
                lineWidth: 2
            },
            circle: {
                color: "#22a8a8",
                lineWidth: 2
            },
            circleSector: {
                color: "#2280a8",
                lineWidth: 1
            },
            vertex: {
                color: "#a8a8a8",
                lineWidth: 1
            },
            selectedVertex: {
                color: "#c08000",
                lineWidth: 2
            },
            line: {
                color: "#a844a8",
                lineWidth: 1
            },
            vector: {
                color: "#ff44a8",
                lineWidth: 1
            },
            image: {
                color: "#a8a8a8",
                lineWidth: 1
            },
            text: {
                color: "rgba(192,0,128,0.5)",
                lineWidth: 1,
                fill: true,
                anchor: true
            },
            origin: {
                color: "#000000"
            }
        }; // END drawConfig
        // +---------------------------------------------------------------------------------
        // | Object members.
        // +-------------------------------
        this.grid = new _Grid__WEBPACK_IMPORTED_MODULE_8__.Grid(new _Vertex__WEBPACK_IMPORTED_MODULE_18__.Vertex(0, 0), new _Vertex__WEBPACK_IMPORTED_MODULE_18__.Vertex(50, 50));
        this.canvasSize = { width: PlotBoilerplate.DEFAULT_CANVAS_WIDTH, height: PlotBoilerplate.DEFAULT_CANVAS_HEIGHT };
        const canvasElement = typeof config.canvas == "string" ? document.querySelector(config.canvas) : config.canvas;
        // Which renderer to use: Canvas2D, WebGL (experimental) or SVG?
        if (canvasElement.tagName.toLowerCase() === "canvas") {
            this.canvas = canvasElement;
            this.eventCatcher = this.canvas;
            if (this.config.enableGL && typeof _drawgl__WEBPACK_IMPORTED_MODULE_2__.drawutilsgl === "undefined") {
                console.warn(`Cannot use webgl. Package was compiled without experimental gl support. Please use plotboilerplate-glsupport.min.js instead.`);
                console.warn(`Disabling GL and falling back to Canvas2D.`);
                this.config.enableGL = false;
            }
            if (this.config.enableGL) {
                // Override the case 'null' here. If GL is not supported, well then nothing works.
                const ctx = this.canvas.getContext("webgl"); // webgl-experimental?
                this.draw = new _drawgl__WEBPACK_IMPORTED_MODULE_2__.drawutilsgl(ctx, false);
                // PROBLEM: same instance of fill and draw when using WebGL.
                //          Shader program cannot be duplicated on the same context.
                this.fill = this.draw.copyInstance(true);
                console.warn("Initialized with experimental mode enableGL=true. Note that this is not yet fully implemented.");
            }
            else {
                // Override the case 'null' here. If context creation is not supported, well then nothing works.
                const ctx = this.canvas.getContext("2d");
                this.draw = new _draw__WEBPACK_IMPORTED_MODULE_1__.drawutils(ctx, false);
                this.fill = new _draw__WEBPACK_IMPORTED_MODULE_1__.drawutils(ctx, true);
            }
        }
        else if (canvasElement.tagName.toLowerCase() === "svg") {
            if (typeof _drawutilssvg__WEBPACK_IMPORTED_MODULE_3__.drawutilssvg === "undefined")
                throw `The svg draw library is not yet integrated part of PlotBoilerplate. Please include ./src/js/utils/helpers/drawutils.svg into your document.`;
            this.canvas = canvasElement;
            this.draw = new _drawutilssvg__WEBPACK_IMPORTED_MODULE_3__.drawutilssvg(this.canvas, new _Vertex__WEBPACK_IMPORTED_MODULE_18__.Vertex(), // offset
            new _Vertex__WEBPACK_IMPORTED_MODULE_18__.Vertex(), // scale
            this.canvasSize, false, // fillShapes=false
            this.drawConfig, false // isSecondary=false
            );
            this.fill = this.draw.copyInstance(true); // fillShapes=true
            if (this.canvas.parentElement) {
                this.eventCatcher = document.createElement("div");
                this.eventCatcher.style.position = "absolute";
                this.eventCatcher.style.left = "0";
                this.eventCatcher.style.top = "0";
                this.eventCatcher.style.cursor = "pointer";
                this.canvas.parentElement.style.position = "relative";
                this.canvas.parentElement.appendChild(this.eventCatcher);
            }
            else {
                this.eventCatcher = document.body;
            }
        }
        else {
            throw "Element is neither a canvas nor an svg element.";
        }
        // At this point the event cacher element is deinfed and located at highest elevation.
        // Set `title` attribut?
        if (config.title) {
            this.eventCatcher.setAttribute("title", config.title);
        }
        this.draw.scale.set((_a = this.config.scaleX) !== null && _a !== void 0 ? _a : 1.0, this.config.scaleY);
        this.fill.scale.set((_b = this.config.scaleX) !== null && _b !== void 0 ? _b : 1.0, this.config.scaleY);
        this.vertices = [];
        this.selectPolygon = null;
        this.draggedElements = [];
        this.drawables = [];
        this.console = console;
        this.hooks = {
            // This is changable from the outside
            saveFile: PlotBoilerplate._saveFile
        };
        var _self = this;
        globalThis.addEventListener("resize", () => _self.resizeCanvas());
        this.resizeCanvas();
        if (config.autoDetectRetina) {
            this._setToRetina();
        }
        this.installInputListeners();
        // Apply the configured CSS scale.
        this.updateCSSscale();
        // Init
        this.redraw();
        // Gain focus
        this.canvas.focus();
    } // END constructor
    /**
     * This function opens a save-as file dialog and – once an output file is
     * selected – stores the current canvas contents as an SVG image.
     *
     * It is the default hook for saving files and can be overwritten.
     *
     * @method _saveFile
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     * @private
     **/
    static _saveFile(pb) {
        // Create fake SVG node
        const svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        // Draw everything to fake node.
        var tosvgDraw = new _drawutilssvg__WEBPACK_IMPORTED_MODULE_3__.drawutilssvg(svgNode, pb.draw.offset, pb.draw.scale, pb.canvasSize, false, // fillShapes=false
        pb.drawConfig);
        var tosvgFill = tosvgDraw.copyInstance(true); // fillShapes=true
        tosvgDraw.beginDrawCycle(0);
        tosvgFill.beginDrawCycle(0);
        if (pb.config.preClear) {
            pb.config.preClear();
        }
        tosvgDraw.clear(pb.config.backgroundColor || "white");
        if (pb.config.preDraw) {
            pb.config.preDraw(tosvgDraw, tosvgFill);
        }
        pb.drawAll(0, tosvgDraw, tosvgFill);
        pb.drawVertices(0, tosvgDraw);
        if (pb.config.postDraw)
            pb.config.postDraw(tosvgDraw, tosvgFill);
        tosvgDraw.endDrawCycle(0);
        tosvgFill.endDrawCycle(0);
        // Full support in all browsers \o/
        //    https://caniuse.com/xml-serializer
        var serializer = new XMLSerializer();
        var svgCode = serializer.serializeToString(svgNode);
        // Add: '<?xml version="1.0" encoding="utf-8"?>\n' ?
        var blob = new Blob(['<?xml version="1.0" encoding="utf-8"?>\n' + svgCode], { type: "image/svg;charset=utf-8" });
        // See documentation for FileSaver.js for usage.
        //    https://github.com/eligrey/FileSaver.js
        if (typeof globalThis["saveAs"] !== "function")
            throw "Cannot save file; did you load the ./utils/savefile helper function and the eligrey/SaveFile library?";
        var _saveAs = globalThis["saveAs"];
        _saveAs(blob, "plotboilerplate.svg");
    }
    /**
     * This function sets the canvas resolution to factor 2.0 (or the preferred pixel ratio of your device) for retina displays.
     * Please not that in non-GL mode this might result in very slow rendering as the canvas buffer size may increase.
     *
     * @method _setToRetina
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     * @private
     **/
    _setToRetina() {
        this.config.autoDetectRetina = true;
        const pixelRatio = globalThis.devicePixelRatio || 1;
        this.config.cssScaleX = this.config.cssScaleY = 1.0 / pixelRatio;
        this.config.canvasWidthFactor = this.config.canvasHeightFactor = pixelRatio;
        this.resizeCanvas();
        this.updateCSSscale();
    }
    /**
     * Set the current zoom and draw offset to fit the given bounds.
     *
     * This method currently restores the aspect zoom ratio.
     *
     **/
    fitToView(bounds) {
        const canvasCenter = new _Vertex__WEBPACK_IMPORTED_MODULE_18__.Vertex(this.canvasSize.width / 2.0, this.canvasSize.height / 2.0);
        const canvasRatio = this.canvasSize.width / this.canvasSize.height;
        const ratio = bounds.width / bounds.height;
        // Find the new draw offset
        const center = new _Vertex__WEBPACK_IMPORTED_MODULE_18__.Vertex(bounds.max.x - bounds.width / 2.0, bounds.max.y - bounds.height / 2.0)
            .inv()
            .addXY(this.canvasSize.width / 2.0, this.canvasSize.height / 2.0);
        this.setOffset(center);
        if (canvasRatio < ratio) {
            const newUniformZoom = this.canvasSize.width / bounds.width;
            this.setZoom(newUniformZoom, newUniformZoom, canvasCenter);
        }
        else {
            const newUniformZoom = this.canvasSize.height / bounds.height;
            this.setZoom(newUniformZoom, newUniformZoom, canvasCenter);
        }
        this.redraw();
    }
    /**
     * Set the console for this instance.
     *
     * @method setConsole
     * @param {Console} con - The new console object (default is globalThis.console).
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    setConsole(con) {
        this.console = con;
    }
    /**
     * Update the CSS scale for the canvas depending onf the cssScale{X,Y} settings.<br>
     * <br>
     * This function is usually only used inernally.
     *
     * @method updateCSSscale
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     * @private
     **/
    updateCSSscale() {
        var _a, _b, _c, _d;
        if (this.config.cssUniformScale) {
            PlotBoilerplate.utils.setCSSscale(this.canvas, (_a = this.config.cssScaleX) !== null && _a !== void 0 ? _a : 1.0, (_b = this.config.cssScaleX) !== null && _b !== void 0 ? _b : 1.0);
        }
        else {
            PlotBoilerplate.utils.setCSSscale(this.canvas, (_c = this.config.cssScaleX) !== null && _c !== void 0 ? _c : 1.0, (_d = this.config.cssScaleY) !== null && _d !== void 0 ? _d : 1.0);
        }
    }
    /**
     * Add a drawable object.<br>
     * <br>
     * This must be either:<br>
     * <pre>
     *  * a Vertex
     *  * a Line
     *  * a Vector
     *  * a VEllipse
     *  * a VEllipseSector
     *  * a Circle
     *  * a Polygon
     *  * a Triangle
     *  * a BezierPath
     *  * a BPImage
     * </pre>
     *
     * @param {Drawable|Drawable[]} drawable - The drawable (of one of the allowed class instance) to add.
     * @param {boolean} [redraw=true] - If true the function will trigger redraw after the drawable(s) was/were added.
     * @method add
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    add(drawable, redraw) {
        if (Array.isArray(drawable)) {
            const arr = drawable;
            for (var i = 0; i < arr.length; i++) {
                this.add(arr[i], false);
            }
        }
        else if (drawable instanceof _Vertex__WEBPACK_IMPORTED_MODULE_18__.Vertex) {
            this.drawables.push(drawable);
            this.vertices.push(drawable);
        }
        else if (drawable instanceof _Line__WEBPACK_IMPORTED_MODULE_10__.Line) {
            // Add some lines
            this.drawables.push(drawable);
            this.vertices.push(drawable.a);
            this.vertices.push(drawable.b);
        }
        else if (drawable instanceof _Vector__WEBPACK_IMPORTED_MODULE_17__.Vector) {
            this.drawables.push(drawable);
            this.vertices.push(drawable.a);
            this.vertices.push(drawable.b);
        }
        else if (drawable instanceof _VEllipse__WEBPACK_IMPORTED_MODULE_15__.VEllipse) {
            this.vertices.push(drawable.center);
            this.vertices.push(drawable.axis);
            this.drawables.push(drawable);
            drawable.center.listeners.addDragListener((event) => {
                drawable.axis.add(event.params.dragAmount);
            });
        }
        else if (drawable instanceof _VEllipseSector__WEBPACK_IMPORTED_MODULE_16__.VEllipseSector) {
            this.vertices.push(drawable.ellipse.center);
            this.vertices.push(drawable.ellipse.axis);
            this.drawables.push(drawable);
            drawable.ellipse.center.listeners.addDragListener((event) => {
                drawable.ellipse.axis.add(event.params.dragAmount);
            });
        }
        else if (drawable instanceof _Circle__WEBPACK_IMPORTED_MODULE_6__.Circle) {
            this.vertices.push(drawable.center);
            this.drawables.push(drawable);
        }
        else if (drawable instanceof _CircleSector__WEBPACK_IMPORTED_MODULE_7__.CircleSector) {
            this.vertices.push(drawable.circle.center);
            this.drawables.push(drawable);
        }
        else if (drawable instanceof _Polygon__WEBPACK_IMPORTED_MODULE_13__.Polygon) {
            this.drawables.push(drawable);
            for (var i = 0; i < drawable.vertices.length; i++) {
                this.vertices.push(drawable.vertices[i]);
            }
        }
        else if (drawable instanceof _Triangle__WEBPACK_IMPORTED_MODULE_14__.Triangle) {
            this.drawables.push(drawable);
            this.vertices.push(drawable.a);
            this.vertices.push(drawable.b);
            this.vertices.push(drawable.c);
        }
        else if (drawable instanceof _BezierPath__WEBPACK_IMPORTED_MODULE_4__.BezierPath) {
            this.drawables.push(drawable);
            const bezierPath = drawable;
            for (var i = 0; i < bezierPath.bezierCurves.length; i++) {
                if (!drawable.adjustCircular && i == 0) {
                    this.vertices.push(bezierPath.bezierCurves[i].startPoint);
                }
                this.vertices.push(bezierPath.bezierCurves[i].endPoint);
                this.vertices.push(bezierPath.bezierCurves[i].startControlPoint);
                this.vertices.push(bezierPath.bezierCurves[i].endControlPoint);
                bezierPath.bezierCurves[i].startControlPoint.attr.selectable = false;
                bezierPath.bezierCurves[i].endControlPoint.attr.selectable = false;
            }
            PlotBoilerplate.utils.enableBezierPathAutoAdjust(drawable);
        }
        else if (drawable instanceof _PBImage__WEBPACK_IMPORTED_MODULE_12__.PBImage) {
            this.vertices.push(drawable.upperLeft);
            this.vertices.push(drawable.lowerRight);
            this.drawables.push(drawable);
            // Todo: think about a IDragEvent interface
            drawable.upperLeft.listeners.addDragListener((e) => {
                drawable.lowerRight.add(e.params.dragAmount);
            });
            drawable.lowerRight.attr.selectable = false;
        }
        else if (drawable instanceof _PBText__WEBPACK_IMPORTED_MODULE_20__.PBText) {
            this.vertices.push(drawable.anchor);
            this.drawables.push(drawable);
            drawable.anchor.attr.selectable = false;
        }
        else {
            throw "Cannot add drawable of unrecognized type: " + typeof drawable + ".";
        }
        // This is a workaround for backwards compatibility when the 'redraw' param was not yet present.
        if (redraw || typeof redraw == "undefined")
            this.redraw();
    }
    /**
     * Remove a drawable object.<br>
     * <br>
     * This must be either:<br>
     * <pre>
     *  * a Vertex
     *  * a Line
     *  * a Vector
     *  * a VEllipse
     *  * a Circle
     *  * a Polygon
     *  * a BezierPath
     *  * a BPImage
     *  * a Triangle
     * </pre>
     *
     * @param {Drawable|Array<Drawable>} drawable - The drawable (of one of the allowed class instance) to remove.
     * @param {boolean} [redraw=false]
     * @method remove
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    remove(drawable, redraw, removeWithVertices) {
        if (Array.isArray(drawable)) {
            for (var i = 0; i < drawable.length; i++) {
                this.remove(drawable[i], false, removeWithVertices);
            }
            if (redraw) {
                this.redraw();
            }
            return;
        }
        if (drawable instanceof _Vertex__WEBPACK_IMPORTED_MODULE_18__.Vertex) {
            this.removeVertex(drawable, false);
            if (redraw) {
                this.redraw();
            }
        }
        for (var i = 0; i < this.drawables.length; i++) {
            if (this.drawables[i] === drawable || this.drawables[i].uid === drawable.uid) {
                this.drawables.splice(i, 1);
                if (removeWithVertices) {
                    // Check if some listeners need to be removed
                    if (drawable instanceof _Line__WEBPACK_IMPORTED_MODULE_10__.Line) {
                        // Add some lines
                        this.removeVertex(drawable.a, false);
                        this.removeVertex(drawable.b, false);
                    }
                    else if (drawable instanceof _Vector__WEBPACK_IMPORTED_MODULE_17__.Vector) {
                        this.removeVertex(drawable.a, false);
                        this.removeVertex(drawable.b, false);
                    }
                    else if (drawable instanceof _VEllipse__WEBPACK_IMPORTED_MODULE_15__.VEllipse) {
                        this.removeVertex(drawable.center, false);
                        this.removeVertex(drawable.axis, false);
                    }
                    else if (drawable instanceof _VEllipseSector__WEBPACK_IMPORTED_MODULE_16__.VEllipseSector) {
                        this.removeVertex(drawable.ellipse.center);
                        this.removeVertex(drawable.ellipse.axis);
                    }
                    else if (drawable instanceof _Circle__WEBPACK_IMPORTED_MODULE_6__.Circle) {
                        this.removeVertex(drawable.center, false);
                    }
                    else if (drawable instanceof _CircleSector__WEBPACK_IMPORTED_MODULE_7__.CircleSector) {
                        this.removeVertex(drawable.circle.center, false);
                    }
                    else if (drawable instanceof _Polygon__WEBPACK_IMPORTED_MODULE_13__.Polygon) {
                        // for( var i in drawable.vertices )
                        for (var i = 0; i < drawable.vertices.length; i++)
                            this.removeVertex(drawable.vertices[i], false);
                    }
                    else if (drawable instanceof _Triangle__WEBPACK_IMPORTED_MODULE_14__.Triangle) {
                        this.removeVertex(drawable.a, false);
                        this.removeVertex(drawable.b, false);
                        this.removeVertex(drawable.c, false);
                    }
                    else if (drawable instanceof _BezierPath__WEBPACK_IMPORTED_MODULE_4__.BezierPath) {
                        for (var i = 0; i < drawable.bezierCurves.length; i++) {
                            this.removeVertex(drawable.bezierCurves[i].startPoint, false);
                            this.removeVertex(drawable.bezierCurves[i].startControlPoint, false);
                            this.removeVertex(drawable.bezierCurves[i].endControlPoint, false);
                            if (i + 1 == drawable.bezierCurves.length) {
                                this.removeVertex(drawable.bezierCurves[i].endPoint, false);
                            }
                        }
                    }
                    else if (drawable instanceof _PBImage__WEBPACK_IMPORTED_MODULE_12__.PBImage) {
                        this.removeVertex(drawable.upperLeft, false);
                        this.removeVertex(drawable.lowerRight, false);
                    }
                    else if (drawable instanceof _PBText__WEBPACK_IMPORTED_MODULE_20__.PBText) {
                        this.removeVertex(drawable.anchor, false);
                    }
                } // END removeWithVertices
                if (redraw) {
                    this.redraw();
                }
            }
        }
    }
    /**
     * Remove a vertex from the vertex list.<br>
     *
     * @param {Vertex} vert - The vertex to remove.
     * @param {boolean} [redraw=false]
     * @method removeVertex
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    removeVertex(vert, redraw) {
        for (var i = 0; i < this.vertices.length; i++) {
            if (this.vertices[i] === vert) {
                this.vertices.splice(i, 1);
                if (redraw) {
                    this.redraw();
                }
                return;
            }
        }
    }
    /**
     * Remove all elements.
     *
     * If you want to keep the vertices, pass `true`.
     *
     * @method removeAll
     * @param {boolean=false} keepVertices
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     */
    removeAll(keepVertices) {
        this.drawables = [];
        if (!Boolean(keepVertices)) {
            this.vertices = [];
        }
        this.redraw();
    }
    /**
     * Find the vertex near the given position.
     *
     * The position is the absolute vertex position, not the x-y-coordinates on the canvas.
     *
     * @param {XYCoords} position - The position of the vertex to search for.
     * @param {number} pixelTolerance - A radius around the position to include into the search.
     *                                  Note that the tolerance will be scaled up/down when zoomed.
     * @return The vertex near the given position or undefined if none was found there.
     **/
    getVertexNear(pixelPosition, pixelTolerance) {
        var _a, _b;
        const p = this.locatePointNear(this.transformMousePosition(pixelPosition.x, pixelPosition.y), pixelTolerance / Math.min((_a = this.config.cssScaleX) !== null && _a !== void 0 ? _a : 1.0, (_b = this.config.cssScaleY) !== null && _b !== void 0 ? _b : 1.0));
        if (p && p.typeName == "vertex") {
            return this.vertices[p.vindex];
        }
        return undefined;
    }
    /**
     * Draw the grid with the current config settings.<br>
     *
     * This function is usually only used internally.
     *
     * @method drawGrid
     * @param {DrawLib} draw - The drawing library to use to draw lines.
     * @private
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    drawGrid(draw) {
        if (typeof draw === "undefined") {
            draw = this.draw;
        }
        const gScale = {
            x: (_Grid__WEBPACK_IMPORTED_MODULE_8__.Grid.utils.mapRasterScale(this.config.rasterAdjustFactor, this.draw.scale.x) * this.config.rasterScaleX) /
                this.config.cssScaleX,
            y: (_Grid__WEBPACK_IMPORTED_MODULE_8__.Grid.utils.mapRasterScale(this.config.rasterAdjustFactor, this.draw.scale.y) * this.config.rasterScaleY) /
                this.config.cssScaleY
        };
        var gSize = { width: this.grid.size.x * gScale.x, height: this.grid.size.y * gScale.y };
        var cs = { width: this.canvasSize.width / 2, height: this.canvasSize.height / 2 };
        var offset = this.draw.offset.clone().inv();
        // console.log( "drawGrid", gScale, gSize, cs, offset );
        offset.x =
            ((Math.round(offset.x + cs.width) / Math.round(gSize.width)) * gSize.width) / this.draw.scale.x +
                (((this.draw.offset.x - cs.width) / this.draw.scale.x) % gSize.width);
        offset.y =
            ((Math.round(offset.y + cs.height) / Math.round(gSize.height)) * gSize.height) / this.draw.scale.y +
                (((this.draw.offset.y - cs.height) / this.draw.scale.x) % gSize.height);
        if (this.drawConfig.drawGrid) {
            draw.setCurrentClassName(null);
            if (this.config.rasterGrid) {
                // TODO: move config member to drawConfig
                draw.setCurrentId("raster");
                draw.raster(offset, this.canvasSize.width / this.draw.scale.x, this.canvasSize.height / this.draw.scale.y, gSize.width, gSize.height, "rgba(0,128,255,0.125)");
            }
            else {
                draw.setCurrentId("grid");
                draw.grid(offset, this.canvasSize.width / this.draw.scale.x, this.canvasSize.height / this.draw.scale.y, gSize.width, gSize.height, "rgba(0,128,255,0.095)");
            }
        }
    }
    /**
     * Draw the origin with the current config settings.<br>
     *
     * This function is usually only used internally.
     *
     * @method drawOrigin
     * @param {DrawLib} draw - The drawing library to use to draw lines.
     * @private
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    drawOrigin(draw) {
        // Add a crosshair to mark the origin
        draw.setCurrentId("origin");
        draw.crosshair({ x: 0, y: 0 }, 10, this.drawConfig.origin.color);
    }
    /**
     * This is just a tiny helper function to determine the render color of vertices.
     **/
    _handleColor(h, color) {
        return h.attr.isSelected ? this.drawConfig.selectedVertex.color : h.attr.draggable ? color : "rgba(128,128,128,0.5)";
    }
    /**
     * Draw all drawables.
     *
     * This function is usually only used internally.
     *
     * @method drawDrawables
     * @param {number} renderTime - The current render time. It will be used to distinct
     *                              already draw vertices from non-draw-yet vertices.
     * @param {DrawLib} draw - The drawing library to use to draw lines.
     * @param {DrawLib} fill - The drawing library to use to fill areas.
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    drawDrawables(renderTime, draw, fill) {
        for (var i in this.drawables) {
            var d = this.drawables[i];
            this.draw.setCurrentId(d.uid);
            this.fill.setCurrentId(d.uid);
            this.draw.setCurrentClassName(d.className);
            this.fill.setCurrentClassName(d.className);
            this.drawDrawable(d, renderTime, draw, fill);
        }
    }
    /**
     * Draw the given drawable.
     *
     * This function is usually only used internally.
     *
     * @method drawDrawable
     * @param {Drawable} d - The drawable to draw.
     * @param {number} renderTime - The current render time. It will be used to distinct
     *                              already draw vertices from non-draw-yet vertices.
     * @param {DrawLib} draw - The drawing library to use to draw lines.
     * @param {DrawLib} fill - The drawing library to use to fill areas.
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    drawDrawable(d, renderTime, draw, fill) {
        if (d instanceof _BezierPath__WEBPACK_IMPORTED_MODULE_4__.BezierPath) {
            var curveIndex = 0;
            for (var c in d.bezierCurves) {
                // Restore these settings again in each loop (will be overwritten)
                this.draw.setCurrentId(`${d.uid}-${curveIndex}`);
                this.fill.setCurrentId(`${d.uid}-${curveIndex}`);
                this.draw.setCurrentClassName(d.className);
                this.fill.setCurrentClassName(d.className);
                draw.cubicBezier(d.bezierCurves[c].startPoint, d.bezierCurves[c].endPoint, d.bezierCurves[c].startControlPoint, d.bezierCurves[c].endControlPoint, this.drawConfig.bezier.color, this.drawConfig.bezier.lineWidth);
                if (this.drawConfig.drawBezierHandlePoints && this.drawConfig.drawHandlePoints) {
                    if (d.bezierCurves[c].startPoint.attr.visible) {
                        const df = this.drawConfig.bezier.pathVertex.fill ? fill : draw;
                        df.setCurrentId(`${d.uid}_h0`);
                        df.setCurrentClassName(`${d.className}-start-handle`);
                        if (d.bezierCurves[c].startPoint.attr.bezierAutoAdjust) {
                            df.squareHandle(d.bezierCurves[c].startPoint, 5, this._handleColor(d.bezierCurves[c].startPoint, this.drawConfig.bezier.pathVertex.color));
                        }
                        else {
                            df.diamondHandle(d.bezierCurves[c].startPoint, 7, this._handleColor(d.bezierCurves[c].startPoint, this.drawConfig.bezier.pathVertex.color));
                        }
                    }
                    d.bezierCurves[c].startPoint.attr.renderTime = renderTime;
                    if (d.bezierCurves[c].endPoint.attr.visible) {
                        const df = this.drawConfig.bezier.pathVertex.fill ? fill : draw;
                        df.setCurrentId(`${d.uid}_h0`);
                        df.setCurrentClassName(`${d.className}-start-handle`);
                        if (d.bezierCurves[c].endPoint.attr.bezierAutoAdjust) {
                            df.squareHandle(d.bezierCurves[c].endPoint, 5, this._handleColor(d.bezierCurves[c].endPoint, this.drawConfig.bezier.pathVertex.color));
                        }
                        else {
                            df.diamondHandle(d.bezierCurves[c].endPoint, 7, this._handleColor(d.bezierCurves[c].endPoint, this.drawConfig.bezier.pathVertex.color));
                        }
                    }
                    if (d.bezierCurves[c].startControlPoint.attr.visible) {
                        const df = this.drawConfig.bezier.controlVertex.fill ? fill : draw;
                        df.setCurrentId(`${d.uid}_h2`);
                        df.setCurrentClassName(`${d.className}-start-control-handle`);
                        df.circleHandle(d.bezierCurves[c].startControlPoint, 3, this._handleColor(d.bezierCurves[c].startControlPoint, this.drawConfig.bezier.controlVertex.color));
                    }
                    if (d.bezierCurves[c].endControlPoint.attr.visible) {
                        const df = this.drawConfig.bezier.controlVertex.fill ? fill : draw;
                        df.setCurrentId(`${d.uid}_h3`);
                        df.setCurrentClassName(`${d.className}-end-control-handle`);
                        df.circleHandle(d.bezierCurves[c].endControlPoint, 3, this._handleColor(d.bezierCurves[c].endControlPoint, this.drawConfig.bezier.controlVertex.color));
                    }
                    d.bezierCurves[c].startPoint.attr.renderTime = renderTime;
                    d.bezierCurves[c].endPoint.attr.renderTime = renderTime;
                    d.bezierCurves[c].startControlPoint.attr.renderTime = renderTime;
                    d.bezierCurves[c].endControlPoint.attr.renderTime = renderTime;
                }
                else {
                    d.bezierCurves[c].startPoint.attr.renderTime = renderTime;
                    d.bezierCurves[c].endPoint.attr.renderTime = renderTime;
                    d.bezierCurves[c].startControlPoint.attr.renderTime = renderTime;
                    d.bezierCurves[c].endControlPoint.attr.renderTime = renderTime;
                }
                if (this.drawConfig.drawBezierHandleLines && this.drawConfig.drawHandleLines) {
                    draw.setCurrentId(`${d.uid}_l0`);
                    draw.setCurrentClassName(`${d.className}-start-line`);
                    draw.line(d.bezierCurves[c].startPoint, d.bezierCurves[c].startControlPoint, this.drawConfig.bezier.handleLine.color, this.drawConfig.bezier.handleLine.lineWidth);
                    draw.setCurrentId(`${d.uid}_l1`);
                    draw.setCurrentClassName(`${d.className}-end-line`);
                    draw.line(d.bezierCurves[c].endPoint, d.bezierCurves[c].endControlPoint, this.drawConfig.bezier.handleLine.color, this.drawConfig.bezier.handleLine.lineWidth);
                }
                curveIndex++;
            } // END for
        }
        else if (d instanceof _Polygon__WEBPACK_IMPORTED_MODULE_13__.Polygon) {
            draw.polygon(d, this.drawConfig.polygon.color, this.drawConfig.polygon.lineWidth);
            if (!this.drawConfig.drawHandlePoints) {
                for (var i in d.vertices) {
                    d.vertices[i].attr.renderTime = renderTime;
                }
            }
        }
        else if (d instanceof _Triangle__WEBPACK_IMPORTED_MODULE_14__.Triangle) {
            draw.polyline([d.a, d.b, d.c], false, this.drawConfig.triangle.color, this.drawConfig.triangle.lineWidth);
            if (!this.drawConfig.drawHandlePoints)
                d.a.attr.renderTime = d.b.attr.renderTime = d.c.attr.renderTime = renderTime;
        }
        else if (d instanceof _VEllipse__WEBPACK_IMPORTED_MODULE_15__.VEllipse) {
            if (this.drawConfig.drawHandleLines) {
                draw.setCurrentId(`${d.uid}_e0`);
                draw.setCurrentClassName(`${d.className}-v-line`);
                // draw.line( d.center.clone().add(0,d.axis.y-d.center.y), d.axis, '#c8c8c8' );
                draw.line(d.center.clone().add(0, d.signedRadiusV()).rotate(d.rotation, d.center), d.axis, "#c8c8c8");
                draw.setCurrentId(`${d.uid}_e1`);
                draw.setCurrentClassName(`${d.className}-h-line`);
                // draw.line( d.center.clone().add(d.axis.x-d.center.x,0), d.axis, '#c8c8c8' );
                draw.line(d.center.clone().add(d.signedRadiusH(), 0).rotate(d.rotation, d.center), d.axis, "#c8c8c8");
            }
            draw.setCurrentId(d.uid);
            draw.setCurrentClassName(`${d.className}`);
            draw.ellipse(d.center, 
            // Math.abs(d.axis.x-d.center.x), Math.abs(d.axis.y-d.center.y),
            d.radiusH(), d.radiusV(), this.drawConfig.ellipse.color, this.drawConfig.ellipse.lineWidth, d.rotation);
            if (!this.drawConfig.drawHandlePoints) {
                d.center.attr.renderTime = renderTime;
                d.axis.attr.renderTime = renderTime;
            }
        }
        else if (d instanceof _VEllipseSector__WEBPACK_IMPORTED_MODULE_16__.VEllipseSector) {
            draw.setCurrentId(d.uid);
            draw.setCurrentClassName(`${d.className}`);
            /* draw.ellipse( d.center,
                    // Math.abs(d.axis.x-d.center.x), Math.abs(d.axis.y-d.center.y),
                    d.radiusH(), d.radiusV(),
                    this.drawConfig.ellipse.color,
                    this.drawConfig.ellipse.lineWidth,
                    d.rotation ); */
            const data = _VEllipseSector__WEBPACK_IMPORTED_MODULE_16__.VEllipseSector.ellipseSectorUtils.describeSVGArc(d.ellipse.center.x, d.ellipse.center.y, d.ellipse.radiusH(), d.ellipse.radiusV(), d.startAngle, d.endAngle, d.ellipse.rotation, { moveToStart: true });
            draw.path(data, this.drawConfig.ellipseSector.color, this.drawConfig.ellipseSector.lineWidth);
        }
        else if (d instanceof _Circle__WEBPACK_IMPORTED_MODULE_6__.Circle) {
            draw.circle(d.center, d.radius, this.drawConfig.circle.color, this.drawConfig.circle.lineWidth);
        }
        else if (d instanceof _CircleSector__WEBPACK_IMPORTED_MODULE_7__.CircleSector) {
            draw.circleArc(d.circle.center, d.circle.radius, d.startAngle, d.endAngle, this.drawConfig.circleSector.color, this.drawConfig.circleSector.lineWidth);
        }
        else if (d instanceof _Vertex__WEBPACK_IMPORTED_MODULE_18__.Vertex) {
            if (this.drawConfig.drawVertices && (!d.attr.selectable || !d.attr.draggable) && d.attr.visible) {
                // Draw as special point (grey)
                draw.circleHandle(d, 7, this.drawConfig.vertex.color);
                d.attr.renderTime = renderTime;
            }
        }
        else if (d instanceof _Line__WEBPACK_IMPORTED_MODULE_10__.Line) {
            draw.line(d.a, d.b, this.drawConfig.line.color, this.drawConfig.line.lineWidth);
            if (!this.drawConfig.drawHandlePoints || !d.a.attr.selectable)
                d.a.attr.renderTime = renderTime;
            if (!this.drawConfig.drawHandlePoints || !d.b.attr.selectable)
                d.b.attr.renderTime = renderTime;
        }
        else if (d instanceof _Vector__WEBPACK_IMPORTED_MODULE_17__.Vector) {
            draw.arrow(d.a, d.b, this.drawConfig.vector.color);
            if (this.drawConfig.drawHandlePoints && d.b.attr.selectable && d.b.attr.visible) {
                draw.setCurrentId(`${d.uid}_h0`);
                draw.setCurrentClassName(`${d.className}-handle`);
                draw.circleHandle(d.b, 3, "#a8a8a8");
            }
            else {
                d.b.attr.renderTime = renderTime;
            }
            if (!this.drawConfig.drawHandlePoints || !d.a.attr.selectable)
                d.a.attr.renderTime = renderTime;
            if (!this.drawConfig.drawHandlePoints || !d.b.attr.selectable)
                d.b.attr.renderTime = renderTime;
        }
        else if (d instanceof _PBImage__WEBPACK_IMPORTED_MODULE_12__.PBImage) {
            if (this.drawConfig.drawHandleLines) {
                draw.setCurrentId(`${d.uid}_l0`);
                draw.setCurrentClassName(`${d.className}-line`);
                draw.line(d.upperLeft, d.lowerRight, this.drawConfig.image.color, this.drawConfig.image.lineWidth);
            }
            fill.setCurrentId(d.uid);
            fill.image(d.image, d.upperLeft, d.lowerRight.clone().sub(d.upperLeft));
            if (this.drawConfig.drawHandlePoints) {
                draw.setCurrentId(`${d.uid}_h0`);
                draw.setCurrentClassName(`${d.className}-lower-right`);
                draw.circleHandle(d.lowerRight, 3, this.drawConfig.image.color);
                d.lowerRight.attr.renderTime = renderTime;
            }
        }
        else if (d instanceof _PBText__WEBPACK_IMPORTED_MODULE_20__.PBText) {
            fill.setCurrentId(d.uid);
            fill.text(d.text, d.anchor.x, d.anchor.y, d);
            if (this.drawConfig.text.anchor) {
                draw.setCurrentId(`${d.uid}_a0`);
                draw.setCurrentClassName(`${d.className}-anchor`);
                (this.drawConfig.text.fill ? fill : draw).point(d.anchor, this.drawConfig.text.color);
            }
            d.anchor.attr.renderTime = renderTime;
        }
        else {
            console.error("Cannot draw object. Unknown class.");
        }
        draw.setCurrentClassName(null);
        draw.setCurrentId(null);
        fill.setCurrentClassName(null);
        fill.setCurrentId(null);
    }
    /**
     * Draw the select-polygon (if there is one).
     *
     * This function is usually only used internally.
     *
     * @method drawSelectPolygon
     * @private
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    drawSelectPolygon(draw) {
        // Draw select polygon?
        if (this.selectPolygon != null && this.selectPolygon.vertices.length > 0) {
            draw.setCurrentId(this.selectPolygon.uid);
            draw.polygon(this.selectPolygon, "#888888");
            draw.crosshair(this.selectPolygon.vertices[0], 3, "#008888");
        }
    }
    /**
     * Draw all vertices that were not yet drawn with the given render time.<br>
     * <br>
     * This function is usually only used internally.
     *
     * @method drawVertices
     * @private
     * @param {number} renderTime - The current render time. It is used to distinct
     *                              already draw vertices from non-draw-yet vertices.
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    drawVertices(renderTime, draw) {
        // Draw all vertices as small squares if they were not already drawn by other objects
        for (var i in this.vertices) {
            if (this.drawConfig.drawVertices && this.vertices[i].attr.renderTime != renderTime && this.vertices[i].attr.visible) {
                draw.setCurrentId(this.vertices[i].uid);
                draw.squareHandle(this.vertices[i], 5, this._handleColor(this.vertices[i], "rgb(0,128,192)"));
                this.vertices[i].attr.renderTime = renderTime;
            }
        }
    }
    /**
     * Trigger redrawing of all objects.<br>
     * <br>
     * Usually this function is automatically called when objects change.
     *
     * @method redraw
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    redraw() {
        const renderTime = this.renderTime++;
        // Tell the drawing library that a new drawing cycle begins (required for the GL lib).
        this.draw.beginDrawCycle(renderTime);
        this.fill.beginDrawCycle(renderTime);
        if (this.config.preClear)
            this.config.preClear();
        this.clear();
        if (this.config.preDraw)
            this.config.preDraw(this.draw, this.fill);
        this.drawAll(renderTime, this.draw, this.fill);
        if (this.config.postDraw)
            this.config.postDraw(this.draw, this.fill);
        this.draw.endDrawCycle(renderTime);
        this.fill.endDrawCycle(renderTime);
    }
    /**
     * Draw all: drawables, grid, select-polygon and vertices.
     *
     * @method drawAll
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    drawAll(renderTime, draw, fill) {
        if (this.config.drawRaster) {
            this.drawGrid(draw);
        }
        if (this.config.drawOrigin) {
            this.drawOrigin(draw);
        }
        this.drawDrawables(renderTime, draw, fill);
        this.drawVertices(renderTime, draw);
        this.drawSelectPolygon(draw);
        // Clear IDs and classnames (postDraw hook might draw somthing and the do not want
        // to interfered with that).
        draw.setCurrentId(null);
        draw.setCurrentClassName(null);
    } // END redraw
    /**
     * This function clears the canvas with the configured background color.<br>
     * <br>
     * This function is usually only used internally.
     *
     * @method clear
     * @private
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    clear() {
        // Note that elements might have an alpha channel. Clear the scene first.
        this.draw.clear(this.config.backgroundColor || "white");
    }
    /**
     * Clear the selection.<br>
     * <br>
     * This function is usually only used internally.
     *
     * @method clearSelection
     * @private
     * @param {boolean=} [redraw=false] - Indicates if the redraw function should be triggered.
     * @instance
     * @memberof PlotBoilerplate
     * @return {PlotBoilerplate} this
     **/
    clearSelection(redraw) {
        for (var i in this.vertices)
            this.vertices[i].attr.isSelected = false;
        if (redraw)
            this.redraw();
        return this;
    }
    /**
     * Get the current view port.
     *
     * @method viewport
     * @instance
     * @memberof PlotBoilerplate
     * @return {Bounds} The current viewport.
     **/
    viewport() {
        var _a, _b;
        return new _Bounds__WEBPACK_IMPORTED_MODULE_5__.Bounds(this.transformMousePosition(0, 0), this.transformMousePosition(this.canvasSize.width * ((_a = this.config.cssScaleX) !== null && _a !== void 0 ? _a : 1.0), this.canvasSize.height * ((_b = this.config.cssScaleY) !== null && _b !== void 0 ? _b : 1.0)));
    }
    /**
     * Trigger the saveFile.hook.
     *
     * @method saveFile
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    saveFile() {
        this.hooks.saveFile(this);
    }
    /**
     * Internal helper function used to get 'float' properties from elements.
     * Used to determine border withs and paddings that were defined using CSS.
     */
    // TODO: this was moved to the DOM utils
    getFProp(elem, propName) {
        return parseFloat(globalThis.getComputedStyle(elem, null).getPropertyValue(propName));
    }
    /**
     * Get the available inner space of the given container.
     *
     * Size minus padding minus border.
     **/
    // TODO: this was moved to the DOM utils
    getAvailableContainerSpace() {
        const _self = this;
        const container = _self.canvas.parentNode; // Element | Document | DocumentFragment;
        _self.canvas.style.display = "none";
        var padding = this.getFProp(container, "padding") || 0, border = this.getFProp(_self.canvas, "border-width") || 0, pl = this.getFProp(container, "padding-left") || padding, pr = this.getFProp(container, "padding-right") || padding, pt = this.getFProp(container, "padding-top") || padding, pb = this.getFProp(container, "padding-bottom") || padding, bl = this.getFProp(_self.canvas, "border-left-width") || border, br = this.getFProp(_self.canvas, "border-right-width") || border, bt = this.getFProp(_self.canvas, "border-top-width") || border, bb = this.getFProp(_self.canvas, "border-bottom-width") || border;
        var w = container.clientWidth;
        var h = container.clientHeight;
        _self.canvas.style.display = "block";
        return { width: w - pl - pr - bl - br, height: h - pt - pb - bt - bb };
    }
    /**
     * This function resizes the canvas to the required settings (toggles fullscreen).<br>
     * <br>
     * This function is usually only used internally but feel free to call it if resizing required.
     *
     * @method resizeCanvas
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    resizeCanvas() {
        var _a, _b, _c, _d, _e, _f;
        const _self = this;
        const _setSize = (w, h) => {
            var _a, _b;
            w *= (_a = _self.config.canvasWidthFactor) !== null && _a !== void 0 ? _a : 1.0;
            h *= (_b = _self.config.canvasHeightFactor) !== null && _b !== void 0 ? _b : 1.0;
            _self.canvasSize.width = w;
            _self.canvasSize.height = h;
            if (_self.canvas instanceof HTMLCanvasElement) {
                _self.canvas.width = w;
                _self.canvas.height = h;
            }
            else if (_self.canvas instanceof SVGElement) {
                this.canvas.setAttribute("viewBox", `0 0 ${w} ${h}`);
                this.canvas.setAttribute("width", `${w}`);
                this.canvas.setAttribute("height", `${h}`);
                this.draw.setSize(_self.canvasSize); // No need to set size to this.fill (instance copy)
                this.eventCatcher.style.width = `${w}px`;
                this.eventCatcher.style.height = `${h}px`;
            }
            else {
                console.error("Error: cannot resize canvas element because it seems neither be a HTMLCanvasElement nor an SVGElement.");
            }
            if (_self.config.autoAdjustOffset) {
                // _self.draw.offset.x = _self.fill.offset.x = _self.config.offsetX = w*(_self.config.offsetAdjustXPercent/100);
                // _self.draw.offset.y = _self.fill.offset.y = _self.config.offsetY = h*(_self.config.offsetAdjustYPercent/100);
                _self.adjustOffset(false);
            }
        };
        if (_self.config.fullSize && !_self.config.fitToParent) {
            // Set editor size
            var width = globalThis.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            var height = globalThis.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            _self.canvas.style.position = "absolute";
            _self.canvas.style.width = ((_a = _self.config.canvasWidthFactor) !== null && _a !== void 0 ? _a : 1.0) * width + "px";
            _self.canvas.style.height = ((_b = _self.config.canvasWidthFactor) !== null && _b !== void 0 ? _b : 1.0) * height + "px";
            _self.canvas.style.top = "0px";
            _self.canvas.style.left = "0px";
            _setSize(width, height);
        }
        else if (_self.config.fitToParent) {
            // Set editor size
            _self.canvas.style.position = "static";
            const space = this.getAvailableContainerSpace();
            _self.canvas.style.width = ((_c = _self.config.canvasWidthFactor) !== null && _c !== void 0 ? _c : 1.0) * space.width + "px";
            _self.canvas.style.height = ((_d = _self.config.canvasHeightFactor) !== null && _d !== void 0 ? _d : 1.0) * space.height + "px";
            _self.canvas.style.top = "";
            _self.canvas.style.left = "";
            _setSize(space.width, space.height);
        }
        else {
            _self.canvas.style.width = "";
            _self.canvas.style.height = "";
            _setSize((_e = _self.config.defaultCanvasWidth) !== null && _e !== void 0 ? _e : 1024, (_f = _self.config.defaultCanvasHeight) !== null && _f !== void 0 ? _f : 768);
        }
        if (_self.config.redrawOnResize)
            _self.redraw();
    }
    /**
     *  Add all vertices inside the polygon to the current selection.<br>
     *
     * @method selectVerticesInPolygon
     * @param {Polygon} polygon - The polygonal selection area.
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    selectVerticesInPolygon(polygon) {
        for (var i in this.vertices) {
            if (this.vertices[i].attr.selectable && polygon.containsVert(this.vertices[i]))
                this.vertices[i].attr.isSelected = true;
        }
    }
    /**
     * (Helper) Locates the point (index) at the passed position. Using an internal tolerance of 7 pixels.
     *
     * The result is an object { type : 'bpath', pindex, cindex, pid }
     *
     * Returns false if no point is near the passed position.
     *
     * @method locatePointNear
     * @param {Vertex} point - The polygonal selection area.
     * @param {number=} [tolerance=7] - The tolerance to use identtifying vertices.
     * @private
     * @return {IDraggable} Or false if none found.
     **/
    locatePointNear(point, tolerance) {
        const _self = this;
        if (typeof tolerance == "undefined")
            tolerance = 7;
        // Apply the zoom (the tolerant area should not shrink or grow when zooming)
        tolerance /= _self.draw.scale.x;
        // Search in vertices
        for (var vindex = 0; vindex < _self.vertices.length; vindex++) {
            var vert = _self.vertices[vindex];
            if ((vert.attr.draggable || vert.attr.selectable) && vert.distance(point) < tolerance) {
                // { type : 'vertex', vindex : vindex };
                return new PlotBoilerplate.Draggable(vert, PlotBoilerplate.Draggable.VERTEX).setVIndex(vindex);
            }
        }
        return null;
    }
    /**
     * Handle left-click event.<br>
     *
     * @method handleClick
     * @param {number} x - The click X position on the canvas.
     * @param {number} y - The click Y position on the canvas.
     * @private
     * @return {void}
     **/
    handleClick(e) {
        const _self = this;
        var point = this.locatePointNear(_self.transformMousePosition(e.params.pos.x, e.params.pos.y), PlotBoilerplate.DEFAULT_CLICK_TOLERANCE / Math.min(_self.config.cssScaleX || 1.0, _self.config.cssScaleY || 1.0));
        if (point) {
            _self.vertices[point.vindex].listeners.fireClickEvent(e);
            if (this.keyHandler && this.keyHandler.isDown("shift")) {
                if (point.typeName == "bpath") {
                    let vert = _self.paths[point.pindex].bezierCurves[point.cindex].getPointByID(point.pid);
                    if (vert.attr.selectable)
                        vert.attr.isSelected = !vert.attr.isSelected;
                }
                else if (point.typeName == "vertex") {
                    let vert = _self.vertices[point.vindex];
                    if (vert.attr.selectable)
                        vert.attr.isSelected = !vert.attr.isSelected;
                }
                _self.redraw();
            }
            else if (this.keyHandler && this.keyHandler.isDown("y")) {
                _self.vertices[point.vindex].attr.bezierAutoAdjust = !_self.vertices[point.vindex].attr.bezierAutoAdjust;
                _self.redraw();
            }
        }
        else if (_self.selectPolygon != null) {
            const vert = _self.transformMousePosition(e.params.pos.x, e.params.pos.y);
            _self.selectPolygon.vertices.push(new _Vertex__WEBPACK_IMPORTED_MODULE_18__.Vertex(vert.x, vert.y));
            _self.redraw();
        }
    }
    /**
     * Transforms the given x-y-(mouse-)point to coordinates respecting the view offset
     * and the zoom settings.
     *
     * @method transformMousePosition
     * @param {number} x - The x position relative to the canvas.
     * @param {number} y - The y position relative to the canvas.
     * @instance
     * @memberof PlotBoilerplate
     * @return {XYCoords} A simple object <pre>{ x : Number, y : Number }</pre> with the transformed coordinates.
     **/
    transformMousePosition(x, y) {
        return {
            x: (x / this.config.cssScaleX - this.config.offsetX) / this.config.scaleX,
            y: (y / this.config.cssScaleY - this.config.offsetY) / this.config.scaleY
        };
    }
    /**
     * Revert a transformed mouse position back to canvas coordinates.
     *
     * This is the inverse function of `transformMousePosition`.
     *
     * @method revertMousePosition
     * @param {number} x - The x component of the position to revert.
     * @param {number} y - The y component of the position to revert.
     * @instance
     * @memberof PlotBoilerplate
     * @return {XYCoords} The canvas coordinates for the given position.
     **/
    revertMousePosition(x, y) {
        return { x: x / this.config.cssScaleX + this.config.offsetX, y: y / this.config.cssScaleY + this.config.offsetY };
    }
    /**
     * Determine if any elements are currently being dragged (on mouse move or touch move).
     *
     * @method getDraggedElementCount
     * @instance
     * @memberof PlotBoilerplate
     * @return {number} The number of elements that are currently being dragged.
     **/
    getDraggedElementCount() {
        return this.draggedElements.length;
    }
    /**
     * (Helper) The mouse-down handler.
     *
     * It selects vertices for dragging.
     *
     * @method mouseDownHandler.
     * @param {XMouseEvent} e - The event to handle
     * @private
     * @return {void}
     **/
    mouseDownHandler(e) {
        const _self = this;
        if (e.button != 0)
            return; // Only react on left mouse or touch events
        var draggablePoint = _self.locatePointNear(_self.transformMousePosition(e.params.pos.x, e.params.pos.y), PlotBoilerplate.DEFAULT_CLICK_TOLERANCE / Math.min(_self.config.cssScaleX, _self.config.cssScaleY));
        if (!draggablePoint)
            return;
        // Drag all selected elements?
        if (draggablePoint.typeName == "vertex" && _self.vertices[draggablePoint.vindex].attr.isSelected) {
            // Multi drag
            // for( var i in _self.vertices ) {
            for (var i = 0; i < _self.vertices.length; i++) {
                if (_self.vertices[i].attr.isSelected) {
                    _self.draggedElements.push(new PlotBoilerplate.Draggable(_self.vertices[i], PlotBoilerplate.Draggable.VERTEX).setVIndex(i));
                    _self.vertices[i].listeners.fireDragStartEvent(e);
                }
            }
        }
        else {
            // Single drag
            if (!_self.vertices[draggablePoint.vindex].attr.draggable)
                return;
            _self.draggedElements.push(draggablePoint);
            if (draggablePoint.typeName == "bpath")
                _self.paths[draggablePoint.pindex].bezierCurves[draggablePoint.cindex]
                    .getPointByID(draggablePoint.pid)
                    .listeners.fireDragStartEvent(e);
            else if (draggablePoint.typeName == "vertex")
                _self.vertices[draggablePoint.vindex].listeners.fireDragStartEvent(e);
        }
        _self.redraw();
    }
    /**
     * The mouse-drag handler.
     *
     * It moves selected elements around or performs the panning if the ctrl-key if
     * hold down.
     *
     * @method mouseDragHandler.
     * @param {XMouseEvent} e - The event to handle
     * @private
     * @return {void}
     **/
    mouseDragHandler(e) {
        const _self = this;
        const oldDragAmount = { x: e.params.dragAmount.x, y: e.params.dragAmount.y };
        e.params.dragAmount.x /= _self.config.cssScaleX;
        e.params.dragAmount.y /= _self.config.cssScaleY;
        // Important note to: this.keyHandler.isDown('ctrl')
        //    We should not use this for any input.
        //    Reason: most browsers use [Ctrl]+[t] to create new browser tabs.
        //            If so, the key-up event for [Ctrl] will be fired in the _new tab_,
        //            not this one. So this tab will never receive any [Ctrl-down] events
        //            until next keypress; the implication is, that [Ctrl] would still
        //            considered to be pressed which is not true.
        if (this.keyHandler && (this.keyHandler.isDown("alt") || this.keyHandler.isDown("spacebar"))) {
            if (!this.config.enablePan) {
                return;
            }
            _self.setOffset(_self.draw.offset.clone().add(e.params.dragAmount));
            _self.redraw();
        }
        else {
            // Convert drag amount by scaling
            // Warning: this possibly invalidates the dragEvent for other listeners!
            //          Rethink the solution when other features are added.
            e.params.dragAmount.x /= _self.draw.scale.x;
            e.params.dragAmount.y /= _self.draw.scale.y;
            for (var i in _self.draggedElements) {
                var p = _self.draggedElements[i];
                if (p.typeName == "bpath") {
                    _self.paths[p.pindex].moveCurvePoint(p.cindex, p.pid, new _Vertex__WEBPACK_IMPORTED_MODULE_18__.Vertex(e.params.dragAmount.x, e.params.dragAmount.y));
                    _self.paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid).listeners.fireDragEvent(e);
                }
                else if (p.typeName == "vertex") {
                    if (!_self.vertices[p.vindex].attr.draggable)
                        continue;
                    _self.vertices[p.vindex].add(e.params.dragAmount);
                    _self.vertices[p.vindex].listeners.fireDragEvent(e);
                }
            }
        }
        // Restore old event values!
        e.params.dragAmount.x = oldDragAmount.x;
        e.params.dragAmount.y = oldDragAmount.y;
        _self.redraw();
    }
    /**
     * The mouse-up handler.
     *
     * It clears the dragging-selection.
     *
     * @method mouseUpHandler.
     * @param {XMouseEvent} e - The event to handle
     * @private
     * @return {void}
     **/
    mouseUpHandler(e) {
        const _self = this;
        if (e.button != 0)
            return; // Only react on left mouse;
        if (!e.params.wasDragged) {
            _self.handleClick(e); // e.params.pos.x, e.params.pos.y );
        }
        for (var i in _self.draggedElements) {
            var p = _self.draggedElements[i];
            if (p.typeName == "bpath") {
                _self.paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid).listeners.fireDragEndEvent(e);
            }
            else if (p.typeName == "vertex") {
                _self.vertices[p.vindex].listeners.fireDragEndEvent(e);
            }
        }
        _self.draggedElements = [];
        _self.redraw();
    }
    /**
     * The mouse-wheel handler.
     *
     * It performs the zooming.
     *
     * @method mouseWheelHandler.
     * @param {XMouseEvent} e - The event to handle
     * @private
     * @return {void}
     **/
    mouseWheelHandler(e) {
        if (!this.config.enableZoom) {
            return;
        }
        var zoomStep = 1.25; // Make configurable?
        // CHANGED replaced _self by this
        const _self = this;
        const we = e;
        if (we.deltaY < 0) {
            _self.setZoom(_self.config.scaleX * zoomStep, _self.config.scaleY * zoomStep, new _Vertex__WEBPACK_IMPORTED_MODULE_18__.Vertex(e.params.pos.x, e.params.pos.y));
        }
        else if (we.deltaY > 0) {
            _self.setZoom(_self.config.scaleX / zoomStep, _self.config.scaleY / zoomStep, new _Vertex__WEBPACK_IMPORTED_MODULE_18__.Vertex(e.params.pos.x, e.params.pos.y));
        }
        e.preventDefault();
        _self.redraw();
    }
    /**
     * Re-adjust the configured offset depending on the current canvas size and zoom (scaleX and scaleY).
     *
     * @method adjustOffset
     * @param {boolean=false} redraw - [optional] If set the canvas will redraw with the new offset (default=false).
     * @return {void}
     **/
    adjustOffset(redraw) {
        this.draw.offset.x =
            this.fill.offset.x =
                this.config.offsetX =
                    this.canvasSize.width * (this.config.offsetAdjustXPercent / 100);
        this.draw.offset.y =
            this.fill.offset.y =
                this.config.offsetY =
                    this.canvasSize.height * (this.config.offsetAdjustYPercent / 100);
        if (redraw) {
            this.redraw();
        }
    }
    /**
     * Set the new draw offset.
     *
     * Note: the function will not trigger any redraws.
     *
     * @param {Vertex} newOffset - The new draw offset to use.
     **/
    setOffset(newOffset) {
        this.draw.offset.set(newOffset);
        this.fill.offset.set(newOffset);
        this.config.offsetX = newOffset.x;
        this.config.offsetY = newOffset.y;
    }
    /**
     * Set a new zoom value (and re-adjust the draw offset).
     *
     * Note: the function will not trigger any redraws.
     *
     * @param {number} zoomFactorX - The new horizontal zoom value.
     * @param {number} zoomFactorY - The new vertical zoom value.
     * @param {Vertex} interactionPos - The position of mouse/touch interaction.
     **/
    setZoom(zoomFactorX, zoomFactorY, interactionPos) {
        let oldPos = this.transformMousePosition(interactionPos.x, interactionPos.y);
        this.draw.scale.x = this.fill.scale.x = this.config.scaleX = Math.max(zoomFactorX, 0.01);
        this.draw.scale.y = this.fill.scale.y = this.config.scaleY = Math.max(zoomFactorY, 0.01);
        let newPos = this.transformMousePosition(interactionPos.x, interactionPos.y);
        let newOffsetX = this.draw.offset.x + (newPos.x - oldPos.x) * this.draw.scale.x;
        let newOffsetY = this.draw.offset.y + (newPos.y - oldPos.y) * this.draw.scale.y;
        this.setOffset({ x: newOffsetX, y: newOffsetY });
    }
    installInputListeners() {
        var _self = this;
        if (this.config.enableMouse) {
            // Install a mouse handler on the canvas.
            new _MouseHandler__WEBPACK_IMPORTED_MODULE_11__.MouseHandler(this.eventCatcher ? this.eventCatcher : this.canvas)
                .down((e) => {
                _self.mouseDownHandler(e);
            })
                .drag((e) => {
                _self.mouseDragHandler(e);
            })
                .up((e) => {
                _self.mouseUpHandler(e);
            });
        }
        else {
            _self.console.log("Mouse interaction disabled.");
        }
        if (this.config.enableMouseWheel) {
            // Install a mouse handler on the canvas.
            new _MouseHandler__WEBPACK_IMPORTED_MODULE_11__.MouseHandler(this.eventCatcher ? this.eventCatcher : this.canvas).wheel((e) => {
                _self.mouseWheelHandler(e);
            });
        }
        else {
            _self.console.log("Mouse wheel interaction disabled.");
        }
        if (this.config.enableTouch) {
            // Install a touch handler on the canvas.
            const relPos = (pos) => {
                const bounds = _self.canvas.getBoundingClientRect();
                return { x: pos.x - bounds.left, y: pos.y - bounds.top };
            };
            // Make PB work together with both, AlloyFinger as a esm module or a commonjs function.
            if (typeof globalThis["AlloyFinger"] === "function" || typeof globalThis["createAlloyFinger"] === "function") {
                try {
                    var touchMovePos = null;
                    var touchDownPos = null;
                    var draggedElement = null;
                    var multiTouchStartScale = null;
                    const clearTouch = () => {
                        touchMovePos = null;
                        touchDownPos = null;
                        draggedElement = null;
                        multiTouchStartScale = null;
                        _self.draggedElements = [];
                    };
                    const afProps = {
                        // touchStart: (evt: TouchEvent) => {
                        touchStart: (evt) => {
                            if (evt.touches.length == 1) {
                                touchMovePos = new _Vertex__WEBPACK_IMPORTED_MODULE_18__.Vertex(relPos({ x: evt.touches[0].clientX, y: evt.touches[0].clientY }));
                                touchDownPos = new _Vertex__WEBPACK_IMPORTED_MODULE_18__.Vertex(relPos({ x: evt.touches[0].clientX, y: evt.touches[0].clientY }));
                                draggedElement = _self.locatePointNear(_self.transformMousePosition(touchMovePos.x, touchMovePos.y), PlotBoilerplate.DEFAULT_TOUCH_TOLERANCE / Math.min(_self.config.cssScaleX, _self.config.cssScaleY));
                                if (draggedElement && draggedElement.typeName == "vertex") {
                                    var draggingVertex = _self.vertices[draggedElement.vindex];
                                    var fakeEvent = {
                                        params: {
                                            isTouchEvent: true,
                                            dragAmount: { x: 0, y: 0 },
                                            wasDragged: false,
                                            mouseDownPos: touchDownPos.clone(),
                                            mouseDragPos: touchDownPos.clone(),
                                            vertex: draggingVertex
                                        }
                                    };
                                    _self.draggedElements = [draggedElement];
                                    draggingVertex.listeners.fireDragStartEvent(fakeEvent);
                                }
                            }
                        },
                        touchMove: (evt) => {
                            if (evt.touches.length == 1 && draggedElement) {
                                evt.preventDefault();
                                evt.stopPropagation();
                                if (!touchDownPos || !touchMovePos) {
                                    return;
                                }
                                var rel = relPos({ x: evt.touches[0].clientX, y: evt.touches[0].clientY });
                                var trans = _self.transformMousePosition(rel.x, rel.y);
                                var diff = new _Vertex__WEBPACK_IMPORTED_MODULE_18__.Vertex(_self.transformMousePosition(touchMovePos.x, touchMovePos.y)).difference(trans);
                                if (draggedElement.typeName == "vertex") {
                                    if (!_self.vertices[draggedElement.vindex].attr.draggable)
                                        return;
                                    _self.vertices[draggedElement.vindex].add(diff);
                                    var draggingVertex = _self.vertices[draggedElement.vindex];
                                    var fakeEvent = {
                                        isTouchEvent: true,
                                        params: {
                                            dragAmount: diff.clone(),
                                            wasDragged: true,
                                            mouseDownPos: touchDownPos.clone(),
                                            mouseDragPos: touchDownPos.clone().add(diff),
                                            vertex: draggingVertex
                                        }
                                    };
                                    draggingVertex.listeners.fireDragEvent(fakeEvent);
                                    _self.redraw();
                                }
                                touchMovePos = new _Vertex__WEBPACK_IMPORTED_MODULE_18__.Vertex(rel);
                            }
                            else if (evt.touches.length == 2) {
                                if (!this.config.enablePan) {
                                    return;
                                }
                                // If at least two fingers touch and move, then change the draw offset (panning).
                                evt.preventDefault();
                                evt.stopPropagation();
                                _self.setOffset(_self.draw.offset
                                    .clone()
                                    .addXY(evt.deltaX, evt.deltaY)); // Apply zoom?
                                _self.redraw();
                            }
                        },
                        touchEnd: (evt) => {
                            // Note: e.touches.length is 0 here
                            if (draggedElement && draggedElement.typeName == "vertex") {
                                if (!touchDownPos) {
                                    return;
                                }
                                var draggingVertex = _self.vertices[draggedElement.vindex];
                                var fakeEvent = {
                                    isTouchEvent: true,
                                    params: {
                                        dragAmount: { x: 0, y: 0 },
                                        wasDragged: false,
                                        mouseDownPos: touchDownPos.clone(),
                                        mouseDragPos: touchDownPos.clone(),
                                        vertex: draggingVertex
                                    }
                                };
                                // Check if vertex was moved
                                if (touchMovePos && touchDownPos && touchDownPos.distance(touchMovePos) < 0.001) {
                                    // if( e.touches.length == 1 && diff.x == 0 && diff.y == 0 ) {
                                    draggingVertex.listeners.fireClickEvent(fakeEvent);
                                }
                                else {
                                    draggingVertex.listeners.fireDragEndEvent(fakeEvent);
                                }
                            }
                            clearTouch();
                        },
                        touchCancel: (evt) => {
                            clearTouch();
                        },
                        multipointStart: (evt) => {
                            multiTouchStartScale = _self.draw.scale.clone();
                        },
                        multipointEnd: (evt) => {
                            multiTouchStartScale = null;
                        },
                        pinch: (evt) => {
                            if (!this.config.enableZoom) {
                                return;
                            }
                            const touchItem0 = evt.touches.item(0);
                            const touchItem1 = evt.touches.item(1);
                            if (!evt.touches || !multiTouchStartScale || !touchItem0 || !touchItem1) {
                                return;
                            }
                            // For pinching there must be at least two touch items
                            const fingerA = new _Vertex__WEBPACK_IMPORTED_MODULE_18__.Vertex(touchItem0.clientX, touchItem0.clientY);
                            const fingerB = new _Vertex__WEBPACK_IMPORTED_MODULE_18__.Vertex(touchItem1.clientX, touchItem1.clientY);
                            const center = new _Line__WEBPACK_IMPORTED_MODULE_10__.Line(fingerA, fingerB).vertAt(0.5);
                            _self.setZoom(multiTouchStartScale.x * evt.zoom, multiTouchStartScale.y * evt.zoom, center);
                            _self.redraw();
                        }
                    }; // END afProps
                    if (window["createAlloyFinger"]) {
                        window["createAlloyFinger"](this.eventCatcher ? this.eventCatcher : this.canvas, afProps);
                    }
                    else {
                        /* tslint:disable-next-line */
                        new alloyfinger_typescript__WEBPACK_IMPORTED_MODULE_0__["default"](this.eventCatcher ? this.eventCatcher : this.canvas, afProps);
                    }
                }
                catch (e) {
                    console.error("Failed to initialize AlloyFinger!");
                    console.error(e);
                }
            }
            else if (globalThis["Touchy"] && typeof globalThis["Touchy"] == "function") {
                console.error("[Deprecation] Found Touchy which is not supported any more. Please use AlloyFinger instead.");
                // Convert absolute touch positions to relative DOM element position (relative to canvas)
            }
            else {
                console.warn("Cannot initialize the touch handler. AlloyFinger is missig. Did you include it?");
            }
        }
        else {
            _self.console.log("Touch interaction disabled.");
        }
        if (this.config.enableKeys) {
            // Install key handler
            this.keyHandler = new _KeyHandler__WEBPACK_IMPORTED_MODULE_9__.KeyHandler({ trackAll: true })
                .down("escape", function () {
                _self.clearSelection(true);
            })
                .down("shift", function () {
                _self.selectPolygon = new _Polygon__WEBPACK_IMPORTED_MODULE_13__.Polygon();
                _self.redraw();
            })
                .up("shift", function () {
                // Find and select vertices in the drawn area
                if (_self.selectPolygon == null)
                    return;
                _self.selectVerticesInPolygon(_self.selectPolygon);
                _self.selectPolygon = null;
                _self.redraw();
            });
        } // END IF enableKeys?
        else {
            _self.console.log("Keyboard interaction disabled.");
        }
    }
    /**
     * Creates a control GUI (a dat.gui instance) for this
     * plot boilerplate instance.
     *
     * @method createGUI
     * @instance
     * @memberof PlotBoilerplate
     * @return {dat.gui.GUI}
     **/
    createGUI(props) {
        // This function moved to the helper utils.
        // We do not want to include the whole dat.GUI package.
        if (globalThis["utils"] && typeof globalThis["utils"].createGUI == "function")
            return globalThis["utils"].createGUI(this, props);
        else
            throw "Cannot create dat.GUI instance; did you load the ./utils/creategui helper function an the dat.GUI library?";
    }
} // END class PlotBoilerplate
/** @constant {number} */
PlotBoilerplate.DEFAULT_CANVAS_WIDTH = 1024;
/** @constant {number} */
PlotBoilerplate.DEFAULT_CANVAS_HEIGHT = 768;
/** @constant {number} */
PlotBoilerplate.DEFAULT_CLICK_TOLERANCE = 8;
/** @constant {number} */
PlotBoilerplate.DEFAULT_TOUCH_TOLERANCE = 32;
/**
 * A wrapper class for draggable items (mostly vertices).
 * @private
 **/
PlotBoilerplate.Draggable = (_a = class {
        constructor(item, typeName) {
            this.item = item;
            this.typeName = typeName;
        }
        isVertex() {
            return this.typeName == PlotBoilerplate.Draggable.VERTEX;
        }
        setVIndex(vindex) {
            this.vindex = vindex;
            return this;
        }
    },
    _a.VERTEX = "vertex",
    _a);
/**
 * A set of helper functions.
 **/
PlotBoilerplate.utils = {
    /**
     * Merge the elements in the 'extension' object into the 'base' object based on
     * the keys of 'base'.
     *
     * @param {Object} base
     * @param {Object} extension
     * @return {Object} base extended by the new attributes.
     **/
    safeMergeByKeys: (base, extension) => {
        for (var k in extension) {
            if (!extension.hasOwnProperty(k))
                continue;
            if (base.hasOwnProperty(k)) {
                var typ = typeof base[k];
                try {
                    if (typ == "boolean")
                        base[k] = !!JSON.parse(extension[k]);
                    else if (typ == "number")
                        base[k] = JSON.parse(extension[k]) * 1;
                    else if (typ == "function" && typeof extension[k] == "function")
                        base[k] = extension[k];
                    else
                        base[k] = extension[k];
                }
                catch (e) {
                    console.error("error in key ", k, extension[k], e);
                }
            }
            else {
                base[k] = extension[k];
            }
        }
        return base;
    },
    /**
     * A helper function to scale elements (usually the canvas) using CSS.
     *
     * transform-origin is at (0,0).
     *
     * @param {HTMLElement} element - The DOM element to scale.
     * @param {number} scaleX The - X scale factor.
     * @param {number} scaleY The - Y scale factor.
     * @return {void}
     **/
    setCSSscale: (element, scaleX, scaleY) => {
        element.style["transform-origin"] = "0 0";
        if (scaleX == 1.0 && scaleY == 1.0) {
            // element.style.transform = null;
            element.style.removeProperty("transform");
        }
        else
            element.style.transform = "scale(" + scaleX + "," + scaleY + ")";
    },
    // A helper for fetching data from objects.
    fetch: {
        /**
         * A helper function to the the object property value specified by the given key.
         *
         * @param {any} object   - The object to get the property's value from. Must not be null.
         * @param {string} key      - The key of the object property (the name).
         * @param {any}    fallback - A default value if the key does not exist.
         **/
        val: (obj, key, fallback) => {
            if (!obj.hasOwnProperty(key))
                return fallback;
            if (typeof obj[key] == "undefined")
                return fallback;
            return obj[key];
        },
        /**
         * A helper function to the the object property numeric value specified by the given key.
         *
         * @param {any}    object   - The object to get the property's value from. Must not be null.
         * @param {string} key      - The key of the object property (the name).
         * @param {number} fallback - A default value if the key does not exist.
         * @return {number}
         **/
        num: (obj, key, fallback) => {
            if (!obj.hasOwnProperty(key))
                return fallback;
            if (typeof obj[key] === "number")
                return obj[key];
            else {
                try {
                    return JSON.parse(obj[key]) * 1;
                }
                catch (e) {
                    return fallback;
                }
            }
        },
        /**
         * A helper function to the the object property boolean value specified by the given key.
         *
         * @param {any}     object   - The object to get the property's value from. Must not be null.
         * @param {string}  key      - The key of the object property (the name).
         * @param {boolean} fallback - A default value if the key does not exist.
         * @return {boolean}
         **/
        bool: (obj, key, fallback) => {
            if (!obj.hasOwnProperty(key))
                return fallback;
            if (typeof obj[key] == "boolean")
                return obj[key];
            else {
                try {
                    return !!JSON.parse(obj[key]);
                }
                catch (e) {
                    return fallback;
                }
            }
        },
        /**
         * A helper function to the the object property function-value specified by the given key.
         *
         * @param {any}      object   - The object to get the property's value from. Must not be null.
         * @param {string}   key      - The key of the object property (the name).
         * @param {function} fallback - A default value if the key does not exist.
         * @return {function}
         **/
        func: (obj, key, fallback) => {
            if (!obj.hasOwnProperty(key))
                return fallback;
            if (typeof obj[key] !== "function")
                return fallback;
            return obj[key];
        }
    },
    /**
     * Installs vertex listeners to the path's vertices so that controlpoints
     * move with their path points when dragged.
     *
     * Bézier path points with attr.bezierAutoAdjust==true will have their
     * two control points audo-updated if moved, too (keep path connections smooth).
     *
     * @param {BezierPath} bezierPath - The path to use auto-adjustment for.
     **/
    enableBezierPathAutoAdjust: (bezierPath) => {
        for (var i = 0; i < bezierPath.bezierCurves.length; i++) {
            // This should be wrapped into the BezierPath implementation.
            bezierPath.bezierCurves[i].startPoint.listeners.addDragListener(function (e) {
                var cindex = bezierPath.locateCurveByStartPoint(e.params.vertex);
                bezierPath.bezierCurves[cindex].startPoint.addXY(-e.params.dragAmount.x, -e.params.dragAmount.y);
                bezierPath.moveCurvePoint(cindex * 1, bezierPath.START_POINT, e.params.dragAmount);
                bezierPath.updateArcLengths();
            });
            bezierPath.bezierCurves[i].startControlPoint.listeners.addDragListener(function (e) {
                var cindex = bezierPath.locateCurveByStartControlPoint(e.params.vertex);
                if (!bezierPath.bezierCurves[cindex].startPoint.attr.bezierAutoAdjust)
                    return;
                bezierPath.adjustPredecessorControlPoint(cindex * 1, true, // obtain handle length?
                false // update arc lengths
                );
                bezierPath.updateArcLengths();
            });
            bezierPath.bezierCurves[i].endControlPoint.listeners.addDragListener(function (e) {
                var cindex = bezierPath.locateCurveByEndControlPoint(e.params.vertex);
                if (!bezierPath.bezierCurves[cindex % bezierPath.bezierCurves.length].endPoint.attr.bezierAutoAdjust)
                    return;
                bezierPath.adjustSuccessorControlPoint(cindex * 1, true, // obtain handle length?
                false // update arc lengths
                );
                bezierPath.updateArcLengths();
            });
            if (i + 1 == bezierPath.bezierCurves.length) {
                // && !bezierPath.adjustCircular ) {
                // Move last control point with the end point (if not circular)
                bezierPath.bezierCurves[bezierPath.bezierCurves.length - 1].endPoint.listeners.addDragListener(function (e) {
                    if (!bezierPath.adjustCircular) {
                        var cindex = bezierPath.locateCurveByEndPoint(e.params.vertex);
                        bezierPath.moveCurvePoint(cindex * 1, bezierPath.END_CONTROL_POINT, new _Vertex__WEBPACK_IMPORTED_MODULE_18__.Vertex({ x: e.params.dragAmount.x, y: e.params.dragAmount.y }));
                    }
                    bezierPath.updateArcLengths();
                });
            }
        } // END for
    }
}; // END utils
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PlotBoilerplate);
//# sourceMappingURL=PlotBoilerplate.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/Polygon.js":
/*!*********************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/Polygon.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Polygon: () => (/* binding */ Polygon)
/* harmony export */ });
/* harmony import */ var _BezierPath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BezierPath */ "./node_modules/plotboilerplate/src/esm/BezierPath.js");
/* harmony import */ var _Bounds__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Bounds */ "./node_modules/plotboilerplate/src/esm/Bounds.js");
/* harmony import */ var _UIDGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./UIDGenerator */ "./node_modules/plotboilerplate/src/esm/UIDGenerator.js");
/* harmony import */ var _Vertex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Vertex */ "./node_modules/plotboilerplate/src/esm/Vertex.js");
/**
 * @author   Ikaros Kappler
 * @date     2018-04-14
 * @modified 2018-11-17 Added the containsVert function.
 * @modified 2018-12-04 Added the toSVGString function.
 * @modified 2019-03-20 Added JSDoc tags.
 * @modified 2019-10-25 Added the scale function.
 * @modified 2019-11-06 JSDoc update.
 * @modified 2019-11-07 Added toCubicBezierPath(number) function.
 * @modified 2019-11-22 Added the rotate(number,Vertex) function.
 * @modified 2020-03-24 Ported this class from vanilla-JS to Typescript.
 * @modified 2020-10-30 Added the `addVertex` function.
 * @modified 2020-10-31 Added the `getVertexAt` function.
 * @modified 2020-11-06 Added the `move` function.
 * @modified 2020-11-10 Added the `getBounds` function.
 * @modified 2020-11-11 Generalized `move(Vertex)` to `move(XYCoords)`.
 * @modified 2021-01-20 Added UID.
 * @modified 2021-01-29 Added the `signedArea` function (was global function in the demos before).
 * @modified 2021-01-29 Added the `isClockwise` function.
 * @modified 2021-01-29 Added the `area` function.
 * @modified 2021-01-29 Changed the param type for `containsVert` from Vertex to XYCoords.
 * @modified 2021-12-14 Added the `perimeter()` function.
 * @modified 2021-12-16 Added the `getEvenDistributionPolygon()` function.
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2022-02-02 Cleared the `Polygon.toSVGString` function (deprecated). Use `drawutilssvg` instead.
 * @modified 2022-03-08 Added the `Polygon.clone()` function.
 * @version 1.10.0
 *
 * @file Polygon
 * @public
 **/




/**
 * @classdesc A polygon class. Any polygon consists of an array of vertices; polygons can be open or closed.
 *
 * @requires BezierPath
 * @requires Bounds
 * @requires SVGSerializabe
 * @requires UID
 * @requires UIDGenerator
 * @requires Vertex
 * @requires XYCoords
 */
class Polygon {
    /**
     * The constructor.
     *
     * @constructor
     * @name Polygon
     * @param {Vertex[]} vertices - An array of 2d vertices that shape the polygon.
     * @param {boolean} isOpen - Indicates if the polygon should be rendered as an open or closed shape.
     **/
    constructor(vertices, isOpen) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "Polygon";
        this.uid = _UIDGenerator__WEBPACK_IMPORTED_MODULE_2__.UIDGenerator.next();
        if (typeof vertices == "undefined")
            vertices = [];
        this.vertices = vertices;
        this.isOpen = isOpen || false;
    }
    /**
     * Add a vertex to the end of the `vertices` array.
     *
     * @method addVert
     * @param {Vertex} vert - The vertex to add.
     * @instance
     * @memberof Polygon
     **/
    addVertex(vert) {
        this.vertices.push(vert);
    }
    /**
     * Get the polygon vertex at the given position (index).
     *
     * The index may exceed the total vertex count, and will be wrapped around then (modulo).
     *
     * For k >= 0:
     *  - getVertexAt( vertices.length )     == getVertexAt( 0 )
     *  - getVertexAt( vertices.length + k ) == getVertexAt( k )
     *  - getVertexAt( -k )                  == getVertexAt( vertices.length -k )
     *
     * @metho getVertexAt
     * @param {number} index - The index of the desired vertex.
     * @instance
     * @memberof Polygon
     * @return {Vertex} At the given index.
     **/
    getVertexAt(index) {
        if (index < 0)
            return this.vertices[this.vertices.length - (Math.abs(index) % this.vertices.length)];
        else
            return this.vertices[index % this.vertices.length];
    }
    /**
     * Move the polygon's vertices by the given amount.
     *
     * @method move
     * @param {XYCoords} amount - The amount to move.
     * @instance
     * @memberof Polygon
     * @return {Polygon} this for chaining
     **/
    move(amount) {
        for (var i in this.vertices) {
            this.vertices[i].add(amount);
        }
        return this;
    }
    /**
     * Check if the given vertex is inside this polygon.<br>
     * <br>
     * Ray-casting algorithm found at<br>
     *    https://stackoverflow.com/questions/22521982/check-if-point-inside-a-polygon
     *
     * @method containsVert
     * @param {XYCoords} vert - The vertex to check. The new x-component.
     * @return {boolean} True if the passed vertex is inside this polygon. The polygon is considered closed.
     * @instance
     * @memberof Polygon
     **/
    containsVert(vert) {
        // ray-casting algorithm based on
        //    http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
        var inside = false;
        for (var i = 0, j = this.vertices.length - 1; i < this.vertices.length; j = i++) {
            let xi = this.vertices[i].x, yi = this.vertices[i].y;
            let xj = this.vertices[j].x, yj = this.vertices[j].y;
            var intersect = yi > vert.y != yj > vert.y && vert.x < ((xj - xi) * (vert.y - yi)) / (yj - yi) + xi;
            if (intersect)
                inside = !inside;
        }
        return inside;
    }
    /**
     * Calculate the area of the given polygon (unsigned).
     *
     * Note that this does not work for self-intersecting polygons.
     *
     * @method area
     * @instance
     * @memberof Polygon
     * @return {number}
     */
    area() {
        return Polygon.utils.area(this.vertices);
    }
    /**
     * Calulate the signed polyon area by interpreting the polygon as a matrix
     * and calculating its determinant.
     *
     * @method signedArea
     * @instance
     * @memberof Polygon
     * @return {number}
     */
    signedArea() {
        return Polygon.utils.signedArea(this.vertices);
    }
    /**
     * Get the winding order of this polgon: clockwise or counterclockwise.
     *
     * @method isClockwise
     * @instance
     * @memberof Polygon
     * @return {boolean}
     */
    isClockwise() {
        return Polygon.utils.signedArea(this.vertices) < 0;
    }
    /**
     * Get the perimeter of this polygon.
     * The perimeter is the absolute length of the outline.
     *
     * If this polygon is open then the last segment (connecting the first and the
     * last vertex) will be skipped.
     *
     * @method perimeter
     * @instance
     * @memberof Polygon
     * @return {number}
     */
    perimeter() {
        let length = 0;
        for (var i = 1; i < this.vertices.length; i++) {
            length += this.vertices[i - 1].distance(this.vertices[i]);
        }
        if (!this.isOpen && this.vertices.length > 1) {
            length += this.vertices[0].distance(this.vertices[this.vertices.length - 1]);
        }
        return length;
    }
    /**
     * Scale the polygon relative to the given center.
     *
     * @method scale
     * @param {number} factor - The scale factor.
     * @param {Vertex} center - The center of scaling.
     * @return {Polygon} this, for chaining.
     * @instance
     * @memberof Polygon
     **/
    scale(factor, center) {
        for (var i in this.vertices) {
            if (typeof this.vertices[i].scale == "function")
                this.vertices[i].scale(factor, center);
            else
                console.log("There seems to be a null vertex!", this.vertices[i]);
        }
        return this;
    }
    /**
     * Rotate the polygon around the given center.
     *
     * @method rotate
     * @param {number} angle  - The rotation angle.
     * @param {Vertex} center - The center of rotation.
     * @instance
     * @memberof Polygon
     * @return {Polygon} this, for chaining.
     **/
    rotate(angle, center) {
        for (var i in this.vertices) {
            this.vertices[i].rotate(angle, center);
        }
        return this;
    }
    /**
     * Convert this polygon into a new polygon with n evenly distributed vertices.
     *
     * @param {number} pointCount - Must not be negative.
     */
    getEvenDistributionPolygon(pointCount) {
        if (pointCount <= 0) {
            throw new Error("pointCount must be larger than zero; is " + pointCount + ".");
        }
        const result = new Polygon([], this.isOpen);
        if (this.vertices.length === 0) {
            return result;
        }
        // Fetch and add the start point from the source polygon
        let polygonPoint = new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex(this.vertices[0]);
        result.vertices.push(polygonPoint);
        if (this.vertices.length === 1) {
            return result;
        }
        const perimeter = this.perimeter();
        const stepSize = perimeter / pointCount;
        const n = this.vertices.length;
        let polygonIndex = 1;
        let nextPolygonPoint = new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex(this.vertices[1]);
        let segmentLength = polygonPoint.distance(nextPolygonPoint);
        let loopMax = this.isOpen ? n : n + 1;
        let curSegmentU = stepSize;
        var i = 1;
        while (i < pointCount && polygonIndex < loopMax) {
            // Check if next eq point is inside this segment
            if (curSegmentU < segmentLength) {
                let newPoint = polygonPoint.clone().lerpAbs(nextPolygonPoint, curSegmentU);
                result.vertices.push(newPoint);
                curSegmentU += stepSize;
                i++;
            }
            else {
                polygonIndex++;
                polygonPoint = nextPolygonPoint;
                nextPolygonPoint = new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex(this.vertices[polygonIndex % n]);
                curSegmentU = curSegmentU - segmentLength;
                segmentLength = polygonPoint.distance(nextPolygonPoint);
            }
        }
        return result;
    }
    /**
     * Get the bounding box (bounds) of this polygon.
     *
     * @method getBounds
     * @instance
     * @memberof Polygon
     * @return {Bounds} The rectangular bounds of this polygon.
     **/
    getBounds() {
        return _Bounds__WEBPACK_IMPORTED_MODULE_1__.Bounds.computeFromVertices(this.vertices);
    }
    /**
     * Create a deep copy of this polygon.
     *
     * @return {Polygon} The cloned polygon.
     */
    clone() {
        return new Polygon(this.vertices.map(vert => vert.clone()), this.isOpen);
    }
    /**
     * Convert this polygon to a sequence of quadratic Bézier curves.<br>
     * <br>
     * The first vertex in the returned array is the start point.<br>
     * The following sequence are pairs of control-point-and-end-point:
     * <pre>startPoint, controlPoint0, pathPoint1, controlPoint1, pathPoint2, controlPoint2, ..., endPoint</pre>
     *
     * @method toQuadraticBezierData
     * @return {Vertex[]}  An array of 2d vertices that shape the quadratic Bézier curve.
     * @instance
     * @memberof Polygon
     **/
    toQuadraticBezierData() {
        if (this.vertices.length < 3)
            return [];
        var qbezier = [];
        var cc0 = this.vertices[0];
        var cc1 = this.vertices[1];
        var edgeCenter = new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex(cc0.x + (cc1.x - cc0.x) / 2, cc0.y + (cc1.y - cc0.y) / 2);
        qbezier.push(edgeCenter);
        var limit = this.isOpen ? this.vertices.length : this.vertices.length + 1;
        for (var t = 1; t < limit; t++) {
            cc0 = this.vertices[t % this.vertices.length];
            cc1 = this.vertices[(t + 1) % this.vertices.length];
            var edgeCenter = new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex(cc0.x + (cc1.x - cc0.x) / 2, cc0.y + (cc1.y - cc0.y) / 2);
            qbezier.push(cc0);
            qbezier.push(edgeCenter);
            cc0 = cc1;
        }
        return qbezier;
    }
    /**
     * Convert this polygon to a quadratic bezier curve, represented as an SVG data string.
     *
     * @method toQuadraticBezierSVGString
     * @return {string} The 'd' part for an SVG 'path' element.
     * @instance
     * @memberof Polygon
     **/
    toQuadraticBezierSVGString() {
        var qdata = this.toQuadraticBezierData();
        if (qdata.length == 0)
            return "";
        var buffer = ["M " + qdata[0].x + " " + qdata[0].y];
        for (var i = 1; i < qdata.length; i += 2) {
            buffer.push("Q " + qdata[i].x + " " + qdata[i].y + ", " + qdata[i + 1].x + " " + qdata[i + 1].y);
        }
        return buffer.join(" ");
    }
    /**
     * Convert this polygon to a sequence of cubic Bézier curves.<br>
     * <br>
     * The first vertex in the returned array is the start point.<br>
     * The following sequence are triplets of (first-control-point, secnond-control-point, end-point):<br>
     * <pre>startPoint, controlPoint0_0, controlPoint1_1, pathPoint1, controlPoint1_0, controlPoint1_1, ..., endPoint</pre>
     *
     * @method toCubicBezierData
     * @param {number=} threshold - An optional threshold (default=1.0) how strong the curve segments
     *                              should over-/under-drive. Should be between 0.0 and 1.0 for best
     *                              results but other values are allowed.
     * @return {Vertex[]}  An array of 2d vertices that shape the cubic Bézier curve.
     * @instance
     * @memberof Polygon
     **/
    toCubicBezierData(threshold) {
        if (typeof threshold == "undefined")
            threshold = 1.0;
        if (this.vertices.length < 3)
            return [];
        var cbezier = [];
        var a = this.vertices[0];
        var b = this.vertices[1];
        var edgeCenter = new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex(a.x + (b.x - a.x) / 2, a.y + (b.y - a.y) / 2);
        cbezier.push(edgeCenter);
        var limit = this.isOpen ? this.vertices.length - 1 : this.vertices.length;
        for (var t = 0; t < limit; t++) {
            var a = this.vertices[t % this.vertices.length];
            var b = this.vertices[(t + 1) % this.vertices.length];
            var c = this.vertices[(t + 2) % this.vertices.length];
            var aCenter = new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex(a.x + (b.x - a.x) / 2, a.y + (b.y - a.y) / 2);
            var bCenter = new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex(b.x + (c.x - b.x) / 2, b.y + (c.y - b.y) / 2);
            var a2 = new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex(aCenter.x + (b.x - aCenter.x) * threshold, aCenter.y + (b.y - aCenter.y) * threshold);
            var b0 = new _Vertex__WEBPACK_IMPORTED_MODULE_3__.Vertex(bCenter.x + (b.x - bCenter.x) * threshold, bCenter.y + (b.y - bCenter.y) * threshold);
            cbezier.push(a2);
            cbezier.push(b0);
            cbezier.push(bCenter);
        }
        return cbezier;
    }
    /**
     * Convert this polygon to a cubic bezier curve, represented as an SVG data string.
     *
     * @method toCubicBezierSVGString
     * @return {string} The 'd' part for an SVG 'path' element.
     * @instance
     * @memberof Polygon
     **/
    toCubicBezierSVGString(threshold) {
        var qdata = this.toCubicBezierData(threshold);
        if (qdata.length == 0)
            return "";
        var buffer = ["M " + qdata[0].x + " " + qdata[0].y];
        for (var i = 1; i < qdata.length; i += 3) {
            buffer.push("C " +
                qdata[i].x +
                " " +
                qdata[i].y +
                ", " +
                qdata[i + 1].x +
                " " +
                qdata[i + 1].y +
                ", " +
                qdata[i + 2].x +
                " " +
                qdata[i + 2].y);
        }
        return buffer.join(" ");
    }
    /**
     * Convert this polygon to a cubic bezier path instance.
     *
     * @method toCubicBezierPath
     * @param {number} threshold - The threshold, usually from 0.0 to 1.0.
     * @return {BezierPath}      - A bezier path instance.
     * @instance
     * @memberof Polygon
     **/
    toCubicBezierPath(threshold) {
        var qdata = this.toCubicBezierData(threshold);
        // Conver the linear path vertices to a two-dimensional path array
        var pathdata = [];
        for (var i = 0; i + 3 < qdata.length; i += 3) {
            pathdata.push([qdata[i], qdata[i + 3], qdata[i + 1], qdata[i + 2]]);
        }
        return _BezierPath__WEBPACK_IMPORTED_MODULE_0__.BezierPath.fromArray(pathdata);
    }
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    destroy() {
        for (var i = 0; i < this.vertices.length; i++) {
            this.vertices[i].destroy();
        }
        this.isDestroyed = true;
    }
}
Polygon.utils = {
    /**
     * Calculate the area of the given polygon (unsigned).
     *
     * Note that this does not work for self-intersecting polygons.
     *
     * @name area
     * @return {number}
     */
    area(vertices) {
        // Found at:
        //    https://stackoverflow.com/questions/16285134/calculating-polygon-area
        let total = 0.0;
        for (var i = 0, l = vertices.length; i < l; i++) {
            const addX = vertices[i].x;
            const addY = vertices[(i + 1) % l].y;
            const subX = vertices[(i + 1) % l].x;
            const subY = vertices[i].y;
            total += addX * addY * 0.5;
            total -= subX * subY * 0.5;
        }
        return Math.abs(total);
    },
    /**
     * Calulate the signed polyon area by interpreting the polygon as a matrix
     * and calculating its determinant.
     *
     * @name signedArea
     * @return {number}
     */
    signedArea(vertices) {
        let sum = 0;
        const n = vertices.length;
        for (var i = 0; i < n; i++) {
            const j = (i + 1) % n;
            sum += (vertices[j].x - vertices[i].x) * (vertices[i].y + vertices[j].y);
        }
        return sum;
    }
};
//# sourceMappingURL=Polygon.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/Triangle.js":
/*!**********************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/Triangle.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Triangle: () => (/* binding */ Triangle)
/* harmony export */ });
/* harmony import */ var _Bounds__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Bounds */ "./node_modules/plotboilerplate/src/esm/Bounds.js");
/* harmony import */ var _Circle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Circle */ "./node_modules/plotboilerplate/src/esm/Circle.js");
/* harmony import */ var _Line__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Line */ "./node_modules/plotboilerplate/src/esm/Line.js");
/* harmony import */ var _Polygon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Polygon */ "./node_modules/plotboilerplate/src/esm/Polygon.js");
/* harmony import */ var _UIDGenerator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./UIDGenerator */ "./node_modules/plotboilerplate/src/esm/UIDGenerator.js");
/* harmony import */ var _Vertex__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Vertex */ "./node_modules/plotboilerplate/src/esm/Vertex.js");
/* harmony import */ var _geomutils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./geomutils */ "./node_modules/plotboilerplate/src/esm/geomutils.js");
/**
 * @author    Ikaros Kappler
 * @date_init 2012-10-17 (Wrote a first version of this in that year).
 * @date      2018-04-03 (Refactored the code into a new class).
 * @modified  2018-04-28 Added some documentation.
 * @modified  2019-09-11 Added the scaleToCentroid(Number) function (used by the walking triangle demo).
 * @modified  2019-09-12 Added beautiful JSDoc compliable comments.
 * @modified  2019-11-07 Added to toSVG(options) function to make Triangles renderable as SVG.
 * @modified  2019-12-09 Fixed the determinant() function. The calculation was just wrong.
 * @modified  2020-03-16 (Corona times) Added the 'fromArray' function.
 * @modified  2020-03-17 Added the Triangle.toPolygon() function.
 * @modified  2020-03-17 Added proper JSDoc comments.
 * @modified  2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @modified  2020-05-09 Added the new Circle class (ported to Typescript from the demos).
 * @modified  2020-05-12 Added getIncircularTriangle() function.
 * @modified  2020-05-12 Added getIncircle() function.
 * @modified  2020-05-12 Fixed the signature of getCircumcirle(). Was still a generic object.
 * @modified  2020-06-18 Added the `getIncenter` function.
 * @modified  2020-12-28 Added the `getArea` function.
 * @modified  2021-01-20 Added UID.
 * @modified  2021-01-22 Always updating circumcircle when retieving it.
 * @modified  2022-02-02 Added the `destroy` method.
 * @modified  2022-02-02 Cleared the `Triangle.toSVGString` function (deprecated). Use `drawutilssvg` instead.
 * @version   2.6.0
 *
 * @file Triangle
 * @fileoverview A simple triangle class: three vertices.
 * @public
 **/







/**
 * @classdesc A triangle class for triangulations.
 *
 * The class was written for a Delaunay trinagulation demo so it might
 * contain some strange and unexpected functions.
 *
 * @requires Bounds
 * @requires Circle
 * @requires Line
 * @requires Vertex
 * @requires Polygon
 * @requires SVGSerializale
 * @requires UID
 * @requires UIDGenerator
 * @requires geomutils
 *
 */
class Triangle {
    /**
     * The constructor.
     *
     * @constructor
     * @name Triangle
     * @param {Vertex} a - The first vertex of the triangle.
     * @param {Vertex} b - The second vertex of the triangle.
     * @param {Vertex} c - The third vertex of the triangle.
     **/
    constructor(a, b, c) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "Triangle";
        this.uid = _UIDGenerator__WEBPACK_IMPORTED_MODULE_4__.UIDGenerator.next();
        this.a = a;
        this.b = b;
        this.c = c;
        this.calcCircumcircle();
    }
    /**
     * Create a new triangle from the given array of vertices.
     *
     * The array must have at least three vertices, otherwise an error will be raised.
     * This function will not create copies of the vertices.
     *
     * @method fromArray
     * @static
     * @param {Array<Vertex>} arr - The required array with at least three vertices.
     * @memberof Vertex
     * @return {Triangle}
     **/
    static fromArray(arr) {
        if (arr.length < 3)
            throw `Cannot create triangle from array with less than three vertices (${arr.length})`;
        return new Triangle(arr[0], arr[1], arr[2]);
    }
    /**
     * Get the area of this triangle. The returned area is never negative.
     *
     * If you are interested in the signed area, please consider using the
     * `Triangle.utils.signedArea` helper function. This method just returns
     * the absolute value of the signed area.
     *
     * @method getArea
     * @instance
     * @memberof Triangle
     * @return {number} The non-negative area of this triangle.
     */
    getArea() {
        return Math.abs(Triangle.utils.signedArea(this.a.x, this.a.y, this.b.x, this.b.y, this.c.x, this.c.y));
    }
    /**
     * Get the centroid of this triangle.
     *
     * The centroid is the average midpoint for each side.
     *
     * @method getCentroid
     * @return {Vertex} The centroid
     * @instance
     * @memberof Triangle
     **/
    getCentroid() {
        return new _Vertex__WEBPACK_IMPORTED_MODULE_5__.Vertex((this.a.x + this.b.x + this.c.x) / 3, (this.a.y + this.b.y + this.c.y) / 3);
    }
    /**
     * Scale the triangle towards its centroid.
     *
     * @method scaleToCentroid
     * @param {number} - The scale factor to use. That can be any scalar.
     * @return {Triangle} this (for chaining)
     * @instance
     * @memberof Triangle
     */
    scaleToCentroid(factor) {
        let centroid = this.getCentroid();
        this.a.scale(factor, centroid);
        this.b.scale(factor, centroid);
        this.c.scale(factor, centroid);
        return this;
    }
    /**
     * Get the circumcircle of this triangle.
     *
     * The circumcircle is that unique circle on which all three
     * vertices of this triangle are located on.
     *
     * Please note that for performance reasons any changes to vertices will not reflect in changes
     * of the circumcircle (center or radius). Please call the calcCirumcircle() function
     * after triangle vertex changes.
     *
     * @method getCircumcircle
     * @return {Object} - { center:Vertex, radius:float }
     * @instance
     * @memberof Triangle
     */
    getCircumcircle() {
        // if( !this.center || !this.radius )
        this.calcCircumcircle();
        return new _Circle__WEBPACK_IMPORTED_MODULE_1__.Circle(this.center.clone(), this.radius);
    }
    /**
     * Check if this triangle and the passed triangle share an
     * adjacent edge.
     *
     * For edge-checking Vertex.equals is used which uses an
     * an epsilon for comparison.
     *
     * @method isAdjacent
     * @param {Triangle} tri - The second triangle to check adjacency with.
     * @return {boolean} - True if this and the passed triangle have at least one common edge.
     * @instance
     * @memberof Triangle
     */
    isAdjacent(tri) {
        var a = this.a.equals(tri.a) || this.a.equals(tri.b) || this.a.equals(tri.c);
        var b = this.b.equals(tri.a) || this.b.equals(tri.b) || this.b.equals(tri.c);
        var c = this.c.equals(tri.a) || this.c.equals(tri.b) || this.c.equals(tri.c);
        return (a && b) || (a && c) || (b && c);
    }
    /**
     * Get that vertex of this triangle (a,b,c) that is not vert1 nor vert2 of
     * the passed two.
     *
     * @method getThirdVertex
     * @param {Vertex} vert1 - The first vertex.
     * @param {Vertex} vert2 - The second vertex.
     * @return {Vertex} - The third vertex of this triangle that makes up the whole triangle with vert1 and vert2.
     * @instance
     * @memberof Triangle
     */
    getThirdVertex(vert1, vert2) {
        if ((this.a.equals(vert1) && this.b.equals(vert2)) || (this.a.equals(vert2) && this.b.equals(vert1)))
            return this.c;
        if ((this.b.equals(vert1) && this.c.equals(vert2)) || (this.b.equals(vert2) && this.c.equals(vert1)))
            return this.a;
        //if( this.c.equals(vert1) && this.a.equals(vert2) || this.c.equals(vert2) && this.a.equals(vert1) )
        return this.b;
    }
    /**
     * Re-compute the circumcircle of this triangle (if the vertices
     * have changed).
     *
     * The circumcenter and radius are stored in this.center and
     * this.radius. There is a third result: radius_squared (for internal computations).
     *
     * @method calcCircumcircle
     * @return void
     * @instance
     * @memberof Triangle
     */
    calcCircumcircle() {
        // From
        //    http://www.exaflop.org/docs/cgafaq/cga1.html
        const A = this.b.x - this.a.x;
        const B = this.b.y - this.a.y;
        const C = this.c.x - this.a.x;
        const D = this.c.y - this.a.y;
        const E = A * (this.a.x + this.b.x) + B * (this.a.y + this.b.y);
        const F = C * (this.a.x + this.c.x) + D * (this.a.y + this.c.y);
        const G = 2.0 * (A * (this.c.y - this.b.y) - B * (this.c.x - this.b.x));
        let dx, dy;
        if (Math.abs(G) < Triangle.EPSILON) {
            // Collinear - find extremes and use the midpoint
            const bounds = this.bounds();
            this.center = new _Vertex__WEBPACK_IMPORTED_MODULE_5__.Vertex((bounds.min.x + bounds.max.x) / 2, (bounds.min.y + bounds.max.y) / 2);
            dx = this.center.x - bounds.min.x;
            dy = this.center.y - bounds.min.y;
        }
        else {
            const cx = (D * E - B * F) / G;
            const cy = (A * F - C * E) / G;
            this.center = new _Vertex__WEBPACK_IMPORTED_MODULE_5__.Vertex(cx, cy);
            dx = this.center.x - this.a.x;
            dy = this.center.y - this.a.y;
        }
        this.radius_squared = dx * dx + dy * dy;
        this.radius = Math.sqrt(this.radius_squared);
    } // END calcCircumcircle
    /**
     * Check if the passed vertex is inside this triangle's
     * circumcircle.
     *
     * @method inCircumcircle
     * @param {Vertex} v - The vertex to check.
     * @return {boolean}
     * @instance
     * @memberof Triangle
     */
    inCircumcircle(v) {
        const dx = this.center.x - v.x;
        const dy = this.center.y - v.y;
        const dist_squared = dx * dx + dy * dy;
        return dist_squared <= this.radius_squared;
    }
    /**
     * Get the rectangular bounds for this triangle.
     *
     * @method bounds
     * @return {Bounds} - The min/max bounds of this triangle.
     * @instance
     * @memberof Triangle
     */
    bounds() {
        return new _Bounds__WEBPACK_IMPORTED_MODULE_0__.Bounds(new _Vertex__WEBPACK_IMPORTED_MODULE_5__.Vertex(Triangle.utils.min3(this.a.x, this.b.x, this.c.x), Triangle.utils.min3(this.a.y, this.b.y, this.c.y)), new _Vertex__WEBPACK_IMPORTED_MODULE_5__.Vertex(Triangle.utils.max3(this.a.x, this.b.x, this.c.x), Triangle.utils.max3(this.a.y, this.b.y, this.c.y)));
    }
    /**
     * Convert this triangle to a polygon instance.
     *
     * Plase note that this conversion does not perform a deep clone.
     *
     * @method toPolygon
     * @return {Polygon} A new polygon representing this triangle.
     * @instance
     * @memberof Triangle
     **/
    toPolygon() {
        return new _Polygon__WEBPACK_IMPORTED_MODULE_3__.Polygon([this.a, this.b, this.c]);
    }
    /**
     * Get the determinant of this triangle.
     *
     * @method determinant
     * @return {number} - The determinant (float).
     * @instance
     * @memberof Triangle
     */
    determinant() {
        // (b.y - a.y)*(c.x - b.x) - (c.y - b.y)*(b.x - a.x);
        return (this.b.y - this.a.y) * (this.c.x - this.b.x) - (this.c.y - this.b.y) * (this.b.x - this.a.x);
    }
    /**
     * Checks if the passed vertex (p) is inside this triangle.
     *
     * Note: matrix determinants rock.
     *
     * @method containsPoint
     * @param {Vertex} p - The vertex to check.
     * @return {boolean}
     * @instance
     * @memberof Triangle
     */
    containsPoint(p) {
        return Triangle.utils.pointIsInTriangle(p.x, p.y, this.a.x, this.a.y, this.b.x, this.b.y, this.c.x, this.c.y);
    }
    /**
     * Get that inner triangle which defines the maximal incircle.
     *
     * @return {Triangle} The triangle of those points in this triangle that define the incircle.
     */
    getIncircularTriangle() {
        const lineA = new _Line__WEBPACK_IMPORTED_MODULE_2__.Line(this.a, this.b);
        const lineB = new _Line__WEBPACK_IMPORTED_MODULE_2__.Line(this.b, this.c);
        const lineC = new _Line__WEBPACK_IMPORTED_MODULE_2__.Line(this.c, this.a);
        const bisector1 = _geomutils__WEBPACK_IMPORTED_MODULE_6__.geomutils.nsectAngle(this.b, this.a, this.c, 2)[0]; // bisector of first angle (in b)
        const bisector2 = _geomutils__WEBPACK_IMPORTED_MODULE_6__.geomutils.nsectAngle(this.c, this.b, this.a, 2)[0]; // bisector of second angle (in c)
        // Cast to non-null here because we know there _is_ an intersection
        const intersection = bisector1.intersection(bisector2);
        // Find the closest points on one of the polygon lines (all have same distance by construction)
        const circleIntersA = lineA.getClosestPoint(intersection);
        const circleIntersB = lineB.getClosestPoint(intersection);
        const circleIntersC = lineC.getClosestPoint(intersection);
        return new Triangle(circleIntersA, circleIntersB, circleIntersC);
    }
    /**
     * Get the incircle of this triangle. That is the circle that touches each side
     * of this triangle in exactly one point.
     *
     * Note this just calls getIncircularTriangle().getCircumcircle()
     *
     * @return {Circle} The incircle of this triangle.
     */
    getIncircle() {
        return this.getIncircularTriangle().getCircumcircle();
    }
    /**
     * Get the incenter of this triangle (which is the center of the circumcircle).
     *
     * Note: due to performance reasonst the incenter is buffered inside the triangle because
     *       computing it is relatively expensive. If a, b or c have changed you should call the
     *       calcCircumcircle() function first, otherwise you might get wrong results.
     * @return Vertex The incenter of this triangle.
     **/
    getIncenter() {
        if (!this.center || !this.radius)
            this.calcCircumcircle();
        return this.center.clone();
    }
    /**
     * Converts this triangle into a human-readable string.
     *
     * @method toString
     * @return {string}
     * @instance
     * @memberof Triangle
     */
    toString() {
        return "{ a : " + this.a.toString() + ", b : " + this.b.toString() + ", c : " + this.c.toString() + "}";
    }
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    destroy() {
        this.a.destroy();
        this.b.destroy();
        this.c.destroy();
        this.isDestroyed = true;
    }
}
/**
 * An epsilon for comparison.
 * This should be the same epsilon as in Vertex.
 *
 * @private
 **/
Triangle.EPSILON = 1.0e-6;
Triangle.utils = {
    // Used in the bounds() function.
    max3(a, b, c) {
        return a >= b && a >= c ? a : b >= a && b >= c ? b : c;
    },
    min3(a, b, c) {
        return a <= b && a <= c ? a : b <= a && b <= c ? b : c;
    },
    signedArea(p0x, p0y, p1x, p1y, p2x, p2y) {
        return 0.5 * (-p1y * p2x + p0y * (-p1x + p2x) + p0x * (p1y - p2y) + p1x * p2y);
    },
    /**
     * Used by the containsPoint() function.
     *
     * @private
     **/
    pointIsInTriangle(px, py, p0x, p0y, p1x, p1y, p2x, p2y) {
        //
        // Point-in-Triangle test found at
        //   http://stackoverflow.com/questions/2049582/how-to-determine-a-point-in-a-2d-triangle
        // var area : number = 1/2*(-p1y*p2x + p0y*(-p1x + p2x) + p0x*(p1y - p2y) + p1x*p2y);
        var area = Triangle.utils.signedArea(p0x, p0y, p1x, p1y, p2x, p2y);
        var s = (1 / (2 * area)) * (p0y * p2x - p0x * p2y + (p2y - p0y) * px + (p0x - p2x) * py);
        var t = (1 / (2 * area)) * (p0x * p1y - p0y * p1x + (p0y - p1y) * px + (p1x - p0x) * py);
        return s > 0 && t > 0 && 1 - s - t > 0;
    }
};
//# sourceMappingURL=Triangle.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/UIDGenerator.js":
/*!**************************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/UIDGenerator.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UIDGenerator: () => (/* binding */ UIDGenerator)
/* harmony export */ });
/**
 * @classdesc A static UIDGenerator.
 *
 * @author  Ikaros Kappler
 * @date    2021-01-20
 * @version 1.0.0
 */
class UIDGenerator {
    static next() {
        return `${UIDGenerator.current++}`;
    }
}
UIDGenerator.current = 0;
//# sourceMappingURL=UIDGenerator.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/VEllipse.js":
/*!**********************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/VEllipse.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VEllipse: () => (/* binding */ VEllipse)
/* harmony export */ });
/* harmony import */ var _Line__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Line */ "./node_modules/plotboilerplate/src/esm/Line.js");
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Vector */ "./node_modules/plotboilerplate/src/esm/Vector.js");
/* harmony import */ var _Vertex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Vertex */ "./node_modules/plotboilerplate/src/esm/Vertex.js");
/* harmony import */ var _UIDGenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./UIDGenerator */ "./node_modules/plotboilerplate/src/esm/UIDGenerator.js");
/* harmony import */ var _CubicBezierCurve__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./CubicBezierCurve */ "./node_modules/plotboilerplate/src/esm/CubicBezierCurve.js");
/**
 * @author   Ikaros Kappler
 * @date     2018-11-28
 * @modified 2018-12-04 Added the toSVGString function.
 * @modified 2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @modified 2021-01-20 Added UID.
 * @modified 2021-02-14 Added functions `radiusH` and `radiusV`.
 * @modified 2021-02-26 Added helper function `decribeSVGArc(...)`.
 * @modified 2021-03-01 Added attribute `rotation` to allow rotation of ellipses.
 * @modified 2021-03-03 Added the `vertAt` and `perimeter` methods.
 * @modified 2021-03-05 Added the `getFoci`, `normalAt` and `tangentAt` methods.
 * @modified 2021-03-09 Added the `clone` and `rotate` methods.
 * @modified 2021-03-10 Added the `toCubicBezier` method.
 * @modified 2021-03-15 Added `VEllipse.quarterSegmentCount` and `VEllipse.scale` functions.
 * @modified 2021-03-19 Added the `VEllipse.rotate` function.
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2022-02-02 Cleared the `VEllipse.toSVGString` function (deprecated). Use `drawutilssvg` instead.
 * @version  1.3.0
 *
 * @file VEllipse
 * @fileoverview Ellipses with a center and an x- and a y-axis (stored as a vertex).
 **/





/**
 * @classdesc An ellipse class based on two vertices [centerX,centerY] and [radiusX,radiusY].
 *
 * @requires SVGSerializable
 * @requires UID
 * @requires UIDGenerator
 * @requires Vertex
 */
class VEllipse {
    /**
     * The constructor.
     *
     * @constructor
     * @param {Vertex} center - The ellipses center.
     * @param {Vertex} axis - The x- and y-axis (the two radii encoded in a control point).
     * @param {Vertex} rotation - [optional, default=0] The rotation of this ellipse.
     * @name VEllipse
     **/
    constructor(center, axis, rotation) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "VEllipse";
        this.uid = _UIDGenerator__WEBPACK_IMPORTED_MODULE_3__.UIDGenerator.next();
        this.center = center;
        this.axis = axis;
        this.rotation = rotation || 0.0;
    }
    /**
     * Clone this ellipse (deep clone).
     *
     * @return {VEllipse} A copy of this ellipse.s
     */
    clone() {
        return new VEllipse(this.center.clone(), this.axis.clone(), this.rotation);
    }
    /**
     * Get the non-negative horizonal radius of this ellipse.
     *
     * @method radiusH
     * @instance
     * @memberof VEllipse
     * @return {number} The unsigned horizontal radius of this ellipse.
     */
    radiusH() {
        return Math.abs(this.signedRadiusH());
    }
    /**
     * Get the signed horizonal radius of this ellipse.
     *
     * @method signedRadiusH
     * @instance
     * @memberof VEllipse
     * @return {number} The signed horizontal radius of this ellipse.
     */
    signedRadiusH() {
        // return Math.abs(this.axis.x - this.center.x);
        // Rotate axis back to origin before calculating radius
        // return Math.abs(new Vertex(this.axis).rotate(-this.rotation,this.center).x - this.center.x);
        return new _Vertex__WEBPACK_IMPORTED_MODULE_2__.Vertex(this.axis).rotate(-this.rotation, this.center).x - this.center.x;
    }
    /**
     * Get the non-negative vertical radius of this ellipse.
     *
     * @method radiusV
     * @instance
     * @memberof VEllipse
     * @return {number} The unsigned vertical radius of this ellipse.
     */
    radiusV() {
        return Math.abs(this.signedRadiusV());
    }
    /**
     * Get the signed vertical radius of this ellipse.
     *
     * @method radiusV
     * @instance
     * @memberof VEllipse
     * @return {number} The signed vertical radius of this ellipse.
     */
    signedRadiusV() {
        // return Math.abs(this.axis.y - this.center.y);
        // Rotate axis back to origin before calculating radius
        // return Math.abs(new Vertex(this.axis).rotate(-this.rotation,this.center).y - this.center.y);
        return new _Vertex__WEBPACK_IMPORTED_MODULE_2__.Vertex(this.axis).rotate(-this.rotation, this.center).y - this.center.y;
    }
    /**
     * Scale this ellipse by the given factor from the center point. The factor will be applied to both radii.
     *
     * @method scale
     * @instance
     * @memberof VEllipse
     * @param {number} factor - The factor to scale by.
     * @return {VEllipse} this for chaining.
     */
    scale(factor) {
        this.axis.scale(factor, this.center);
        return this;
    }
    /**
     * Rotate this ellipse around its center.
     *
     * @method rotate
     * @instance
     * @memberof VEllipse
     * @param {number} angle - The angle to rotate by.
     * @returns {VEllipse} this for chaining.
     */
    rotate(angle) {
        this.axis.rotate(angle, this.center);
        this.rotation += angle;
        return this;
    }
    /**
     * Get the vertex on the ellipse's outline at the given angle.
     *
     * @method vertAt
     * @instance
     * @memberof VEllipse
     * @param {number} angle - The angle to determine the vertex at.
     * @return {Vertex} The vertex on the outline at the given angle.
     */
    vertAt(angle) {
        // Tanks to Narasinham for the vertex-on-ellipse equations
        // https://math.stackexchange.com/questions/22064/calculating-a-point-that-lies-on-an-ellipse-given-an-angle
        const a = this.radiusH();
        const b = this.radiusV();
        return new _Vertex__WEBPACK_IMPORTED_MODULE_2__.Vertex(VEllipse.utils.polarToCartesian(this.center.x, this.center.y, a, b, angle)).rotate(this.rotation, this.center);
    }
    /**
     * Get the normal vector at the given angle.
     * The normal vector is the vector that intersects the ellipse in a 90 degree angle
     * at the given point (speicified by the given angle).
     *
     * Length of desired normal vector can be specified, default is 1.0.
     *
     * @method normalAt
     * @instance
     * @memberof VEllipse
     * @param {number} angle - The angle to get the normal vector at.
     * @param {number=1.0} length - [optional, default=1] The length of the returned vector.
     */
    normalAt(angle, length) {
        const point = this.vertAt(angle);
        const foci = this.getFoci();
        // Calculate the angle between [point,focusA] and [point,focusB]
        const angleA = new _Line__WEBPACK_IMPORTED_MODULE_0__.Line(point, foci[0]).angle();
        const angleB = new _Line__WEBPACK_IMPORTED_MODULE_0__.Line(point, foci[1]).angle();
        const centerAngle = angleA + (angleB - angleA) / 2.0;
        const endPointA = point.clone().addX(50).clone().rotate(centerAngle, point);
        const endPointB = point
            .clone()
            .addX(50)
            .clone()
            .rotate(Math.PI + centerAngle, point);
        if (this.center.distance(endPointA) < this.center.distance(endPointB)) {
            return new _Vector__WEBPACK_IMPORTED_MODULE_1__.Vector(point, endPointB);
        }
        else {
            return new _Vector__WEBPACK_IMPORTED_MODULE_1__.Vector(point, endPointA);
        }
    }
    /**
     * Get the tangent vector at the given angle.
     * The tangent vector is the vector that touches the ellipse exactly at the given given
     * point (speicified by the given angle).
     *
     * Note that the tangent is just 90 degree rotated normal vector.
     *
     * Length of desired tangent vector can be specified, default is 1.0.
     *
     * @method tangentAt
     * @instance
     * @memberof VEllipse
     * @param {number} angle - The angle to get the tangent vector at.
     * @param {number=1.0} length - [optional, default=1] The length of the returned vector.
     */
    tangentAt(angle, length) {
        const normal = this.normalAt(angle, length);
        // Rotate the normal by 90 degrees, then it is the tangent.
        normal.b.rotate(Math.PI / 2, normal.a);
        return normal;
    }
    /**
     * Get the perimeter of this ellipse.
     *
     * @method perimeter
     * @instance
     * @memberof VEllipse
     * @return {number}
     */
    perimeter() {
        // This method does not use an iterative approximation to determine the perimeter, but it uses
        // a wonderful closed approximation found by Srinivasa Ramanujan.
        // Matt Parker made a neat video about it:
        //    https://www.youtube.com/watch?v=5nW3nJhBHL0
        const a = this.radiusH();
        const b = this.radiusV();
        return Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
    }
    /**
     * Get the two foci of this ellipse.
     *
     * @method getFoci
     * @instance
     * @memberof VEllipse
     * @return {Array<Vertex>} An array with two elements, the two focal points of the ellipse (foci).
     */
    getFoci() {
        // https://www.mathopenref.com/ellipsefoci.html
        const rh = this.radiusH();
        const rv = this.radiusV();
        const sdiff = rh * rh - rv * rv;
        // f is the distance of each focs to the center.
        const f = Math.sqrt(Math.abs(sdiff));
        // Foci on x- or y-axis?
        if (sdiff < 0) {
            return [
                this.center.clone().addY(f).rotate(this.rotation, this.center),
                this.center.clone().addY(-f).rotate(this.rotation, this.center)
            ];
        }
        else {
            return [
                this.center.clone().addX(f).rotate(this.rotation, this.center),
                this.center.clone().addX(-f).rotate(this.rotation, this.center)
            ];
        }
    }
    /**
     * Get equally distributed points on the outline of this ellipse.
     *
     * @param {number} pointCount - The number of points.
     * @returns {Array<Vertex>}
     */
    getEquidistantVertices(pointCount) {
        const angles = VEllipse.utils.equidistantVertAngles(this.radiusH(), this.radiusV(), pointCount);
        const result = [];
        for (var i = 0; i < angles.length; i++) {
            result.push(this.vertAt(angles[i]));
        }
        return result;
    }
    /**
     * Convert this ellipse into cubic Bézier curves.
     *
     * @param {number=3} quarterSegmentCount - The number of segments per base elliptic quarter (default is 3, min is 1).
     * @param {number=0.666666} threshold - The Bézier threshold (default value 0.666666 approximates the ellipse with best results
     * but you might wish to use other values)
     * @return {Array<CubicBezierCurve>} An array of cubic Bézier curves representing this ellipse.
     */
    toCubicBezier(quarterSegmentCount, threshold) {
        // Math by Luc Maisonobe
        //    http://www.spaceroots.org/documents/ellipse/node22.html
        // Note that ellipses with radiusH=0 or radiusV=0 cannot be represented as Bézier curves.
        // Return a single line here (as a Bézier curve)
        // if (Math.abs(this.radiusV()) < 0.00001) {
        //   const radiusH = this.radiusH();
        //   return [
        //     new CubicBezierCurve(
        //       this.center.clone().addX(radiusH),
        //       this.center.clone().addX(-radiusH),
        //       this.center.clone(),
        //       this.center.clone()
        //     )
        //   ]; // TODO: test horizontal line ellipse
        // }
        // if (Math.abs(this.radiusH()) < 0.00001) {
        //   const radiusV = this.radiusV();
        //   return [
        //     new CubicBezierCurve(
        //       this.center.clone().addY(radiusV),
        //       this.center.clone().addY(-radiusV),
        //       this.center.clone(),
        //       this.center.clone()
        //     )
        //   ]; // TODO: test vertical line ellipse
        // }
        // At least 4, but 16 seems to be a good value.
        const segmentCount = Math.max(1, quarterSegmentCount || 3) * 4;
        threshold = typeof threshold === "undefined" ? 0.666666 : threshold;
        const radiusH = this.radiusH();
        const radiusV = this.radiusV();
        const curves = [];
        const angles = VEllipse.utils.equidistantVertAngles(radiusH, radiusV, segmentCount);
        let curAngle = angles[0];
        let startPoint = this.vertAt(curAngle);
        for (var i = 0; i < angles.length; i++) {
            let nextAngle = angles[(i + 1) % angles.length];
            let endPoint = this.vertAt(nextAngle);
            if (Math.abs(radiusV) < 0.0001 || Math.abs(radiusH) < 0.0001) {
                // Distorted ellipses can only be approximated by linear Bézier segments
                let diff = startPoint.difference(endPoint);
                let curve = new _CubicBezierCurve__WEBPACK_IMPORTED_MODULE_4__.CubicBezierCurve(startPoint.clone(), endPoint.clone(), startPoint.clone().addXY(diff.x * 0.333, diff.y * 0.333), endPoint.clone().addXY(-diff.x * 0.333, -diff.y * 0.333));
                curves.push(curve);
            }
            else {
                let startTangent = this.tangentAt(curAngle);
                let endTangent = this.tangentAt(nextAngle);
                // Find intersection
                let intersection = startTangent.intersection(endTangent);
                // What if intersection is undefined?
                // --> This *can* not happen if segmentCount > 2 and height and width of the ellipse are not zero.
                let startDiff = startPoint.difference(intersection);
                let endDiff = endPoint.difference(intersection);
                let curve = new _CubicBezierCurve__WEBPACK_IMPORTED_MODULE_4__.CubicBezierCurve(startPoint.clone(), endPoint.clone(), startPoint.clone().add(startDiff.scale(threshold)), endPoint.clone().add(endDiff.scale(threshold)));
                curves.push(curve);
            }
            startPoint = endPoint;
            curAngle = nextAngle;
        }
        return curves;
    }
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    destroy() {
        this.center.destroy();
        this.axis.destroy();
        this.isDestroyed = true;
    }
}
/**
 * A static collection of ellipse-related helper functions.
 * @static
 */
VEllipse.utils = {
    /**
     * Calculate a particular point on the outline of the given ellipse (center plus two radii plus angle).
     *
     * @name polarToCartesian
     * @param {number} centerX - The x coordinate of the elliptic center.
     * @param {number} centerY - The y coordinate of the elliptic center.
     * @param {number} radiusH - The horizontal radius of the ellipse.
     * @param {number} radiusV - The vertical radius of the ellipse.
     * @param {number} angle - The angle (in radians) to get the desired outline point for.
     * @reutn {XYCoords} The outlont point in absolute x-y-coordinates.
     */
    polarToCartesian: (centerX, centerY, radiusH, radiusV, angle) => {
        // Tanks to Narasinham for the vertex-on-ellipse equations
        // https://math.stackexchange.com/questions/22064/calculating-a-point-that-lies-on-an-ellipse-given-an-angle
        var s = Math.sin(Math.PI / 2 - angle);
        var c = Math.cos(Math.PI / 2 - angle);
        return {
            x: centerX + (radiusH * radiusV * s) / Math.sqrt(Math.pow(radiusH * c, 2) + Math.pow(radiusV * s, 2)),
            y: centerY + (radiusH * radiusV * c) / Math.sqrt(Math.pow(radiusH * c, 2) + Math.pow(radiusV * s, 2))
        };
    },
    /**
     * Get the `theta` for a given `phi` (used to determine equidistant points on ellipse).
     *
     * @param radiusH
     * @param radiusV
     * @param phi
     * @returns {number} theta
     */
    phiToTheta: (radiusH, radiusV, phi) => {
        //  See https://math.stackexchange.com/questions/172766/calculating-equidistant-points-around-an-ellipse-arc
        var tanPhi = Math.tan(phi);
        var tanPhi2 = tanPhi * tanPhi;
        var theta = -Math.PI / 2 + phi + Math.atan(((radiusH - radiusV) * tanPhi) / (radiusV + radiusH * tanPhi2));
        return theta;
    },
    /**
     * Get n equidistant points on the elliptic arc.
     *
     * @param pointCount
     * @returns
     */
    equidistantVertAngles: (radiusH, radiusV, pointCount) => {
        const angles = [];
        for (var i = 0; i < pointCount; i++) {
            var phi = Math.PI / 2.0 + ((Math.PI * 2) / pointCount) * i;
            let theta = VEllipse.utils.phiToTheta(radiusH, radiusV, phi);
            angles[i] = theta;
        }
        return angles;
    }
}; // END utils
//# sourceMappingURL=VEllipse.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/VEllipseSector.js":
/*!****************************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/VEllipseSector.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VEllipseSector: () => (/* binding */ VEllipseSector)
/* harmony export */ });
/* harmony import */ var _CubicBezierCurve__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CubicBezierCurve */ "./node_modules/plotboilerplate/src/esm/CubicBezierCurve.js");
/* harmony import */ var _geomutils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./geomutils */ "./node_modules/plotboilerplate/src/esm/geomutils.js");
/* harmony import */ var _Line__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Line */ "./node_modules/plotboilerplate/src/esm/Line.js");
/* harmony import */ var _UIDGenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./UIDGenerator */ "./node_modules/plotboilerplate/src/esm/UIDGenerator.js");
/* harmony import */ var _VEllipse__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./VEllipse */ "./node_modules/plotboilerplate/src/esm/VEllipse.js");
/* harmony import */ var _Vertex__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Vertex */ "./node_modules/plotboilerplate/src/esm/Vertex.js");
/**
 * Implementation of elliptic sectors.
 * Note that sectors are constructed in clockwise direction.
 *
 * @author   Ikaros Kappler
 * @date     2021-02-26
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2022-11-01 Tweaked the `endpointToCenterParameters` function to handle negative values, too, without errors.
 * @version  1.1.1
 */






/**
 * @classdesc A class for elliptic sectors.
 *
 * @requires Line
 * @requires Vector
 * @requires VertTuple
 * @requires Vertex
 * @requires SVGSerializale
 * @requires UID
 * @requires UIDGenerator
 **/
class VEllipseSector {
    /**
     * Create a new elliptic sector from the given ellipse and two angles.
     *
     * Note that the direction from start to end goes clockwise, and that start and end angle
     * will be wrapped to [0,PI*2).
     *
     * @constructor
     * @name VEllipseSector
     * @param {VEllipse} - The underlying ellipse to use.
     * @param {number} startAngle - The start angle of the sector.
     * @param {numner} endAngle - The end angle of the sector.
     */
    constructor(ellipse, startAngle, endAngle) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "VEllipseSector";
        this.uid = _UIDGenerator__WEBPACK_IMPORTED_MODULE_3__.UIDGenerator.next();
        this.ellipse = ellipse;
        this.startAngle = _geomutils__WEBPACK_IMPORTED_MODULE_1__.geomutils.wrapMinMax(startAngle, 0, Math.PI * 2);
        this.endAngle = _geomutils__WEBPACK_IMPORTED_MODULE_1__.geomutils.wrapMinMax(endAngle, 0, Math.PI * 2);
    }
    /**
     * Convert this elliptic sector into cubic Bézier curves.
     *
     * @param {number=3} quarterSegmentCount - The number of segments per base elliptic quarter (default is 3, min is 1).
     * @param {number=0.666666} threshold - The Bézier threshold (default value 0.666666 approximates the ellipse with best results
     * but you might wish to use other values)
     * @return {Array<CubicBezierCurve>} An array of cubic Bézier curves representing the elliptic sector.
     */
    toCubicBezier(quarterSegmentCount, threshold) {
        // There are at least 4 segments required (dour quarters) to approximate a whole
        // ellipse with Bézier curves.
        // A visually 'good' approximation should have 12; this seems to be a good value (anything multiple of 4).
        const segmentCount = Math.max(1, quarterSegmentCount || 3) * 4;
        threshold = typeof threshold === "undefined" ? 0.666666 : threshold;
        const radiusH = this.ellipse.radiusH();
        const radiusV = this.ellipse.radiusV();
        var startAngle = VEllipseSector.ellipseSectorUtils.normalizeAngle(this.startAngle);
        var endAngle = VEllipseSector.ellipseSectorUtils.normalizeAngle(this.endAngle);
        // Find all angles inside start and end
        var angles = VEllipseSector.ellipseSectorUtils.equidistantVertAngles(radiusH, radiusV, startAngle, endAngle, segmentCount);
        angles = [startAngle].concat(angles).concat([endAngle]);
        const curves = [];
        let curAngle = angles[0];
        let startPoint = this.ellipse.vertAt(curAngle);
        for (var i = 0; i + 1 < angles.length; i++) {
            let nextAngle = angles[(i + 1) % angles.length];
            let endPoint = this.ellipse.vertAt(nextAngle);
            let startTangent = this.ellipse.tangentAt(curAngle);
            let endTangent = this.ellipse.tangentAt(nextAngle);
            // Distorted ellipses can only be approximated by linear Bézier segments
            if (Math.abs(radiusV) < 0.0001 || Math.abs(radiusH) < 0.0001) {
                let diff = startPoint.difference(endPoint);
                let curve = new _CubicBezierCurve__WEBPACK_IMPORTED_MODULE_0__.CubicBezierCurve(startPoint.clone(), endPoint.clone(), startPoint.clone().addXY(diff.x * 0.333, diff.y * 0.333), endPoint.clone().addXY(-diff.x * 0.333, -diff.y * 0.333));
                curves.push(curve);
            }
            else {
                // Find intersection
                let intersection = startTangent.intersection(endTangent);
                // What if intersection is undefined?
                // --> This *can* not happen if segmentCount > 2 and height and width of the ellipse are not zero.
                if (intersection) {
                    // It's VERY LIKELY hat this ALWAYS happens; it's just a typesave variant.
                    // Intersection cannot be null.
                    let startDiff = startPoint.difference(intersection);
                    let endDiff = endPoint.difference(intersection);
                    let curve = new _CubicBezierCurve__WEBPACK_IMPORTED_MODULE_0__.CubicBezierCurve(startPoint.clone(), endPoint.clone(), startPoint.clone().add(startDiff.scale(threshold)), endPoint.clone().add(endDiff.scale(threshold)));
                    curves.push(curve);
                }
            }
            startPoint = endPoint;
            curAngle = nextAngle;
        }
        return curves;
    }
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    destroy() {
        this.ellipse.destroy();
        this.isDestroyed = true;
    }
}
VEllipseSector.ellipseSectorUtils = {
    /**
     * Helper function to convert an elliptic section to SVG arc params (for the `d` attribute).
     * Inspiration found at:
     *    https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
     *
     * @param {boolean} options.moveToStart - If false (default=true) the initial 'Move' command will not be used.
     * @return [ 'A', radiusH, radiusV, rotation, largeArcFlag=1|0, sweepFlag=0, endx, endy ]
     */
    describeSVGArc: (x, y, radiusH, radiusV, startAngle, endAngle, rotation, options) => {
        if (typeof options === "undefined")
            options = { moveToStart: true };
        if (typeof rotation === "undefined")
            rotation = 0.0;
        // Important note: this function only works if start- and end-angle are within
        // one whole circle [x,x+2*PI].
        // Revelations of more than 2*PI might result in unexpected arcs.
        // -> Use the geomutils.wrapMax( angle, 2*PI )
        startAngle = _geomutils__WEBPACK_IMPORTED_MODULE_1__.geomutils.wrapMax(startAngle, Math.PI * 2);
        endAngle = _geomutils__WEBPACK_IMPORTED_MODULE_1__.geomutils.wrapMax(endAngle, Math.PI * 2);
        // Find the start- and end-point on the rotated ellipse
        // XYCoords to Vertex (for rotation)
        var end = new _Vertex__WEBPACK_IMPORTED_MODULE_5__.Vertex(_VEllipse__WEBPACK_IMPORTED_MODULE_4__.VEllipse.utils.polarToCartesian(x, y, radiusH, radiusV, endAngle));
        var start = new _Vertex__WEBPACK_IMPORTED_MODULE_5__.Vertex(_VEllipse__WEBPACK_IMPORTED_MODULE_4__.VEllipse.utils.polarToCartesian(x, y, radiusH, radiusV, startAngle));
        end.rotate(rotation, { x: x, y: y });
        start.rotate(rotation, { x: x, y: y });
        // Boolean stored as integers (0|1).
        var diff = endAngle - startAngle;
        var largeArcFlag;
        if (diff < 0) {
            largeArcFlag = Math.abs(diff) < Math.PI ? 1 : 0;
        }
        else {
            largeArcFlag = Math.abs(diff) > Math.PI ? 1 : 0;
        }
        const sweepFlag = 1;
        const pathData = [];
        if (options.moveToStart) {
            pathData.push("M", start.x, start.y);
        }
        // Arc rotation in degrees, not radians.
        const r2d = 180 / Math.PI;
        pathData.push("A", radiusH, radiusV, rotation * r2d, largeArcFlag, sweepFlag, end.x, end.y);
        return pathData;
    },
    /**
     * Helper function to find second-kind elliptic angles, so that the euclidean distance along the the
     * elliptic sector is the same for all.
     *
     * Note that this is based on the full ellipse calculuation and start and end will be cropped; so the
     * distance from the start angle to the first angle and/or the distance from the last angle to
     * the end angle may be different to the others.
     *
     * Furthermore the computation is only possible on un-rotated ellipses; if your source ellipse has
     * a rotation on the plane please 'rotate' the result angles afterwards to find matching angles.
     *
     * Returned angles are normalized to the interval `[ 0, PI*2 ]`.
     *
     * @param {number} radiusH - The first (horizonal) radius of the ellipse.
     * @param {number} radiusV - The second (vertical) radius of the ellipse.
     * @param {number} startAngle - The opening angle of your elliptic sector (please use normalized angles).
     * @param {number} endAngle - The closing angle of your elliptic sector (please use normalized angles).
     * @param {number} fullEllipsePointCount - The number of base segments to use from the source ellipse (12 or 16 are good numbers).
     * @return {Array<number>} An array of n angles inside startAngle and endAngle (where n <= fullEllipsePointCount).
     */
    equidistantVertAngles: (radiusH, radiusV, startAngle, endAngle, fullEllipsePointCount) => {
        var ellipseAngles = _VEllipse__WEBPACK_IMPORTED_MODULE_4__.VEllipse.utils.equidistantVertAngles(radiusH, radiusV, fullEllipsePointCount);
        ellipseAngles = ellipseAngles.map((angle) => VEllipseSector.ellipseSectorUtils.normalizeAngle(angle));
        var angleIsInRange = (angle) => {
            if (startAngle < endAngle)
                return angle >= startAngle && angle <= endAngle;
            else
                return angle >= startAngle || (angle <= endAngle && angle >= 0);
        };
        // Drop all angles outside the sector
        var ellipseAngles = ellipseAngles.filter(angleIsInRange);
        // Now we need to sort the angles to the first one in the array is the closest to startAngle.
        // --> find the angle that is closest to the start angle
        var startIndex = VEllipseSector.ellipseSectorUtils.findClosestToStartAngle(startAngle, endAngle, ellipseAngles);
        // Bring all angles into the correct order
        //    Idea: use splice or slice here?
        var angles = [];
        for (var i = 0; i < ellipseAngles.length; i++) {
            angles.push(ellipseAngles[(startIndex + i) % ellipseAngles.length]);
        }
        return angles;
    },
    findClosestToStartAngle: (startAngle, endAngle, ellipseAngles) => {
        // Note: endAngle > 0 && startAngle > 0
        if (startAngle > endAngle) {
            const n = ellipseAngles.length;
            for (var i = 0; i < n; i++) {
                const ea = _geomutils__WEBPACK_IMPORTED_MODULE_1__.geomutils.wrapMinMax(ellipseAngles[i], 0, Math.PI * 2);
                if (ea >= startAngle && ea >= endAngle) {
                    return i;
                }
            }
        }
        return 0;
    },
    normalizeAngle: (angle) => (angle < 0 ? Math.PI * 2 + angle : angle),
    /**
     * Convert the elliptic arc from endpoint parameters to center parameters as described
     * in the w3c svg arc implementation note.
     *
     * https://www.w3.org/TR/SVG/implnote.html#ArcConversionEndpointToCenter
     *
     * @param {number} x1 - The x component of the start point (end of last SVG command).
     * @param {number} y1 - The y component of the start point (end of last SVG command).
     * @param {number} rx - The first (horizontal) radius of the ellipse.
     * @param {number} ry - The second (vertical) radius of the ellipse.
     * @param {number} phi - The ellipse's rotational angle (angle of axis rotation) in radians (not in degrees as the SVG command uses!)
     * @param {boolean} fa - The large-arc-flag (boolean, not 0 or 1).
     * @param {boolean} fs - The sweep-flag (boolean, not 0 or 1).
     * @param {number} x2 - The x component of the end point (end of last SVG command).
     * @param {number} y2 - The y component of the end point (end of last SVG command).
     * @returns
     */
    endpointToCenterParameters(x1, y1, rx, ry, phi, fa, fs, x2, y2) {
        // console.log("endpointToCenterParameters", x1, y1, phi, rx, ry, fa, fs, x2, y2);
        // Thanks to
        //    https://observablehq.com/@toja/ellipse-and-elliptical-arc-conversion
        const abs = Math.abs;
        const sin = Math.sin;
        const cos = Math.cos;
        const sqrt = Math.sqrt;
        const pow = (n) => {
            return n * n;
        };
        const sinphi = sin(phi);
        const cosphi = cos(phi);
        // Step 1: simplify through translation/rotation
        const x = (cosphi * (x1 - x2)) / 2 + (sinphi * (y1 - y2)) / 2;
        const y = (-sinphi * (x1 - x2)) / 2 + (cosphi * (y1 - y2)) / 2;
        const px = pow(x), py = pow(y), prx = pow(rx), pry = pow(ry);
        // correct of out-of-range radii
        const L = px / prx + py / pry;
        if (L > 1) {
            rx = sqrt(L) * abs(rx);
            ry = sqrt(L) * abs(ry);
        }
        else {
            rx = abs(rx);
            ry = abs(ry);
        }
        // Step 2 + 3: compute center
        const sign = fa === fs ? -1 : 1;
        // const M: number = sqrt((prx * pry - prx * py - pry * px) / (prx * py + pry * px)) * sign;
        const M = sqrt(Math.abs((prx * pry - prx * py - pry * px) / (prx * py + pry * px))) * sign;
        const _cx = (M * (rx * y)) / ry;
        const _cy = (M * (-ry * x)) / rx;
        const cx = cosphi * _cx - sinphi * _cy + (x1 + x2) / 2;
        const cy = sinphi * _cx + cosphi * _cy + (y1 + y2) / 2;
        // Step 4: Compute start and end angle
        const center = new _Vertex__WEBPACK_IMPORTED_MODULE_5__.Vertex(cx, cy);
        const axis = center.clone().addXY(rx, ry);
        const ellipse = new _VEllipse__WEBPACK_IMPORTED_MODULE_4__.VEllipse(center, axis, 0);
        // console.log("VELLIPSE::::::", ellipse);
        ellipse.rotate(phi);
        const startAngle = new _Line__WEBPACK_IMPORTED_MODULE_2__.Line(ellipse.center, new _Vertex__WEBPACK_IMPORTED_MODULE_5__.Vertex(x1, y1)).angle();
        const endAngle = new _Line__WEBPACK_IMPORTED_MODULE_2__.Line(ellipse.center, new _Vertex__WEBPACK_IMPORTED_MODULE_5__.Vertex(x2, y2)).angle();
        return new VEllipseSector(ellipse, startAngle - phi, endAngle - phi);
    }
}; // END ellipseSectorUtils
//# sourceMappingURL=VEllipseSector.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/Vector.js":
/*!********************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/Vector.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Vector: () => (/* binding */ Vector)
/* harmony export */ });
/* harmony import */ var _VertTuple__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VertTuple */ "./node_modules/plotboilerplate/src/esm/VertTuple.js");
/* harmony import */ var _Vertex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Vertex */ "./node_modules/plotboilerplate/src/esm/Vertex.js");
/**
 * @author   Ikaros Kappler
 * @date     2019-01-30
 * @modified 2019-02-23 Added the toSVGString function, overriding Line.toSVGString.
 * @modified 2019-03-20 Added JSDoc tags.
 * @modified 2019-04-19 Added the clone function (overriding Line.clone()).
 * @modified 2019-09-02 Added the Vector.perp() function.
 * @modified 2019-09-02 Added the Vector.inverse() function.
 * @modified 2019-12-04 Added the Vector.inv() function.
 * @modified 2020-03-23 Ported to Typescript from JS.
 * @modified 2021-01-20 Added UID.
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2022-02-02 Cleared the `Vector.toSVGString` function (deprecated). Use `drawutilssvg` instead.
 * @modified 2022-10-25 Added the `getOrthogonal` method.
 * @version  1.5.0
 *
 * @file Vector
 * @public
 **/


/**
 * @classdesc A vector (Vertex,Vertex) is a line with a visible direction.<br>
 *            <br>
 *            Vectors are drawn with an arrow at their end point.<br>
 *            <b>The Vector class extends the Line class.</b>
 *
 * @requires VertTuple
 * @requires Vertex
 **/
class Vector extends _VertTuple__WEBPACK_IMPORTED_MODULE_0__.VertTuple {
    /**
     * The constructor.
     *
     * @constructor
     * @name Vector
     * @extends Line
     * @param {Vertex} vertA - The start vertex of the vector.
     * @param {Vertex} vertB - The end vertex of the vector.
     **/
    constructor(vertA, vertB) {
        super(vertA, vertB, (a, b) => new Vector(a, b));
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "Vector";
    }
    /**
     * Get the perpendicular of this vector which is located at a.
     *
     * @param {Number} t The position on the vector.
     * @return {Vector} A new vector being the perpendicular of this vector sitting on a.
     **/
    perp() {
        var v = this.clone();
        v.sub(this.a);
        v = new Vector(new _Vertex__WEBPACK_IMPORTED_MODULE_1__.Vertex(), new _Vertex__WEBPACK_IMPORTED_MODULE_1__.Vertex(-v.b.y, v.b.x));
        v.a.add(this.a);
        v.b.add(this.a);
        return v;
    }
    /**
     * The inverse of a vector is a vector with the same magnitude but oppose direction.
     *
     * Please not that the origin of this vector changes here: a->b becomes b->a.
     *
     * @return {Vector}
     **/
    inverse() {
        var tmp = this.a;
        this.a = this.b;
        this.b = tmp;
        return this;
    }
    /**
     * This function computes the inverse of the vector, which means 'a' stays untouched.
     *
     * @return {Vector} this for chaining.
     **/
    inv() {
        this.b.x = this.a.x - (this.b.x - this.a.x);
        this.b.y = this.a.y - (this.b.y - this.a.y);
        return this;
    }
    /**
     * Get the intersection if this vector and the specified vector.
     *
     * @method intersection
     * @param {Vector} line The second vector.
     * @return {Vertex} The intersection (may lie outside the end-points).
     * @instance
     * @memberof Line
     **/
    intersection(line) {
        var denominator = this.denominator(line);
        if (denominator == 0)
            return null;
        var a = this.a.y - line.a.y;
        var b = this.a.x - line.a.x;
        var numerator1 = (line.b.x - line.a.x) * a - (line.b.y - line.a.y) * b;
        var numerator2 = (this.b.x - this.a.x) * a - (this.b.y - this.a.y) * b;
        a = numerator1 / denominator; // NaN if parallel lines
        b = numerator2 / denominator;
        // TODO:
        // FOR A VECTOR THE LINE-INTERSECTION MUST BE ON BOTH VECTORS
        // if we cast these lines infinitely in both directions, they intersect here:
        return new _Vertex__WEBPACK_IMPORTED_MODULE_1__.Vertex(this.a.x + a * (this.b.x - this.a.x), this.a.y + a * (this.b.y - this.a.y));
    }
    /**
     * Get the orthogonal "vector" of this vector (rotated by 90° clockwise).
     *
     * @name getOrthogonal
     * @method getOrthogonal
     * @return {Vector} A new vector with the same length that stands on this vector's point a.
     * @instance
     * @memberof Vector
     **/
    getOrthogonal() {
        // Orthogonal of vector (0,0)->(x,y) is (0,0)->(-y,x)
        const linePoint = this.a.clone();
        const startPoint = this.b.clone().sub(this.a);
        const tmp = startPoint.x;
        startPoint.x = -startPoint.y;
        startPoint.y = tmp;
        return new Vector(linePoint, startPoint.add(this.a));
    }
}
Vector.utils = {
    /**
     * Generate a four-point arrow head, starting at the vector end minus the
     * arrow head length.
     *
     * The first vertex in the returned array is guaranteed to be the located
     * at the vector line end minus the arrow head length.
     *
     *
     * Due to performance all params are required.
     *
     * The params scaleX and scaleY are required for the case that the scaling is not uniform (x and y
     * scaling different). Arrow heads should not look distored on non-uniform scaling.
     *
     * If unsure use 1.0 for scaleX and scaleY (=no distortion).
     * For headlen use 8, it's a good arrow head size.
     *
     * Example:
     *    buildArrowHead( new Vertex(0,0), new Vertex(50,100), 8, 1.0, 1.0 )
     *
     * @param {Vertex} zA - The start vertex of the vector to calculate the arrow head for.
     * @param {Vertex} zB - The end vertex of the vector.
     * @param {number} headlen - The length of the arrow head (along the vector direction. A good value is 12).
     * @param {number} scaleX  - The horizontal scaling during draw.
     * @param {number} scaleY  - the vertical scaling during draw.
     **/
    buildArrowHead: (zA, zB, headlen, scaleX, scaleY) => {
        const angle = Math.atan2((zB.y - zA.y) * scaleY, (zB.x - zA.x) * scaleX);
        const vertices = [];
        vertices.push(new _Vertex__WEBPACK_IMPORTED_MODULE_1__.Vertex(zB.x * scaleX - headlen * Math.cos(angle), zB.y * scaleY - headlen * Math.sin(angle)));
        vertices.push(new _Vertex__WEBPACK_IMPORTED_MODULE_1__.Vertex(zB.x * scaleX - headlen * 1.35 * Math.cos(angle - Math.PI / 8), zB.y * scaleY - headlen * 1.35 * Math.sin(angle - Math.PI / 8)));
        vertices.push(new _Vertex__WEBPACK_IMPORTED_MODULE_1__.Vertex(zB.x * scaleX, zB.y * scaleY));
        vertices.push(new _Vertex__WEBPACK_IMPORTED_MODULE_1__.Vertex(zB.x * scaleX - headlen * 1.35 * Math.cos(angle + Math.PI / 8), zB.y * scaleY - headlen * 1.35 * Math.sin(angle + Math.PI / 8)));
        return vertices;
    }
};
//# sourceMappingURL=Vector.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/VertTuple.js":
/*!***********************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/VertTuple.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VertTuple: () => (/* binding */ VertTuple)
/* harmony export */ });
/* harmony import */ var _Vertex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Vertex */ "./node_modules/plotboilerplate/src/esm/Vertex.js");
/* harmony import */ var _UIDGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UIDGenerator */ "./node_modules/plotboilerplate/src/esm/UIDGenerator.js");
/**
 * @author Ikaros Kappler
 * @date   2020-03-24
 * @modified 2020-05-04 Fixed a serious bug in the pointDistance function.
 * @modified 2020-05-12 The angle(line) param was still not optional. Changed that.
 * @modified 2020-11-11 Generalized the `add` and `sub` param from `Vertex` to `XYCoords`.
 * @modified 2020-12-04 Changed`vtutils.dist2` params from `Vertex` to `XYCoords` (generalized).
 * @modified 2020-12-04 Changed `getClosestT` param from `Vertex` to `XYCoords` (generalized).
 * @modified 2020-12-04 Added the `hasPoint(XYCoords)` function.
 * @modified 2021-01-20 Added UID.
 * @modified 2022-02-02 Added the `destroy` method.
 * @version 1.2.0
 */


/**
 * @classdesc An abstract base classes for vertex tuple constructs, like Lines or Vectors.
 * @abstract
 * @requires UID
 * @requires Vertex
 * @requires XYCoords
 */
class VertTuple {
    /**
     * Creates an instance.
     *
     * @constructor
     * @name VertTuple
     * @param {Vertex} a The tuple's first point.
     * @param {Vertex} b The tuple's second point.
     **/
    constructor(a, b, factory) {
        this.uid = _UIDGenerator__WEBPACK_IMPORTED_MODULE_1__.UIDGenerator.next();
        this.a = a;
        this.b = b;
        this.factory = factory;
    }
    /**
     * Get the length of this line.
     *
     * @method length
     * @instance
     * @memberof VertTuple
     **/
    length() {
        return Math.sqrt(Math.pow(this.b.x - this.a.x, 2) + Math.pow(this.b.y - this.a.y, 2));
    }
    /**
     * Set the length of this vector to the given amount. This only works if this
     * vector is not a null vector.
     *
     * @method setLength
     * @param {number} length - The desired length.
     * @memberof VertTuple
     * @return {T} this (for chaining)
     **/
    setLength(length) {
        return this.scale(length / this.length());
    }
    /**
     * Substract the given vertex from this line's end points.
     *
     * @method sub
     * @param {XYCoords} amount The amount (x,y) to substract.
     * @return {VertTuple} this
     * @instance
     * @memberof VertTuple
     **/
    sub(amount) {
        this.a.sub(amount);
        this.b.sub(amount);
        return this;
    }
    /**
     * Add the given vertex to this line's end points.
     *
     * @method add
     * @param {XYCoords} amount The amount (x,y) to add.
     * @return {Line} this
     * @instance
     * @memberof VertTuple
     **/
    add(amount) {
        this.a.add(amount);
        this.b.add(amount);
        return this;
    }
    /**
     * Normalize this line (set to length 1).
     *
     * @method normalize
     * @return {VertTuple} this
     * @instance
     * @memberof VertTuple
     **/
    normalize() {
        this.b.set(this.a.x + (this.b.x - this.a.x) / this.length(), this.a.y + (this.b.y - this.a.y) / this.length());
        return this;
    }
    /**
     * Scale this line by the given factor.
     *
     * @method scale
     * @param {number} factor The factor for scaling (1.0 means no scale).
     * @return {VertTuple} this
     * @instance
     * @memberof VertTuple
     **/
    scale(factor) {
        this.b.set(this.a.x + (this.b.x - this.a.x) * factor, this.a.y + (this.b.y - this.a.y) * factor);
        return this;
    }
    /**
     * Move this line to a new location.
     *
     * @method moveTo
     * @param {Vertex} newA - The new desired location of 'a'. Vertex 'b' will be moved, too.
     * @return {VertTuple} this
     * @instance
     * @memberof VertTuple
     **/
    moveTo(newA) {
        let diff = this.a.difference(newA);
        this.a.add(diff);
        this.b.add(diff);
        return this;
    }
    /**
     * Get the angle between this and the passed line (in radians).
     *
     * @method angle
     * @param {VertTuple} line - (optional) The line to calculate the angle to. If null the baseline (x-axis) will be used.
     * @return {number} this
     * @instance
     * @memberof VertTuple
     **/
    angle(line) {
        if (line == null || typeof line == "undefined") {
            line = this.factory(new _Vertex__WEBPACK_IMPORTED_MODULE_0__.Vertex(0, 0), new _Vertex__WEBPACK_IMPORTED_MODULE_0__.Vertex(100, 0));
        }
        // Compute the angle from x axis and the return the difference :)
        const v0 = this.b.clone().sub(this.a);
        const v1 = line.b.clone().sub(line.a);
        // Thank you, Javascript, for this second atan function. No additional math is needed here!
        // The result might be negative, but isn't it usually nicer to determine angles in positive values only?
        return Math.atan2(v1.x, v1.y) - Math.atan2(v0.x, v0.y);
    }
    /**
     * Get line point at position t in [0 ... 1]:<br>
     * <pre>[P(0)]=[A]--------------------[P(t)]------[B]=[P(1)]</pre><br>
     * <br>
     * The counterpart of this function is Line.getClosestT(Vertex).
     *
     * @method vertAt
     * @param {number} t The position scalar.
     * @return {Vertex} The vertex a position t.
     * @instance
     * @memberof VertTuple
     **/
    vertAt(t) {
        return new _Vertex__WEBPACK_IMPORTED_MODULE_0__.Vertex(this.a.x + (this.b.x - this.a.x) * t, this.a.y + (this.b.y - this.a.y) * t);
    }
    /**
     * Get the denominator of this and the given line.
     *
     * If the denominator is zero (or close to zero) both line are co-linear.
     *
     * @method denominator
     * @param {VertTuple} line
     * @instance
     * @memberof VertTuple
     * @return {Number}
     **/
    denominator(line) {
        // http://jsfiddle.net/justin_c_rounds/Gd2S2/
        return (line.b.y - line.a.y) * (this.b.x - this.a.x) - (line.b.x - line.a.x) * (this.b.y - this.a.y);
    }
    /**
     * Checks if this and the given line are co-linear.
     *
     * The constant Vertex.EPSILON is used for tolerance.
     *
     * @method colinear
     * @param {VertTuple} line
     * @instance
     * @memberof VertTuple
     * @return true if both lines are co-linear.
     */
    colinear(line) {
        return Math.abs(this.denominator(line)) < _Vertex__WEBPACK_IMPORTED_MODULE_0__.Vertex.EPSILON;
    }
    /**
     * Get the closest position T from this line to the specified point.
     *
     * The counterpart for this function is Line.vertAt(Number).
     *
     * @name getClosetT
     * @method getClosestT
     * @param {XYCoords} p The point (vertex) to measure the distance to.
     * @return {number} The line position t of minimal distance to p.
     * @instance
     * @memberof VertTuple
     **/
    getClosestT(p) {
        var l2 = VertTuple.vtutils.dist2(this.a, this.b);
        if (l2 === 0)
            return 0;
        var t = ((p.x - this.a.x) * (this.b.x - this.a.x) + (p.y - this.a.y) * (this.b.y - this.a.y)) / l2;
        // Do not wrap to [0,1] here.
        // Other results are of interest, too.
        // t = Math.max(0, Math.min(1, t));
        return t;
    }
    /**
     * Check if the given point is located on this line. Optionally also check if
     * that point is located between point `a` and `b`.
     *
     * @method hasPoint
     * @param {Vertex} point The point to check.
     * @param {boolean=} insideBoundsOnly If set to to true (default=false) the point must be between start and end point of the line.
     * @return {boolean} True if the given point is on this line.
     * @instance
     * @memberof VertTuple
     */
    hasPoint(point, insideBoundsOnly) {
        const t = this.getClosestT(point);
        // Compare to pointDistance?
        if (typeof insideBoundsOnly !== "undefined" && insideBoundsOnly) {
            const distance = Math.sqrt(VertTuple.vtutils.dist2(point, this.vertAt(t)));
            return distance < _Vertex__WEBPACK_IMPORTED_MODULE_0__.Vertex.EPSILON && t >= 0 && t <= 1;
        }
        else {
            return t >= 0 && t <= 1;
        }
    }
    /**
     * Get the closest point on this line to the specified point.
     *
     * @method getClosestPoint
     * @param {Vertex} p The point (vertex) to measre the distance to.
     * @return {Vertex} The point on the line that is closest to p.
     * @instance
     * @memberof VertTuple
     **/
    getClosestPoint(p) {
        var t = this.getClosestT(p);
        return this.vertAt(t);
    }
    /**
     * The the minimal distance between this line and the specified point.
     *
     * @method pointDistance
     * @param {Vertex} p The point (vertex) to measre the distance to.
     * @return {number} The absolute minimal distance.
     * @instance
     * @memberof VertTuple
     **/
    pointDistance(p) {
        // Taken From:
        // https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
        return Math.sqrt(VertTuple.vtutils.dist2(p, this.vertAt(this.getClosestT(p))));
    }
    /**
     * Create a deep clone of this instance.
     *
     * @method cloneLine
     * @return {T} A type safe clone if this instance.
     * @instance
     * @memberof VertTuple
     **/
    clone() {
        return this.factory(this.a.clone(), this.b.clone());
    }
    /**
     * Create a string representation of this line.
     *
     * @method totring
     * @return {string} The string representing this line.
     * @instance
     * @memberof VertTuple
     **/
    toString() {
        return "{ a : " + this.a.toString() + ", b : " + this.b.toString() + " }";
    }
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    destroy() {
        this.a.destroy();
        this.b.destroy();
        this.isDestroyed = true;
    }
}
/**
 * @private
 **/
VertTuple.vtutils = {
    dist2: (v, w) => {
        return (v.x - w.x) * (v.x - w.x) + (v.y - w.y) * (v.y - w.y);
    }
};
//# sourceMappingURL=VertTuple.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/Vertex.js":
/*!********************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/Vertex.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Vertex: () => (/* binding */ Vertex)
/* harmony export */ });
/* harmony import */ var _VertexAttr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VertexAttr */ "./node_modules/plotboilerplate/src/esm/VertexAttr.js");
/* harmony import */ var _UIDGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UIDGenerator */ "./node_modules/plotboilerplate/src/esm/UIDGenerator.js");
/* harmony import */ var _VertexListeners__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./VertexListeners */ "./node_modules/plotboilerplate/src/esm/VertexListeners.js");
/**
 * @author   Ikaros Kappler
 * @date     2012-10-17
 * @modified 2018-04-03 Refactored the code of october 2012 into a new class.
 * @modified 2018-04-28 Added some documentation.
 * @modified 2018-08-16 Added the set() function.
 * @modified 2018-08-26 Added VertexAttr.
 * @modified 2018-10-31 Extended the constructor by object{x,y}.
 * @modified 2018-11-19 Extended the set(number,number) function to set(Vertex).
 * @modified 2018-11-28 Added 'this' to the VertexAttr constructor.
 * @modified 2018-12-05 Added the sub(...) function. Changed the signature of the add() function! add(Vertex) and add(number,number) are now possible.
 * @modified 2018-12-21 (It's winter solstice) Added the inv()-function.
 * @modified 2019-01-30 Added the setX(Number) and setY(Number) functions.
 * @modified 2019-02-19 Added the difference(Vertex) function.
 * @modified 2019-03-20 Added JSDoc tags.
 * @modified 2019-04-24 Added the randomVertex(ViewPort) function.
 * @modified 2019-11-07 Added toSVGString(object) function.
 * @modified 2019-11-18 Added the rotate(number,Vertex) function.
 * @modified 2019-11-21 Fixed a bug in the rotate(...) function (elements were moved).
 * @modified 2020-03-06 Added functions invX() and invY().
 * @modified 2020-03-23 Ported to Typescript from JS.
 * @modified 2020-05-26 Added functions addX(number) and addY(number).
 * @modified 2020-10-30 Changed the warnings in `sub(...)` and `add(...)` into real errors.
 * @modified 2021-03-01 Changed the second param `center` in the `rotate` function from Vertex to XYCoords.
 * @modified 2021-12-01 Changed the type of param of `scale` to XYCoords.
 * @modified 2021-12-01 Added function `scaleXY` for non uniform scaling.
 * @modified 2021-12-17 Added the functions `lerp` and `lerpAbs` for linear interpolations.
 * @modified 2022-01-31 Added `Vertex.utils.arrayToJSON`.
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2022-02-02 Cleared the `Vertex.toSVGString` function (deprecated). Use `drawutilssvg` instead.
 * @modified 2022-11-28 Added the `subXY`, `subX` and `subY` methods to the `Vertex` class.
 * @version  2.8.0
 *
 * @file Vertex
 * @public
 **/



/**
 * @classdesc A vertex is a pair of two numbers.<br>
 * <br>
 * It is used to identify a 2-dimensional point on the x-y-plane.
 *
 * @requires IVertexAttr
 * @requires SVGSerializable
 * @requires UID
 * @requires UIDGenerator
 * @requires VertexAttr
 * @requires VertexListeners
 * @requires XYCoords
 *
 */
class Vertex {
    /**
     * The constructor for the vertex class.
     *
     * @constructor
     * @name Vertex
     * @param {number} x - The x-coordinate of the new vertex.
     * @param {number} y - The y-coordinate of the new vertex.
     **/
    constructor(x, y) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "Vertex";
        this.uid = _UIDGenerator__WEBPACK_IMPORTED_MODULE_1__.UIDGenerator.next();
        if (typeof x == "undefined") {
            this.x = 0;
            this.y = 0;
        }
        else if (typeof x == "number" && typeof y == "number") {
            this.x = x;
            this.y = y;
        }
        else {
            const tuple = x;
            if (typeof tuple.x == "number" && typeof tuple.y == "number") {
                this.x = tuple.x;
                this.y = tuple.y;
            }
            else {
                if (typeof x == "number")
                    this.x = x;
                else if (typeof x == "undefined")
                    this.x = 0;
                else
                    this.x = NaN;
                if (typeof y == "number")
                    this.y = y;
                else if (typeof y == "undefined")
                    this.y = 0;
                else
                    this.y = NaN;
            }
        }
        this.attr = new _VertexAttr__WEBPACK_IMPORTED_MODULE_0__.VertexAttr();
        this.listeners = new _VertexListeners__WEBPACK_IMPORTED_MODULE_2__.VertexListeners(this);
    }
    /**
     * Set the x- and y- component of this vertex.
     *
     * @method set
     * @param {number} x - The new x-component.
     * @param {number} y - The new y-component.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    set(x, y) {
        if (typeof x == "number" && typeof y == "number") {
            this.x = x;
            this.y = y;
        }
        else {
            const tuple = x;
            if (typeof tuple.x == "number" && typeof tuple.y == "number") {
                this.x = tuple.x;
                this.y = tuple.y;
            }
            else {
                if (typeof x == "number")
                    this.x = x;
                else if (typeof x == "undefined")
                    this.x = 0;
                else
                    this.x = NaN;
                if (typeof y == "number")
                    this.y = y;
                else if (typeof y == "undefined")
                    this.y = 0;
                else
                    this.y = NaN;
            }
        }
        return this;
    }
    /**
     * Set the x-component of this vertex.
     *
     * @method setX
     * @param {number} x - The new x-component.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    setX(x) {
        this.x = x;
        return this;
    }
    /**
     * Set the y-component of this vertex.
     *
     * @method setY
     * @param {number} y - The new y-component.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    setY(y) {
        this.y = y;
        return this;
    }
    /**
     * Set the x-component if this vertex to the inverse of its value.
     *
     * @method invX
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    invX() {
        this.x = -this.x;
        return this;
    }
    /**
     * Set the y-component if this vertex to the inverse of its value.
     *
     * @method invY
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    invY() {
        this.y = -this.y;
        return this;
    }
    /**
     * Add the passed amount to x- and y- component of this vertex.<br>
     * <br>
     * This function works with add( {number}, {number} ) and
     * add( {Vertex} ), as well.
     *
     * @method add
     * @param {(number|Vertex)} x - The amount to add to x (or a vertex itself).
     * @param {number=} y - The amount to add to y.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    add(x, y) {
        if (typeof x == "number" && typeof y == "number") {
            this.x += x;
            this.y += y;
        }
        else {
            const tuple = x;
            if (typeof tuple.x == "number" && typeof tuple.y == "number") {
                this.x += tuple.x;
                this.y += tuple.y;
            }
            else {
                if (typeof x == "number")
                    this.x += x;
                else
                    throw `Cannot add ${typeof x} to numeric x component!`;
                if (typeof y == "number")
                    this.y += y;
                else
                    throw `Cannot add ${typeof y} to numeric y component!`;
            }
        }
        return this;
    }
    /**
     * Add the passed amounts to the x- and y- components of this vertex.
     *
     * @method addXY
     * @param {number} x - The amount to add to x.
     * @param {number} y - The amount to add to y.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    addXY(amountX, amountY) {
        this.x += amountX;
        this.y += amountY;
        return this;
    }
    /**
     * Add the passed amounts to the x-component of this vertex.
     *
     * @method addX
     * @param {number} x - The amount to add to x.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    addX(amountX) {
        this.x += amountX;
        return this;
    }
    /**
     * Add the passed amounts to the y-component of this vertex.
     *
     * @method addY
     * @param {number} y - The amount to add to y.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    addY(amountY) {
        this.y += amountY;
        return this;
    }
    /**
     * Substract the passed amount from x- and y- component of this vertex.<br>
     * <br>
     * This function works with sub( {number}, {number} ) and
     * sub( {Vertex} ), as well.
     *
     * @method sub
     * @param {(number|Vertex)} x - The amount to substract from x (or a vertex itself).
     * @param {number=} y - The amount to substract from y.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    sub(x, y) {
        if (typeof x == "number" && typeof y == "number") {
            this.x -= x;
            this.y -= y;
        }
        else {
            const tuple = x;
            if (typeof tuple.x == "number" && typeof tuple.y == "number") {
                this.x -= tuple.x;
                this.y -= tuple.y;
            }
            else {
                if (typeof x == "number")
                    this.x -= x;
                else
                    throw `Cannot add ${typeof x} to numeric x component!`;
                if (typeof y == "number")
                    this.y -= y;
                else
                    throw `Cannot add ${typeof y} to numeric y component!`;
            }
        }
        return this;
    }
    /**
     * Substract the passed amounts from the x- and y- components of this vertex.
     *
     * @method subXY
     * @param {number} x - The amount to substract from x.
     * @param {number} y - The amount to substract from y.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    subXY(amountX, amountY) {
        this.x -= amountX;
        this.y -= amountY;
        return this;
    }
    /**
     * Substract the passed amounts from the x-component of this vertex.
     *
     * @method addX
     * @param {number} x - The amount to substract from x.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    subX(amountX) {
        this.x -= amountX;
        return this;
    }
    /**
     * Substract the passed amounts from the y-component of this vertex.
     *
     * @method subY
     * @param {number} y - The amount to substract from y.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    subY(amountY) {
        this.y -= amountY;
        return this;
    }
    /**
     * Check if this vertex equals the passed one.
     * <br>
     * This function uses an internal epsilon as tolerance.
     *
     * @method equals
     * @param {Vertex} vertex - The vertex to compare this with.
     * @return {boolean}
     * @instance
     * @memberof Vertex
     **/
    equals(vertex) {
        var eqX = Math.abs(this.x - vertex.x) < Vertex.EPSILON;
        var eqY = Math.abs(this.y - vertex.y) < Vertex.EPSILON;
        var result = eqX && eqY;
        return result;
    }
    /**
     * Create a copy of this vertex.
     *
     * @method clone
     * @return {Vertex} A new vertex, an exact copy of this.
     * @instance
     * @memberof Vertex
     **/
    clone() {
        return new Vertex(this.x, this.y);
    }
    /**
     * Get the distance to the passed point (in euclidean metric)
     *
     * @method distance
     * @param {XYCoords} vert - The vertex to measure the distance to.
     * @return {number}
     * @instance
     * @memberof Vertex
     **/
    distance(vert) {
        return Math.sqrt(Math.pow(vert.x - this.x, 2) + Math.pow(vert.y - this.y, 2));
    }
    /**
     * Get the angle of this point (relative to (0,0) or to the given other origin point).
     *
     * @method angle
     * @param {XYCoords} origin - The vertex to measure the angle from.
     * @return {number}
     * @instance
     * @memberof Vertex
     **/
    angle(origin) {
        const a = typeof origin === "undefined"
            ? Math.PI / 2 - Math.atan2(this.x, this.y)
            : Math.PI / 2 - Math.atan2(origin.x - this.x, origin.y - this.y);
        // Map to positive value
        return a < 0 ? Math.PI * 2 + a : a;
    }
    /**
     * Get the difference to the passed point.<br>
     * <br>
     * The difference is (vert.x-this.x, vert.y-this.y).
     *
     * @method difference
     * @param {Vertex} vert - The vertex to measure the x-y-difference to.
     * @return {Vertex} A new vertex.
     * @instance
     * @memberof Vertex
     **/
    difference(vert) {
        return new Vertex(vert.x - this.x, vert.y - this.y);
    }
    /**
     * This is a vector-like behavior and 'scales' this vertex
     * towards/from a given center by one uniform scale factor.
     *
     * @method scale
     * @param {number} factor - The factor to 'scale' this vertex; 1.0 means no change.
     * @param {XYCoords=} center - The origin of scaling; default is (0,0).
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    scale(factor, center) {
        return this.scaleXY({ x: factor, y: factor }, center);
    }
    /**
     * Perform a linear interpolation towards the given target vertex.
     * The amount value `t` is relative, `t=0.0` means no change, `t=1.0`
     * means this point will be moved to the exact target position.
     *
     * `t=0.5` will move this point to the middle of the connecting
     * linear segment.
     *
     * @param {XYCoords} target - The target position to lerp this vertex to.
     * @param {number} t - The relative amount, usually in [0..1], but other values will work, too.
     * @returns
     */
    lerp(target, t) {
        var diff = this.difference(target);
        // return new Vertex(this.x + diff.x * t, this.y + diff.y * t);
        this.x += diff.x * t;
        this.y += diff.y * t;
        return this;
    }
    /**
     * Perform a linear interpolation towards the given target vertex (absolute variant).
     * The amount value `t` is absolute, which means the lerp amount is a direct distance
     * value. This point will have move the amount of the passed distance `u`.
     *
     * @param {XYCoords} target - The target position to lerp this vertex to.
     * @param {number} t - The absolute move amount to use to lerping.
     * @returns
     */
    lerpAbs(target, u) {
        var dist = this.distance(target);
        var diff = this.difference(target);
        var step = { x: diff.x / dist, y: diff.y / dist };
        // return new Vertex(this.x + step.x * u, this.y + step.y * u);
        this.x += step.x * u;
        this.y += step.y * u;
        return this;
    }
    /**
     * This is a vector-like behavior and 'scales' this vertex
     * towards/from a given center by two independent x- and y- scale factors.
     *
     * @method scale
     * @param {number} factor - The factor to 'scale' this vertex; 1.0 means no change.
     * @param {XYCoords=} center - The origin of scaling; default is (0,0).
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    scaleXY(factors, center) {
        if (!center || typeof center === "undefined") {
            center = { x: 0, y: 0 };
        }
        this.x = center.x + (this.x - center.x) * factors.x;
        this.y = center.y + (this.y - center.y) * factors.y;
        return this;
    }
    /**
     * This is a vector-like behavior and 'rotates' this vertex
     * around given center.
     *
     * @method rotate
     * @param {number} angle - The angle to 'rotate' this vertex; 0.0 means no change.
     * @param {XYCoords=} center - The center of rotation; default is (0,0).
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    rotate(angle, center) {
        if (!center || typeof center === "undefined") {
            center = { x: 0, y: 0 };
        }
        this.sub(center);
        angle += Math.atan2(this.y, this.x);
        let len = this.distance(Vertex.ZERO); // {x:0,y:0});
        this.x = len * Math.cos(angle);
        this.y = len * Math.sin(angle);
        this.add(center);
        return this;
    }
    /**
     * Multiply both components of this vertex with the given scalar.<br>
     * <br>
     * Note: as in<br>
     *    https://threejs.org/docs/#api/math/Vector2.multiplyScalar
     *
     * @method multiplyScalar
     * @param {number} scalar - The scale factor; 1.0 means no change.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    /**
     * Round the two components x and y of this vertex.
     *
     * @method round
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    }
    /**
     * Change this vertex (x,y) to its inverse (-x,-y).
     *
     * @method inv
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    inv() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }
    /**
     * Get a string representation of this vertex.
     *
     * @method toString
     * @return {string} The string representation of this vertex.
     * @instance
     * @memberof Vertex
     **/
    toString() {
        return "(" + this.x + "," + this.y + ")";
    }
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    destroy() {
        this.listeners.removeAllListeners();
        this.isDestroyed = true;
    }
    /**
     * Create a new random vertex inside the given viewport.
     *
     * @param {ViewPort} viewPort - A {min:Vertex, max:Vertex} viewport specifying the bounds.
     * @return A new vertex with a random position.
     **/
    static randomVertex(viewPort) {
        return new Vertex(viewPort.min.x + Math.random() * (viewPort.max.x - viewPort.min.x), viewPort.min.y + Math.random() * (viewPort.max.y - viewPort.min.y));
    }
}
Vertex.ZERO = new Vertex(0, 0);
/**
 * An epsilon for comparison
 *
 * @private
 * @readonly
 **/
Vertex.EPSILON = 1.0e-6;
Vertex.utils = {
    /**
     * Generate a four-point arrow head, starting at the vector end minus the
     * arrow head length.
     *
     * The first vertex in the returned array is guaranteed to be the located
     * at the vector line end minus the arrow head length.
     *
     *
     * Due to performance all params are required.
     *
     * The params scaleX and scaleY are required for the case that the scaling is not uniform (x and y
     * scaling different). Arrow heads should not look distored on non-uniform scaling.
     *
     * If unsure use 1.0 for scaleX and scaleY (=no distortion).
     * For headlen use 8, it's a good arrow head size.
     *
     * Example:
     *    buildArrowHead( new Vertex(0,0), new Vertex(50,100), 8, 1.0, 1.0 )
     *
     * @param {Vertex} zA - The start vertex of the vector to calculate the arrow head for.
     * @param {Vertex} zB - The end vertex of the vector.
     * @param {number} headlen - The length of the arrow head (along the vector direction. A good value is 12).
     * @param {number} scaleX  - The horizontal scaling during draw.
     * @param {number} scaleY  - the vertical scaling during draw.
     **/
    // @DEPRECATED: use Vector.utils.buildArrowHead instead!!!
    buildArrowHead: (zA, zB, headlen, scaleX, scaleY) => {
        // console.warn('This function is deprecated! Use Vector.utils.buildArrowHead instead!');
        var angle = Math.atan2((zB.y - zA.y) * scaleY, (zB.x - zA.x) * scaleX);
        var vertices = [];
        vertices.push(new Vertex(zB.x * scaleX - headlen * Math.cos(angle), zB.y * scaleY - headlen * Math.sin(angle)));
        vertices.push(new Vertex(zB.x * scaleX - headlen * 1.35 * Math.cos(angle - Math.PI / 8), zB.y * scaleY - headlen * 1.35 * Math.sin(angle - Math.PI / 8)));
        vertices.push(new Vertex(zB.x * scaleX, zB.y * scaleY));
        vertices.push(new Vertex(zB.x * scaleX - headlen * 1.35 * Math.cos(angle + Math.PI / 8), zB.y * scaleY - headlen * 1.35 * Math.sin(angle + Math.PI / 8)));
        return vertices;
    },
    /**
     * Convert the given vertices (array) to a JSON string.
     *
     * @param {number?} precision - (optional) The numeric precision to be used (number of precision digits).
     * @returns {string}
     */
    arrayToJSON(vertices, precision) {
        return JSON.stringify(vertices.map(function (vert) {
            return typeof precision === undefined
                ? { x: vert.x, y: vert.y }
                : { x: Number(vert.x.toFixed(precision)), y: Number(vert.y.toFixed(precision)) };
        }));
    }
};
//# sourceMappingURL=Vertex.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/VertexAttr.js":
/*!************************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/VertexAttr.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VertexAttr: () => (/* binding */ VertexAttr)
/* harmony export */ });
/**
 * @author   Ikaros Kappler
 * @date     2018-08-26
 * @modified 2018-11-17 Added the 'isSelected' attribute.
 * @modified 2018-11-27 Added the global model for instantiating with custom attributes.
 * @modified 2019-03-20 Added JSDoc tags.
 * @modified 2020-02-29 Added the 'selectable' attribute.
 * @modified 2020-03-23 Ported to Typescript from JS.
 * @version  1.1.1
 *
 * @file VertexAttr
 * @public
 **/
/**
 * @classdesc The VertexAttr is a helper class to wrap together additional attributes
 * to vertices that do not belong to the 'standard canonical' vertex implementation.<br>
 * <br>
 * This is some sort of 'userData' object, but the constructor uses a global model
 * to obtain a (configurable) default attribute set to all instances.<br>
 */
class VertexAttr {
    /**
     * The constructor.
     *
     * Attributes will be initialized as defined in the model object
     * which serves as a singleton.
     *
     * @constructor
     * @name VertexAttr
     **/
    constructor() {
        this.draggable = true;
        this.selectable = true;
        this.isSelected = false;
        this.visible = true;
        for (var key in VertexAttr.model)
            this[key] = VertexAttr.model[key];
    }
    ;
}
/**
 * This is the global attribute model. Set these object on the initialization
 * of your app to gain all VertexAttr instances have these attributes.
 *
 * @type {object}
 **/
VertexAttr.model = {
    draggable: true,
    selectable: true,
    isSelected: false,
    visible: true
};
//# sourceMappingURL=VertexAttr.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/VertexListeners.js":
/*!*****************************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/VertexListeners.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VertexListeners: () => (/* binding */ VertexListeners)
/* harmony export */ });
/**
 * @author   Ikaros Kappler
 * @date     2018-08-27
 * @modified 2018-11-28 Added the vertex-param to the constructor and extended the event. Vertex events now have a 'params' attribute object.
 * @modified 2019-03-20 Added JSDoc tags.
 * @modified 2020-02-22 Added 'return this' to the add* functions (for chanining).
 * @modified 2020-03-23 Ported to Typescript from JS.
 * @modified 2020-11-17 Added the `click` handler.
 * @version  1.1.0
 *
 * @file VertexListeners
 * @public
 **/
/**
 * @classdesc An event listeners wrapper. This is just a set of three listener
 *              queues (drag, dragStart, dragEnd) and their respective firing
 *              functions.
 *
 */
class VertexListeners {
    /**
     * The constructor.
     *
     * @constructor
     * @name VertexListeners
     * @param {Vertex} vertex - The vertex to use these listeners on (just a backward reference).
     **/
    constructor(vertex) {
        this.click = [];
        this.drag = [];
        this.dragStart = [];
        this.dragEnd = [];
        this.vertex = vertex;
    }
    /**
     * Add a click listener.
     *
     * @method addClickListener
     * @param {VertexListeners~dragListener} listener - The click listener to add (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    addClickListener(listener) {
        VertexListeners._addListener(this.click, listener);
        return this;
    }
    /**
     * The click listener is a function with a single drag event param.
     * @callback VertexListeners~clickListener
     * @param {Event} e - The (extended) click event.
     */
    /**
     * Remove a drag listener.
     *
     * @method removeDragListener
     * @param {VertexListeners~dragListener} listener - The drag listener to remove (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    removeClickListener(listener) {
        this.click = VertexListeners._removeListener(this.click, listener);
        return this;
    }
    /**
     * The click listener is a function with a single drag event param.
     * @callback VertexListeners~clickListener
     * @param {Event} e - The (extended) click event.
     */
    /**
     * Add a drag listener.
     *
     * @method addDragListener
     * @param {VertexListeners~dragListener} listener - The drag listener to add (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    addDragListener(listener) {
        VertexListeners._addListener(this.drag, listener);
        return this;
    }
    /**
     * The drag listener is a function with a single drag event param.
     * @callback VertexListeners~dragListener
     * @param {Event} e - The (extended) drag event.
     */
    /**
     * Remove a drag listener.
     *
     * @method removeDragListener
     * @param {VertexListeners~dragListener} listener - The drag listener to remove (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    removeDragListener(listener) {
        this.drag = VertexListeners._removeListener(this.drag, listener);
        return this;
    }
    /**
     * Add a dragStart listener.
     *
     * @method addDragListener
     * @param {VertexListeners~dragStartListener} listener - The drag-start listener to add (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    addDragStartListener(listener) {
        VertexListeners._addListener(this.dragStart, listener);
        return this;
    }
    /**
     * The drag-start listener is a function with a single drag event param.
     * @callback VertexListeners~dragStartListener
     * @param {Event} e - The (extended) drag event.
     */
    /**
     * Remove a dragStart listener.
     *
     * @method addDragStartListener
     * @param {VertexListeners~dragListener} listener - The drag listener to remove (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    removeDragStartListener(listener) {
        this.dragStart = VertexListeners._removeListener(this.dragStart, listener);
        return this;
    }
    /**
     * Add a dragEnd listener.
     *
     * @method addDragListener
     * @param {VertexListeners~dragEndListener} listener - The drag-end listener to add (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    addDragEndListener(listener) {
        // this.dragEnd.push( listener );
        VertexListeners._addListener(this.dragEnd, listener);
        return this;
    }
    /**
     * The drag-end listener is a function with a single drag event param.
     * @callback VertexListeners~dragEndListener
     * @param {Event} e - The (extended) drag event.
     */
    /**
     * Remove a drag listener.
     *
     * @method removeDragEndListener
     * @param {VertexListeners~clickListener} listener - The drag listener to remove (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    removeDragEndListener(listener) {
        // this.drag.push( listener );
        this.dragEnd = VertexListeners._removeListener(this.dragEnd, listener);
        return this;
    }
    /**
     * Fire a click event with the given event instance to all
     * installed click listeners.
     *
     * @method fireClickEvent
     * @param {VertEvent|XMouseEvent} e - The click event itself to be fired to all installed drag listeners.
     * @return {void}
     * @instance
     * @memberof VertexListeners
     **/
    fireClickEvent(e) {
        VertexListeners._fireEvent(this, this.click, e);
    }
    /**
     * Fire a drag event with the given event instance to all
     * installed drag listeners.
     *
     * @method fireDragEvent
     * @param {VertEvent|XMouseEvent} e - The drag event itself to be fired to all installed drag listeners.
     * @return {void}
     * @instance
     * @memberof VertexListeners
     **/
    fireDragEvent(e) {
        VertexListeners._fireEvent(this, this.drag, e);
    }
    /**
     * Fire a dragStart event with the given event instance to all
     * installed drag-start listeners.
     *
     * @method fireDragStartEvent
     * @param {VertEvent|XMouseEvent} e - The drag-start event itself to be fired to all installed dragStart listeners.
     * @return {void}
     * @instance
     * @memberof VertexListeners
     **/
    fireDragStartEvent(e) {
        VertexListeners._fireEvent(this, this.dragStart, e);
    }
    /**
     * Fire a dragEnd event with the given event instance to all
     * installed drag-end listeners.
     *
     * @method fireDragEndEvent
     * @param {VertEvent|XMouseEvent} e - The drag-end event itself to be fired to all installed dragEnd listeners.
     * @return {void}
     * @instance
     * @memberof VertexListeners
     **/
    fireDragEndEvent(e) {
        VertexListeners._fireEvent(this, this.dragEnd, e);
    }
    /**
     * Removes all listeners from this listeners object.
     */
    removeAllListeners() {
        this.click = [];
        this.drag = [];
        this.dragStart = [];
        this.dragEnd = [];
    }
    /**
     * @private
     **/
    static _fireEvent(_self, listeners, e) {
        const ve = e;
        if (typeof ve.params == "undefined")
            ve.params = { vertex: _self.vertex };
        else
            ve.params.vertex = _self.vertex;
        for (var i in listeners) {
            listeners[i](ve);
        }
    }
    /**
     * @private
     */
    static _addListener(listeners, newListener) {
        for (var i in listeners) {
            if (listeners[i] == newListener)
                return false;
        }
        listeners.push(newListener);
        return true;
    }
    /**
     * @private
     */
    static _removeListener(listeners, oldListener) {
        for (var i = 0; i < listeners.length; i++) {
            if (listeners[i] == oldListener)
                return listeners.splice(i, 1);
        }
        return listeners;
    }
}
//# sourceMappingURL=VertexListeners.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/draw.js":
/*!******************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/draw.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   drawutils: () => (/* binding */ drawutils)
/* harmony export */ });
/* harmony import */ var _CubicBezierCurve__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CubicBezierCurve */ "./node_modules/plotboilerplate/src/esm/CubicBezierCurve.js");
/* harmony import */ var _Vertex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Vertex */ "./node_modules/plotboilerplate/src/esm/Vertex.js");
/* harmony import */ var _drawutilssvg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./drawutilssvg */ "./node_modules/plotboilerplate/src/esm/drawutilssvg.js");
/**
 * @author   Ikaros Kappler
 * @date     2018-04-22
 * @modified 2018-08-16 Added the curve() function to draw cubic bézier curves.
 * @modified 2018-10-23 Recognizing the offset param in the circle() function.
 * @modified 2018-11-27 Added the diamondHandle() function.
 * @modified 2018-11-28 Added the grid() function and the ellipse() function.
 * @modified 2018-11-30 Renamed the text() function to label() as it is not scaling.
 * @modified 2018-12-06 Added a test function for drawing arc in SVG style.
 * @modified 2018-12-09 Added the dot(Vertex,color) function (copied from Feigenbaum-plot-script).
 * @modified 2019-01-30 Added the arrow(Vertex,Vertex,color) function for drawing arrow heads.
 * @modified 2019-01-30 Added the image(Image,Vertex,Vertex) function for drawing images.
 * @modified 2019-04-27 Fixed a severe drawing bug in the arrow(...) function. Scaling arrows did not work properly.
 * @modified 2019-04-28 Added Math.round to the dot() drawing parameters to really draw a singlt dot.
 * @modified 2019-06-07 Fixed an issue in the cubicBezier() function. Paths were always closed.
 * @modified 2019-10-03 Added the beginDrawCycle hook.
 * @modified 2019-10-25 Polygons are no longer drawn with dashed lines (solid lines instead).
 * @modified 2019-11-18 Added the polyline function.
 * @modified 2019-11-22 Added a second workaround for th drawImage bug in Safari.
 * @modified 2019-12-07 Added the 'lineWidth' param to the line(...) function.
 * @modified 2019-12-07 Added the 'lineWidth' param to the cubicBezier(...) function.
 * @modified 2019-12-11 Added the 'color' param to the label(...) function.
 * @modified 2019-12-18 Added the quadraticBezier(...) function (for the sake of approximating Lissajous curves).
 * @modified 2019-12-20 Added the 'lineWidth' param to the polyline(...) function.
 * @modified 2020-01-09 Added the 'lineWidth' param to the ellipse(...) function.
 * @modified 2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @modified 2020-05-05 Added the 'lineWidth' param to the circle(...) function.
 * @modified 2020-05-12 Drawing any handles (square, circle, diamond) with lineWidth 1 now; this was not reset before.
 * @modified 2020-06-22 Added a context.clearRect() call to the clear() function; clearing with alpha channel did not work as expected.
 * @modified 2020-09-07 Added the circleArc(...) function to draw sections of circles.
 * @modified 2020-10-06 Removed the .closePath() instruction from the circleArc function.
 * @modified 2020-10-15 Re-added the text() function.
 * @modified 2020-10-28 Added the path(Path2D) function.
 * @modified 2020-12-28 Added the `singleSegment` mode (test).
 * @modified 2021-01-05 Added the image-loaded/broken check.
 * @modified 2021-01-24 Added the `setCurrentId` function from the `DrawLib` interface.
 * @modified 2021-02-22 Added the `path` drawing function to draw SVG path data.
 * @modified 2021-03-31 Added the `endDrawCycle` function from `DrawLib`.
 * @modified 2021-05-31 Added the `setConfiguration` function from `DrawLib`.
 * @modified 2021-11-12 Adding more parameters tot the `text()` function: fontSize, textAlign, fontFamily, lineHeight.
 * @modified 2021-11-19 Added the `color` param to the `label(...)` function.
 * @modified 2022-02-03 Added the `lineWidth` param to the `crosshair` function.
 * @modified 2022-02-03 Added the `cross(...)` function.
 * @modified 2022-03-27 Added the `texturedPoly` function.
 * @modified 2022-06-01 Tweaked the `polyline` function; lineWidth now scales with scale.x.
 * @modified 2022-07-26 Adding `alpha` to the `image(...)` function.
 * @modified 2022-08-23 Fixed a type issue in the `polyline` function.
 * @modified 2022-08-23 Fixed a type issue in the `setConfiguration` function.
 * @modified 2022-08-23 Fixed a type issue in the `path` function.
 * @modified 2023-02-10 The methods `setCurrentClassName` and `setCurrentId` also accept `null` now.
 * @version  1.12.4
 **/



// Todo: rename this class to Drawutils?
/**
 * @classdesc A wrapper class for basic drawing operations.
 *
 * @requires CubicBzierCurvce
 * @requires Polygon
 * @requires Vertex
 * @requires XYCoords
 */
class drawutils {
    /**
     * The constructor.
     *
     * @constructor
     * @name drawutils
     * @param {anvasRenderingContext2D} context - The drawing context.
     * @param {boolean} fillShaped - Indicates if the constructed drawutils should fill all drawn shapes (if possible).
     **/
    constructor(context, fillShapes) {
        this.ctx = context;
        this.offset = new _Vertex__WEBPACK_IMPORTED_MODULE_1__.Vertex(0, 0);
        this.scale = new _Vertex__WEBPACK_IMPORTED_MODULE_1__.Vertex(1, 1);
        this.fillShapes = fillShapes;
    }
    /**
     * Called before each draw cycle.
     * @param {UID=} uid - (optional) A UID identifying the currently drawn element(s).
     **/
    beginDrawCycle(renderTime) {
        // NOOP
    }
    /**
     * Called after each draw cycle.
     *
     * This is required for compatibility with other draw classes in the library (like drawgl).
     *
     * @name endDrawCycle
     * @method
     * @param {number} renderTime
     * @instance
     **/
    endDrawCycle(renderTime) {
        // NOOP
    }
    /**
     * Set the current drawlib configuration.
     *
     * @name setConfiguration
     * @method
     * @param {DrawLibConfiguration} configuration - The new configuration settings to use for the next render methods.
     */
    setConfiguration(configuration) {
        this.ctx.globalCompositeOperation = configuration.blendMode || "source-over";
    }
    /**
     * This method shouled be called each time the currently drawn `Drawable` changes.
     * It is used by some libraries for identifying elemente on re-renders.
     *
     * @name setCurrentId
     * @method
     * @param {UID|null} uid - A UID identifying the currently drawn element(s).
     **/
    setCurrentId(uid) {
        // NOOP
    }
    /**
     * This method shouled be called each time the currently drawn `Drawable` changes.
     * Determine the class name for further usage here.
     *
     * @name setCurrentClassName
     * @method
     * @param {string|null} className - A class name for further custom use cases.
     **/
    setCurrentClassName(className) {
        // NOOP
    }
    /**
     * Draw the line between the given two points with the specified (CSS-) color.
     *
     * @method line
     * @param {Vertex} zA - The start point of the line.
     * @param {Vertex} zB - The end point of the line.
     * @param {string} color - Any valid CSS color string.
     * @param {number} lineWidth? - [optional] The line's width.
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    line(zA, zB, color, lineWidth) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(this.offset.x + zA.x * this.scale.x, this.offset.y + zA.y * this.scale.y);
        this.ctx.lineTo(this.offset.x + zB.x * this.scale.x, this.offset.y + zB.y * this.scale.y);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth || 1;
        this.ctx.stroke();
        this.ctx.restore();
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
    arrow(zA, zB, color, lineWidth) {
        var headlen = 8; // length of head in pixels
        // var vertices = PlotBoilerplate.utils.buildArrowHead( zA, zB, headlen, this.scale.x, this.scale.y );
        // var vertices : Array<Vertex> = Vertex.utils.buildArrowHead( zA, zB, headlen, this.scale.x, this.scale.y );
        this.ctx.save();
        this.ctx.beginPath();
        var vertices = _Vertex__WEBPACK_IMPORTED_MODULE_1__.Vertex.utils.buildArrowHead(zA, zB, headlen, this.scale.x, this.scale.y);
        this.ctx.moveTo(this.offset.x + zA.x * this.scale.x, this.offset.y + zA.y * this.scale.y);
        for (var i = 0; i < vertices.length; i++) {
            this.ctx.lineTo(this.offset.x + vertices[i].x, this.offset.y + vertices[i].y);
        }
        this.ctx.lineTo(this.offset.x + vertices[0].x, this.offset.y + vertices[0].y);
        this.ctx.lineWidth = lineWidth || 1;
        this._fillOrDraw(color);
        this.ctx.restore();
    }
    /**
     * Draw an image at the given position with the given size.<br>
     * <br>
     * Note: SVG images may have resizing issues at the moment.Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
     *
     * @method image
     * @param {Image} image - The image object to draw.
     * @param {Vertex} position - The position to draw the the upper left corner at.
     * @param {Vertex} size - The x/y-size to draw the image with.
     * @param {number=0.0} alpha - (optional, default=0.0) The transparency (1.0=opaque, 0.0=transparent).
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    image(image, position, size, alpha = 1.0) {
        if (!image.complete || !image.naturalWidth) {
            // Avoid drawing un-unloaded or broken images
            return;
        }
        this.ctx.save();
        this.ctx.globalAlpha = alpha;
        // Note that there is a Safari bug with the 3 or 5 params variant.
        // Only the 9-param varaint works.
        this.ctx.drawImage(image, 0, 0, image.naturalWidth - 1, // There is this horrible Safari bug (fixed in newer versions)
        image.naturalHeight - 1, // To avoid errors substract 1 here.
        this.offset.x + position.x * this.scale.x, this.offset.y + position.y * this.scale.y, size.x * this.scale.x, size.y * this.scale.y);
        this.ctx.restore();
    }
    /**
     * Draw an image at the given position with the given size.<br>
     * <br>
     * Note: SVG images may have resizing issues at the moment.Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
     *
     * @method texturedPoly
     * @param {Image} textureImage - The image object to draw.
     * @param {Bounds} textureSize - The texture size to use; these are the original bounds to map the polygon vertices to.
     * @param {Polygon} polygon - The polygon to use as clip path.
     * @param {Vertex} polygonPosition - The polygon's position (relative), measured at the bounding box's center.
     * @param {number} rotation - The rotation to use for the polygon (and for the texture).
     * @param {XYCoords={x:0,y:0}} rotationCenter - (optional) The rotational center; default is center of bounding box.
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    texturedPoly(textureImage, textureSize, polygon, polygonPosition, rotation) {
        var basePolygonBounds = polygon.getBounds();
        var targetCenterDifference = polygonPosition.clone().difference(basePolygonBounds.getCenter());
        // var rotationalOffset = rotationCenter ? polygonPosition.difference(rotationCenter) : { x: 0, y: 0 };
        // var rotationalOffset = { x: 0, y: 0 };
        var tileCenter = basePolygonBounds.getCenter().sub(targetCenterDifference);
        // Get the position offset of the polygon
        var targetTextureSize = new _Vertex__WEBPACK_IMPORTED_MODULE_1__.Vertex(textureSize.width, textureSize.height);
        // var targetTextureOffset = new Vertex(-textureSize.width / 2, -textureSize.height / 2).sub(targetCenterDifference);
        var targetTextureOffset = new _Vertex__WEBPACK_IMPORTED_MODULE_1__.Vertex(textureSize.min.x, textureSize.min.y).sub(polygonPosition);
        this.ctx.save();
        // this.ctx.translate(this.offset.x + rotationCenter.x * this.scale.x, this.offset.y + rotationCenter.y * this.scale.y);
        this.ctx.translate(this.offset.x + polygonPosition.x * this.scale.x, this.offset.y + polygonPosition.y * this.scale.y);
        drawutils.helpers.clipPoly(this.ctx, {
            x: -polygonPosition.x * this.scale.x,
            y: -polygonPosition.y * this.scale.y
        }, this.scale, polygon.vertices);
        this.ctx.scale(this.scale.x, this.scale.y);
        this.ctx.rotate(rotation);
        this.ctx.drawImage(textureImage, 0, 0, textureImage.naturalWidth - 1, // There is this horrible Safari bug (fixed in newer versions)
        textureImage.naturalHeight - 1, // To avoid errors substract 1 here.
        targetTextureOffset.x, // * this.scale.x,
        targetTextureOffset.y, // * this.scale.y,
        targetTextureSize.x, //  * this.scale.x,
        targetTextureSize.y // * this.scale.y
        );
        this.ctx.restore();
    }
    _texturedPoly(textureImage, textureSize, polygon, polygonPosition, rotation, rotationCenter = { x: 0, y: 0 }) {
        var basePolygonBounds = polygon.getBounds();
        var targetCenterDifference = polygonPosition.clone().difference(basePolygonBounds.getCenter());
        var rotationalOffset = rotationCenter ? polygonPosition.difference(rotationCenter) : { x: 0, y: 0 };
        // var rotationalOffset = { x: 0, y: 0 };
        var tileCenter = basePolygonBounds.getCenter().sub(targetCenterDifference);
        // Get the position offset of the polygon
        var targetTextureSize = new _Vertex__WEBPACK_IMPORTED_MODULE_1__.Vertex(textureSize.width, textureSize.height);
        var targetTextureOffset = new _Vertex__WEBPACK_IMPORTED_MODULE_1__.Vertex(-textureSize.width / 2, -textureSize.height / 2).sub(targetCenterDifference);
        this.ctx.save();
        // this.ctx.translate(
        //   this.offset.x + (tileCenter.x - rotationalOffset.x * 0 + targetTextureOffset.x * 0.0) * this.scale.x,
        //   this.offset.y + (tileCenter.y - rotationalOffset.y * 0 + targetTextureOffset.y * 0.0) * this.scale.y
        // );
        this.ctx.translate(this.offset.x + (tileCenter.x - rotationalOffset.x * 0 + targetTextureOffset.x * 0.0) * this.scale.x, this.offset.y + (tileCenter.y - rotationalOffset.y * 0 + targetTextureOffset.y * 0.0) * this.scale.y);
        this.ctx.rotate(rotation);
        drawutils.helpers.clipPoly(this.ctx, {
            x: (-targetCenterDifference.x * 1 - tileCenter.x - rotationalOffset.x) * this.scale.x,
            y: (-targetCenterDifference.y * 1 - tileCenter.y - rotationalOffset.y) * this.scale.y
        }, this.scale, polygon.vertices);
        this.ctx.drawImage(textureImage, 0, 0, textureImage.naturalWidth - 1, // There is this horrible Safari bug (fixed in newer versions)
        textureImage.naturalHeight - 1, // To avoid errors substract 1 here.
        (-polygonPosition.x + targetTextureOffset.x * 1 - rotationalOffset.x * 1) * this.scale.x, (-polygonPosition.y + targetTextureOffset.y * 1 - rotationalOffset.y * 1) * this.scale.y, targetTextureSize.x * this.scale.x, targetTextureSize.y * this.scale.y);
        // const scaledTextureSize = new Bounds(
        //   new Vertex(
        //     -polygonPosition.x + targetTextureOffset.x - rotationalOffset.x,
        //     -polygonPosition.y + targetTextureOffset.y - rotationalOffset.y
        //   ).scaleXY(this.scale, rotationCenter),
        //   new Vertex(
        //     -polygonPosition.x + targetTextureOffset.x - rotationalOffset.x + targetTextureSize.x,
        //     -polygonPosition.y + targetTextureOffset.y - rotationalOffset.y + targetTextureSize.y
        //   ).scaleXY(this.scale, rotationCenter)
        // );
        // this.ctx.drawImage(
        //   textureImage,
        //   0,
        //   0,
        //   textureImage.naturalWidth - 1, // There is this horrible Safari bug (fixed in newer versions)
        //   textureImage.naturalHeight - 1, // To avoid errors substract 1 here.
        //   scaledTextureSize.min.x,
        //   scaledTextureSize.min.y,
        //   scaledTextureSize.width,
        //   scaledTextureSize.height
        // );
        this.ctx.restore();
    }
    /**
     * Draw a rectangle.
     *
     * @param {XYCoords} position - The upper left corner of the rectangle.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
     * @param {string} color - The color to use.
     * @param {number=1} lineWidth - (optional) The line with to use (default is 1).
     **/
    rect(position, width, height, color, lineWidth) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(this.offset.x + position.x * this.scale.x, this.offset.y + position.y * this.scale.y);
        this.ctx.lineTo(this.offset.x + (position.x + width) * this.scale.x, this.offset.y + position.y * this.scale.y);
        this.ctx.lineTo(this.offset.x + (position.x + width) * this.scale.x, this.offset.y + (position.y + height) * this.scale.y);
        this.ctx.lineTo(this.offset.x + position.x * this.scale.x, this.offset.y + (position.y + height) * this.scale.y);
        // this.ctx.lineTo( this.offset.x+position.x*this.scale.x, this.offset.y+position.y*this.scale.y );
        this.ctx.closePath();
        this.ctx.lineWidth = lineWidth || 1;
        this._fillOrDraw(color);
        this.ctx.restore();
    }
    // +---------------------------------------------------------------------------------
    // | This is the final helper function for drawing and filling stuff. It is not
    // | intended to be used from the outside.
    // |
    // | When in draw mode it draws the current shape.
    // | When in fill mode it fills the current shape.
    // |
    // | This function is usually only called internally.
    // |
    // | @param color A stroke/fill color to use.
    // +-------------------------------
    // TODO: convert this to a STATIC function.
    _fillOrDraw(color) {
        if (this.fillShapes) {
            this.ctx.fillStyle = color;
            this.ctx.fill();
        }
        else {
            this.ctx.strokeStyle = color;
            this.ctx.stroke();
        }
    }
    /**
     * Draw the given (cubic) bézier curve.
     *
     * @method cubicBezier
     * @param {Vertex} startPoint - The start point of the cubic Bézier curve
     * @param {Vertex} endPoint   - The end point the cubic Bézier curve.
     * @param {Vertex} startControlPoint - The start control point the cubic Bézier curve.
     * @param {Vertex} endControlPoint   - The end control point the cubic Bézier curve.
     * @param {string} color - The CSS color to draw the curve with.
     * @param {number} lineWidth - (optional) The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    cubicBezier(startPoint, endPoint, startControlPoint, endControlPoint, color, lineWidth) {
        if (startPoint instanceof _CubicBezierCurve__WEBPACK_IMPORTED_MODULE_0__.CubicBezierCurve) {
            this.cubicBezier(startPoint.startPoint, startPoint.endPoint, startPoint.startControlPoint, startPoint.endControlPoint, color, lineWidth);
            return;
        }
        // Draw curve
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(this.offset.x + startPoint.x * this.scale.x, this.offset.y + startPoint.y * this.scale.y);
        this.ctx.bezierCurveTo(this.offset.x + startControlPoint.x * this.scale.x, this.offset.y + startControlPoint.y * this.scale.y, this.offset.x + endControlPoint.x * this.scale.x, this.offset.y + endControlPoint.y * this.scale.y, this.offset.x + endPoint.x * this.scale.x, this.offset.y + endPoint.y * this.scale.y);
        //this.ctx.closePath();
        this.ctx.lineWidth = lineWidth || 2;
        this._fillOrDraw(color);
        this.ctx.restore();
    }
    /**
     * Draw the given (quadratic) bézier curve.
     *
     * @method quadraticBezier
     * @param {Vertex} startPoint   - The start point of the cubic Bézier curve
     * @param {Vertex} controlPoint - The control point the cubic Bézier curve.
     * @param {Vertex} endPoint     - The end control point the cubic Bézier curve.
     * @param {string} color        - The CSS color to draw the curve with.
     * @param {number|string} lineWidth - (optional) The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    quadraticBezier(startPoint, controlPoint, endPoint, color, lineWidth) {
        // Draw curve
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(this.offset.x + startPoint.x * this.scale.x, this.offset.y + startPoint.y * this.scale.y);
        this.ctx.quadraticCurveTo(this.offset.x + controlPoint.x * this.scale.x, this.offset.y + controlPoint.y * this.scale.y, this.offset.x + endPoint.x * this.scale.x, this.offset.y + endPoint.y * this.scale.y);
        this.ctx.lineWidth = lineWidth || 2;
        this._fillOrDraw(color);
        this.ctx.restore();
    }
    /**
     * Draw the given (cubic) Bézier path.
     *
     * The given path must be an array with n*3+1 vertices, where n is the number of
     * curves in the path:
     * <pre> [ point1, point1_startControl, point2_endControl, point2, point2_startControl, point3_endControl, point3, ... pointN_endControl, pointN ]</pre>
     *
     * @method cubicBezierPath
     * @param {Vertex[]} path - The cubic bezier path as described above.
     * @param {string} color - The CSS colot to draw the path with.
     * @param {number=1} lineWidth - (optional) The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    cubicBezierPath(path, color, lineWidth) {
        if (!path || path.length == 0)
            return;
        // Draw curve
        this.ctx.save();
        this.ctx.beginPath();
        var endPoint;
        var startControlPoint;
        var endControlPoint;
        this.ctx.moveTo(this.offset.x + path[0].x * this.scale.x, this.offset.y + path[0].y * this.scale.y);
        for (var i = 1; i < path.length; i += 3) {
            startControlPoint = path[i];
            endControlPoint = path[i + 1];
            endPoint = path[i + 2];
            this.ctx.bezierCurveTo(this.offset.x + startControlPoint.x * this.scale.x, this.offset.y + startControlPoint.y * this.scale.y, this.offset.x + endControlPoint.x * this.scale.x, this.offset.y + endControlPoint.y * this.scale.y, this.offset.x + endPoint.x * this.scale.x, this.offset.y + endPoint.y * this.scale.y);
        }
        this.ctx.closePath();
        this.ctx.lineWidth = lineWidth || 1;
        this._fillOrDraw(color);
        this.ctx.restore();
    }
    /**
     * Draw the given handle and handle point (used to draw interactive Bézier curves).
     *
     * The colors for this are fixed and cannot be specified.
     *
     * @method handle
     * @param {Vertex} startPoint - The start of the handle.
     * @param {Vertex} endPoint - The end point of the handle.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    handle(startPoint, endPoint) {
        // Draw handles
        // (No need to save and restore here)
        this.point(startPoint, "rgb(0,32,192)");
        this.square(endPoint, 5, "rgba(0,128,192,0.5)");
    }
    /**
     * Draw a handle line (with a light grey).
     *
     * @method handleLine
     * @param {Vertex} startPoint - The start point to draw the handle at.
     * @param {Vertex} endPoint - The end point to draw the handle at.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    handleLine(startPoint, endPoint) {
        // Draw handle lines
        this.line(startPoint, endPoint, "rgb(192,192,192)");
    }
    /**
     * Draw a 1x1 dot with the specified (CSS-) color.
     *
     * @method dot
     * @param {Vertex} p - The position to draw the dot at.
     * @param {string} color - The CSS color to draw the dot with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    dot(p, color) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(Math.round(this.offset.x + this.scale.x * p.x), Math.round(this.offset.y + this.scale.y * p.y));
        this.ctx.lineTo(Math.round(this.offset.x + this.scale.x * p.x + 1), Math.round(this.offset.y + this.scale.y * p.y + 1));
        this.ctx.closePath();
        this.ctx.lineWidth = 1;
        this._fillOrDraw(color);
        this.ctx.restore();
    }
    /**
     * Draw the given point with the specified (CSS-) color and radius 3.
     *
     * @method point
     * @param {Vertex} p - The position to draw the point at.
     * @param {string} color - The CSS color to draw the point with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    point(p, color) {
        var radius = 3;
        this.ctx.beginPath();
        this.ctx.arc(this.offset.x + p.x * this.scale.x, this.offset.y + p.y * this.scale.y, radius, 0, 2 * Math.PI, false);
        this.ctx.closePath();
        this.ctx.lineWidth = 1;
        this._fillOrDraw(color);
    }
    /**
     * Draw a circle with the specified (CSS-) color and radius.<br>
     * <br>
     * Note that if the x- and y- scales are different the result will be an ellipse rather than a circle.
     *
     * @method circle
     * @param {Vertex} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {string} color - The CSS color to draw the circle with.
     * @param {number} lineWidth - The line width (optional, default=1).
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    circle(center, radius, color, lineWidth) {
        this.ctx.beginPath();
        this.ctx.ellipse(this.offset.x + center.x * this.scale.x, this.offset.y + center.y * this.scale.y, radius * this.scale.x, radius * this.scale.y, 0.0, 0.0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.lineWidth = lineWidth || 1;
        this._fillOrDraw(color);
    }
    /**
       * Draw a circular arc (section of a circle) with the given CSS color.
       *
       * @method circleArc
       * @param {Vertex} center - The center of the circle.
       * @param {number} radius - The radius of the circle.
       * @param {number} startAngle - The angle to start at.
       * @param {number} endAngle - The angle to end at.
       * @param {string=#000000} color - The CSS color to draw the circle with.
       * @param {number=1} lineWidth - The line width to use
       // * @param {boolean=false} options.asSegment - If `true` then no beginPath and no draw will be applied (as part of larger path).
       * @return {void}
       * @instance
       * @memberof drawutils
       */
    circleArc(center, radius, startAngle, endAngle, color, lineWidth, options) {
        if (!options || !options.asSegment) {
            this.ctx.beginPath();
        }
        this.ctx.ellipse(this.offset.x + center.x * this.scale.x, this.offset.y + center.y * this.scale.y, radius * this.scale.x, radius * this.scale.y, 0.0, startAngle, endAngle, false);
        if (!options || !options.asSegment) {
            // this.ctx.closePath();
            this.ctx.lineWidth = lineWidth || 1;
            this._fillOrDraw(color || "#000000");
        }
    }
    /**
     * Draw an ellipse with the specified (CSS-) color and thw two radii.
     *
     * @method ellipse
     * @param {Vertex} center - The center of the ellipse.
     * @param {number} radiusX - The radius of the ellipse.
     * @param {number} radiusY - The radius of the ellipse.
     * @param {string} color - The CSS color to draw the ellipse with.
     * @param {number} lineWidth=1 - An optional line width param (default is 1).
     * @param {number=} rotation - (optional, default=0) The rotation of the ellipse.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    ellipse(center, radiusX, radiusY, color, lineWidth, rotation) {
        if (typeof rotation === "undefined") {
            rotation = 0.0;
        }
        this.ctx.beginPath();
        this.ctx.ellipse(this.offset.x + center.x * this.scale.x, this.offset.y + center.y * this.scale.y, radiusX * this.scale.x, radiusY * this.scale.y, rotation, 0.0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.lineWidth = lineWidth || 1;
        this._fillOrDraw(color);
    }
    /**
     * Draw square at the given center, size and with the specified (CSS-) color.<br>
     * <br>
     * Note that if the x-scale and the y-scale are different the result will be a rectangle rather than a square.
     *
     * @method square
     * @param {XYCoords} center - The center of the square.
     * @param {number} size - The size of the square.
     * @param {string} color - The CSS color to draw the square with.
     * @param {number} lineWidth - The line with to use (optional, default is 1).
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    square(center, size, color, lineWidth) {
        this.ctx.beginPath();
        this.ctx.rect(this.offset.x + (center.x - size / 2.0) * this.scale.x, this.offset.y + (center.y - size / 2.0) * this.scale.y, size * this.scale.x, size * this.scale.y);
        this.ctx.closePath();
        this.ctx.lineWidth = lineWidth || 1;
        this._fillOrDraw(color);
    }
    /**
     * Draw a grid of horizontal and vertical lines with the given (CSS-) color.
     *
     * @method grid
     * @param {Vertex} center - The center of the grid.
     * @param {number} width - The total width of the grid (width/2 each to the left and to the right).
     * @param {number} height - The total height of the grid (height/2 each to the top and to the bottom).
     * @param {number} sizeX - The horizontal grid size.
     * @param {number} sizeY - The vertical grid size.
     * @param {string} color - The CSS color to draw the grid with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    grid(center, width, height, sizeX, sizeY, color) {
        this.ctx.beginPath();
        var yMin = -Math.ceil((height * 0.5) / sizeY) * sizeY;
        var yMax = height / 2;
        for (var x = -Math.ceil((width * 0.5) / sizeX) * sizeX; x < width / 2; x += sizeX) {
            this.ctx.moveTo(this.offset.x + (center.x + x) * this.scale.x, this.offset.y + (center.y + yMin) * this.scale.y);
            this.ctx.lineTo(this.offset.x + (center.x + x) * this.scale.x, this.offset.y + (center.y + yMax) * this.scale.y);
        }
        var xMin = -Math.ceil((width * 0.5) / sizeX) * sizeX; // -Math.ceil((height*0.5)/sizeY)*sizeY;
        var xMax = width / 2; // height/2;
        for (var y = -Math.ceil((height * 0.5) / sizeY) * sizeY; y < height / 2; y += sizeY) {
            this.ctx.moveTo(this.offset.x + (center.x + xMin) * this.scale.x - 4, this.offset.y + (center.y + y) * this.scale.y);
            this.ctx.lineTo(this.offset.x + (center.x + xMax) * this.scale.x + 4, this.offset.y + (center.y + y) * this.scale.y);
        }
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1.0;
        this.ctx.stroke();
        this.ctx.closePath();
    }
    /**
     * Draw a raster of crosshairs in the given grid.<br>
     *
     * This works analogue to the grid() function
     *
     * @method raster
     * @param {Vertex} center - The center of the raster.
     * @param {number} width - The total width of the raster (width/2 each to the left and to the right).
     * @param {number} height - The total height of the raster (height/2 each to the top and to the bottom).
     * @param {number} sizeX - The horizontal raster size.
     * @param {number} sizeY - The vertical raster size.
     * @param {string} color - The CSS color to draw the raster with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    raster(center, width, height, sizeX, sizeY, color) {
        this.ctx.save();
        this.ctx.beginPath();
        for (var x = -Math.ceil((width * 0.5) / sizeX) * sizeX; x < width / 2; x += sizeX) {
            for (var y = -Math.ceil((height * 0.5) / sizeY) * sizeY; y < height / 2; y += sizeY) {
                // Draw a crosshair
                this.ctx.moveTo(this.offset.x + (center.x + x) * this.scale.x - 4, this.offset.y + (center.y + y) * this.scale.y);
                this.ctx.lineTo(this.offset.x + (center.x + x) * this.scale.x + 4, this.offset.y + (center.y + y) * this.scale.y);
                this.ctx.moveTo(this.offset.x + (center.x + x) * this.scale.x, this.offset.y + (center.y + y) * this.scale.y - 4);
                this.ctx.lineTo(this.offset.x + (center.x + x) * this.scale.x, this.offset.y + (center.y + y) * this.scale.y + 4);
            }
        }
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1.0;
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }
    /**
     * Draw a diamond handle (square rotated by 45°) with the given CSS color.
     *
     * It is an inherent feature of the handle functions that the drawn elements are not scaled and not
     * distorted. So even if the user zooms in or changes the aspect ratio, the handles will be drawn
     * as even shaped diamonds.
     *
     * @method diamondHandle
     * @param {Vertex} center - The center of the diamond.
     * @param {Vertex} size - The x/y-size of the diamond.
     * @param {string} color - The CSS color to draw the diamond with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    diamondHandle(center, size, color) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.offset.x + center.x * this.scale.x - size / 2.0, this.offset.y + center.y * this.scale.y);
        this.ctx.lineTo(this.offset.x + center.x * this.scale.x, this.offset.y + center.y * this.scale.y - size / 2.0);
        this.ctx.lineTo(this.offset.x + center.x * this.scale.x + size / 2.0, this.offset.y + center.y * this.scale.y);
        this.ctx.lineTo(this.offset.x + center.x * this.scale.x, this.offset.y + center.y * this.scale.y + size / 2.0);
        this.ctx.closePath();
        this.ctx.lineWidth = 1;
        this._fillOrDraw(color);
    }
    /**
     * Draw a square handle with the given CSS color.<br>
     * <br>
     * It is an inherent feature of the handle functions that the drawn elements are not scaled and not
     * distorted. So even if the user zooms in or changes the aspect ratio, the handles will be drawn
     * as even shaped squares.
     *
     * @method squareHandle
     * @param {Vertex} center - The center of the square.
     * @param {Vertex} size - The x/y-size of the square.
     * @param {string} color - The CSS color to draw the square with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    squareHandle(center, size, color) {
        this.ctx.beginPath();
        this.ctx.rect(this.offset.x + center.x * this.scale.x - size / 2.0, this.offset.y + center.y * this.scale.y - size / 2.0, size, size);
        this.ctx.closePath();
        this.ctx.lineWidth = 1;
        this._fillOrDraw(color);
    }
    /**
     * Draw a circle handle with the given CSS color.<br>
     * <br>
     * It is an inherent feature of the handle functions that the drawn elements are not scaled and not
     * distorted. So even if the user zooms in or changes the aspect ratio, the handles will be drawn
     * as even shaped circles.
     *
     * @method circleHandle
     * @param {Vertex} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {string} color - The CSS color to draw the circle with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    circleHandle(center, radius, color) {
        radius = radius || 3;
        this.ctx.beginPath();
        this.ctx.arc(this.offset.x + center.x * this.scale.x, this.offset.y + center.y * this.scale.y, radius, 0, 2 * Math.PI, false);
        this.ctx.closePath();
        this.ctx.lineWidth = 1;
        this._fillOrDraw(color);
    }
    /**
     * Draw a crosshair with given radius and color at the given position.<br>
     * <br>
     * Note that the crosshair radius will not be affected by scaling.
     *
     * @method crosshair
     * @param {XYCoords} center - The center of the crosshair.
     * @param {number} radius - The radius of the crosshair.
     * @param {string} color - The CSS color to draw the crosshair with.
     * @param {number=0.5} lineWidth - (optional, default=0.5) The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    crosshair(center, radius, color, lineWidth) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(this.offset.x + center.x * this.scale.x - radius, this.offset.y + center.y * this.scale.y);
        this.ctx.lineTo(this.offset.x + center.x * this.scale.x + radius, this.offset.y + center.y * this.scale.y);
        this.ctx.moveTo(this.offset.x + center.x * this.scale.x, this.offset.y + center.y * this.scale.y - radius);
        this.ctx.lineTo(this.offset.x + center.x * this.scale.x, this.offset.y + center.y * this.scale.y + radius);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth || 0.5;
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }
    /**
     * Draw a cross with diagonal axes with given radius, color and lineWidth at the given position.<br>
     * <br>
     * Note that the x's radius will not be affected by scaling.
     *
     * @method crosshair
     * @param {XYCoords} center - The center of the crosshair.
     * @param {number} radius - The radius of the crosshair.
     * @param {string} color - The CSS color to draw the crosshair with.
     * @param {number=1} lineWidth - (optional, default=1.0) The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    cross(center, radius, color, lineWidth) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(this.offset.x + center.x * this.scale.x - radius, this.offset.y + center.y * this.scale.y - radius);
        this.ctx.lineTo(this.offset.x + center.x * this.scale.x + radius, this.offset.y + center.y * this.scale.y + radius);
        this.ctx.moveTo(this.offset.x + center.x * this.scale.x - radius, this.offset.y + center.y * this.scale.y + radius);
        this.ctx.lineTo(this.offset.x + center.x * this.scale.x + radius, this.offset.y + center.y * this.scale.y - radius);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth || 1.0;
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }
    /**
     * Draw a polygon.
     *
     * @method polygon
     * @param {Polygon}  polygon - The polygon to draw.
     * @param {string}   color - The CSS color to draw the polygon with.
     * @param {string}   lineWidth - The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    polygon(polygon, color, lineWidth) {
        this.polyline(polygon.vertices, polygon.isOpen, color, lineWidth);
    }
    /**
     * Draw a polygon line (alternative function to the polygon).
     *
     * @method polyline
     * @param {Vertex[]} vertices   - The polygon vertices to draw.
     * @param {boolan}   isOpen     - If true the polyline will not be closed at its end.
     * @param {string}   color      - The CSS color to draw the polygon with.
     * @param {number}   lineWidth  - The line width (default is 1.0);
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    polyline(vertices, isOpen, color, lineWidth) {
        if (vertices.length <= 1) {
            return;
        }
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = (lineWidth || 1.0) * this.scale.x;
        this.ctx.moveTo(this.offset.x + vertices[0].x * this.scale.x, this.offset.y + vertices[0].y * this.scale.y);
        for (var i = 0; i < vertices.length; i++) {
            this.ctx.lineTo(this.offset.x + vertices[i].x * this.scale.x, this.offset.y + vertices[i].y * this.scale.y);
        }
        if (!isOpen)
            // && vertices.length > 2 )
            this.ctx.closePath();
        this._fillOrDraw(color);
        this.ctx.closePath();
        this.ctx.setLineDash([]);
        this.ctx.restore();
    }
    /**
     * Draw a text at the given relative position.
     *
     * @method text
     * @param {string} text - The text to draw.
     * @param {number} x - The x-position to draw the text at.
     * @param {number} y - The y-position to draw the text at.
     * @param {string=} options.color - The Color to use.
     * @param {string=} options.fontFamily - The font family to use.
     * @param {number=} options.fontSize - The font size (in pixels) to use.
     * @param {FontStyle=} options.fontStyle - The font style to use.
     * @param {FontWeight=} options.fontWeight - The font weight to use.
     * @param {number=} options.lineHeight - The line height (in pixels) to use.
     * @param {number=} options.rotation - The (optional) rotation in radians.
     * @param {string=} options.textAlign - The text align to use. According to the specifiactions (https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textAlign) valid values are `"left" || "right" || "center" || "start" || "end"`.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    text(text, x, y, options) {
        // See https://stackoverflow.com/a/23523697
        var _a, _b, _c;
        options = options || {};
        this.ctx.save();
        let relX = this.offset.x + x * this.scale.x;
        let relY = this.offset.y + y * this.scale.y;
        const color = options.color || "black";
        if (options.fontSize || options.fontFamily) {
            // Scaling of text only works in uniform mode
            this.ctx.font =
                (options.fontWeight ? options.fontWeight + " " : "") +
                    (options.fontStyle ? options.fontStyle + " " : "") +
                    (options.fontSize ? options.fontSize * this.scale.x + "px " : " ") +
                    (options.fontFamily
                        ? options.fontFamily.indexOf(" ") === -1
                            ? options.fontFamily
                            : `"${options.fontFamily}"`
                        : "Arial");
        }
        if (options.textAlign) {
            this.ctx.textAlign = options.textAlign;
        }
        const rotation = (_a = options.rotation) !== null && _a !== void 0 ? _a : 0.0;
        const lineHeight = ((_c = (_b = options.lineHeight) !== null && _b !== void 0 ? _b : options.fontSize) !== null && _c !== void 0 ? _c : 0) * this.scale.x;
        this.ctx.translate(relX, relY);
        this.ctx.rotate(rotation);
        if (this.fillShapes) {
            this.ctx.fillStyle = color;
            this.ctx.fillText(text, 0, lineHeight / 2);
        }
        else {
            this.ctx.strokeStyle = color;
            this.ctx.strokeText(text, 0, lineHeight / 2);
        }
        // this.ctx.translate(-relX, -relY);
        // this.ctx.rotate(-rotation); // is this necessary before 'restore()'?
        this.ctx.restore();
    }
    /**
     * Draw a non-scaling text label at the given position.
     *
     * Note that these are absolute label positions, they are not affected by offset or scale.
     *
     * @method label
     * @param {string} text - The text to draw.
     * @param {number} x - The x-position to draw the text at.
     * @param {number} y - The y-position to draw the text at.
     * @param {number=} rotation - The (optional) rotation in radians (default=0).
     * @param {string=} color - The color to render the text with (default=black).
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    label(text, x, y, rotation, color) {
        this.ctx.save();
        this.ctx.font = "lighter 9pt Arial";
        this.ctx.translate(x, y);
        if (typeof rotation !== "undefined")
            this.ctx.rotate(rotation);
        this.ctx.fillStyle = color || "black";
        if (this.fillShapes) {
            this.ctx.fillText(text, 0, 0);
        }
        else {
            this.ctx.strokeText(text, 0, 0);
        }
        this.ctx.restore();
    }
    /**
     * Draw an SVG-like path given by the specified path data.
     *
     *
     * @method path
     * @param {SVGPathData} pathData - An array of path commands and params.
     * @param {string=null} color - (optional) The color to draw this path with (default is null).
     * @param {number=1} lineWidth - (optional) the line width to use (default is 1).
     * @param {boolean=false} options.inplace - (optional) If set to true then path transforamtions (scale and translate) will be done in-place in the array. This can boost the performance.
     * @instance
     * @memberof drawutils
     * @return {R} An instance representing the drawn path.
     */
    path(pathData, color, lineWidth, options) {
        const d = options && options.inplace ? pathData : _drawutilssvg__WEBPACK_IMPORTED_MODULE_2__.drawutilssvg.copyPathData(pathData);
        _drawutilssvg__WEBPACK_IMPORTED_MODULE_2__.drawutilssvg.transformPathData(d, this.offset, this.scale);
        if (color) {
            this.ctx.strokeStyle = color;
        }
        this.ctx.lineWidth = lineWidth || 1;
        if (this.fillShapes) {
            if (color) {
                this.ctx.fillStyle = color;
            }
            this.ctx.fill(new Path2D(d.join(" ")));
        }
        else {
            if (color) {
                this.ctx.strokeStyle = color;
            }
            this.ctx.stroke(new Path2D(d.join(" ")));
        }
    }
    /**
     * Due to gl compatibility there is a generic 'clear' function required
     * to avoid accessing the context object itself directly.
     *
     * This function just fills the whole canvas with a single color.
     *
     * @param {string} color - The color to clear with.
     **/
    clear(color) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
drawutils.helpers = {
    // A helper function to define the clipping path.
    // This could be a candidate for the draw library.
    clipPoly: (ctx, offset, scale, vertices) => {
        ctx.beginPath();
        // Set clip mask
        ctx.moveTo(offset.x + vertices[0].x * scale.x, offset.y + vertices[0].y * scale.y);
        for (var i = 1; i < vertices.length; i++) {
            const vert = vertices[i];
            ctx.lineTo(offset.x + vert.x * scale.x, offset.y + vert.y * scale.y);
        }
        ctx.closePath();
        ctx.clip();
    }
};
//# sourceMappingURL=draw.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/drawgl.js":
/*!********************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/drawgl.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   drawutilsgl: () => (/* binding */ drawutilsgl)
/* harmony export */ });
/* harmony import */ var _Vertex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Vertex */ "./node_modules/plotboilerplate/src/esm/Vertex.js");
/**
 * @author   Ikaros Kappler
 * @date     2019-09-18
 * @modified 2019-10-03 Added the beginDrawCycle hook.
 * @modified 2020-03-25 Ported stub to Typescript.
 * @modified 2020-10-15 Re-added the text() function.
 * @modified 2021-01-24 Added the `setCurrentId` function.
 * @modified 2021-05-31 Added the `setConfiguration` function from `DrawLib`.
 * @modified 2022-02-03 Added the `lineWidth` param to the `crosshair` function.
 * @modified 2022-02-03 Added the `cross(...)` function.
 * @modified 2022-03-27 Added the `texturedPoly` function.
 * @modified 2022-07-26 Adding `alpha` to the `image(...)` function.
 * @modified 2023-02-10 The methods `setCurrentClassName` and `setCurrentId` also accept `null` now.
 * @version  0.0.9
 **/

/**
 * @classdesc A wrapper class for basic drawing operations. This is the WebGL
 * implementation whih sould work with shaders.
 *
 * @requires CubicBzierCurvce
 * @requires Polygon
 * @requires SVGSerializable
 * @requires Vertex
 * @requires XYCoords
 */
class drawutilsgl {
    /**
     * The constructor.
     *
     * @constructor
     * @name drawutils
     * @param {WebGLRenderingContext|null} context - The drawing context.
     * @param {boolean} fillShaped - Indicates if the constructed drawutils should fill all drawn shapes (if possible).
     **/
    constructor(context, fillShapes) {
        this.gl = context;
        this.offset = new _Vertex__WEBPACK_IMPORTED_MODULE_0__.Vertex(0, 0);
        this.scale = new _Vertex__WEBPACK_IMPORTED_MODULE_0__.Vertex(1, 1);
        this.fillShapes = fillShapes;
        this._zindex = 0.0;
        if (context == null || typeof context === "undefined")
            return;
        this.glutils = new GLU(context);
        // PROBLEM: CANNOT USE MULTIPLE SHADER PROGRAM INSTANCES ON THE SAME CONTEXT!
        // SOLUTION: USE SHARED SHADER PROGRAM!!! ... somehow ...
        // This needs to be considered in the overlying component; both draw-instances need to
        // share their gl context.
        // That's what the copyInstace(boolean) method is good for.
        this._vertShader = this.glutils.compileShader(drawutilsgl.vertCode, this.gl.VERTEX_SHADER);
        this._fragShader = this.glutils.compileShader(drawutilsgl.fragCode, this.gl.FRAGMENT_SHADER);
        this._program = this.glutils.makeProgram(this._vertShader, this._fragShader);
        // Create an empty buffer object
        this.vertex_buffer = this.gl.createBuffer();
        // Bind appropriate array buffer to it
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffer);
        console.log("gl initialized");
    }
    _x2rel(x) {
        return ((this.scale.x * x + this.offset.x) / this.gl.canvas.width) * 2.0 - 1.0;
    }
    _y2rel(y) {
        return ((this.offset.y - this.scale.y * y) / this.gl.canvas.height) * 2.0 - 1.0;
    }
    /**
     * Creates a 'shallow' (non deep) copy of this instance. This implies
     * that under the hood the same gl context and gl program will be used.
     */
    copyInstance(fillShapes) {
        var copy = new drawutilsgl(null, fillShapes);
        copy.gl = this.gl;
        copy.glutils = this.glutils;
        copy._vertShader = this._vertShader;
        copy._fragShader = this._fragShader;
        copy._program = this._program;
        return copy;
    }
    /**
     * Called before each draw cycle.
     * @param {number} renderTime
     **/
    beginDrawCycle(renderTime) {
        this._zindex = 0.0;
        this.renderTime = renderTime;
    }
    /**
     * Called after each draw cycle.
     *
     * This is required for compatibility with other draw classes in the library (like drawgl).
     *
     * @name endDrawCycle
     * @method
     * @param {number} renderTime
     * @instance
     **/
    endDrawCycle(renderTime) {
        // NOOP
    }
    /**
     * Set the current drawlib configuration.
     *
     * @name setConfiguration
     * @method
     * @param {DrawLibConfiguration} configuration - The new configuration settings to use for the next render methods.
     */
    setConfiguration(configuration) {
        // TODO
    }
    /**
     * This method shouled be called each time the currently drawn `Drawable` changes.
     * It is used by some libraries for identifying elemente on re-renders.
     *
     * @name setCurrentId
     * @method
     * @param {UID|null} uid - A UID identifying the currently drawn element(s).es.
     **/
    setCurrentId(uid) {
        // NOOP
        this.curId = uid;
    }
    /**
     * This method shouled be called each time the currently drawn `Drawable` changes.
     * Determine the class name for further usage here.
     *
     * @name setCurrentClassName
     * @method
     * @param {string|null} className - A class name for further custom use cases.
     **/
    setCurrentClassName(className) {
        // NOOP
    }
    /**
     * Draw the line between the given two points with the specified (CSS-) color.
     *
     * @method line
     * @param {Vertex} zA - The start point of the line.
     * @param {Vertex} zB - The end point of the line.
     * @param {string} color - Any valid CSS color string.
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    line(zA, zB, color) {
        const vertices = new Float32Array(6);
        vertices[0] = this._x2rel(zA.x);
        vertices[1] = this._y2rel(zA.y);
        vertices[2] = this._zindex;
        vertices[3] = this._x2rel(zB.x);
        vertices[4] = this._y2rel(zB.y);
        vertices[5] = this._zindex;
        this._zindex += 0.001;
        // Create an empty buffer object
        // const vertex_buffer = this.gl.createBuffer();
        // Bind appropriate array buffer to it
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffer);
        // Pass the vertex data to the buffer
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
        // Bind vertex buffer object
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertex_buffer);
        // Get the attribute location
        var coord = this.gl.getAttribLocation(this._program, "position");
        // Point an attribute to the currently bound VBO
        this.gl.vertexAttribPointer(coord, 3, this.gl.FLOAT, false, 0, 0);
        // Enable the attribute
        this.gl.enableVertexAttribArray(coord);
        // Unbind the buffer?
        //this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        // Set the view port
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        let uRotationVector = this.gl.getUniformLocation(this._program, "uRotationVector");
        // let radians = currentAngle * Math.PI / 180.0;
        let currentRotation = [0.0, 1.0];
        //currentRotation[0] = Math.sin(radians);
        //currentRotation[1] = Math.cos(radians);
        this.gl.uniform2fv(uRotationVector, currentRotation);
        this.gl.lineWidth(5);
        // Draw the line
        this.gl.drawArrays(this.gl.LINES, 0, vertices.length / 3);
        // POINTS, LINE_STRIP, LINE_LOOP, LINES,
        // TRIANGLE_STRIP,TRIANGLE_FAN, TRIANGLES
    }
    /**
     * Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
     *
     * @method arrow
     * @param {Vertex} zA - The start point of the arrow-line.
     * @param {Vertex} zB - The end point of the arrow-line.
     * @param {string} color - Any valid CSS color string.
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    arrow(zA, zB, color) {
        // NOT YET IMPLEMENTED
    }
    /**
     * Draw an image at the given position with the given size.<br>
     * <br>
     * Note: SVG images may have resizing issues at the moment.Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
     *
     * @method image
     * @param {Image} image - The image object to draw.
     * @param {Vertex} position - The position to draw the the upper left corner at.
     * @param {Vertex} size - The x/y-size to draw the image with.
     * @param {number=0.0} alpha - (optional, default=0.0) The transparency (0.0=opaque, 1.0=transparent).
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    image(image, position, size, alpha = 0.0) {
        // NOT YET IMPLEMENTED
    }
    /**
     * Draw an image at the given position with the given size.<br>
     * <br>
     * Note: SVG images may have resizing issues at the moment.Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
     *
     * @method texturedPoly
     * @param {Image} textureImage - The image object to draw.
     * @param {Bounds} textureSize - The texture size to use; these are the original bounds to map the polygon vertices to.
     * @param {Polygon} polygon - The polygon to use as clip path.
     * @param {Vertex} polygonPosition - The polygon's position (relative), measured at the bounding box's center.
     * @param {number} rotation - The rotation to use for the polygon (and for the texture).
     * @return {void}
     * @instance
     * @memberof drawutilsgl
     **/
    texturedPoly(textureImage, textureSize, polygon, polygonPosition, rotation) {
        // NOT YET IMPLEMENTED
    }
    // +---------------------------------------------------------------------------------
    // | This is the final helper function for drawing and filling stuff. It is not
    // | intended to be used from the outside.
    // |
    // | When in draw mode it draws the current shape.
    // | When in fill mode it fills the current shape.
    // |
    // | This function is usually only called internally.
    // |
    // | @param color A stroke/fill color to use.
    // +-------------------------------
    _fillOrDraw(color) {
        // NOT YET IMPLEMENTED
    }
    /**
     * Draw the given (cubic) bézier curve.
     *
     * @method cubicBezier
     * @param {Vertex} startPoint - The start point of the cubic Bézier curve
     * @param {Vertex} endPoint   - The end point the cubic Bézier curve.
     * @param {Vertex} startControlPoint - The start control point the cubic Bézier curve.
     * @param {Vertex} endControlPoint   - The end control point the cubic Bézier curve.
     * @param {string} color - The CSS color to draw the curve with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    cubicBezier(startPoint, endPoint, startControlPoint, endControlPoint, color, lineWidth) {
        // NOT YET IMPLEMENTED
    }
    /**
     * Draw the given (cubic) Bézier path.
     *
     * The given path must be an array with n*3+1 vertices, where n is the number of
     * curves in the path:
     * <pre> [ point1, point1_startControl, point2_endControl, point2, point2_startControl, point3_endControl, point3, ... pointN_endControl, pointN ]</pre>
     *
     * @method cubicBezierPath
     * @param {Vertex[]} path - The cubic bezier path as described above.
     * @param {string} color - The CSS colot to draw the path with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    cubicBezierPath(path, color, lineWidth) {
        // NOT YET IMPLEMENTED
    }
    /**
     * Draw the given handle and handle point (used to draw interactive Bézier curves).
     *
     * The colors for this are fixed and cannot be specified.
     *
     * @method handle
     * @param {Vertex} startPoint - The start of the handle.
     * @param {Vertex} endPoint - The end point of the handle.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    handle(startPoint, endPoint) {
        // NOT YET IMPLEMENTED
    }
    /**
     * Draw a handle line (with a light grey).
     *
     * @method handleLine
     * @param {Vertex} startPoint - The start point to draw the handle at.
     * @param {Vertex} endPoint - The end point to draw the handle at.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    handleLine(startPoint, endPoint) {
        // NOT YET IMPLEMENTED
    }
    /**
     * Draw a 1x1 dot with the specified (CSS-) color.
     *
     * @method dot
     * @param {Vertex} p - The position to draw the dot at.
     * @param {string} color - The CSS color to draw the dot with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    dot(p, color) {
        // NOT YET IMPLEMENTED
    }
    /**
     * Draw the given point with the specified (CSS-) color and radius 3.
     *
     * @method point
     * @param {Vertex} p - The position to draw the point at.
     * @param {string} color - The CSS color to draw the point with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    point(p, color) {
        // NOT YET IMPLEMENTED
    }
    /**
     * Draw a circle with the specified (CSS-) color and radius.<br>
     * <br>
     * Note that if the x- and y- scales are different the result will be an ellipse rather than a circle.
     *
     * @method circle
     * @param {Vertex} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {string} color - The CSS color to draw the circle with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    circle(center, radius, color, lineWidth) {
        // NOT YET IMPLEMENTED
    }
    /**
     * Draw a circular arc (section of a circle) with the given CSS color.
     *
     * @method circleArc
     * @param {Vertex} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {number} startAngle - The angle to start at.
     * @param {number} endAngle - The angle to end at.
     * @param {string} color - The CSS color to draw the circle with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    circleArc(center, radius, startAngle, endAngle, color, lineWidth) {
        // NOT YET IMPLEMENTED
    }
    /**
     * Draw an ellipse with the specified (CSS-) color and thw two radii.
     *
     * @method ellipse
     * @param {Vertex} center - The center of the ellipse.
     * @param {number} radiusX - The radius of the ellipse.
     * @param {number} radiusY - The radius of the ellipse.
     * @param {string} color - The CSS color to draw the ellipse with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @param {number=} rotation - (optional, default=0) The rotation of the ellipse.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    ellipse(center, radiusX, radiusY, color, lineWidth, rotation) {
        // NOT YET IMPLEMENTED
    }
    /**
     * Draw square at the given center, size and with the specified (CSS-) color.<br>
     * <br>
     * Note that if the x-scale and the y-scale are different the result will be a rectangle rather than a square.
     *
     * @method square
     * @param {XYCords} center - The center of the square.
     * @param {Vertex} size - The size of the square.
     * @param {string} color - The CSS color to draw the square with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    square(center, size, color, lineWidth) {
        // NOT YET IMPLEMENTED
    }
    /**
     * Draw a rectangle.
     *
     * @param {XYCoords} position - The upper left corner of the rectangle.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
     * @param {string} color - The color to use.
     * @param {number=1} lineWidth - (optional) The line with to use (default is 1).
     **/
    rect(position, width, height, color, lineWidth) {
        // NOT YET IMPLEMENTED
    }
    /**
     * Draw a grid of horizontal and vertical lines with the given (CSS-) color.
     *
     * @method grid
     * @param {Vertex} center - The center of the grid.
     * @param {number} width - The total width of the grid (width/2 each to the left and to the right).
     * @param {number} height - The total height of the grid (height/2 each to the top and to the bottom).
     * @param {number} sizeX - The horizontal grid size.
     * @param {number} sizeY - The vertical grid size.
     * @param {string} color - The CSS color to draw the grid with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    grid(center, width, height, sizeX, sizeY, color) {
        // NOT YET IMPLEMENTED
    }
    /**
     * Draw a raster of crosshairs in the given grid.<br>
     *
     * This works analogue to the grid() function
     *
     * @method raster
     * @param {Vertex} center - The center of the raster.
     * @param {number} width - The total width of the raster (width/2 each to the left and to the right).
     * @param {number} height - The total height of the raster (height/2 each to the top and to the bottom).
     * @param {number} sizeX - The horizontal raster size.
     * @param {number} sizeY - The vertical raster size.
     * @param {string} color - The CSS color to draw the raster with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    raster(center, width, height, sizeX, sizeY, color) {
        // NOT YET IMPLEMENTED
    }
    /**
     * Draw a diamond handle (square rotated by 45°) with the given CSS color.
     *
     * It is an inherent featur of the handle functions that the drawn elements are not scaled and not
     * distorted. So even if the user zooms in or changes the aspect ratio, the handles will be drawn
     * as even shaped diamonds.
     *
     * @method diamondHandle
     * @param {Vertex} center - The center of the diamond.
     * @param {Vertex} size - The x/y-size of the diamond.
     * @param {string} color - The CSS color to draw the diamond with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    diamondHandle(center, size, color) {
        // NOT YET IMPLEMENTED
    }
    /**
     * Draw a square handle with the given CSS color.<br>
     * <br>
     * It is an inherent featur of the handle functions that the drawn elements are not scaled and not
     * distorted. So even if the user zooms in or changes the aspect ratio, the handles will be drawn
     * as even shaped squares.
     *
     * @method squareHandle
     * @param {Vertex} center - The center of the square.
     * @param {Vertex} size - The x/y-size of the square.
     * @param {string} color - The CSS color to draw the square with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    squareHandle(center, size, color) {
        // NOT YET IMPLEMENTED
    }
    /**
     * Draw a circle handle with the given CSS color.<br>
     * <br>
     * It is an inherent featur of the handle functions that the drawn elements are not scaled and not
     * distorted. So even if the user zooms in or changes the aspect ratio, the handles will be drawn
     * as even shaped circles.
     *
     * @method circleHandle
     * @param {Vertex} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {string} color - The CSS color to draw the circle with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    circleHandle(center, size, color) {
        // NOT YET IMPLEMENTED
    }
    /**
     * Draw a crosshair with given radius and color at the given position.<br>
     * <br>
     * Note that the crosshair radius will not be affected by scaling.
     *
     * @method crosshair
     * @param {XYCoords} center - The center of the crosshair.
     * @param {number} radius - The radius of the crosshair.
     * @param {string} color - The CSS color to draw the crosshair with.
     * @param {number=0.5} lineWidth - (optional, default=0.5) The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    crosshair(center, radius, color, lineWidth) {
        // NOT YET IMPLEMENTED
    }
    /**
     * Draw a cross with diagonal axes with given radius, color and lineWidth at the given position.<br>
     * <br>
     * Note that the x's radius will not be affected by scaling.
     *
     * @method crosshair
     * @param {XYCoords} center - The center of the crosshair.
     * @param {number} radius - The radius of the crosshair.
     * @param {string} color - The CSS color to draw the crosshair with.
     * @param {number=1} lineWidth - (optional, default=1.0) The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    cross(center, radius, color, lineWidth) {
        // NOT YET IMPLEMENTED
    }
    /**
     * Draw a polygon.
     *
     * @method polygon
     * @param {Polygon} polygon - The polygon to draw.
     * @param {string} color - The CSS color to draw the polygon with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    polygon(polygon, color, lineWidth) {
        const vertices = new Float32Array(polygon.vertices.length * 3);
        for (var i = 0; i < polygon.vertices.length; i++) {
            vertices[i * 3 + 0] = this._x2rel(polygon.vertices[i].x);
            vertices[i * 3 + 1] = this._y2rel(polygon.vertices[i].y);
            vertices[i * 3 + 2] = this._zindex;
        }
        this._zindex += 0.001;
        //console.log( vertices );
        // Create an empty buffer object
        // const vertex_buffer = this.gl.createBuffer();
        // Bind appropriate array buffer to it
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffer);
        // Pass the vertex data to the buffer
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
        // Bind vertex buffer object
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertex_buffer);
        // Get the attribute location
        var coord = this.gl.getAttribLocation(this._program, "position");
        // Point an attribute to the currently bound VBO
        this.gl.vertexAttribPointer(coord, 3, this.gl.FLOAT, false, 0, 0);
        // Enable the attribute
        this.gl.enableVertexAttribArray(coord);
        // Unbind the buffer?
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        // Set the view port
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        let uRotationVector = this.gl.getUniformLocation(this._program, "uRotationVector");
        // let radians = currentAngle * Math.PI / 180.0;
        let currentRotation = [0.0, 1.0];
        //currentRotation[0] = Math.sin(radians);
        //currentRotation[1] = Math.cos(radians);
        this.gl.uniform2fv(uRotationVector, currentRotation);
        // Draw the polygon
        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, vertices.length / 3);
        // POINTS, LINE_STRIP, LINE_LOOP, LINES,
        // TRIANGLE_STRIP,TRIANGLE_FAN, TRIANGLES
    }
    /**
     * Draw a polygon line (alternative function to the polygon).
     *
     * @method polyline
     * @param {Vertex[]} vertices - The polygon vertices to draw.
     * @param {boolan}   isOpen   - If true the polyline will not be closed at its end.
     * @param {string}   color    - The CSS color to draw the polygon with.
     * @param {number=}  lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    polyline(vertices, isOpen, color, lineWidth) {
        // NOT YET IMPLEMENTED
    }
    /**
     * Draw a text at the given relative position.
     *
     * @method text
     * @param {string} text - The text to draw.
     * @param {number} x - The x-position to draw the text at.
     * @param {number} y - The y-position to draw the text at.
     * @param {string=} options.color - The Color to use.
     * @param {string=} options.fontFamily - The font family to use.
     * @param {number=} options.fontSize - The font size (in pixels) to use.
     * @param {FontStyle=} options.fontStyle - The font style to use.
     * @param {FontWeight=} options.fontWeight - The font weight to use.
     * @param {number=} options.lineHeight - The line height (in pixels) to use.
     * @param {number=} options.rotation - The (optional) rotation in radians.
     * @param {string=} options.textAlign - The text align to use. According to the specifiactions (https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textAlign) valid values are `"left" || "right" || "center" || "start" || "end"`.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    text(text, x, y, options) {
        // NOT YET IMPLEMENTED
    }
    /**
     * Draw a non-scaling text label at the given position.
     *
     * @method label
     * @param {string} text - The text to draw.
     * @param {number} x - The x-position to draw the text at.
     * @param {number} y - The y-position to draw the text at.
     * @param {number=} rotation - The (aoptional) rotation in radians.
     * @param {string="black"} color - The color to use (default is black).
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    label(text, x, y, rotation, color) {
        // NOT YET IMPLEMENTED
    }
    /**
     * Draw an SVG-like path given by the specified path data.
     *
     * @method path
     * @param {SVGPathData} pathData - An array of path commands and params.
     * @param {string=null} color - (optional) The color to draw this path with (default is null).
     * @param {number=1} lineWidth - (optional) the line width to use (default is 1).
     * @param {boolean=false} options.inplace - (optional) If set to true then path transforamtions (scale and translate) will be done in-place in the array. This can boost the performance.
     * @instance
     * @memberof drawutils
     * @return {R} An instance representing the drawn path.
     */
    path(pathData, color, lineWidth, options) {
        // NOT YET IMPLEMENTED
    }
    /**
     * Due to gl compatibility there is a generic 'clear' function required
     * to avoid accessing the context object itself directly.
     *
     * This function just fills the whole canvas with a single color.
     *
     * @param {string} color - The color to clear with.
     **/
    clear(color) {
        // NOT YET IMPLEMENTED
        // if( typeof color == 'string' )
        // color = Color.parse(color); // Color class does not yet exist in TS
        // Clear the canvas
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        // Enable the depth test
        this.gl.enable(this.gl.DEPTH_TEST);
        // Clear the color and depth buffer
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
}
// Vertex shader source code
drawutilsgl.vertCode = `
    precision mediump float;

    attribute vec3 position;

    uniform vec2 uRotationVector;

    void main(void) {
	vec2 rotatedPosition = vec2(
	    position.x * uRotationVector.y +
		position.y * uRotationVector.x,
	    position.y * uRotationVector.y -
		position.x * uRotationVector.x
	);

	gl_Position = vec4(rotatedPosition, position.z, 1.0);
    }`;
// Fragment shader source code
drawutilsgl.fragCode = `
    precision highp float;

    void main(void) {
	gl_FragColor = vec4(0.0,0.75,1.0,1.0);
    }`;
/**
 * Some GL helper utils.
 **/
class GLU {
    constructor(gl) {
        this.gl = gl;
    }
    bufferData(verts) {
        // Create an empty buffer object
        var vbuffer = this.gl.createBuffer();
        // Bind appropriate array buffer to it
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbuffer);
        // Pass the vertex data to the buffer
        this.gl.bufferData(this.gl.ARRAY_BUFFER, verts, this.gl.STATIC_DRAW);
        // Unbind the buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        return vbuffer;
    }
    /*=================== Shaders ====================*/
    compileShader(shaderCode, shaderType) {
        // Create a vertex shader object
        var shader = this.gl.createShader(shaderType);
        // Attach vertex shader source code
        this.gl.shaderSource(shader, shaderCode);
        // Compile the vertex shader
        this.gl.compileShader(shader);
        const vertStatus = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (!vertStatus) {
            console.warn("Error in shader:" + this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
    makeProgram(vertShader, fragShader) {
        // Create a shader program object to store
        // the combined shader program
        var program = this.gl.createProgram();
        // Attach a vertex shader
        this.gl.attachShader(program, vertShader);
        // Attach a fragment shader
        this.gl.attachShader(program, fragShader);
        // Link both the programs
        this.gl.linkProgram(program);
        // Use the combined shader program object
        this.gl.useProgram(program);
        /*======= Do some cleanup ======*/
        this.gl.detachShader(program, vertShader);
        this.gl.detachShader(program, fragShader);
        this.gl.deleteShader(vertShader);
        this.gl.deleteShader(fragShader);
        return program;
    }
}
//# sourceMappingURL=drawgl.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/drawutilssvg.js":
/*!**************************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/drawutilssvg.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   drawutilssvg: () => (/* binding */ drawutilssvg)
/* harmony export */ });
/* harmony import */ var _CircleSector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CircleSector */ "./node_modules/plotboilerplate/src/esm/CircleSector.js");
/* harmony import */ var _CubicBezierCurve__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CubicBezierCurve */ "./node_modules/plotboilerplate/src/esm/CubicBezierCurve.js");
/* harmony import */ var _Vertex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Vertex */ "./node_modules/plotboilerplate/src/esm/Vertex.js");
/* harmony import */ var _UIDGenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./UIDGenerator */ "./node_modules/plotboilerplate/src/esm/UIDGenerator.js");
/**
 * Draws elements into an SVG node.
 *
 * Note that this library uses buffers and draw cycles. To draw onto an SVG canvas, do this:
 *   const drawLib = new drawutilssvg( svgNode, ... );
 *   const fillLib = drawLib.copyInstance(true);
 *   // Begin draw cycle
 *   drawLib.beginDrawCycle(time);
 *   // ... draw or fill your stuff ...
 *   drawLib.endDrawCycle(time); // Here the elements become visible
 *
 * @author   Ikaros Kappler
 * @date     2021-01-03
 * @modified 2021-01-24 Fixed the `fillShapes` attribute in the copyInstance function.
 * @modified 2021-01-26 Changed the `isPrimary` (default true) attribute to `isSecondary` (default false).
 * @modified 2021-02-03 Added the static `createSvg` function.
 * @modified 2021-02-03 Fixed the currentId='background' bug on the clear() function.
 * @modified 2021-02-03 Fixed CSSProperty `stroke-width` (was line-width before, which is wrong).
 * @modified 2021-02-03 Added the static `HEAD_XML` attribute.
 * @modified 2021-02-19 Added the static helper function `transformPathData(...)` for svg path transformations (scale and translate).
 * @modified 2021-02-22 Added the static helper function `copyPathData(...)`.
 * @modified 2021-02-22 Added the `path` drawing function to draw SVG path data.
 * @modified 2021-03-01 Fixed a bug in the `clear` function (curClassName was not cleared).
 * @modified 2021-03-29 Fixed a bug in the `text` function (second y param was wrong, used x here).
 * @modified 2021-03-29 Moved this file from `src/ts/utils/helpers/` to `src/ts/`.
 * @modified 2021-03-31 Added 'ellipseSector' the the class names.
 * @modified 2021-03-31 Implemented buffering using a buffer <g> node and the beginDrawCycle and endDrawCycle methods.
 * @modified 2021-05-31 Added the `setConfiguration` function from `DrawLib`.
 * @modified 2021-11-15 Adding more parameters tot the `text()` function: fontSize, textAlign, fontFamily, lineHeight.
 * @modified 2021-11-19 Fixing the `label(text,x,y)` position.
 * @modified 2021-11-19 Added the `color` param to the `label(...)` function.
 * @modified 2022-02-03 Added the `lineWidth` param to the `crosshair` function.
 * @modified 2022-02-03 Added the `cross(...)` function.
 * @modified 2022-03-26 Added the private `nodeDefs` and `bufferedNodeDefs` attributes.
 * @modified 2022-03-26 Added the `texturedPoly` function to draw textures polygons.
 * @modified 2022-07-26 Adding `alpha` to the `image(...)` function.
 * @modified 2022-11-10 Tweaking some type issues.
 * @modified 2023-02-04 Fixed a typo in the CSS classname for cubic Bézier paths: cubicBezier (was cubierBezier).
 * @modified 2023-02-10 The methods `setCurrentClassName` and `setCurrentId` also accept `null` now.
 * @version  1.6.4
 **/




const RAD_TO_DEG = 180 / Math.PI;
/**
 * @classdesc A helper class for basic SVG drawing operations. This class should
 * be compatible to the default 'draw' class.
 *
 * @requires CubicBzierCurvce
 * @requires Polygon
 * @requires Vertex
 * @requires XYCoords
 */
class drawutilssvg {
    /**
     * The constructor.
     *
     * @constructor
     * @name drawutilssvg
     * @param {SVGElement} svgNode - The SVG node to use.
     * @param {XYCoords} offset - The draw offset to use.
     * @param {XYCoords} scale - The scale factors to use.
     * @param {XYDimension} canvasSize - The initial canvas size (use setSize to change).
     * @param {boolean} fillShapes - Indicates if the constructed drawutils should fill all drawn shapes (if possible).
     * @param {DrawConfig} drawConfig - The default draw config to use for CSS fallback styles.
     * @param {boolean=} isSecondary - (optional) Indicates if this is the primary or secondary instance. Only primary instances manage child nodes.
     * @param {SVGGElement=} gNode - (optional) Primary and seconday instances share the same &lt;g> node.
     **/
    constructor(svgNode, offset, scale, canvasSize, fillShapes, drawConfig, isSecondary, gNode, bufferGNode, nodeDefs, bufferNodeDefs) {
        this.svgNode = svgNode;
        this.offset = new _Vertex__WEBPACK_IMPORTED_MODULE_2__.Vertex(0, 0).set(offset);
        this.scale = new _Vertex__WEBPACK_IMPORTED_MODULE_2__.Vertex(1, 1).set(scale);
        this.fillShapes = fillShapes;
        this.isSecondary = Boolean(isSecondary);
        this.drawlibConfiguration = {};
        this.cache = new Map();
        this.setSize(canvasSize);
        if (isSecondary) {
            this.gNode = gNode;
            this.bufferGNode = bufferGNode;
            this.nodeDefs = nodeDefs;
            this.bufferedNodeDefs = bufferNodeDefs;
        }
        else {
            this.addStyleDefs(drawConfig);
            this.addDefsNode();
            this.gNode = this.createSVGNode("g");
            this.bufferGNode = this.createSVGNode("g");
            this.svgNode.appendChild(this.gNode);
        }
    }
    /**
     * Adds a default style defintion based on the passed DrawConfig.
     * Twaek the draw config to change default colors or line thicknesses.
     *
     * @param {DrawConfig} drawConfig
     */
    addStyleDefs(drawConfig) {
        this.nodeStyle = this.createSVGNode("style");
        this.svgNode.appendChild(this.nodeStyle);
        // Which default styles to add? -> All from the DrawConfig.
        // Compare with DrawConfig interface
        const keys = {
            // "bezier": "CubicBezierCurve", // TODO: is this correct?
            "bezierPath": "BezierPath",
            "polygon": "Polygon",
            "triangle": "Triangle",
            "ellipse": "Ellipse",
            "ellipseSector": "EllipseSector",
            "circle": "Circle",
            "circleSector": "CircleSector",
            "vertex": "Vertex",
            "line": "Line",
            "vector": "Vector",
            "image": "Image",
            "text": "Text"
        };
        // Question: why isn't this working if the svgNode is created dynamically? (nodeStyle.sheet is null)
        const rules = [];
        for (var k in keys) {
            const className = keys[k];
            const drawSettings = drawConfig[k];
            if (drawSettings) {
                rules.push(`.${className} { fill : none; stroke: ${drawSettings.color}; stroke-width: ${drawSettings.lineWidth}px }`);
            }
            else {
                console.warn(`Warning: your draw config is missing the key '${k}' which is required.`);
            }
        }
        this.nodeStyle.innerHTML = rules.join("\n");
    }
    /**
     * Adds the internal <defs> node.
     */
    addDefsNode() {
        this.nodeDefs = this.createSVGNode("defs");
        // this.svgNode.appendChild(this.nodeDefs);
        this.bufferedNodeDefs = this.createSVGNode("defs");
        this.svgNode.appendChild(this.nodeDefs);
    }
    /**
     * This is a simple way to include custom CSS class mappings to the style defs of the generated SVG.
     *
     * The mapping should be of the form
     *   [style-class] -> [style-def-string]
     *
     * Example:
     *   "rect.red" -> "fill: #ff0000; border: 1px solid red"
     *
     * @param {Map<string,string>} defs
     */
    addCustomStyleDefs(defs) {
        const buffer = [];
        defs.forEach((value, key) => {
            buffer.push(key + " { " + value + " }");
        });
        this.nodeStyle.innerHTML += "\n/* Custom styles */\n" + buffer.join("\n");
    }
    /**
     * Retieve an old (cached) element.
     * Only if both – key and nodeName – match, the element will be returned (null otherwise).
     *
     * @method findElement
     * @private
     * @memberof drawutilssvg
     * @instance
     * @param {UID} key - The key of the desired element (used when re-drawing).
     * @param {string} nodeName - The expected node name.
     */
    findElement(key, nodeName) {
        if (!key) {
            return null;
        }
        var node = this.cache.get(key);
        if (node && node.nodeName.toUpperCase() === nodeName.toUpperCase()) {
            this.cache.delete(key);
            return node;
        }
        return null;
    }
    /**
     * Create a new DOM node &lt;svg&gt; in the SVG namespace.
     *
     * @method createSVGNode
     * @private
     * @memberof drawutilssvg
     * @instance
     * @param {string} nodeName - The node name (tag-name).
     * @return {SVGElement} A new element in the SVG namespace with the given node name.
     */
    createSVGNode(nodeName) {
        return document.createElementNS("http://www.w3.org/2000/svg", nodeName);
    }
    /**
     * Make a new SVG node (or recycle an old one) with the given node name (circle, path, line, rect, ...).
     *
     * This function is used in draw cycles to re-use old DOM nodes (in hope to boost performance).
     *
     * @method makeNode
     * @private
     * @instance
     * @memberof drawutilssvg
     * @param {string} nodeName - The node name.
     * @return {SVGElement} The new node, which is not yet added to any document.
     */
    makeNode(nodeName) {
        // Try to find node in current DOM cache.
        // Unique node keys are strictly necessary.
        // Try to recycle an old element from cache.
        var node = this.findElement(this.curId, nodeName);
        if (!node) {
            // If no such old elements exists (key not found, tag name not matching),
            // then create a new one.
            node = this.createSVGNode(nodeName);
        }
        if (this.drawlibConfiguration.blendMode) {
            node.style["mix-blend-mode"] = this.drawlibConfiguration.blendMode;
        }
        return node;
    }
    /**
     * This is the final helper function for drawing and filling stuff and binding new
     * nodes to the SVG document.
     * It is not intended to be used from the outside.
     *
     * When in draw mode it draws the current shape.
     * When in fill mode it fills the current shape.
     *
     * This function is usually only called internally.
     *
     * @method _bindFillDraw
     * @private
     * @instance
     * @memberof drawutilssvg
     * @param {SVGElement} node - The node to draw/fill and bind.
     * @param {string} className - The class name(s) to use.
     * @param {string} color - A stroke/fill color to use.
     * @param {number=1} lineWidth - (optional) A line width to use for drawing (default is 1).
     * @return {SVGElement} The node itself (for chaining).
     */
    _bindFillDraw(node, className, color, lineWidth) {
        if (this.curClassName) {
            node.setAttribute("class", `${className} ${this.curClassName}`);
        }
        else {
            node.setAttribute("class", className);
        }
        node.setAttribute("fill", this.fillShapes && color ? color : "none");
        node.setAttribute("stroke", this.fillShapes ? "none" : color || "none");
        node.setAttribute("stroke-width", `${lineWidth || 1}`);
        if (this.curId) {
            node.setAttribute("id", `${this.curId}`); // Maybe React-style 'key' would be better?
        }
        if (!node.parentNode) {
            // Attach to DOM only if not already attached
            this.bufferGNode.appendChild(node);
        }
        return node;
    }
    /**
     * Sets the size and view box of the document. Call this if canvas size changes.
     *
     * @method setSize
     * @instance
     * @memberof drawutilssvg
     * @param {XYDimension} canvasSize - The new canvas size.
     */
    setSize(canvasSize) {
        this.canvasSize = canvasSize;
        this.svgNode.setAttribute("viewBox", `0 0 ${this.canvasSize.width} ${this.canvasSize.height}`);
        this.svgNode.setAttribute("width", `${this.canvasSize.width}`);
        this.svgNode.setAttribute("height", `${this.canvasSize.height}`);
    }
    /**
     * Creates a 'shallow' (non deep) copy of this instance. This implies
     * that under the hood the same gl context and gl program will be used.
     */
    copyInstance(fillShapes) {
        var copy = new drawutilssvg(this.svgNode, this.offset, this.scale, this.canvasSize, fillShapes, null, // no DrawConfig
        true, // isSecondary
        this.gNode, this.bufferGNode, this.nodeDefs, this.bufferedNodeDefs);
        return copy;
    }
    /**
     * Set the current drawlib configuration.
     *
     * @name setConfiguration
     * @method
     * @param {DrawLibConfiguration} configuration - The new configuration settings to use for the next render methods.
     */
    setConfiguration(configuration) {
        this.drawlibConfiguration = configuration;
    }
    /**
     * This method shouled be called each time the currently drawn `Drawable` changes.
     * It is used by some libraries for identifying elemente on re-renders.
     *
     * @name setCurrentId
     * @method
     * @param {UID|null} uid - A UID identifying the currently drawn element(s).
     * @instance
     * @memberof drawutilssvg
     **/
    setCurrentId(uid) {
        this.curId = uid;
    }
    /**
     * This method shouled be called each time the currently drawn `Drawable` changes.
     * Determine the class name for further usage here.
     *
     * @name setCurrentClassName
     * @method
     * @param {string|null} className - A class name for further custom use cases.
     * @instance
     * @memberof drawutilssvg
     **/
    setCurrentClassName(className) {
        this.curClassName = className;
    }
    /**
     * Called before each draw cycle.
     * This is required for compatibility with other draw classes in the library.
     *
     * @name beginDrawCycle
     * @method
     * @param {UID=} uid - (optional) A UID identifying the currently drawn element(s).
     * @instance
     * @memberof drawutilssvg
     **/
    beginDrawCycle(renderTime) {
        // Clear non-recycable elements from last draw cycle.
        this.cache.clear();
        // Clearing an SVG is equivalent to removing all its child elements.
        for (var i = 0; i < this.bufferGNode.childNodes.length; i++) {
            // Hide all nodes here. Don't throw them away.
            // We can probably re-use them in the next draw cycle.
            var child = this.bufferGNode.childNodes[i];
            this.cache.set(child.getAttribute("id"), child);
        }
        this.removeAllChildNodes();
    }
    /**
     * Called after each draw cycle.
     *
     * This is required for compatibility with other draw classes in the library (like drawgl).
     *
     * @name endDrawCycle
     * @method
     * @param {number} renderTime
     * @instance
     **/
    endDrawCycle(renderTime) {
        if (!this.isSecondary) {
            // All elements are drawn into the buffer; they are NOT yet visible, not did the browser perform any
            // layout updates.
            // Replace the old <g>-node with the buffer node.
            //   https://stackoverflow.com/questions/27442464/how-to-update-a-svg-image-without-seeing-a-blinking
            this.svgNode.replaceChild(this.bufferedNodeDefs, this.nodeDefs);
            this.svgNode.replaceChild(this.bufferGNode, this.gNode);
        }
        const tmpGNode = this.gNode;
        this.gNode = this.bufferGNode;
        this.bufferGNode = tmpGNode;
        const tmpDefsNode = this.nodeDefs;
        this.nodeDefs = this.bufferedNodeDefs;
        this.bufferedNodeDefs = tmpDefsNode;
    }
    _x(x) {
        return this.offset.x + this.scale.x * x;
    }
    _y(y) {
        return this.offset.y + this.scale.y * y;
    }
    /**
     * Draw the line between the given two points with the specified (CSS-) color.
     *
     * @method line
     * @param {Vertex} zA - The start point of the line.
     * @param {Vertex} zB - The end point of the line.
     * @param {string} color - Any valid CSS color string.
     * @param {number=1} lineWidth? - [optional] The line's width.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     **/
    line(zA, zB, color, lineWidth) {
        const line = this.makeNode("line");
        line.setAttribute("x1", `${this._x(zA.x)}`);
        line.setAttribute("y1", `${this._y(zA.y)}`);
        line.setAttribute("x2", `${this._x(zB.x)}`);
        line.setAttribute("y2", `${this._y(zB.y)}`);
        return this._bindFillDraw(line, "line", color, lineWidth || 1);
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
     * @memberof drawutilssvg
     **/
    arrow(zA, zB, color, lineWidth) {
        const node = this.makeNode("path");
        var headlen = 8; // length of head in pixels
        var vertices = _Vertex__WEBPACK_IMPORTED_MODULE_2__.Vertex.utils.buildArrowHead(zA, zB, headlen, this.scale.x, this.scale.y);
        const d = ["M", this._x(zA.x), this._y(zA.y)];
        for (var i = 0; i <= vertices.length; i++) {
            d.push("L");
            // Note: only use offset here (the vertices are already scaled)
            d.push(this.offset.x + vertices[i % vertices.length].x);
            d.push(this.offset.y + vertices[i % vertices.length].y);
        }
        node.setAttribute("d", d.join(" "));
        return this._bindFillDraw(node, "arrow", color, lineWidth || 1);
    }
    /**
     * Draw an image at the given position with the given size.<br>
     * <br>
     * Note: SVG images may have resizing issues at the moment.Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
     *
     * @method image
     * @param {Image} image - The image object to draw.
     * @param {Vertex} position - The position to draw the the upper left corner at.
     * @param {Vertex} size - The x/y-size to draw the image with.
     * @param {number=0.0} alpha - (optional, default=0.0) The transparency (1.0=opaque, 0.0=transparent).
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     **/
    image(image, position, size, alpha = 1.0) {
        const node = this.makeNode("image");
        // We need to re-adjust the image if it was not yet fully loaded before.
        const setImageSize = (image) => {
            if (image.naturalWidth) {
                const ratioX = size.x / image.naturalWidth;
                const ratioY = size.y / image.naturalHeight;
                node.setAttribute("width", `${image.naturalWidth * this.scale.x}`);
                node.setAttribute("height", `${image.naturalHeight * this.scale.y}`);
                node.setAttribute("display", null); // Dislay when loaded
                // if (alpha) {
                node.setAttribute("opacity", `${alpha}`);
                // }
                node.setAttribute("transform", `translate(${this._x(position.x)} ${this._y(position.y)}) scale(${ratioX} ${ratioY})`);
            }
        };
        image.addEventListener("load", event => {
            setImageSize(image);
        });
        // Safari has a transform-origin bug.
        // Use x=0, y=0 and translate/scale instead (see above)
        node.setAttribute("x", `${0}`);
        node.setAttribute("y", `${0}`);
        node.setAttribute("display", "none"); // Hide before loaded
        setImageSize(image);
        node.setAttribute("href", image.src);
        return this._bindFillDraw(node, "image", null, null);
    }
    /**
     * Draw an image at the given position with the given size.<br>
     * <br>
     * Note: SVG images may have resizing issues at the moment.Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
     *
     * @method texturedPoly
     * @param {Image} textureImage - The image object to draw.
     * @param {Bounds} textureSize - The texture size to use; these are the original bounds to map the polygon vertices to.
     * @param {Polygon} polygon - The polygon to use as clip path.
     * @param {Vertex} polygonPosition - The polygon's position (relative), measured at the bounding box's center.
     * @param {number} rotation - The rotation to use for the polygon (and for the texture).
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     **/
    texturedPoly(textureImage, textureSize, polygon, polygonPosition, rotation) {
        const basePolygonBounds = polygon.getBounds();
        const rotatedScalingOrigin = new _Vertex__WEBPACK_IMPORTED_MODULE_2__.Vertex(textureSize.min).clone().rotate(rotation, polygonPosition);
        const rotationCenter = polygonPosition.clone().add(rotatedScalingOrigin.difference(textureSize.min).inv());
        // Create something like this
        // ...
        //    <defs>
        //       <clipPath id="shape">
        //         <path fill="none" d="..."/>
        //       </clipPath>
        //    </defs>
        //    ...
        //    <g clip-path="url(#shape)">
        //       <g transform="scale(...)">
        //          <image width="643" height="643" transform="rotate(...)" xlink:href="https://s3-us-west-2.amazonaws.com/s.cdpn.io/222579/beagle400.jpg" >
        //       </g>
        //    </g>
        //    </image>
        // ...
        const clipPathNode = this.makeNode("clipPath");
        const clipPathId = `clippath_${_UIDGenerator__WEBPACK_IMPORTED_MODULE_3__.UIDGenerator.next()}`; // TODO: use a better UUID generator here?
        clipPathNode.setAttribute("id", clipPathId);
        const gNode = this.makeNode("g");
        const imageNode = this.makeNode("image");
        imageNode.setAttribute("x", `${this._x(rotatedScalingOrigin.x)}`);
        imageNode.setAttribute("y", `${this._y(rotatedScalingOrigin.y)}`);
        imageNode.setAttribute("width", `${textureSize.width}`);
        imageNode.setAttribute("height", `${textureSize.height}`);
        imageNode.setAttribute("href", textureImage.src);
        // imageNode.setAttribute("opacity", "0.5");
        // SVG rotations in degrees
        imageNode.setAttribute("transform", `rotate(${rotation * RAD_TO_DEG}, ${this._x(rotatedScalingOrigin.x)}, ${this._y(rotatedScalingOrigin.y)})`);
        const pathNode = this.makeNode("path");
        const pathData = [];
        if (polygon.vertices.length > 0) {
            const self = this;
            pathData.push("M", `${this._x(polygon.vertices[0].x)}`, `${this._y(polygon.vertices[0].y)}`);
            for (var i = 1; i < polygon.vertices.length; i++) {
                pathData.push("L", `${this._x(polygon.vertices[i].x)}`, `${this._y(polygon.vertices[i].y)}`);
            }
        }
        pathNode.setAttribute("d", pathData.join(" "));
        clipPathNode.appendChild(pathNode);
        this.bufferedNodeDefs.appendChild(clipPathNode);
        gNode.appendChild(imageNode);
        gNode.setAttribute("transform-origin", `${this._x(rotatedScalingOrigin.x)} ${this._y(rotatedScalingOrigin.y)}`);
        gNode.setAttribute("transform", `scale(${this.scale.x}, ${this.scale.y})`);
        const clipNode = this.makeNode("g");
        clipNode.appendChild(gNode);
        clipNode.setAttribute("clip-path", `url(#${clipPathId})`);
        // TODO: check if the image class is correct here or if we should use a 'clippedImage' class here
        this._bindFillDraw(clipNode, "image", null, null); // No color, no lineWidth
        return clipNode;
    }
    /**
     * Draw the given (cubic) bézier curve.
     *
     * @method cubicBezier
     * @param {Vertex} startPoint - The start point of the cubic Bézier curve
     * @param {Vertex} endPoint   - The end point the cubic Bézier curve.
     * @param {Vertex} startControlPoint - The start control point the cubic Bézier curve.
     * @param {Vertex} endControlPoint   - The end control point the cubic Bézier curve.
     * @param {string} color - The CSS color to draw the curve with.
     * @param {number} lineWidth - (optional) The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    cubicBezier(startPoint, endPoint, startControlPoint, endControlPoint, color, lineWidth) {
        if (startPoint instanceof _CubicBezierCurve__WEBPACK_IMPORTED_MODULE_1__.CubicBezierCurve) {
            return this.cubicBezier(startPoint.startPoint, startPoint.endPoint, startPoint.startControlPoint, startPoint.endControlPoint, color, lineWidth);
        }
        const node = this.makeNode("path");
        // Draw curve
        const d = [
            "M",
            this._x(startPoint.x),
            this._y(startPoint.y),
            "C",
            this._x(startControlPoint.x),
            this._y(startControlPoint.y),
            this._x(endControlPoint.x),
            this._y(endControlPoint.y),
            this._x(endPoint.x),
            this._y(endPoint.y)
        ];
        node.setAttribute("d", d.join(" "));
        return this._bindFillDraw(node, "cubicBezier", color, lineWidth);
    }
    /**
     * Draw the given (cubic) Bézier path.
     *
     * The given path must be an array with n*3+1 vertices, where n is the number of
     * curves in the path:
     * <pre> [ point1, point1_startControl, point2_endControl, point2, point2_startControl, point3_endControl, point3, ... pointN_endControl, pointN ]</pre>
     *
     * @method cubicBezierPath
     * @param {Vertex[]} path - The cubic bezier path as described above.
     * @param {string} color - The CSS colot to draw the path with.
     * @param {number=1} lineWidth - (optional) The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    cubicBezierPath(path, color, lineWidth) {
        const node = this.makeNode("path");
        if (!path || path.length == 0)
            return node;
        // Draw curve
        const d = ["M", this._x(path[0].x), this._y(path[0].y)];
        // Draw curve path
        var endPoint;
        var startControlPoint;
        var endControlPoint;
        for (var i = 1; i < path.length; i += 3) {
            startControlPoint = path[i];
            endControlPoint = path[i + 1];
            endPoint = path[i + 2];
            d.push("C", this._x(startControlPoint.x), this._y(startControlPoint.y), this._x(endControlPoint.x), this._y(endControlPoint.y), this._x(endPoint.x), this._y(endPoint.y));
        }
        node.setAttribute("d", d.join(" "));
        return this._bindFillDraw(node, "cubicBezierPath", color, lineWidth || 1);
    }
    /**
     * Draw the given handle and handle point (used to draw interactive Bézier curves).
     *
     * The colors for this are fixed and cannot be specified.
     *
     * @method handle
     * @param {Vertex} startPoint - The start of the handle.
     * @param {Vertex} endPoint - The end point of the handle.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    handle(startPoint, endPoint) {
        // TODO: redefine methods like these into an abstract class?
        this.point(startPoint, "rgb(0,32,192)");
        this.square(endPoint, 5, "rgba(0,128,192,0.5)");
    }
    /**
     * Draw a handle line (with a light grey).
     *
     * @method handleLine
     * @param {Vertex} startPoint - The start point to draw the handle at.
     * @param {Vertex} endPoint - The end point to draw the handle at.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    handleLine(startPoint, endPoint) {
        this.line(startPoint, endPoint, "rgb(192,192,192)");
    }
    /**
     * Draw a 1x1 dot with the specified (CSS-) color.
     *
     * @method dot
     * @param {Vertex} p - The position to draw the dot at.
     * @param {string} color - The CSS color to draw the dot with.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    dot(p, color) {
        const node = this.makeNode("line");
        return this._bindFillDraw(node, "dot", color, 1);
    }
    /**
     * Draw the given point with the specified (CSS-) color and radius 3.
     *
     * @method point
     * @param {Vertex} p - The position to draw the point at.
     * @param {string} color - The CSS color to draw the point with.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    point(p, color) {
        var radius = 3;
        const node = this.makeNode("circle");
        node.setAttribute("cx", `${this._x(p.x)}`);
        node.setAttribute("cy", `${this._y(p.y)}`);
        node.setAttribute("r", `${radius}`);
        return this._bindFillDraw(node, "point", color, 1);
    }
    /**
     * Draw a circle with the specified (CSS-) color and radius.<br>
     * <br>
     * Note that if the x- and y- scales are different the result will be an ellipse rather than a circle.
     *
     * @method circle
     * @param {Vertex} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {string} color - The CSS color to draw the circle with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    circle(center, radius, color, lineWidth) {
        // Todo: draw ellipse when scalex!=scaley
        const node = this.makeNode("circle");
        node.setAttribute("cx", `${this._x(center.x)}`);
        node.setAttribute("cy", `${this._y(center.y)}`);
        node.setAttribute("r", `${radius * this.scale.x}`); // y?
        return this._bindFillDraw(node, "circle", color, lineWidth || 1);
    }
    /**
     * Draw a circular arc (section of a circle) with the given CSS color.
     *
     * @method circleArc
     * @param {Vertex} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {number} startAngle - The angle to start at.
     * @param {number} endAngle - The angle to end at.
     * @param {string} color - The CSS color to draw the circle with.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    circleArc(center, radius, startAngle, endAngle, color, lineWidth) {
        const node = this.makeNode("path");
        const arcData = _CircleSector__WEBPACK_IMPORTED_MODULE_0__.CircleSector.circleSectorUtils.describeSVGArc(this._x(center.x), this._y(center.y), radius * this.scale.x, // y?
        startAngle, endAngle);
        node.setAttribute("d", arcData.join(" "));
        return this._bindFillDraw(node, "circleArc", color, lineWidth || 1);
    }
    /**
     * Draw an ellipse with the specified (CSS-) color and thw two radii.
     *
     * @method ellipse
     * @param {Vertex} center - The center of the ellipse.
     * @param {number} radiusX - The radius of the ellipse.
     * @param {number} radiusY - The radius of the ellipse.
     * @param {string} color - The CSS color to draw the ellipse with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @param {number=} rotation - (optional, default=0) The rotation of the ellipse.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    ellipse(center, radiusX, radiusY, color, lineWidth, rotation) {
        if (typeof rotation === "undefined") {
            rotation = 0.0;
        }
        const node = this.makeNode("ellipse");
        node.setAttribute("cx", `${this._x(center.x)}`);
        node.setAttribute("cy", `${this._y(center.y)}`);
        node.setAttribute("rx", `${radiusX * this.scale.x}`);
        node.setAttribute("ry", `${radiusY * this.scale.y}`);
        // node.setAttribute( 'style', `transform: rotate(${rotation} ${center.x} ${center.y})` );
        node.setAttribute("transform", `rotate(${(rotation * 180) / Math.PI} ${this._x(center.x)} ${this._y(center.y)})`);
        return this._bindFillDraw(node, "ellipse", color, lineWidth || 1);
    }
    /**
     * Draw square at the given center, size and with the specified (CSS-) color.<br>
     * <br>
     * Note that if the x-scale and the y-scale are different the result will be a rectangle rather than a square.
     *
     * @method square
     * @param {XYCoords} center - The center of the square.
     * @param {Vertex} size - The size of the square.
     * @param {string} color - The CSS color to draw the square with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    square(center, size, color, lineWidth) {
        const node = this.makeNode("rectangle");
        node.setAttribute("x", `${this._x(center.x - size / 2.0)}`);
        node.setAttribute("y", `${this._y(center.y - size / 2.0)}`);
        node.setAttribute("width", `${size * this.scale.x}`);
        node.setAttribute("height", `${size * this.scale.y}`);
        return this._bindFillDraw(node, "square", color, lineWidth || 1);
    }
    /**
     * Draw a rectangle.
     *
     * @param {XYCoords} position - The upper left corner of the rectangle.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
     * @param {string} color - The color to use.
     * @param {number=1} lineWidth - (optional) The line with to use (default is 1).
     **/
    rect(position, width, height, color, lineWidth) {
        const node = this.makeNode("rect");
        node.setAttribute("x", `${this._x(position.x)}`);
        node.setAttribute("y", `${this._y(position.y)}`);
        node.setAttribute("width", `${width * this.scale.x}`);
        node.setAttribute("height", `${height * this.scale.y}`);
        return this._bindFillDraw(node, "rect", color, lineWidth || 1);
    }
    /**
     * Draw a grid of horizontal and vertical lines with the given (CSS-) color.
     *
     * @method grid
     * @param {Vertex} center - The center of the grid.
     * @param {number} width - The total width of the grid (width/2 each to the left and to the right).
     * @param {number} height - The total height of the grid (height/2 each to the top and to the bottom).
     * @param {number} sizeX - The horizontal grid size.
     * @param {number} sizeY - The vertical grid size.
     * @param {string} color - The CSS color to draw the grid with.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    grid(center, width, height, sizeX, sizeY, color) {
        const node = this.makeNode("path");
        const d = [];
        var yMin = -Math.ceil((height * 0.5) / sizeY) * sizeY;
        var yMax = height / 2;
        for (var x = -Math.ceil((width * 0.5) / sizeX) * sizeX; x < width / 2; x += sizeX) {
            d.push("M", this._x(center.x + x), this._y(center.y + yMin));
            d.push("L", this._x(center.x + x), this._y(center.y + yMax));
        }
        var xMin = -Math.ceil((width * 0.5) / sizeX) * sizeX;
        var xMax = width / 2;
        for (var y = -Math.ceil((height * 0.5) / sizeY) * sizeY; y < height / 2; y += sizeY) {
            d.push("M", this._x(center.x + xMin), this._y(center.y + y));
            d.push("L", this._x(center.x + xMax), this._y(center.y + y));
        }
        node.setAttribute("d", d.join(" "));
        return this._bindFillDraw(node, "grid", color, 1);
    }
    /**
     * Draw a raster of crosshairs in the given grid.<br>
     *
     * This works analogue to the grid() function
     *
     * @method raster
     * @param {Vertex} center - The center of the raster.
     * @param {number} width - The total width of the raster (width/2 each to the left and to the right).
     * @param {number} height - The total height of the raster (height/2 each to the top and to the bottom).
     * @param {number} sizeX - The horizontal raster size.
     * @param {number} sizeY - The vertical raster size.
     * @param {string} color - The CSS color to draw the raster with.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    raster(center, width, height, sizeX, sizeY, color) {
        const node = this.makeNode("path");
        const d = [];
        for (var x = -Math.ceil((width * 0.5) / sizeX) * sizeX; x < width / 2; x += sizeX) {
            for (var y = -Math.ceil((height * 0.5) / sizeY) * sizeY; y < height / 2; y += sizeY) {
                // Draw a crosshair
                d.push("M", this._x(center.x + x) - 4, this._y(center.y + y));
                d.push("L", this._x(center.x + x) + 4, this._y(center.y + y));
                d.push("M", this._x(center.x + x), this._y(center.y + y) - 4);
                d.push("L", this._x(center.x + x), this._y(center.y + y) + 4);
            }
        }
        node.setAttribute("d", d.join(" "));
        return this._bindFillDraw(node, "raster", color, 1);
    }
    /**
     * Draw a diamond handle (square rotated by 45°) with the given CSS color.
     *
     * It is an inherent featur of the handle functions that the drawn elements are not scaled and not
     * distorted. So even if the user zooms in or changes the aspect ratio, the handles will be drawn
     * as even shaped diamonds.
     *
     * @method diamondHandle
     * @param {Vertex} center - The center of the diamond.
     * @param {Vertex} size - The x/y-size of the diamond.
     * @param {string} color - The CSS color to draw the diamond with.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    diamondHandle(center, size, color) {
        const node = this.makeNode("path");
        const d = [
            "M",
            this._x(center.x) - size / 2.0,
            this._y(center.y),
            "L",
            this._x(center.x),
            this._y(center.y) - size / 2.0,
            "L",
            this._x(center.x) + size / 2.0,
            this._y(center.y),
            "L",
            this._x(center.x),
            this._y(center.y) + size / 2.0,
            "Z"
        ];
        node.setAttribute("d", d.join(" "));
        return this._bindFillDraw(node, "diamondHandle", color, 1);
    }
    /**
     * Draw a square handle with the given CSS color.<br>
     * <br>
     * It is an inherent featur of the handle functions that the drawn elements are not scaled and not
     * distorted. So even if the user zooms in or changes the aspect ratio, the handles will be drawn
     * as even shaped squares.
     *
     * @method squareHandle
     * @param {Vertex} center - The center of the square.
     * @param {Vertex} size - The x/y-size of the square.
     * @param {string} color - The CSS color to draw the square with.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    squareHandle(center, size, color) {
        const node = this.makeNode("rect");
        node.setAttribute("x", `${this._x(center.x) - size / 2.0}`);
        node.setAttribute("y", `${this._y(center.y) - size / 2.0}`);
        node.setAttribute("width", `${size}`);
        node.setAttribute("height", `${size}`);
        return this._bindFillDraw(node, "squareHandle", color, 1);
    }
    /**
     * Draw a circle handle with the given CSS color.<br>
     * <br>
     * It is an inherent featur of the handle functions that the drawn elements are not scaled and not
     * distorted. So even if the user zooms in or changes the aspect ratio, the handles will be drawn
     * as even shaped circles.
     *
     * @method circleHandle
     * @param {Vertex} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {string} color - The CSS color to draw the circle with.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    circleHandle(center, radius, color) {
        radius = radius || 3;
        const node = this.makeNode("circle");
        node.setAttribute("cx", `${this._x(center.x)}`);
        node.setAttribute("cy", `${this._y(center.y)}`);
        node.setAttribute("r", `${radius}`);
        return this._bindFillDraw(node, "circleHandle", color, 1);
    }
    /**
     * Draw a crosshair with given radius and color at the given position.<br>
     * <br>
     * Note that the crosshair radius will not be affected by scaling.
     *
     * @method crosshair
     * @param {XYCoords} center - The center of the crosshair.
     * @param {number} radius - The radius of the crosshair.
     * @param {string} color - The CSS color to draw the crosshair with.
     * @param {number=0.5} lineWidth - (optional, default=0.5) The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    crosshair(center, radius, color, lineWidth) {
        const node = this.makeNode("path");
        const d = [
            "M",
            this._x(center.x) - radius,
            this._y(center.y),
            "L",
            this._x(center.x) + radius,
            this._y(center.y),
            "M",
            this._x(center.x),
            this._y(center.y) - radius,
            "L",
            this._x(center.x),
            this._y(center.y) + radius
        ];
        node.setAttribute("d", d.join(" "));
        return this._bindFillDraw(node, "crosshair", color, lineWidth || 0.5);
    }
    /**
     * Draw a cross with diagonal axes with given radius, color and lineWidth at the given position.<br>
     * <br>
     * Note that the x's radius will not be affected by scaling.
     *
     * @method crosshair
     * @param {XYCoords} center - The center of the crosshair.
     * @param {number} radius - The radius of the crosshair.
     * @param {string} color - The CSS color to draw the crosshair with.
     * @param {number=1} lineWidth - (optional, default=1.0) The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    cross(center, radius, color, lineWidth) {
        const node = this.makeNode("path");
        const d = [
            "M",
            this._x(center.x) - radius,
            this._y(center.y) - radius,
            "L",
            this._x(center.x) + radius,
            this._y(center.y) + radius,
            "M",
            this._x(center.x) - radius,
            this._y(center.y) + radius,
            "L",
            this._x(center.x) + radius,
            this._y(center.y) - radius
        ];
        node.setAttribute("d", d.join(" "));
        return this._bindFillDraw(node, "cross", color, lineWidth || 1.0);
    }
    /**
     * Draw a polygon.
     *
     * @method polygon
     * @param {Polygon} polygon - The polygon to draw.
     * @param {string} color - The CSS color to draw the polygon with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    polygon(polygon, color, lineWidth) {
        return this.polyline(polygon.vertices, polygon.isOpen, color, lineWidth);
    }
    /**
     * Draw a polygon line (alternative function to the polygon).
     *
     * @method polyline
     * @param {Vertex[]} vertices - The polygon vertices to draw.
     * @param {boolan}   isOpen   - If true the polyline will not be closed at its end.
     * @param {string}   color    - The CSS color to draw the polygon with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    polyline(vertices, isOpen, color, lineWidth) {
        const node = this.makeNode("path");
        if (vertices.length == 0)
            return node;
        // Draw curve
        const d = ["M", this._x(vertices[0].x), this._y(vertices[0].y)];
        var n = vertices.length;
        for (var i = 1; i < n; i++) {
            d.push("L", this._x(vertices[i].x), this._y(vertices[i].y));
        }
        if (!isOpen)
            d.push("Z");
        node.setAttribute("d", d.join(" "));
        return this._bindFillDraw(node, "polygon", color, lineWidth || 1);
    }
    /**
     * Draw a text at the given relative position.
     *
     * @method text
     * @param {string} text - The text to draw.
     * @param {number} x - The x-position to draw the text at.
     * @param {number} y - The y-position to draw the text at.
     * @param {string=} options.color - The Color to use.
     * @param {string=} options.fontFamily - The font family to use.
     * @param {number=} options.fontSize - The font size (in pixels) to use.
     * @param {FontStyle=} options.fontStyle - The font style to use.
     * @param {FontWeight=} options.fontWeight - The font weight to use.
     * @param {number=} options.lineHeight - The line height (in pixels) to use.
     * @param {number=} options.rotation - The (optional) rotation in radians.
     * @param {string=} options.textAlign - The text align to use. According to the specifiactions (https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textAlign) valid values are `"left" || "right" || "center" || "start" || "end"`.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    text(text, x, y, options) {
        var _a, _b, _c;
        options = options || {};
        const color = options.color || "black";
        const lineHeight = ((_b = (_a = options.lineHeight) !== null && _a !== void 0 ? _a : options.fontSize) !== null && _b !== void 0 ? _b : 0) * this.scale.x;
        // https://www.w3.org/TR/SVG/text.html#TextAnchorProperty
        //    start | middle | end
        const textAlign = options.textAlign === "left" || options.textAlign === "start"
            ? "start"
            : options.textAlign === "center"
                ? "middle"
                : options.textAlign === "right" || options.textAlign === "end"
                    ? "end"
                    : "start";
        const transformOrigin = `${this._x(x)}px ${this._y(y)}px`;
        const translate = `translate(${this._x(x)} ${this._y(y) + lineHeight / 2})`;
        // Safari has a transform-origin/rotation bug.
        // It's essential to use rotate(r,x,y) here. "rotate(r)"" with transform-origin(x,y) won't do the job.
        // And rotate and translate cannot be used is combination on a text object.
        // So wrap the text inside a <g>, translate the <g>, and rotate the text inside.
        const rotate = options.rotation ? `rotate(${options.rotation * RAD_TO_DEG} 0 0)` : ``;
        const node = this.makeNode("g");
        const curId = this.curId;
        this.curId = curId + "_text";
        const textNode = this.makeNode("text");
        node.appendChild(textNode);
        textNode.setAttribute("font-family", (_c = options.fontFamily) !== null && _c !== void 0 ? _c : ""); // May be undefined
        textNode.setAttribute("font-size", options.fontSize ? `${options.fontSize * this.scale.x}` : "");
        textNode.setAttribute("font-style", options.fontStyle ? `${options.fontStyle}` : "");
        textNode.setAttribute("font-weight", options.fontWeight ? `${options.fontWeight}` : "");
        textNode.setAttribute("text-anchor", textAlign);
        textNode.setAttribute("transform-origin", "0 0");
        textNode.setAttribute("transform", rotate);
        node.setAttribute("transform-origin", transformOrigin);
        node.setAttribute("transform", translate);
        textNode.innerHTML = text;
        // Restore old ID
        this.curId = curId;
        return this._bindFillDraw(node, "text", color, 1);
    }
    /**
     * Draw a non-scaling text label at the given position.
     *
     * @method label
     * @param {string} text - The text to draw.
     * @param {number} x - The x-position to draw the text at.
     * @param {number} y - The y-position to draw the text at.
     * @param {number=} rotation - The (optional) rotation in radians.
     * @param {string="black"} color - The color to use (default is black).
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    label(text, x, y, rotation, color) {
        const node = this.makeNode("text");
        // For some strange reason SVG rotation transforms use degrees instead of radians
        node.setAttribute("transform", `translate(${x},${y}), rotate(${((rotation || 0) / Math.PI) * 180})`);
        node.setAttribute("font-family", "Arial");
        node.setAttribute("font-size", "9pt");
        node.setAttribute("font-style", "normal");
        node.setAttribute("font-weight", "lighter");
        node.innerHTML = text;
        return this._bindFillDraw(node, "label", color || "black", null);
    }
    /**
     * Draw an SVG-like path given by the specified path data.
     *
     * @method path
     * @param {SVGPathData} pathData - An array of path commands and params.
     * @param {string=null} color - (optional) The color to draw this path with (default is null).
     * @param {number=1} lineWidth - (optional) the line width to use (default is 1).
     * @param {boolean=false} options.inplace - (optional) If set to true then path transforamtions (scale and translate) will be done in-place in the array. This can boost the performance.
     * @instance
     * @memberof drawutils
     * @return {R} An instance representing the drawn path.
     */
    path(pathData, color, lineWidth, options) {
        const node = this.makeNode("path");
        // Transform the path: in-place (fast) or copy (slower)
        const d = options && options.inplace ? pathData : drawutilssvg.copyPathData(pathData);
        drawutilssvg.transformPathData(d, this.offset, this.scale);
        node.setAttribute("d", d.join(" "));
        return this._bindFillDraw(node, "path", color, lineWidth);
    }
    /**
     * Due to gl compatibility there is a generic 'clear' function required
     * to avoid accessing the context object itself directly.
     *
     * This function just fills the whole canvas with a single color.
     *
     * @param {string} color - The color to clear with.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     **/
    clear(color) {
        // If this isn't the primary handler then do not remove anything here.
        // The primary handler will do that (no double work).
        if (this.isSecondary) {
            return;
        }
        // Add a covering rect with the given background color
        this.curId = "background";
        this.curClassName = undefined;
        const node = this.makeNode("rect");
        // For some strange reason SVG rotation transforms use degrees instead of radians
        // Note that the background does not scale with the zoom level (always covers full element)
        node.setAttribute("x", "0");
        node.setAttribute("y", "0");
        node.setAttribute("width", `${this.canvasSize.width}`);
        node.setAttribute("height", `${this.canvasSize.height}`);
        // Bind this special element into the document
        this._bindFillDraw(node, this.curId, null, null);
        node.setAttribute("fill", typeof color === "undefined" ? "none" : color);
        // Clear the current ID again
        this.curId = undefined;
    }
    /**
     * A private helper function to clear all SVG nodes from the &gt;g> node.
     *
     * @private
     */
    removeAllChildNodes() {
        while (this.bufferGNode.lastChild) {
            this.bufferGNode.removeChild(this.bufferGNode.lastChild);
        }
        while (this.bufferedNodeDefs.lastChild) {
            this.bufferedNodeDefs.removeChild(this.bufferedNodeDefs.lastChild);
        }
    }
    /**
     * Create a new and empty `SVGElement` &lt;svg&gt; in the svg-namespace.
     *
     * @name createSvg
     * @static
     * @memberof drawutilssvg
     * @return SVGElement
     */
    static createSvg() {
        return document.createElementNS("http://www.w3.org/2000/svg", "svg");
    }
    /**
     * Create a copy of the given path data. As path data only consists of strings and numbers,
     * the copy will be shallow by definition.
     *
     * @name copyPathData
     * @static
     * @memberof drawutilssvg
     */
    static copyPathData(data) {
        const copy = new Array(data.length);
        for (var i = 0, n = data.length; i < n; i++) {
            copy[i] = data[i];
        }
        return copy;
    }
    /**
     * Transform the given path data (translate and scale. rotating is not intended here).
     *
     * @name transformPathData
     * @static
     * @memberof drawutilssvg
     * @param {SVGPathParams} data - The data to transform.
     * @param {XYCoords} offset - The translation offset (neutral is x=0, y=0).
     * @param {XYCoords} scale - The scale factors (neutral is x=1, y=1).
     */
    static transformPathData(data, offset, scale) {
        // Scale and translate {x,y}
        const _stx = (index) => {
            data[index] = offset.x + scale.x * Number(data[index]);
        };
        const _sty = (index) => {
            data[index] = offset.y + scale.y * Number(data[index]);
        };
        // scale only {x,y}
        const _sx = (index) => {
            data[index] = scale.x * Number(data[index]);
        };
        const _sy = (index) => {
            data[index] = scale.y * Number(data[index]);
        };
        var i = 0;
        var lastPoint = { x: NaN, y: NaN };
        // "save last point"
        var _slp = (index) => {
            lastPoint.x = Number(data[index]);
            lastPoint.y = Number(data[index + 1]);
        };
        while (i < data.length) {
            const cmd = data[i];
            switch (cmd) {
                case "M":
                // MoveTo: M|m x y
                case "L":
                // LineTo L|l x y
                case "T":
                    // Shorthand/smooth quadratic Bézier curveto: T|t x y
                    _stx(i + 1);
                    _sty(i + 2);
                    _slp(i + 1);
                    i += 3;
                    break;
                case "m":
                // MoveTo: M|m x y
                case "l":
                // LineTo L|l x y
                case "t":
                    // Shorthand/smooth quadratic Bézier curveto: T|t x y
                    _sx(i + 1);
                    _sy(i + 2);
                    _slp(i + 1);
                    i += 3;
                    break;
                case "H":
                    // HorizontalLineTo: H|h x
                    _stx(i + 1);
                    lastPoint.x = Number(data[i + 1]);
                    i += 2;
                    break;
                case "h":
                    // HorizontalLineTo: H|h x
                    _sx(i + 1);
                    lastPoint.x = Number(data[i + 1]);
                    i += 2;
                    break;
                case "V":
                    // VerticalLineTo: V|v y
                    _sty(i + 1);
                    lastPoint.y = Number(data[i + 1]);
                    i += 2;
                    break;
                case "v":
                    // VerticalLineTo: V|v y
                    _sy(i + 1);
                    lastPoint.y = Number(data[i + 1]);
                    i += 2;
                    break;
                case "C":
                    // CurveTo: C|c x1 y1 x2 y2 x y
                    _stx(i + 1);
                    _sty(i + 2);
                    _stx(i + 3);
                    _sty(i + 4);
                    _stx(i + 5);
                    _sty(i + 6);
                    _slp(i + 5);
                    i += 7;
                    break;
                case "c":
                    // CurveTo: C|c x1 y1 x2 y2 x y
                    _sx(i + 1);
                    _sy(i + 2);
                    _sx(i + 3);
                    _sy(i + 4);
                    _sx(i + 5);
                    _sy(i + 6);
                    _slp(i + 5);
                    i += 7;
                    break;
                case "S":
                case "Q":
                    // Shorthand-/SmoothCurveTo: S|s x2 y2 x y
                    // QuadraticCurveTo: Q|q x1 y1 x y
                    _stx(i + 1);
                    _sty(i + 2);
                    _stx(i + 3);
                    _sty(i + 4);
                    _slp(i + 3);
                    i += 5;
                    break;
                case "s":
                case "q":
                    // Shorthand-/SmoothCurveTo: S|s x2 y2 x y
                    // QuadraticCurveTo: Q|q x1 y1 x y
                    _sx(i + 1);
                    _sy(i + 2);
                    _sx(i + 3);
                    _sy(i + 4);
                    _slp(i + 3);
                    i += 5;
                    break;
                case "A":
                    // EllipticalArcTo: A|a rx ry x-axis-rotation large-arc-flag sweep-flag x y
                    // Uniform scale: just scale
                    // NOTE: here is something TODO
                    //  * if scalex!=scaleY this won't work
                    //  * Arcs have to be converted to Bézier curves here in that case
                    _sx(i + 1);
                    _sy(i + 2);
                    _stx(i + 6);
                    _sty(i + 7);
                    _slp(i + 6);
                    // Update the arc flag when x _or_ y scale is negative
                    if ((scale.x < 0 && scale.y >= 0) || (scale.x >= 0 && scale.y < 0)) {
                        data[i + 5] = data[i + 5] ? 0 : 1;
                    }
                    i += 8;
                    break;
                case "a":
                    // EllipticalArcTo: A|a rx ry x-axis-rotation large-arc-flag sweep-flag x y
                    _sx(i + 1);
                    _sy(i + 2);
                    _sx(i + 6);
                    _sy(i + 7);
                    _slp(i + 6);
                    i += 8;
                    break;
                case "z":
                case "Z":
                    // ClosePath: Z|z (no arguments)
                    // lastPoint.x = firstPoint.x;
                    // lastPoint.y = firstPoint.y;
                    i++;
                    break;
                // Safepoint: continue reading token by token until something is recognized again
                default:
                    i++;
            }
        } // END while
    } // END transformPathData
}
drawutilssvg.HEAD_XML = [
    '<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" ',
    '         "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">',
    ""
].join("\n");
//# sourceMappingURL=drawutilssvg.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/geomutils.js":
/*!***********************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/geomutils.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   geomutils: () => (/* binding */ geomutils)
/* harmony export */ });
/* harmony import */ var _Line__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Line */ "./node_modules/plotboilerplate/src/esm/Line.js");
/* harmony import */ var _Triangle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Triangle */ "./node_modules/plotboilerplate/src/esm/Triangle.js");
/**
 * @author   Ikaros Kappler
 * @date     2019-02-03
 * @modified 2021-03-01 Added `wrapMax` function.
 * @version  1.1.0
 **/


/**
 * A collection of usefull geometry utilities.
 *
 * @global
 **/
const geomutils = {
    /**
     * Compute the n-section of the angle – described as a triangle (A,B,C) – in point A.
     *
     * @param {Vertex} pA - The first triangle point.
     * @param {Vertex} pB - The second triangle point.
     * @param {Vertex} pC - The third triangle point.
     * @param {number} n - The number of desired angle sections (example: 2 means the angle will be divided into two sections,
     *                      means an returned array with length 1, the middle line).
     *
     * @return {Line[]} An array of n-1 lines secting the given angle in point A into n equal sized angle sections. The lines' first vertex is A.
     */
    nsectAngle(pA, pB, pC, n) {
        const triangle = new _Triangle__WEBPACK_IMPORTED_MODULE_1__.Triangle(pA, pB, pC);
        const lineAB = new _Line__WEBPACK_IMPORTED_MODULE_0__.Line(pA, pB);
        const lineAC = new _Line__WEBPACK_IMPORTED_MODULE_0__.Line(pA, pC);
        // Compute the difference; this is the angle between AB and AC
        var insideAngle = lineAB.angle(lineAC);
        // We want the inner angles of the triangle, not the outer angle;
        //   which one is which depends on the triangle 'direction'
        const clockwise = triangle.determinant() > 0;
        // For convenience convert the angle [-PI,PI] to [0,2*PI]
        if (insideAngle < 0)
            insideAngle = 2 * Math.PI + insideAngle;
        if (!clockwise)
            insideAngle = (2 * Math.PI - insideAngle) * (-1);
        // Scale the rotated lines to the max leg length (looks better)
        const lineLength = Math.max(lineAB.length(), lineAC.length());
        const scaleFactor = lineLength / lineAB.length();
        var result = [];
        for (var i = 1; i < n; i++) {
            // Compute the i-th inner sector line
            result.push(new _Line__WEBPACK_IMPORTED_MODULE_0__.Line(pA, pB.clone().rotate((-i * (insideAngle / n)), pA)).scale(scaleFactor));
        }
        return result;
    },
    /**
     * Wrap the value (e.g. an angle) into the given range of [0,max).
     *
     * @name wrapMax
     * @param {number} x - The value to wrap.
     * @param {number} max - The max bound to use for the range.
     * @return {number} The wrapped value inside the range [0,max).
     */
    wrapMax(x, max) {
        // Found at
        //    https://stackoverflow.com/questions/4633177/c-how-to-wrap-a-float-to-the-interval-pi-pi
        return (max + (x % max)) % max;
    },
    /**
     * Wrap the value (e.g. an angle) into the given range of [min,max).
     *
     * @name wrapMinMax
     * @param {number} x - The value to wrap.
     * @param {number} min - The min bound to use for the range.
     * @param {number} max - The max bound to use for the range.
     * @return {number} The wrapped value inside the range [min,max).
     */
    // Currently un-used
    wrapMinMax(x, min, max) {
        return min + geomutils.wrapMax(x - min, max - min);
    }
};
//# sourceMappingURL=geomutils.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BezierPath: () => (/* reexport safe */ _BezierPath__WEBPACK_IMPORTED_MODULE_0__.BezierPath),
/* harmony export */   Bounds: () => (/* reexport safe */ _Bounds__WEBPACK_IMPORTED_MODULE_1__.Bounds),
/* harmony export */   Circle: () => (/* reexport safe */ _Circle__WEBPACK_IMPORTED_MODULE_2__.Circle),
/* harmony export */   CircleSector: () => (/* reexport safe */ _CircleSector__WEBPACK_IMPORTED_MODULE_3__.CircleSector),
/* harmony export */   CubicBezierCurve: () => (/* reexport safe */ _CubicBezierCurve__WEBPACK_IMPORTED_MODULE_4__.CubicBezierCurve),
/* harmony export */   Grid: () => (/* reexport safe */ _Grid__WEBPACK_IMPORTED_MODULE_9__.Grid),
/* harmony export */   KeyHandler: () => (/* reexport safe */ _KeyHandler__WEBPACK_IMPORTED_MODULE_11__.KeyHandler),
/* harmony export */   Line: () => (/* reexport safe */ _Line__WEBPACK_IMPORTED_MODULE_12__.Line),
/* harmony export */   MouseHandler: () => (/* reexport safe */ _MouseHandler__WEBPACK_IMPORTED_MODULE_13__.MouseHandler),
/* harmony export */   PBImage: () => (/* reexport safe */ _PBImage__WEBPACK_IMPORTED_MODULE_14__.PBImage),
/* harmony export */   PBText: () => (/* reexport safe */ _PBText__WEBPACK_IMPORTED_MODULE_15__.PBText),
/* harmony export */   PlotBoilerplate: () => (/* reexport safe */ _PlotBoilerplate__WEBPACK_IMPORTED_MODULE_16__.PlotBoilerplate),
/* harmony export */   Polygon: () => (/* reexport safe */ _Polygon__WEBPACK_IMPORTED_MODULE_17__.Polygon),
/* harmony export */   Triangle: () => (/* reexport safe */ _Triangle__WEBPACK_IMPORTED_MODULE_18__.Triangle),
/* harmony export */   UIDGenerator: () => (/* reexport safe */ _UIDGenerator__WEBPACK_IMPORTED_MODULE_19__.UIDGenerator),
/* harmony export */   VEllipse: () => (/* reexport safe */ _VEllipse__WEBPACK_IMPORTED_MODULE_21__.VEllipse),
/* harmony export */   VEllipseSector: () => (/* reexport safe */ _VEllipseSector__WEBPACK_IMPORTED_MODULE_22__.VEllipseSector),
/* harmony export */   Vector: () => (/* reexport safe */ _Vector__WEBPACK_IMPORTED_MODULE_20__.Vector),
/* harmony export */   VertTuple: () => (/* reexport safe */ _VertTuple__WEBPACK_IMPORTED_MODULE_26__.VertTuple),
/* harmony export */   Vertex: () => (/* reexport safe */ _Vertex__WEBPACK_IMPORTED_MODULE_23__.Vertex),
/* harmony export */   VertexAttr: () => (/* reexport safe */ _VertexAttr__WEBPACK_IMPORTED_MODULE_24__.VertexAttr),
/* harmony export */   VertexListeners: () => (/* reexport safe */ _VertexListeners__WEBPACK_IMPORTED_MODULE_25__.VertexListeners),
/* harmony export */   XMouseEvent: () => (/* reexport safe */ _MouseHandler__WEBPACK_IMPORTED_MODULE_13__.XMouseEvent),
/* harmony export */   XWheelEvent: () => (/* reexport safe */ _MouseHandler__WEBPACK_IMPORTED_MODULE_13__.XWheelEvent),
/* harmony export */   drawutils: () => (/* reexport safe */ _draw__WEBPACK_IMPORTED_MODULE_5__.drawutils),
/* harmony export */   drawutilsgl: () => (/* reexport safe */ _drawgl__WEBPACK_IMPORTED_MODULE_6__.drawutilsgl),
/* harmony export */   drawutilssvg: () => (/* reexport safe */ _drawutilssvg__WEBPACK_IMPORTED_MODULE_7__.drawutilssvg),
/* harmony export */   geomutils: () => (/* reexport safe */ _geomutils__WEBPACK_IMPORTED_MODULE_8__.geomutils)
/* harmony export */ });
/* harmony import */ var _BezierPath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BezierPath */ "./node_modules/plotboilerplate/src/esm/BezierPath.js");
/* harmony import */ var _Bounds__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Bounds */ "./node_modules/plotboilerplate/src/esm/Bounds.js");
/* harmony import */ var _Circle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Circle */ "./node_modules/plotboilerplate/src/esm/Circle.js");
/* harmony import */ var _CircleSector__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CircleSector */ "./node_modules/plotboilerplate/src/esm/CircleSector.js");
/* harmony import */ var _CubicBezierCurve__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./CubicBezierCurve */ "./node_modules/plotboilerplate/src/esm/CubicBezierCurve.js");
/* harmony import */ var _draw__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./draw */ "./node_modules/plotboilerplate/src/esm/draw.js");
/* harmony import */ var _drawgl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./drawgl */ "./node_modules/plotboilerplate/src/esm/drawgl.js");
/* harmony import */ var _drawutilssvg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./drawutilssvg */ "./node_modules/plotboilerplate/src/esm/drawutilssvg.js");
/* harmony import */ var _geomutils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./geomutils */ "./node_modules/plotboilerplate/src/esm/geomutils.js");
/* harmony import */ var _Grid__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Grid */ "./node_modules/plotboilerplate/src/esm/Grid.js");
/* harmony import */ var _interfaces__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./interfaces */ "./node_modules/plotboilerplate/src/esm/interfaces/index.js");
/* harmony import */ var _KeyHandler__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./KeyHandler */ "./node_modules/plotboilerplate/src/esm/KeyHandler.js");
/* harmony import */ var _Line__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./Line */ "./node_modules/plotboilerplate/src/esm/Line.js");
/* harmony import */ var _MouseHandler__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./MouseHandler */ "./node_modules/plotboilerplate/src/esm/MouseHandler.js");
/* harmony import */ var _PBImage__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./PBImage */ "./node_modules/plotboilerplate/src/esm/PBImage.js");
/* harmony import */ var _PBText__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./PBText */ "./node_modules/plotboilerplate/src/esm/PBText.js");
/* harmony import */ var _PlotBoilerplate__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./PlotBoilerplate */ "./node_modules/plotboilerplate/src/esm/PlotBoilerplate.js");
/* harmony import */ var _Polygon__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./Polygon */ "./node_modules/plotboilerplate/src/esm/Polygon.js");
/* harmony import */ var _Triangle__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./Triangle */ "./node_modules/plotboilerplate/src/esm/Triangle.js");
/* harmony import */ var _UIDGenerator__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./UIDGenerator */ "./node_modules/plotboilerplate/src/esm/UIDGenerator.js");
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./Vector */ "./node_modules/plotboilerplate/src/esm/Vector.js");
/* harmony import */ var _VEllipse__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./VEllipse */ "./node_modules/plotboilerplate/src/esm/VEllipse.js");
/* harmony import */ var _VEllipseSector__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./VEllipseSector */ "./node_modules/plotboilerplate/src/esm/VEllipseSector.js");
/* harmony import */ var _Vertex__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./Vertex */ "./node_modules/plotboilerplate/src/esm/Vertex.js");
/* harmony import */ var _VertexAttr__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./VertexAttr */ "./node_modules/plotboilerplate/src/esm/VertexAttr.js");
/* harmony import */ var _VertexListeners__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./VertexListeners */ "./node_modules/plotboilerplate/src/esm/VertexListeners.js");
/* harmony import */ var _VertTuple__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./VertTuple */ "./node_modules/plotboilerplate/src/esm/VertTuple.js");



























//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/interfaces/DrawLib.js":
/*!********************************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/interfaces/DrawLib.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/**
 * @author Ikaros Kappler
 * @modified 2021-01-10 Added the `CanvasWrapper` interface.
 * @modified 2021-01-20 Added the `UID` type.
 * @modified 2021-01-25 Added the `DrawLib.setCurrentId` and `DrawLib.setCurrentClassName` functions.
 * @modified 2021-01-25 Fixed the `PBParams` interface (inluding DrawConfig).
 * @modified 2021-02-08 Changed the `PBParams` interface: no longer sub-interface of `DrawConfig` (all those attributes were un-used).
 * @modified 2021-02-22 Added the `path` drawing function to draw SVG path data.
 * @modified 2021-03-01 Added the `rotation` param to the DrawLib.ellipse(...) function.
 * @modified 2021-03-02 Added the `VEllipseSector` as to the `Drawable` type.
 * @modified 2021-03-29 Added the `draw` and `fill` params to the `preDraw` and `postDraw` function (required for full svg export support).
 * @modified 2021-03-30 Added the `endDrawCycle` function to `DrawLib`.
 * @modified 2021-05-31 Added the `drawLib.setConfiguration` function.
 * @modified 2021-05-31 Splitted the large interfaces.ts file into this one and others.
 * @modified 2021-11-12 Added `text()` params fontSize, fontFamily, rotation, textAlign.
 * @modified 2021-11-16 Added `text()` params fontWeight and fontStyle.
 * @modified 2021-11-19 Added the `color` param to the `label(...)` function.
 * @modified 2022-02-03 Added the `lineWidth` param to the `crosshair` function.
 * @modified 2022-02-03 Added the `cross(...)` function.
 * @modified 2022-07-26 Adding `alpha` to the `image(...)` function.
 * @modified 2023-02-10 The methods `setCurrentClassName` and `setCurrentId` also accept `null` now.
 **/

//# sourceMappingURL=DrawLib.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/interfaces/additionals.js":
/*!************************************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/interfaces/additionals.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=additionals.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/interfaces/core.js":
/*!*****************************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/interfaces/core.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/**
 * @author Ikaros Kappler
 * @modified 2021-01-10 Added the `CanvasWrapper` interface.
 * @modified 2021-01-20 Added the `UID` type.
 * @modified 2021-01-25 Added the `DrawLib.setCurrentId` and `DrawLib.setCurrentClassName` functions.
 * @modified 2021-01-25 Fixed the `PBParams` interface (inluding DrawConfig).
 * @modified 2021-02-08 Changed the `PBParams` interface: no longer sub-interface of `DrawConfig` (all those attributes were un-used).
 * @modified 2021-02-22 Added the `path` drawing function to draw SVG path data.
 * @modified 2021-03-01 Added the `rotation` param to the DrawLib.ellipse(...) function.
 * @modified 2021-03-02 Added the `VEllipseSector` as to the `Drawable` type.
 * @modified 2021-03-29 Added the `draw` and `fill` params to the `preDraw` and `postDraw` function (required for full svg export support).
 * @modified 2021-03-30 Added the `endDrawCycle` function to `DrawLib`.
 * @modified 2021-05-31 Added the `drawLib.setConfiguration` function.
 * @modified 2021-05-31 Splitted the large interfaces.ts file into this one and others.
 * @modified 2021-06-21 Added `IBounds.getCenter()`.
 * @modified 2021-11-16 Added `text` options to the `DrawConfig`.
 * @modified 2022-08-01 Added `title` param to the `PBParams` interface.
 * @modified 2022-10-25 Added `origin` param to the `DrawConfig` interface.
 * @modified 2022-11-23 Added `drawRaster` to the `Config` interface.
 * @modified 2023-02-10 All non-function attributes of the `Config` interface are now mandatory.
 **/

//# sourceMappingURL=core.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/interfaces/externals.js":
/*!**********************************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/interfaces/externals.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/**
 * @author  Ikaros Kappler
 * @date    2021-07-00
 * @version 1.0.0
 */

//# sourceMappingURL=externals.js.map

/***/ }),

/***/ "./node_modules/plotboilerplate/src/esm/interfaces/index.js":
/*!******************************************************************!*\
  !*** ./node_modules/plotboilerplate/src/esm/interfaces/index.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core */ "./node_modules/plotboilerplate/src/esm/interfaces/core.js");
/* harmony import */ var _DrawLib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DrawLib */ "./node_modules/plotboilerplate/src/esm/interfaces/DrawLib.js");
/* harmony import */ var _externals__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./externals */ "./node_modules/plotboilerplate/src/esm/interfaces/externals.js");
/* harmony import */ var _additionals__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./additionals */ "./node_modules/plotboilerplate/src/esm/interfaces/additionals.js");




//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/axios/dist/browser/axios.cjs":
/*!***************************************************!*\
  !*** ./node_modules/axios/dist/browser/axios.cjs ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Axios v1.4.0 Copyright (c) 2023 Matt Zabriskie and contributors


function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

// utils is a library of generic helper functions non-specific to axios

const {toString} = Object.prototype;
const {getPrototypeOf} = Object;

const kindOf = (cache => thing => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
};

const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {isArray} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
};

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing) => {
  let kind;
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) || (
      isFunction(thing.append) && (
        (kind = kindOf(thing)) === 'formdata' ||
        // detect form-data instance
        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
      )
    )
  )
};

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : __webpack_require__.g)
})();

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const {caseless} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
};

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
};

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
};

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};


/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];

  const iterator = generator.call(obj);

  let result;

  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
};

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = str => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};

/* Creating a function that will check if an object has a property. */
const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    if (reducer(descriptor, name, obj) !== false) {
      reducedDescriptors[name] = descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
};

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
};

const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  };

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
};

const noop = () => {};

const toFiniteNumber = (value, defaultValue) => {
  value = +value;
  return Number.isFinite(value) ? value : defaultValue;
};

const ALPHA = 'abcdefghijklmnopqrstuvwxyz';

const DIGIT = '0123456789';

const ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
};

const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = '';
  const {length} = alphabet;
  while (size--) {
    str += alphabet[Math.random() * length|0];
  }

  return str;
};

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator]);
}

const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {

    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  };

  return visit(obj, 0);
};

const isAsyncFn = kindOfTest('AsyncFunction');

const isThenable = (thing) =>
  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

var utils = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  ALPHABET,
  generateString,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable
};

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}

utils.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils.toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});

const prototype$1 = AxiosError.prototype;
const descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype$1, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype$1);

  utils.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.cause = error;

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

// eslint-disable-next-line strict
var httpAdapter = null;

/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return utils.isPlainObject(thing) || utils.isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return utils.endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return utils.isArray(arr) && !arr.some(isVisitable);
}

const predicates = utils.toFlatObject(utils, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData(obj, formData, options) {
  if (!utils.isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (FormData)();

  // eslint-disable-next-line no-param-reassign
  options = utils.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !utils.isUndefined(source[option]);
  });

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && utils.isSpecCompliantForm(formData);

  if (!utils.isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (utils.isDate(value)) {
      return value.toISOString();
    }

    if (!useBlob && utils.isBlob(value)) {
      throw new AxiosError('Blob is not supported. Use a Buffer instead.');
    }

    if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (value && !path && typeof value === 'object') {
      if (utils.endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (utils.isArray(value) && isFlatArray(value)) ||
        ((utils.isFileList(value) || utils.endsWith(key, '[]')) && (arr = utils.toArray(value))
        )) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(utils.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });

  function build(value, path) {
    if (utils.isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    utils.forEach(value, function each(el, key) {
      const result = !(utils.isUndefined(el) || el === null) && visitor.call(
        formData, el, utils.isString(key) ? key.trim() : key, path, exposedHelpers
      );

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!utils.isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode$1(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && toFormData(params, this, options);
}

const prototype = AxiosURLSearchParams.prototype;

prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode$1);
  } : encode$1;

  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};

/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?object} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  
  const _encode = options && options.encode || encode;

  const serializeFn = options && options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils.isURLSearchParams(params) ?
      params.toString() :
      new AxiosURLSearchParams(params, options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

var InterceptorManager$1 = InterceptorManager;

var transitionalDefaults = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};

var URLSearchParams$1 = typeof URLSearchParams !== 'undefined' ? URLSearchParams : AxiosURLSearchParams;

var FormData$1 = typeof FormData !== 'undefined' ? FormData : null;

var Blob$1 = typeof Blob !== 'undefined' ? Blob : null;

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const isStandardBrowserEnv = (() => {
  let product;
  if (typeof navigator !== 'undefined' && (
    (product = navigator.product) === 'ReactNative' ||
    product === 'NativeScript' ||
    product === 'NS')
  ) {
    return false;
  }

  return typeof window !== 'undefined' && typeof document !== 'undefined';
})();

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
 const isStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();


var platform = {
  isBrowser: true,
  classes: {
    URLSearchParams: URLSearchParams$1,
    FormData: FormData$1,
    Blob: Blob$1
  },
  isStandardBrowserEnv,
  isStandardBrowserWebWorkerEnv,
  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
};

function toURLEncodedForm(data, options) {
  return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (platform.isNode && utils.isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}

/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return utils.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils.isArray(target) ? target.length : name;

    if (isLast) {
      if (utils.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !utils.isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && utils.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (utils.isFormData(formData) && utils.isFunction(formData.entries)) {
    const obj = {};

    utils.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

const DEFAULT_CONTENT_TYPE = {
  'Content-Type': undefined
};

/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {

  transitional: transitionalDefaults,

  adapter: ['xhr', 'http'],

  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = utils.isObject(data);

    if (isObjectPayload && utils.isHTMLForm(data)) {
      data = new FormData(data);
    }

    const isFormData = utils.isFormData(data);

    if (isFormData) {
      if (!hasJSONContentType) {
        return data;
      }
      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
    }

    if (utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }

    let isFileList;

    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }

      if ((isFileList = utils.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;

        return toFormData(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }

    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';

    if (data && utils.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;

      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

var defaults$1 = defaults;

// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = utils.toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
var parseHeaders = rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
};

const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return utils.isArray(value) ? value.map(normalizeValue) : String(value);
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (utils.isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (isHeaderNameFilter) {
    value = header;
  }

  if (!utils.isString(value)) return;

  if (utils.isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (utils.isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = utils.toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}

class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = utils.findKey(self, lHeader);

      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      utils.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (utils.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if(utils.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils.findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (utils.isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (utils.isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils.findKey(this, header);

      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = utils.findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (utils.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;

    while (i--) {
      const key = keys[i];
      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }

    return deleted;
  }

  normalize(format) {
    const self = this;
    const headers = {};

    utils.forEach(this, (value, header) => {
      const key = utils.findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    utils.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils.isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    utils.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
}

AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

utils.freezeMethods(AxiosHeaders.prototype);
utils.freezeMethods(AxiosHeaders);

var AxiosHeaders$1 = AxiosHeaders;

/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || defaults$1;
  const context = response || config;
  const headers = AxiosHeaders$1.from(context.headers);
  let data = context.data;

  utils.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}

function isCancel(value) {
  return !!(value && value.__CANCEL__);
}

/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

utils.inherits(CanceledError, AxiosError, {
  __CANCEL__: true
});

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError(
      'Request failed with status code ' + response.status,
      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}

var cookies = platform.isStandardBrowserEnv ?

// Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        const cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

// Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })();

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

var isURLSameOrigin = platform.isStandardBrowserEnv ?

// Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    const msie = /(msie|trident)/i.test(navigator.userAgent);
    const urlParsingNode = document.createElement('a');
    let originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      let href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
          urlParsingNode.pathname :
          '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      const parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
          parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })();

function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}

/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}

function progressEventReducer(listener, isDownloadStream) {
  let bytesNotified = 0;
  const _speedometer = speedometer(50, 250);

  return e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e
    };

    data[isDownloadStream ? 'download' : 'upload'] = true;

    listener(data);
  };
}

const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

var xhrAdapter = isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    let requestData = config.data;
    const requestHeaders = AxiosHeaders$1.from(config.headers).normalize();
    const responseType = config.responseType;
    let onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils.isFormData(requestData)) {
      if (platform.isStandardBrowserEnv || platform.isStandardBrowserWebWorkerEnv) {
        requestHeaders.setContentType(false); // Let the browser set it
      } else {
        requestHeaders.setContentType('multipart/form-data;', false); // mobile/desktop app frameworks
      }
    }

    let request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      const username = config.auth.username || '';
      const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.set('Authorization', 'Basic ' + btoa(username + ':' + password));
    }

    const fullPath = buildFullPath(config.baseURL, config.url);

    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = AxiosHeaders$1.from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = config.transitional || transitionalDefaults;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(new AxiosError(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (platform.isStandardBrowserEnv) {
      // Add xsrf header
      const xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath))
        && config.xsrfCookieName && cookies.read(config.xsrfCookieName);

      if (xsrfValue) {
        requestHeaders.set(config.xsrfHeaderName, xsrfValue);
      }
    }

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', progressEventReducer(config.onDownloadProgress, true));
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', progressEventReducer(config.onUploadProgress));
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = parseProtocol(fullPath);

    if (protocol && platform.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData || null);
  });
};

const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter
};

utils.forEach(knownAdapters, (fn, value) => {
  if(fn) {
    try {
      Object.defineProperty(fn, 'name', {value});
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', {value});
  }
});

var adapters = {
  getAdapter: (adapters) => {
    adapters = utils.isArray(adapters) ? adapters : [adapters];

    const {length} = adapters;
    let nameOrAdapter;
    let adapter;

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      if((adapter = utils.isString(nameOrAdapter) ? knownAdapters[nameOrAdapter.toLowerCase()] : nameOrAdapter)) {
        break;
      }
    }

    if (!adapter) {
      if (adapter === false) {
        throw new AxiosError(
          `Adapter ${nameOrAdapter} is not supported by the environment`,
          'ERR_NOT_SUPPORT'
        );
      }

      throw new Error(
        utils.hasOwnProp(knownAdapters, nameOrAdapter) ?
          `Adapter '${nameOrAdapter}' is not available in the build` :
          `Unknown adapter '${nameOrAdapter}'`
      );
    }

    if (!utils.isFunction(adapter)) {
      throw new TypeError('adapter is not a function');
    }

    return adapter;
  },
  adapters: knownAdapters
};

/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new CanceledError(null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = AxiosHeaders$1.from(config.headers);

  // Transform request data
  config.data = transformData.call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = adapters.getAdapter(config.adapter || defaults$1.adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );

    response.headers = AxiosHeaders$1.from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}

const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? thing.toJSON() : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, caseless) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge.call({caseless}, target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, caseless) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(a, b, caseless);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(undefined, a, caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
  };

  utils.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}

const VERSION = "1.4.0";

const validators$1 = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators$1[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators$1.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new AxiosError(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        AxiosError.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
    }
  }
}

var validator = {
  assertOptions,
  validators: validators$1
};

const validators = validator.validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager$1(),
      response: new InterceptorManager$1()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = mergeConfig(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      validator.assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }

    if (paramsSerializer != null) {
      if (utils.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    let contextHeaders;

    // Flatten headers
    contextHeaders = headers && utils.merge(
      headers.common,
      headers[config.method]
    );

    contextHeaders && utils.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = AxiosHeaders$1.concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), undefined];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
}

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

var Axios$1 = Axios;

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new CanceledError(message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}

var CancelToken$1 = CancelToken;

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError(payload) {
  return utils.isObject(payload) && (payload.isAxiosError === true);
}

const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};

Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});

var HttpStatusCode$1 = HttpStatusCode;

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new Axios$1(defaultConfig);
  const instance = bind(Axios$1.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios$1.prototype, context, {allOwnKeys: true});

  // Copy context to instance
  utils.extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(defaults$1);

// Expose Axios class to allow class inheritance
axios.Axios = Axios$1;

// Expose Cancel & CancelToken
axios.CanceledError = CanceledError;
axios.CancelToken = CancelToken$1;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData;

// Expose AxiosError class
axios.AxiosError = AxiosError;

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = spread;

// Expose isAxiosError
axios.isAxiosError = isAxiosError;

// Expose mergeConfig
axios.mergeConfig = mergeConfig;

axios.AxiosHeaders = AxiosHeaders$1;

axios.formToJSON = thing => formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);

axios.HttpStatusCode = HttpStatusCode$1;

axios.default = axios;

module.exports = axios;
//# sourceMappingURL=axios.cjs.map


/***/ })

}]);
//# sourceMappingURL=rpg-dialogue-vendor.js.map