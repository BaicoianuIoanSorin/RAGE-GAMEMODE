import { AUTH } from '@shared/authentication/events.constants';
import { GENERAL_STATUS_CODES, LOGIN_STATUS_CODES } from '@shared/status-codes/status-codes.constants';
import { SKY_CAMERA } from '@shared/position-savings/events.constants';
import * as rpc from 'rage-rpc';
import { AppDataSource } from '@/typeorm/typeorm';
import { User } from '@shared/entity/User';
import { PlayersVariables } from '@shared/player/PlayerVariables';
import { ThirstyHunger } from '@shared/entity/ThirstyHunger';
import { ThirstyHungerEvents } from '@shared/thirsty-hunger/events.constants';

const userRepository = AppDataSource.getRepository(User);
const thirstyHungerRepository = AppDataSource.getRepository(ThirstyHunger);

function isElegible(player: PlayerMp, password: string) {
	if (!password) {
		player.outputChatBox('Usage: /login [password]');
		return false;
	}

	//disabled as it's not possible to do something like this probably
	// let playerPosition = player.position;
	// if (
	// 	playerPosition &&
	// 	playerPosition.x != LOGIN_LABEL_VECTOR.x &&
	// 	playerPosition.y != LOGIN_LABEL_VECTOR.y &&
	// 	playerPosition.z != LOGIN_LABEL_VECTOR.z
	// ) {
	// 	player.outputChatBox('You are not in the login position.');
	// 	return false;
	// }

	return true;
}

mp.events.add(AUTH.JOIN, (player: PlayerMp) => {
	console.log(AUTH.JOIN);
	player.call(SKY_CAMERA.MOVE_SKY_CAMERA, [player, 'up', 1, true]);
});

mp.events.add(AUTH.SERVER_LOGIN_SUCCES, (player: PlayerMp) => {
	console.log(AUTH.SERVER_LOGIN_SUCCES);
	player.call(SKY_CAMERA.MOVE_SKY_CAMERA, [player, 'down']);
});

rpc.register(AUTH.SERVER_LOGIN, async (formFieldsJSON) => {
	console.log(AUTH.SERVER_LOGIN);
	let formFields = JSON.parse(formFieldsJSON);
	console.log(formFields);
	console.log(AUTH.SERVER_LOGIN);
	let player: PlayerMp = mp.players.at(formFields.playerId);
	if (!isElegible(player, formFields.password)) return;

	try {
		const user: User | null = await userRepository.findOneBy({ username: player.name });
		if (!user) {
			return LOGIN_STATUS_CODES.USERNAME_IS_NOT_VALID;
		}

		// TODO hash this password
		if (user.password !== formFields.password) {
			return LOGIN_STATUS_CODES.PASSWORD_IS_NOT_VALID;
		}

		player.outputChatBox('You are logged in.');
		// TODO maybe add an util class for player commands inside player shared folder
		player.setVariables({
			[PlayersVariables.serverId]: user.id,
			[PlayersVariables.Admin]: user.admin,
			[PlayersVariables.Helper]: user.helper
		});

		player.health = 100;
		rpc.triggerBrowsers(ThirstyHungerEvents.CEF_GET_HUNGRY_AND_THIRSTY_LEVEL, 'some message, idk i am sending this');
		rpc.call(AUTH.SERVER_UPDATE_LAST_LOGIN);
		
		return GENERAL_STATUS_CODES.OK;
	} catch (error: any) {
		console.log(error);
		return GENERAL_STATUS_CODES.SERVER_ERROR;
	}

	// TODO ADD DATE FOR LAST LOGIN
	// databaseConfig
	// 	.getHandler()
	// 	.query(
	// 		`UPDATE player SET last_login = '${mySQLDate}', is_logged_in = 1 WHERE username = '${player.name}'`,
	// 		(error: any, results: any, fields: any) => {
	// 			if (error) {
	// 				console.log(error);
	// 				//TODO NEEDS to be changed to STATUS_CODES.SERVER_ERROR
	// 				return;
	// 			}
	// 		}
	// 	);
});

rpc.register(AUTH.SERVER_REGISTER, async (formFieldsJSON) => {
	console.log(AUTH.SERVER_REGISTER);
	let formFields = JSON.parse(formFieldsJSON);
	console.log(formFields);
	console.log(AUTH.SERVER_REGISTER);
	let player: PlayerMp = mp.players.at(formFields.playerId);
	if (!isElegible(player, formFields.password)) return;

	try {
		const playerDatabase = await userRepository.findOneBy({ username: player.name });

		if (playerDatabase) {
			return LOGIN_STATUS_CODES.USERNAME_IS_NOT_VALID;
		}

		// TODO hash this password
		const newUser = new User(player.name, formFields.password, formFields.email);
		await userRepository.save(newUser);

		const newThirstyHunger = new ThirstyHunger(newUser);
		await thirstyHungerRepository.save(newThirstyHunger);
		return GENERAL_STATUS_CODES.OK;
	} catch (error: any) {
		console.error(`Error at ${AUTH.SERVER_REGISTER} -> ${error}`);
		return GENERAL_STATUS_CODES.SERVER_ERROR;
	}
});

rpc.register(AUTH.SERVER_UPDATE_LAST_LOGIN, async (message, info) => {
	// not yet playerInfoJSON used

	const player: PlayerMp = mp.players.at(info.player.id);

	if (!player) {
		console.log(`Player not found at ${AUTH.SERVER_UPDATE_LAST_LOGIN}`);
	}

	try {
		const userId = player.getVariable(PlayersVariables.serverId);
		await userRepository.update({ id: userId }, { lastLoggedIn: new Date() });
		console.log(`Updated last login for user ${userId}`);
	} catch (error: any) {
		console.error(`Error at ${AUTH.SERVER_UPDATE_LAST_LOGIN} -> ${error}`);
	}
});
