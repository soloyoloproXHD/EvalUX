'use client';
import React from 'react'
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const Typewriter = dynamic(() => import('typewriter-effect'), { ssr: false });

export const TypewriterC = () => {

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <Typewriter
            options={{
                strings: [
                    '<span class="text-4xl italic text-red-500" >responsivo?</span>',
                    '<span class="text-4xl italic text-green-500">intuitivo?</span>',
                    '<span class="text-4xl italic text-blue-500">consistente?</span>',
                    '<span class="text-4xl italic text-purple-500">accesible?</span>',
                    '<span class="text-4xl italic text-orange-500">fácil de usar?</span>',
                ],
                autoStart: true,
                loop: true,
                delay: 75,
                deleteSpeed: 50,
            }}
        />
    )
}

export default TypewriterC