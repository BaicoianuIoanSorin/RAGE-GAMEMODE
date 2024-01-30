import { AppDataSource } from '@/typeorm/typeorm';
import { findPlayerByName } from '@/utils/players';
import { CreatorEvents } from '@shared/character-creation/events.constants';
import {
	CharacterComponentVariation,
	CharacterCreationCamera,
	CharacterFaceFeature,
	CharacterHeadBlendData,
	CharacterHeadOverlay
} from '@shared/character-creation/model';
import { CharacterEntity } from '@shared/entity/Character';
import { CharacterComponentVariationEntity } from '@shared/entity/CharacterComponentVariation';
import { CharacterFaceFeatureEntity } from '@shared/entity/CharacterFaceFeature';
import { CharacterHeadBlendDataEntity } from '@shared/entity/CharacterHeadBlendData';
import { CharacterHeadOverlayEntity } from '@shared/entity/CharacterHeadOverlay';
import { UserEntity } from '@shared/entity/User';
import { PlayersVariables } from '@shared/player/PlayerVariables';
import { CharacterCreationCommands } from '@shared/player/commands';
import { GENERAL_STATUS_CODES } from '@shared/status-codes/status-codes.constants';
import * as rpc from 'rage-rpc';

const userRepository = AppDataSource.getRepository(UserEntity);
const characterRepository = AppDataSource.getRepository(CharacterEntity);
const characterComponentVariationRepository = AppDataSource.getRepository(CharacterComponentVariationEntity);
const characterFaceFeatureRepository = AppDataSource.getRepository(CharacterFaceFeatureEntity);
const characterHeadBlendDataRepository = AppDataSource.getRepository(CharacterHeadBlendDataEntity);
const characterHeadOverlayRepository = AppDataSource.getRepository(CharacterHeadOverlayEntity);

const freemodeCharacters = [mp.joaat('mp_m_freemode_01'), mp.joaat('mp_f_freemode_01')];

async function checkIfCharacterExists(playerId: number): Promise<boolean> {
	const user: UserEntity | null = await userRepository.findOneBy({ username: mp.players.at(playerId).name });
	if (!user) {
		return false;
	}

	const character: CharacterEntity | null = await characterRepository.findOneBy({ user: user });
	if (!character) {
		return false;
	}

	return true;
}

rpc.register(CreatorEvents.SERVER_CHECK_IF_CHARACTER_EXISTS, async (playerId: number) => await checkIfCharacterExists(playerId));

rpc.register(CreatorEvents.SERVER_CREATOR_SET_EYE_COLOR, (eyeColor: number, info) => {
	console.log(`${CreatorEvents.SERVER_CREATOR_SET_EYE_COLOR} -> eyeColor:${eyeColor}`);

	let player: PlayerMp | undefined = findPlayerByName(info.player.name);

	if (player) {
		player.eyeColor = eyeColor;
		player.setVariable(PlayersVariables.EyeColor, eyeColor);
	}
});

rpc.register(CreatorEvents.SERVER_SEND_PLAYER_TO_DIMENSION, async (dimension: number, info) => {});

// testing purposes
rpc.register(CharacterCreationCommands.SET_HEAD_OVERLAY, async (argsJSON, info) => {
	console.log(`command:${CharacterCreationCommands.SET_HEAD_OVERLAY} -> ${argsJSON}`);

	let args: Array<string> = JSON.parse(argsJSON);
	let characterHeadOverlay: CharacterHeadOverlay = {
		id: Number(args[0]),
		index: Number(args[1]),
		opacity: Number(args[2]),
		primaryColor: Number(args[3]),
		secondaryColor: Number(args[4])
	} as CharacterHeadOverlay;

	let player: PlayerMp | undefined = findPlayerByName(info.player.name);
	if (!player) {
		console.error(`command:${CharacterCreationCommands.SET_HEAD_OVERLAY} -> ${args} -> player not found`);
		return;
	}

	return await rpc.callClient(player, CreatorEvents.CLIENT_CREATOR_SET_HEAD_OVERLAY, JSON.stringify(characterHeadOverlay));
});

