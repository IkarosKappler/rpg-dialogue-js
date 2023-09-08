# rpg-dialogue-js

A simple RPG non-linear dialogue engine.

![Screenshot](/resources/screenshots/20230725-0-init.png)

Load some JSON file into your app.
Have a smooth dialogue logic for NPC characters.

Maybe an editor could look like this?
![Screenshot](/resources/screenshots/20230803-1-styled-editor.png)

## Example

Prepare a simple HTML container for output:

```HTML
<div id="rpg-output">
    <div id="rpg-output-question"></div>
    <ul id="rpg-output-options"></ul>
</div>
```

Load the dialogue config from the specific JSON file:

```Javascript
globalThis.addEventListener("load", function () {
  // Get an instance for the library.
  var rpgDialogue = RPGDialogue();

  // Define global libraries.
  var globalLibs = { axios: axios };

  // This is the dialgue configuration file we want to load.
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

```

Live example (with two NPCs): https://plotboilerplate.io/rpg-dialogue/dist/tests/test-dialogue-multi.html

```JSON
{
  "meta": { "name": "welcome", "npcs": [{ "name": "Yannick" }] },
  "graph": {
    "intro": {
      "q": "Light, stranger! I haven't seen <i>your</i> face here before. New to Humboldt Haven?",
      "o": [
        { "a": "Hello. That's because I just arrived.", "next": "dia0" },
        { "a": "Light! My ... ehm, ship ... has a battery problem", "next": "dia9" },
        { "a": "I have no idea why <i>you</i> should bother.", "next": "dia1" }
      ]
    },
    "dia1": {
      "q": "Why so grumpy? You whale lice always have a lack of surface simulation, huh?",
      "o": [
        { "a": "Why would you care?", "next": "dia2" },
        { "a": "Yeah, it's been some rough weeks.", "next": "dia3" },
        {
          "a": "Oh, how creative, <i>Whale lice</i> – because I came with a freighter. Seems I met the station's joker.",
          "next": "dia2"
        }
      ]
    },
    "dia9": {
      "q": "You call that wreckage a ship?",
      "o": [
        { "a": "Well ...", "next": "dia10" },
        { "a": "It floats in water, has a hull, contains an Heliox atmopshere: A ship.", "next": "dia10" },
        { "a": "You call this 'a life'?", "next": "dia11" }
      ]
    },
    "dia10": {
      "q": "A ship has a way to move around, friend. Your's just – well – floats. I'll give you a hint: ask Luka over there, they can even fix a broken tin can. Looks like you need their crafts right now.",
      "o": [{ "a": "Any ideas?", "next": "dia6" }]
    },
    "dia11": {
      "q": "Hey, I just got a raise and have a pretty good life. Got it?",
      "o": [{ "a": "You got your own cabin and privacy?", "next": "dia12" }]
    },
    "dia3": {
      "q": "Ok, you seem like your sea has been rough recently. Already thought you might be some selfish mud eel.",
      "o": [
        { "a": "Be careful what you say.", "next": "dia2" },
        { "a": "I just arrived and could need some help with my ... ehm, ship.", "next": "dia5" }
      ]
    },
    "dia0": {
      "q": "Friendly arrivals are always welcome. Have a look around.",
      "o": [
        { "a": "Thanks. Do you know some ship repair?", "next": "dia6" },
        { "a": "Is this station safe? I mean, your lock hydraulics seems a bit ... icky.", "next": "dia5" }
      ]
    },
    "dia2": { "q": "Oohkay, oohkay. Not me trying to help a stranger.", "o": [{ "a": "Bye.", "next": "dia4" }] },
    "dia12": {
      "q": "Nah, I can afford 15 additional bottles of synthohol now. _That's_ a life! I give you a hint",
      "o": [{ "a": "Neat. Do you know anyone around who hasn't two left hands?", "next": "dia6" }]
    },
    "dia5": {
      "q": "No worry. Since the sea quake near Bergen we all have some trouble of the one or other sort. Your 'ship' looks horrible. Need something?",
      "o": [
        { "a": "Do you know anyone around who hasn't two left hands?", "next": "dia6" },
        { "a": "Sea quake? Has it been severe?", "next": "dia55" }
      ]
    },
    "dia6": { "q": "Sure! Ask Luka over there. They will fix even a broken tin can.", "o": [{ "a": "Thanks!", "next": "dia7" }] },
    "dia55": {
      "q": "Do you spend your life under some rock? The tremors around the coastline got worse and worse over the recent months. Elvstrøm station had many casualties when the ground shook at more than strength 6 last week.",
      "o": [
        {
          "a": "Thanks for the news, I didn't know about any seismic activity in the north sea. Is there someone around who's experienced with battery tech?",
          "next": "dia6"
        },
        {
          "a": "I'm not into the latest geology news recently. Do you have any technicians who can help me with my battery here?",
          "next": "dia6"
        }
      ]
    },
    "dia4": {
      "q": "One hint, but just because I'm nice even to mud eels like you. Your 'ship' definiety needs some fixing. Ask Luka over there. They will fix even a broken tin can.",
      "o": [
        { "a": "A – tin – can – ? Ok.", "next": "FINAL" },
        { "a": "Thanks.", "next": "FINAL" }
      ]
    },
    "dia8": {
      "q": "You're really not from here. Well, good luck friend.",
      "o": [
        { "a": "Same to you!", "next": "FINAL" },
        { "a": "Sigh.", "next": "FINAL" }
      ]
    },
    "dia7": {
      "q": "Asmussen with you.",
      "o": [
        { "a": "Who?", "next": "dia8" },
        { "a": "Asmussen with you.", "next": "FINAL" }
      ]
    },
    "FINAL": { "q": "---EOC---", "o": [] }
  }
}


```

## Editor Example

You don't need to edit the JSON manually. Just use the included dialogue graph editor.

Live editor example: https://plotboilerplate.io/rpg-dialogue/dist/tests/editor.html

## Add custom stylings

Add some simple stylesheets to create a custom nice game dialogue.

![Screenshot](/resources/screenshots/20230808-0-styled-cyber-demo.png)

## Credits

- Freeiconsshop for the download icon.
- https://map.openseamap.org for the sea map images.
- Marco Botto for the bundling tutorial https://marcobotto.com/blog/compiling-and-bundling-typescript-libraries-with-webpack/
