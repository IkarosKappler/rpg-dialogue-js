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
var editorHelpers_1 = require("./editorHelpers");
var RPGDOMHelpers = /** @class */ (function () {
    function RPGDOMHelpers(editorHelpers, dialogConfigWithPositions) {
        this.editorHelpers = editorHelpers;
        this.dialogConfigWithPositions = dialogConfigWithPositions;
        this.editorElement = document.getElementById("attribute-editor");
        this.optionsElement = document.getElementById("e-options-container");
        this.keyElement = this.editorElement.querySelector("input#e-key");
        this.qElement = this.editorElement.querySelector("input#e-q");
        this.qElement.addEventListener("change", this.handleQChanged(this));
        document.getElementById("b-export-json").addEventListener("click", this.exportJSON(this));
    }
    RPGDOMHelpers.prototype.exportJSON = function (_self) {
        return function () {
            var jsonString = JSON.stringify(_self.dialogConfigWithPositions);
            var blob = new Blob([jsonString], { type: "application/json" });
            var url = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = url;
            a.download = "dialog-config.json";
            a.textContent = "Download backup.json";
            a.click();
        };
    };
    RPGDOMHelpers.prototype.setDialogConfig = function (dialogConfigWithPositions) {
        this.dialogConfigWithPositions = dialogConfigWithPositions;
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
    RPGDOMHelpers.prototype.showAnswerOptions = function (nodeName, graphNode) {
        var _this = this;
        var _self = this;
        this.currentNodeName = nodeName;
        this.currentGraphNode = graphNode;
        this.keyElement.setAttribute("value", nodeName ? nodeName : "");
        this.qElement.setAttribute("value", graphNode ? graphNode.q : "");
        this.optionsElement.innerHTML = "";
        if (!graphNode) {
            return;
        }
        var onDragOver = function (ev) {
            console.log("ondragover", ev.target);
            ev.preventDefault();
            var target = ev.target;
            var answerIndex = parseInt(ev.dataTransfer.getData("answerindex"));
            var dropIndex = parseInt(target.getAttribute("data-dropindex"));
            if (target.classList.contains("droppable") && answerIndex !== dropIndex && answerIndex + 1 !== dropIndex) {
                target.classList.add("dragover");
            }
        };
        var onDragLeave = function (ev) {
            console.log("ondragleave", ev.target);
            ev.preventDefault();
            var target = ev.target;
            if (target.classList.contains("droppable")) {
                target.classList.remove("dragover");
            }
        };
        var drop = function (ev) {
            console.log("Drop", ev);
            ev.preventDefault();
            var target = ev.target;
            var answerIndex = parseInt(ev.dataTransfer.getData("answerindex"));
            var dropIndex = parseInt(target.getAttribute("data-dropindex"));
            console.log("Move", answerIndex, "to", dropIndex);
            // target.appendChild(document.getElementById(data));
            if (!target.classList.contains("droppable") || answerIndex === dropIndex || answerIndex + 1 === dropIndex) {
                // No real change
                return;
            }
            if (dropIndex > answerIndex) {
                dropIndex--;
            }
            var old = _this.currentGraphNode.o[answerIndex];
            _this.currentGraphNode.o[answerIndex] = _this.currentGraphNode.o[dropIndex];
            _this.currentGraphNode.o[dropIndex] = old;
            // Re-build the list : )
            _self.showAnswerOptions(nodeName, graphNode);
            _self.editorHelpers.pb.redraw();
        };
        var dropArea = this.makeADropArea(0, drop, onDragOver, onDragLeave);
        this.optionsElement.appendChild(dropArea);
        for (var i = 0; i < graphNode.o.length; i++) {
            var option = graphNode.o[i];
            var answerElement = document.createElement("div");
            var labelElement = document.createElement("div");
            var textElement = document.createElement("input");
            var selectElement = this.createNodeSelectElement(nodeName, option.next);
            labelElement.innerHTML = "A#".concat(i);
            textElement.setAttribute("value", option.a);
            answerElement.appendChild(labelElement);
            answerElement.appendChild(textElement);
            answerElement.appendChild(selectElement);
            var handleDrag = function (ev) {
                // ev.dataTransfer.setData("text", ev.target.id);
                ev.dataTransfer.setData("answerindex", ev.target.getAttribute("data-answerindex"));
            };
            answerElement.setAttribute("draggable", "true");
            answerElement.setAttribute("data-answerindex", "".concat(i));
            answerElement.addEventListener("dragstart", handleDrag);
            var dropArea_1 = this.makeADropArea(i + 1, drop, onDragOver, onDragLeave);
            this.optionsElement.appendChild(answerElement);
            this.optionsElement.appendChild(dropArea_1);
            textElement.addEventListener("change", this.handleATextChanged(this, option));
            selectElement.addEventListener("change", this.handleASuccessorChanged(this, option));
        }
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
        if (!this.dialogConfigWithPositions) {
            console.warn("Warning: cannout populate nodeSelectElement. No dialogConfig set.");
        }
        else {
            for (var key in this.dialogConfigWithPositions.graph) {
                if (!this.dialogConfigWithPositions.graph.hasOwnProperty(key)) {
                    return;
                }
                var questionaire = this.dialogConfigWithPositions.graph[key];
                var optionElement = document.createElement("option");
                optionElement.setAttribute("value", key);
                optionElement.innerHTML = "".concat(key, ": ").concat(editorHelpers_1.EditorHelper.ellipsify(questionaire.q, 20));
                if (key === currentKey) {
                    optionElement.setAttribute("disabled", "true");
                }
                if (key === selectedKey) {
                    optionElement.setAttribute("selected", "true");
                }
                selectElement.appendChild(optionElement);
            }
        }
        return selectElement;
    };
    return RPGDOMHelpers;
}());
exports.RPGDOMHelpers = RPGDOMHelpers;
//# sourceMappingURL=domHelpers.js.map