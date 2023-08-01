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
    this.currentNodeName = nodeName;
    this.currentGraphNode = graphNode;

    this.keyElement.setAttribute("value", nodeName ? nodeName : "");
    this.qElement.setAttribute("value", graphNode ? graphNode.q : "");
    this.optionsElement.innerHTML = "";
    if (!graphNode) {
      return;
    }
    for (var i in graphNode.o) {
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

      this.optionsElement.appendChild(answerElement);

      textElement.addEventListener("change", this.handleATextChanged(this, option));
      selectElement.addEventListener("change", this.handleASuccessorChanged(this, option));
    }
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
