import { CHARACTER_CREATION_FACE_FEATURES, CharacterCreationData } from "../../../../utils/character-creation/model";
import { CustomSlider } from "../slider/slider.component";
import "./character-face-features.component.scss";

export const CharacterFaceFeaturesComponent: React.FC = () => {
    const characterCreationData: CharacterCreationData[] = CHARACTER_CREATION_FACE_FEATURES();

  let rpc: any = null;
  if ("rpc" in window && "callClient" in window.rpc) {
    rpc = window.rpc;
  }
  return (
    <div className="character-option-container">
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
