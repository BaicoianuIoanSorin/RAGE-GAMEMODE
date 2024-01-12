import { AUDIO_EVENTS, Sound } from '@shared/audio/audio';
import * as rpc from 'rage-rpc';

rpc.on(AUDIO_EVENTS.PLAY_SOUND_FRONTEND, (event) => {
    const sound: Sound = JSON.parse(event);
    mp.game.audio.playSoundFrontend(-1, sound.soundName, sound.soundSetName, true);
    mp.console.logInfo(`[AUDIO - ${AUDIO_EVENTS.PLAY_SOUND_FRONTEND}] Playing sound ${sound.soundName} from set ${sound.soundSetName}`);
});