// testing purposes
rpc.register(CharacterCreationCommands.SET_HEAD_BLEND_DATA, async (argsJSON, info) => {
	console.log(`command:${CharacterCreationCommands.SET_HEAD_BLEND_DATA} -> ${argsJSON}`);

	let args: Array<string> = JSON.parse(argsJSON);
	let characterHeadBlendData: CharacterHeadBlendData = {
		shapeFirstId: Number(args[0]),
		shapeSecondId: Number(args[1]),
		shapeThirdId: Number(args[2]),
		skinFirstId: Number(args[3]),
		skinSecondId: Number(args[4]),
		skinThirdId: Number(args[5]),
		shapeMix: Number(args[6]),
		skinMix: Number(args[7]),
		thirdMix: Number(args[8]),
		isParent: Boolean(args[9])
	} as CharacterHeadBlendData;

	let player: PlayerMp | undefined = findPlayerByName(info.player.name);
	if (!player) {
		console.error(`command:${CharacterCreationCommands.SET_HEAD_BLEND_DATA} -> ${args} -> player not found`);
		return;
	}

	return await rpc.callClient(player, CreatorEvents.CLIENT_CREATOR_SET_HEAD_BLEND_DATA, JSON.stringify(characterHeadBlendData));
});

rpc.register(CharacterCreationCommands.RESET_DEFAULT_CAMERA, async (argsJSON, info) => {
	console.log(`command:${CharacterCreationCommands.RESET_DEFAULT_CAMERA} -> ${argsJSON}`);

	let player: PlayerMp | undefined = findPlayerByName(info.player.name);
	if (!player) {
		console.error(`command:${CharacterCreationCommands.RESET_DEFAULT_CAMERA} -> ${argsJSON} -> player not found`);
		return;
	}

	return await rpc.callClient(player, CreatorEvents.CLIENT_SHOW_CHARACTER_OVERALL);
});

rpc.register(CharacterCreationCommands.SET_FACE_FEATURE, async (argsJSON, info) => {
	console.log(`command:${CharacterCreationCommands.SET_FACE_FEATURE} -> ${argsJSON}`);

	let args: Array<string> = JSON.parse(argsJSON);
	let characterFaceFeature: CharacterFaceFeature = {
		id: Number(args[0]),
		scale: Number(args[1])
	} as CharacterFaceFeature;

	let player: PlayerMp | undefined = findPlayerByName(info.player.name);
	if (!player) {
		console.error(`command:${CharacterCreationCommands.SET_FACE_FEATURE} -> ${args} -> player not found`);
		return;
	}

	return await rpc.callClient(player, CreatorEvents.CLIENT_CREATOR_SET_FACE_FEATURE, JSON.stringify(characterFaceFeature));
});

// testing purposes
rpc.register(CharacterCreationCommands.CHANGE_CAMERA_ANGLE, async (argsJSON, info) => {
	console.log(`command:${CharacterCreationCommands.CHANGE_CAMERA_ANGLE} -> ${argsJSON}`);

	let args: Array<string> = JSON.parse(argsJSON);
	let characterCreationCamera: CharacterCreationCamera = {
		angle: Number(args[0]),
		distance: Number(args[1]),
		height: Number(args[2])
	} as CharacterCreationCamera;

	let player: PlayerMp | undefined = findPlayerByName(info.player.name);

	if (!player) {
		console.error(`command:${CharacterCreationCommands.CHANGE_CAMERA_ANGLE} -> ${args} -> player not found`);
		return;
	}

	return await rpc.callClient(player, CreatorEvents.CHANGE_CAMERA_ANGLE, JSON.stringify(characterCreationCamera));
});

