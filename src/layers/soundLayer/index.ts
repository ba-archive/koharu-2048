import { sound } from "@pixi/sound";
import { Spine } from "pixi-spine";
import { PlaySound } from "@/types/events";
import eventBus from "@/event";

export const SoundLayer = {
  init(spine: Spine) {
    spine.spineData.events
      .map(event => {
        if (event.name.startsWith("Talk")) {
          return "";
        }
        return event.name.replace("sound/", "").replace(".wav", "");
      })
      .filter(it => it)
      .forEach(name => {
        sound.add(
          name,
          `https://yuuka.cdn.diyigemt.com/image/ba-all-data/Audio/VoiceJp/Character_voice/JP_Koharu/${name}.mp3`
        );
      });
    sound.add("click", {
      url: "https://yuuka.cdn.diyigemt.com/image/ba-all-data/Audio/Sound/UI_Button_Touch.wav",
      preload: true,
    });
    sound.add("back", {
      url: "https://yuuka.cdn.diyigemt.com/image/ba-all-data/Audio/Sound/UI_Button_Back.wav",
      preload: true,
    });
    eventBus.on("playSound", SoundLayer.play);
    eventBus.on("dispose", SoundLayer.dispose);
  },
  play(config: PlaySound) {
    return sound.play(config.name, config.options);
  },
  dispose() {
    sound.stopAll();
    sound.close();
    eventBus.off("playSound", SoundLayer.play);
    eventBus.off("dispose", SoundLayer.dispose);
  },
};
