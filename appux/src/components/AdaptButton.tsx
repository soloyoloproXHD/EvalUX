import React, { useState } from 'react';
import { Button } from "@nextui-org/react";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { CustomIcon } from '../components/CustomIcon';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface AdaptButtonProps {
  texto: string;
  icon?: IconProp;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const AdaptButton: React.FC<AdaptButtonProps> = ({ texto, icon, onClick }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    if (onClick) {
      onClick(event);
    }
    // Simulate async action
    setTimeout(() => setLoading(false), 2000); // Remove this line in real use case
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1, opacity: 0.9 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Button className='custom-adapt-button' variant="bordered" size="sm" onClick={handleClick}>
        {loading ? (
          <FontAwesomeIcon icon={faSpinner} spin />
        ) : (
          <>
            {icon && <CustomIcon icon={icon} />}
            {texto}
          </>
        )}
      </Button>
    </motion.div>
  );
}

export default AdaptButton;