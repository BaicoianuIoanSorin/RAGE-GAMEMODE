import { useEffect, useState } from "react";
import { CharacterHairStyleComponentInformation } from "../../utils/character-creation/model";
import "./character-creation.component.scss";
import { BlendOverlayChangingColorsComponent } from "./components.ts/blend-overlay-changing-colors/blend-overlay-changing-colors.component";
import { CharacterFaceFeaturesComponent } from "./components.ts/character-face-features/character-face-features.component";
import { CharacterHeadBlendOverlayComponent } from "./components.ts/character-head-blend-overlay/character-head-blend-overlay.component";
import { CharacterHeadOverlayComponent } from "./components.ts/character-head-overlay/character-head-overlay.component";
import { EyeChangingColorComponent } from "./components.ts/eye-changing-color/eye-changing-color.component";
import { HairStyleComponent } from "./components.ts/hairstyle/hairstyle.component";
import { CreatorEvents } from "../../utils/character-creation/events.constants";
import { CANCELLED } from "dns";
import { allowedNodeEnvironmentFlags } from "process";

export const CharacterCreationComponent: React.FC = () => {
  const [resetKey, setResetKey] = useState(0); // Added a reset key
  const [showTooltip, setShowTooltip] = useState(true);

  let rpc: any = null;
  if ("rpc" in window && "callClient" in window.rpc) {
    rpc = window.rpc;
  }
  // variables for showing the button save
  // left side
  const [
    isEyeColorComponentInformationFilled,
    setIsEyeColorComponentInformationFilled,
  ] = useState<boolean>(false);
  const [
    characterHairStyleComponentInformation,
    setCharacterHairStyleComponentInformation,
  ] = useState<CharacterHairStyleComponentInformation>();
  const [
    isBlendOverlayChangingColorsComponentInformationFilled,
    setIsBlendOverlayChangingColorsComponentInformationFilled,
  ] = useState<boolean>(false);
  const [
    isCharacterFaceFeaturesComponentInformationFilled,
    setIsCharacterFaceFeaturesComponentInformationFilled,
  ] = useState<boolean>(false);

  // right side
  const [
    isCharacterHeadBlendOverlayComponentInformationFilled,
    setIsCharacterHeadBlendOverlayComponentInformationFilled,
  ] = useState<boolean>(false);
  const [
    isCharacterHeadOverlayComponentInformationFilled,
    setIsCharacterHeadOverlayComponentInformationFilled,
  ] = useState<boolean>(false);

  const onChangeCharacterHairStyteComponentInformation = (
    newCharacterHairSyleComponentInformation: CharacterHairStyleComponentInformation
  ) => {
    console.log(newCharacterHairSyleComponentInformation);

    if (characterHairStyleComponentInformation?.gender !== newCharacterHairSyleComponentInformation?.gender) {
      setResetKey((prevKey) => prevKey + 1);
      onChangeBlendOverlayChangingColorsComponentInformation(false);
    }

    setCharacterHairStyleComponentInformation(
      newCharacterHairSyleComponentInformation
    );
  };

  const onChangeEyeColorComponentInformation = (
    isEyeColorComponentInformationFilled: boolean
  ) => {
    setIsEyeColorComponentInformationFilled(
      isEyeColorComponentInformationFilled
    );
  };

  const onChangeBlendOverlayChangingColorsComponentInformation = (
    isBlendOverlayChangingColorsComponentInformationFilled: boolean
  ) => {
    setIsBlendOverlayChangingColorsComponentInformationFilled(
      isBlendOverlayChangingColorsComponentInformationFilled
    );
  };

  const onChangeCharacterFaceFeaturesComponentInformation = (
    isCharacterFaceFeaturesComponentInformationFilled: boolean
  ) => {
    setIsCharacterFaceFeaturesComponentInformationFilled(
      isCharacterFaceFeaturesComponentInformationFilled
    );
  };

  const onChangeCharacterHeadBlendOverlayComponentInformation = (
    isCharacterHeadBlendOverlayComponentInformationFilled: boolean
  ) => {
    setIsCharacterHeadBlendOverlayComponentInformationFilled(
      isCharacterHeadBlendOverlayComponentInformationFilled
    );
  };

  const onChangeCharacterHeadOverlayComponentInformation = (
    isCharacterHeadOverlayComponentInformationFilled: boolean
  ) => {
    setIsCharacterHeadOverlayComponentInformationFilled(
      isCharacterHeadOverlayComponentInformationFilled
    );
  };

  function onClickSaveButton() {
    if (rpc) {
      const response = rpc.callClient(
        CreatorEvents.CLIENT_SAVE_CHARACTER_DATA_TO_DATABASE
      );
    } else {
      alert(`${CreatorEvents.CLIENT_SAVE_CHARACTER_DATA_TO_DATABASE} called`);
    }
  }

  function isButtonDisabled() {
    return (
      !isEyeColorComponentInformationFilled ||
      !characterHairStyleComponentInformation ||
      !isBlendOverlayChangingColorsComponentInformationFilled ||
      !isCharacterFaceFeaturesComponentInformationFilled ||
      !isCharacterHeadBlendOverlayComponentInformationFilled ||
      !isCharacterHeadOverlayComponentInformationFilled
    );
  }

  // TODO add such that when the gender changes every component is reinitiliazed
  return (
    <div className="character-creation-container">
      <div className="left-side">
        <EyeChangingColorComponent
          onChangeEvent={onChangeEyeColorComponentInformation}
        />
        <HairStyleComponent
          onChangeEvent={onChangeCharacterHairStyteComponentInformation}
        />
        <BlendOverlayChangingColorsComponent
          onChangeEvent={onChangeBlendOverlayChangingColorsComponentInformation}
        />
        <CharacterFaceFeaturesComponent
          onChangeEvent={onChangeCharacterFaceFeaturesComponentInformation}
        />
      </div>
      <div className="middle-side">
        <div
          className="tooltip-container"
          onMouseEnter={() => isButtonDisabled() && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <button disabled={isButtonDisabled()} onClick={onClickSaveButton}>
            Save
          </button>
          {isButtonDisabled() && showTooltip && (
            <div className="tooltip">
              All character creation data has to be filled in order to save the
              character
            </div>
          )}
        </div>
      </div>
      <div className="right-side">
        <div key={resetKey}>
          <CharacterHeadBlendOverlayComponent
            onChangeEvent={
              onChangeCharacterHeadBlendOverlayComponentInformation
            }
          />
        </div>
        <CharacterHeadOverlayComponent
          onChangeEvent={onChangeCharacterHeadOverlayComponentInformation}
        />
      </div>
    </div>
  );
};
