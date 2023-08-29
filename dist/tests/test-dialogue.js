globalThis.addEventListener("load", function () {
  const pathYannick = "export-test/dialog-config-Yannick.json";
  const pathLuka = "export-test/dialog-config-Luka.json";

  let dialogueYannick = null;
  let dialogueLuka = null;

  let isYannicksDialogueTerminated = false;

  RPGDialogueLogic.loadFromJSON(pathYannick).then(rpgDialogue => {
    console.log("rpgDialogue for Yannick", rpgDialogue);

    dialogueYannick = rpgDialogue;
    dialogueYannick.addDialogueChangeListener((dialogueConfig, nextNodeName, oldNodeName, selectedOptionIndex) => {
      console.log("nextNodeName", nextNodeName);
      if (nextNodeName === null) {
        console.log("x");
        isYannicksDialogueTerminated = true;
        disableNpc("yannick", true);
        handleLukasDialogue();
      }
    });
    const yannicksRenderer = new DefaultDialogueRenderer("rpg-output-question", "rpg-output-options");
    // yannicksRenderer.onConversationTerminated = () => {
    //   handleLukasDialogue();
    // };
    dialogueYannick.beginConversation(yannicksRenderer);
  });

  RPGDialogueLogic.loadFromJSON(pathLuka).then(rpgDialogue => {
    console.log("rpgDialogue for Luka", rpgDialogue);

    dialogueLuka = rpgDialogue;
    handleLukasDialogue();
    // rpgDialogue.beginConversation(new DefaultDialogueRenderer("rpg-output-question", "rpg-output-options"));
  });

  const handleLukasDialogue = () => {
    if (!isYannicksDialogueTerminated || !dialogueLuka) {
      console.log(
        "Luka's dialogue is not yet ready.",
        "isYannicksDialogueTerminated",
        isYannicksDialogueTerminated,
        "dialogueLuka loaded?",
        dialogueLuka != null
      );
      return;
    }
    console.log("Enabbling dialogue with Luka");
    enableNpc("luka", () => {
      console.log("Starting Luka's dialogue.");
      dialogueLuka.beginConversation(new DefaultDialogueRenderer("rpg-output-question", "rpg-output-options"));
    });
  };

  const disableNpc = npcName => {
    const container = document.getElementById(npcName);
    container.classList.remove("active");
  };

  const enableNpc = (npcName, onClick) => {
    const container = document.getElementById(npcName);
    container.classList.add("active");
    container.addEventListener("click", () => {
      onClick();
    });
  };
});
