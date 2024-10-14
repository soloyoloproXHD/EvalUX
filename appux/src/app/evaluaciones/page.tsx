'use client'
import React from "react";
import AdaptButton from "@/components/AdaptButton";
import { faPlus, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from 'next-themes';
import { Help } from "../../components/ui/help";
import { Image } from "@nextui-org/react";
import {Accordion, AccordionItem} from "@nextui-org/react";
import { useRouter } from "next/navigation";


export const IndexEvaluacion = () => {
    const { theme } = useTheme();
    const router = useRouter();
    type Reporte = {
        title: string;
    };

    const evaluaciones: Reporte[] | null = [
        { title: 'X' },
        { title: 'Instagram' },
        { title: 'Minbox' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/evaluaciones/evaluarIn");
    }

    return (
        <div className="text-white py-8 px-12">
            {/* Encabezado con el título y los botones */}
            <div className="flex justify-between items-center mb-5">
                <p className="text-2xl font-bold">Evaluaciones</p>
                <div className="flex gap-x-2">
                    <AdaptButton texto="Nueva evaluación" icon={faPlus} onClick={handleSubmit}/>
                    <Help text='Pulse "Nueva evaluación" para iniciar una nueva evaluación' icon={faQuestion} />
                </div>
            </div>

            {/* Mostrar evaluaciones si es que hay alguna*/}
            {evaluaciones.length > 0 ? (
                    <Accordion variant="splitted">
                        {evaluaciones.map((evaluacion, index) => (
                            <AccordionItem key={index} title={evaluacion.title}>
                                <li className="p-2 flex justify-between items-center">
                                    <p>{evaluacion.title}</p>
                                    <AdaptButton texto="Ver más" />
                                </li>
                            </AccordionItem>
                        ))}
                    </Accordion>
            ) : (
                <div className="flex justify-center items-center flex-col p-16">
                    <p className="text-xl">No hay evaluaciónes realizadas</p>
                    <Image src={theme === 'dark' ? '/svg/lupa.svg' : '/svg/ligth_lupa.svg'} alt="No hay rúbricas" className="mt-10" />
                </div>
            )}
        </div>
    );
}

export default IndexEvaluacion;