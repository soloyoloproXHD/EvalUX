"use client"
import React, { useEffect, useState } from 'react';
import { Card, CardBody, Button } from "@nextui-org/react";
import { X, Edit, Plus } from 'lucide-react';
import Link from 'next/link';
import { AdaptButton } from "@/components/AdaptButton";
import { faCircleRight } from '@fortawesome/free-solid-svg-icons';

interface Principle {
    id: string;
    name: string;
    subPrinciples: { id: string; name: string }[];
}

const initialPrinciples: Principle[] = [
    {
        id: "usability",
        name: "Usabilidad",
        subPrinciples: [
            { id: "satisfaction", name: "Satisfacción del usuario" },
            { id: "clarity", name: "Claridad de la interfaz" },
            { id: "learnability", name: "Facilidad de aprendizaje" },
        ],
    },
    {
        id: "accessibility",
        name: "Accesibilidad",
        subPrinciples: [
            { id: "perceivable", name: "Perceptible" },
            { id: "operable", name: "Operable" },
            { id: "understandable", name: "Comprensible" },
        ],
    },
    {
        id: "simplicity",
        name: "Simplicidad",
        subPrinciples: [
            { id: "interfaceClarity", name: "Claridad de la interfaz" },
            { id: "minimalism", name: "Minimalismo de la interfaz" },
        ],
    },
    {
        id: "consistency",
        name: "Consistencia",
        subPrinciples: [
            { id: "visualConsistency", name: "Consistencia visual" },
        ],
    },
    {
        id: "userCentered",
        name: "Centrado en el usuario",
        subPrinciples: [
            { id: "empathy", name: "Empatía con el usuario" },
            { id: "security", name: "Seguridad" },
        ],
    },
];

export default function UXPrinciplesEvaluator() {
    const [data, setData] = useState({ //guardado de created info
        nombreR: "",
        selectedP: []
    });

    useEffect(() => { //Obtenci+on de pestaña created
        const savedData = sessionStorage.getItem('principiosData');
        if (savedData) {
            setData(JSON.parse(savedData));
        }
    }, [])
    
    const [principles, setPrinciples] = useState<Principle[]>(initialPrinciples);

    const handleRemove = (principleId: string, subPrincipleId: string) => {
        setPrinciples(principles.map(principle =>
            principle.id === principleId
                ? { ...principle, subPrinciples: principle.subPrinciples.filter(sp => sp.id !== subPrincipleId) }
                : principle
        ));
    };

    const handleAdd = (principleId: string) => {
        // This is a placeholder. In a real app, you'd open a modal or form to input the new sub-principle.
        const newSubPrinciple = { id: Date.now().toString(), name: "New Sub-Principle" };
        setPrinciples(principles.map(principle =>
            principle.id === principleId
                ? { ...principle, subPrinciples: [...principle.subPrinciples, newSubPrinciple] }
                : principle
        ));
    };

    console.log(data);
    return (
        <div className="py-8 px-12">
            <div className="flex justify-between items-center mb-8">
                <p className="text-2xl font-bold  title ml-12">Creación de Rubrica</p>
                <div className="flex gap-x-2 mr-20">
                    <Link href={"/rubrica/createdfinal"}>
                        <AdaptButton texto="Siguiente" icon={faCircleRight} />
                    </Link>
                </div>
            </div>
            <div className='flex justify-center items-center m-4'>
                <p className='text-xl title'>Agrege o elimine las categorias de evaluación que prefiera para los principios UX</p>
            </div>

            <div className='px-12 mr-8'>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {principles.map((principle) => (
                        <Card key={principle.id} className="w-full">
                            <CardBody>
                                <h3 className="text-lg font-bold mb-2">{principle.name}</h3>
                                {principle.subPrinciples.map((subPrinciple) => (
                                    <Card key={subPrinciple.id} className="mb-2" isHoverable={true}>
                                        <CardBody className="flex justify-between p-3">
                                            <div className='flex justify-between'>
                                                <span>{subPrinciple.name}</span>
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    className="button-danger" // Aplica la clase CSS
                                                    onClick={() => handleRemove(principle.id, subPrinciple.id)}
                                                >
                                                    <X size={12} />
                                                </Button>
                                            </div>
                                            <div className="flex justify-start">
                                                <Button isIconOnly size="sm" variant="light">
                                                    <Edit size={18} />
                                                </Button>
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))}
                                <Button
                                    isIconOnly
                                    className="w-full mt-2"
                                    color="success"
                                    variant="flat"
                                    onClick={() => handleAdd(principle.id)}
                                >
                                    <Plus />
                                </Button>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}