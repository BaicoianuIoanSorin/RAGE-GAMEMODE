import { AppDataSource } from '@/typeorm/typeorm';
import { findPlayerByName } from '@/utils/players';
import { CreatorEvents } from '@shared/character-creation/events.constants';
import { CharacterComponentVariation, CharacterCreationCamera, CharacterFaceFeature, CharacterHeadBlendData, CharacterHeadOverlay } from '@shared/character-creation/model';
import { Character } from '@shared/entity/Character';
import { User } from '@shared/entity/User';
import { PlayersVariables } from '@shared/player/PlayerVariables';
import { CharacterCreationCommands } from '@shared/player/commands';
import * as rpc from 'rage-rpc';

const userRepository = AppDataSource.getRepository(User);
const characterRepository = AppDataSource.getRepository(Character);

const freemodeCharacters = [mp.joaat("mp_m_freemode_01"), mp.joaat("mp_f_freemode_01")];

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

rpc.register(CreatorEvents.SERVER_CREATOR_SET_EYE_COLOR, (eyeColor: number, info) => {
    console.log(`${CreatorEvents.SERVER_CREATOR_SET_EYE_COLOR} -> eyeColor:${eyeColor}`);

    let player: PlayerMp | undefined = findPlayerByName(info.player.name);

    if(player) {
        player.eyeColor = eyeColor;
        player.setVariable(PlayersVariables.EyeColor, eyeColor);
    }
});

rpc.register(CreatorEvents.SERVER_SEND_PLAYER_TO_DIMENSION, async (dimension: number, info) => {

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
        componentId: componentId,
        drawableId: drawable,
        textureId: texture,
        paletteId: palette,
    } as CharacterComponentVariation;
})

rpc.register(CreatorEvents.SERVER_CHANGE_GENDER, (gender: number, info) => {
    console.log(`${CreatorEvents.SERVER_CHANGE_GENDER} -> gender: ${gender}`);

    let player: PlayerMp | undefined = findPlayerByName(info.player.name);

    if(!player) {
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

    if(!player) {
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

    if(!player) {
        console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_HEAD_OVERLAYS} -> player not found`);
        return;
    }

    let characterHeadOverlays: CharacterHeadOverlay[] | undefined = player.getVariable(PlayersVariables.CharacterHeadOverlays);

    if(!characterHeadOverlays) {
        console.error(`${CreatorEvents.SERVER_SAVE_CHARACTER_HEAD_OVERLAYS} -> characterHeadOverlays not found`);
        return;
    }
    
    // check if the overlay exists
    let index: number = characterHeadOverlays.findIndex((characterHeadOverlayToFind: CharacterHeadOverlay) => characterHeadOverlayToFind.id === characterHeadOverlay.id);
    if(index === -1) {
        // if it doesn't exist, push it
        console.log(`pushing ${characterHeadOverlay}`)
        characterHeadOverlays.push(characterHeadOverlay);
    } else {
        // if it exists, replace it
        console.log(`replacing ${characterHeadOverlay}`)
        characterHeadOverlays[index] = characterHeadOverlay;
    }

    player.setVariable(PlayersVariables.CharacterHeadOverlays, characterHeadOverlays);
});