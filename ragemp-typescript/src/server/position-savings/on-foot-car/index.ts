import fs from 'fs';
import { ON_FOOT_CAR_EVENTS } from '@shared/position-savings/events.constants';
import * as rpc from 'rage-rpc';
import { findPlayerByName } from '@/utils/players';

const saveFile = 'savedpos.txt';

rpc.register(ON_FOOT_CAR_EVENTS.SAVE, (argsJSON, info) => {
	console.log(`${ON_FOOT_CAR_EVENTS.SAVE} -> ${argsJSON}`);

	let args: Array<string> = JSON.parse(argsJSON);
	let name: string = args[0];
	let player: PlayerMp | undefined = findPlayerByName(info.player.name);

	if (!player) {
		console.error(`${ON_FOOT_CAR_EVENTS.SAVE} -> ${args} -> player not found`);
		return;
	}
	let pos: any = player.vehicle ? player.vehicle.position : player.position;

	let message: string = `${name} | Position: ${pos.x}, ${pos.y}, ${pos.z}`;
	if (player.vehicle) {
		let rot = player.vehicle.rotation;
		message += ` | Heading: ${rot.x}, ${rot.y}, ${rot.z} | InCar\n`;
	} else {
		message += ` | Heading: ${player.heading} | OnFoot\n`;
	}
	fs.appendFile(saveFile, message, (err: any) => {
		if (err) {
            // TODO change this from notify to return inside the ui
			player?.notify(`~r~SavePos Error: ~w~${err.message}`);
		} else {
            // TODO change this from notify to return inside the ui
			player?.notify(`~g~Position saved. ~w~(${name})`);
		}
	});
});
