import "./character-creation.component.scss";
import { BoxWithColorsComponent } from "./components.ts/box-with-colors/box-with-colors.component";
import { CharacterFaceFeaturesComponent } from "./components.ts/character-face-features/character-face-features.component";

// TODO maybe make a constant with all CharacterCreationData
export const CharacterCreationComponent: React.FC = () => {

  return (
    <div className="character-creation-container">
      <div className="left-side">
        <BoxWithColorsComponent/>
        <CharacterFaceFeaturesComponent/>
      </div>
      <div className="right-side">tHIS IS THE RIGHT SIDE</div>
    </div>
  );
};
