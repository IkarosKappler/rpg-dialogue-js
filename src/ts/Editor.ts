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
import { TouchHandler } from "./TouchHandler";
import { FileDrop } from "plotboilerplate/src/cjs/utils/io/FileDrop";

export class Editor {
  constructor(dialogueConfigJSONPath) {
    console.log("Initialize plotboilerplate");
    // Fetch the GET params
    const GUP = gup();

    const isDarkmode = detectDarkMode(GUP);

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
          drawOrigin: false,
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
      width: 120,
      height: 20
    };
    var currentMouseHandler: MouseHandler = null;
    var currentTouchHandler: TouchHandler = null;
    const editorHelpers = new EditorHelper(pb, boxSize);
    var editorRenderer = new EditorRenderer(pb, boxSize, editorHelpers, isDarkmode);

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

    RPGDialogueLogic.loadConfigFromJSON(dialogueConfigJSONPath).then((config: IDialogueConfig<IMiniQuestionaire>) => {
      console.log("structure", config);

      handleDialogConfigLoaded(config);
    });

    const handleDialogConfigLoaded = (config: IDialogueConfig<IMiniQuestionaire>) => {
      // Check if all graph nodes have positions to render.
      dialogConfig = editorHelpers.enrichPositions(config);
      editorHelpers.domHelper.setDialogConfig(dialogConfig);

      // Ad DnD support for boxes.
      if (currentMouseHandler) {
        currentMouseHandler.destroy();
        currentMouseHandler = null;
      }
      currentMouseHandler = editorHelpers.boxMovehandler(dialogConfig);

      // Ad DnD support for boxes.
      if (currentTouchHandler) {
        currentTouchHandler.destroy();
        currentTouchHandler = null;
      }
      currentTouchHandler = new TouchHandler(pb, dialogConfig, editorHelpers);

      pb.redraw();
    };

    // Install DnD with FileDrop
    var fileDrop = new FileDrop(pb.eventCatcher);
    fileDrop.onFileJSONDropped(function (jsonObject) {
      console.log("[onFileJSONDropped] jsonObject", jsonObject);
      // TODO: properly convert to dialog-config
      handleDialogConfigLoaded(EditorHelper.fromObject(jsonObject));
    });

    // const editorHelpers = new EditorHelper(pb, boxSize);
    // const randPos = getRandomPosition(pb, boxSize);
    // const addPositions = editorHelpers.enrichPositions(pb, boxSize);

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    // pb.createGUI();
    // END init dat.gui
  }
}
