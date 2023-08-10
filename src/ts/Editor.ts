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
  pb: PlotBoilerplate;
  private autosaveTimer;
  constructor(dialogueConfigJSONPath: string, isRecoveryFromLocalStorageActive: boolean) {
    const _self = this;
    console.log("Initialize plotboilerplate");
    // Fetch the GET params
    const GUP = gup();

    const isDarkmode = detectDarkMode(GUP);

    // All config params are optional.
    this.pb = new PlotBoilerplate(
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
    this.editorHelpers = new EditorHelper(this, this.pb, boxSize);
    this.editorRenderer = new EditorRenderer(this.pb, boxSize, this.editorHelpers, isDarkmode);

    // +---------------------------------------------------------------------------------
    // | The render method.
    // +-------------------------------
    this.pb.config.postDraw = function (draw, fill) {
      if (!_self.dialogConfig) {
        return;
      }
      _self.editorRenderer.renderBoxes(_self.dialogConfig);
      _self.editorRenderer.renderConnections(_self.dialogConfig);
    };

    if (isRecoveryFromLocalStorageActive) {
      console.log("Trying to recover config from localstorage.");
      this.tryLoadFromLocalStorage()
        .then(dc => {
          _self.handleDialogConfigLoaded(dc);
        })
        .catch(() => {
          // RPGDialogueLogic.loadConfigFromJSON(dialogueConfigJSONPath).then((config: IDialogueConfig<IMiniQuestionaire>) => {
          //   console.log("structure", config);
          //   _self.handleDialogConfigLoaded(config);
          // });
          console.log("Loading from localstorage failed. Falling back loading from specified path.");
          _self.tryLoadFromJSON(dialogueConfigJSONPath);
        });
    } else {
      // RPGDialogueLogic.loadConfigFromJSON(dialogueConfigJSONPath).then((config: IDialogueConfig<IMiniQuestionaire>) => {
      //   console.log("structure", config);
      //   _self.handleDialogConfigLoaded(config);
      // });
      _self.tryLoadFromJSON(dialogueConfigJSONPath);
    }

    // Install DnD with FileDrop
    const fileDrop = new FileDrop(this.pb.eventCatcher);
    fileDrop.onFileJSONDropped((jsonObject: object) => {
      console.log("[onFileJSONDropped] jsonObject", jsonObject);
      // TODO: properly convert to dialog-config
      _self.handleDialogConfigLoaded(EditorHelper.fromObject(jsonObject));
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
        _self.handleDialogConfigLoaded(EditorHelper.fromObject(JSON.parse(jsonText)));
      };
      reader.readAsText(fileInput.files[0]);
    });

    document.getElementById("b-run-test").addEventListener("click", () => {
      _self.testCurrentDialogueConfig();
    });

    document.getElementById("b-new").addEventListener("click", _self.requestCreateNewGraph());
  }

  private tryStartAutosaveLoop() {
    if (this.autosaveTimer) {
      return;
    }
    const _self = this;
    this.autosaveTimer = globalThis.setInterval(() => {
      _self.tryAutoSave();
    }, 10000);
  }

  private tryAutoSave() {
    if (this.editorHelpers.domHelper.isAutoSave()) {
      // console.log("Putting to localstorage.");
      this.putToLocalStorage();
    }
  }

  requestCreateNewGraph(): () => void {
    const _self = this;
    return () => {
      _self.editorHelpers.domHelper.modal.setTitle("Drop current graph?");
      _self.editorHelpers.domHelper.modal.setBody(`Do you really want to create a new graph and lose unsaved changes?`);
      _self.editorHelpers.domHelper.modal.setFooter("");
      _self.editorHelpers.domHelper.modal.setActions([
        Modal.ACTION_CANCEL,
        {
          label: "Yes",
          action: () => {
            _self.editorHelpers.domHelper.modal.close();
            _self.performNewGraph();
          }
        }
      ]);
      _self.editorHelpers.domHelper.modal.open();
    };
  }

  private performNewGraph() {
    const newConfig: IDialogueConfig<IMiniQuestionaireWithPosition> = {
      meta: { name: "dialogue_A", npcs: [{ name: "NPC #0" }] },
      graph: {
        intro: { q: "Hello world!", o: [{ a: "Hello, NPC!", next: null }], editor: { position: { x: 0, y: 0 } } }
      }
    };
    this.handleDialogConfigLoaded(newConfig);
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

  private handleDialogConfigLoaded(config: IDialogueConfig<IMiniQuestionaire>) {
    // Check if all graph nodes have positions to render.
    this.dialogConfig = this.editorHelpers.enrichPositions(config);
    this.editorHelpers.enrichMetaData(this.dialogConfig);
    console.log("Enriched meta data", this.dialogConfig);
    this.editorHelpers.setDialogConfig(this.dialogConfig);

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
    this.currentTouchHandler = new TouchHandler(this.pb, this.dialogConfig, this.editorHelpers);

    this.pb.redraw();
    this.tryStartAutosaveLoop();
  }

  private putToLocalStorage() {
    const jsonString = JSON.stringify(this.dialogConfig);
    globalThis.localStorage.setItem("__rpgeditor.dialogueconfig", jsonString);
  }

  private tryLoadFromJSON(dialogueConfigJSONPath: string) {
    const _self = this;
    RPGDialogueLogic.loadConfigFromJSON(dialogueConfigJSONPath).then((config: IDialogueConfig<IMiniQuestionaire>) => {
      console.log("structure", config);
      _self.handleDialogConfigLoaded(config);
    });
  }

  private tryLoadFromLocalStorage(): Promise<IDialogueConfig<IMiniQuestionaireWithPosition>> {
    return new Promise<IDialogueConfig<IMiniQuestionaireWithPosition>>((accept, reject) => {
      const jsonString = globalThis.localStorage.getItem("__rpgeditor.dialogueconfig");
      if (!jsonString || jsonString === "") {
        reject();
      }
      try {
        const jsonObject = JSON.parse(jsonString);
        if (!jsonObject) {
          reject();
          return;
        }
        const dialogueConfig = EditorHelper.fromObject(jsonObject);
        accept(dialogueConfig);
      } catch (exception) {
        console.warn(exception);
        reject();
      }
    });
  }

  // +---------------------------------------------------------------------------------
  // | END Editor
  // +-------------------------------
}
