export enum Commands {

    // camera
    SAVE_CAM = 'savecam',
    SAVE = 'save',
    
    
}

export enum AdminChatCommands {
    ADMIN_CHAT = 'a',
    // admin & helper
    MAKE_HELPER = 'makeHelper',
    MAKE_ADMIN = 'makeAdmin',
}

export enum CharacterCreationCommands {
    // testing purposes
    SET_HEAD_OVERLAY = 'setHeadOverlay',
    SET_HEAD_BLEND_DATA = 'setHeadBlendData',
    SET_FACE_FEATURE = 'setFaceFeature',
    
    CHANGE_CAMERA_ANGLE = 'changeCameraAngle',
    RESET_DEFAULT_CAMERA = 'resetDefaultCamera',
}

export const getAllCommandsValues = (): string[] => {
    return [
        ...Object.values(Commands),
        ...Object.values(AdminChatCommands),
        ...Object.values(CharacterCreationCommands),
    ]
}