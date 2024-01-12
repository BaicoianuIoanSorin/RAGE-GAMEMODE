import fs from 'fs';
import { ON_FOOT_CAR_EVENTS } from '@shared/position-savings/events.constants';
const saveFile = "savedpos.txt";

mp.events.addCommand(ON_FOOT_CAR_EVENTS.SAVE, (player, name = "No name") => {
    let pos : any = (player.vehicle) ? player.vehicle.position : player.position;

	let message: string = `${name} | Position: ${pos.x}, ${pos.y}, ${pos.z}`;
	if(player.vehicle) {
		let rot = player.vehicle.rotation;
		message += ` | Heading: ${rot.x}, ${rot.y}, ${rot.z} | InCar\n`;
	}
	else {
		message += ` | Heading: ${player.heading} | OnFoot\n`;
	}
    fs.appendFile(saveFile, message, (err: any) => {
        if (err) {
            player.notify(`~r~SavePos Error: ~w~${err.message}`);
        } else {
            player.notify(`~g~Position saved. ~w~(${name})`);
        }
    });
});
