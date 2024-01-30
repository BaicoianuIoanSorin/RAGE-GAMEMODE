/**
 * ---------- FACE ---------------
 * setHeadOverlay: https://wiki.rage.mp/index.php?title=Player::setHeadOverlay
 * All colors used are the hair colors: https://wiki.rage.mp/index.php?title=Hair_Colors
 *
 * --------- SETTING FACE FEATURE -----------
 * setFaceFeature: https://wiki.rage.mp/index.php?title=Player::setFaceFeature
 * ---------- ACCESSIRIES, CLOTHES, GLOVES, MASKS, WATCHES, BRACELETS, GLASSES, ETC ---------------
 *  See: https://wiki.rage.mp/index.php?title=Player::setComponentVariation
 *
 * --------- SETTING EYES COLOR --------
 * setEyeColor: https://wiki.rage.mp/index.php?title=Player::setEyeColor
 *
 * ---------- HAIR ---------------
 * setComponentVariation with component ID 2
 * Hair colors: https://wiki.rage.mp/index.php?title=Hair_Colors
 * Mail hair styles: https://wiki.rage.mp/index.php?title=Male_Hair_Styles
 * Female hair styles: https://wiki.rage.mp/index.php?title=Female_Hair_Styles
 *
 * --------------- GENE FROM PARENTS ---------------
 * setHeadBlend: https://wiki.rage.mp/index.php?title=Player::setHeadBlend
 * ALL MOTHER SHAPES AND FATHER SHAPES PLUS HOW TO USE IT -> https://gtaforums.com/topic/858970-all-gtao-face-ids-pedset_ped_head_blend_data-explained/
 *
 * -------------------------------------------------
 * TODO LIST:
 * - Make a method in client side for setting these things manually to test it out
 * - For testing purposes, make a command for setting these things manually
 * - For communicating with frontend and back to the client, use the same event used for testing purposes
 * - Add all hair styles in the frontend side of the character creator
 * - Add all hair colors in the frontend side of the character creator
 * - Add all face features in the frontend side of the character creator
 * - Add all photos of mother shapes and father shapes in the frontend side of the character creator
 * - * MORE AFTER THIS *
 */
import { CreatorEvents } from '@shared/character-creation/events.constants';
import {
	CharacterComponentVariation,
	CharacterCreationCamera,
	CharacterCreationCameraFlag,
	CharacterCreationCameraFlagModel,
	CharacterCreationData,
	CharacterCreationScope,
	CharacterFaceFeature,
	CharacterHeadBlendData,
	CharacterHeadOverlay
} from '@shared/character-creation/model';
import { PlayersVariables } from '@shared/player/PlayerVariables';
import * as rpc from 'rage-rpc';

const player: PlayerMp = mp.players.local;
let componentVariations: CharacterComponentVariation[] = [];
let bodyCamera: CameraMp | undefined,
	bodyCameraStartPosition: Vector3 | undefined = undefined;

// THIS EVENT WILL BE CALLED AFTER THE CAMERA GOES DOWN
// WHEN THE CAMERA GOES DOWN, ANOTHER EVENT IN SERVER IS CALLED TO SEE IF THERE IS ALREADY SOME CHARACTER INFORMATION SAVED BY THE USER ID
// IF THERE IS, THEN THE CHARACTER WILL BE LOADED AND SOMETHING ELSE HAPPENS
// IF THERE IS NOT, THEN THE CHARACTER CREATION WILL START, CALLING THIS EVENT
rpc.register(CreatorEvents.CLIENT_CREATOR_CAMERA_INIT, async () => {
	mp.console.logInfo(CreatorEvents.CLIENT_CREATOR_CAMERA_INIT);
	// TODO move character on a special location
	if (!player.isPositionFrozen) player.freezePosition(true);
	mp.gui.cursor.show(true, true);
	mp.game.ui.displayRadar(false);

	// 32 disables all control actions
	player.updateControls(false, [32]);

	applyCreatorOutfit();

	for (let i = 0; i < 12; i++) {
		let componentVariation: CharacterComponentVariation = await rpc.callServer(CreatorEvents.SERVER_GET_COMPONENT_VARIATION, i);
		mp.console.logWarning('componentVariation: ' + JSON.stringify(componentVariation));
		if (componentVariation == undefined) continue;
		componentVariations.push(componentVariation);
	}

	rpc.call(CreatorEvents.CLIENT_CREATOR_CAMERA_SET, true);
});

