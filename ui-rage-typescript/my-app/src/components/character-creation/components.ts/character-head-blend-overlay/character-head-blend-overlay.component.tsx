import { useState } from "react";
import {
  CHARACTER_CREATION_BY_SCOPE,
  CharacterCreationData,
  CharacterCreationScope,
  CharacterHeadBlendData,
  FATHER_NAMES_MAPPER,
  FATHER_IDS,
  MOTHER_NAMES_MAPPER,
  MOTHER_IDS,
} from "../../../../utils/character-creation/model";
import { BoxSelectedComponent } from "../box-selected/box-selected.component";
import { CustomSlider } from "../slider/slider.component";
import "./character-head-blend-overlay.component.scss";
import { CreatorEvents } from "../../../../utils/character-creation/events.constants";

export const CharacterHeadBlendOverlayComponent: React.FC = () => {
  const [selectedMotherId, setSelectedMotherId] = useState<number>(); // State to hold the selected scope
  const [selectedFatherId, setSelectedFatherId] = useState<number>(); // State to hold the selected scope
  const [shapeMix, setShapeMix] = useState<number>(0);
  const [shapeMixWasChanged, setShapeMixWasChanged] = useState<boolean>(false); // State to hold the selected scope
  const [skinMix, setSkinMix] = useState<number>(0);
  const [skinMixWasChanged, setSkinMixWasChanged] = useState<boolean>(false); // State to hold the selected scope

  let rpc: any = null;
  if ("rpc" in window && "callClient" in window.rpc) {
    rpc = window.rpc;
  }

  const isBoxComponentSelected = (id: number): boolean => {
    if (selectedMotherId === id) {
      return true;
    } else if (selectedFatherId === id) {
      return true;
    }
    return false;
  };

  const handleScopeChange = (id: number) => {
    if (MOTHER_IDS.includes(id)) {
      setSelectedMotherId(isBoxComponentSelected(id) ? undefined : id);
      if(selectedFatherId !== undefined) {
        let characterHeadBlendData: CharacterHeadBlendData = {
          shapeFirstId: id,
          shapeSecondId: selectedFatherId,
          shapeThirdId: 0,
          skinFirstId: id,
          skinSecondId: selectedFatherId,
          skinThirdId: 0,
          shapeMix: shapeMix,
          skinMix: skinMix,
          thirdMix: 0,
          isParent: false,
        } as CharacterHeadBlendData;
    
        if(rpc) {
          rpc.callClient(
            CreatorEvents.CLIENT_CREATOR_SET_HEAD_BLEND_DATA,
            JSON.stringify(characterHeadBlendData)
          );
        }
        else {
          alert(`${CreatorEvents.CLIENT_CREATOR_SET_HEAD_BLEND_DATA} called with ${JSON.stringify(characterHeadBlendData)}`);
        }
      }
    } else if (FATHER_IDS.includes(id)) {
      setSelectedFatherId(isBoxComponentSelected(id) ? undefined : id);
      if(selectedMotherId !== undefined) {
        let characterHeadBlendData: CharacterHeadBlendData = {
          shapeFirstId: selectedMotherId,
          shapeSecondId: id,
          shapeThirdId: 0,
          skinFirstId: selectedMotherId,
          skinSecondId: id,
          skinThirdId: 0,
          shapeMix: shapeMix,
          skinMix: skinMix,
          thirdMix: 0,
          isParent: false,
        } as CharacterHeadBlendData;
    
        if(rpc) {
          rpc.callClient(
            CreatorEvents.CLIENT_CREATOR_SET_HEAD_BLEND_DATA,
            JSON.stringify(characterHeadBlendData)
          );
        }
        else {
          alert(`${CreatorEvents.CLIENT_CREATOR_SET_HEAD_BLEND_DATA} called with ${JSON.stringify(characterHeadBlendData)}`);
        }
      }
    }
  };

  const handleShapeMixChange = (value: number) => {
    setShapeMix(value);
    if (!shapeMixWasChanged) setShapeMixWasChanged(true); 

    let characterHeadBlendData: CharacterHeadBlendData = {
      shapeFirstId: selectedMotherId,
      shapeSecondId: selectedFatherId,
      shapeThirdId: 0,
      skinFirstId: selectedMotherId,
      skinSecondId: selectedFatherId,
      skinThirdId: 0,
      shapeMix: value,
      skinMix: skinMix,
      thirdMix: 0,
      isParent: false,
    } as CharacterHeadBlendData;

    if(rpc) {
      rpc.callClient(
        CreatorEvents.CLIENT_CREATOR_SET_HEAD_BLEND_DATA,
        JSON.stringify(characterHeadBlendData)
      );
    }
    else {
      alert(`${CreatorEvents.CLIENT_CREATOR_SET_HEAD_BLEND_DATA} called with ${JSON.stringify(characterHeadBlendData)}`);
    }
  };

  const handleSkinMixChange = (value: number) => {
    setSkinMix(value);
    if (!skinMixWasChanged) setSkinMixWasChanged(true); 

    let characterHeadBlendData: CharacterHeadBlendData = {
      shapeFirstId: selectedMotherId,
      shapeSecondId: selectedFatherId,
      shapeThirdId: 0,
      skinFirstId: selectedMotherId,
      skinSecondId: selectedFatherId,
      skinThirdId: 0,
      shapeMix: shapeMix,
      skinMix: value,
      thirdMix: 0,
      isParent: false,
    } as CharacterHeadBlendData;

    if(rpc) {
      rpc.callClient(
        CreatorEvents.CLIENT_CREATOR_SET_HEAD_BLEND_DATA,
        JSON.stringify(characterHeadBlendData)
      );
    }
    else {
      alert(`${CreatorEvents.CLIENT_CREATOR_SET_HEAD_BLEND_DATA} called with ${JSON.stringify(characterHeadBlendData)}`);
    }
  };

  return (
    <div className="character-head-blend-overlay-container">
      <div className="heading-container">Choose your father</div>
      <div className="scope-choosing-container">
        {Array.from(FATHER_NAMES_MAPPER).map(([key, value]) => (
          <div onClick={() => handleScopeChange(key)}>
            <BoxSelectedComponent
              key={key}
              isSelected={isBoxComponentSelected(key)}
              name={value}
              image={require(`../../../../assets/Faceids/FaceID ${key}.png`)}
            />
          </div>
        ))}
      </div>
      <div className="heading-container">Choose your mother</div>
      <div className="scope-choosing-container">
        {Array.from(MOTHER_NAMES_MAPPER).map(([key, value]) => (
          <div onClick={() => handleScopeChange(key)}>
            <BoxSelectedComponent
              key={key}
              isSelected={isBoxComponentSelected(key)}
              image={require(`../../../../assets/Faceids/FaceID ${key}.png`)}
              name={value}
            />
          </div>
        ))}
      </div>
      {selectedMotherId !== undefined && selectedFatherId !== undefined && (
        <div className="parents-mixes">
          <h3> Choose your parent's shape mix</h3>
          <CustomSlider
            title={"0 - more like mother, 1 - more like father"}
            min={0}
            max={1}
            defaultValue={shapeMixWasChanged ? shapeMix : 0}
            step={0.1}
            onChangeEvent={handleShapeMixChange}
          />
          <h3> Choose your parent's skin mix</h3>
          <CustomSlider
            title={"0 - more like mother, 1 - more like father"}
            min={0}
            max={1}
            defaultValue={skinMixWasChanged ? skinMix : 0}
            step={0.1}
            onChangeEvent={handleSkinMixChange}
          />
        </div>
      )}
    </div>
  );
};
