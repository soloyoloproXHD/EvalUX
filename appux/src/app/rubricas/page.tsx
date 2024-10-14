'use client';
import React, { useState, useEffect } from 'react';
import Logo from '../../../public/img/Logo.png';
import LogoW from '../../../public/img/LogoW.png';
import Image from 'next/image';
import { useTheme } from 'next-themes';

const Page = () => {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div>
            <nav className='flex justify-between items-center p-5'>
                <Image src={theme === 'dark' ? LogoW : Logo} alt="Logo" className='h-7 w-auto' />
            </nav>
        </div>
    );
};

export default Page;