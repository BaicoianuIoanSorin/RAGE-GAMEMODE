import React, { useState } from "react";
import { RoundedBoxWithColorComponent } from "../rounded-box-with-color/rounded-box-with-color.component";
import "./blend-overlay-changing-colors.component.scss";
import {
  CharacterCreationData,
  COLORS,
  CharacterCreationScope,
  CHARACTER_CREATION_BY_SCOPE,
} from "../../../../utils/character-creation/model";
import { CreatorEvents } from "../../../../utils/character-creation/events.constants";
import { BoxSelectedComponent } from "../box-selected/box-selected.component";

export const BlendOverlayChangingColorsComponent: React.FC = () => {
  const [selectedScope, setSelectedScope] = useState<CharacterCreationData>(); // State to hold the selected scope
  const characterCreationData: CharacterCreationData[] = [
    ...CHARACTER_CREATION_BY_SCOPE(CharacterCreationScope.HEAD_OVERLAY, false),
    ...CHARACTER_CREATION_BY_SCOPE(CharacterCreationScope.EYE_COLOR, false)];

  let rpc: any = null;
  if ("rpc" in window && "callClient" in window.rpc) {
    rpc = window.rpc;
  }

  const onClickOnColor = (idColor: number) => {
    if (rpc) {
      rpc.callClient(
        CreatorEvents.CLIENT_CREATOR_EDIT_COLORS_CHARACTER,
        JSON.stringify({
          ...selectedScope,
          colorChoosen: idColor,
        } as CharacterCreationData)
      );
    }
  };

  const isBoxComponentSelected = (data: CharacterCreationData): boolean => {
    return (
      selectedScope?.id === data.id &&
      selectedScope?.scope === data.scope &&
      selectedScope?.name === data.name
    );
  };

  const handleScopeChange = (data: CharacterCreationData) => {
    if(isBoxComponentSelected(data)) {
      setSelectedScope(undefined);
      return;
    }
    setSelectedScope(data);
  };

  return (
    <div className="box-with-colors-container">
      <div className="scope-choosing-container">
        {characterCreationData.map((data: CharacterCreationData, index: number) => (
          <div onClick={() => handleScopeChange(data)}>
            <BoxSelectedComponent
            key={index}
              isSelected={isBoxComponentSelected(data)}
              data={data}
            />
          </div>
        ))}
      </div>
      {/* // for eyes there are different colours, maybe have a look on the specific list of colours and names for eyes */}
      {(selectedScope && selectedScope.scope !== CharacterCreationScope.EYE_COLOR) && (
        <div className="colors-container">
          {Array.from(COLORS).map(
            ([key, value]) =>
              (!selectedScope.maxColor || key <= selectedScope.maxColor) && (
                <div onClick={() => onClickOnColor(key)}>
                  <RoundedBoxWithColorComponent key={key} color={value} />
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};
