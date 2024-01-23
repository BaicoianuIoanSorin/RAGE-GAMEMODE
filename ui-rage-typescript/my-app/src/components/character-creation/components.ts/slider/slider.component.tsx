import React, { useEffect, useState } from "react";
import "./slider.component.scss"; // Import your styles here
import {
  CharacterCreationData,
} from "../../../../utils/character-creation/model";

interface SliderProps {
  title: string;
  min: number;
  max: number;
  defaultValue?: number;
  step?: number;
  data?: CharacterCreationData;
  onChangeEvent: (value: number, data?: CharacterCreationData) => void;
  canBeRemoved?: boolean;
}

export const CustomSlider: React.FC<SliderProps> = (props: SliderProps) => {
  const [value, setValue] = useState(props.defaultValue);

  useEffect(() => {
    setValue(props.defaultValue);
  }, [props.defaultValue]);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setValue(newValue);
    props.onChangeEvent(newValue, props.data);
  };

  const handleReset = () => {
    setValue(props.defaultValue);
    props.onChangeEvent(255, props.data);
  };

  return (
    <div className="slider-container">
      <div className="title-reset-container">
        <div className="slider-title">{props.title}</div>
        {props.canBeRemoved && (
          <button onClick={handleReset} className="slider-reset-button">
            Reset
          </button>
        )}
      </div>
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
