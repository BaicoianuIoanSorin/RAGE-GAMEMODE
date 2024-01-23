import React from 'react';
import { CharacterCreationData } from '../../../../utils/character-creation/model';
import PBRP_LOGO from '../../../../assets/NEW-PB-LOGO-1.png';
import './box-selected.component.scss';

interface BoxSelectedProps {
    isSelected: boolean;
    image?: string;
    name?: string;
    data?: CharacterCreationData;
}

export const BoxSelectedComponent: React.FC<BoxSelectedProps> = ({ isSelected, data, image, name }) => {
    const containerClass = isSelected ? 'box-selected-container selected' : 'box-selected-container';
    const displayName = data?.name || name;

    return (
        <div className={containerClass}>
            <img 
                src={image || PBRP_LOGO} 
                alt={displayName || 'Default Image'} 
                className='box-selected-image'
            />
            {displayName && <div className='box-selected-value'>{displayName}</div>}
        </div>
    );
}