// todo maybe here call the browser to show the character creation UI
rpc.register(CreatorEvents.CLIENT_CREATOR_CAMERA_SET, (showCharacterCamera: boolean) => {
	mp.console.logInfo(CreatorEvents.CLIENT_CREATOR_CAMERA_SET + ' ' + showCharacterCamera);
	if (showCharacterCamera) {
		setCameraToDefaultPosition(true);

		mp.game.cam.renderScriptCams(true, false, 500, true, false, 0);
	} else {
		if (bodyCamera == undefined) return;
		bodyCamera.setActive(false);
		bodyCamera.destroy();
		mp.game.cam.renderScriptCams(false, false, 3000, true, true, 0);

		bodyCamera = undefined;
	}
	player.taskPlayAnim('amb@world_human_guard_patrol@male@base', 'base', 8.0, 1, -1, 1, 0.0, false, false, false);
});

async function creatorCameraEdit(characterCreationCameraFlagModelJson: string) {
	mp.console.logInfo(CreatorEvents.CLIENT_CREATOR_CAMERA_EDIT + ' ' + characterCreationCameraFlagModelJson);

	const characterCreationCameraFlagModel: CharacterCreationCameraFlagModel = JSON.parse(characterCreationCameraFlagModelJson);
	let characterCreationCamera: CharacterCreationCamera = { angle: 0, distance: 1, height: 0.2 };

	mp.console.logInfo('characterCreationCameraFlag: ' + characterCreationCameraFlagModelJson);
	switch (characterCreationCameraFlagModel.characterCreationCameraFlag) {
		case CharacterCreationCameraFlag.HEAD: {
			characterCreationCamera = { angle: 90, distance: 0.8, height: 0.6 };
			break;
		}
		case CharacterCreationCameraFlag.BODY: {
			characterCreationCamera = { angle: 90, distance: 0.8, height: 0.2 };
			break;
		}
		case CharacterCreationCameraFlag.LEGS: {
			characterCreationCamera = { angle: 90, distance: 1, height: -0.5 };
			break;
		}
	}

	if (bodyCameraStartPosition == undefined) return;

	const cameraPosition: any | undefined = getCameraOffset(
		{ x: bodyCameraStartPosition.x, y: bodyCameraStartPosition.y, z: bodyCameraStartPosition.z + characterCreationCamera.height },
		characterCreationCamera.angle,
		characterCreationCamera.distance
	);
	if (cameraPosition == undefined) return;
	bodyCamera?.setCoord(cameraPosition?.x, cameraPosition?.y, cameraPosition?.z);
	bodyCamera?.pointAtCoord(bodyCameraStartPosition.x, bodyCameraStartPosition.y, bodyCameraStartPosition.z + characterCreationCamera.height);

	mp.console.logWarning(
		'pointAtCoord: ' +
			bodyCameraStartPosition.x +
			' ' +
			bodyCameraStartPosition.y +
			' ' +
			bodyCameraStartPosition.z +
			characterCreationCamera.height
	);
}
rpc.register(CreatorEvents.CLIENT_CREATOR_CAMERA_EDIT, (characterCreationCameraFlagModelJson: string) =>
	creatorCameraEdit(characterCreationCameraFlagModelJson)
);

