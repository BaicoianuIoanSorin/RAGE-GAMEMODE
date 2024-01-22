import { CHARACTER_CREATION_BY_SCOPE, CharacterCreationData, CharacterCreationScope } from "../../../../utils/character-creation/model";
import { CustomSlider } from "../slider/slider.component";
import "./character-head-blend-overlay.component.scss";

export const CharacterHeadBlendOverlayComponent: React.FC = () => {
    const characterCreationData: CharacterCreationData[] = CHARACTER_CREATION_BY_SCOPE(CharacterCreationScope.HEAD_BLEND_DATA, true);
    
  return (
    <div className="character-head-blend-overlay-container">
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
