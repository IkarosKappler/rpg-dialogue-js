globalThis.addEventListener("load", function () {
  const path = "export-test/dialog-config-8-with-npc.json";
  RPGDialogueLogic.loadFromJSON(path).then(rpgDialogue => {
    console.log("rpgDialogue", rpgDialogue);

    rpgDialogue.beginConversation(new DefaultDialogueRenderer("rpg-output-question", "rpg-output-options"));
  });
});
