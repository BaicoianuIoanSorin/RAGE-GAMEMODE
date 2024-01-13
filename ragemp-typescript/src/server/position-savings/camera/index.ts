import { findPlayerByName } from "@/utils/players";
import { CameraInformation } from "@shared/camera/model";
import { CAMERA_EVENTS } from "@shared/position-savings/events.constants";
import fs from 'fs';
import * as rpc from 'rage-rpc';

const fileSavedPosCam : string = 'savedposcam.txt';

rpc.register(CAMERA_EVENTS.SAVE_CAM, (argsJSON, info) => {
    console.log(`${CAMERA_EVENTS.SAVE_CAM} -> ${argsJSON}`);
    
    let args: Array<string> = JSON.parse(argsJSON);
    let name: string = args[0];
    let player: PlayerMp | undefined = findPlayerByName(info.player.name);
    if (!player) {
        console.error(`${CAMERA_EVENTS.SAVE_CAM} -> ${args} -> player not found`);
        return;
    }

    rpc.callClient(player, CAMERA_EVENTS.GET_CAM_COORDS, name);
});

rpc.register(CAMERA_EVENTS.SAVE_CAM_COORDS, (cameraInformationJSON: string, info) => {
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

    fs.appendFile(fileSavedPosCam, `Position: ${pos.x}, ${pos.y}, ${pos.z} | pointAtCoord: ${point.position.x}, ${point.position.y}, ${point.position.z} | entity: ${point.entity} - ${cameraInformation.name}\r\n`, (err) => {
        if (err) {
            player.notify(`~r~SaveCamPos Error: ~w~${err.message}`);
        } else {
            player.notify(`~g~PositionCam saved. ~w~(${cameraInformation.name})`);
        }
    });
});
