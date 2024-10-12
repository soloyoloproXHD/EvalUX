'use client';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket, faUserPlus, faMoon } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { AdaptButton } from '../components/AdaptButton';
import { CustomIcon } from '../components/CustomIcon';
import Logo from '../../public/img/Logo.png';
import LogoW from '../../public/img/LogoW.png';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import AppModalR from '@/components/ui/modalRegister';


export const Nav = () => {
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // useEffect(() => {
    //     setMounted(true);
    // }, []);

    // if (!mounted) {
    //     return null;
    // }

    const handleOPenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <nav className="flex justify-between items-center px-5 py-2 animate__animated animate__fadeIn">
            {/* logo */}
            <div className="flex justify-start items-center gap-2 text-white">
                <Image src={theme === 'dark' ? LogoW : Logo} alt="Logo" className='h-9 w-auto' />
                <p className='text-xl font-semibold'>EvalUX</p>
            </div>
            {/* Botones */}
            <div className="flex justify-end items-center gap-3">
                <AdaptButton texto='Registro' icon={faUserPlus} onClick={handleOPenModal} />
                <AdaptButton texto='Iniciar Sesión' icon={faArrowRightToBracket} />
                <CustomIcon icon={faGithub} size='lg' />
                <ThemeSwitcher />
            </div>
            {/*Modal de Registro*/}
            <AppModalR show={isModalOpen} onClose={handleCloseModal} />


        </nav>
    );
}

export default Nav;