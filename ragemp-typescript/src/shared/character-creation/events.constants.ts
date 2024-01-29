export enum CreatorEvents {
    CLIENT_CREATOR_CAMERA_INIT = 'client:CreatorCameraInit',
    CLIENT_CREATOR_CAMERA_SET = 'client:CreatorCameraSet',
    CLIENT_CREATOR_CAMERA_EDIT = 'client:CreatorCameraEdit',
    SERVER_CHECK_IF_CHARACTER_EXISTS = 'server:checkIfCharacterExists',
    SERVER_SEND_PLAYER_TO_DIMENSION = 'server:sendPlayerToDimension',

    // setting things to the player
    CLIENT_CREATOR_EDIT_COLORS_CHARACTER = 'client:CreatorEditColorsCharacter',
    CLIENT_CREATOR_SET_HEAD_OVERLAY = 'client:CreatorSetHeadOverlay',
    CLIENT_CREATOR_SET_HEAD_BLEND_DATA = 'client:CreatorSetHeadBlendData',
    CLIENT_CREATOR_SET_FACE_FEATURE = 'client:CreatorSetFaceFeature',
    CLIENT_SHOW_CHARACTER_OVERALL = 'client:ShowCharacterOverall',
	CLIENT_SET_COMPONENT_VARIATION = 'client:setComponentVariation',
    CLIENT_CHANGE_HAIR_COLOUR = 'client:changeHairColour',
    CLIENT_CHANGE_GENDER = 'client:changeGender',
    CLIENT_GET_GENDER = 'client:getGender',
    SERVER_CHANGE_GENDER = 'server:changeGender',
    SERVER_GET_GENDER = 'server:getGender',
	SERVER_CREATOR_SET_EYE_COLOR = 'server:CreatorSetEyeColor',
    SERVER_SAVE_CHARACTER_HEAD_OVERLAYS = 'server:saveCharacterHeadOverlays',
    
    SERVER_GET_COMPONENT_VARIATION = 'server:getComponentVariation',

    // testing purposes
    CHANGE_CAMERA_ANGLE = 'client:changeCameraAngle',
}