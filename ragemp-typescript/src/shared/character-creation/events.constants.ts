export enum CreatorEvents {
    CLIENT_CREATOR_CAMERA_INIT = 'client:CreatorCameraInit',
    CLIENT_CREATOR_CAMERA_SET = 'client:CreatorCameraSet',
    CLIENT_CREATOR_CAMERA_EDIT = 'client:CreatorCameraEdit',
    SERVER_CHECK_IF_CHARACTER_EXISTS = 'server:checkIfCharacterExists',

    // setting things to the player
    CLIENT_CREATOR_SET_HEAD_OVERLAY = 'client:CreatorSetHeadOverlay',
    CLIENT_CREATOR_SET_HEAD_BLEND_DATA = 'client:CreatorSetHeadBlendData',
    CLIENT_CREATOR_SET_FACE_FEATURE = 'client:CreatorSetFaceFeature',
    CLIENT_SHOW_CHARACTER_OVERALL = 'client:ShowCharacterOverall',
    
    SERVER_GET_COMPONENT_VARIATION = 'server:getComponentVariation',

    // testing purposes
    CHANGE_CAMERA_ANGLE = 'client:changeCameraAngle',
}