import { AUDIO_EVENTS, SoundsEnum, SoundsMap } from "../audio/audio";

// TODO this method should be generic -> the sound should be passed as a parameter as well
export function makeToast(
  rpc: any | undefined,
  toast: any,
  title: string,
  description: string,
  status: "success" | "error" | "warning" | "info" | undefined
) {
  toast({
    title: title,
    description: description,
    status: status,
    duration: 4000,
    isClosable: true,
  });

  if(rpc !== undefined) {
    rpc.triggerClient(
      AUDIO_EVENTS.PLAY_SOUND_FRONTEND,
      JSON.stringify(SoundsMap.get(SoundsEnum.SOME_COOL_NOTIFICATION_SOUND))
    );
  }
}
