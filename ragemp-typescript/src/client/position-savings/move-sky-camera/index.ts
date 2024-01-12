/*
    Developed by Jengas
*/
import { SKY_CAMERA } from "@shared/position-savings/events.constants";

const Natives = {
    SWITCH_OUT_PLAYER: '0xAAB3200ED59016BC',
    SWITCH_IN_PLAYER: '0xD8295AF639FD9CB8',
    IS_PLAYER_SWITCH_IN_PROGRESS: '0xD9D2CFFF49FAB35F'
};

let gui: boolean;

mp.events.add(SKY_CAMERA.MOVE_SKY_CAMERA, moveFromToAir);

function moveFromToAir(player: PlayerMp, moveTo: string, switchType: string, showGui: boolean) {
    /*
        switchType: 0 - 3

        0: 1 step towards ped
        1: 3 steps out from ped (Recommended)
        2: 1 step out from ped
        3: 1 step towards ped
    */
   switch (moveTo) {
       case 'up':
            if (showGui == false) {
                mp.gui.chat.show(showGui);
                gui = false;
            };
            mp.game.invoke(Natives.SWITCH_OUT_PLAYER, player.handle, 0, parseInt(switchType));
           break;
       case 'down':
            if (!gui) {
                checkCamInAir();
            };
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
    } else {
        mp.gui.chat.show(true);
        gui = true;
    }
}
