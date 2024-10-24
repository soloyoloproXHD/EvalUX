// app/page.tsx
'use client';
import { useState } from "react";
import { Button } from "@nextui-org/react";
import AppModalL from '../components/ui/modalLogIn';
import TypewriterC from '@/components/ui/TypewriterC';


export default function Home() {
  const [isModalLOpen, setIsModalLOpen] = useState(false);
  const handleCloseModalL = () => {
    setIsModalLOpen(false);
  };
  const handleOpenModalL = () => {
    setIsModalLOpen(true);
  };
  return (
    <div className="p-3 overflow-y-hidden">
      <div className="">
        {/* navegacion */}
      
        {/* contenido */}
        <div className='h-screen flex justify-center items-center animate__animated animate__fadeIn'>
          {/* Texto */}
          <div className='flex flex-col justify-center items-start w-1/3 p-10 gap-3 flex-wrap ms-10
                           rounded-lg shadow-lg hover:scale-[102%] 
                          transition duration-300 glowingborder' >
            <div className='text-3xl font-bold'>
              <p className='text-[#2D6086] header2'>La plataforma de</p>
              <p className='text-[#2D6086] header'>evaluación UX moderna</p>
            </div>
            <p className='text-lg font-medium'>
              UXEval es una plataforma integral para la creación de rubricas y la evaluación
              de experiencia de usuario. Permite a los profesionales
              y equipos de UX realizar evaluaciones detalladas, generar
              informes y mejorar la calidad de sus productos digitales.
            </p>
            <div className='flex justify-start items-center w-full mt-5'>
              <Button color="default" className='font-semibold hover:scale-105 transition duration-300' onClick={handleOpenModalL}>
                Comenzar {'>'}
              </Button>
            </div>
          </div>
          <div className='w-1/2 flex justify-center items-center'>
            <div className='font-bold mb-10'>
              <span className='text-[#2D6086] text-4xl mb-5'>Mi proyecto es </span>
              <TypewriterC />
            </div>
          </div>
        </div>
      </div>
      <AppModalL show={isModalLOpen} onClose={handleCloseModalL} />
    </div>
  );
}