globalThis.addEventListener("load", function () {
  console.log("Init");

  //   new RPGDialogue("../../resources/");
  // const path = "../../resources/20230721_floatsim_storyline_dialog.json";
  const path = "../../resources/export-test/dialog-config-7.json";
  RPGDialogueLogic.loadFromJSON(path).then(rpgDialogue => {
    console.log("rpgDialogue", rpgDialogue);

    rpgDialogue.beginConversation("rpg-output-question", "rpg-output-options");
  });
});
