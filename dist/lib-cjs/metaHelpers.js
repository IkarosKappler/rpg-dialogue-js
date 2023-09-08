"use strict";
/**
 * Helper to edit dialogue meta data.
 *
 * @author  Ikaros Kappler
 * @date    2023-08-09
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogueMetaHelpers = void 0;
var modal_1 = require("./modal");
var DialogueMetaHelpers = /** @class */ (function () {
    function DialogueMetaHelpers(editorHelpers) {
        this.editorHelpers = editorHelpers;
        document.getElementById("b-configure-meta").addEventListener("click", this.handleModalOpen());
    }
    DialogueMetaHelpers.prototype.handleModalOpen = function () {
        var _this = this;
        var _self = this;
        return function () {
            _self.metaCopy = DialogueMetaHelpers.cloneMeta(_this.editorHelpers.dialogConfigWithPositions.meta);
            _self.editorHelpers.domHelper.modal.setTitle("Dialogue Config Meta Data");
            _self.editorHelpers.domHelper.modal.setBody(_self.buildMetaBody());
            _self.editorHelpers.domHelper.modal.setFooter("");
            _self.editorHelpers.domHelper.modal.setActions([{ label: "Save", action: _self.handleSave() }, modal_1.Modal.ACTION_CANCEL]);
            _self.editorHelpers.domHelper.modal.open();
        };
    };
    DialogueMetaHelpers.prototype.updateModalBody = function () {
        var newBody = this.buildMetaBody();
        this.editorHelpers.domHelper.modal.setBody(newBody);
    };
    DialogueMetaHelpers.prototype.buildMetaBody = function () {
        var metaBody = document.createElement("div");
        this.inputName = document.createElement("input");
        this.inputName.value = this.metaCopy.name;
        this.inputName.addEventListener("change", this.handleUpdateMetaName());
        var nameLabel = document.createElement("div");
        nameLabel.innerHTML = "Dialogue name";
        var npcContainer = document.createElement("div");
        npcContainer.classList.add("e-meta-npccontainer");
        this.inputsNpcNames = [];
        for (var i = 0; i < this.metaCopy.npcs.length; i++) {
            var container = document.createElement("div");
            var label = document.createElement("div");
            label.innerHTML = "NPC #".concat(i);
            var npcNameInput = document.createElement("input");
            npcNameInput.value = this.metaCopy.npcs[i].name;
            npcNameInput.addEventListener("change", this.handleNpcNameChange(i));
            var btnRemove = document.createElement("button");
            btnRemove.innerHTML = "&#x1F5D1;";
            btnRemove.addEventListener("click", this.handleDeleteNpc(i));
            container.appendChild(label);
            container.appendChild(npcNameInput);
            container.appendChild(btnRemove);
            npcContainer.appendChild(container);
            this.inputsNpcNames.push(npcNameInput);
        }
        var btnAddNpc = document.createElement("button");
        btnAddNpc.innerHTML = "Add NPC";
        btnAddNpc.addEventListener("click", this.handleAddNpc());
        metaBody.appendChild(nameLabel);
        metaBody.appendChild(this.inputName);
        metaBody.appendChild(npcContainer);
        metaBody.appendChild(btnAddNpc);
        return metaBody;
    };
    DialogueMetaHelpers.prototype.handleUpdateMetaName = function () {
        var _self = this;
        return function (event) {
            _self.metaCopy.name = event.target.value;
        };
    };
    DialogueMetaHelpers.prototype.handleNpcNameChange = function (index) {
        var _self = this;
        return function (event) {
            _self.metaCopy.npcs[index].name = event.target.value;
        };
    };
    DialogueMetaHelpers.prototype.handleDeleteNpc = function (index) {
        var _self = this;
        return function () {
            _self.metaCopy.npcs.splice(index, 1);
            _self.updateModalBody();
        };
    };
    DialogueMetaHelpers.prototype.handleAddNpc = function () {
        var _self = this;
        return function () {
            _self.metaCopy.npcs.push({ name: "New NPC" });
            _self.updateModalBody();
        };
    };
    DialogueMetaHelpers.prototype.handleSave = function () {
        var _self = this;
        return function () {
            _self.editorHelpers.dialogConfigWithPositions.meta = _self.metaCopy;
            _self.editorHelpers.domHelper.modal.close();
            _self.editorHelpers.domHelper.updateNpcSelector();
        };
    };
    DialogueMetaHelpers.cloneMeta = function (meta) {
        var copy = {};
        copy.name = meta.name;
        copy.npcs = [];
        for (var i = 0; i < meta.npcs.length; i++) {
            copy.npcs.push({ name: meta.npcs[i].name });
        }
        return copy;
    };
    return DialogueMetaHelpers;
}());
exports.DialogueMetaHelpers = DialogueMetaHelpers;
//# sourceMappingURL=metaHelpers.js.map