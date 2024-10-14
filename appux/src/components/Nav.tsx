'use client';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket, faUserPlus, faTableList, faClipboardList, faPerson } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { AdaptButton } from '../components/AdaptButton';
import { CustomIcon } from '../components/CustomIcon';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Navbar, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from '@nextui-org/react';
import Link from 'next/link';
import Logo from '../../public/img/Logo.png';
import LogoW from '../../public/img/LogoW.png';
import AppModalR from '@/components/ui/modalRegister';
import AppModalL from './ui/modalLogIn';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Avatar as NextAvatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';


export const Nav = () => {
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalLOpen, setIsModalLOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Nuevo estado para autenticación
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const token = sessionStorage.getItem('token');
        console.log('Token', token);
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('token'); // Elimina el token al cerrar sesión
        setIsAuthenticated(false); // Cambia el estado a no autenticado
        router.push('/'); // Redirige al inicio
    };

    // Simulación de usuario (null para no autenticado)
    const user = { name: 'Usuario', photoURL: '/img/avatar.png' };

    // const user = null;


    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };
    const handleOpenModalL = () => {
        setIsModalLOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const handleCloseModalL = () => {
        setIsModalLOpen(false);
    };

    const handleRedirect = () => {
        if (mounted) {
            redirect("/");
        }
    };

    const handlePerfil = () => {
        router.push('/perfil');
    }

    const menuItems = [
        "Rubricas",
        "Evaluaciones",
        'Perfil',
        "Configuraciones",
        "Cerrar Sesión"
    ];

    return (
        <Navbar onMenuOpenChange={setIsMenuOpen} className="animate__animated animate__fadeIn" maxWidth='full'>
            <NavbarContent justify="start">
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <div className="flex justify-start items-center gap-2 text-white">
                    <Image src={theme === 'dark' ? LogoW : Logo} alt="Logo" className='h-7 w-auto' onClick={handleRedirect} />
                    {!isAuthenticated ?
                        <p className='text-lg font-semibold mr-4' onClick={handleRedirect}>EvalUX</p> :
                        null
                    }
                </div>
                {isAuthenticated ? (
                    <NavbarContent className="hidden sm:flex gap-4" justify="start">
                        <NavbarItem>
                            <FontAwesomeIcon icon={faTableList} className='me-1' />
                            <Link href="/rubrica">Rubricas</Link>
                        </NavbarItem>
                        <NavbarItem>
                            <FontAwesomeIcon icon={faClipboardList} className='me-1' />
                            <Link href="/evaluaciones">Evaluaciones</Link>
                        </NavbarItem>
                    </NavbarContent>
                ) : null}
            </NavbarContent>

            <NavbarContent justify="end">
                {!isAuthenticated ?
                    <>
                        <AdaptButton texto='Registro' icon={faUserPlus} onClick={handleOpenModal} />
                        <AdaptButton texto='Iniciar Sesión' icon={faArrowRightToBracket} onClick={handleOpenModalL} />
                        <CustomIcon icon={faGithub} size='lg' />
                    </>
                    :
                    <>
                        <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                                <NextAvatar src={user?.photoURL || "/img/avatar.png"} alt="Avatar image" />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Profile Actions" variant="flat">
                                <DropdownItem key="perfil" color="primary" className='flex justify-center items-center' onClick={handlePerfil}>
                                    <FontAwesomeIcon icon={faPerson} className='hover:bounce text-white mr-2' />
                                    Perfil
                                </DropdownItem>
                                <DropdownItem key="logout" color="danger" className='flex justify-center items-center' onClick={handleLogout}>
                                    <FontAwesomeIcon icon={faArrowRightToBracket} className='hover:bounce text-white mr-2' />
                                    Cerrar sesión
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        {/* <Avatar src={user?.photoURL || "/img/avatar.png"} alt="Avatar Image" /> */}
                        {/* <button >Cerrar Sesión</button> */}
                    </>
                }

                <ThemeSwitcher />
            </NavbarContent>

            <NavbarMenu className={`w-full ${isMenuOpen ? "block" : "hidden"} sm:hidden`}>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={index}>
                        <Link href="#" className="w-full">
                            {item}
                        </Link>
                    </NavbarMenuItem>

                ))}
            </NavbarMenu>

            <AppModalR show={isModalOpen} onClose={handleCloseModal} />
            <AppModalL show={isModalLOpen} onClose={handleCloseModalL} />
        </Navbar>
    );
};

export default Nav;
