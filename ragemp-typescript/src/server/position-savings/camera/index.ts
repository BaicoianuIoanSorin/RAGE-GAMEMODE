import { CAMERA_EVENTS } from "@shared/position-savings/events.constants";
import fs from 'fs';
const fileSavedPosCam : string = 'savedposcam.txt';

mp.events.addCommand(CAMERA_EVENTS.SAVE_CAM, (player, name = 'No name') => {
    player.call(CAMERA_EVENTS.GET_CAM_COORDS, [name]);
});

mp.events.add(CAMERA_EVENTS.SAVE_CAM_COORDS, (player, position, pointAtCoord, name = 'No name') => {
    const pos = JSON.parse(position);
    const point = JSON.parse(pointAtCoord);

    fs.appendFile(fileSavedPosCam, `Position: ${pos.x}, ${pos.y}, ${pos.z} | pointAtCoord: ${point.position.x}, ${point.position.y}, ${point.position.z} | entity: ${point.entity} - ${name}\r\n`, (err) => {
        if (err) {
            player.notify(`~r~SaveCamPos Error: ~w~${err.message}`);
        } else {
            player.notify(`~g~PositionCam saved. ~w~(${name})`);
        }
    });
});
