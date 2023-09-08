/**
 * A script for demonstrating the line-point-distance.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui
 *
 * @author   Ikaros Kappler
 * @date     2023-08-01
 * @version  1.0.0
 **/

import { TouchEnterLeaveHandler } from "./TouchHandler";
import { EditorHelper } from "./editorHelpers";
import { IAnswer, IDialogueConfig, IMiniQuestionaire, IMiniQuestionaireWithPosition } from "./interfaces";
import { Modal } from "./modal";

export class RPGDOMHelpers {
  editorHelpers: EditorHelper;

  editorElement: HTMLDivElement;
  keyElement: HTMLInputElement;
  npcElement: HTMLSelectElement;
  qElement: HTMLInputElement;

  optionsElement: HTMLDivElement;

  modal: Modal;

  currentNodeName: string | null;
  currentGraphNode: IMiniQuestionaire | null;

  currentDraggedAnswerIndex: number = -1;
  currentDropAnswerIndex: number = -1;

  touchEnterLeaveHandler: TouchEnterLeaveHandler;

  constructor(editorHelpers: EditorHelper) {
    this.editorHelpers = editorHelpers;
    this.touchEnterLeaveHandler = new TouchEnterLeaveHandler();

    this.editorElement = document.getElementById("attribute-editor") as HTMLDivElement;
    this.optionsElement = document.getElementById("e-options-container") as HTMLDivElement;

    this.keyElement = this.editorElement.querySelector("input#e-key") as HTMLInputElement;
    this.npcElement = this.editorElement.querySelector("select#e-npc-index") as HTMLSelectElement;
    this.qElement = this.editorElement.querySelector("textarea#e-q") as HTMLInputElement;

    this.qElement.addEventListener("change", this.handleQChanged(this));
    this.npcElement.addEventListener("change", this.handleNPCIndexChanged(this));
    this.keyElement.addEventListener("change", this.handleKeyChanged(this));

    this.modal = new Modal();

    document.getElementById("b-export-json")?.addEventListener("click", this.exportJSON(this));
    document.getElementById("b-add-answer-option")?.addEventListener("click", this.addAnswerOption(this));
    document.getElementById("b-add-dialogue-node")?.addEventListener("click", this.addDialogueNode(this));
    document.getElementById("b-delete-dialogue-node")?.addEventListener("click", this.requestRemoveDialogueNode(this));
  }

  isExportWithoutPositions(): boolean {
    const checkbox = document.getElementById("cb-export-without-positions") as HTMLInputElement;
    return checkbox.checked;
  }

  isAutoSave(): boolean {
    const checkbox = document.getElementById("cb-use-localstorage") as HTMLInputElement;
    return checkbox.checked;
  }