rpc.register(CreatorEvents.SERVER_GET_COMPONENT_VARIATION, (componentId: number, info) => {
	console.log(`${CreatorEvents.SERVER_GET_COMPONENT_VARIATION} -> componentId:${componentId}`);

	let player: PlayerMp | undefined = findPlayerByName(info.player.name);

	if (!player) {
		console.error(`${CreatorEvents.SERVER_GET_COMPONENT_VARIATION} -> ${componentId} -> player not found`);
		return;
	}

	const { drawable, texture, palette } = player.getClothes(componentId);
	return {
		componentId: componentId,
		drawableId: drawable,
		textureId: texture,
		paletteId: palette
	} as CharacterComponentVariation;
});

rpc.register(CreatorEvents.SERVER_CHANGE_GENDER, (gender: number, info) => {
	console.log(`${CreatorEvents.SERVER_CHANGE_GENDER} -> gender: ${gender}`);

	let player: PlayerMp | undefined = findPlayerByName(info.player.name);

	if (!player) {
		console.error(`${CreatorEvents.SERVER_CHANGE_GENDER} -> gender ${gender} -> player not found`);
		return;
	}

	player.setVariable(PlayersVariables.Gender, gender);
	player.model = freemodeCharacters[gender];
	let eyeColor: number | undefined = player.getVariable(PlayersVariables.EyeColor);
	player.eyeColor = eyeColor ? eyeColor : 0;
});

rpc.register(CreatorEvents.SERVER_GET_GENDER, (something: string, info) => {
	console.log(`${CreatorEvents.SERVER_GET_GENDER} -> player: ${info.player.name}`);

	let player: PlayerMp | undefined = findPlayerByName(info.player.name);

	if (!player) {
		console.error(`${CreatorEvents.SERVER_GET_GENDER} -> player not found`);
		return;
	}

	return player?.getVariable(PlayersVariables.Gender);
});

rpc.register(CreatorEvents.SERVER_SAVE_CHARACTER_HEAD_OVERLAYS, async (characterHeadOverlayJson: string, info) => {
	const characterHeadOverlay: CharacterHeadOverlay = JSON.parse(characterHeadOverlayJson);

	if (characterHeadOverlay.id < 0 || characterHeadOverlay.id > 12) return;

	console.log(`${CreatorEvents.SERVER_SAVE_CHARACTER_HEAD_OVERLAYS} -> SAVING ${characterHeadOverlayJson}`);

	let player: PlayerMp | undefined = findPlayerByName(info.player.name);

	if (!player) {
		console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_HEAD_OVERLAYS} -> player not found`);
		return;
	}

	let characterHeadOverlays: CharacterHeadOverlay[] | undefined = player.getVariable(PlayersVariables.CharacterHeadOverlays);

	if (!characterHeadOverlays) {
		console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_HEAD_OVERLAYS} -> characterHeadOverlays not found`);
		return;
	}

	// check if the overlay exists
	let index: number = characterHeadOverlays.findIndex(
		(characterHeadOverlayToFind: CharacterHeadOverlay) => characterHeadOverlayToFind.id === characterHeadOverlay.id
	);
	if (index === -1) {
		// if it doesn't exist, push it
		console.log(`pushing ${characterHeadOverlay}`);
		characterHeadOverlays.push(characterHeadOverlay);
	} else {
		// if it exists, replace it
		console.log(`replacing ${characterHeadOverlay}`);
		characterHeadOverlays[index] = characterHeadOverlay;
	}

	console.log(`characterHeadOverlays: ${JSON.stringify(characterHeadOverlays)}`);

	player.setVariable(PlayersVariables.CharacterHeadOverlays, characterHeadOverlays);
});

