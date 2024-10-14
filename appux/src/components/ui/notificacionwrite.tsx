'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const Typewriter = dynamic(() => import('typewriter-effect'), { ssr: false });

export const NotificationTypewriter = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Typewriter
                options={{
                    strings: [
                        '<span class="text-xl font-bold text-green-500">¡Rúbrica creada!</span>',
                        '<span class="text-xl font-semibold text-blue-500">Evaluar ahora</span>',
                    ],
                    autoStart: true,
                    loop: true,
                    delay: 75,
                    deleteSpeed: 50,
                }}
            />
        </div>
    );
}

export default NotificationTypewriter;
