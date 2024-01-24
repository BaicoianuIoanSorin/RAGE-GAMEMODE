import "./character-creation.component.scss";
import { BlendOverlayChangingColorsComponent } from "./components.ts/blend-overlay-changing-colors/blend-overlay-changing-colors.component";
import { CharacterFaceFeaturesComponent } from "./components.ts/character-face-features/character-face-features.component";
import { CharacterHeadBlendOverlayComponent } from "./components.ts/character-head-blend-overlay/character-head-blend-overlay.component";
import { CharacterHeadOverlayComponent } from "./components.ts/character-head-overlay/character-head-overlay.component";
import { EyeChangingColorComponent } from "./components.ts/eye-changing-color/eye-changing-color.component";
import { HairStyleComponent } from "./components.ts/hairstyle/hairstyle.component";

export const CharacterCreationComponent: React.FC = () => {


  // TODO add such that when the gender changes every component is reinitiliazed
  return (
    <div className="character-creation-container">
      <div className="left-side">
        <EyeChangingColorComponent/>
        <HairStyleComponent/>
        <BlendOverlayChangingColorsComponent/>
        <CharacterFaceFeaturesComponent/>
      </div>
      <div className="right-side">
        <CharacterHeadBlendOverlayComponent/>
        <CharacterHeadOverlayComponent/>
      </div>
    </div>
  );
};