rpc.register(CreatorEvents.SERVER_SAVE_CHARACTER_HEAD_BLEND_DATA, async (headBlendDataJson: string, info) => {
	const characterHeadBlendData: CharacterHeadBlendData = JSON.parse(headBlendDataJson);

	console.log(`${CreatorEvents.SERVER_SAVE_CHARACTER_HEAD_BLEND_DATA} -> SAVING ${headBlendDataJson}`);

	let player: PlayerMp | undefined = findPlayerByName(info.player.name);

	if (!player) {
		console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_HEAD_BLEND_DATA} -> player not found`);
		return;
	}

	player.setVariable(PlayersVariables.CharacterHeadBlendData, characterHeadBlendData);
});

rpc.register(CreatorEvents.SERVER_SAVE_CHARACTER_FACE_FEATURES, async (faceFeatureJson: string, info) => {
	const faceFeature: CharacterFaceFeature = JSON.parse(faceFeatureJson);

	console.log(`${CreatorEvents.SERVER_SAVE_CHARACTER_FACE_FEATURES} -> SAVING ${faceFeatureJson}`);

	let player: PlayerMp | undefined = findPlayerByName(info.player.name);

	if (!player) {
		console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_FACE_FEATURES} -> player not found`);
		return;
	}

	let characterFaceFeatures: CharacterFaceFeature[] | undefined = player.getVariable(PlayersVariables.CharacterFaceFeatures);

	if (!characterFaceFeatures) {
		console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_HEAD_OVERLAYS} -> characterFaceFeatures not found`);
		return;
	}

	// check if the overlay exists
	let index: number = characterFaceFeatures.findIndex(
		(characterFaceFeatureToFind: CharacterFaceFeature) => characterFaceFeatureToFind.id === faceFeature.id
	);
	if (index === -1) {
		// if it doesn't exist, push it
		console.log(`pushing ${faceFeature}`);
		characterFaceFeatures.push(faceFeature);
	} else {
		// if it exists, replace it
		console.log(`replacing ${faceFeature}`);
		characterFaceFeatures[index] = faceFeature;
	}

	console.log(`characterFaceFeatures: ${JSON.stringify(characterFaceFeatures)}`);

	player.setVariable(PlayersVariables.CharacterFaceFeatures, characterFaceFeatures);
});

rpc.register(CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS, async (characterComponentVariationJson: string, info) => {
	const componentVariation: CharacterComponentVariation = JSON.parse(characterComponentVariationJson);

	console.log(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} -> SAVING ${characterComponentVariationJson}`);

	let player: PlayerMp | undefined = findPlayerByName(info.player.name);

	if (!player) {
		console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} -> player not found`);
		return;
	}

	let characterComponentVariations: CharacterComponentVariation[] | undefined = player.getVariable(PlayersVariables.CharacterComponentVariations);

	if (!characterComponentVariations) {
		console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} -> characterComponentVariations not found`);
		return;
	}

	// check if the overlay exists
	let index: number = characterComponentVariations.findIndex(
		(characterComponentVariation: CharacterComponentVariation) => characterComponentVariation.componentId === componentVariation.componentId
	);
	if (index === -1) {
		// if it doesn't exist, push it
		console.log(`pushing ${componentVariation}`);
		characterComponentVariations.push(componentVariation);
	} else {
		// if it exists, replace it
		console.log(`replacing ${componentVariation}`);
		characterComponentVariations[index] = componentVariation;
	}

	console.log(`characterComponentVariations: ${JSON.stringify(characterComponentVariations)}`);

	player.setVariable(PlayersVariables.CharacterComponentVariations, characterComponentVariations);
});

