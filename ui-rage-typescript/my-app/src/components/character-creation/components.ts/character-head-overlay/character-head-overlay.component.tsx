import { CHARACTER_CREATION_BY_SCOPE, CharacterCreationData, CharacterCreationScope } from "../../../../utils/character-creation/model";
import { CustomSlider } from "../slider/slider.component";
import "./character-head-overlay.component.scss";

export const CharacterHeadOverlayComponent: React.FC = () => {
    const characterCreationData: CharacterCreationData[] = CHARACTER_CREATION_BY_SCOPE(CharacterCreationScope.HEAD_OVERLAY, true);
    
  return (
    <div className="character-head-overlay-container">
      {
          characterCreationData.map((data: CharacterCreationData) => (
                    <CustomSlider
                        title={data.name}
                        min={data.minValue ? data.minValue : 0}
                        max={data.maxValue ? data.maxValue : 0}
                        defaultValue={data.minValue}
                        step={1}
                        data={data}
                    />
                ))
      }
    </div>
  );
};
