import React from "react";

export const Dashboard = () => {
    return (
        <>
          {/* Texto */}
          <div className='flex flex-col justify-center items-start w-1/3 p-10 gap-3 flex-wrap'>
            <div className='text-xl font-bold'>
              <p className='text-[#2D6086]'>La plataforma de</p>
              <p className='text-[#2D6086]'>evaluación UX moderna</p>
            </div>
            <p>
              UXEval es una plataforma integral para la evaluación 
              de experiencia de usuario. Permite a los profesionales 
              y equipos de UX realizar evaluaciones detalladas, generar 
              informes y mejorar la calidad de sus productos digitales.
            </p>
          </div>
          {/* Table */}
          <div className='p-5 w-2/3'>
            <table className="table-auto border-collapse border border-gray-400">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Criterio</th>
                  <th className="border border-gray-300 px-4 py-2">Descripción</th>
                  <th className="border border-gray-300 px-4 py-2">Puntuación</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Funcionalidad</td>
                  <td className="border border-gray-300 px-4 py-2">El software cumple con los requisitos funcionales especificados.</td>
                  <td className="border border-gray-300 px-4 py-2">0-10</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Usabilidad</td>
                  <td className="border border-gray-300 px-4 py-2">El software es fácil de usar y entender.</td>
                  <td className="border border-gray-300 px-4 py-2">0-10</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Rendimiento</td>
                  <td className="border border-gray-300 px-4 py-2">El software funciona de manera eficiente y rápida.</td>
                  <td className="border border-gray-300 px-4 py-2">0-10</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Seguridad</td>
                  <td className="border border-gray-300 px-4 py-2">El software protege los datos y la privacidad del usuario.</td>
                  <td className="border border-gray-300 px-4 py-2">0-10</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Mantenimiento</td>
                  <td className="border border-gray-300 px-4 py-2">El software es fácil de mantener y actualizar.</td>
                  <td className="border border-gray-300 px-4 py-2">0-10</td>
                </tr>
              </tbody>
            </table>

          {/* Botones */}
            {/*<div className="flex justify-end items-center gap-2">
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
            */}

          </div>
        </>
    );
}