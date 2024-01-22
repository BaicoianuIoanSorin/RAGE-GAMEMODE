import React from 'react';
import { CharacterCreationData } from '../../../../utils/character-creation/model';
import PBRP_LOGO from '../../../../assets/NEW-PB-LOGO-1.png';
import './box-selected.component.scss';

interface BoxSelectedProps {
    isSelected: boolean;
    data: CharacterCreationData;
}

export const BoxSelectedComponent: React.FC<BoxSelectedProps> = ({ isSelected, data }) => {
    const containerClass = isSelected ? 'box-selected-container selected' : 'box-selected-container';

    return (
        <div className={containerClass}>
            <img src={PBRP_LOGO} alt='logo' className='box-selected-image' />
            <div className='box-selected-value'>{data.name}</div>
        </div>
    );
}
