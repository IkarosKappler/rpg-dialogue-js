/**
 * A script for demonstrating the line-point-distance.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui
 *
 * @author   Ikaros Kappler
 * @date     2019-02-06
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  window.initializePB = function () {
    console.log("Initialize graph editor");

    var path = "export-test/dialog-config-7-with-positions.json";
    var tryRecoverFromLocalStorage = true;
    var editor = new Editor(path, tryRecoverFromLocalStorage);
  };

  window.addEventListener("load", window.initializePB);
})(window);
