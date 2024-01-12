import './setup';
import './position-savings';
import './auth';
import './test';
import './typeorm/typeorm';
import './commands/utils';
import './admin';
import { PLAYER_CONSTANTS } from '@shared/ragemp-library/events.constants';
import { SHARED_CONSTANTS } from '@shared/constants';

mp.events.add(PLAYER_CONSTANTS.PLAYERS_READY, (player) => {
	console.log(`Server: ${player.name} is ready!`);

	// 	player.customProperty = 1;

	// 	player.customMethod = () => {
	// 	console.log('customMethod called.');
	// };

	// 	player.customMethod();
});

mp.events.add(PLAYER_CONSTANTS.PLAYER_QUIT, (player) => {
	// let mySQLDate = convertToMysqlDate(new Date());

	// databaseConfig
	// 	.getHandler()
	// 	.query(
	// 		`UPDATE player SET last_login = '${mySQLDate}', is_logged_in = 0 WHERE username = '${player.name}'`,
	// 		(error: any, results: any, fields: any) => {
	// 			if (error) {
	// 				console.log(error);
	// 				return;
	// 			}
	// 		}
	// 	);

	console.log(`Server: ${player.name} has left the server.`);
});

console.log(SHARED_CONSTANTS.HELLO_WORLD);
