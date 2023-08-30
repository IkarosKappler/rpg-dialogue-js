/**
 * This demo script demonstrates the usage of multiple dialogues
 * within one page and how to connect them.
 *
 * Like: one dialogue ended in the one or other way, which one
 *       will be the next possible?
 *
 * @author  Ikaros Kappler
 * @date    2023-08-30
 * @version 1.0.0
 */

globalThis.addEventListener("load", function () {
  const pathYannick = "export-test/dialog-config-Yannick.json";
  const pathLuka = "export-test/dialog-config-Luka.json";
  const paths = {
    yannick: pathYannick,
    luka: pathLuka
  };

  RPGDialogueLogic.loadAllFromJSON(paths).then(dialogueMappings => {
    console.log("dialogues", dialogueMappings.length);

    // +---------------------------------------------------------------------------------
    // | Define a default dialogue renderer.
    // | This one just uses the given DIV tags for input and output.
    // +-------------------------------
    const dialogueRenderer = new DefaultDialogueRenderer("rpg-output-question", "rpg-output-options");

    const enableLuka_PartA = () => {
      console.log("Starting Luka's dialogue.");
      sequence.beginConversation(dialogueRenderer, "luka", "intro");
    };

    // +---------------------------------------------------------------------------------
    // | Define a dialogue sequence and add a rule:
    // | Once Yannick's dialigue has ended, allow to click and start Luka's dialogue.
    // +-------------------------------
    const sequence = new RPGDialogueSequence(dialogueMappings);
    sequence.addRule("yannick", null, () => {
      console.log("End of yannick's dialogue reached.");
      disableNpc("yannick");
      enableNpc("luka", enableLuka_PartA);
    });

    const enableLuka_PartB = () => {
      console.log("Starting Luka's second dialogue.");
      sequence.beginConversation(dialogueRenderer, "luka", "intro_2");
    };

    // +---------------------------------------------------------------------------------
    // | Define a dialigue sequence and add a rule:
    // | ...
    // +-------------------------------
    sequence.addRule("luka", null, () => {
      console.log("End of luka's dialogue reached.");
      // Set a new begin-codition: 'intro_2'
      disableNpc("luka", enableLuka_PartA); // Remove the listener
      enableNpc("luka", enableLuka_PartB); // Add the new listener
    });

    sequence.beginConversation(dialogueRenderer, "yannick", "intro");
  });

  const disableNpc = (npcName, oldListener) => {
    const container = document.getElementById(npcName);
    container.classList.remove("active");
    container.removeEventListener("click", oldListener);
  };

  const enableNpc = (npcName, onClick) => {
    const container = document.getElementById(npcName);
    container.classList.add("active");
    container.addEventListener("click", onClick);
  };
});
