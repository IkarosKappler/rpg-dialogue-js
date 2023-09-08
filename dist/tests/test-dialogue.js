globalThis.addEventListener("load", function () {
  var rpgDialogue = RPGDialogue();

  var globalLibs = { axios: axios };

  const pathYannick = "export-test/dialog-config-Yannick.json";

  rpgDialogue.RPGDialogueLogic.loadFromJSON(pathYannick, globalLibs).then(dialogueStruct => {
    console.log("rpgDialogue for Yannick", dialogueStruct);

    // +---------------------------------------------------------------------------------
    // | Just for the demo: see on the console which dialogue state is
    // | currently active.
    // +-------------------------------
    dialogueStruct.addDialogueChangeListener((dialogueConfig, nextNodeName, oldNodeName, selectedOptionIndex) => {
      console.log("nextNodeName", nextNodeName);
    });
    // +---------------------------------------------------------------------------------
    // | Define a default dialogue renderer.
    // | This one just uses the given DIV tags for input and output.
    // +-------------------------------
    const renderer = new rpgDialogue.DefaultDialogueRenderer("rpg-output-question", "rpg-output-options");
    dialogueStruct.beginConversation(renderer);
  });
});
