import React from 'react';
import { Button } from "@nextui-org/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { CustomIcon } from '../components/CustomIcon';


interface AdaptButtonProps {
  texto: string;
  icon?: IconProp;
  onClick?: () => void;
}

export const AdaptButton: React.FC<AdaptButtonProps> = ({ texto, icon, onClick }) => {
  return (
    <Button className='custom-adapt-button' variant="bordered" size="sm" onClick={onClick}>
      {icon && <CustomIcon icon={icon} />}
      {texto}
    </Button>
  );
}

export default AdaptButton;