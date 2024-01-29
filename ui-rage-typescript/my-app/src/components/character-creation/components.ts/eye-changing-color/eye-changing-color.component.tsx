import { useEffect, useState } from "react";
import "./eye-changing-color.component.scss";
import { CreatorEvents } from "../../../../utils/character-creation/events.constants";
import {
  COLORS,
  CharacterComponentVariation,
  CharacterCreationData,
  CharacterCreationScope,
  CharacterHairStyle,
  eyeColors,
  hairList,
} from "../../../../utils/character-creation/model";
import { BoxSelectedComponent } from "../box-selected/box-selected.component";
import { RoundedBoxWithColorComponent } from "../rounded-box-with-color/rounded-box-with-color.component";

export const EyeChangingColorComponent: React.FC = () => {
  // 0 - male, 1 - female
  const [selectedEyeColor, setSelectedEyeColor] = useState<number>();

  let rpc: any = null;
  if ("rpc" in window && "callClient" in window.rpc) {
    rpc = window.rpc;
  }

  useEffect(() => {
    // TODO getting the eye color from the server - do event from client and to server and back
  }, [])

  const handleEyeColorChange = (newEyeColor: number) => {
    console.log(newEyeColor);
    setSelectedEyeColor(newEyeColor);
    if(rpc) {
        let characterCreationData: CharacterCreationData = {
            // name does not matter for eye color
            name: "Eye Color",
            scope: CharacterCreationScope.EYE_COLOR,
            // id does not matter for eye color
            id: 0,
            colorChoosen: newEyeColor,
        } as CharacterCreationData;
        rpc.callClient(CreatorEvents.CLIENT_CREATOR_EDIT_COLORS_CHARACTER, JSON.stringify(characterCreationData));
    }
  };

  const isEyeColorSelected = (eyeColorId: number): boolean => {
    return eyeColorId === selectedEyeColor;
  };

  const getImage = (eyeColorId: number): string => {
   const nameOfEyeColor = eyeColors[eyeColorId];
   return require(`../../../../assets/Eye Models/${nameOfEyeColor}.png`);
  };

  return (
    <div className="eye-color-container">
      <div className="eye-color-selection-text">Select eye color</div>
      <div className="scope-choosing-container">
        {eyeColors.map((eyeColor: string, index: number) => (
          <div onClick={() => handleEyeColorChange(index)}>
            <BoxSelectedComponent
              name={eyeColor}
              isSelected={isEyeColorSelected(index)}
              image={getImage(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