// TODO hair color should have two options: primary and secondary
rpc.register(CreatorEvents.SERVER_SAVE_CHARACTER_HAIR_COLOR, async (characterHairColor: number, info) => {
	console.log(`${CreatorEvents.SERVER_SAVE_CHARACTER_HAIR_COLOR} -> SAVING ${characterHairColor}`);

	let player: PlayerMp | undefined = findPlayerByName(info.player.name);

	if (!player) {
		console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_HAIR_COLOR} -> player not found`);
		return;
	}

	player.setVariable(PlayersVariables.CharacterHairColor, characterHairColor);
});

rpc.register(CreatorEvents.SERVER_SAVE_CHARACTER_DATA_TO_DATABASE, async (something, info) => {
	console.log(`${CreatorEvents.SERVER_SAVE_CHARACTER_DATA_TO_DATABASE} -> SAVING`);

	const statusSaveCharacterComponentVariations = await saveCharacterComponentVariations(info.player.id);
	const statusSaveCharacterFaceFeatures = await saveCharacterFaceFeatures(info.player.id);
	const statusSaveCharacterHeadOverlays = await saveCharacterHeadOverlays(info.player.id);
	const statusSaveCharacterHeadBlendData = await saveCharacterHeadBlendData(info.player.id);
	const statusSaveEyeColor = await saveEyeColor(info.player.id);
	const statusSaveHairColor = await saveHairColor(info.player.id);
    const statusSaveGender = await saveGender(info.player.id);

	if (
		statusSaveCharacterComponentVariations === GENERAL_STATUS_CODES.OK &&
		statusSaveCharacterFaceFeatures === GENERAL_STATUS_CODES.OK &&
		statusSaveCharacterHeadOverlays === GENERAL_STATUS_CODES.OK &&
		statusSaveCharacterHeadBlendData === GENERAL_STATUS_CODES.OK &&
		statusSaveEyeColor === GENERAL_STATUS_CODES.OK &&
		statusSaveHairColor === GENERAL_STATUS_CODES.OK &&
        statusSaveGender === GENERAL_STATUS_CODES.OK
	) {
		return GENERAL_STATUS_CODES.OK;
	} else {
		return GENERAL_STATUS_CODES.SERVER_ERROR;
	}
});

// playerId is id user has on the server
async function saveCharacterComponentVariations(playerId: number) {
	console.info('Saving character component variations');
	const player: PlayerMp | undefined = mp.players.at(playerId);
	if (!player) {
		console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} -> player not found`);
		return;
	}

	let characterComponentVariations: CharacterComponentVariation[] | undefined = player.getVariable(PlayersVariables.CharacterComponentVariations);

	if (!characterComponentVariations) {
		console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} -> characterComponentVariations not found`);
		return;
	}

	for (const characterComponentVariation of characterComponentVariations) {
        console.info(`Saving character component variation ${JSON.stringify(characterComponentVariation)}`);
    
        let user: UserEntity;
        try {
            user = await userRepository.findOneByOrFail({ username: player.name });
        } catch (e: any) {
            console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} Error when trying to get the user for saving the data -> ${e}`);
            continue;
        }
    
        let character: CharacterEntity | undefined = await getPlayersCharacter(playerId, user);
        if (!character) continue;
    
        let characterComponentVariationEntity: CharacterComponentVariationEntity = new CharacterComponentVariationEntity(character);
        characterComponentVariationEntity.componentId = characterComponentVariation.componentId;
        characterComponentVariationEntity.drawableId = characterComponentVariation.drawableId;
        characterComponentVariationEntity.textureId = characterComponentVariation.textureId;
        characterComponentVariationEntity.paletteId = characterComponentVariation.paletteId;
    
        try {
            await characterComponentVariationRepository.save(characterComponentVariationEntity);
        }
        catch (e: any) {
            console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} Error when trying to save the user -> ${e}`);
            continue;
        }
    }
    
	// TODO return some kind of status that all characterComponentVariations were saved
	return GENERAL_STATUS_CODES.OK;
}

async function saveCharacterFaceFeatures(playerId: number) {
	console.info('Saving character face features');
	const player: PlayerMp | undefined = mp.players.at(playerId);
	if (!player) {
		console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} -> player not found`);
		return;
	}

	let characterFaceFeatures: CharacterFaceFeature[] | undefined = player.getVariable(PlayersVariables.CharacterFaceFeatures);

	if (!characterFaceFeatures) {
		console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} -> characterFaceFeatures not found`);
		return;
	}

	for (const characterFaceFeature of characterFaceFeatures) {
        console.info(`Saving character face feature ${JSON.stringify(characterFaceFeature)}`);
    
        let user: UserEntity;
        try {
            user = await userRepository.findOneByOrFail({ username: player.name });
        } catch (e: any) {
            console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} Error when trying to get the user for saving the data -> ${e}`);
            continue;
        }
    
        let character: CharacterEntity | undefined = await getPlayersCharacter(playerId, user);
        if (!character) continue;
    
        let characterFaceFeatureEntity: CharacterFaceFeatureEntity = new CharacterFaceFeatureEntity(character);
        characterFaceFeatureEntity.faceFeatureId = characterFaceFeature.id;
        characterFaceFeatureEntity.scale = characterFaceFeature.scale;
    
        try {
            await characterFaceFeatureRepository.save(characterFaceFeatureEntity);
        }
        catch (e: any) {
            console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} Error when trying to save the user -> ${e}`);
            continue;
        }
    }
    
	// TODO return some kind of status that all characterComponentVariations were saved
	return GENERAL_STATUS_CODES.OK;
}

async function saveCharacterHeadOverlays(playerId: number) {
	const player: PlayerMp | undefined = mp.players.at(playerId);

	console.info('Saving character head overlays');
	if (!player) {
		console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} -> player not found`);
		return;
	}

	let characterHeadOverlays: CharacterHeadOverlay[] | undefined = player.getVariable(PlayersVariables.CharacterHeadOverlays);

	if (!characterHeadOverlays) {
		console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} -> characterHeadOverlays not found`);
		return;
	}

	for (const characterHeadOverlay of characterHeadOverlays) {
        console.info(`Saving character head overlay ${JSON.stringify(characterHeadOverlay)}`);
    
        let user: UserEntity;
        try {
            user = await userRepository.findOneByOrFail({ username: player.name });
        } catch (e: any) {
            console.error(
                `${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} Error when trying to get the user for saving the data -> ${e}`
            );
            continue; // Continue to the next iteration if user is not found
        }
    
        let character: CharacterEntity | undefined = await getPlayersCharacter(playerId, user);
        if (!character) continue;
    
        let characterHeadOverlayEntity: CharacterHeadOverlayEntity = new CharacterHeadOverlayEntity(character);
        characterHeadOverlayEntity.idHeadOverlay = characterHeadOverlay.id;
        characterHeadOverlayEntity.index = characterHeadOverlay.index;
        characterHeadOverlayEntity.opacity = characterHeadOverlay.opacity;
        characterHeadOverlayEntity.primaryColor = characterHeadOverlay.primaryColor;
        characterHeadOverlayEntity.secondaryColor = characterHeadOverlay.secondaryColor;
    
        try {
            await characterHeadOverlayRepository.save(characterHeadOverlayEntity);
        }
        catch (e: any) {
            console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} Error when trying to save the user -> ${e}`);
            continue; // Continue to the next iteration if saving fails
        }
    }
	// TODO return some kind of status that all characterComponentVariations were saved
	return GENERAL_STATUS_CODES.OK;
}

