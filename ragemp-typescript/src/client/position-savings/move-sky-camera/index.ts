/*
    Developed by Jengas
*/
import { CreatorEvents } from '@shared/character-creation/events.constants';
import { SKY_CAMERA } from '@shared/position-savings/events.constants';
import { WINDOW_EVENTS, Window, WindowState } from '@shared/window/windows.constants';
import * as rpc from 'rage-rpc';
const Natives = {
	SWITCH_OUT_PLAYER: '0xAAB3200ED59016BC',
	SWITCH_IN_PLAYER: '0xD8295AF639FD9CB8',
	IS_PLAYER_SWITCH_IN_PROGRESS: '0xD9D2CFFF49FAB35F'
};

mp.events.add(SKY_CAMERA.MOVE_SKY_CAMERA, moveFromToAir);

async function moveFromToAir(player: PlayerMp, moveTo: string, switchType: string, isOnLoggedIn: boolean) {
	/*
        switchType: 0 - 3

        0: 1 step towards ped
        1: 3 steps out from ped (Recommended)
        2: 1 step out from ped
        3: 1 step towards ped
    */
	switch (moveTo) {
		case 'up':
			mp.game.invoke(Natives.SWITCH_OUT_PLAYER, player.handle, 0, parseInt(switchType));
			break;
		case 'down':
			checkCamInAir();
			if (isOnLoggedIn) {
				let characterExists = await rpc.callServer(CreatorEvents.SERVER_CHECK_IF_CHARACTER_EXISTS, player.id);
				mp.console.logWarning('characterExists: ' + characterExists);
                
                if (!characterExists) {
					rpc.call(CreatorEvents.CLIENT_CREATOR_CAMERA_INIT);
                    rpc.triggerBrowser(mp.browsers.at(0), WINDOW_EVENTS.CHANGE_STATE_WINDOW,JSON.stringify([
                        {
                            windowName: Window.CHARACTER_CREATION,
                            state: true
                        },
                        // TODO delete this when the development of the character creation is finished
                        {
                            windowName: Window.HUD,
                            state: false
                        }
                    ] as WindowState[]));
				}
                else {
                    rpc.triggerBrowser(mp.browsers.at(0), WINDOW_EVENTS.CHANGE_STATE_WINDOW,JSON.stringify([
                        {
                            windowName: Window.HUD,
                            state: true
                        }
                    ] as WindowState[]));
                }
			}

			mp.game.invoke(Natives.SWITCH_IN_PLAYER, player.handle);
			break;
		default:
			break;
	}
}

// Checks whether the camera is in the air. If so, then reset the timer
function checkCamInAir() {
	if (mp.game.invoke(Natives.IS_PLAYER_SWITCH_IN_PROGRESS)) {
		setTimeout(() => {
			checkCamInAir();
		}, 400);
	}
}
