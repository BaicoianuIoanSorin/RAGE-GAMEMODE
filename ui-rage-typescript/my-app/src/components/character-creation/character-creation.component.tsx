import "./character-creation.component.scss";
import { BoxWithColorsComponent } from "./components.ts/box-with-colors/box-with-colors.component";
import { CharacterFaceFeaturesComponent } from "./components.ts/character-face-features/character-face-features.component";
import { CharacterHeadOverlayComponent } from "./components.ts/character-head-overlay/character-head-overlay.component";

export const CharacterCreationComponent: React.FC = () => {

  return (
    <div className="character-creation-container">
      <div className="left-side">
        <BoxWithColorsComponent/>
        <CharacterFaceFeaturesComponent/>
      </div>
      <div className="right-side">
        <CharacterHeadOverlayComponent/>
      </div>
    </div>
  );
};
