/**
 * Helper to edit dialogue meta data.
 *
 * @author  Ikaros Kappler
 * @date    2023-08-09
 * @version 1.0.0
 */

import { EditorHelper } from "./editorHelpers";
import { IDialogueMeta } from "./interfaces";
import { Modal } from "./modal";

export class DialogueMetaHelpers {
  private editorHelpers: EditorHelper;
  private inputName: HTMLInputElement;
  private inputsNpcNames: HTMLInputElement[];
  private metaCopy: IDialogueMeta;

  constructor(editorHelpers: EditorHelper) {
    this.editorHelpers = editorHelpers;

    document.getElementById("b-configure-meta").addEventListener("click", this.handleModalOpen());
  }

  private handleModalOpen() {
    const _self = this;
    return () => {
      _self.metaCopy = DialogueMetaHelpers.cloneMeta(this.editorHelpers.dialogConfigWithPositions.meta);
      _self.editorHelpers.domHelper.modal.setTitle("Dialogue Config Meta Data");
      _self.editorHelpers.domHelper.modal.setBody(_self.buildMetaBody());
      _self.editorHelpers.domHelper.modal.setFooter("");
      _self.editorHelpers.domHelper.modal.setActions([{ label: "Save", action: _self.handleSave() }, Modal.ACTION_CANCEL]);
      _self.editorHelpers.domHelper.modal.open();
    };
  }

  private updateModalBody() {
    const newBody = this.buildMetaBody();
    this.editorHelpers.domHelper.modal.setBody(newBody);
  }

  private buildMetaBody(): HTMLDivElement {
    const metaBody = document.createElement("div");

    this.inputName = document.createElement("input");
    this.inputName.value = this.metaCopy.name;
    this.inputName.addEventListener("change", this.handleUpdateMetaName());
    const nameLabel = document.createElement("div");
    nameLabel.innerHTML = "Dialogue name";

    const npcContainer = document.createElement("div");
    npcContainer.classList.add("e-meta-npccontainer");
    this.inputsNpcNames = [];
    for (var i = 0; i < this.metaCopy.npcs.length; i++) {
      const container = document.createElement("div");
      const label = document.createElement("div");
      label.innerHTML = `NPC #${i}`;
      const npcNameInput = document.createElement("input");
      npcNameInput.value = this.metaCopy.npcs[i].name;
      npcNameInput.addEventListener("change", this.handleNpcNameChange(i));

      const btnRemove = document.createElement("button");
      btnRemove.innerHTML = "&#x1F5D1;";
      btnRemove.addEventListener("click", this.handleDeleteNpc(i));

      container.appendChild(label);
      container.appendChild(npcNameInput);
      container.appendChild(btnRemove);
      npcContainer.appendChild(container);

      this.inputsNpcNames.push(npcNameInput);
    }

    const btnAddNpc = document.createElement("button");
    btnAddNpc.innerHTML = "Add NPC";
    btnAddNpc.addEventListener("click", this.handleAddNpc());

    metaBody.appendChild(nameLabel);
    metaBody.appendChild(this.inputName);
    metaBody.appendChild(npcContainer);
    metaBody.appendChild(btnAddNpc);
    return metaBody;
  }

  private handleUpdateMetaName(): (event: InputEvent) => void {
    const _self = this;
    return (event: InputEvent) => {
      _self.metaCopy.name = (event.target as HTMLInputElement).value;
    };
  }

  private handleNpcNameChange(index: number): (event: InputEvent) => void {
    const _self = this;
    return (event: InputEvent) => {
      _self.metaCopy.npcs[index].name = (event.target as HTMLInputElement).value;
    };
  }

  private handleDeleteNpc(index: number): () => void {
    const _self = this;
    return () => {
      _self.metaCopy.npcs.splice(index, 1);
      _self.updateModalBody();
    };
  }

  private handleAddNpc(): () => void {
    const _self = this;
    return () => {
      _self.metaCopy.npcs.push({ name: "New NPC" });
      _self.updateModalBody();
    };
  }

  private handleSave(): () => void {
    const _self = this;
    return () => {
      _self.editorHelpers.dialogConfigWithPositions.meta = _self.metaCopy;
      _self.editorHelpers.domHelper.modal.close();
      _self.editorHelpers.domHelper.updateNpcSelector();
    };
  }

  static cloneMeta(meta: IDialogueMeta): IDialogueMeta {
    const copy = {} as IDialogueMeta;
    copy.name = meta.name;
    copy.npcs = [];
    for (var i = 0; i < meta.npcs.length; i++) {
      copy.npcs.push({ name: meta.npcs[i].name });
    }
    return copy;
  }
}
