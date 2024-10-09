// app/components/ThemeSwitcher.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-regular-svg-icons';

export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex gap-3">
            <FontAwesomeIcon 
                icon={theme === 'dark' ? faSun : faMoon} 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
                className={`hover:text-gris-20 h-5 transition duration-300 ${theme === 'dark' ? 'text-white' : 'text-black'}`} 
            />
        </div>
    );
}