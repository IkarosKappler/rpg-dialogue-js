"use strict";
/**
 * A script for demonstrating the line-point-distance.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui
 *
 * @author   Ikaros Kappler
 * @date     2023-08-01
 * @version  1.0.0
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPGDOMHelpers = void 0;
var TouchHandler_1 = require("./TouchHandler");
var editorHelpers_1 = require("./editorHelpers");
var modal_1 = require("./modal");
var RPGDOMHelpers = /** @class */ (function () {
    function RPGDOMHelpers(editorHelpers) {
        this.currentDraggedAnswerIndex = -1;
        this.currentDropAnswerIndex = -1;
        this.editorHelpers = editorHelpers;
        this.touchEnterLeaveHandler = new TouchHandler_1.TouchEnterLeaveHandler();
        this.editorElement = document.getElementById("attribute-editor");
        this.optionsElement = document.getElementById("e-options-container");
        this.keyElement = this.editorElement.querySelector("input#e-key");
        this.npcElement = this.editorElement.querySelector("select#e-npc-index");
        this.qElement = this.editorElement.querySelector("textarea#e-q");
        this.qElement.addEventListener("change", this.handleQChanged(this));
        this.npcElement.addEventListener("change", this.handleNPCIndexChanged(this));
        this.keyElement.addEventListener("change", this.handleKeyChanged(this));
        this.modal = new modal_1.Modal();
        document.getElementById("b-export-json").addEventListener("click", this.exportJSON(this));
        document.getElementById("b-add-answer-option").addEventListener("click", this.addAnswerOption(this));
        document.getElementById("b-add-dialogue-node").addEventListener("click", this.addDialogueNode(this));
        document.getElementById("b-delete-dialogue-node").addEventListener("click", this.requestRemoveDialogueNode(this));
    }
    RPGDOMHelpers.prototype.isExportWithoutPositions = function () {
        var checkbox = document.getElementById("cb-export-without-positions");
        return checkbox.checked;
    };
    RPGDOMHelpers.prototype.exportJSON = function (_self) {
        return function () {
            var removePositions = _self.isExportWithoutPositions();
            var dConfig = removePositions
                ? editorHelpers_1.EditorHelper.removePositions(_self.editorHelpers.dialogConfigWithPositions)
                : _self.editorHelpers.dialogConfigWithPositions;
            var jsonString = JSON.stringify(dConfig);
            var blob = new Blob([jsonString], { type: "application/json" });
            var url = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = url;
            a.download = "dialog-config.json";
            a.textContent = "Download backup.json";
            a.click();
        };
    };
    RPGDOMHelpers.prototype.addAnswerOption = function (_self) {
        return function () {
            var newOption = {
                a: "",
                next: null
            };
            _self.currentGraphNode.o.push(newOption);
            _self.updateAnswerOptions();
            _self.editorHelpers.pb.redraw();
        };
    };
    RPGDOMHelpers.prototype.addDialogueNode = function (_self) {
        return function () {
            _self.editorHelpers.addNewDialogueNode();
        };
    };
    RPGDOMHelpers.prototype.requestRemoveDialogueNode = function (_self) {
        return function () {
            _self.modal.setTitle("Delete option?");
            _self.modal.setBody("Do you really want to delete the current dialoge node '".concat(_self.currentNodeName, "'?"));
            _self.modal.setFooter("");
            _self.modal.setActions([
                modal_1.Modal.ACTION_CANCEL,
                {
                    label: "Yes",
                    action: function () {
                        _self.modal.close();
                        _self.removeDialogueNode();
                    }
                }
            ]);
            _self.modal.open();
        };
    };
    RPGDOMHelpers.prototype.removeDialogueNode = function () {
        this.editorHelpers.removeNewDialogueNode(this.currentNodeName);
        this.toggleVisibility(false);
    };
    RPGDOMHelpers.prototype.toggleVisibility = function (isVisible) {
        if (isVisible) {
            this.editorElement.classList.remove("d-none");
        }
        else {
            this.editorElement.classList.add("d-none");
        }
    };
    RPGDOMHelpers.prototype.handleQChanged = function (_self) {
        return function (changeEvent) {
            _self.currentGraphNode.q = changeEvent.target.value;
            _self.editorHelpers.pb.redraw();
        };
    };
    RPGDOMHelpers.prototype.handleNPCIndexChanged = function (_self) {
        var _this = this;
        return function (_changeEvent) {
            var newIndex = parseInt(_this.npcElement.value);
            if (Number.isNaN(newIndex)) {
                newIndex = -1;
            }
            _self.currentGraphNode.npcIndex = newIndex;
        };
    };
    RPGDOMHelpers.prototype.handleKeyChanged = function (_self) {
        var _this = this;
        return function (_changeEvent) {
            var newName = _this.keyElement.value;
            if (!newName || (newName = newName.trim()).length === 0) {
                return;
            }
            var renameSuccessful = _self.editorHelpers.renameGraphNode(_self.currentNodeName, newName);
            if (renameSuccessful) {
                _self.currentNodeName = newName;
            }
        };
    };
    RPGDOMHelpers.prototype.handleATextChanged = function (_self, answer) {
        return function (changeEvent) {
            answer.a = changeEvent.target.value;
            _self.editorHelpers.pb.redraw();
        };
    };
    RPGDOMHelpers.prototype.handleASuccessorChanged = function (_self, answer) {
        return function (changeEvent) {
            answer.next = changeEvent.target.value;
            _self.editorHelpers.pb.redraw();
        };
    };
    RPGDOMHelpers.prototype.updateAnswerOptions = function () {
        this.showAnswerOptions(this.currentNodeName, this.currentGraphNode);
    };
    RPGDOMHelpers.prototype.getSelectedNpcIndex = function () {
        return typeof this.currentGraphNode.npcIndex === "undefined" || Number.isNaN(this.currentGraphNode.npcIndex)
            ? 0
            : this.currentGraphNode.npcIndex;
    };
    RPGDOMHelpers.prototype.updateNpcSelector = function () {
        if (!this.currentGraphNode) {
            return;
        }
        this.npcElement.innerHTML = "";
        var curNpcIndex = this.getSelectedNpcIndex();
        // console.log("this.currentGraphNode.npcIndex", this.currentGraphNode.npcIndex, "curNpcIndex", curNpcIndex);
        for (var i = 0; i < this.editorHelpers.dialogConfigWithPositions.meta.npcs.length; i++) {
            var npcOption = document.createElement("option");
            npcOption.setAttribute("value", "".concat(i));
            if (i === 0) {
                npcOption.innerHTML = "".concat(this.editorHelpers.dialogConfigWithPositions.meta.npcs[i].name, " (default)");
            }
            else {
                npcOption.innerHTML = this.editorHelpers.dialogConfigWithPositions.meta.npcs[i].name;
            }
            if (i === curNpcIndex) {
                npcOption.setAttribute("selected", "true");
                npcOption.selected = true;
            }
            this.npcElement.appendChild(npcOption);
        }
        this.npcElement.value = "".concat(curNpcIndex);
        this.npcElement.setAttribute("value", "".concat(curNpcIndex));
    };
    RPGDOMHelpers.prototype.toggleDragEnterStyles = function (target) {
        // console.log("toggleDragEnterStyles");
        var answerIndex = this.currentDraggedAnswerIndex;
        var dropIndex = parseInt(target.getAttribute("data-dropindex"));
        if (target.classList.contains("droppable") && answerIndex !== dropIndex && answerIndex + 1 !== dropIndex) {
            target.classList.add("dragover");
        }
    };
    RPGDOMHelpers.prototype.toggleDragLeaveStyles = function (target) {
        console.log("toggleDragLeaveStyles");
        if (target.classList.contains("droppable")) {
            target.classList.remove("dragover");
        }
    };
    RPGDOMHelpers.prototype.showAnswerOptions = function (nodeName, graphNode) {
        var _self = this;
        this.currentNodeName = nodeName;
        this.currentGraphNode = graphNode;
        this.keyElement.setAttribute("value", nodeName ? nodeName : "");
        this.keyElement.value = nodeName ? nodeName : "";
        // console.log("showAnswerOptions", this.currentGraphNode);
        this.updateNpcSelector();
        this.optionsElement.innerHTML = "";
        this.npcElement.value = !graphNode || Number.isNaN(graphNode.npcIndex) ? "0" : "".concat(graphNode.npcIndex);
        this.qElement.setAttribute("value", graphNode ? graphNode.q : "");
        this.qElement.value = graphNode ? graphNode.q : "";
        if (!graphNode) {
            return;
        }
        var onDragOver = function (ev) {
            console.log("ondragover", ev.target);
            ev.preventDefault();
            var target = ev.target;
            _self.toggleDragEnterStyles(target);
        };
        var onDragLeave = function (ev) {
            console.log("ondragleave", ev.target);
            ev.preventDefault();
            var target = ev.target;
            _self.toggleDragLeaveStyles(target);
        };
        /**
         * Native browser DnD does not support touch events.
         * So we need a workaround using our custom TouchEnterLeaverHandler here.
         */
        _self.touchEnterLeaveHandler.onTouchEnter(".a-droparea", function (element) {
            console.log("onTouchEnter", element);
            if (!element.classList.contains("a-droparea")) {
                return;
            }
            _self.currentDropAnswerIndex = parseInt(element.getAttribute("data-dropIndex"));
            _self.toggleDragEnterStyles(element);
        });
        _self.touchEnterLeaveHandler.onTouchLeave(".a-droparea", function (element) {
            console.log("onTouchLeave", element);
            _self.currentDropAnswerIndex = -1;
            _self.toggleDragLeaveStyles(element);
        });
        var drop = function (ev) {
            console.log("Drop", ev);
            ev.preventDefault();
            var target = ev.target;
            // const answerIndex = parseInt(ev.dataTransfer.getData("answerindex"));
            var answerIndex = _self.currentDraggedAnswerIndex;
            var dropIndex = parseInt(target.getAttribute("data-dropindex"));
            console.log("Move", answerIndex, "to", dropIndex);
            // target.appendChild(document.getElementById(data));
            if (!target.classList.contains("droppable") || answerIndex === dropIndex || answerIndex + 1 === dropIndex) {
                // No real change
                return;
            }
            _self.performDrop(answerIndex, dropIndex);
        };
        var isTouchDevice = this.editorHelpers.editor.currentTouchHandler.wasTouchUsed;
        var dropArea = this.makeADropArea(0, drop, onDragOver, onDragLeave);
        this.optionsElement.appendChild(dropArea);
        for (var i = 0; i < graphNode.o.length; i++) {
            var option = graphNode.o[i];
            var answerWrapperElement = document.createElement("div");
            var answerControlsElement = this.makeAnswerControlElement(i, isTouchDevice);
            var answerElement = document.createElement("div");
            var labelElement = document.createElement("div");
            var textElement = document.createElement("textarea");
            var selectElement = this.createNodeSelectElement(nodeName, option.next);
            labelElement.innerHTML = "A#".concat(i);
            labelElement.classList.add("e-label");
            textElement.innerHTML = option.a;
            answerElement.appendChild(labelElement);
            answerElement.appendChild(textElement);
            answerElement.appendChild(selectElement);
            var handleDragStart = function (ev) {
                // console.log("handleDragStart");
                _self.currentDraggedAnswerIndex = parseInt(ev.target.getAttribute("data-answerindex"));
                // console.log("handleDragStart", _self.currentDraggedAnswerIndex);
                ev.dataTransfer.setData("answerindex", "".concat(_self.currentDraggedAnswerIndex));
            };
            var handleTouchDragStart = function (ev) {
                ev.preventDefault(); // Is this required?
                var dragStartElement = ev.target;
                _self.currentDraggedAnswerIndex = parseInt(dragStartElement.getAttribute("data-answerindex"));
                if (Number.isNaN(_self.currentDraggedAnswerIndex)) {
                    // touchStart on touch devices is a bit different than dragStart on Desktop devives.
                    // Try to find enclosing draggable element
                    if (dragStartElement.classList.contains("a-dnd-element")) {
                        dragStartElement = dragStartElement.parentElement.parentElement;
                    }
                    // This should not be a node of class 'answer-wrapper-element' and draggable=true
                    if (!dragStartElement.classList.contains("answer-wrapper-element") || !dragStartElement.getAttribute("draggable")) {
                        console.log("Cannot find draggable element.");
                        return;
                    }
                    _self.currentDraggedAnswerIndex = parseInt(dragStartElement.getAttribute("data-answerindex"));
                }
                // console.log("handleTouchDragStart", _self.currentDraggedAnswerIndex);
            };
            var handleTouchDragEnd = function (_ev) {
                _self.performDrop(_self.currentDraggedAnswerIndex, _self.currentDropAnswerIndex);
            };
            answerWrapperElement.classList.add("answer-wrapper-element");
            answerWrapperElement.setAttribute("data-answerindex", "".concat(i));
            if (isTouchDevice) {
                // Regular 'mouse' or Desktop device.
                // No additional listeners to install.
            }
            else {
                // The TouchHandler already received an only-touch event, so we are
                // probably currently running on a touch device
                answerWrapperElement.setAttribute("draggable", "true");
                answerWrapperElement.addEventListener("dragstart", handleDragStart);
                answerWrapperElement.addEventListener("touchstart", handleTouchDragStart);
                answerWrapperElement.addEventListener("touchend", handleTouchDragEnd);
            }
            answerWrapperElement.appendChild(answerElement);
            answerWrapperElement.appendChild(answerControlsElement);
            var dropArea_1 = this.makeADropArea(i + 1, drop, onDragOver, onDragLeave);
            this.optionsElement.appendChild(answerWrapperElement);
            this.optionsElement.appendChild(dropArea_1);
            textElement.addEventListener("change", this.handleATextChanged(this, option));
            selectElement.addEventListener("change", this.handleASuccessorChanged(this, option));
        }
    };
    /**
     * Create a new answer element (consisting of labels, input fields and buttons).
     * If `isTouchDevice` is true, then a drag element will be added.
     * Otherwise two up/down-buttons will be added.
     *
     * @param {number} index - The answer option index inside the config.
     * @param {boolean} isTouchDevice - Set to `true` if drag-and-drop handles should be added instead of buttons.
     * @returns {HTMLDivElement}
     */
    RPGDOMHelpers.prototype.makeAnswerControlElement = function (index, isTouchDevice) {
        var _self = this;
        var controlElement = document.createElement("div");
        controlElement.classList.add("answer-controls-element");
        if (isTouchDevice) {
            var upDownElement = document.createElement("div");
            upDownElement.classList.add("answer-up-down-element");
            var upBtn = document.createElement("button");
            upBtn.innerHTML = "▴";
            if (index === 0) {
                upBtn.setAttribute("disabled", "true");
            }
            else {
                upBtn.addEventListener("click", function () {
                    console.log("upBtn", index, index - 1);
                    _self.performDrop(index, index - 1);
                });
            }
            var downBtn = document.createElement("button");
            downBtn.innerHTML = "▾";
            if (index + 1 === this.currentGraphNode.o.length) {
                downBtn.setAttribute("disabled", "true");
            }
            else {
                downBtn.addEventListener("click", function () {
                    console.log("downBtn", index, index + 2); // Think of drop zone indices here
                    _self.performDrop(index, index + 2); // Think of drop zone indices here
                });
            }
            upDownElement.appendChild(upBtn);
            upDownElement.appendChild(downBtn);
            controlElement.appendChild(upDownElement);
        }
        else {
            var dndElement = document.createElement("div");
            dndElement.classList.add("a-dnd-element");
            dndElement.innerHTML = "&vellip;";
            controlElement.appendChild(dndElement);
        }
        var deleteButton = document.createElement("button");
        deleteButton.classList.add("a-delete-button");
        deleteButton.addEventListener("click", this.requestDeleteOption(index));
        deleteButton.innerHTML = "&#x1F5D1;";
        controlElement.appendChild(deleteButton);
        return controlElement;
    };
    RPGDOMHelpers.prototype.performDrop = function (answerIndex, dropIndex) {
        if (dropIndex > answerIndex) {
            dropIndex--;
        }
        var old = this.currentGraphNode.o[answerIndex];
        this.currentGraphNode.o[answerIndex] = this.currentGraphNode.o[dropIndex];
        this.currentGraphNode.o[dropIndex] = old;
        // Re-build the list : )
        this.updateAnswerOptions();
        this.editorHelpers.pb.redraw();
    };
    RPGDOMHelpers.prototype.requestDeleteOption = function (index) {
        var _self = this;
        return function () {
            _self.modal.setTitle("Delete option?");
            _self.modal.setBody("Do you really want to delete option #".concat(index, "?"));
            _self.modal.setFooter("");
            _self.modal.setActions([
                modal_1.Modal.ACTION_CANCEL,
                {
                    label: "Yes",
                    action: function () {
                        _self.modal.close();
                        _self.handleDeleteOption(index);
                    }
                }
            ]);
            _self.modal.open();
        };
    };
    RPGDOMHelpers.prototype.handleDeleteOption = function (index) {
        this.currentGraphNode.o.splice(index, 1);
        this.updateAnswerOptions();
        this.editorHelpers.pb.redraw();
    };
    RPGDOMHelpers.prototype.makeADropArea = function (dropIndex, drop, onDragOver, onDragLeave) {
        var dropArea = document.createElement("div");
        dropArea.setAttribute("data-dropindex", "".concat(dropIndex));
        dropArea.classList.add("a-droparea", "droppable");
        dropArea.addEventListener("drop", drop);
        dropArea.addEventListener("dragover", onDragOver);
        dropArea.addEventListener("dragleave", onDragLeave);
        return dropArea;
    };
    RPGDOMHelpers.prototype.createNodeSelectElement = function (currentKey, selectedKey) {
        var selectElement = document.createElement("select");
        if (!this.editorHelpers.dialogConfigWithPositions) {
            console.warn("Warning: cannout populate nodeSelectElement. No dialogConfig set.");
        }
        else {
            var optionElement = this.createNodeSelectOptionElement("", false, null, false);
            selectElement.appendChild(optionElement);
            for (var key in this.editorHelpers.dialogConfigWithPositions.graph) {
                if (!this.editorHelpers.dialogConfigWithPositions.graph.hasOwnProperty(key)) {
                    return;
                }
                var questionaire = this.editorHelpers.dialogConfigWithPositions.graph[key];
                var optionElement_1 = this.createNodeSelectOptionElement(questionaire.q, key === currentKey, key, key === selectedKey);
                selectElement.appendChild(optionElement_1);
            }
        }
        return selectElement;
    };
    RPGDOMHelpers.prototype.createNodeSelectOptionElement = function (questionaireText, isCurrent, key, isSelected) {
        var optionElement = document.createElement("option");
        optionElement.setAttribute("value", key);
        optionElement.innerHTML = "".concat(key !== null && key !== void 0 ? key : "", ": ").concat(editorHelpers_1.EditorHelper.ellipsify(questionaireText, 20));
        if (isCurrent) {
            optionElement.setAttribute("disabled", "true");
        }
        if (isSelected) {
            optionElement.setAttribute("selected", "true");
        }
        return optionElement;
    };
    return RPGDOMHelpers;
}());
exports.RPGDOMHelpers = RPGDOMHelpers;
//# sourceMappingURL=domHelpers.js.map