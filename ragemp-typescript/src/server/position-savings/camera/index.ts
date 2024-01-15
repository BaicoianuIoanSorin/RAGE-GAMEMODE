import { findPlayerByName } from "@/utils/players";
import { CameraInformation } from "@shared/camera/model";
import { ChatEventInfo } from "@shared/chat/model";
import { Commands } from "@shared/player/commands";
import { CAMERA_EVENTS } from "@shared/position-savings/events.constants";
const fs = require('fs').promises;
import * as rpc from 'rage-rpc';

const fileSavedPosCam : string = 'savedposcam.txt';

rpc.register(Commands.SAVE_CAM, async (argsJSON, info) => {
    console.log(`command:${Commands.SAVE_CAM} -> ${argsJSON}`);
    
    let args: Array<string> = JSON.parse(argsJSON);
    let name: string = args[0];
    let player: PlayerMp | undefined = findPlayerByName(info.player.name);
    if (!player) {
        console.error(`command:${Commands.SAVE_CAM} -> ${args} -> player not found`);
        return;
    }

    return await rpc.callClient(player, CAMERA_EVENTS.GET_CAM_COORDS, name);
});

rpc.register(CAMERA_EVENTS.SAVE_CAM_COORDS, async (cameraInformationJSON: string, info) => {
    console.log(`${CAMERA_EVENTS.SAVE_CAM_COORDS} -> ${cameraInformationJSON}`);

    const cameraInformation: CameraInformation = JSON.parse(cameraInformationJSON);
    const pos: any = cameraInformation.position;
    console.log(pos);
    const point: any = JSON.parse(cameraInformation.pointAtCoord);
    const player: PlayerMp | undefined = findPlayerByName(info.player.name);
    if (!player) {
        console.error(`${CAMERA_EVENTS.SAVE_CAM_COORDS} -> ${cameraInformation} -> player not found`);
        return;
    }

    try {
        await fs.appendFile(fileSavedPosCam, `Position: ${pos.x}, ${pos.y}, ${pos.z} | pointAtCoord: ${point.position.x}, ${point.position.y}, ${point.position.z} | entity: ${point.entity} - ${cameraInformation.name}\r\n`);
        return {
            title: 'SaveCamPos',
            status: 'success',
            description: `Saved with ${cameraInformation.name} name.`
        };
    } catch (err: any) {
        return {
            title: 'SaveCamPos',
            status: 'error',
            description: err.message
        };
    }
});
