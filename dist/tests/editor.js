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
    console.debug("Initializing graph editor");
    var rpgDialogue = RPGDialogue();

    var globalLibs = { axios: axios };

    var path = "export-test/dialog-config-7-with-positions.json";
    var tryRecoverFromLocalStorage = false;
    var editor = new rpgDialogue.Editor(path, tryRecoverFromLocalStorage, globalLibs);
  };

  window.addEventListener("load", window.initializePB);
})(window);