function setHeadOverlay(characterHeadOverlayJson: string): CharacterHeadOverlay | undefined {
	const characterHeadOverlay: CharacterHeadOverlay = JSON.parse(characterHeadOverlayJson);

	mp.console.logInfo(CreatorEvents.CLIENT_CREATOR_SET_HEAD_OVERLAY + ' ' + characterHeadOverlayJson);

	if (characterHeadOverlay.id < 0 || characterHeadOverlay.id > 12) return undefined;

	const currentHeadOverlayValue: CharacterHeadOverlay | undefined = getHeadOverlayValue(characterHeadOverlay.id);
	let primaryColorToSet: number = currentHeadOverlayValue?.primaryColor ?? 0;
	let secondaryColorToSet: number = currentHeadOverlayValue?.secondaryColor ?? 0;

	const characterHeadOverlayRefactored: CharacterHeadOverlay = {
		id: characterHeadOverlay.id,
		index: characterHeadOverlay.index,
		opacity: characterHeadOverlay.opacity,
		primaryColor: characterHeadOverlay.primaryColor === -1 ? primaryColorToSet : characterHeadOverlay.primaryColor,
		secondaryColor: characterHeadOverlay.secondaryColor === -1 ? secondaryColorToSet : characterHeadOverlay.secondaryColor
	} as CharacterHeadOverlay;

	player.setHeadOverlay(
		characterHeadOverlayRefactored.id,
		characterHeadOverlayRefactored.index,
		characterHeadOverlayRefactored.opacity,
		characterHeadOverlayRefactored.primaryColor,
		characterHeadOverlayRefactored.secondaryColor
	);

	return characterHeadOverlayRefactored;
}

function getHeadOverlayValue(headOverlayId: number): CharacterHeadOverlay | undefined {
	const characterHeadOverlays: CharacterHeadOverlay[] = player.getVariable(PlayersVariables.CharacterHeadOverlays);
	if (characterHeadOverlays === undefined) return undefined;

	const characterHeadOverlayFound: CharacterHeadOverlay | undefined = characterHeadOverlays.find(
		(characterHeadOverlay: CharacterHeadOverlay) => characterHeadOverlay.id === headOverlayId
	);

	mp.console.logInfo('characterHeadOverlayFound: ' + JSON.stringify(characterHeadOverlayFound));
	return characterHeadOverlayFound;
}

rpc.register(CreatorEvents.CLIENT_CREATOR_SET_HEAD_OVERLAY, async (characterHeadOverlayJson: string) => {
	const characterHeadOverlay: CharacterHeadOverlay | undefined = await setHeadOverlay(characterHeadOverlayJson);

	if (characterHeadOverlay == undefined) return;

	if (characterHeadOverlay.id >= 0 && characterHeadOverlay.id <= 9) {
		mp.console.logWarning('characterHeadOverlayRefactored.id: ' + JSON.stringify(characterHeadOverlay.id));
		mp.console.logWarning('HEAD');
		creatorCameraEdit(
			JSON.stringify({
				characterCreationCameraFlag: CharacterCreationCameraFlag.HEAD,
				withRemovingComponentVariations: true
			} as CharacterCreationCameraFlagModel)
		);
	} else if (characterHeadOverlay.id >= 10 && characterHeadOverlay.id <= 12) {
		mp.console.logWarning('characterHeadOverlayRefactored.id: ' + JSON.stringify(characterHeadOverlay.id));
		mp.console.logWarning('BODY');
		creatorCameraEdit(
			JSON.stringify({
				characterCreationCameraFlag: CharacterCreationCameraFlag.BODY,
				withRemovingComponentVariations: true
			} as CharacterCreationCameraFlagModel)
		);
	}

	await rpc.callServer(CreatorEvents.SERVER_SAVE_CHARACTER_HEAD_OVERLAYS, JSON.stringify(characterHeadOverlay));
});

