import { AppDataSource } from '@/typeorm/typeorm';
import { findPlayerByName } from '@/utils/players';
import { CreatorEvents } from '@shared/character-creation/events.constants';
import { CharacterComponentVariation, CharacterCreationCamera, CharacterFaceFeature, CharacterHeadBlendData, CharacterHeadOverlay } from '@shared/character-creation/model';
import { Character } from '@shared/entity/Character';
import { User } from '@shared/entity/User';
import { CharacterCreationCommands } from '@shared/player/commands';
import * as rpc from 'rage-rpc';

const userRepository = AppDataSource.getRepository(User);
const characterRepository = AppDataSource.getRepository(Character);

rpc.register(CreatorEvents.SERVER_CHECK_IF_CHARACTER_EXISTS, async (playerId: number) => {
	const user: User | null = await userRepository.findOneBy({ username: mp.players.at(playerId).name });
	if (!user) {
		return false;
	}

	const character: Character | null = await characterRepository.findOneBy({ user: user });
	if (!character) {
		return false;
	}

	return true;
});

// testing purposes
rpc.register(CharacterCreationCommands.SET_HEAD_OVERLAY, async (argsJSON, info) => {
    console.log(`command:${CharacterCreationCommands.SET_HEAD_OVERLAY} -> ${argsJSON}`);
    
    let args: Array<string> = JSON.parse(argsJSON);
    let characterHeadOverlay: CharacterHeadOverlay = {
        id: Number(args[0]),
        index: Number(args[1]),
        opacity: Number(args[2]),
        primaryColor: Number(args[3]),
        secondaryColor: Number(args[4]),
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
        isParent: Boolean(args[9]),
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
        scale: Number(args[1]),
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
        height: Number(args[2]),
    } as CharacterCreationCamera;

    let player: PlayerMp | undefined = findPlayerByName(info.player.name);

    if(!player) {
        console.error(`command:${CharacterCreationCommands.CHANGE_CAMERA_ANGLE} -> ${args} -> player not found`);
        return;
    }

    return await rpc.callClient(player, CreatorEvents.CHANGE_CAMERA_ANGLE, JSON.stringify(characterCreationCamera));
});

rpc.register(CreatorEvents.SERVER_GET_COMPONENT_VARIATION, (componentId: number, info) => {
    console.log(`${CreatorEvents.SERVER_GET_COMPONENT_VARIATION} -> componentId:${componentId}`);

    let player: PlayerMp | undefined = findPlayerByName(info.player.name);

    if(!player) {
        console.error(`${CreatorEvents.SERVER_GET_COMPONENT_VARIATION} -> ${componentId} -> player not found`);
        return;
    }

    const { drawable, texture, palette } = player.getClothes(componentId);
    return {
        componentId,
        drawable,
        texture,
        palette,
    } as CharacterComponentVariation;
})
