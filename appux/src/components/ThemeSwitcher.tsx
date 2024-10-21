// app/components/ThemeSwitcher.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-regular-svg-icons';
import { Tooltip } from "@nextui-org/react";

export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Tooltip
            content="Cambiar Tema"
            delay={0}
            closeDelay={0}
            motionProps={{
                variants: {
                    exit: {
                        opacity: 0,
                        transition: {
                            duration: 0.1,
                            ease: "easeIn",
                        }
                    },
                    enter: {
                        opacity: 1,
                        transition: {
                            duration: 0.15,
                            ease: "easeOut",
                        }
                    },
                },
            }}
        >
            <button className="flex gap-3">
                <FontAwesomeIcon
                    icon={theme === 'dark' ? faSun : faMoon}
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className={`hover:text-gris-20 h-5 transition duration-300 ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                />
            </button>

        </Tooltip>

    );
}