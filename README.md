# rpg-dialogue

A simple RPG non-linear dialogue engine.

![Screenshot](/resources//screenshots/20230725-0-init.png)

Load some JSON file into your app.
Have a smooth dialogue logic for NPC characters.

Example

```JSON
{
  "intro": {
    "q": "Light, stranger! I haven't seen <i>your</i> face here before. New to the region?",
    "o": [
      { "a": "Hello. That's because I just arrived." },
      { "a": "Light! My ... ehm, ship ... has a battery problem", "next": "xxx5" },
      { "a": "I have no idea why <i>you</i> should you bother.", "next": "xxx1" }
    ]
  },
  "xxx1": {
    "q": "Why so grumpy? You whale lice always have a lack of surface simulation, huh?",
    "o": [
      { "a": "Why would you care?", "next": "xxx2" },
      { "a": "Yeah, it's been some rough weeks.", "next": "xxx3" },
      {
        "a": "Oh, how creative, <i>Whale lice</i> – because I came with a freighter. Seems I met the station's joker.",
        "next": "xxx2"
      }
    ]
  },
  "xxx2": {
    "q": "Oohkay, oohkay. Not me trying to help a stranger.",
    "o": [{ "a": "Bye.", "next": "xxx4" }]
  },
  "xxx4": {
    "q": "One hint, but just because I'm nice even to mud eels like you. Your 'ship' definiety needs some fixing. Ask Luka over there. They will fix even a broken tin can.",
    "o": [
      { "a": "A – tin – can – ? Ok.", "next": "FINAL" },
      { "a": "Thanks.", "next": "FINAL" }
    ]
  },
  "xxx5": {
    "q": "No worry. Since the sea quake near Bergen we all have some trouble of the one or other sort. Your 'ship' looks horrible. Need something?",
    "o": [
      { "a": "Do you know anyone around who hasn't two left hands?", "next": "xxx6" },
      { "a": "Sea quake? Has it been severe?", "next": "xxx55" }
    ]
  },
  "xxx55": {
    "q": "Do you spend your life under some rock? The tremors around the coastline got worse and worse over the recent months. Elvstrøm station had many casualties when the ground shook at more than strength 6 last week.",
    "o": [
      {
        "a": "Thanks for the news, I didn't know about any seismic activity in the north sea. Is there someone around who's experienced with battery tech?",
        "next": "xxx6"
      },
      {
        "a": "I'm not into the latest geology news recently. Do you have any technicians who can help me with my battery here?",
        "next": "xxx6"
      }
    ]
  },
  "xxx6": {
    "q": "Sure! Ask Luka over there. They will fix even a broken tin can.",
    "o": [{ "a": "Thanks!", "next": "xxx7" }]
  },
  "xxx7": {
    "q": "Asmussen with you.",
    "o": [{ "a": "Who?", "next": "xxx8" }]
  },
  "xxx8": {
    "q": "You're really not from here. Well, good luck friend.",
    "o": [{ "a": "Same to you!", "next": "FINAL" }]
  },
  "xxx9": {
    "q": "You call that wreckage a ship?",
    "o": [
      { "a": "Well ...", "next": "xxx10" },
      { "a": "It floats in water, has a hull, contains an Heliox atmopshere: A ship.", "next": "xxx10" },
      { "a": "You call this 'a life'?", "next": "xxx11" }
    ]
  },
  "xxx10": {
    "q": "A ship has a way to move around, friend. Your's just – well – floats. I'll give you a hint: ask Luka over there, they can even fix a broken tin can. Looks like you need their crafts right now.",
    "o": [
      {
        "a": "Any ideas?",
        "next": "xxx6"
      }
    ]
  },
  "xxx11": {
    "q": "Hey, I just got a raise and have a pretty good life. Got it?",
    "o": [{ "a": "You got your own cabin and privacy?", "next": "xxx12" }]
  },
  "xxx12": {
    "q": "Nah, I can afford 15 additional bottles of synthohol now. _That's_ a life! I give you a hint",
    "o": {
      "a": "Neat. Do you know anyone around who hasn't two left hands?",
      "next": "xxx6"
    }
  },
  "FINAL": null
}

```
