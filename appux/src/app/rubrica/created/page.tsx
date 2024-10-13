'use client';
import React from "react";
import { faCircleRight } from '@fortawesome/free-solid-svg-icons';
import { AdaptButton } from "@/components/AdaptButton";
import { Input } from "@nextui-org/react";
import { Card, CardBody, Checkbox } from "@nextui-org/react";
import { useTheme } from 'next-themes';
import { useRouter } from "next/navigation";

const Created = () => {
    const { theme } = useTheme();
    const router = useRouter();

    const principles = [
        { id: "usability", label: "Usabilidad" },
        { id: "consistency", label: "Consistencia" },
        { id: "accessibility", label: "Accesibilidad" },
        { id: "userCentered", label: "Centrado en el usuario" },
        { id: "simplicity", label: "Simplicidad" },
    ];

    const handleNext = () => {
        router.push("/rubrica/created1");
    };

    return (
        <div className="py-8 px-12">
            <div className="flex justify-between items-center mb-8">
                <p className="text-2xl font-bold title">Creación de Rubrica</p>
                <div className="flex gap-x-2 px-4">
                    <AdaptButton texto="Siguiente" icon={faCircleRight} onClick={handleNext} />
                </div>
            </div>
            <div className="flex flex-col justify-start px-6 mb-6">
                <div className="flex justify-start items-center">
                    <p className="mb-1 text-xl">Ingrese un nombre para su rubrica</p>
                    {/* <FontAwesomeIcon icon={faPencil} className="ml-2 mb-4" /> */}
                </div>
                <Input type="text" variant="bordered" label="Nombre de la rubrica" className="w-1/4" />
            </div>
            <div className="max-w-full mx-auto p-4">
                <h2 className="text-xl font-bold mb-4">Seleccione los principios UX a evaluar</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {principles.map((principle) => (
                        <Card key={principle.id} className="w-3/4" isHoverable={true}>
                            <CardBody className="flex justify-between px-6">
                                <div className="flex justify-between">
                                    <p className="text-lg">{principle.label}</p>
                                    <Checkbox
                                        defaultSelected={false}
                                        color={theme === 'dark' ? 'primary' : 'success'}
                                        aria-label={`Select ${principle.label}`}
                                        className="ml-2"
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Created;