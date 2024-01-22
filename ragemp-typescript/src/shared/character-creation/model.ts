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

export interface CharacterHeadBlendData {
    // mother shape
    shapeFirstId: number;
    // father shape
    shapeSecondId: number;
    // does not change anything - you can leave with 0
    shapeThirdId: number;
    // mother skin color
    skinFirstId: number;
    // father skin color
    skinSecondId: number;
    // does not change anything - you can leave with 0
    skinThirdId: number;
    // 0 - more like mother, 1 - more like father
    // this varies from 0 to 1 as a float number
    shapeMix: number;
    // 0 - more like mother, 1 - more like father
    // this varies from 0 to 1 as a float number
    skinMix: number;
    // does not change anything - you can leave with 0
    thirdMix: number;
    // this do not change anything - you can leave with false
    isParent: boolean;
}

// ids from 0 to 19
// scale ranges from -1.0 to 1.0
export interface CharacterFaceFeature {
    id: number;
    scale: number;
}

export interface CharacterComponentVariation {
    componentId: number;
    drawable: number;
    texture: number;
    palette: number;
}

export interface CharacterCreationCameraFlagModel {
    characterCreationCameraFlag: CharacterCreationCameraFlag;
    withRemovingComponentVariations: boolean;
}
