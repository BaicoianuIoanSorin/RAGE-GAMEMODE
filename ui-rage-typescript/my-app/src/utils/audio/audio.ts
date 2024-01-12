export const AUDIO_EVENTS = {
    PLAY_SOUND_FRONTEND: "audio:playSoundFrontend",
  };
  
  export interface Sound {
    soundName: string;
    soundSetName: string;
  }
  
  export enum SoundsEnum {
    SOME_KIND_OF_SUCCESS = "SOME_KIND_OF_SUCCESS",
    NOTIFICATION_SOUND = "Notification sound",
    SOME_KING_OF_IMP_NOTIFICATION_SOUND = 'Some kind of important notification sound',
    SOME_COOL_NOTIFICATION_SOUND = 'Some cool notification sound',
  }
  
  export const SoundsMap: Map<SoundsEnum, Sound> = new Map([
    [
      SoundsEnum.SOME_KIND_OF_SUCCESS,
      {
        soundName: "CHECKPOINT_PERFECT",
        soundSetName: "HUD_MINI_GAME_SOUNDSET",
      },
    ],
    [
      SoundsEnum.NOTIFICATION_SOUND,
      {
        soundName: "CHALLENGE_UNLOCKED",
        soundSetName: "HUD_AWARDS",
      },
    ],
    [
      SoundsEnum.SOME_KING_OF_IMP_NOTIFICATION_SOUND,
      {
        soundName: "FocusIn",
        soundSetName: "HintCamSounds",
      },
    ],
    [
        SoundsEnum.SOME_COOL_NOTIFICATION_SOUND,
        {
          soundName: "On_Call_Player_Join",
          soundSetName: "DLC_HEISTS_GENERAL_FRONTEND_SOUNDS",
        },
    ]
  ]);
  