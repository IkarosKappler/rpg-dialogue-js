globalThis.addEventListener("load", function () {
  const path = "../../resources/export-test/dialog-config-7.json";
  RPGDialogueLogic.loadFromJSON(path).then(rpgDialogue => {
    console.log("rpgDialogue", rpgDialogue);

    rpgDialogue.beginConversation("rpg-output-question", "rpg-output-options");
  });
});