async function setHeadBlendData(headBlendDataJson: string) {
	const headBlendData: CharacterHeadBlendData = JSON.parse(headBlendDataJson);
	mp.console.logInfo(CreatorEvents.CLIENT_CREATOR_SET_HEAD_BLEND_DATA + ' ' + headBlendDataJson);

	mp.players.local.setHeadBlendData(
		headBlendData.shapeFirstId,
		headBlendData.shapeSecondId,
		headBlendData.shapeThirdId,
		headBlendData.skinFirstId,
		headBlendData.skinSecondId,
		headBlendData.skinThirdId,
		headBlendData.shapeMix,
		headBlendData.skinMix,
		headBlendData.thirdMix,
		headBlendData.isParent
	);

	creatorCameraEdit(
		JSON.stringify({
			characterCreationCameraFlag: CharacterCreationCameraFlag.HEAD,
			withRemovingComponentVariations: true
		} as CharacterCreationCameraFlagModel)
	);

	await rpc.callServer(CreatorEvents.SERVER_SAVE_CHARACTER_HEAD_BLEND_DATA, headBlendDataJson);
}

rpc.register(CreatorEvents.CLIENT_CREATOR_SET_HEAD_BLEND_DATA, (headBlendDataJson: string) => setHeadBlendData(headBlendDataJson));

function setFaceFeature(faceFeatureJson: string) {
	mp.console.logInfo('setFaceFeature: ' + faceFeatureJson);

	const faceFeature: CharacterFaceFeature = JSON.parse(faceFeatureJson);

	mp.players.local.setFaceFeature(faceFeature.id, faceFeature.scale);

	creatorCameraEdit(
		JSON.stringify({
			characterCreationCameraFlag: CharacterCreationCameraFlag.HEAD,
			withRemovingComponentVariations: true
		} as CharacterCreationCameraFlagModel)
	);
}

rpc.register(CreatorEvents.CLIENT_CREATOR_SET_FACE_FEATURE, async (faceFeatureJson: string) => {
	setFaceFeature(faceFeatureJson);

	await rpc.callServer(CreatorEvents.SERVER_SAVE_CHARACTER_FACE_FEATURES, faceFeatureJson);
});

rpc.register(CreatorEvents.CLIENT_SHOW_CHARACTER_OVERALL, () => {
	setCameraToDefaultPosition(false);
});

rpc.register(CreatorEvents.CLIENT_CREATOR_EDIT_COLORS_CHARACTER, async (characterCreationDataJson: string) => {
	let characterCreationData: CharacterCreationData = JSON.parse(characterCreationDataJson);

	mp.console.logInfo(CreatorEvents.CLIENT_CREATOR_EDIT_COLORS_CHARACTER + ' ' + characterCreationDataJson);

	switch (characterCreationData.scope) {
		case CharacterCreationScope.EYE_COLOR: {
			creatorCameraEdit(
				JSON.stringify({
					characterCreationCameraFlag: CharacterCreationCameraFlag.HEAD,
					withRemovingComponentVariations: false
				} as CharacterCreationCameraFlagModel)
			);
			rpc.callServer(CreatorEvents.SERVER_CREATOR_SET_EYE_COLOR, characterCreationData.colorChoosen);
			break;
		}
		case CharacterCreationScope.HEAD_OVERLAY: {
			let indexHeadOverlay = mp.players.local.getHeadOverlayValue(characterCreationData.id);
			let characterHeadOverlay: CharacterHeadOverlay = {
				id: characterCreationData.id,
				index: indexHeadOverlay,
				opacity: 1,
				primaryColor: characterCreationData.colorChoosen,
				secondaryColor: characterCreationData.colorChoosen
			} as CharacterHeadOverlay;

			await rpc.call(CreatorEvents.CLIENT_CREATOR_SET_HEAD_OVERLAY, JSON.stringify(characterHeadOverlay));
			break;
		}
		case CharacterCreationScope.HAIR_COLOR: {
			if (characterCreationData.colorChoosen) {
				creatorCameraEdit(
					JSON.stringify({
						characterCreationCameraFlag: CharacterCreationCameraFlag.HEAD,
						withRemovingComponentVariations: false
					} as CharacterCreationCameraFlagModel)
				);
				mp.players.local.setHairColor(characterCreationData.colorChoosen, characterCreationData.colorChoosen);
				await rpc.callServer(CreatorEvents.SERVER_SAVE_CHARACTER_HAIR_COLOR, characterCreationData.colorChoosen);
			}
			return;
		}
	}
});
function setCharacterComponentVariation(characterComponentVariationJson: string) {
	let characterComponentVariation: CharacterComponentVariation = JSON.parse(characterComponentVariationJson);

	// TODO see what others components ids can have this head camera, for now it only sets for hair style
	if (characterComponentVariation.componentId === 2) {
		creatorCameraEdit(
			JSON.stringify({
				characterCreationCameraFlag: CharacterCreationCameraFlag.HEAD,
				withRemovingComponentVariations: true
			} as CharacterCreationCameraFlagModel)
		);
	}
	
	mp.players.local.setComponentVariation(
		characterComponentVariation.componentId,
		characterComponentVariation.drawableId,
		characterComponentVariation.textureId,
		characterComponentVariation.paletteId
	);

	creatorCameraEdit(
		JSON.stringify({
			characterCreationCameraFlag: CharacterCreationCameraFlag.HEAD,
			withRemovingComponentVariations: true
		} as CharacterCreationCameraFlagModel)
	);
}

