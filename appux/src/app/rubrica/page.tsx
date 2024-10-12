'use client'
import React from "react";
import AdaptButton from "@/components/AdaptButton";
import CustomIcon from "@/components/CustomIcon";
import { faPlus, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { Card, CardBody } from "@nextui-org/react";
import { useTheme } from 'next-themes';
import { Help } from "../../components/ui/help";
import { Image } from "@nextui-org/react";
import Link from "next/link";

export const IndexRubrica = () => {
    const { theme } = useTheme();
    type Rubrica = {
        title: string;
    };




    const rubricas: Rubrica[] | null = [
        { title: 'Rubrica enfocada a lo visual' },
        { title: 'Rubrica con peso en la Accesibilidad' },
        { title: 'Rubrica con requerimientos' },
    ];

    // const rubricas: Rubrica[] = [];
    return (
        <div className="text-white py-8 px-12">
            {/* Encabezado con el título y los botones */}
            <div className="flex justify-between items-center mb-5">
                <p className="text-2xl font-bold">Rúbricas</p>
                <div className="flex gap-x-2">
                    <Link href={"/rubrica/created"}>
                        <AdaptButton texto="Nueva rúbrica" icon={faPlus} />
                    </Link>
                    <Help text='Pulse "Nueva rúbrica" para crear una rúbrica' icon={faQuestion} />
                </div>
            </div>

            {/* Mostrar contenido según si hay rúbricas o no */}
            {rubricas.length > 0 ? (
                <ul>
                    {rubricas.map((rubrica, index) => (
                        <Card key={index} className="my-4" isHoverable={true} allowTextSelectionOnPress={true}>
                            <CardBody>
                                <li className="p-2 flex justify-between items-center">
                                    <p>{rubrica.title}</p>
                                    <AdaptButton texto="Ver más..." />
                                </li>
                            </CardBody>
                        </Card>
                    ))}
                </ul>
            ) : (
                <div className="flex justify-center items-center flex-col p-16">
                    <p className="text-xl">No hay rúbricas creadas</p>
                    <Image src={theme === 'dark' ? '/svg/lupa.svg' : '/svg/ligth_lupa.svg'} alt="No hay rúbricas" className="mt-10" />
                </div>
            )}
        </div>
    );
}

export default IndexRubrica;