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
	// TODO hire event in browser to close the HUD and chat and show the character creation UI
	mp.console.logInfo(CreatorEvents.CLIENT_CREATOR_CAMERA_INIT);
	// TODO move character on a special location
	if (!player.isPositionFrozen) player.freezePosition(true);
	mp.gui.cursor.show(true, true);
	mp.game.ui.displayRadar(false);

	// 32 disables all control actions
	player.updateControls(false, [32]);

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

function creatorCameraEdit(characterCreationCameraFlagModelJson: string) {
	mp.console.logInfo(CreatorEvents.CLIENT_CREATOR_CAMERA_EDIT + ' ' + characterCreationCameraFlagModelJson);

	const characterCreationCameraFlagModel: CharacterCreationCameraFlagModel = JSON.parse(characterCreationCameraFlagModelJson);
	let characterCreationCamera: CharacterCreationCamera = { angle: 0, distance: 1, height: 0.2 };

	switch (characterCreationCameraFlagModel.characterCreationCameraFlag) {
		case CharacterCreationCameraFlag.HEAD: {
			characterCreationCamera = { angle: 90, distance: 0.8, height: 0.6 };

			if (characterCreationCameraFlagModel.withRemovingComponentVariations) {
				player.setDefaultComponentVariation();
			}

			break;
		}
		case CharacterCreationCameraFlag.BODY: {
			characterCreationCamera = { angle: 90, distance: 0.8, height: 0.2 };

			if (characterCreationCameraFlagModel.withRemovingComponentVariations) {
				player.setDefaultComponentVariation();

				player.setComponentVariation(11, 15, 0, 0);
				player.setComponentVariation(3, 15, 0, 0);
				player.setComponentVariation(8, 15, 0, 0);
			}

			break;
		}
		case CharacterCreationCameraFlag.LEGS: {
			characterCreationCamera = { angle: 90, distance: 1, height: -0.5 };

			if (characterCreationCameraFlagModel.withRemovingComponentVariations) {
				player.setDefaultComponentVariation();
				player.setComponentVariation(4, 15, 0, 0);
			}
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
rpc.register(CreatorEvents.CLIENT_CREATOR_CAMERA_EDIT, (characterCreationCameraFlagModelJson: string) => creatorCameraEdit(characterCreationCameraFlagModelJson));

rpc.register(CreatorEvents.CLIENT_CREATOR_SET_HEAD_OVERLAY, (characterHeadOverlayJson: string) => {
	const characterHeadOverlay: CharacterHeadOverlay = JSON.parse(characterHeadOverlayJson);
	
	if (characterHeadOverlay.id < 0 || characterHeadOverlay.id > 12) return;

	if (characterHeadOverlay.id >= 0 && characterHeadOverlay.id <= 9) {

		// TODO because it is in the same file, move the event functionality in a method
		creatorCameraEdit(JSON.stringify({
			characterCreationCameraFlag: CharacterCreationCameraFlag.HEAD,
			withRemovingComponentVariations: true
		} as CharacterCreationCameraFlagModel))
		
	} else if (characterHeadOverlay.id >= 10 && characterHeadOverlay.id <= 12) {
		creatorCameraEdit(JSON.stringify({
			characterCreationCameraFlag: CharacterCreationCameraFlag.BODY,
			withRemovingComponentVariations: true
		} as CharacterCreationCameraFlagModel))
		
	}
	
	mp.console.logInfo(CreatorEvents.CLIENT_CREATOR_SET_HEAD_OVERLAY + ' ' + characterHeadOverlayJson);
	
	player.setHeadOverlay(
		characterHeadOverlay.id,
		characterHeadOverlay.index,
		characterHeadOverlay.opacity,
		characterHeadOverlay.primaryColor,
		characterHeadOverlay.secondaryColor
	);
});

// TODO do hair styles and hair colors

rpc.register(CreatorEvents.CLIENT_CREATOR_SET_HEAD_BLEND_DATA, (headBlendDataJson: string) => {
	const headBlendData: CharacterHeadBlendData = JSON.parse(headBlendDataJson);
	creatorCameraEdit(JSON.stringify({
		characterCreationCameraFlag: CharacterCreationCameraFlag.HEAD,
		withRemovingComponentVariations: true
	} as CharacterCreationCameraFlagModel))
	

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
});

rpc.register(CreatorEvents.CLIENT_CREATOR_SET_FACE_FEATURE, (faceFeatureJson: string) => {
	const faceFeature: CharacterFaceFeature = JSON.parse(faceFeatureJson);

	creatorCameraEdit(JSON.stringify({
		characterCreationCameraFlag: CharacterCreationCameraFlag.HEAD,
		withRemovingComponentVariations: true
	} as CharacterCreationCameraFlagModel))
	

	mp.players.local.setFaceFeature(faceFeature.id, faceFeature.scale);
});

rpc.register(CreatorEvents.CLIENT_SHOW_CHARACTER_OVERALL, () => {
	setCameraToDefaultPosition(false);
});

rpc.register(CreatorEvents.CLIENT_CREATOR_EDIT_COLORS_CHARACTER, (characterCreationDataJson: string) => {
	let characterCreationData: CharacterCreationData = JSON.parse(characterCreationDataJson);

	mp.console.logInfo(CreatorEvents.CLIENT_CREATOR_EDIT_COLORS_CHARACTER + ' ' + characterCreationDataJson);

	switch (characterCreationData.scope) {
		case CharacterCreationScope.EYE_COLOR: {
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
				// TODO make such that you can input both colors
				secondaryColor: characterCreationData.colorChoosen
			} as CharacterHeadOverlay;

			rpc.call(CreatorEvents.CLIENT_CREATOR_SET_HEAD_OVERLAY, JSON.stringify(characterHeadOverlay));
			break;
		}
		case CharacterCreationScope.HAIR_COLOR: {
			if(characterCreationData.colorChoosen) mp.players.local.setHairColor(characterCreationData.colorChoosen, characterCreationData.colorChoosen);
			return;
		}
	}
});

rpc.register(CreatorEvents.CLIENT_SET_COMPONENT_VARIATION, (characterComponentVariationJson: string) => {
	let characterComponentVariation: CharacterComponentVariation = JSON.parse(characterComponentVariationJson);

	// TODO see what others components ids can have this head camera
	if(characterComponentVariation.componentId === 2) {
		creatorCameraEdit(JSON.stringify({
			characterCreationCameraFlag: CharacterCreationCameraFlag.HEAD,
			withRemovingComponentVariations: true
		} as CharacterCreationCameraFlagModel))
		
	}
	mp.console.logInfo(CreatorEvents.CLIENT_SET_COMPONENT_VARIATION + ' ' + characterComponentVariationJson);

	mp.players.local.setComponentVariation(characterComponentVariation.componentId, characterComponentVariation.drawableId, characterComponentVariation.textureId, characterComponentVariation.paletteId);

	// TODO save variable for component variation to the player
});

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
