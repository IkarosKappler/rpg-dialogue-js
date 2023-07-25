globalThis.addEventListener("load", function () {
  console.log("Init");

  //   new RPGDialogue("../../resources/");
  RPGDialogueLogic.loadFromJSON("../../resources/20230721_floatsim_storyline_dialog.json").then(rpgDialogue => {
    console.log("rpgDialogue", rpgDialogue);

    rpgDialogue.beginConversation("output-question", "output-options");
  });
});
