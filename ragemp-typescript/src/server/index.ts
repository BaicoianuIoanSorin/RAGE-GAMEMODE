import './setup';
import './position-savings';
import './auth';
import './test';
import './typeorm/typeorm';
import './commands/utils';
import './admin';
import './thirsty-hunger';
import './chat';
import './character-creation';
import { PLAYER_CONSTANTS } from '@shared/ragemp-library/events.constants';
import * as rpc from 'rage-rpc';
import { AUTH } from '@shared/authentication/events.constants';

mp.events.add(PLAYER_CONSTANTS.PLAYERS_READY, (player) => {
	console.log(`Server: ${player.name} is ready!`);

	// 	player.customProperty = 1;

	// 	player.customMethod = () => {
	// 	console.log('customMethod called.');
	// };

	// 	player.customMethod();
});

mp.events.add(PLAYER_CONSTANTS.PLAYER_QUIT, async (player, exitType, reason) => {
	const playerName = player.name;
	console.log(`Server: ${playerName} has left the server. Type: ${exitType} ${exitType === 'kicked' ? 'Reason: ' + reason : ''}`);
	// TODO add here event to all players that this player has left the server, depending on the chat

	await rpc.call(AUTH.SERVER_UPDATE_LAST_LOGIN, playerName);
	await rpc.call(
		AUTH.SERVER_UPDATE_IS_LOGGED_IN,
		JSON.stringify({
			playerName, 
			state: false
		})
	);
});
