globalThis.addEventListener("load", function () {
  const pathYannick = "export-test/dialog-config-Yannick.json";

  RPGDialogueLogic.loadFromJSON(pathYannick).then(rpgDialogue => {
    console.log("rpgDialogue for Yannick", rpgDialogue);

    // +---------------------------------------------------------------------------------
    // | Just for the demo: see on the console which dialogue state is
    // | currently active.
    // +-------------------------------
    rpgDialogue.addDialogueChangeListener((dialogueConfig, nextNodeName, oldNodeName, selectedOptionIndex) => {
      console.log("nextNodeName", nextNodeName);
    });
    // +---------------------------------------------------------------------------------
    // | Define a default dialogue renderer.
    // | This one just uses the given DIV tags for input and output.
    // +-------------------------------
    const renderer = new DefaultDialogueRenderer("rpg-output-question", "rpg-output-options");
    rpgDialogue.beginConversation(renderer);
  });
});
