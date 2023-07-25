globalThis.addEventListener("load", function () {
  console.log("Init");

  //   new RPGDialogue("../../resources/");
  RPGDialogueLogic.loadFromJSON("../../resources/20230721_floatsim_storyline_dialog.json").then(rpgDialogue => {
    console.log("rpgDialogue", rpgDialogue);

    var questionNode = document.getElementById("output-question");
    var optionsNode = document.getElementById("output-options");

    /**
     * Set the text in the question node.
     * @param {*} questionText
     */
    var setQuestionText = function (questionText) {
      questionNode.innerHTML = questionText;
    };

    /**
     * Clear the options node. Just for upper level use here.
     */
    var clearOptionsNode = function () {
      optionsNode.innerHTML = "";
    };

    /**
     * Add a new option node with the given answer text and option index. Use
     * the option index to send the answer.
     *
     * @param {*} answerText
     * @param {*} optionIndex
     */
    var addOptionNode = function (answerText, optionIndex) {
      var answerNode = document.createElement("li");
      var answerLinkNode = document.createElement("a");
      answerLinkNode.innerHTML = answerText;
      answerLinkNode.setAttribute("href", "#");
      answerLinkNode.addEventListener("click", function () {
        sendAnswer(optionIndex);
      });
      answerNode.appendChild(answerLinkNode);
      optionsNode.appendChild(answerNode);
    };

    /**
     * Send the selected answer (by index).
     * @param {number} index
     */
    var sendAnswer = function (index) {
      rpgDialogue.sendAnswer(index);
      if (rpgDialogue.isEndReached()) {
        setQuestionText("---END---");
        clearOptionsNode();
      }
      clearOptionsNode();
      rpgDialogue.loadCurrentQuestionaire(setQuestionText, addOptionNode);
    };

    // Initialize the first question.
    rpgDialogue.loadCurrentQuestionaire(setQuestionText, addOptionNode);
  });
});
