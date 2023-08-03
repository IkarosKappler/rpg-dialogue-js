/**
 * Helpers for the graph editor.
 *
 * @require PlotBoilerplate
 *
 * @author   Ikaros Kappler
 * @date     2023-07-28
 * @version  1.0.0
 **/

import { MouseHandler, PlotBoilerplate, XMouseEvent, XYCoords, XYDimension } from "plotboilerplate";
import { IDialogueConfig, IMiniQuestionaire, IMiniQuestionaireWithPosition } from "./interfaces";
import { RPGDOMHelpers } from "./domHelpers";

export class EditorHelper {
  pb: PlotBoilerplate;
  boxSize: XYDimension;

  selectedNodeName: string;
  selectedNode: IMiniQuestionaireWithPosition;

  domHelper: RPGDOMHelpers;

  dialogConfigWithPositions: IDialogueConfig<IMiniQuestionaireWithPosition>;

  constructor(pb: PlotBoilerplate, boxSize: XYDimension) {
    this.pb = pb;
    this.boxSize = boxSize;
    this.selectedNodeName = null;
    this.domHelper = new RPGDOMHelpers(this, null);
  }

  setDialogConfig(dialogConfigWithPositions: IDialogueConfig<IMiniQuestionaireWithPosition>) {
    this.dialogConfigWithPositions = dialogConfigWithPositions;
  }

  /**
   * A helper function to create random safe positions in the viewport area.
   * @param {PlotBoilerplate} pb
   * @param {XYDimension} boxSize
   * @returns
   */
  getRandomPosition(): XYCoords {
    const viewport = this.pb.viewport();
    return {
      x: viewport.min.x + this.boxSize.width + (viewport.width - 2 * this.boxSize.width) * Math.random(),
      y: viewport.min.y + this.boxSize.height + (viewport.height - 2 * this.boxSize.height) * Math.random()
    };
  }

  setSelectedNode(nodeName: string, node: IMiniQuestionaireWithPosition) {
    this.selectedNodeName = nodeName;

    if (nodeName) {
      this.selectedNodeName = nodeName;
      this.selectedNode = node;
      // this.domHelper.editorElement.classList.remove("d-none");
      this.domHelper.toggleVisibility(true);
      this.domHelper.showAnswerOptions(nodeName, this.selectedNode);
    } else {
      // this.domHelper.editorElement.classList.add("d-none");
      this.domHelper.toggleVisibility(false);
      this.domHelper.showAnswerOptions(null, null);
    }
    this.pb.redraw();
  }

  /**
   * A helper function to make sure all graph nodes have valid positions. Those without
   * valid positions (eg like those being loaded from an incomplete JSON file) will be
   * assigned to a random position inside the viewport.
   *
   * @param {PlotBoilerplate} pb
   * @param {XYDimension} boxSize
   * @returns
   */
  enrichPositions(baseConfig: IDialogueConfig<IMiniQuestionaire>): IDialogueConfig<IMiniQuestionaireWithPosition> {
    // Clone?
    const configWithPositions: IDialogueConfig<IMiniQuestionaireWithPosition> =
      baseConfig as IDialogueConfig<IMiniQuestionaireWithPosition>;

    for (var nodeName in configWithPositions.graph) {
      const graphNode: IMiniQuestionaireWithPosition = configWithPositions.graph[nodeName];
      if (!graphNode) {
        console.warn(`Warning: graph node ${nodeName} is null or undefined!`);
        continue;
      }
      // Anonymous member check
      if (!graphNode.hasOwnProperty("editor")) {
        graphNode.editor = { position: this.getRandomPosition() };
      } else if (!graphNode.editor.hasOwnProperty("position")) {
        graphNode.editor.position = this.getRandomPosition();
      } else {
        if (!graphNode.editor.position.hasOwnProperty("x") || isNaN(graphNode.editor.position.x)) {
          graphNode.editor.position.x = this.getRandomPosition().x;
        }
        if (!graphNode.editor.position.hasOwnProperty("y") || isNaN(graphNode.editor.position.y)) {
          graphNode.editor.position.y = this.getRandomPosition().y;
        }
      }
    }

    return configWithPositions;
  }

  isPosInGraphNodeBox(pos: XYCoords, graphNode: IMiniQuestionaireWithPosition): boolean {
    return (
      graphNode.editor.position.x <= pos.x &&
      graphNode.editor.position.y <= pos.y &&
      graphNode.editor.position.x + this.boxSize.width > pos.x &&
      graphNode.editor.position.y + this.boxSize.height > pos.y
    );
  }

  locateBoxNameAtPos(pos: XYCoords, dialogConfigWithPositions: IDialogueConfig<IMiniQuestionaireWithPosition>): string | null {
    for (var nodeName in dialogConfigWithPositions.graph) {
      const graphNode: IMiniQuestionaireWithPosition = dialogConfigWithPositions.graph[nodeName];
      if (this.isPosInGraphNodeBox(pos, graphNode)) {
        return nodeName;
      }
    }
    return null;
  }

