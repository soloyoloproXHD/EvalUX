// app/page.tsx
import { Nav } from '../components/Nav';

export default function Home() {


  return (
    <div className="p-3">
      <div className="">
        {/* navegacion */}
        <Nav />
        {/* contenido */}
        <div className='h-screen flex justify-center items-center'>
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
          </div>
        </div>
      </div>
    </div>
  );
}