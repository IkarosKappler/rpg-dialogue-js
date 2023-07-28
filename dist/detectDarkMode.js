"use strict";
/**
 * @author  Ikaros Kappler
 * @date    2021-11-07
 * @version 1.0.0
 *
 * @param {Record<string,string>} GUP
 * @returns {boolean}
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectDarkMode = void 0;
var detectDarkMode = function (GUP) {
    // Respect overrides
    if (typeof GUP !== "undefined" && GUP.hasOwnProperty("darkmode") && GUP["darkmode"]) {
        var overrideValue = GUP["darkmode"];
        if (overrideValue === "0" || overrideValue.toLowerCase() === "false") {
            return false;
        }
        else if (overrideValue === "1" || overrideValue.toLowerCase() === "true") {
            return true;
        }
    }
    var hours = new Date().getHours();
    var isDayTime = hours > 6 && hours < 18;
    return !isDayTime;
};
exports.detectDarkMode = detectDarkMode;
//# sourceMappingURL=detectDarkMode.js.map