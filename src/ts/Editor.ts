/**
 * A script for demonstrating the line-point-distance.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui
 *
 * @author   Ikaros Kappler
 * @date     2023-07-25
 * @version  1.0.0
 **/

import { gup } from "./gup";
import { detectDarkMode } from "./detectDarkMode";
import { MouseHandler, PBParams, PlotBoilerplate, XYCoords, XYDimension } from "plotboilerplate";
import { RPGDialogueLogic } from "./RPGDialogueLogic";
import { IDialogueConfig, IMiniQuestionaire, IMiniQuestionaireWithPosition } from "./interfaces";
import { EditorHelper } from "./editorHelpers";
import { EditorRenderer } from "./editorRenderer";

export class Editor {
  constructor() {
    console.log("Initialize plotboilerplate");
    // Fetch the GET params
    let GUP = gup();

    let isDarkmode = detectDarkMode(GUP);

    // All config params are optional.
    var pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys(
        {
          canvas: document.getElementById("my-canvas") as HTMLCanvasElement,
          fullSize: true,
          fitToParent: true,
          scaleX: 1.0,
          scaleY: 1.0,
          rasterGrid: true,
          drawOrigin: true,
          rasterAdjustFactor: 2.0,
          redrawOnResize: true,
          defaultCanvasWidth: 1024,
          defaultCanvasHeight: 768,
          canvasWidthFactor: 1.0,
          canvasHeightFactor: 1.0,
          cssScaleX: 1.0,
          cssScaleY: 1.0,
          cssUniformScale: true,
          autoAdjustOffset: true,
          offsetAdjustXPercent: 50,
          offsetAdjustYPercent: 50,
          backgroundColor: isDarkmode ? "#000000" : "#ffffff",
          enableMouse: true,
          enableKeys: true
        },
        GUP
      ) as PBParams
    );

    var dialogConfig: IDialogueConfig<IMiniQuestionaireWithPosition> = null;
    const boxSize: XYDimension = {
      width: 40,
      height: 20
    };
    var currentMouseHandler: MouseHandler = null;
    var editorRenderer = new EditorRenderer(pb, boxSize);

    // +---------------------------------------------------------------------------------
    // | The render method.
    // +-------------------------------
    pb.config.postDraw = function (draw, fill) {
      if (!dialogConfig) {
        return;
      }
      editorRenderer.renderBoxes(dialogConfig);
      editorRenderer.renderConnections(dialogConfig);
    };

    RPGDialogueLogic.loadConfigFromJSON("../../resources/20230721_floatsim_storyline_dialog.json").then(
      (config: IDialogueConfig<IMiniQuestionaire>) => {
        console.log("structure", config);

        // Check if all graph nodes have positions to render.
        dialogConfig = editorHelpers.enrichPositions(config);

        // Ad DnD support for boxes.
        if (currentMouseHandler) {
          currentMouseHandler.destroy();
          currentMouseHandler = null;
        }
        currentMouseHandler = editorHelpers.boxMovehandler(dialogConfig);

        pb.redraw();
      }
    );

    const editorHelpers = new EditorHelper(pb, boxSize);
    // const randPos = getRandomPosition(pb, boxSize);
    // const addPositions = editorHelpers.enrichPositions(pb, boxSize);

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    // pb.createGUI();
    // END init dat.gui
  }
}
