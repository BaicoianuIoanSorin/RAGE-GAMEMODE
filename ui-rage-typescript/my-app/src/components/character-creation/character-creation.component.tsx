import "./character-creation.component.scss";
import { BoxWithColorsComponent } from "./components.ts/box-with-colors/box-with-colors.component";
import { CharacterOptionComponent } from "./components.ts/character-option/character-option.component";
import { CharacterCreationData } from "./constants";

// TODO maybe make a constant with all CharacterCreationData
export const CharacterCreationComponent: React.FC = () => {

  return (
    <div className="character-creation-container">
      <div className="left-side">
        <BoxWithColorsComponent/>
      </div>
      <div className="right-side">tHIS IS THE RIGHT SIDE</div>
    </div>
  );
};
