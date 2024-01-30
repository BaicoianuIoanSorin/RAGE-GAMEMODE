import { AUTH } from '@shared/authentication/events.constants';
import { GENERAL_STATUS_CODES, LOGIN_STATUS_CODES } from '@shared/status-codes/status-codes.constants';
import { SKY_CAMERA } from '@shared/position-savings/events.constants';
import * as rpc from 'rage-rpc';
import { AppDataSource } from '@/typeorm/typeorm';
import { UserEntity } from '@shared/entity/User';
import { PlayersVariables } from '@shared/player/PlayerVariables';
import { ThirstyHungerEntity } from '@shared/entity/ThirstyHunger';
import {
	CHARACTER_CREATION_DATA,
	CharacterComponentVariation,
	CharacterCreationData,
	CharacterCreationScope,
	CharacterFaceFeature,
	CharacterHeadBlendData,
	CharacterHeadOverlay
} from '@shared/character-creation/model';
import { CharacterEntity } from '@shared/entity/Character';
import { CharacterComponentVariationEntity } from '@shared/entity/CharacterComponentVariation';
import { CharacterFaceFeatureEntity } from '@shared/entity/CharacterFaceFeature';
import { CharacterHeadBlendDataEntity } from '@shared/entity/CharacterHeadBlendData';
import { CharacterHeadOverlayEntity } from '@shared/entity/CharacterHeadOverlay';
import { CreatorEvents } from '@shared/character-creation/events.constants';

const freemodeCharacters = [mp.joaat('mp_m_freemode_01'), mp.joaat('mp_f_freemode_01')];

const userRepository = AppDataSource.getRepository(UserEntity);
const thirstyHungerRepository = AppDataSource.getRepository(ThirstyHungerEntity);
const characterRepository = AppDataSource.getRepository(CharacterEntity);
const characterComponentVariationRepository = AppDataSource.getRepository(CharacterComponentVariationEntity);
const characterFaceFeatureRepository = AppDataSource.getRepository(CharacterFaceFeatureEntity);
const characterHeadBlendDataRepository = AppDataSource.getRepository(CharacterHeadBlendDataEntity);
const characterHeadOverlayRepository = AppDataSource.getRepository(CharacterHeadOverlayEntity);

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
		const user: UserEntity | null = await userRepository.findOneBy({ username: player.name });
		console.info(`user: ${JSON.stringify(user)}`);
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
			[PlayersVariables.EyeColor]: user.eyeColor
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

		const character: CharacterEntity | null = await characterRepository.findOne({
			where: { user: player.getVariable(PlayersVariables.ServerId) }
		});

		if (!character) {
			console.log(`Character not found for user ${player.getVariable(PlayersVariables.ServerId)}`);
			return GENERAL_STATUS_CODES.OK;
		}

		// TODO make a method for this later
		const characterHeadOverlays: CharacterHeadOverlay[] = (await characterHeadOverlayRepository.findBy({ character: character })).map(
			(characterHeadOverlay: CharacterHeadOverlayEntity) => {
				return {
					id: characterHeadOverlay.idHeadOverlay,
					index: characterHeadOverlay.index,
					opacity: characterHeadOverlay.opacity,
					primaryColor: characterHeadOverlay.primaryColor,
					secondaryColor: characterHeadOverlay.secondaryColor
				} as CharacterHeadOverlay;
			}
		);

		for (const characterHeadOverlay of characterHeadOverlays) {
			await rpc.callClient(player, CreatorEvents.CLIENT_CREATOR_SET_HEAD_OVERLAY, JSON.stringify(characterHeadOverlay));
		}
		player.setVariable(PlayersVariables.CharacterHeadOverlays, characterHeadOverlays);

		// TODO make a method for this later
		const characterHeadBlendData: CharacterHeadBlendDataEntity | null = await characterHeadBlendDataRepository.findOneBy({
			character: character
		});
		await rpc.callClient(
			player,
			CreatorEvents.CLIENT_CREATOR_SET_HEAD_BLEND_DATA,
			JSON.stringify({
				shapeFirstId: characterHeadBlendData?.shapeFirstId,
				shapeSecondId: characterHeadBlendData?.shapeSecondId,
				shapeThirdId: characterHeadBlendData?.shapeThirdId,
				skinFirstId: characterHeadBlendData?.skinFirstId,
				skinSecondId: characterHeadBlendData?.skinSecondId,
				skinThirdId: characterHeadBlendData?.skinThirdId,
				shapeMix: characterHeadBlendData?.shapeMix,
				skinMix: characterHeadBlendData?.skinMix,
				thirdMix: characterHeadBlendData?.thirdMix,
				isParent: characterHeadBlendData?.isParent
			} as CharacterHeadBlendData)
		);
		player.setVariable(PlayersVariables.CharacterHeadBlendData, characterHeadBlendData);

		// TODO make a method for this later
		const characterComponentVariations: CharacterComponentVariation[] = (
			await characterComponentVariationRepository.findBy({ character: character })
		).map((characterComponentVariation: CharacterComponentVariationEntity) => {
			return {
				componentId: characterComponentVariation.componentId,
				drawableId: characterComponentVariation.drawableId,
				textureId: characterComponentVariation.textureId,
				paletteId: characterComponentVariation.paletteId
			} as CharacterComponentVariation;
		});
		for (const characterComponentVariation of characterComponentVariations) {
			await rpc.callClient(player, CreatorEvents.CLIENT_SET_COMPONENT_VARIATION, JSON.stringify(characterComponentVariation));
		}
		player.setVariable(PlayersVariables.CharacterComponentVariations, characterComponentVariations);

		// TODO make a method for this later
		const characterFaceFeatures: CharacterFaceFeature[] = (await characterFaceFeatureRepository.findBy({ character: character })).map(
			(characterFaceFeature: CharacterFaceFeatureEntity) => {
				return {
					id: characterFaceFeature.faceFeatureId,
					scale: characterFaceFeature.scale
				} as CharacterFaceFeature;
			}
		);
		for (const characterFaceFeature of characterFaceFeatures) {
			await rpc.callClient(player, CreatorEvents.CLIENT_CREATOR_SET_FACE_FEATURE, JSON.stringify(characterFaceFeature));
		}
		player.setVariable(PlayersVariables.CharacterFaceFeatures, characterFaceFeatures);

		// TODO make a method for this later
		await rpc.callClient(
			player,
			CreatorEvents.CLIENT_CREATOR_EDIT_COLORS_CHARACTER,
			JSON.stringify({
				name: 'Eye Color',
				scope: CharacterCreationScope.EYE_COLOR,
				// id does not matter for eye color
				id: 0,
				colorChoosen: user.eyeColor
			} as CharacterCreationData)
		);
		player.setVariable(PlayersVariables.EyeColor, user.eyeColor);

		// TODO make a method for this later
		await rpc.callClient(
			player,
			CreatorEvents.CLIENT_CREATOR_EDIT_COLORS_CHARACTER,
			JSON.stringify({
				name: 'Hair Color',
				scope: CharacterCreationScope.HAIR_COLOR,
				// id does not matter for hair color
				id: user.gender,
				colorChoosen: user.hairColor
			} as CharacterCreationData)
		);
		player.setVariable(PlayersVariables.CharacterHairColor, user.hairColor);

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
		const newUser = new UserEntity(player.name, formFields.password, formFields.email);
		await userRepository.save(newUser);

		const newThirstyHunger = new ThirstyHungerEntity(newUser);
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
