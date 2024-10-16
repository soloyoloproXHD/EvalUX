'use client';
import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faArrowUpFromBracket, faLock, faPencil, faSave, faCancel } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import foto from '/public/img/avatar.png'; // Ruta absoluta desde la carpeta public
import { AdaptButton } from '../../components/AdaptButton';
import AppInputOut from "../../components/ui/inputOuside";
import axios from 'axios';
import { toast } from 'react-toastify';

const Page = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profile, setProfile] = useState({
        userId: '',
        nombres: '',
        apellidos: '',
        correoE: '',
        img: '',
        contrasena: '',
        fecha_registro: ''
    });
    async function loadProfile() {
        const datauser = sessionStorage.getItem('user');
        const id = sessionStorage.getItem('userId');

        if (datauser) {
            const parsedUser = JSON.parse(datauser);
            parsedUser.userId = id;
            if (parsedUser.fecha_registro) {
                parsedUser.fecha_registro = formatDate(parsedUser.fecha_registro);
                console.log(parsedUser.fecha_registro);
            }
            setProfile(parsedUser);
        } else {
            console.log('No hay datos de usuario');
            return;
        }
    }

    const [isEditing, setIsEditing] = useState(false);

    const notify = () => toast.success('Datos actualizados exitosamente!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });

    async function handleUpdate() {
        try {
            if (!profile || !profile.userId) {
                console.error('No se encontró información del usuario');
                toast.error('No se encontró información del usuario. Por favor, vuelve a iniciar sesión.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                return;
            }

            const { nombres, apellidos, correoE } = profile;
            if (!nombres || !apellidos || !correoE) {
                toast.error('Por favor, completa todos los campos requeridos.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                return;
            }

            // Crea un objeto FormData
            const formData = new FormData();
            formData.append('id', profile.userId);
            formData.append('nombres', nombres);
            formData.append('apellidos', apellidos);
            formData.append('correoE', correoE);
            formData.append('contrasena', profile.contrasena || '');

            // Adjunta la imagen si se seleccionó una nueva
            if (fileInputRef.current?.files?.[0]) {
                formData.append('img', fileInputRef.current.files[0]);
            }

            console.log('Actualizando perfil:', profile);
            const response = await axios.post('/api/profileUpdate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                const updatedUser = response.data;
                sessionStorage.setItem('user', JSON.stringify(updatedUser));
                setProfile(updatedUser);
                setIsEditing(false);
                notify();
                console.log('Perfil actualizado correctamente');
            } else {
                console.error('Error al actualizar el perfil:', response.data);
                toast.error('Error al actualizar el perfil: ' + response.data, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
        } catch (error) {
            console.error('Error en la solicitud de actualización:', error);
            toast.error('Error al actualizar el perfil. Intenta nuevamente.' + error, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }


    function handleEditToggle() {
        setIsEditing(!isEditing);

        if (isEditing) {
            loadProfile();
        }
    }

    function formatDate(dateString: string | number | Date) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const monthNames = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];
        const month = monthNames[date.getMonth()];
        const day = date.getDate();
        return `${day} de ${month} del ${year}`;
    }

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        loadProfile();
    }, []);

    if (!mounted) {
        return null;
    }
    const handleButtonClick = () => {
        fileInputRef.current?.click();
    }

    return (
        <div className='animate__animated animate__fadeIn'>
            <div className="flex justify-start items-center gap-2 pt-5 ps-10">
                <FontAwesomeIcon icon={faUser} />
                <h2 className="text-2xl font-semibold">Perfil</h2>
            </div>

            <div className="md:flex flex-col justify-center items-center p-6 min-h-full gap-5">
                <form>

                    <div className='flex flex-col justify-center items-center gap-3'>
                        <div className="mt-6">
                            {profile.img ?(
                                <>
                                <Image
                                src={profile.img || foto.src} // usa la propiedad .src si estás importando una imagen
                                alt=''
                                width={160}
                                height={160}
                                className='h-40 w-40 rounded-full object-cover shadow-lg'
                                />
                                </>
                            ): null
                            }
                            

                        </div>
                        {isEditing ? (
                            <>
                                <div>
                                    <input
                                        type="file"
                                        name="img"
                                        id="img"
                                        className='hidden'
                                        ref={fileInputRef}
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const imageUrl = URL.createObjectURL(file);
                                                setProfile({ ...profile, img: imageUrl });
                                            }
                                        }}
                                    />
                                    <AdaptButton texto='Seleccionar Imagen' icon={faArrowUpFromBracket} onClick={handleButtonClick} />
                                </div>
                            </>
                        ) : null}
                    </div>

                    <div className="mt-3 gap-4 mb-5">
                        <div className="flex space-x-4 mb-8">
                            <AppInputOut
                                type="text"
                                size="md"
                                label="Nombre(s)"
                                name="nombres"
                                value={profile.nombres}
                                onChange={(e) => setProfile({ ...profile, nombres: e.target.value })}
                                disabled={!isEditing}
                            />
                            <AppInputOut
                                type="text"
                                size="md"
                                label="Apellido(s)"
                                name="apellidos"
                                value={profile.apellidos}
                                onChange={(e) => setProfile({ ...profile, apellidos: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className='grid grid-cols-2 gap-4 mb-8'>
                            <AppInputOut
                                type="text"
                                size="md"
                                label="Correo Electrónico"
                                name="correoE"
                                value={profile.correoE}
                                onChange={(e) => setProfile({ ...profile, correoE: e.target.value })}
                                disabled={!isEditing}
                            />
                            <AppInputOut
                                type="password"
                                size="md"
                                label="Contraseña"
                                name="contrasena"
                                value={profile.contrasena}
                                onChange={(e) => setProfile({ ...profile, contrasena: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className='mt-10'>
                            <AppInputOut
                                type="text"
                                size="md"
                                label="Fecha de Registro"
                                name="fecha_registro"
                                value={profile.fecha_registro}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="flex justify-end items-center gap-4">
                        {isEditing ? (
                            <>
                                <AdaptButton texto='Cancelar' icon={faCancel} onClick={handleEditToggle} />
                                <AdaptButton texto='Guardar' icon={faSave} onClick={handleUpdate} />
                            </>
                        ) : (
                            <AdaptButton texto='Editar' icon={faPencil} onClick={handleEditToggle} />
                        )}
                    </div>
                </form>

            </div>
        </div>
    );
};

export default Page;