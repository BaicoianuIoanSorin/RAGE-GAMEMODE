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
    SET_HEAD_OVERLAY = 'setHeadOverlay',

    // testing purposes
    CHANGE_CAMERA_ANGLE = 'changeCameraAngle',
}

export const getAllCommandsValues = (): string[] => {
    return [
        ...Object.values(Commands),
        ...Object.values(AdminChatCommands),
        ...Object.values(CharacterCreationCommands),
    ]
}