// CharacterHeadBlendData
async function saveCharacterHeadBlendData(playerId: number) {
	const player: PlayerMp | undefined = mp.players.at(playerId);

	console.info('Saving character head blend data');
	if (!player) {
		console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} -> player not found`);
		return;
	}

	let characterHeadBlendData: CharacterHeadBlendData | undefined = player.getVariable(PlayersVariables.CharacterHeadOverlays);

	if (!characterHeadBlendData) {
		console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} -> characterHeadBlendData not found`);
		return;
	}

	let user: UserEntity;
	try {
		user = await userRepository.findOneByOrFail({ username: player.name });
	} catch (e: any) {
		console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} Error when trying to get the user for saving the data -> ${e}`);
		return;
	}

	let character: CharacterEntity | undefined = await getPlayersCharacter(playerId, user);

	if (!character) return GENERAL_STATUS_CODES.SERVER_ERROR;

	let characterHeadBlendDataEntity: CharacterHeadBlendDataEntity = new CharacterHeadBlendDataEntity(character);
	characterHeadBlendDataEntity.shapeFirstId = characterHeadBlendData.shapeFirstId;
	characterHeadBlendDataEntity.shapeSecondId = characterHeadBlendData.shapeSecondId;
	characterHeadBlendDataEntity.shapeThirdId = characterHeadBlendData.shapeThirdId;
	characterHeadBlendDataEntity.skinFirstId = characterHeadBlendData.skinFirstId;
	characterHeadBlendDataEntity.skinSecondId = characterHeadBlendData.skinSecondId;
	characterHeadBlendDataEntity.skinThirdId = characterHeadBlendData.skinThirdId;
	characterHeadBlendDataEntity.shapeMix = characterHeadBlendData.shapeMix;
	characterHeadBlendDataEntity.skinMix = characterHeadBlendData.skinMix;
	characterHeadBlendDataEntity.thirdMix = characterHeadBlendData.thirdMix;

	try {
        await characterHeadBlendDataRepository.save(characterHeadBlendDataEntity);
    }
    catch (e: any) {
        console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} Error when trying to save the user -> ${e}`);
        return GENERAL_STATUS_CODES.SERVER_ERROR;
    }
	// TODO return some kind of status that all characterComponentVariations were saved
	return GENERAL_STATUS_CODES.OK;
}

