import { CreatorEvents } from "../../../../utils/character-creation/events.constants";
import {
  CHARACTER_CREATION_BY_SCOPE,
  CharacterCreationData,
  CharacterCreationScope,
  CharacterFaceFeature,
  CharacterHeadOverlay,
} from "../../../../utils/character-creation/model";
import { CustomSlider } from "../slider/slider.component";
import "./character-head-overlay.component.scss";

interface CharacterHeadOverlayProps {}

export const CharacterHeadOverlayComponent: React.FC<
  CharacterHeadOverlayProps
> = (props: CharacterHeadOverlayProps) => {
  const characterCreationData: CharacterCreationData[] =
    CHARACTER_CREATION_BY_SCOPE(CharacterCreationScope.HEAD_OVERLAY, true);

  let rpc: any = null;
  if ("rpc" in window && "callClient" in window.rpc) {
    rpc = window.rpc;
  }

  function handleSliderChange(value: number, data?: CharacterCreationData) {
    if (rpc && data) {
      const headOverlay: CharacterHeadOverlay = {
        id: data.id,
        index: value,
        opacity: 1,
        primaryColor: -1,
        secondaryColor: -1,
      } as CharacterHeadOverlay;

      rpc.callClient(
        CreatorEvents.CLIENT_CREATOR_SET_HEAD_OVERLAY,
        JSON.stringify(headOverlay)
      );
    }
  }

  return (
    <div className="character-head-overlay-container">
      {characterCreationData.map((data: CharacterCreationData) => (
        <CustomSlider
          title={data.name}
          min={data.minValue ? data.minValue : 0}
          max={data.maxValue ? data.maxValue : 0}
          defaultValue={-1}
          step={1}
          data={data}
          onChangeEvent={handleSliderChange}
          canBeRemoved={true}
        />
      ))}
    </div>
  );
};
