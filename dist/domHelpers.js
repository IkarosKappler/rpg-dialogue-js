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
        this.currentNodeName = nodeName;
        this.currentGraphNode = graphNode;
        this.keyElement.setAttribute("value", nodeName ? nodeName : "");
        this.qElement.setAttribute("value", graphNode ? graphNode.q : "");
        this.optionsElement.innerHTML = "";
        if (!graphNode) {
            return;
        }
        for (var i in graphNode.o) {
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
            this.optionsElement.appendChild(answerElement);
            textElement.addEventListener("change", this.handleATextChanged(this, option));
            selectElement.addEventListener("change", this.handleASuccessorChanged(this, option));
        }
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