  exportJSON(_self: RPGDOMHelpers): () => void {
    return () => {
      const removePositions = _self.isExportWithoutPositions();
      const dConfig: IDialogueConfig<IMiniQuestionaire> | IDialogueConfig<IMiniQuestionaireWithPosition> = removePositions
        ? EditorHelper.removePositions(_self.editorHelpers.dialogConfigWithPositions)
        : _self.editorHelpers.dialogConfigWithPositions;
      const jsonString = JSON.stringify(dConfig);
      var blob = new Blob([jsonString], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "dialog-config.json";
      a.textContent = "Download backup.json";
      a.click();
    };
  }

  addAnswerOption(_self: RPGDOMHelpers): () => void {
    return () => {
      if (!_self.currentGraphNode) {
        console.warn("Warnign: cannot add answer options to null.");
        return;
      }
      const newOption: IAnswer = {
        a: "",
        next: null
      };
      _self.currentGraphNode.o.push(newOption);
      _self.updateAnswerOptions();
      _self.editorHelpers.pb.redraw();
    };
  }

  private addDialogueNode(_self: RPGDOMHelpers): () => void {
    return () => {
      _self.editorHelpers.addNewDialogueNode();
    };
  }

  private requestRemoveDialogueNode(_self: RPGDOMHelpers): () => void {
    return () => {
      _self.modal.setTitle("Delete option?");
      _self.modal.setBody(`Do you really want to delete the current dialoge node '${_self.currentNodeName}'?`);
      _self.modal.setFooter("");
      _self.modal.setActions([
        Modal.ACTION_CANCEL,
        {
          label: "Yes",
          action: () => {
            _self.modal.close();
            _self.removeDialogueNode();
          }
        }
      ]);
      _self.modal.open();
    };
  }

  private removeDialogueNode() {
    if (!this.currentNodeName) {
      return;
    }
    this.editorHelpers.removeNewDialogueNode(this.currentNodeName);
    this.toggleVisibility(false);
  }

  toggleVisibility(isVisible: boolean) {
    if (isVisible) {
      this.editorElement.classList.remove("d-none");
    } else {
      this.editorElement.classList.add("d-none");
    }
  }

  private handleQChanged(_self: RPGDOMHelpers): (changeEvent: Event) => void {
    return (changeEvent: Event) => {
      if (!_self.currentGraphNode) {
        return;
      }
      _self.currentGraphNode.q = (changeEvent.target as HTMLInputElement).value;
      _self.editorHelpers.pb.redraw();
    };
  }

  private handleNPCIndexChanged(_self: RPGDOMHelpers): (changeEvent: Event) => void {
    return (_changeEvent: Event) => {
      if (!_self.currentGraphNode) {
        return;
      }
      let newIndex: number = parseInt(this.npcElement.value);
      if (Number.isNaN(newIndex)) {
        newIndex = -1;
      }
      _self.currentGraphNode.npcIndex = newIndex;
    };
  }

  private handleKeyChanged(_self: RPGDOMHelpers): (changeEvent: Event) => void {
    return (_changeEvent: Event) => {
      if (!_self.currentNodeName) {
        return;
      }
      let newName: string = this.keyElement.value;
      if (!newName || (newName = newName.trim()).length === 0) {
        return;
      }
      const renameSuccessful = _self.editorHelpers.renameGraphNode(_self.currentNodeName, newName);
      if (renameSuccessful) {
        _self.currentNodeName = newName;
      }
    };
  }

  private handleATextChanged(_self: RPGDOMHelpers, answer: IAnswer): (changeEvent: Event) => void {
    return (changeEvent: Event) => {
      answer.a = (changeEvent.target as HTMLInputElement).value;
      _self.editorHelpers.pb.redraw();
    };
  }

  private handleASuccessorChanged(_self: RPGDOMHelpers, answer: IAnswer): (changeEvent: Event) => void {
    return (changeEvent: Event) => {
      answer.next = (changeEvent.target as HTMLInputElement).value;
      _self.editorHelpers.pb.redraw();
    };
  }

  updateAnswerOptions() {
    this.showAnswerOptions(this.currentNodeName, this.currentGraphNode);
  }

  getSelectedNpcIndex() {
    return typeof this.currentGraphNode?.npcIndex === "undefined" || Number.isNaN(this.currentGraphNode.npcIndex)
      ? 0
      : this.currentGraphNode.npcIndex;
  }

  updateNpcSelector() {
    if (!this.currentGraphNode) {
      return;
    }
    this.npcElement.innerHTML = "";
    const curNpcIndex: number = this.getSelectedNpcIndex();
    // console.log("this.currentGraphNode.npcIndex", this.currentGraphNode.npcIndex, "curNpcIndex", curNpcIndex);
    for (var i = 0; i < this.editorHelpers.dialogConfigWithPositions.meta.npcs.length; i++) {
      const npcOption = document.createElement("option");
      npcOption.setAttribute("value", `${i}`);
      if (i === 0) {
        npcOption.innerHTML = `${this.editorHelpers.dialogConfigWithPositions.meta.npcs[i].name} (default)`;
      } else {
        npcOption.innerHTML = this.editorHelpers.dialogConfigWithPositions.meta.npcs[i].name;
      }
      if (i === curNpcIndex) {
        npcOption.setAttribute("selected", "true");
        npcOption.selected = true;
      }
      this.npcElement.appendChild(npcOption);
    }
    this.npcElement.value = `${curNpcIndex}`;
    this.npcElement.setAttribute("value", `${curNpcIndex}`);
  }

  toggleDragEnterStyles(target: HTMLElement) {
    // console.log("toggleDragEnterStyles");
    const answerIndex = this.currentDraggedAnswerIndex;
    const dropIndex = parseInt(target.getAttribute("data-dropindex") || "");
    if (target.classList.contains("droppable") && answerIndex !== dropIndex && answerIndex + 1 !== dropIndex) {
      target.classList.add("dragover");
    }
  }

  toggleDragLeaveStyles(target: HTMLElement) {
    console.log("toggleDragLeaveStyles");
    if (target.classList.contains("droppable")) {
      target.classList.remove("dragover");
    }
  }

  showAnswerOptions(nodeName: string | null, graphNode: IMiniQuestionaireWithPosition | null) {
    const _self = this;
    if (!nodeName) {
      // console.warn("Warning: cannot show answer options for null node.");
      return;
    }
    this.currentNodeName = nodeName;
    this.currentGraphNode = graphNode;

    this.keyElement.setAttribute("value", nodeName ? nodeName : "");
    this.keyElement.value = nodeName ? nodeName : "";
    // console.log("showAnswerOptions", this.currentGraphNode);
    this.updateNpcSelector();
    this.optionsElement.innerHTML = "";
    this.npcElement.value = !graphNode || Number.isNaN(graphNode.npcIndex) ? "0" : `${graphNode.npcIndex}`;
    this.qElement.setAttribute("value", graphNode ? graphNode.q : "");
    this.qElement.value = graphNode ? graphNode.q : "";
    if (!graphNode) {
      return;
    }

    const onDragOver = (ev: DragEvent) => {
      console.log("ondragover", ev.target);
      ev.preventDefault();
      const target = ev.target as HTMLDivElement;
      _self.toggleDragEnterStyles(target);
    };
    const onDragLeave = (ev: DragEvent) => {
      console.log("ondragleave", ev.target);
      ev.preventDefault();
      const target = ev.target as HTMLDivElement;
      _self.toggleDragLeaveStyles(target);
    };

    /**
     * Native browser DnD does not support touch events.
     * So we need a workaround using our custom TouchEnterLeaverHandler here.
     */
    _self.touchEnterLeaveHandler.onTouchEnter(".a-droparea", (element: HTMLElement) => {
      console.log("onTouchEnter", element);
      if (!element.classList.contains("a-droparea")) {
        return;
      }
      _self.currentDropAnswerIndex = parseInt(element.getAttribute("data-dropIndex") ?? "");
      _self.toggleDragEnterStyles(element);
    });
    _self.touchEnterLeaveHandler.onTouchLeave(".a-droparea", (element: HTMLElement) => {
      console.log("onTouchLeave", element);
      _self.currentDropAnswerIndex = -1;
      _self.toggleDragLeaveStyles(element);
    });

    const drop = (ev: DragEvent) => {
      console.log("Drop", ev);
      ev.preventDefault();
      const target = ev.target as HTMLDivElement;
      // const answerIndex = parseInt(ev.dataTransfer.getData("answerindex"));
      const answerIndex = _self.currentDraggedAnswerIndex;
      var dropIndex = parseInt(target.getAttribute("data-dropindex") ?? "");
      console.log("Move", answerIndex, "to", dropIndex);
      // target.appendChild(document.getElementById(data));

      if (!target.classList.contains("droppable") || answerIndex === dropIndex || answerIndex + 1 === dropIndex) {
        // No real change
        return;
      }
      _self.performDrop(answerIndex, dropIndex);
    };

    const isTouchDevice: boolean = Boolean(this.editorHelpers.editor.currentTouchHandler?.wasTouchUsed);
    const dropArea: HTMLDivElement = this.makeADropArea(0, drop, onDragOver, onDragLeave);
    this.optionsElement.appendChild(dropArea);

    for (var i = 0; i < graphNode.o.length; i++) {
      const option: IAnswer = graphNode.o[i];

      const answerWrapperElement = document.createElement("div") as HTMLDivElement;
      const answerControlsElement = this.makeAnswerControlElement(i, isTouchDevice);

      const answerElement = document.createElement("div") as HTMLDivElement;
      const labelElement = document.createElement("div") as HTMLDivElement;
      const textElement = document.createElement("textarea") as HTMLTextAreaElement;
      const selectElement = this.createNodeSelectElement(nodeName, option.next);
      labelElement.innerHTML = `A#${i}`;
      labelElement.classList.add("e-label");
      textElement.innerHTML = option.a;

      answerElement.appendChild(labelElement);
      answerElement.appendChild(textElement);
      answerElement.appendChild(selectElement);

      const handleDragStart = (ev: DragEvent) => {
        // console.log("handleDragStart");
        _self.currentDraggedAnswerIndex = parseInt((ev.target as HTMLDivElement).getAttribute("data-answerindex") ?? "");
        // console.log("handleDragStart", _self.currentDraggedAnswerIndex);
        ev.dataTransfer && ev.dataTransfer.setData("answerindex", `${_self.currentDraggedAnswerIndex}`);
      };

      const handleTouchDragStart = (ev: TouchEvent) => {
        ev.preventDefault(); // Is this required?
        var dragStartElement = ev.target as HTMLElement;
        _self.currentDraggedAnswerIndex = parseInt(dragStartElement.getAttribute("data-answerindex") ?? "");
        if (Number.isNaN(_self.currentDraggedAnswerIndex)) {
          // touchStart on touch devices is a bit different than dragStart on Desktop devives.
          // Try to find enclosing draggable element
          if (dragStartElement.classList.contains("a-dnd-element")) {
            dragStartElement = (dragStartElement.parentElement as HTMLElement).parentElement as HTMLElement;
          }
          // This should not be a node of class 'answer-wrapper-element' and draggable=true
          if (!dragStartElement.classList.contains("answer-wrapper-element") || !dragStartElement.getAttribute("draggable")) {
            console.log("Cannot find draggable element.");
            return;
          }
          _self.currentDraggedAnswerIndex = parseInt(dragStartElement.getAttribute("data-answerindex") ?? "");
        }
        // console.log("handleTouchDragStart", _self.currentDraggedAnswerIndex);
      };

      const handleTouchDragEnd = (_ev: TouchEvent) => {
        _self.performDrop(_self.currentDraggedAnswerIndex, _self.currentDropAnswerIndex);
      };
      answerWrapperElement.classList.add("answer-wrapper-element");
      // answerWrapperElement.setAttribute("data-answerindex", `${i}`);

      if (isTouchDevice) {
        // Regular 'mouse' or Desktop device.
        // No additional listeners to install.
      } else {
        // The TouchHandler already received an only-touch event, so we are
        // probably currently running on a touch device
        if (answerControlsElement.dndHandleElement) {
          answerControlsElement.dndHandleElement.setAttribute("draggable", "true");
          answerControlsElement.dndHandleElement.addEventListener("dragstart", handleDragStart);
          answerControlsElement.dndHandleElement.addEventListener("touchstart", handleTouchDragStart);
          answerControlsElement.dndHandleElement.addEventListener("touchend", handleTouchDragEnd);
          answerControlsElement.dndHandleElement.setAttribute("data-answerindex", `${i}`);
        }
      }
      answerWrapperElement.appendChild(answerElement);
      answerWrapperElement.appendChild(answerControlsElement.container);

      const dropArea = this.makeADropArea(i + 1, drop, onDragOver, onDragLeave);

      this.optionsElement.appendChild(answerWrapperElement);
      this.optionsElement.appendChild(dropArea);

      textElement.addEventListener("change", this.handleATextChanged(this, option));
      selectElement.addEventListener("change", this.handleASuccessorChanged(this, option));
    }
  }

  /**
   * Create a new answer element (consisting of labels, input fields and buttons).
   * If `isTouchDevice` is true, then a drag element will be added.
   * Otherwise two up/down-buttons will be added.
   *
   * @param {number} index - The answer option index inside the config.
   * @param {boolean} isTouchDevice - Set to `true` if drag-and-drop handles should be added instead of buttons.
   * @returns {HTMLDivElement}
   */
  private makeAnswerControlElement(
    index: number,
    isTouchDevice: boolean
  ): { container: HTMLDivElement; dndHandleElement: HTMLDivElement | null } {
    const _self = this;
    const controlElement = document.createElement("div") as HTMLDivElement;
    controlElement.classList.add("answer-controls-element");

    var dndElement: HTMLDivElement | null = null;
    if (isTouchDevice) {
      const upDownElement = document.createElement("div") as HTMLDivElement;
      upDownElement.classList.add("answer-up-down-element");
      const upBtn = document.createElement("button") as HTMLButtonElement;
      upBtn.innerHTML = "▴";
      if (index === 0) {
        upBtn.setAttribute("disabled", "true");
      } else {
        upBtn.addEventListener("click", () => {
          console.log("upBtn", index, index - 1);
          _self.performDrop(index, index - 1);
        });
      }
      const downBtn = document.createElement("button") as HTMLButtonElement;
      downBtn.innerHTML = "▾";
      if (index + 1 === this.currentGraphNode?.o.length) {
        downBtn.setAttribute("disabled", "true");
      } else {
        downBtn.addEventListener("click", () => {
          console.log("downBtn", index, index + 2); // Think of drop zone indices here

          _self.performDrop(index, index + 2); // Think of drop zone indices here
        });
      }
      upDownElement.appendChild(upBtn);
      upDownElement.appendChild(downBtn);
      controlElement.appendChild(upDownElement);
    } else {
      dndElement = document.createElement("div") as HTMLDivElement;
      dndElement.classList.add("a-dnd-element");
      dndElement.innerHTML = "&vellip;";
      controlElement.appendChild(dndElement);
    }

    const deleteButton = document.createElement("button") as HTMLButtonElement;
    deleteButton.classList.add("a-delete-button");
    deleteButton.addEventListener("click", this.requestDeleteOption(index));
    deleteButton.innerHTML = "&#x1F5D1;";

    controlElement.appendChild(deleteButton);
    return { container: controlElement, dndHandleElement: dndElement };
  }

  private performDrop(answerIndex: number, dropIndex: number) {
    if (dropIndex > answerIndex) {
      dropIndex--;
    }

    if (this.currentGraphNode) {
      const old = this.currentGraphNode.o[answerIndex];
      this.currentGraphNode.o[answerIndex] = this.currentGraphNode.o[dropIndex];
      this.currentGraphNode.o[dropIndex] = old;
    }

    // Re-build the list : )
    this.updateAnswerOptions();
    this.editorHelpers.pb.redraw();
  }

  private requestDeleteOption(index: number): () => void {
    const _self = this;
    return () => {
      _self.modal.setTitle("Delete option?");
      _self.modal.setBody(`Do you really want to delete option #${index}?`);
      _self.modal.setFooter("");
      _self.modal.setActions([
        Modal.ACTION_CANCEL,
        {
          label: "Yes",
          action: () => {
            _self.modal.close();
            _self.handleDeleteOption(index);
          }
        }
      ]);
      _self.modal.open();
    };
  }

  private handleDeleteOption(index: number) {
    this.currentGraphNode?.o.splice(index, 1);
    this.updateAnswerOptions();
    this.editorHelpers.pb.redraw();
  }

  private makeADropArea(
    dropIndex: number,
    drop: (evt: DragEvent) => void,
    onDragOver: (evt: DragEvent) => void,
    onDragLeave: (evt: DragEvent) => void
  ) {
    const dropArea: HTMLDivElement = document.createElement("div");
    dropArea.setAttribute("data-dropindex", `${dropIndex}`);
    dropArea.classList.add("a-droparea", "droppable");
    dropArea.addEventListener("drop", drop);
    dropArea.addEventListener("dragover", onDragOver);
    dropArea.addEventListener("dragleave", onDragLeave);
    return dropArea;
  }

  private createNodeSelectElement(currentKey: string, selectedKey): HTMLSelectElement {
    const selectElement = document.createElement("select") as HTMLSelectElement;
    if (!this.editorHelpers.dialogConfigWithPositions) {
      console.warn("Warning: cannout populate nodeSelectElement. No dialogConfig set.");
    } else {
      const optionElement = this.createNodeSelectOptionElement("", false, null, false);
      selectElement.appendChild(optionElement);

      for (var key in this.editorHelpers.dialogConfigWithPositions.graph) {
        if (!this.editorHelpers.dialogConfigWithPositions.graph.hasOwnProperty(key)) {
          // return;
          continue; // !!! is this correct?
        }
        const questionaire: IMiniQuestionaire = this.editorHelpers.dialogConfigWithPositions.graph[key];
        const optionElement = this.createNodeSelectOptionElement(questionaire.q, key === currentKey, key, key === selectedKey);

        selectElement.appendChild(optionElement);
      }
    }
    return selectElement;
  }

  private createNodeSelectOptionElement(questionaireText: string, isCurrent: boolean, key: string | null, isSelected: boolean) {
    const optionElement = document.createElement("option") as HTMLOptionElement;
    optionElement.setAttribute("value", key as string);
    optionElement.innerHTML = `${key ?? ""}: ${EditorHelper.ellipsify(questionaireText, 20)}`;
    if (isCurrent) {
      optionElement.setAttribute("disabled", "true");
    }
    if (isSelected) {
      optionElement.setAttribute("selected", "true");
    }
    return optionElement;
  }
}
