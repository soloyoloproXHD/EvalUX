import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core';

interface CustomIconProps {
    icon?: IconProp;
    size?: SizeProp;
}

export const CustomIcon: React.FC<CustomIconProps> = ({ icon, size }) => {

    return (
        <div>
            {icon && <FontAwesomeIcon icon={icon} size={size} className='custom-icon text-white hover:text-gris-600 transition duration-300' />}
        </div>
    )
}

export default CustomIcon