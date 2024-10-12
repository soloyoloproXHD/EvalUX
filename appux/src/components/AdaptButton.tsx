import React from 'react';
import { Button } from "@nextui-org/react";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { CustomIcon } from '../components/CustomIcon';


interface AdaptButtonProps {
  texto: string;
  icon?: IconProp;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  redirectUrl?: string;
}

export const AdaptButton: React.FC<AdaptButtonProps> = ({ texto, icon, onClick, redirectUrl }) => {
  const handleRedirect = () => {
    if (redirectUrl) {
      window.location.href = redirectUrl; // Redirige al URL especificado
    }
  };
  return (
    <Button className='custom-adapt-button' variant="bordered" size="sm" onClick={onClick}>
      {icon && <CustomIcon icon={icon} />}
      {texto}
    </Button>
  );
}

export default AdaptButton;