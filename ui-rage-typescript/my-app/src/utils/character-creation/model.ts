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
    drawableId: number;
    textureId: number;
    paletteId: number;
}

export interface CharacterCreationCameraFlagModel {
    characterCreationCameraFlag: CharacterCreationCameraFlag;
    withRemovingComponentVariations: boolean;
}


// id - number, HEX - string
// getting colors from here https://wiki.rage.mp/index.php?title=Hair_Colors
export const COLORS: Map<number, string> = new Map([
    [0, "#1c1f21"],
    [1, "#272a2c"],
     [2, "#312e2c"],
     [3, "#35261c"],
     [4, "#4b321f"],
     [5, "#5c3b24"],
     [6, "#6d4c35"],
     [7, "#6b503b"],
     [8, "#765c45"],
     [9, "#7f684e"],
     [10, "#99815d"],
     [11, "#a79369"],
     [12, "#af9c70"],
     [13, "#bba063"],
     [14, "#d6b97b"],
     [15, "#dac38e"],
     [16, "#9f7f59"],
     [17, "#845039"],
     [18, "#682b1f"],
     [19, "#61120c"],
     [20, "#640f0a"],
     [21, "#7c140f"],
     [22, "#a02e19"],
     [23, "#b64b28"],
     [24, "#a2502f"],
     [25, "#aa4e2b"],
     [26, "#626262"],
     [27, "#808080"],
     [28, "#aaaaaa"],
     [29, "#c5c5c5"],
     [30, "#463955"],
     [31, "#5a3f6b"],
     [32, "#763c76"],
     [33, "#ed74e3"],
     [34, "#eb4b93"],
     [35, "#f299bc"],
     [36, "#04959e"],
     [37, "#025f86"],
     [38, "#023974"],
     [39, "#3fa16a"],
     [40, "#217c61"],
     [41, "#185c55"],
     [42, "#b6c034"],
     [43, "#70a90b"],
     [44, "#439d13"],
     [45, "#dcb857"],
     [46, "#e5b103"],
     [47, "#e69102"],
     [48, "#f28831"],
     [49, "#fb8057"],
     [50, "#e28b58"],
     [51, "#d1593c"],
     [52, "#ce3120"],
     [53, "#ad0903"],
     [54, "#880302"],
     [55, "#1f1814"],
     [56, "#291f19"],
     [57, "#2e221b"],
     [58, "#37291e"],
     [59, "#2e2218"],
     [60, "#231b15"],
     [61, "#020202"],
     [62, "#706c66"],
     [63, "#9d7a50"]
     ]);
 
     export const headOverlay: Map<number, string> = new Map([
         [0, "Blemishes"],
         [1, "Facial Hair"],
         [2, "Eyebrows"],
         [3, "Ageing"],
         [4, "Makeup"],
         [5, "Blush"],
         [6, "Complexion"],
         [7, "Sun Damage"],
         [8, "Lipstick"],
         [9, "Moles & Freckles"],
         [10, "Chest Hair"],
         [11, "Body Blemishes"],
     ]);
 
     // there is gonna be only one for eyeColor
 
     export enum CharacterCreationScope {
         HEAD_OVERLAY = "headOverlay",
         FACE_FEATURE = "faceFeature",
         HEAD_BLEND_DATA = "headBlendData",
         EYE_COLOR = "eyeColor",
         HAIR_COLOR = "hairColor",
     }
 
     
     // this will be used for different things, for example when setting faceFeature or headOverlay
     export interface CharacterCreationData {
         name: string;
         scope: CharacterCreationScope;
         id: number;
         minValue?: number;
         maxValue?: number;
         maxColor?: number;
         colorChoosen?: number;
         valueChoosen?: number;
     }
 
     export const characterCreationDataNotSupportedForColours: CharacterCreationData[] = [
                    { name: "Blemishes", scope: CharacterCreationScope.HEAD_OVERLAY, id: 0, minValue: 0, maxValue: 23 },
                    { name: "Ageing", scope: CharacterCreationScope.HEAD_OVERLAY, id: 3, minValue: 0, maxValue: 14 },
                    { name: "Makeup", scope: CharacterCreationScope.HEAD_OVERLAY, id: 4, minValue: 0, maxValue: 74 },
                    { name: "Complexion", scope: CharacterCreationScope.HEAD_OVERLAY, id: 6, minValue: 0, maxValue: 11 },
                    { name: "Sun Damage", scope: CharacterCreationScope.HEAD_OVERLAY, id: 7, minValue: 0, maxValue: 10 },
                    { name: "Moles & Freckles", scope: CharacterCreationScope.HEAD_OVERLAY, id: 9, minValue: 0, maxValue: 17 },
                    { name: "Body Blemishes", scope: CharacterCreationScope.HEAD_OVERLAY, id: 11, minValue: 0, maxValue: 11 },
                ];
        
     export const CHARACTER_CREATION_DATA: Map<CharacterCreationScope, Map<string, CharacterCreationData>> = new Map(
         [
             [
                 CharacterCreationScope.HEAD_OVERLAY,
                 new Map<string, CharacterCreationData>([
                     ["blemishes", { name: "Blemishes", scope: CharacterCreationScope.HEAD_OVERLAY, id: 0, minValue: 0, maxValue: 23 }],
                     ["facialHair", { name: "Facial Hair", scope: CharacterCreationScope.HEAD_OVERLAY, id: 1, minValue: 0, maxValue: 28 }],
                     ["eyebrows", { name: "Eyebrows", scope: CharacterCreationScope.HEAD_OVERLAY, id: 2, minValue: 0, maxValue: 33 }],
                     ["ageing", { name: "Ageing", scope: CharacterCreationScope.HEAD_OVERLAY, id: 3, minValue: 0, maxValue: 14 }],
                     ["makeup", { name: "Makeup", scope: CharacterCreationScope.HEAD_OVERLAY, id: 4, minValue: 0, maxValue: 74 }],
                     ["blush", { name: "Blush", scope: CharacterCreationScope.HEAD_OVERLAY, id: 5, minValue: 0, maxValue: 32, maxColor: 27 }],
                     ["complexion", { name: "Complexion", scope: CharacterCreationScope.HEAD_OVERLAY, id: 6, minValue: 0, maxValue: 11 }],
                     ["sunDamage", { name: "Sun Damage", scope: CharacterCreationScope.HEAD_OVERLAY, id: 7, minValue: 0, maxValue: 10 }],
                     ["lipstick", { name: "Lipstick", scope: CharacterCreationScope.HEAD_OVERLAY, id: 8, minValue: 0, maxValue: 9, maxColor: 27 }],
                     ["molesFreckles", { name: "Moles & Freckles", scope: CharacterCreationScope.HEAD_OVERLAY, id: 9, minValue: 0, maxValue: 17 }],
                     ["chestHair", { name: "Chest Hair", scope: CharacterCreationScope.HEAD_OVERLAY, id: 10, minValue: 0, maxValue: 16 }],
                     ["bodyBlemishes", { name: "Body Blemishes", scope: CharacterCreationScope.HEAD_OVERLAY, id: 11, minValue: 0, maxValue: 11 }],
                 ])
             ],
             [
                 CharacterCreationScope.FACE_FEATURE,
                 new Map<string, CharacterCreationData>([
                     ["noseWidth", { name: "Nose Width", scope: CharacterCreationScope.FACE_FEATURE, id: 0, minValue: -1, maxValue: 1 }],
                     ["noseHeight", { name: "Nose Height", scope: CharacterCreationScope.FACE_FEATURE, id: 1, minValue: -1, maxValue: 1 }],
                     ["noseLength", { name: "Nose Length", scope: CharacterCreationScope.FACE_FEATURE, id: 2, minValue: -1, maxValue: 1 }],
                     ["noseBridge", { name: "Nose Bridge", scope: CharacterCreationScope.FACE_FEATURE, id: 3, minValue: -1, maxValue: 1 }],
                     ["noseTip", { name: "Nose Tip", scope: CharacterCreationScope.FACE_FEATURE, id: 4, minValue: -1, maxValue: 1 }],
                     ["noseBridgeShift", { name: "Nose Bridge Shift", scope: CharacterCreationScope.FACE_FEATURE, id: 5, minValue: -1, maxValue: 1 }],
                     ["browHeight", { name: "Brow Height", scope: CharacterCreationScope.FACE_FEATURE, id: 6, minValue: -1, maxValue: 1 }],
                     ["browWidth", { name: "Brow Width", scope: CharacterCreationScope.FACE_FEATURE, id: 7, minValue: -1, maxValue: 1 }],
                     ["cheekboneHeight", { name: "Cheekbone Height", scope: CharacterCreationScope.FACE_FEATURE, id: 8, minValue: -1, maxValue: 1 }],
                     ["cheekboneWidth", { name: "Cheekbone Width", scope: CharacterCreationScope.FACE_FEATURE, id: 9, minValue: -1, maxValue: 1 }],
                     ["cheeksWidth", { name: "Cheeks Width", scope: CharacterCreationScope.FACE_FEATURE, id: 10, minValue: -1, maxValue: 1 }],
                     ["eyes", { name: "Eyes", scope: CharacterCreationScope.FACE_FEATURE, id: 11, minValue: -1, maxValue: 1 }],
                     ["lips", { name: "Lips", scope: CharacterCreationScope.FACE_FEATURE, id: 12, minValue: -1, maxValue: 1 }],
                     ["jawWidth", { name: "Jaw Width", scope: CharacterCreationScope.FACE_FEATURE, id: 13, minValue: -1, maxValue: 1 }],
                     ["jawHeight", { name: "Jaw Height", scope: CharacterCreationScope.FACE_FEATURE, id: 14, minValue: -1, maxValue: 1 }],
                     ["chinLength", { name: "Chin Length", scope: CharacterCreationScope.FACE_FEATURE, id: 15, minValue: -1, maxValue: 1 }],
                     ["chinPosition", { name: "Chin Position", scope: CharacterCreationScope.FACE_FEATURE, id: 16, minValue: -1, maxValue: 1 }],
                     ["chinWidth", { name: "Chin Width", scope: CharacterCreationScope.FACE_FEATURE, id: 17, minValue: -1, maxValue: 1 }],
                     ["chinShape", { name: "Chin Shape", scope: CharacterCreationScope.FACE_FEATURE, id: 18, minValue: -1, maxValue: 1 }],
                     ["neckWidth", { name: "Neck Width", scope: CharacterCreationScope.FACE_FEATURE, id: 19, minValue: -1, maxValue: 1 }],
             ]),
         ],
         [
             CharacterCreationScope.EYE_COLOR,
             new Map<string, CharacterCreationData>([
                 ["eyeColor", { name: "Eye Color", scope: CharacterCreationScope.EYE_COLOR, id: 0, maxColor: 32 }],
             ])
         ]
     ]);
 
     export const CHARACTER_CREATION_WITH_COLORS = (): CharacterCreationData[] => {
         const result: CharacterCreationData[] = [];
 
         CHARACTER_CREATION_DATA.forEach((innerMap, scope) => {
             if(scope !== CharacterCreationScope.FACE_FEATURE) {
                 innerMap.forEach((data, key) => {
                     result.push(data);
                 });
             }
         });
         
         return result;
     };

     export const CHARACTER_CREATION_BY_SCOPE = (byScope: CharacterCreationScope, withNotSupportedForColours: boolean): CharacterCreationData[] => {
        const result: CharacterCreationData[] = [];

        CHARACTER_CREATION_DATA.forEach((innerMap, scope) => {
            if(scope === byScope) {
                if(withNotSupportedForColours) {
                    innerMap.forEach((data, key) => {
                        result.push(data);
                    });
                } else {
                    innerMap.forEach((data, key) => {
                        if(!characterCreationDataNotSupportedForColours.find((notSupportedData) => notSupportedData.name === data.name)) {
                            result.push(data);
                        }
                    });
                }
            }
        });
        
        return result;
    };

    // setHeadBlendData
    export const FATHER_IDS: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 42, 43, 44];
    export const MOTHER_IDS: number[] = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45]
    export const FATHER_NAMES_MAPPER: Map<number, string> = new Map([
        [0, "Benjamin"],
        [1, "Daniel"],
        [2, "Joshua"],
        [3, "Noah"],
        [4, "Andrew"],
        [5, "Juan"],
        [6, "Alex"],
        [7, "Isaac"],
        [8, "Evan"],
        [9, "Ethan"],
        [10, "Vincent"],
        [11, "Angel"],
        [12, "Diego"],
        [13, "Adrian"],
        [14, "Gabriel"],
        [15, "Michael"],
        [16, "Santiago"],
        [17, "Kevin"],
        [18, "Louis"],
        [19, "Samuel"],
        [20, "Anthony"],
        [42, "Claude"],
        [43, "Niko"],
        [44, "John"]
    ]);

    export const MOTHER_NAMES_MAPPER: Map<number, string> = new Map([
        [21, "Hannah"],
        [22, "Aubrey"],
        [23, "Jasmine"],
        [24, "Gisele"],
        [25, "Amelia"],
        [26, "Isabella"],
        [27, "Zoe"],
        [28, "Ava"],
        [29, "Camila"],
        [30, "Violet"],
        [31, "Sophia"],
        [32, "Evelyn"],
        [33, "Nicole"],
        [34, "Ashley"],
        [35, "Gracie"],
        [36, "Brianna"],
        [37, "Natalie"],
        [38, "Olivia"],
        [39, "Elizabeth"],
        [40, "Charlotte"],
        [41, "Emma"],
        [45, "Misty"]
    ]);
    
    export interface CharacterHairStyle {
        id: number;
        name: string;
        collection: string;
        overlay: string;
    }
    
   export const hairList: CharacterHairStyle[][] = [
        // male
        [
            {id: 0, name: "Close Shave", collection: "mpbeach_overlays", overlay: "Clothing_M_2_0"},
            {id: 1, name: "Buzzcut", collection: "multiplayer_overlays", overlay: "Clothing_M_2_1"},
            {id: 2, name: "Faux Hawk", collection: "multiplayer_overlays", overlay: "Clothing_M_2_2"},
            {id: 3, name: "Hipster", collection: "multiplayer_overlays", overlay: "Clothing_M_2_3"},
            {id: 4, name: "Side Parting", collection: "multiplayer_overlays", overlay: "Clothing_M_2_4"},
            {id: 5, name: "Shorter Cut", collection: "multiplayer_overlays", overlay: "Clothing_M_2_5"},
            {id: 6, name: "Biker", collection: "multiplayer_overlays", overlay: "Clothing_M_2_6"},
            {id: 7, name: "Ponytail", collection: "multiplayer_overlays", overlay: "Clothing_M_2_7"},
            {id: 8, name: "Cornrows", collection: "multiplayer_overlays", overlay: "Clothing_M_2_8"},
            {id: 9, name: "Slicked", collection: "multiplayer_overlays", overlay: "Clothing_M_2_9"},
            {id: 10, name: "Short Brushed", collection: "multiplayer_overlays", overlay: "Clothing_M_2_10"},
            {id: 11, name: "Spikey", collection: "multiplayer_overlays", overlay: "Clothing_M_2_11"},
            {id: 12, name: "Caesar", collection: "multiplayer_overlays", overlay: "Clothing_M_2_12"},
            {id: 13, name: "Chopped", collection: "multiplayer_overlays", overlay: "Clothing_M_2_13"},
            {id: 14, name: "Dreads", collection: "multiplayer_overlays", overlay: "Clothing_M_2_14"},
            {id: 15, name: "Long Hair", collection: "multiplayer_overlays", overlay: "Clothing_M_2_15"},
            {id: 16, name: "Shaggy Curls", collection: "multiplayer_overlays", overlay: "Clothing_M_2_16"},
            {id: 17, name: "Surfer Dude", collection: "multiplayer_overlays", overlay: "Clothing_M_2_17"},
            {id: 18, name: "Short Side Part", collection: "multiplayer_overlays", overlay: "Clothing_M_2_18"},
            {id: 19, name: "High Slicked Sides", collection: "multiplayer_overlays", overlay: "Clothing_M_2_19"},
            {id: 20, name: "Long Slicked", collection: "multiplayer_overlays", overlay: "Clothing_M_2_20"},
            {id: 21, name: "Hipster Youth", collection: "multiplayer_overlays", overlay: "Clothing_M_2_21"},
            {id: 22, name: "Mullet", collection: "multiplayer_overlays", overlay: "Clothing_M_2_22"},
            {id: 24, name: "Classic Cornrows", collection: "mplowrider_overlays", overlay: "Clothing_M_2_24"},
            {id: 25, name: "Palm Cornrows", collection: "mplowrider_overlays", overlay: "Clothing_M_2_25"},
            {id: 26, name: "Lightning Cornrows", collection: "mplowrider_overlays", overlay: "Clothing_M_2_26"},
            {id: 27, name: "Whipped Cornrows", collection: "mplowrider_overlays", overlay: "Clothing_M_2_27"},
            {id: 28, name: "Zig Zag Cornrows", collection: "mplowrider2_overlays", overlay: "Clothing_M_2_28"},
            {id: 29, name: "Snail Cornrows", collection: "mplowrider2_overlays", overlay: "Clothing_M_2_29"},
            {id: 30, name: "Hightop", collection: "mplowrider2_overlays", overlay: "Clothing_M_2_30"},
            {id: 31, name: "Loose Swept Back", collection: "mpbiker_overlays", overlay: "Clothing_M_2_31"},
            {id: 32, name: "Undercut Swept Back", collection: "mpbiker_overlays", overlay: "Clothing_M_2_32"},
            {id: 33, name: "Undercut Swept Side", collection: "mpbiker_overlays", overlay: "Clothing_M_2_33"},
            {id: 34, name: "Spiked Mohawk", collection: "mpbiker_overlays", overlay: "Clothing_M_2_34"},
            {id: 35, name: "Mod", collection: "mpbiker_overlays", overlay: "Clothing_M_2_35"},
            {id: 36, name: "Layered Mod", collection: "mpbiker_overlays", overlay: "Clothing_M_2_36"},
            {id: 72, name: "Flattop", collection: "mpgunrunning_overlays", overlay: "Clothing_M_2_72"},
            {id: 73, name: "Military Buzzcut", collection: "mpgunrunning_overlays", overlay: "Clothing_M_2_73"}
        ],
        // female
        [
            {id: 0, name: "Close Shave", collection: "mpbeach_overlays", overlay: "Clothing_F_2_0"},
            {id: 1, name: "Short", collection: "multiplayer_overlays", overlay: "Clothing_F_2_1"},
            {id: 2, name: "Layered Bob", collection: "multiplayer_overlays", overlay: "Clothing_F_2_2"},
            {id: 3, name: "Pigtails", collection: "multiplayer_overlays", overlay: "Clothing_F_2_3"},
            {id: 4, name: "Ponytail", collection: "multiplayer_overlays", overlay: "Clothing_F_2_4"},
            {id: 5, name: "Braided Mohawk", collection: "multiplayer_overlays", overlay: "Clothing_F_2_5"},
            {id: 6, name: "Braids", collection: "multiplayer_overlays", overlay: "Clothing_F_2_6"},
            {id: 7, name: "Bob", collection: "multiplayer_overlays", overlay: "NG_F_Hair_007"},
            {id: 8, name: "Faux Hawk", collection: "multiplayer_overlays", overlay: "Clothing_F_2_8"},
            {id: 9, name: "French Twist", collection: "multiplayer_overlays", overlay: "Clothing_F_2_9"},
            {id: 10, name: "Long Bob", collection: "multiplayer_overlays", overlay: "Clothing_F_2_10"},
            {id: 11, name: "Loose Tied", collection: "multiplayer_overlays", overlay: "Clothing_F_2_11"},
            {id: 12, name: "Pixie", collection: "multiplayer_overlays", overlay: "Clothing_F_2_12"},
            {id: 13, name: "Shaved Bangs", collection: "multiplayer_overlays", overlay: "Clothing_F_2_13"},
            {id: 14, name: "Top Knot", collection: "multiplayer_overlays", overlay: "Clothing_F_2_14"},
            {id: 15, name: "Wavy Bob", collection: "multiplayer_overlays", overlay: "Clothing_F_2_15"},
            {id: 16, name: "Messy Bun", collection: "multiplayer_overlays", overlay: "Clothing_F_2_16"},
            {id: 17, name: "Pin Up Girl", collection: "multiplayer_overlays", overlay: "Clothing_F_2_17"},
            {id: 18, name: "Tight Bun", collection: "multiplayer_overlays", overlay: "Clothing_F_2_18"},
            {id: 19, name: "Twisted Bob", collection: "multiplayer_overlays", overlay: "Clothing_F_2_19"},
            {id: 20, name: "Flapper Bob", collection: "multiplayer_overlays", overlay: "Clothing_F_2_20"},
            {id: 21, name: "Big Bangs", collection: "multiplayer_overlays", overlay: "Clothing_F_2_21"},
            {id: 22, name: "Braided Top Knot", collection: "multiplayer_overlays", overlay: "Clothing_F_2_22"},
            {id: 23, name: "Mullet", collection: "multiplayer_overlays", overlay: "Clothing_F_2_23"},
            {id: 25, name: "Pinched Cornrows", collection: "mplowrider_overlays", overlay: "Clothing_F_2_25"},
            {id: 26, name: "Leaf Cornrows", collection: "mplowrider_overlays", overlay: "Clothing_F_2_26"},
            {id: 27, name: "Zig Zag Cornrows", collection: "mplowrider_overlays", overlay: "Clothing_F_2_27"},
            {id: 28, name: "Pigtail Bangs", collection: "mplowrider2_overlays", overlay: "Clothing_F_2_28"},
            {id: 29, name: "Wave Braids", collection: "mplowrider2_overlays", overlay: "Clothing_F_2_29"},
            {id: 30, name: "Coil Braids", collection: "mplowrider2_overlays", overlay: "Clothing_F_2_30"},
            {id: 31, name: "Rolled Quiff", collection: "mplowrider2_overlays", overlay: "Clothing_F_2_31"},
            {id: 32, name: "Loose Swept Back", collection: "mpbiker_overlays", overlay: "Clothing_F_2_32"},
            {id: 33, name: "Undercut Swept Back", collection: "mpbiker_overlays", overlay: "Clothing_F_2_33"},
            {id: 34, name: "Undercut Swept Side", collection: "mpbiker_overlays", overlay: "Clothing_F_2_34"},
            {id: 35, name: "Spiked Mohawk", collection: "mpbiker_overlays", overlay: "Clothing_F_2_35"},
            {id: 36, name: "Bandana and Braid", collection: "multiplayer_overlays", overlay: "Clothing_F_2_36"},
            {id: 37, name: "Layered Mod", collection: "mpbiker_overlays", overlay: "Clothing_F_2_37"},
            {id: 38, name: "Skinbyrd", collection: "mpbiker_overlays", overlay: "Clothing_F_2_38"},
            {id: 76, name: "Neat Bun", collection: "mpgunrunning_overlays", overlay: "Clothing_F_2_76"},
            {id: 77, name: "Short Bob", collection: "mpgunrunning_overlays", overlay: "Clothing_F_2_77"}
        ]
    ];

    export const eyeColors = ["Green", "Emerald", "Light Blue", "Ocean Blue", "Light Brown", "Dark Brown", "Hazel", "Dark Gray", "Light Gray", "Pink", "Yellow", "Purple", "Blackout", "Shades of Gray", "Tequila Sunrise", "Atomic", "Warp", "ECola", "Space Ranger", "Ying Yang", "Bullseye", "Lizard", "Dragon", "Extra Terrestrial", "Goat", "Smiley", "Possessed", "Demon", "Infected", "Alien", "Undead", "Zombie"];

    export interface CharacterHairStyleComponentInformation {
        characterHairStyle: CharacterHairStyle;
        gender: number;
    }