  addNewDialogueNode() {
    // graph: IDialogueGraph<IMiniQuestionaireWithPosition>
    // const graph: IDialogueGraph<IMiniQuestionaireWithPosition> = _self.editorHelpers.dialogConfigWithPositions.graph;
    const nodeName = this.randomNodeKey();
    const newNode: IMiniQuestionaireWithPosition = {
      q: "",
      o: [{ a: "", next: null }],
      editor: {
        position: this.getRandomPosition()
      }
    };

    this.dialogConfigWithPositions.graph[nodeName] = newNode;
    this.selectedNodeName = nodeName;
    this.selectedNode = newNode;

    // _self.currentGraphNode[nodeName] = newNode;
    this.domHelper.showAnswerOptions(nodeName, newNode);
    // _self.updateAnswerOptions();
    this.pb.redraw();
  }

  boxMovehandler(dialogConfigWithPositions: IDialogueConfig<IMiniQuestionaireWithPosition>) {
    // +---------------------------------------------------------------------------------
    // | Add a mouse listener to track the mouse position.
    // +-------------------------------
    var mouseDownPos: XYCoords = null;
    var lastMouseDownPos: XYCoords = null;
    var draggingNode: IMiniQuestionaireWithPosition = null;
    var draggingNodeName: string = null;
    const handler = new MouseHandler(this.pb.eventCatcher)
      .down((evt: XMouseEvent) => {
        mouseDownPos = this.pb.transformMousePosition(evt.params.mouseDownPos.x, evt.params.mouseDownPos.y);
        lastMouseDownPos = { x: evt.params.mouseDownPos.x, y: evt.params.mouseDownPos.y };
        draggingNodeName = this.locateBoxNameAtPos(mouseDownPos, dialogConfigWithPositions);
        if (draggingNodeName) {
          draggingNode = dialogConfigWithPositions.graph[draggingNodeName];
        }
      })
      .up((_evt: XMouseEvent) => {
        mouseDownPos = null;
        draggingNode = null;
      })
      .drag((evt: XMouseEvent) => {
        if (!mouseDownPos || !draggingNode) {
          return;
        }
        // const diff = evt.params.dragAmount;
        draggingNode.editor.position.x += evt.params.dragAmount.x / this.pb.draw.scale.x;
        draggingNode.editor.position.y += evt.params.dragAmount.y / this.pb.draw.scale.y;
      })
      .click((evt: XMouseEvent) => {
        // Stop if mouse was moved
        console.log("lastMouseDownPos", lastMouseDownPos, " evt.params.pos", evt.params.pos);
        if (lastMouseDownPos && (lastMouseDownPos.x !== evt.params.pos.x || lastMouseDownPos.y !== evt.params.pos.y)) {
          return;
        }
        const mouseClickPos = this.pb.transformMousePosition(evt.params.pos.x, evt.params.pos.y);
        const clickedNodeName = this.locateBoxNameAtPos(mouseClickPos, dialogConfigWithPositions);
        console.log("Click", clickedNodeName);
        if (clickedNodeName) {
          this.setSelectedNode(clickedNodeName, dialogConfigWithPositions.graph[clickedNodeName]);
          // this.pb.redraw();
        } else {
          this.setSelectedNode(null, null);
          // this.selectedNode = null;
          // this.pb.redraw();
        }
      });

    return handler;
  }

  static ellipsify(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) {
      return text;
    }
    return `${text.substring(0, maxLength)}...`;
  }

  static fromObject(object: object): IDialogueConfig<IMiniQuestionaire> {
    // Must be of type object
    if (typeof object !== "object") {
      throw `Cannot convert non-objects to dialogue config: type is ${typeof object}.`;
    }

    // Must have a 'graph' member.
    if (!object.hasOwnProperty("graph")) {
      throw "Cannot convert object to dialogue config: object missing member `graph`.";
    }

    const graph = object["graph"];
    // Check if 'intro' is present?

    // All members must be of correct type
    for (var key in object) {
      if (!object.hasOwnProperty(key)) {
        continue;
      }
      const questionaire = object[key];
      if (typeof questionaire !== "object") {
        throw "Cannot converto bject to dialogue config: all graph members must be objects.";
      }

      // Check if 'q' (string) and 'o' (array) attributes are present?
    }

    return object as IDialogueConfig<IMiniQuestionaire>;
  }

  private randomNodeKey(): string {
    const keys = Object.keys(this.dialogConfigWithPositions.graph);
    var count = keys.length;
    let key = "New " + count;
    while (this.dialogConfigWithPositions.graph.hasOwnProperty(key)) {
      key = "New " + count;
      count++;
    }
    return key;
  }
}
