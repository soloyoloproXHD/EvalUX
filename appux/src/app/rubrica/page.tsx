'use client'
import React from "react";
import AdaptButton from "@/components/AdaptButton";
import { faPlus, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { Card, CardBody } from "@nextui-org/react";
import { useTheme } from 'next-themes';
import { Help } from "../../components/ui/help";
import { Image } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';


const IndexRubrica = () => {
    const { theme } = useTheme();
    const router = useRouter();
    type Rubrica = {
        title: string;
    };

    const handleCreated = () => {
        router.push("/rubrica/created");
    }

    const rubricas: Rubrica[] = [];
    return (
        <div className="text-white py-8 px-12">
            {/* Encabezado con el título y los botones */}
            <div className="flex justify-between items-center mb-5">
                <p className="text-2xl font-bold">Rúbricas</p>
                <div className="flex gap-x-2">
                        <AdaptButton texto="Nueva rúbrica" icon={faPlus} onClick={handleCreated} />
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
                    <FontAwesomeIcon icon={faBan} className="mt-10 h-40 custom-icon"/>
                </div>
            )}
        </div>
    );
}

export default IndexRubrica;