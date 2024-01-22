import { CHARACTER_CREATION_BY_SCOPE, CharacterCreationData, CharacterCreationScope } from "../../../../utils/character-creation/model";
import { CustomSlider } from "../slider/slider.component";
import "./character-face-features.component.scss";

export const CharacterFaceFeaturesComponent: React.FC = () => {
    const characterCreationData: CharacterCreationData[] = CHARACTER_CREATION_BY_SCOPE(CharacterCreationScope.FACE_FEATURE, true);

  return (
    <div className="character-face-features-container">
      {
          characterCreationData.map((data: CharacterCreationData) => {
            if(data.maxValue && data.minValue) {
                return (
                    <CustomSlider
                        title={data.name}
                        min={data.minValue}
                        max={data.maxValue}
                        defaultValue={data.minValue}
                        step={0.1}
                        data={data}
                    />
                )
            }
          })
      }
    </div>
  );
};
