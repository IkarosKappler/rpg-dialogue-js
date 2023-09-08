/**
 * Helpers for the graph editor.
 *
 * @require PlotBoilerplate
 *
 * @author   Ikaros Kappler
 * @date     2023-07-28
 * @version  1.0.0
 **/
import { MouseHandler } from "plotboilerplate";
import { RPGDOMHelpers } from "./domHelpers";
import { EditorRenderer } from "./editorRenderer";
import { DialogueMetaHelpers } from "./metaHelpers";
var EditorHelper = /** @class */ (function () {
    function EditorHelper(editor, pb, boxSize) {
        // TODO: convert into node identifyer
        /**
         * The highlighted node's name or null if none is highlighted.
         * Used to highlight nodes when the mouse is over.
         */
        this.highlightedNodeName = null;
        /**
         * The highlighted node itself or null if none is highligted.
         * Used to determine rendering colors.
         */
        this.highlightedNode = null;
        /**
         * The selected node's name or null if none is selected.
         * Used to determine the node editor's contents.
         */
        this.selectedNodeName = null;
        /**
         * The selected node itself or null if none is selected.
         * Used to determine the node editor's contents.
         */
        this.selectedNode = null;
        /**
         * The currently selected option or null if none is selected.
         * Used to re-connect an option with a new successor node.
         */
        this.selectedOption = null;
        /**
         * The currently highlighted option.
         * Used to draw on-mouse-over options with a different color.
         */
        this.hightlightedOption = null;
        /**
         * The current mouse position (or null if mouse is not on canvas).
         * In local relative coordinate system.
         */
        this.relativeMousePosition = null;
        this.editor = editor;
        this.pb = pb;
        this.boxSize = boxSize;
        this.selectedNodeName = null;
        this.domHelper = new RPGDOMHelpers(this);
        this.metaHelpers = new DialogueMetaHelpers(this);
    }
    EditorHelper.prototype.setDialogConfig = function (dialogConfigWithPositions) {
        this.dialogConfigWithPositions = dialogConfigWithPositions;
    };
    EditorHelper.prototype.setSelectedOption = function (selectedOption, noRedraw) {
        // console.log("Set selected option", selectedOption);
        this.selectedOption = selectedOption;
        if (!noRedraw) {
            this.pb.redraw();
        }
    };
    EditorHelper.prototype.setHighlightedOption = function (hightlightedOption) {
        // const isRedrawRequired = this.hightlightedOption !== hightlightedOption;
        var isRedrawRequired = !this.isEqualOptionIdentifyer(this.hightlightedOption, hightlightedOption);
        this.hightlightedOption = hightlightedOption;
        if (isRedrawRequired) {
            this.pb.redraw();
        }
    };
    EditorHelper.prototype.setHighlightedNode = function (nodeName, noRedraw) {
        this.highlightedNodeName = nodeName;
        this.highlightedNode = nodeName ? this.dialogConfigWithPositions.graph[nodeName] : null;
        if (!noRedraw) {
            this.pb.redraw();
        }
    };
    /**
     * A helper function to create random safe positions in the viewport area.
     * @param {PlotBoilerplate} pb
     * @param {XYDimension} boxSize
     * @returns
     */
    EditorHelper.prototype.getRandomPosition = function () {
        var viewport = this.pb.viewport();
        return {
            x: viewport.min.x + this.boxSize.width + (viewport.width - 2 * this.boxSize.width) * Math.random(),
            y: viewport.min.y + this.boxSize.height + (viewport.height - 2 * this.boxSize.height) * Math.random()
        };
    };
    EditorHelper.prototype.setSelectedNode = function (nodeName, node) {
        this.selectedNodeName = nodeName;
        this.selectedNode = node;
        if (nodeName && node) {
            // this.domHelper.editorElement.classList.remove("d-none");
            this.domHelper.toggleVisibility(true);
            this.domHelper.showAnswerOptions(nodeName, this.selectedNode);
        }
        else {
            // this.domHelper.editorElement.classList.add("d-none");
            this.domHelper.toggleVisibility(false);
            this.domHelper.showAnswerOptions(null, null);
        }
        this.pb.redraw();
    };
    /**
     * A helper function to make sure all graph nodes have valid positions. Those without
     * valid positions (eg like those being loaded from an incomplete JSON file) will be
     * assigned to a random position inside the viewport.
     *
     * @param {PlotBoilerplate} pb
     * @param {XYDimension} boxSize
     * @returns
     */
    EditorHelper.prototype.enrichPositions = function (baseConfig) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        // Clone?
        var configWithPositions = baseConfig;
        for (var nodeName in configWithPositions.graph) {
            var graphNode = configWithPositions.graph[nodeName];
            if (!graphNode) {
                console.warn("Warning: graph node ".concat(nodeName, " is null or undefined!"));
                continue;
            }
            // Anonymous member check
            if (!graphNode.hasOwnProperty("editor")) {
                graphNode.editor = { position: this.getRandomPosition() };
            }
            else if (!graphNode.editor.hasOwnProperty("position")) {
                graphNode.editor.position = this.getRandomPosition();
            }
            else {
                if (!graphNode.editor.position.hasOwnProperty("x") || isNaN((_c = (_b = (_a = graphNode.editor) === null || _a === void 0 ? void 0 : _a.position) === null || _b === void 0 ? void 0 : _b.x) !== null && _c !== void 0 ? _c : NaN)) {
                    if ((_d = graphNode.editor) === null || _d === void 0 ? void 0 : _d.position) {
                        graphNode.editor.position.x = this.getRandomPosition().x;
                    }
                }
                if (!graphNode.editor.position.hasOwnProperty("y") || isNaN((_g = (_f = (_e = graphNode.editor) === null || _e === void 0 ? void 0 : _e.position) === null || _f === void 0 ? void 0 : _f.y) !== null && _g !== void 0 ? _g : NaN)) {
                    if ((_h = graphNode.editor) === null || _h === void 0 ? void 0 : _h.position) {
                        graphNode.editor.position.y = this.getRandomPosition().y;
                    }
                }
            }
        }
        return configWithPositions;
    };
    /**
     * Check if the meta data is valid and – if not – add missing default fields.
     * @param dialogueConfig
     */
    EditorHelper.prototype.enrichMetaData = function (dialogueConfig) {
        var result = dialogueConfig;
        if (!dialogueConfig.hasOwnProperty("meta")) {
            result.meta = { name: "noname", npcs: [] };
        }
        if (!result.meta.npcs) {
            result.meta.npcs = [];
        }
        if (result.meta.npcs.length === 0) {
            result.meta.npcs.push({ name: "NPC #0" });
        }
    };
    EditorHelper.prototype.isPosInGraphNodeBox = function (pos, graphNode) {
        return Boolean(graphNode.editor &&
            graphNode.editor.position &&
            graphNode.editor.position.x <= pos.x &&
            graphNode.editor.position.y <= pos.y &&
            graphNode.editor.position.x + this.boxSize.width > pos.x &&
            graphNode.editor.position.y + this.boxSize.height > pos.y);
    };
    EditorHelper.prototype.isPosInOptionNodeBox = function (pos, graphNode, optionIndex) {
        // EditorRenderer.OPTION_OFFSET_X;
        return Boolean(graphNode.editor &&
            graphNode.editor.position &&
            graphNode.editor.position.x + EditorRenderer.OPTION_OFFSET_X <= pos.x &&
            graphNode.editor.position.y + (optionIndex + 1) * this.boxSize.height <= pos.y &&
            graphNode.editor.position.x + EditorRenderer.OPTION_OFFSET_X + this.boxSize.width > pos.x &&
            graphNode.editor.position.y + (optionIndex + 1) * this.boxSize.height + this.boxSize.height > pos.y);
    };
    EditorHelper.prototype.locateNodeBoxNameAtPos = function (pos) {
        for (var nodeName in this.dialogConfigWithPositions.graph) {
            var graphNode = this.dialogConfigWithPositions.graph[nodeName];
            if (this.isPosInGraphNodeBox(pos, graphNode)) {
                return nodeName;
            }
        }
        return null;
    };
    EditorHelper.prototype.locateOptionBoxNameAtPos = function (pos) {
        for (var nodeName in this.dialogConfigWithPositions.graph) {
            var graphNode = this.dialogConfigWithPositions.graph[nodeName];
            for (var i = 0; i < graphNode.o.length; i++) {
                if (this.isPosInOptionNodeBox(pos, graphNode, i)) {
                    return { nodeName: nodeName, node: graphNode, optionIndex: i };
                }
            }
        }
        return null;
    };
    EditorHelper.prototype.isNodeHighlighted = function (nodName) {
        return this.highlightedNodeName === nodName;
    };
    EditorHelper.prototype.isOptionHighlighted = function (nodeName, optionIndex) {
        return Boolean(this.hightlightedOption &&
            this.hightlightedOption.nodeName === nodeName &&
            this.hightlightedOption.optionIndex === optionIndex);
    };
    EditorHelper.prototype.isOptionSelected = function (nodeName, optionIndex) {
        return Boolean(this.selectedOption && this.selectedOption.nodeName === nodeName && this.selectedOption.optionIndex === optionIndex);
    };
    EditorHelper.prototype.addNewDialogueNode = function () {
        // Place two box units to the right if currently there is a selected node.
        // Otherwise random position.
        var position = this.selectedNode && this.selectedNode.editor && this.selectedNode.editor.position
            ? {
                x: this.selectedNode.editor.position.x + 2 * this.boxSize.width,
                y: this.selectedNode.editor.position.y + this.boxSize.height
            }
            : this.getRandomPosition();
        var nodeName = this.randomNodeKey();
        var newNode = {
            q: "",
            o: [{ a: "", next: null }],
            editor: {
                position: position
            }
        };
        this.dialogConfigWithPositions.graph[nodeName] = newNode;
        this.selectedNodeName = nodeName;
        this.selectedNode = newNode;
        this.domHelper.showAnswerOptions(nodeName, newNode);
        this.pb.redraw();
    };
    EditorHelper.prototype.removeNewDialogueNode = function (nodeName) {
        delete this.dialogConfigWithPositions.graph[nodeName];
        this.selectedNodeName = null;
        this.selectedNode = null;
        this.domHelper.showAnswerOptions(null, null);
        this.pb.redraw();
    };
    EditorHelper.prototype.boxMovehandler = function () {
        var _this = this;
        var _self = this;
        // +---------------------------------------------------------------------------------
        // | Add a mouse listener to track the mouse position.
        // +-------------------------------
        var mouseDownPos = null;
        var lastMouseDownPos = null;
        var draggingNode = null;
        var draggingNodeName = null;
        var handler = new MouseHandler(this.pb.eventCatcher)
            .down(function (evt) {
            mouseDownPos = _this.pb.transformMousePosition(evt.params.mouseDownPos.x, evt.params.mouseDownPos.y);
            lastMouseDownPos = { x: evt.params.mouseDownPos.x, y: evt.params.mouseDownPos.y };
            draggingNodeName = _this.locateNodeBoxNameAtPos(mouseDownPos);
            if (draggingNodeName) {
                draggingNode = _this.dialogConfigWithPositions.graph[draggingNodeName];
            }
        })
            .up(function (_evt) {
            mouseDownPos = null;
            draggingNode = null;
        })
            .drag(function (evt) {
            if (!mouseDownPos || !draggingNode || !draggingNode.editor || !draggingNode.editor.position) {
                return;
            }
            // const diff = evt.params.dragAmount;
            draggingNode.editor.position.x += evt.params.dragAmount.x / _this.pb.draw.scale.x;
            draggingNode.editor.position.y += evt.params.dragAmount.y / _this.pb.draw.scale.y;
        })
            .move(function (evt) {
            // console.log("move", evt);
            // Check if mouse pointer hovers over an option -> set highlighted
            var mouseMovePos = _this.pb.transformMousePosition(evt.params.pos.x, evt.params.pos.y);
            _self.relativeMousePosition = { x: mouseMovePos.x, y: mouseMovePos.y };
            var hoveringOptionIdentifyer = _this.locateOptionBoxNameAtPos(mouseMovePos);
            // Can be null
            _self.setHighlightedOption(hoveringOptionIdentifyer);
            if (!hoveringOptionIdentifyer) {
                // Check if hover on graph node
                var hoveringNodeName = _this.locateNodeBoxNameAtPos(mouseMovePos);
                _this.setHighlightedNode(hoveringNodeName);
            }
            else {
                _this.setHighlightedNode(null);
            }
        })
            .click(function (evt) {
            // Stop if mouse was moved
            // console.log("lastMouseDownPos", lastMouseDownPos, " evt.params.pos", evt.params.pos);
            if (lastMouseDownPos && (lastMouseDownPos.x !== evt.params.pos.x || lastMouseDownPos.y !== evt.params.pos.y)) {
                return;
            }
            // Check if mouse pointer hovers over an option -> set selected AND select node
            var mouseClickPos = _this.pb.transformMousePosition(evt.params.pos.x, evt.params.pos.y);
            _self.handleClick(mouseClickPos);
        });
        return handler;
    };
    /**
     * Check if a question box or an answer box was clicked.
     * @param mouseClickPos
     */
    EditorHelper.prototype.handleClick = function (mouseClickPos) {
        var clickedOptionIdentifyer = this.locateOptionBoxNameAtPos(mouseClickPos);
        if (clickedOptionIdentifyer) {
            this.setSelectedOption(clickedOptionIdentifyer);
        }
        else {
            // Otherwise (no option was clicked) check if a node was clicked directly.
            var clickedNodeName = this.locateNodeBoxNameAtPos(mouseClickPos);
            // console.log("Click", clickedNodeName);
            if (clickedNodeName) {
                if (this.selectedOption) {
                    this.handleOptionReconnect(clickedNodeName);
                    this.pb.redraw();
                }
                else {
                    this.setSelectedNode(clickedNodeName, this.dialogConfigWithPositions.graph[clickedNodeName]);
                }
            }
            else {
                this.setSelectedNode(null, null);
            }
            this.setSelectedOption(null, false);
        }
    };
    EditorHelper.prototype.handleOptionReconnect = function (clickedNodeName) {
        if (!this.selectedOption) {
            // && !this.selectedNodeName) {
            // Actually this fuction should not be called at all in that case.
            console.warn("Warn: cannot reconnect option when no option is selected.");
            return;
        }
        var graph = this.dialogConfigWithPositions.graph;
        var clickedNode = graph[clickedNodeName];
        var sourceNode = this.selectedOption.node;
        // console.log("Reconnect");
        sourceNode.o[this.selectedOption.optionIndex].next = clickedNodeName;
        this.domHelper.showAnswerOptions(this.selectedNodeName, this.selectedNode);
    };
    EditorHelper.prototype.isEqualOptionIdentifyer = function (identA, identB) {
        if ((!identA && identB) || (identA && !identB)) {
            return false;
        }
        if ((typeof identA === "undefined" && typeof identB !== "undefined") ||
            (typeof identA !== "undefined" && typeof identB === "undefined")) {
            return false;
        }
        if (identA === identB || (typeof identA === "undefined" && typeof identB === "undefined")) {
            return true;
        }
        return (identA === null || identA === void 0 ? void 0 : identA.nodeName) === (identB === null || identB === void 0 ? void 0 : identB.nodeName) && (identA === null || identA === void 0 ? void 0 : identA.optionIndex) === (identB === null || identB === void 0 ? void 0 : identB.optionIndex);
    };
    EditorHelper.prototype.renameGraphNode = function (oldName, newName) {
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
        var graphNode = this.dialogConfigWithPositions.graph[oldName];
        this.dialogConfigWithPositions.graph[newName] = graphNode;
        delete this.dialogConfigWithPositions.graph[oldName];
        // Update all references
        for (var nodeName in this.dialogConfigWithPositions.graph) {
            if (!this.dialogConfigWithPositions.graph.hasOwnProperty(nodeName)) {
                continue;
            }
            var tmpNode = this.dialogConfigWithPositions.graph[nodeName];
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
    };
    EditorHelper.ellipsify = function (text, maxLength) {
        if (!text || text.length <= maxLength) {
            return text;
        }
        return "".concat(text.substring(0, maxLength), "...");
    };
    EditorHelper.fromObject = function (object) {
        // Must be of type object
        if (typeof object !== "object") {
            throw "Cannot convert non-objects to dialogue config: type is ".concat(typeof object, ".");
        }
        // Must have a 'graph' member.
        if (!object.hasOwnProperty("graph")) {
            throw "Cannot convert object to dialogue config: object missing member `graph`.";
        }
        var graph = object["graph"];
        // Check if 'intro' is present?
        // All members must be of correct type
        for (var key in object) {
            if (!object.hasOwnProperty(key)) {
                continue;
            }
            var questionaire = object[key];
            if (typeof questionaire !== "object") {
                throw "Cannot converto bject to dialogue config: all graph members must be objects.";
            }
            // Check if 'q' (string) and 'o' (array) attributes are present?
        }
        return object;
    };
    EditorHelper.removePositions = function (dialogueConfig) {
        var clone = JSON.parse(JSON.stringify(dialogueConfig));
        for (var nodeName in clone.graph) {
            var node = clone.graph[nodeName];
            if (node.hasOwnProperty("editor")) {
                delete node["editor"];
            }
        }
        return clone;
    };
    EditorHelper.prototype.randomNodeKey = function () {
        var keys = Object.keys(this.dialogConfigWithPositions.graph);
        var count = keys.length;
        var key = "dia_" + count;
        while (this.dialogConfigWithPositions.graph.hasOwnProperty(key)) {
            key = "dia_" + count;
            count++;
        }
        return key;
    };
    return EditorHelper;
}());
export { EditorHelper };
//# sourceMappingURL=editorHelpers.js.map