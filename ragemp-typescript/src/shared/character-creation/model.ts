export enum CharacterCreationCameraFlag {
    HEAD = 0,
    LEGS = 1,
    BODY = 2,
}

export interface CharacterCreationCamera {
    angle: number;
    distance: number;
    height: number;
}

export interface CharacterHeadOverlay {
    id: number;
    index: number;
    opacity: number;
    primaryColor: number;
    secondaryColor: number;
}

