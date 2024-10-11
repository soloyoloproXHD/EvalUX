'use client';
import React, { useState, useEffect } from 'react';
import { faArrowRightToBracket, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { AdaptButton } from '../components/AdaptButton';
import { CustomIcon } from '../components/CustomIcon';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Navbar, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link } from '@nextui-org/react';
import Logo from '../../public/img/Logo.png';
import LogoW from '../../public/img/LogoW.png';
import AppModalR from '@/components/ui/modalRegister';
import AppModalL from './ui/modalLogIn';
import Avatar from '../components/ui/avatar';

export const Nav = () => {
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalLOpen, setIsModalLOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const user = useState(true); // Ajusta según tu lógica de autenticación

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleOpenModal = () => {
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

    const menuItems = [
        "Rubricas",
        "Evaluaciones",
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
                    <Image src={theme === 'dark' ? LogoW : Logo} alt="Logo" className='h-7 w-auto' />
                    <p className='text-lg font-semibold mr-4'>EvalUX</p>
                </div>
                <NavbarContent className="hidden sm:flex gap-4" justify="start">
                    <NavbarItem>
                        <Link href="/rubrica/index">Rubricas</Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link color="foreground" href="#">Evaluaciones</Link>
                    </NavbarItem>
                </NavbarContent>
            </NavbarContent>

            <NavbarContent justify="end">
                {!user ? (
                    <>
                        <AdaptButton texto='Registro' icon={faUserPlus} onClick={handleOpenModal} />
                        <AdaptButton texto='Iniciar Sesión' icon={faArrowRightToBracket} onClick={handleOPenModalL}/>
                        <CustomIcon icon={faGithub} size='lg' />
                    </>
                ) : (
                    <>
                        <p>paquita</p>
                        <Avatar src="/img/avatar.png" alt="Avatar Image" />
                    </>
                )}
                <ThemeSwitcher />
            </NavbarContent>

            <NavbarMenu className={`w-full ${isMenuOpen ? "block" : "hidden"} sm:hidden`}>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={index}>
                        <Link
                            color={index === 2 ? "primary" : "foreground"}
                            href="#"
                            className="w-full"
                            size="lg"
                        >
                            {item}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>

            {/* Modal de Registro */}
            <AppModalR show={isModalOpen} onClose={handleCloseModal} />
            {/*Modal de Inicio de Sesión*/}
            <AppModalL show={isModalLOpen} onClose={handleCloseModalL}/>
        </Navbar>
    );
};

export default Nav;
