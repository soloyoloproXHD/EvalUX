'use client';
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faArrowUpFromBracket, faLock, faPencil } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import foto from '/public/img/avatar.png'; // Ruta absoluta desde la carpeta public
import { AdaptButton } from '../../components/AdaptButton';
import AppInputOut from "../../components/ui/inputOuside";

const page = () => {

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (

        <div className='animate__animated animate__fadeIn'>
            <div className="flex justify-start items-center gap-2 pt-5 ps-10">
                <FontAwesomeIcon icon={faUser} />
                <h2 className="text-2xl font-semibold">Perfil</h2>
            </div>

            <div className="md:flex flex-col justify-center items-center p-6 min-h-full gap-5">
                <div className='flex flex-col justify-center items-center gap-3'>
                    <div className="mt-6">
                        <Image src={foto} alt='' className='h-40 w-40 rounded-full object-cover shadow-lg' />
                    </div>

                    <AdaptButton texto='Seleccionar Imagen' icon={faArrowUpFromBracket}  />

                </div>

                <div className="mt-3 gap-4">
                    <div className="flex space-x-4 mb-8">
                        <AppInputOut
                            type="text"
                            size="md"
                            label="Nombre(s)"
                            name="nombres"
                        />
                        <AppInputOut
                            type="text"
                            size="md"
                            label="Apellido(s)"
                            name="apellidos"
                        />
                    </div>

                    <div className='mb-8'>
                        <AppInputOut
                            type="text"
                            size="md"
                            label="Correo Electrónico"
                            name="apellidos"
                        />
                    </div>

                    <div>
                        <AppInputOut
                            type="text"
                            size="md"
                            label="Fecha de Nacimiento"
                            name="apellidos"
                        />
                    </div>

                    <div className="mt-6 flex justify-end items-center space-x-4">
                        <AdaptButton texto='Actualizar contraseña' icon={faLock} />
                        <AdaptButton texto='Editar datos' icon={faPencil} />
                    </div>
                </div>

            </div>
        </div>

    )
}

export default page
