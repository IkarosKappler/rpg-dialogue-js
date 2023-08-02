/**
 * A script for demonstrating the line-point-distance.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui
 *
 * @author   Ikaros Kappler
 * @date     2023-08-01
 * @version  1.0.0
 **/

import { EditorHelper } from "./editorHelpers";
import { IAnswer, IDialogueConfig, IMiniQuestionaire, IMiniQuestionaireWithPosition } from "./interfaces";

export class RPGDOMHelpers {
  editorHelpers: EditorHelper;
  dialogConfigWithPositions: IDialogueConfig<IMiniQuestionaireWithPosition>;

  editorElement: HTMLDivElement;
  keyElement: HTMLInputElement;
  qElement: HTMLInputElement;

  optionsElement: HTMLDivElement;

  currentNodeName: string | null;
  currentGraphNode: IMiniQuestionaire;

  constructor(editorHelpers: EditorHelper, dialogConfigWithPositions: IDialogueConfig<IMiniQuestionaireWithPosition>) {
    this.editorHelpers = editorHelpers;
    this.dialogConfigWithPositions = dialogConfigWithPositions;

    this.editorElement = document.getElementById("attribute-editor") as HTMLDivElement;
    this.optionsElement = document.getElementById("e-options-container") as HTMLDivElement;

    this.keyElement = this.editorElement.querySelector("input#e-key");
    this.qElement = this.editorElement.querySelector("input#e-q");

    this.qElement.addEventListener("change", this.handleQChanged(this));

    document.getElementById("b-export-json").addEventListener("click", this.exportJSON(this));
  }

  exportJSON(_self: RPGDOMHelpers): () => void {
    return () => {
      const jsonString = JSON.stringify(_self.dialogConfigWithPositions);
      var blob = new Blob([jsonString], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "dialog-config.json";
      a.textContent = "Download backup.json";
      a.click();
    };
  }

  setDialogConfig(dialogConfigWithPositions: IDialogueConfig<IMiniQuestionaireWithPosition>) {
    this.dialogConfigWithPositions = dialogConfigWithPositions;
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
      _self.currentGraphNode.q = (changeEvent.target as HTMLInputElement).value;
      _self.editorHelpers.pb.redraw();
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

  showAnswerOptions(nodeName: string, graphNode: IMiniQuestionaireWithPosition | null) {
    const _self = this;
    this.currentNodeName = nodeName;
    this.currentGraphNode = graphNode;

    this.keyElement.setAttribute("value", nodeName ? nodeName : "");
    this.qElement.setAttribute("value", graphNode ? graphNode.q : "");
    this.optionsElement.innerHTML = "";
    if (!graphNode) {
      return;
    }

    const onDragOver = (ev: DragEvent) => {
      console.log("ondragover", ev.target);
      ev.preventDefault();
      const target = ev.target as HTMLDivElement;
      const answerIndex = parseInt(ev.dataTransfer.getData("answerindex"));
      const dropIndex = parseInt(target.getAttribute("data-dropindex"));
      if (target.classList.contains("droppable") && answerIndex !== dropIndex && answerIndex + 1 !== dropIndex) {
        target.classList.add("dragover");
      }
    };
    const onDragLeave = (ev: DragEvent) => {
      console.log("ondragleave", ev.target);
      ev.preventDefault();
      const target = ev.target as HTMLDivElement;
      if (target.classList.contains("droppable")) {
        target.classList.remove("dragover");
      }
    };
    const drop = (ev: DragEvent) => {
      console.log("Drop", ev);
      ev.preventDefault();
      const target = ev.target as HTMLDivElement;
      const answerIndex = parseInt(ev.dataTransfer.getData("answerindex"));
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

      const old = this.currentGraphNode.o[answerIndex];
      this.currentGraphNode.o[answerIndex] = this.currentGraphNode.o[dropIndex];
      this.currentGraphNode.o[dropIndex] = old;

      // Re-build the list : )
      _self.showAnswerOptions(nodeName, graphNode);
      _self.editorHelpers.pb.redraw();
    };

    const dropArea = this.makeADropArea(0, drop, onDragOver, onDragLeave);
    this.optionsElement.appendChild(dropArea);

    for (var i = 0; i < graphNode.o.length; i++) {
      const option: IAnswer = graphNode.o[i];

      const answerElement = document.createElement("div") as HTMLDivElement;
      const labelElement = document.createElement("div") as HTMLDivElement;
      const textElement = document.createElement("input") as HTMLInputElement;
      const selectElement = this.createNodeSelectElement(nodeName, option.next);
      labelElement.innerHTML = `A#${i}`;
      textElement.setAttribute("value", option.a);

      answerElement.appendChild(labelElement);
      answerElement.appendChild(textElement);
      answerElement.appendChild(selectElement);

      const handleDrag = ev => {
        // ev.dataTransfer.setData("text", ev.target.id);
        ev.dataTransfer.setData("answerindex", ev.target.getAttribute("data-answerindex"));
      };

      answerElement.setAttribute("draggable", "true");
      answerElement.setAttribute("data-answerindex", `${i}`);
      answerElement.addEventListener("dragstart", handleDrag);

      const dropArea = this.makeADropArea(i + 1, drop, onDragOver, onDragLeave);

      this.optionsElement.appendChild(answerElement);
      this.optionsElement.appendChild(dropArea);

      textElement.addEventListener("change", this.handleATextChanged(this, option));
      selectElement.addEventListener("change", this.handleASuccessorChanged(this, option));
    }
  }

  private makeADropArea(
    dropIndex: number,
    drop: (evt: DragEvent) => void,
    onDragOver: (evt: DragEvent) => void,
    onDragLeave: (evt: DragEvent) => void
  ) {
    const dropArea = document.createElement("div");
    dropArea.setAttribute("data-dropindex", `${dropIndex}`);
    dropArea.classList.add("a-droparea", "droppable");
    dropArea.addEventListener("drop", drop);
    dropArea.addEventListener("dragover", onDragOver);
    dropArea.addEventListener("dragleave", onDragLeave);
    return dropArea;
  }

  private createNodeSelectElement(currentKey: string, selectedKey): HTMLSelectElement {
    const selectElement = document.createElement("select") as HTMLSelectElement;
    if (!this.dialogConfigWithPositions) {
      console.warn("Warning: cannout populate nodeSelectElement. No dialogConfig set.");
    } else {
      for (var key in this.dialogConfigWithPositions.graph) {
        if (!this.dialogConfigWithPositions.graph.hasOwnProperty(key)) {
          return;
        }
        const questionaire: IMiniQuestionaire = this.dialogConfigWithPositions.graph[key];
        const optionElement = document.createElement("option") as HTMLOptionElement;
        optionElement.setAttribute("value", key);
        optionElement.innerHTML = `${key}: ${EditorHelper.ellipsify(questionaire.q, 20)}`;
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
  }
}