rpc.register(CreatorEvents.CLIENT_SET_COMPONENT_VARIATION, async (characterComponentVariationJson: string) => {
	mp.console.logInfo(CreatorEvents.CLIENT_SET_COMPONENT_VARIATION + ' ' + characterComponentVariationJson);

	setCharacterComponentVariation(characterComponentVariationJson);
	await rpc.callServer(CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS, characterComponentVariationJson);
});

function applyCreatorOutfit() {
	mp.players.local.setDefaultComponentVariation();
	mp.players.local.setComponentVariation(3, 15, 0, 0);
	mp.players.local.setComponentVariation(4, 15, 0, 0);
	mp.players.local.setComponentVariation(6, 15, 0, 0);
	mp.players.local.setComponentVariation(8, 15, 0, 0);
	mp.players.local.setComponentVariation(11, 15, 0, 0);
	mp.console.logInfo('applyCreatorOutfit');
}

rpc.register(CreatorEvents.CLIENT_CHANGE_GENDER, async (gender: number, info) => {
	await rpc.callServer(CreatorEvents.SERVER_CHANGE_GENDER, gender).then(async () => {
		applyCreatorOutfit();

		// It's important to ensure that the correct data is passed to setHeadBlendData based on gender
		const defaultHeadBlendData = JSON.stringify({
			shapeFirstId: 21,
			shapeSecondId: 0,
			shapeThirdId: 0,
			skinFirstId: 21,
			skinSecondId: 0,
			skinThirdId: 0,
			shapeMix: gender === 0 ? 1 : 0,
			skinMix: gender === 0 ? 1 : 0,
			thirdMix: 0,
			isParent: false
		} as CharacterHeadBlendData);
		
		setHeadBlendData(defaultHeadBlendData);
		setCharacterHeadOverlays();
		setCharacterFaceFeatures();

		// sets default hair style
		const defaultHairStyle: CharacterComponentVariation =
			{
				componentId: 2,
				drawableId: 0,
				textureId: 0,
				paletteId: 2
			} as CharacterComponentVariation;
		setCharacterComponentVariation(JSON.stringify(defaultHairStyle));
		await rpc.callServer(CreatorEvents.SERVER_SAVE_CHARACTER_COMPONENT_VARIATIONS, JSON.stringify(defaultHairStyle));
	});
});

rpc.register(CreatorEvents.CLIENT_GET_GENDER, async () => {
	return await rpc.callServer(CreatorEvents.SERVER_GET_GENDER, '');
});