async function saveEyeColor(playerId: number) {
	const player: PlayerMp | undefined = mp.players.at(playerId);

	console.info('Saving character eye color');
	if (!player) {
		console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} -> player not found`);
		return;
	}

	let eyeColor: number | undefined = player.getVariable(PlayersVariables.EyeColor);

	let user: UserEntity;
	try {
		user = await userRepository.findOneByOrFail({ username: player.name });
	} catch (e: any) {
		console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} Error when trying to get the user for saving the data -> ${e}`);
		return;
	}

	user.eyeColor = eyeColor ? eyeColor : 0;

	try {
		await userRepository.update({id: user.id}, user);
	} catch (e: any) {
		console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} Error when trying to save the user -> ${e}`);
		return;
	}
	return GENERAL_STATUS_CODES.OK;
}

async function saveHairColor(playerId: number) {
	const player: PlayerMp | undefined = mp.players.at(playerId);

	console.info('Saving character hair color');
	if (!player) {
		console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} -> player not found`);
		return;
	}

	let hairColor: number | undefined = player.getVariable(PlayersVariables.CharacterHairColor);

	let user: UserEntity;
	try {
		user = await userRepository.findOneByOrFail({ username: player.name });
	} catch (e: any) {
		console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} Error when trying to get the user for saving the data -> ${e}`);
		return;
	}

	user.hairColor = hairColor ? hairColor : 0;

	try {
		await userRepository.update({id: user.id}, user);
	} catch (e: any) {
		console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} Error when trying to save the user -> ${e}`);
		return;
	}
	return GENERAL_STATUS_CODES.OK;
}

async function saveGender(playerId: number) {
	const player: PlayerMp | undefined = mp.players.at(playerId);

	console.info('Saving character hair color');
	if (!player) {
		console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} -> player not found`);
		return;
	}

	let gender: number | undefined = player.getVariable(PlayersVariables.Gender);

	let user: UserEntity;
	try {
		user = await userRepository.findOneByOrFail({ username: player.name });
	} catch (e: any) {
		console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} Error when trying to get the user for saving the data -> ${e}`);
		return;
	}

	user.gender = gender ? gender : 0;

	try {
		await userRepository.update({id: user.id}, user);
	} catch (e: any) {
		console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} Error when trying to save the user -> ${e}`);
		return;
	}
	return GENERAL_STATUS_CODES.OK;
}

async function getPlayersCharacter(playerId: number, user: UserEntity): Promise<CharacterEntity | undefined> {
	const doesCharacterExistsAlready: boolean = await checkIfCharacterExists(playerId);
	if (!doesCharacterExistsAlready) {
		const character: CharacterEntity = new CharacterEntity(user);

		try {
			return await characterRepository.save(character);
		} catch (e: any) {
			console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} Error when trying to save the character -> ${e}`);
			return undefined;
		}
	} else {
		try {
            const userId = mp.players.at(playerId).getVariable(PlayersVariables.ServerId);
			const characterFound: CharacterEntity | null = await characterRepository.findOne({where: {user: userId}});
			return characterFound ? characterFound : undefined;
		} catch (e: any) {
			console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS} Error when trying to get the character -> ${e}`);
			return undefined;
		}
	}
}

// TODO probably need to set the gender as well in DB

