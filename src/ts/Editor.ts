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
import { MouseHandler, PBParams, PlotBoilerplate, XYDimension } from "plotboilerplate";
import { RPGDialogueLogic } from "./RPGDialogueLogic";
import { IDialogueConfig, IDialogueListener, IMiniQuestionaire, IMiniQuestionaireWithPosition } from "./interfaces";
import { EditorHelper } from "./editorHelpers";
import { EditorRenderer } from "./editorRenderer";
import { TouchHandler } from "./TouchHandler";
import { FileDrop } from "plotboilerplate/src/cjs/utils/io/FileDrop";
import { Modal } from "./modal";

export class Editor {
  currentMouseHandler: MouseHandler | null = null;
  currentTouchHandler: TouchHandler | null = null;
  editorHelpers: EditorHelper;
  editorRenderer: EditorRenderer;
  dialogConfig: IDialogueConfig<IMiniQuestionaireWithPosition> | null;
  constructor(dialogueConfigJSONPath: string) {
    const _self = this;
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

    const boxSize: XYDimension = {
      width: 120,
      height: 20
    };
    this.editorHelpers = new EditorHelper(this, pb, boxSize);
    this.editorRenderer = new EditorRenderer(pb, boxSize, this.editorHelpers, isDarkmode);

    // +---------------------------------------------------------------------------------
    // | The render method.
    // +-------------------------------
    pb.config.postDraw = function (draw, fill) {
      if (!_self.dialogConfig) {
        return;
      }
      _self.editorRenderer.renderBoxes(_self.dialogConfig);
      _self.editorRenderer.renderConnections(_self.dialogConfig);
    };

    RPGDialogueLogic.loadConfigFromJSON(dialogueConfigJSONPath).then((config: IDialogueConfig<IMiniQuestionaire>) => {
      console.log("structure", config);
      handleDialogConfigLoaded(config);
    });

    const handleDialogConfigLoaded = (config: IDialogueConfig<IMiniQuestionaire>) => {
      // Check if all graph nodes have positions to render.
      _self.dialogConfig = this.editorHelpers.enrichPositions(config);
      this.editorHelpers.enrichMetaData(_self.dialogConfig);
      console.log("Enriched meta data", _self.dialogConfig);
      this.editorHelpers.setDialogConfig(_self.dialogConfig);

      // Ad DnD support for boxes.
      if (this.currentMouseHandler) {
        this.currentMouseHandler.destroy();
        this.currentMouseHandler = null;
      }
      this.currentMouseHandler = this.editorHelpers.boxMovehandler(); // dialogConfig);

      // Ad DnD support for boxes.
      if (this.currentTouchHandler) {
        this.currentTouchHandler.destroy();
        this.currentTouchHandler = null;
      }
      this.currentTouchHandler = new TouchHandler(pb, _self.dialogConfig, this.editorHelpers);

      pb.redraw();
    };

    // Install DnD with FileDrop
    const fileDrop = new FileDrop(pb.eventCatcher);
    fileDrop.onFileJSONDropped((jsonObject: object) => {
      console.log("[onFileJSONDropped] jsonObject", jsonObject);
      // TODO: properly convert to dialog-config
      handleDialogConfigLoaded(EditorHelper.fromObject(jsonObject));
    });

    // Also accept uploads via button
    const importJSON = () => {
      document.getElementById("input-upload-file").click();
    };
    document.getElementById("b-import-json").addEventListener("click", importJSON);
    document.getElementById("input-upload-file").addEventListener("change", (_evt: Event) => {
      var fileInput = document.getElementById("input-upload-file") as HTMLInputElement;
      if (!fileInput.files || fileInput.files.length === 0) {
        return;
      }
      console.log("inputFile", fileInput.files[0]);
      var reader = new FileReader();
      reader.onload = function () {
        const jsonText = reader.result as string;
        console.log(reader.result);
        handleDialogConfigLoaded(EditorHelper.fromObject(JSON.parse(jsonText)));
      };
      reader.readAsText(fileInput.files[0]);
    });

    document.getElementById("b-run-test").addEventListener("click", () => {
      _self.testCurrentDialogueConfig();
    });
  }

  /**
   * Open a modal and test the current dialogue config (runs a RPGDialogueLogic instant).
   */
  testCurrentDialogueConfig() {
    const _self = this;
    // Create this structure:
    // <div class="rpg-output">
    //    <div class="rpg-output-question"></div>
    //    <ul class="rpg-output-options"></ul>
    // </div>

    const outputContainer = document.createElement("div");
    const outputQuestion = document.createElement("div");
    const outputOptions = document.createElement("ul");
    outputContainer.classList.add("rpg-output");
    outputQuestion.classList.add("rpg-output-question");
    outputOptions.classList.add("rpg-output-options");
    outputContainer.appendChild(outputQuestion);
    outputContainer.appendChild(outputOptions);

    const dialogueListener: IDialogueListener<IMiniQuestionaireWithPosition> = (
      dialogueConfig: IDialogueConfig<IMiniQuestionaireWithPosition>,
      nextNodeName: string,
      oldNodeName: string,
      selectedOptionIndex: number
    ) => {
      // Highlight current node in the graph editor :)
      // console.log("nextNodeName", nextNodeName, "oldNodeName", oldNodeName, "selectedOptionIndex", selectedOptionIndex);

      _self.editorHelpers.setHighlightedNode(nextNodeName);
    };

    const rpgLogic = new RPGDialogueLogic(this.dialogConfig, false);
    rpgLogic.addDialogueChangeListener(dialogueListener);
    const alternateStartNodeName: string | null = this.editorHelpers.selectedNodeName;
    this.editorHelpers.setSelectedNode(null, null);
    rpgLogic.beginConversation(outputQuestion, outputOptions, alternateStartNodeName);

    this.editorHelpers.domHelper.modal.setTitle("Test");
    this.editorHelpers.domHelper.modal.setBody(outputContainer);
    this.editorHelpers.domHelper.modal.setFooter("");
    this.editorHelpers.domHelper.modal.setActions([Modal.ACTION_CLOSE]);
    this.editorHelpers.domHelper.modal.open();
  }

  // +---------------------------------------------------------------------------------
  // | END Editor
  // +-------------------------------
}
