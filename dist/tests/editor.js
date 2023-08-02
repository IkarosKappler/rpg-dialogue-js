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
    console.log("Initialize plotboilerplate");

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    // pb.createGUI();
    // END init dat.gui

    // var editor = new Editor("../../resources/20230721_floatsim_storyline_dialog.json");
    var editor = new Editor("../../resources/export-test/dialog-config-5.json");
  };

  window.addEventListener("load", window.initializePB);
})(window);
