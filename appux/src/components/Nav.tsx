"use client";
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket, faUserPlus, faTableList, faClipboardList } from '@fortawesome/free-solid-svg-icons';
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
import Avatar from '../components/ui/avatar';
import { redirect } from 'next/navigation';

export const Nav = () => {
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalLOpen, setIsModalLOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Simulación de usuario (null para no autenticado)
    const user = { name: 'Usuario', photoURL: '/img/avatar.png' };

    useEffect(() => {
        setMounted(true);
    }, []);
    const handleOPenModal = () => {
        setIsModalOpen(true);
    };
    const handleOPenModalL = () => {
        setIsModalLOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const handleCloseModalL = () => {
        setIsModalLOpen(false);
    };
    if (!mounted) {
        return null;
    }

    const handleRedirect = () => {
        if (mounted) {
            redirect("/");
        }
    };

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
                {/* Redirección en el logo usando redirect */}
                <div
                    className="flex justify-start items-center gap-2 text-white"
                // Redirección directa usando `redirect`
                >
                    <Image src={theme === 'dark' ? LogoW : Logo} alt="Logo" className='h-7 w-auto' onClick={handleRedirect} />
                    <p className='text-lg font-semibold mr-4' onClick={handleRedirect}>EvalUX</p>
                </div>
                {user ? (
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
                {/* {!user ? ( */}
                <>
                    <AdaptButton texto='Registro' icon={faUserPlus} onClick={handleOPenModal} />
                    <AdaptButton texto='Iniciar Sesión' icon={faArrowRightToBracket} onClick={handleOPenModalL} />
                    <CustomIcon icon={faGithub} size='lg' />
                </>
                {/* ) : ( */}
                <>
                    {/* <p>{user?.displayName || 'Usuario'}</p> */}
                    <Avatar src={user?.photoURL || "/img/avatar.png"} alt="Avatar Image" />
                </>
                {/* )} */}

                <ThemeSwitcher />
            </NavbarContent>

            <NavbarMenu className={`w-full ${isMenuOpen ? "block" : "hidden"} sm:hidden`}>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={index}>
                        <Link
                            href="#"
                            className="w-full"
                        >
                            {item}
                        </Link>
                    </NavbarMenuItem>

                ))}
            </NavbarMenu>

            {/* Modal de Registro */}
            <AppModalR show={isModalOpen} onClose={handleCloseModal} />
            {/* Modal de Inicio de Sesión */}
            <AppModalL show={isModalLOpen} onClose={handleCloseModalL} />
        </Navbar>

    );
};

export default Nav;
