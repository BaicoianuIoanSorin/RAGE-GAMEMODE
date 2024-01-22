import React, { useState } from "react";
import "./slider.component.scss"; // Import your styles here
import { CharacterCreationData, CharacterFaceFeature } from "../../../../utils/character-creation/model";
import { CreatorEvents } from "../../../../utils/character-creation/events.constants";

interface SliderProps {
  title: string;
  min: number;
  max: number;
  defaultValue?: number;
  step?: number;
  data: CharacterCreationData;
}

export const CustomSlider: React.FC<SliderProps> = (props: SliderProps) => {
  const [value, setValue] = useState(props.defaultValue);

  let rpc: any = null;
  if ("rpc" in window && "callClient" in window.rpc) {
    rpc = window.rpc;
  }

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setValue(newValue);

    if (rpc) {
        const faceFeature: CharacterFaceFeature = {
            id: props.data.id,
            scale: newValue,
        } as CharacterFaceFeature;
        rpc.callClient(CreatorEvents.CLIENT_CREATOR_SET_FACE_FEATURE, JSON.stringify(faceFeature));
      }
  };

  return (
    <div className="slider-container">
      <div className="slider-title">{props.title}</div>
      <input
        type="range"
        min={props.min}
        max={props.max}
        value={value}
        step={props.step}
        onChange={handleSliderChange}
        className="slider"
      />
      <div className="slider-value">{value}</div>
    </div>
  );
};
