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
  optionsElement: HTMLDivElement;

  constructor(editorHelpers: EditorHelper, dialogConfigWithPositions: IDialogueConfig<IMiniQuestionaireWithPosition>) {
    this.editorHelpers = editorHelpers;
    this.dialogConfigWithPositions = dialogConfigWithPositions;

    this.editorElement = document.getElementById("attribute-editor") as HTMLDivElement;
    this.optionsElement = document.getElementById("e-options-container") as HTMLDivElement;
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

  private handleQChanged() {}

  private handleAChanged() {}

  showOptions(nodeName: string, graphNode: IMiniQuestionaireWithPosition | null) {
    this.editorElement.querySelector("input#e-key").setAttribute("value", nodeName ? nodeName : "");
    this.editorElement.querySelector("input#e-q").setAttribute("value", graphNode ? graphNode.q : "");
    this.optionsElement.innerHTML = "";
    for (var i in graphNode.o) {
      const option: IAnswer = graphNode.o[i];

      const answerElement = document.createElement("div") as HTMLDivElement;
      const labelElement = document.createElement("div") as HTMLDivElement;
      const textElement = document.createElement("input") as HTMLInputElement;
      const selectElement = this.createNodeSelectElement(nodeName);
      labelElement.innerHTML = `A#${i}`;
      textElement.setAttribute("value", option.a);

      answerElement.appendChild(labelElement);
      answerElement.appendChild(textElement);
      answerElement.appendChild(selectElement);

      this.optionsElement.appendChild(answerElement);
    }
  }

  private createNodeSelectElement(currentKey: string): HTMLSelectElement {
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

        selectElement.appendChild(optionElement);
      }
    }
    return selectElement;
  }
}
