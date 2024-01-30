import { useEffect, useState } from "react";
import "./hairstyle.component.scss";
import { CreatorEvents } from "../../../../utils/character-creation/events.constants";
import {
  COLORS,
  CharacterComponentVariation,
  CharacterCreationData,
  CharacterCreationScope,
  CharacterHairStyle,
  CharacterHairStyleComponentInformation,
  hairList,
} from "../../../../utils/character-creation/model";
import { BoxSelectedComponent } from "../box-selected/box-selected.component";
import { RoundedBoxWithColorComponent } from "../rounded-box-with-color/rounded-box-with-color.component";

interface HairStyleProps {
  onChangeEvent: (characterHairStyleComponentInformation: CharacterHairStyleComponentInformation) => void;
}

export const HairStyleComponent: React.FC<HairStyleProps> = (props: HairStyleProps) => {
  // 0 - male, 1 - female
  const [gender, setGender] = useState<number>(0);
  const [hairStyles, setHairStyles] = useState<CharacterHairStyle[]>(
    hairList[gender]
  );
  const [selectedHairStyle, setSelectedHairStyle] =
    useState<CharacterHairStyle>(hairList[gender][0]);

  let rpc: any = null;
  if ("rpc" in window && "callClient" in window.rpc) {
    rpc = window.rpc;
  }

  const handleGenderChange = (newGender: number) => {
    setGender(newGender);
    setHairStyles(hairList[newGender]);
    if(rpc) {
        rpc.callClient(CreatorEvents.CLIENT_CHANGE_GENDER, newGender);
        props.onChangeEvent({
          characterHairStyle: selectedHairStyle,
          gender: newGender,
        } as CharacterHairStyleComponentInformation)

        setSelectedHairStyle(hairList[newGender][0])
    }
    else {
      props.onChangeEvent({
        characterHairStyle: selectedHairStyle,
        gender: newGender,
      } as CharacterHairStyleComponentInformation)
    }
  };

  const isHairStyleSelected = (hairStyle: CharacterHairStyle): boolean => {
    return (
      selectedHairStyle?.collection === hairStyle.collection &&
      selectedHairStyle?.name === hairStyle.name &&
      selectedHairStyle?.id === hairStyle.id
    );
  };

  const handleHairStyleChange = (hairStyle: CharacterHairStyle) => {
    setSelectedHairStyle(hairStyle);
    props.onChangeEvent({
      characterHairStyle: hairStyle,
      gender: gender,
    } as CharacterHairStyleComponentInformation)

    let componentVariation = {
      componentId: 2,
      drawableId: hairStyle.id,
      textureId: 0,
      paletteId: 2,
    } as CharacterComponentVariation;

    if (rpc) {
      rpc.callClient(
        CreatorEvents.CLIENT_SET_COMPONENT_VARIATION,
        JSON.stringify(componentVariation)
      );
    }
  };

  const handleChangeColor = (color: number) => {
    if (rpc) {
        rpc.callClient(
            CreatorEvents.CLIENT_CREATOR_EDIT_COLORS_CHARACTER,
            JSON.stringify({
                // name does not matter for hair color
                name: "Hair Color",
                scope: CharacterCreationScope.HAIR_COLOR,
                // id does not matter for hair color
                id: gender,
                colorChoosen: color,
            } as CharacterCreationData)
          );
    }
  }

  const getImage = (hairStyle: CharacterHairStyle): string => {
    let depository: string = "";
    let photo: string = "";
    if (gender === 0) {
      depository = "Male";
      photo = `Clothing_M_2_${hairStyle.id}`;
    } else {
      depository = "Female";
      photo = `Clothing_F_2_${hairStyle.id}`;
    }
    let result = require(`../../../../assets/Hair Styles/${depository}/${photo}.webp`);
    return result;
  };

  return (
    <div className="hairstyle-container">
      <div className="buttons-container">
        <div className="gender-selection-text">Select Gender</div>
        <div className="gender-selection-buttons">
          <button
            className="gender-button"
            onClick={() => handleGenderChange(0)}
            style={{ backgroundColor: gender === 0 ? "#86a859" : "" }}
          >
            Male
          </button>
          <button
            className="gender-button"
            onClick={() => handleGenderChange(1)}
            style={{ backgroundColor: gender === 1 ? "#86a859" : "" }}
          >
            Female
          </button>
        </div>
      </div>
      <div className="scope-choosing-container">
        {hairStyles.map((hairStyle: CharacterHairStyle) => (
          <div onClick={() => handleHairStyleChange(hairStyle)}>
            <BoxSelectedComponent
              name={hairStyle.name}
              isSelected={isHairStyleSelected(hairStyle)}
              image={getImage(hairStyle)}
            />
          </div>
        ))}
      </div>
      {selectedHairStyle && (
        <div className="hairstyle-changing-colors">
          {Array.from(COLORS).map(
            ([key, value]) =>
              (
                <div onClick={() => handleChangeColor(key)}>
                  <RoundedBoxWithColorComponent key={key} color={value} />
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};
