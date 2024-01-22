import { CharacterCreationData } from "../../constants";
import { BoxWithColorsComponent } from "../box-with-colors/box-with-colors.component";
import { CustomSlider } from "../slider/slider.component";
import "./character-option.component.scss";

interface CharacterCreationComponentProps {
  title: string;
  min: number;
  max: number;
  defaultValue?: number;
  step?: number;
  data: CharacterCreationData;
}
export const CharacterOptionComponent: React.FC<CharacterCreationComponentProps> = (props: CharacterCreationComponentProps) => {
  return (
    <div className="character-option-container">
      <CustomSlider
        title={props.title}
        min={props.min}
        max={props.max}
        defaultValue={props.defaultValue}
        step={props.step}
        data={props.data}
      />
    </div>
  );
};
