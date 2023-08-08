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
var RPGDOMHelpers = /** @class */ (function () {
    function RPGDOMHelpers(editorHelpers) {
        this.currentDraggedAnswerIndex = -1;
        this.currentDropAnswerIndex = -1;
        this.editorHelpers = editorHelpers;
        this.touchEnterLeaveHandler = new TouchHandler_1.TouchEnterLeaveHandler();
        this.editorElement = document.getElementById("attribute-editor");
        this.optionsElement = document.getElementById("e-options-container");
        this.keyElement = this.editorElement.querySelector("input#e-key");
        this.qElement = this.editorElement.querySelector("input#e-q");
        this.qElement.addEventListener("change", this.handleQChanged(this));
        this.keyElement.addEventListener("change", this.handleKeyChanged(this));
        document.getElementById("b-export-json").addEventListener("click", this.exportJSON(this));
        document.getElementById("b-add-answer-option").addEventListener("click", this.addAnswerOption(this));
        document.getElementById("b-add-dialogue-node").addEventListener("click", this.addDialogueNode(this));
        document.getElementById("b-delete-dialogue-node").addEventListener("click", this.removeDialogueNode(this));
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
    RPGDOMHelpers.prototype.removeDialogueNode = function (_self) {
        return function () {
            _self.editorHelpers.removeNewDialogueNode(_self.currentNodeName);
            _self.toggleVisibility(false);
        };
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
    RPGDOMHelpers.prototype.showAnswerOptions = function (nodeName, graphNode) {
        var _this = this;
        var _self = this;
        this.currentNodeName = nodeName;
        this.currentGraphNode = graphNode;
        this.keyElement.setAttribute("value", nodeName ? nodeName : "");
        this.keyElement.value = nodeName ? nodeName : "";
        this.qElement.setAttribute("value", graphNode ? graphNode.q : "");
        this.qElement.value = graphNode ? graphNode.q : "";
        this.optionsElement.innerHTML = "";
        if (!graphNode) {
            return;
        }
        var toggleDragEnterStyles = function (target) {
            console.log("toggleDragEnterStyles");
            var answerIndex = _self.currentDraggedAnswerIndex;
            var dropIndex = parseInt(target.getAttribute("data-dropindex"));
            if (target.classList.contains("droppable") && answerIndex !== dropIndex && answerIndex + 1 !== dropIndex) {
                target.classList.add("dragover");
            }
        };
        var toggleDragLeaveStyles = function (target) {
            console.log("toggleDragLeaveStyles");
            if (target.classList.contains("droppable")) {
                target.classList.remove("dragover");
            }
        };
        var onDragOver = function (ev) {
            console.log("ondragover", ev.target);
            ev.preventDefault();
            var target = ev.target;
            toggleDragEnterStyles(target);
            // const answerIndex = parseInt(ev.dataTransfer.getData("answerindex"));
            // const answerIndex = _self.currentDraggedAnswerIndex;
            // const dropIndex = parseInt(target.getAttribute("data-dropindex"));
            // if (target.classList.contains("droppable") && answerIndex !== dropIndex && answerIndex + 1 !== dropIndex) {
            //   target.classList.add("dragover");
            // }
        };
        // const onTouchMoveDragOver = (ev: TouchEvent) => {
        //   console.log("onTouchMoveDragOver");
        //   // on touch move or dragging, we get the newly created image element
        //   // let image = document.getElementById("image-float");
        //   // // this will give us the dragging feeling of the element while actually it's a different element
        //   // let left = e.touches[0].pageX;
        //   // let top = e.touches[0].pageY;
        //   // image.style.position = "absolute";
        //   // image.style.left = left + "px";
        //   // image.style.top = top + "px";
        //   // this.touchX = e.touches[0].pageX;
        //   // this.touchY = e.touches[0].pageY;
        // };
        var onDragLeave = function (ev) {
            console.log("ondragleave", ev.target);
            ev.preventDefault();
            var target = ev.target;
            // if (target.classList.contains("droppable")) {
            //   target.classList.remove("dragover");
            // }
            toggleDragLeaveStyles(target);
        };
        // const onTouchMoveDragEnd = (ev: TouchEvent) => {
        //   console.log("onTouchMoveDragOver");
        // };
        _self.touchEnterLeaveHandler.onTouchEnter(".a-droparea", function (element) {
            console.log("onTouchEnter", element);
            if (!element.classList.contains("a-droparea")) {
                return;
            }
            _self.currentDropAnswerIndex = parseInt(element.getAttribute("data-dropIndex"));
            toggleDragEnterStyles(element);
        });
        _self.touchEnterLeaveHandler.onTouchLeave(".a-droparea", function (element) {
            console.log("onTouchLeave", element);
            _self.currentDropAnswerIndex = -1;
            toggleDragLeaveStyles(element);
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
            performDrop(answerIndex, dropIndex);
        };
        var performDrop = function (answerIndex, dropIndex) {
            if (dropIndex > answerIndex) {
                dropIndex--;
            }
            var old = _this.currentGraphNode.o[answerIndex];
            _this.currentGraphNode.o[answerIndex] = _this.currentGraphNode.o[dropIndex];
            _this.currentGraphNode.o[dropIndex] = old;
            // Re-build the list : )
            _self.updateAnswerOptions();
            _self.editorHelpers.pb.redraw();
        };
        var dropArea = this.makeADropArea(0, drop, onDragOver, onDragLeave);
        this.optionsElement.appendChild(dropArea);
        for (var i = 0; i < graphNode.o.length; i++) {
            var option = graphNode.o[i];
            var answerWrapperElement = document.createElement("div");
            var answerControlsElement = this.makeAnswerControlElement(i);
            var answerElement = document.createElement("div");
            var labelElement = document.createElement("div");
            var textElement = document.createElement("input");
            var selectElement = this.createNodeSelectElement(nodeName, option.next);
            labelElement.innerHTML = "A#".concat(i);
            labelElement.classList.add("e-label");
            textElement.setAttribute("value", option.a);
            answerElement.appendChild(labelElement);
            answerElement.appendChild(textElement);
            answerElement.appendChild(selectElement);
            var handleDragStart = function (ev) {
                console.log("handleDragStart");
                // ev.preventDefault(); // Is this required?!
                // ev.dataTransfer.setData("answerindex", (ev.target as HTMLDivElement).getAttribute("data-answerindex"));
                _self.currentDraggedAnswerIndex = parseInt(ev.target.getAttribute("data-answerindex"));
                console.log("dragStart", _self.currentDraggedAnswerIndex);
                // ev.dataTransfer.setData("answerindex", ev.target.getAttribute("data-answerindex"));
                ev.dataTransfer.setData("answerindex", "".concat(_self.currentDraggedAnswerIndex));
            };
            var handleTouchDragStart = function (ev) {
                ev.preventDefault(); // Is this required
                // ev.dataTransfer.setData("answerindex", (ev.target as HTMLDivElement).getAttribute("data-answerindex"));
                // ev.dataTransfer.setData("answerindex", ev.target.getAttribute("data-answerindex"));
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
                console.log("handleTouchDragStart", _self.currentDraggedAnswerIndex);
            };
            var handleTouchDragEnd = function (ev) {
                // ...
                console.log("handleTouchDragEnd", "currentDraggedAnswerIndex", _self.currentDraggedAnswerIndex, "currentDropAnswerIndex", _self.currentDropAnswerIndex);
                performDrop(_self.currentDraggedAnswerIndex, _self.currentDropAnswerIndex);
            };
            answerWrapperElement.classList.add("answer-wrapper-element");
            answerWrapperElement.setAttribute("draggable", "true");
            answerWrapperElement.setAttribute("data-answerindex", "".concat(i));
            answerWrapperElement.addEventListener("dragstart", handleDragStart);
            answerWrapperElement.addEventListener("touchstart", handleTouchDragStart);
            answerWrapperElement.addEventListener("touchend", handleTouchDragEnd);
            answerWrapperElement.appendChild(answerElement);
            answerWrapperElement.appendChild(answerControlsElement);
            var dropArea_1 = this.makeADropArea(i + 1, drop, onDragOver, onDragLeave);
            this.optionsElement.appendChild(answerWrapperElement);
            this.optionsElement.appendChild(dropArea_1);
            textElement.addEventListener("change", this.handleATextChanged(this, option));
            selectElement.addEventListener("change", this.handleASuccessorChanged(this, option));
        }
        // Add 'add' button
    };
    RPGDOMHelpers.prototype.makeAnswerControlElement = function (index) {
        var controlElement = document.createElement("div");
        var dndElement = document.createElement("div");
        dndElement.classList.add("a-dnd-element");
        dndElement.innerHTML = "&vellip;";
        var deleteButton = document.createElement("button");
        deleteButton.classList.add("a-delete-button");
        deleteButton.addEventListener("click", this.handleDelete(index));
        deleteButton.innerHTML = "&#x1F5D1;";
        controlElement.classList.add("answer-controls-element");
        controlElement.appendChild(dndElement);
        controlElement.appendChild(deleteButton);
        return controlElement;
    };
    RPGDOMHelpers.prototype.handleDelete = function (index) {
        var _self = this;
        return function () {
            _self.currentGraphNode.o.splice(index, 1);
            _self.updateAnswerOptions();
            _self.editorHelpers.pb.redraw();
        };
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