/*
Sets the character head overlays that the player has saved in variables
*/
function setCharacterHeadOverlays() {
	mp.console.logInfo('setCharacterHeadOverlays');
	const characterHeadOverlays: CharacterHeadOverlay[] = player.getVariable(PlayersVariables.CharacterHeadOverlays);
	if (characterHeadOverlays !== undefined) {
		for (let i = 0; i < characterHeadOverlays.length; i++) {
			const characterHeadOverlay: CharacterHeadOverlay = characterHeadOverlays[i];
			setHeadOverlay(JSON.stringify(characterHeadOverlay));
		}
	}
}

function setCharacterFaceFeatures() {
	mp.console.logInfo('setCharacterFaceFeatures');
	const characterFaceFeatures: CharacterFaceFeature[] = player.getVariable(PlayersVariables.CharacterFaceFeatures);
	if (characterFaceFeatures !== undefined) {
		for (let i = 0; i < characterFaceFeatures.length; i++) {
			const characterFaceFeature: CharacterFaceFeature = characterFaceFeatures[i];
			mp.console.logWarning('characterFaceFeature UPDATING: ' + JSON.stringify(characterFaceFeature));
			setFaceFeature(JSON.stringify(characterFaceFeature));
		}
	}
}

function setCharacterComponentVariations() {
	mp.console.logInfo('setCharacterComponentVariation');
	const characterComponentVariations: CharacterComponentVariation[] = player.getVariable(PlayersVariables.CharacterComponentVariations);
	if (characterComponentVariations !== undefined) {
		for (let i = 0; i < characterComponentVariations.length; i++) {
			const characterComponentVariation: CharacterComponentVariation = characterComponentVariations[i];
			setCharacterComponentVariation(JSON.stringify(characterComponentVariation));
		}
	}
}

const getCameraOffset = (position: any, angle: number, distance: number): any | undefined => {
	angle = angle * 0.0174533;
	position.y = position.y + distance * Math.sin(angle);
	position.x = position.x + distance * Math.cos(angle);
	return position;
};

const setCameraToDefaultPosition = (justInitiated: boolean): void => {
	bodyCameraStartPosition = player.position;
	let characterCreationCamera: CharacterCreationCamera = { angle: player.getRotation(2).z + 90, distance: 2.6, height: 0.2 };
	let pos = getCameraOffset(
		new mp.Vector3(bodyCameraStartPosition.x, bodyCameraStartPosition.y, bodyCameraStartPosition.z + characterCreationCamera.height),
		characterCreationCamera.angle,
		characterCreationCamera.distance
	);
	bodyCamera = mp.cameras.new('default', pos, new mp.Vector3(0, 0, 0), 50);
	bodyCamera.pointAtCoord(bodyCameraStartPosition.x, bodyCameraStartPosition.y, bodyCameraStartPosition.z + characterCreationCamera.height);

	mp.console.logWarning(
		'pointAtCoord: ' +
			bodyCameraStartPosition.x +
			' ' +
			bodyCameraStartPosition.y +
			' ' +
			bodyCameraStartPosition.z +
			characterCreationCamera.height
	);

	if (justInitiated) {
		bodyCamera.setActive(true);
	}
};

// for testing purposes
rpc.register(CreatorEvents.CHANGE_CAMERA_ANGLE, (characterCreationCameraJson) => {
	let characterCreationCamera: CharacterCreationCamera = JSON.parse(characterCreationCameraJson);

	if (bodyCameraStartPosition == undefined) return;
	const cameraPosition: any | undefined = getCameraOffset(
		{ x: bodyCameraStartPosition.x, y: bodyCameraStartPosition.y, z: bodyCameraStartPosition.z + characterCreationCamera.height },
		characterCreationCamera.angle,
		characterCreationCamera.distance
	);
	if (cameraPosition == undefined) return;
	bodyCamera?.setCoord(cameraPosition?.x, cameraPosition?.y, cameraPosition?.z);
	bodyCamera?.pointAtCoord(bodyCameraStartPosition.x, bodyCameraStartPosition.y, bodyCameraStartPosition.z + characterCreationCamera.height);
});
