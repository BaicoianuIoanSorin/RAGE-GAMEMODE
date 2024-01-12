import { AUTH } from '@shared/authentication/events.constants';
import { LOGIN_LABEL_VECTOR } from '@shared/authentication/objects.constants';
import { GENERAL_STATUS_CODES, LOGIN_STATUS_CODES } from '@shared/status-codes/status-codes.constants';
import { SKY_CAMERA } from '@shared/position-savings/events.constants';
import * as rpc from 'rage-rpc';
import { AppDataSource } from '@/typeorm/typeorm';
import { User } from '@shared/entity/User';

const labelPosition = new mp.Vector3(LOGIN_LABEL_VECTOR.x, LOGIN_LABEL_VECTOR.y, LOGIN_LABEL_VECTOR.z);
mp.labels.new("Type [/login] for login in. \nIt will automatically register your account, if doesn't exist.", labelPosition, {
	los: true,
	font: 1,
	drawDistance: 10
});

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

rpc.register(AUTH.SERVER_LOGIN, (formFieldsJSON) => {
	console.log(AUTH.SERVER_LOGIN);
	let formFields = JSON.parse(formFieldsJSON);
	console.log(formFields);
	console.log(AUTH.SERVER_LOGIN);
	let player: PlayerMp = mp.players.at(formFields.playerId);
	if (!isElegible(player, formFields.password)) return;

	const userRepository = AppDataSource.getRepository(User);
	return userRepository.findOneBy({ username: player.name }).then((user) => {
		if (!user) {
			player.outputChatBox('Username does not exist.');
			return LOGIN_STATUS_CODES.USERNAME_IS_NOT_VALID;
		}

		// TODO hash this password
		if (user.password !== formFields.password) {
			player.outputChatBox('Password is wrong.');
			return LOGIN_STATUS_CODES.PASSWORD_IS_NOT_VALID;
		}

		player.outputChatBox('You are logged in.');
		return GENERAL_STATUS_CODES.OK;
	})
	.catch((error) => {
		//TODO NEEDS to be changed to STATUS_CODES.SERVER_ERROR
		console.log(error);
		return GENERAL_STATUS_CODES.SERVER_ERROR
	});

	// let mySQLDate = convertToMysqlDate(new Date());

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

	const userRepository = AppDataSource.getRepository(User);

	const playerDatabase = await userRepository.findOneBy({ username: player.name });

	if (playerDatabase) {
		player.outputChatBox('Username already exists.');
		return LOGIN_STATUS_CODES.USERNAME_IS_NOT_VALID;
	}

	// TODO hash this password
	const newUser = new User(player.name, formFields.password, formFields.email);
	await userRepository.save(newUser);
	player.outputChatBox('You are registered.');
	return GENERAL_STATUS_CODES.OK;
});
