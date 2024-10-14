import React from 'react';
import { Button } from "@nextui-org/react";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { CustomIcon } from '../components/CustomIcon';
import { motion } from 'framer-motion';

interface AdaptButtonProps {
  texto: string;
  icon?: IconProp;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const AdaptButton: React.FC<AdaptButtonProps> = ({ texto, icon, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1, opacity: 0.9 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Button className='custom-adapt-button' variant="bordered" size="sm" onClick={onClick}>
        {icon && <CustomIcon icon={icon} />}
        {texto}
      </Button>
    </motion.div>
  );
}

export default AdaptButton;
