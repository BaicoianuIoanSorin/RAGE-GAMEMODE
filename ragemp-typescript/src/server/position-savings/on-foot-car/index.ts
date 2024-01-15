import * as rpc from 'rage-rpc';
import { findPlayerByName } from '@/utils/players';
import { Commands } from '@shared/player/commands';

const fs = require('fs').promises;
const saveFile = 'savedpos.txt';

rpc.register(Commands.SAVE, async (argsJSON, info) => {
	console.log(`command:${Commands.SAVE} -> ${argsJSON}`);

	let args: Array<string> = JSON.parse(argsJSON);
	let name: string = args[0];
	// TODO later on use info.player.id instead of info.player.name
	let player: PlayerMp | undefined = findPlayerByName(info.player.name);

	if (!player) {
		console.error(`command:${Commands.SAVE} -> ${args} -> player not found`);
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
	try {
		await fs.appendFile(saveFile, message);
		return {
			title: 'SavePos',
			status: 'success',
			description: `Saved with ${name} name.`
		}
	}
	catch(error: any) {
		return {
			title: 'SavePos',
			status: 'error',
			description: error.message
		}
	}
});
