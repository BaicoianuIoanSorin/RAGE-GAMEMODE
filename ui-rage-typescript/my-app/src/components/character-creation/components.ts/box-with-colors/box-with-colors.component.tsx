import React, { useState } from "react";
import {
  COLORS,
  CharacterCreationData,
  CHARACTER_CREATION_DATA,
  CHARACTER_CREATION_WITH_COLORS,
} from "../../constants";
import { RoundedBoxWithColorComponent } from "../rounded-box-with-color/rounded-box-with-color.component";
import "./box-with-colors.component.scss";

export const BoxWithColorsComponent: React.FC = () => {
  const [selectedScope, setSelectedScope] = useState<CharacterCreationData>(); // State to hold the selected scope

  
  const onClickOnColor = (idColor: number) => {
    // Call client in rage for changings using props.data using the idColor
    console.log(`Color ID: ${idColor}, Scope: ${selectedScope}`);
    // ... additional logic
  };

  const characterCreationData: CharacterCreationData[] =
    CHARACTER_CREATION_WITH_COLORS();

  const handleScopeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if(event.target.value === "") {
        setSelectedScope(undefined);
        return;
    }
    const selectedData: CharacterCreationData = JSON.parse(event.target.value);
    setSelectedScope(selectedData);
  };

  return (
    <div className="box-with-colors-container">
      <div className="slider-title">Change color</div>
      <div className="scope-choosing-container">
        <select
          value={JSON.stringify(selectedScope)}
          onChange={handleScopeChange}
        >
          <option value="">Select a Scope</option>
          {characterCreationData.map(
            (data: CharacterCreationData, index: number) => (
              <option key={index} value={JSON.stringify(data)}>
                {data.name}
              </option>
            )
          )}
        </select>
      </div>
      {(selectedScope != null) && (
        <div className="colors-container">
          {Array.from(COLORS).map(([key, value]) => {
            if (selectedScope.maxColor && key <= selectedScope.maxColor) {
                return (
                    <RoundedBoxWithColorComponent
                      key={key}
                      color={value}
                      onClick={() => onClickOnColor(key)}
                    />
                    );        
            }
            else if(selectedScope.maxColor == undefined) {
                return (
                    <RoundedBoxWithColorComponent
                      key={key}
                      color={value}
                      onClick={() => onClickOnColor(key)}
                    />
                    );
            }
          })}
        </div>
      )}
    </div>
  );
};
