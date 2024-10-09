'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons'
import { faMoon } from '@fortawesome/free-regular-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { Button } from "@nextui-org/react";
import { useState } from 'react';

import AppModalR from '@/components/ui/modalRegister';


export default function Home() {

  const [darkMode, setDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOPenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-black h-screen p-3">
      <div className="">
        {/* navegacion */}
        <nav className="flex justify-between items-center px-5 py-2">
          {/* logo */}
          <div className="flex justify-start items-center gap-2 text-white">
            <p className=''>logo</p>
            <p className='text-lg font-semibold'>EvalUX</p>
          </div>
          {/* Botones */}
          <div className="flex justify-end items-center gap-2">
            <Button onClick={handleOPenModal} className='border-white text-white' variant="bordered" size="sm">
              Registro
            </Button>

            <Button className='border-white text-white gap-1' variant="bordered" size="sm"
              >
                <FontAwesomeIcon icon={faArrowRightToBracket} className='text-white h-3' />
              Iniciar Sesión
            </Button>

            <FontAwesomeIcon icon={faGithub} className='text-white h-5 hover:text-gris-200 transition duration-300' />

            <FontAwesomeIcon icon={faMoon} onClick={() => setDarkMode(!darkMode)} className='hover:text-gris-200 text-white h-5 transition duration-300' />
            
          </div>
        </nav>
      </div>
      {/*Modal de Registro*/}
      <AppModalR show={isModalOpen} onClose={handleCloseModal}/>
    </div>
  );
}
