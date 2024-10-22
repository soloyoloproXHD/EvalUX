'use client';
import React, { useEffect, useState, useRef, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faArrowUpFromBracket, faPencil, faSave, faCancel } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import foto from '/public/img/avatar.png';
import { AdaptButton } from '../../components/AdaptButton';
import AppInputOut from '../../components/ui/inputOuside';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Profile {
    userId: string;
    nombres: string;
    apellidos: string;
    correoE: string;
    img: string;
    contrasena: string;
    fecha_registro: string;
}

const Page: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profile, setProfile] = useState<Profile>({
        userId: '',
        nombres: '',
        apellidos: '',
        correoE: '',
        img: '',
        contrasena: '',
        fecha_registro: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [imgTemp, setImgTemp] = useState<string | null>(null);

    const notify = (message: string, isError = false) => {
        const config = {
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        };

        return isError ? toast.error(message, config) : toast.success(message, config);
    };

    const loadProfile = async () => {
        const datauser = sessionStorage.getItem('user');
        const id = sessionStorage.getItem('userId');

        if (datauser && id) {
            const parsedUser: Profile = JSON.parse(datauser);
            parsedUser.userId = id;

            if (parsedUser.fecha_registro) {
                parsedUser.fecha_registro = formatDate(parsedUser.fecha_registro);
            }

            // Si la imagen está en base64, añade el prefijo adecuado
            if (parsedUser.img) {
                parsedUser.img = `data:image/png;base64,${parsedUser.img}`; // Cambia 'png' según el formato de la imagen original
            }

            setProfile(parsedUser);
        } else {
            console.log('No hay datos de usuario');
        }
    };


    const handleUpdate = async () => {
        if (!profile || !profile.userId) {
            notify('No se encontró información del usuario. Por favor, vuelve a iniciar sesión.', true);
            return;
        }

        const { nombres, apellidos, correoE } = profile;
        if (!nombres || !apellidos || !correoE) {
            notify('Por favor, completa todos los campos requeridos.', true);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('id', profile.userId);
            formData.append('nombres', nombres);
            formData.append('apellidos', apellidos);
            formData.append('correoE', correoE);
            formData.append('contrasena', profile.contrasena || '');

            if (fileInputRef.current?.files?.[0]) {
                formData.append('img', fileInputRef.current.files[0]);
            }

            const response = await axios.post('/api/profileUpdate', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 200) {
                const updatedUser: Profile = response.data;
                sessionStorage.setItem('user', JSON.stringify(updatedUser));
                setProfile(updatedUser);
                setImgTemp(null); // Limpiar la previsualización temporal
                setIsEditing(false);
                notify('Datos actualizados exitosamente!');
                window.location.reload(); // Recargar la página
            } else {
                notify(`Error al actualizar el perfil: ${response.data}`, true);
            }
        } catch (error) {
            notify('Error al actualizar el perfil. Intenta nuevamente.', true);
            console.error('Error en la solicitud de actualización:', error);
        }
    };


    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (isEditing) {
            loadProfile();
        }
    };

    const formatDate = (dateString: string | number | Date) => {
        const date = new Date(dateString);
        const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        return `${date.getDate()} de ${monthNames[date.getMonth()]} del ${date.getFullYear()}`;
    };


    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImgTemp(imageUrl); // Mostrar la previsualización temporal
            setProfile({ ...profile, img: imageUrl });
        }
    };

    useEffect(() => {
        setMounted(true);
        loadProfile();
    }, []);

    if (!mounted) return null;

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
                            <Image
                                src={imgTemp || (profile?.img ? profile.img : foto.src)}
                                alt='Perfil'
                                width={160}
                                height={160}
                                className='h-40 w-40 rounded-full object-cover shadow-lg'
                            />
                        </div>
                        {isEditing && (
                            <>
                                <input
                                    type="file"
                                    name="img"
                                    id="img"
                                    className='hidden'
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                <AdaptButton texto='Seleccionar Imagen' icon={faArrowUpFromBracket} onClick={() => fileInputRef.current?.click()} />
                            </>
                        )}
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
                        <AppInputOut
                            type="text"
                            size="md"
                            label="Fecha de Registro"
                            name="fecha_registro"
                            value={profile.fecha_registro}
                            disabled
                        />
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
