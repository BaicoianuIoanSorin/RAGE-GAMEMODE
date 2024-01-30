import { AUTH } from '@shared/authentication/events.constants';
import { GENERAL_STATUS_CODES, LOGIN_STATUS_CODES } from '@shared/status-codes/status-codes.constants';
import { SKY_CAMERA } from '@shared/position-savings/events.constants';
import * as rpc from 'rage-rpc';
import { AppDataSource } from '@/typeorm/typeorm';
import { User } from '@shared/entity/User';
import { PlayersVariables } from '@shared/player/PlayerVariables';
import { ThirstyHunger } from '@shared/entity/ThirstyHunger';

const freemodeCharacters = [mp.joaat("mp_m_freemode_01"), mp.joaat("mp_f_freemode_01")];

const userRepository = AppDataSource.getRepository(User);
const thirstyHungerRepository = AppDataSource.getRepository(ThirstyHunger);

function isElegible(player: PlayerMp, password: string) {
	if (!password) {
		player.outputChatBox('Usage: /login [password]');
		return false;
	}

	return true;
}

mp.events.add(AUTH.JOIN, (player: PlayerMp) => {
	console.log(AUTH.JOIN);
	player.call(SKY_CAMERA.MOVE_SKY_CAMERA, [player, 'up', 1, true]);
});

mp.events.add(AUTH.SERVER_LOGIN_SUCCES, (player: PlayerMp) => {
	console.log(AUTH.SERVER_LOGIN_SUCCES);
	player.call(SKY_CAMERA.MOVE_SKY_CAMERA, [player, 'down', null, true]);
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

		// TODO maybe add an util class for player commands inside player shared folder
		// TODO add the gender variable here later
		player.setVariables({
			[PlayersVariables.ServerId]: user.id,
			[PlayersVariables.Admin]: user.admin,
			[PlayersVariables.Helper]: user.helper,
			[PlayersVariables.Gender]: user.gender,
			[PlayersVariables.EyeColor]: user.eyeColor,
		});

		player.model = freemodeCharacters[user.gender];
		player.eyeColor = user.eyeColor;
		player.health = 100;
		await rpc.call(AUTH.SERVER_UPDATE_LAST_LOGIN, player.name);
		await rpc.call(
			AUTH.SERVER_UPDATE_IS_LOGGED_IN,
			JSON.stringify({
				playerName: player.name,
				state: true
			})
		);
		
		// TODO call method for getting head overlays
		// player.setVariable(PlayersVariables.CharacterHeadOverlays, await rpc.callClient(player, AUTH.CLIENT_GET_HEAD_OVERLAYS));
		// for now just set it to empty array
		player.setVariable(PlayersVariables.CharacterHeadOverlays, []);

		// TODO call method for getting face features
		// player.setVariable(PlayersVariables.CharacterFaceFeatures, await rpc.callClient(player, AUTH.CLIENT_GET_FACE_FEATURES));
		// for now just set it to empty array
		player.setVariable(PlayersVariables.CharacterFaceFeatures, []);

		// TODO for now null for character head blend data
		player.setVariable(PlayersVariables.CharacterHeadBlendData, {});

		// TODO for now null for character hair color
		player.setVariable(PlayersVariables.CharacterHairColor, {});
		
		// TODO call method for getting component variations
		// player.setVariable(PlayersVariables.CharacterComponentVariations, await rpc.callClient(player, AUTH.CLIENT_GET_COMPONENT_VARIATIONS));
		// for now just set it to empty array
		player.setVariable(PlayersVariables.CharacterComponentVariations, []);

		return GENERAL_STATUS_CODES.OK;
	} catch (error: any) {
		console.log(error);
		return GENERAL_STATUS_CODES.SERVER_ERROR;
	}
});

rpc.register(AUTH.SERVER_REGISTER, async (formFieldsJSON) => {
	console.log(AUTH.SERVER_REGISTER);
	let formFields = JSON.parse(formFieldsJSON);
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

rpc.register(AUTH.SERVER_UPDATE_LAST_LOGIN, async (playerName) => {
	console.log(`${AUTH.SERVER_UPDATE_LAST_LOGIN} -> playerName: ${playerName}`);

	try {
		await userRepository.update({ username: playerName }, { lastLoggedIn: new Date() });
		console.log(`Updated last login for playerName ${playerName}`);
	} catch (error: any) {
		console.error(`Error at ${AUTH.SERVER_UPDATE_LAST_LOGIN} -> ${error}`);
	}
});

rpc.register(AUTH.SERVER_UPDATE_IS_LOGGED_IN, async (jsonInformation) => {
	console.log(`${AUTH.SERVER_UPDATE_IS_LOGGED_IN} -> jsonInformation: ${jsonInformation}`);

	const information = JSON.parse(jsonInformation);
	try {
		console.log(`Updating isLoggedIn for playerName ${information.playerName}`);
		await userRepository.update({ username: information.playerName }, { isLoggedIn: information.state });
		console.log(`Updated isLoggedIn for playerName ${information.playerName}`);
	} catch (error: any) {
		console.error(`Error at ${AUTH.SERVER_UPDATE_IS_LOGGED_IN} -> ${error}`);
	}
});
