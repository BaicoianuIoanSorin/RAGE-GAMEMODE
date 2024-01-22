import React, { useState } from 'react';
import './slider.component.scss'; // Import your styles here
import { CharacterCreationData } from '../../../../utils/character-creation/model';

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

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(event.target.value);
        setValue(newValue);

        // call client in rage for changings using props.data
    };

    return (
        <div className='slider-container'>
            <div className='slider-title'>{props.title}</div>
            <input
                type='range'
                min={props.min}
                max={props.max}
                value={value}
                step={props.step}
                onChange={handleSliderChange}
                className='slider'
            />
            <div className='slider-value'>{value}</div>
        </div>
    );
};
