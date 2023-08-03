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
import { IDialogueConfig, IMiniQuestionaire, IMiniQuestionaireWithPosition, IOptionIdentifyer } from "./interfaces";
import { RPGDOMHelpers } from "./domHelpers";
import { EditorRenderer } from "./editorRenderer";

export class EditorHelper {
  pb: PlotBoilerplate;
  boxSize: XYDimension;

  // TODO: convert into node identifyer
  /**
   * The highlighted node's name or null if none is highlighted.
   * Used to highlight nodes when the mouse is over.
   */
  highlightedNodeName: string | null;

  /**
   * The highlighted node itself or null if none is highligted.
   * Used to determine rendering colors.
   */
  highlightedNode: IMiniQuestionaireWithPosition | null;

  /**
   * The selected node's name or null if none is selected.
   * Used to determine the node editor's contents.
   */
  selectedNodeName: string | null;

  /**
   * The selected node itself or null if none is selected.
   * Used to determine the node editor's contents.
   */
  selectedNode: IMiniQuestionaireWithPosition | null;

  /**
   * The currently selected option or null if none is selected.
   * Used to re-connect an option with a new successor node.
   */
  selectedOption: IOptionIdentifyer | null;

  /**
   * The currently highlighted option.
   * Used to draw on-mouse-over options with a different color.
   */
  hightlightedOption: IOptionIdentifyer | null;

  /**
   * The current mouse position (or null if mouse is not on canvas).
   * In local relative coordinate system.
   */
  relativeMousePosition: XYCoords | null;

  domHelper: RPGDOMHelpers;

  dialogConfigWithPositions: IDialogueConfig<IMiniQuestionaireWithPosition>;

  constructor(pb: PlotBoilerplate, boxSize: XYDimension) {
    this.pb = pb;
    this.boxSize = boxSize;
    this.selectedNodeName = null;
    this.domHelper = new RPGDOMHelpers(this);
  }

  setDialogConfig(dialogConfigWithPositions: IDialogueConfig<IMiniQuestionaireWithPosition>) {
    this.dialogConfigWithPositions = dialogConfigWithPositions;
  }

  setSelectedOption(selectedOption: IOptionIdentifyer | null, noRedraw?: boolean) {
    console.log("Set selected option", selectedOption);
    this.selectedOption = selectedOption;
    if (!noRedraw) {
      this.pb.redraw();
    }
  }

  setHighlightedOption(hightlightedOption: IOptionIdentifyer | null) {
    // const isRedrawRequired = this.hightlightedOption !== hightlightedOption;
    const isRedrawRequired = !this.isEqualOptionIdentifyer(this.hightlightedOption, hightlightedOption);

    this.hightlightedOption = hightlightedOption;
    if (isRedrawRequired) {
      this.pb.redraw();
    }
  }

