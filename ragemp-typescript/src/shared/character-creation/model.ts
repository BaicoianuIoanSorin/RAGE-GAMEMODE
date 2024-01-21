export enum HeadOverlayId {
    BLEMISHES = 0,
    FACIAL_HAIR = 1,
    EYEBROWS = 2,
    AGEING = 3,
    MAKEUP = 4,
    BLUSH = 5,
    COMPLEXION = 6,
    SUN_DAMAGE = 7,
    LIPSTICK = 8,
    MOLES_OR_FRECKLES = 9,
    CHEST_HAIR = 10,
    BODY_BLEMISHES = 11,
    ADD_BODY_BLEMISHES = 12,
}

export enum CharacterCreationCameraFlag {
    TORSO = 0,
    HEAD = 1,
    HAIR_BEAR_EYEBROWS = 2,
    CHEST_HAIR = 3,
}

export interface CharacterCreationCamera {
    angle: number;
    distance: number;
    height: number;
}

