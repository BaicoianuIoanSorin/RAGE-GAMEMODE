import "./character-creation.component.scss";
import { BoxWithColorsComponent } from "./components.ts/box-with-colors/box-with-colors.component";
import { CharacterFaceFeaturesComponent } from "./components.ts/character-face-features/character-face-features.component";
import { CharacterHeadBlendOverlayComponent } from "./components.ts/character-head-blend-overlay/character-head-blend-overlay.component";
import { CharacterHeadOverlayComponent } from "./components.ts/character-head-overlay/character-head-overlay.component";
import { HairStyleComponent } from "./components.ts/hairstyle/hairstyle.component";

export const CharacterCreationComponent: React.FC = () => {

  return (
    <div className="character-creation-container">
      <div className="left-side">
        <HairStyleComponent/>
        <BoxWithColorsComponent/>
        <CharacterFaceFeaturesComponent/>
      </div>
      <div className="right-side">
        <CharacterHeadBlendOverlayComponent/>
        <CharacterHeadOverlayComponent/>
      </div>
    </div>
  );
};