  setHighlightedNode(nodeName: string, noRedraw?: boolean) {
    this.highlightedNodeName = nodeName;
    this.highlightedNode = nodeName ? this.dialogConfigWithPositions.graph[nodeName] : null;
    if (!noRedraw) {
      this.pb.redraw();
    }
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

  isPosInOptionNodeBox(pos: XYCoords, graphNode: IMiniQuestionaireWithPosition, optionIndex: number): boolean {
    EditorRenderer.OPTION_OFFSET_X;
    return (
      graphNode.editor.position.x + EditorRenderer.OPTION_OFFSET_X <= pos.x &&
      graphNode.editor.position.y + (optionIndex + 1) * this.boxSize.height <= pos.y &&
      graphNode.editor.position.x + EditorRenderer.OPTION_OFFSET_X + this.boxSize.width > pos.x &&
      graphNode.editor.position.y + (optionIndex + 1) * this.boxSize.height + this.boxSize.height > pos.y
    );
  }

  locateNodeBoxNameAtPos(pos: XYCoords): string | null {
    for (var nodeName in this.dialogConfigWithPositions.graph) {
      const graphNode: IMiniQuestionaireWithPosition = this.dialogConfigWithPositions.graph[nodeName];
      if (this.isPosInGraphNodeBox(pos, graphNode)) {
        return nodeName;
      }
    }
    return null;
  }

  locateOptionBoxNameAtPos(pos: XYCoords): IOptionIdentifyer {
    for (var nodeName in this.dialogConfigWithPositions.graph) {
      const graphNode: IMiniQuestionaireWithPosition = this.dialogConfigWithPositions.graph[nodeName];
      for (var i = 0; i < graphNode.o.length; i++) {
        if (this.isPosInOptionNodeBox(pos, graphNode, i)) {
          return { nodeName: nodeName, node: graphNode, optionIndex: i };
        }
      }
    }
    return null;
  }

  isNodeHighlighted(nodName: string) {
    return this.highlightedNodeName === nodName;
  }

  isOptionHighlighted(nodeName: string, optionIndex: number): boolean {
    return (
      this.hightlightedOption &&
      this.hightlightedOption.nodeName === nodeName &&
      this.hightlightedOption.optionIndex === optionIndex
    );
  }

  isOptionSelected(nodeName: string, optionIndex: number): boolean {
    return this.selectedOption && this.selectedOption.nodeName === nodeName && this.selectedOption.optionIndex === optionIndex;
  }

  addNewDialogueNode() {
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
    this.domHelper.showAnswerOptions(nodeName, newNode);
    this.pb.redraw();
  }

  removeNewDialogueNode(nodeName: string) {
    delete this.dialogConfigWithPositions.graph[nodeName];
    this.selectedNodeName = null;
    this.selectedNode = null;
    this.domHelper.showAnswerOptions(null, null);
    this.pb.redraw();
  }

  boxMovehandler() {
    const _self = this;
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
        draggingNodeName = this.locateNodeBoxNameAtPos(mouseDownPos);
        if (draggingNodeName) {
          draggingNode = this.dialogConfigWithPositions.graph[draggingNodeName];
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
      .move((evt: XMouseEvent) => {
        // console.log("move", evt);
        // Check if mouse pointer hovers over an option -> set highlighted
        const mouseMovePos = this.pb.transformMousePosition(evt.params.pos.x, evt.params.pos.y);
        _self.relativeMousePosition = { x: mouseMovePos.x, y: mouseMovePos.y };
        const hoveringOptionIdentifyer: IOptionIdentifyer = this.locateOptionBoxNameAtPos(mouseMovePos);
        // Can be null
        _self.setHighlightedOption(hoveringOptionIdentifyer);
        if (!hoveringOptionIdentifyer) {
          // Check if hover on graph node
          const hoveringNodeName = this.locateNodeBoxNameAtPos(mouseMovePos);
          this.setHighlightedNode(hoveringNodeName);
        } else {
          this.setHighlightedNode(null);
        }
      })
      .click((evt: XMouseEvent) => {
        // Stop if mouse was moved
        console.log("lastMouseDownPos", lastMouseDownPos, " evt.params.pos", evt.params.pos);
        if (lastMouseDownPos && (lastMouseDownPos.x !== evt.params.pos.x || lastMouseDownPos.y !== evt.params.pos.y)) {
          return;
        }
        // Check if mouse pointer hovers over an option -> set selected AND select node
        const mouseClickPos = this.pb.transformMousePosition(evt.params.pos.x, evt.params.pos.y);
        _self.handleClick(mouseClickPos);
      });

    return handler;
  }

  handleClick(mouseClickPos: XYCoords) {
    const clickedOptionIdentifyer: IOptionIdentifyer = this.locateOptionBoxNameAtPos(mouseClickPos);
    if (clickedOptionIdentifyer) {
      this.setSelectedOption(clickedOptionIdentifyer);
    } else {
      // Otherwise (no option was clicked) check if a node was clicked directly.
      const clickedNodeName = this.locateNodeBoxNameAtPos(mouseClickPos);
      console.log("Click", clickedNodeName);
      if (clickedNodeName) {
        if (this.selectedOption) {
          this.handleOptionReconnect(clickedNodeName);
          this.pb.redraw();
        } else {
          this.setSelectedNode(clickedNodeName, this.dialogConfigWithPositions.graph[clickedNodeName]);
          // this.pb.redraw();
        }
      } else {
        this.setSelectedNode(null, null);
        // this.selectedNode = null;
        // this.pb.redraw();
      }
      this.setSelectedOption(null, false);
    }
  }

  handleOptionReconnect(clickedNodeName: string) {
    if (!this.selectedOption) {
      // Actually this fuction should not be called at all in that case.
      console.warn("Warn: cannot reconnect option when no option is selected.");
    }
    const graph = this.dialogConfigWithPositions.graph;
    const clickedNode: IMiniQuestionaireWithPosition = graph[clickedNodeName];
    const sourceNode = this.selectedOption.node;
    console.log("Reconnect");
    sourceNode.o[this.selectedOption.optionIndex].next = clickedNodeName;

    this.domHelper.showAnswerOptions(this.selectedNodeName, this.selectedNode);
  }

  isEqualOptionIdentifyer(identA: IOptionIdentifyer, identB: IOptionIdentifyer): boolean {
    if ((!identA && identB) || (identA && !identB)) {
      return false;
    }
    if (
      (typeof identA === "undefined" && typeof identB !== "undefined") ||
      (typeof identA !== "undefined" && typeof identB === "undefined")
    ) {
      return false;
    }
    if (identA === identB || (typeof identA === "undefined" && typeof identB === "undefined")) {
      return true;
    }
    return identA.nodeName === identB.nodeName && identA.optionIndex === identB.optionIndex;
  }

  renameGraphNode(oldName: string, newName: string): boolean {
    if (!this.dialogConfigWithPositions.graph.hasOwnProperty(oldName)) {
      console.warn("Warning: cannot rename node, because old name does not exist.", oldName);
      return false;
    }
    if (oldName === "intro") {
      console.warn("Warning: cannot rename node, because 'intro' must not be renamed'.");
      return false;
    }
    if (this.dialogConfigWithPositions.graph.hasOwnProperty(newName)) {
      console.warn("Warning: cannot rename node, because new name already exists.", newName);
      return false;
    }
    if (newName === oldName) {
      console.warn("Warning: cannot rename node, because old name and new name are the same.", oldName);
      return false;
    }
    const graphNode = this.dialogConfigWithPositions.graph[oldName];
    this.dialogConfigWithPositions.graph[newName] = graphNode;
    delete this.dialogConfigWithPositions.graph[oldName];

    // Update all references
    for (var nodeName in this.dialogConfigWithPositions.graph) {
      if (!this.dialogConfigWithPositions.graph.hasOwnProperty(nodeName)) {
        continue;
      }
      const tmpNode = this.dialogConfigWithPositions.graph[nodeName];
      for (var j = 0; j < tmpNode.o.length; j++) {
        if (tmpNode.o[j].next === oldName) {
          tmpNode.o[j].next = newName;
        }
      }
    }

    // Update local selected fields
    if (oldName === this.selectedNodeName) {
      this.selectedNodeName = newName;
      this.selectedNode = this.dialogConfigWithPositions.graph[newName];
    }

    this.pb.redraw();
    return true;
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

  static removePositions(dialogueConfig: IDialogueConfig<IMiniQuestionaireWithPosition>): IDialogueConfig<IMiniQuestionaire> {
    const clone: IDialogueConfig<IMiniQuestionaire> = JSON.parse(JSON.stringify(dialogueConfig));
    for (var nodeName in clone.graph) {
      const node = clone.graph[nodeName];
      if (node.hasOwnProperty("editor")) {
        delete node["editor"];
      }
    }
    return clone;
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
