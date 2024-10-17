'use client';
import React, { useState, useEffect, FormEvent } from 'react';
import AdaptButton from '@/components/AdaptButton';
import { faDownLong, faEye, faPlus, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from 'next-themes';
import { Help } from '@/components/ui/help';
import { Image } from '@nextui-org/react';
import { Accordion, AccordionItem } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

type Reporte = {
    id: number;
    nombre: string;
    descripcion: string;
};

export default function IndexEvaluacion() {
    const { theme } = useTheme();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [evaluaciones, setEvaluaciones] = useState<Reporte[] | null>(null);

    useEffect(() => {
        fetchEvaluaciones();
    }, []);

    const fetchEvaluaciones = async () => {
        try {
            const userId = sessionStorage.getItem('userId');
            const response = await fetch('/api/getEvaluaciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                throw new Error('Error al obtener las evaluaciones');
            }

            const data = await response.json();
            setEvaluaciones(data);
        } catch (error) {
            console.error('Error al obtener las evaluaciones: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewEvaluation = (e: FormEvent) => {
        e.preventDefault();
        router.push('/evaluaciones/evaluarIn');
    };

    const renderEvaluaciones = () => {
        if (evaluaciones && evaluaciones.length > 0) {
            return (
                <div className="overflow-y-auto">
                    <Accordion variant="splitted">
                        {evaluaciones.map((evaluacion) => (
                            <AccordionItem
                                key={evaluacion.id}
                                title={evaluacion.nombre}
                                className="py-2 buttoneval mb-4"
                                subtitle={
                                    <span >
                                        click para desplegar
                                    </span>
                                }
                            >
                                <div className="flex justify-between items-center">
                                    <div className="w-1/2 flex">
                                        <p className="ml-4">{evaluacion.descripcion}</p>
                                    </div>
                                    <div className="gap-x-3 flex mr-32">
                                        <AdaptButton texto="Descargar PDF" icon={faDownLong} />
                                        <AdaptButton texto="Ver más" icon={faEye} />
                                    </div>
                                </div>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            );
        }

        return (
            <div className="flex justify-center items-center flex-col p-16">
                <p className="text-xl">No hay evaluaciones realizadas</p>
                <Image
                    src={theme === 'dark' ? '/svg/lupa.svg' : '/svg/ligth_lupa.svg'}
                    alt="No hay rúbricas"
                    className="mt-10"
                />
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl">Cargando...</p>
            </div>
        );
    }

    return (
        <div className="text-white py-12 px-24">
            <div className="flex justify-between items-center mb-5">
                <p className="text-2xl font-bold">Evaluaciones</p>
                <div className="flex gap-x-2">
                    <AdaptButton texto="Nueva evaluación" icon={faPlus} onClick={handleNewEvaluation} />
                    <Help text='Pulse "Nueva evaluación" para iniciar una nueva evaluación' icon={faQuestion} />
                </div>
            </div>
            {renderEvaluaciones()}
        </div>
    );
}
