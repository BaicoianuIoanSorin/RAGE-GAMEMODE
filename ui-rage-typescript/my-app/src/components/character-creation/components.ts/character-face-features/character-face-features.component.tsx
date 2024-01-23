import { CreatorEvents } from "../../../../utils/character-creation/events.constants";
import {
  CHARACTER_CREATION_BY_SCOPE,
  CharacterCreationData,
  CharacterCreationScope,
  CharacterFaceFeature,
  CharacterHeadOverlay,
} from "../../../../utils/character-creation/model";
import { CustomSlider } from "../slider/slider.component";
import "./character-face-features.component.scss";

export const CharacterFaceFeaturesComponent: React.FC = () => {
  const characterCreationData: CharacterCreationData[] =
    CHARACTER_CREATION_BY_SCOPE(CharacterCreationScope.FACE_FEATURE, true);

  let rpc: any = null;
  if ("rpc" in window && "callClient" in window.rpc) {
    rpc = window.rpc;
  }
  
  function handleSliderChange(value: number, data?: CharacterCreationData) {
    if (rpc && data) {
            const faceFeature: CharacterFaceFeature = {
              id: data.id,
              scale: value,
            } as CharacterFaceFeature;
            rpc.callClient(
              CreatorEvents.CLIENT_CREATOR_SET_FACE_FEATURE,
              JSON.stringify(faceFeature)
            );
        }
  }

  return (
    <div className="character-face-features-container">
      {characterCreationData.map((data: CharacterCreationData) => {
        if (data.maxValue && data.minValue) {
          return (
            <CustomSlider
              title={data.name}
              min={data.minValue}
              max={data.maxValue}
              defaultValue={data.minValue}
              step={0.1}
              data={data}
              onChangeEvent={handleSliderChange}
            />
          );
        }
      })}
    </div>
  );
};
