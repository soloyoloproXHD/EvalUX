"use client"

import React, {useEffect, useState } from 'react';
import { Card, CardBody, Button, Input } from "@nextui-org/react";
import { Edit, Plus, Check } from 'lucide-react';
import { AdaptButton } from "@/components/AdaptButton";
import { faCircleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

interface SubPrinciple {
    id: string;
    name: string;
}

interface Principle {
    id: string;
    name: string;
    subPrinciples: SubPrinciple[];
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
        selectedP: [] as {
            id: number, 
            label: string
        }[]
    });

    interface categoriasSelect {
        id: number
        contenido: string
    };

    const [infoSend, setInfoSend] = useState({
        nombreR: "",
        selectedP: [] as {
            id: number, 
            label: string,
            categorias: categoriasSelect
        }[]
    });

    const [principles, setPrinciples] = useState<Principle[]>(initialPrinciples);
    const [editingState, setEditingState] = useState<{ [key: string]: boolean }>({});
    const [editedContent, setEditedContent] = useState<{ [key: string]: string }>({});
    const router = useRouter();

    useEffect(() => { //Obtencion de pestaña created
        const savedData = sessionStorage.getItem('principiosData');
        if (savedData) {
            setData(JSON.parse(savedData));
        }
    }, [])
    
    
    const handleRemove = (principleId: number, subPrincipleId: string) => {
        setPrinciples(principles.map(principle =>
            principle.id === principleId.toString()
                ? { ...principle, subPrinciples: principle.subPrinciples.filter(sp => sp.id !== subPrincipleId) }
                : principle
        ));
    };

    const handleAdd = (principleId: number) => {
        const principle = principles.find(p => p.id === principleId.toString());
        if (!principle) return;

        const newSubPrinciple = {
            id: Date.now().toString(),
            name: "Edite este nombre"
        };

        setPrinciples(principles.map(p =>
            p.id === principleId.toString()
                ? { ...p, subPrinciples: [...p.subPrinciples, newSubPrinciple] }
                : p
        ));
    };

    const handleEdit = (principleId: number, subPrincipleId: string) => {
        const editKey = `${principleId}-${subPrincipleId}`;
        setEditingState({ ...editingState, [editKey]: true });
        const subPrinciple = principles
            .find(p => p.id === principleId.toString())
            ?.subPrinciples.find(sp => sp.id === subPrincipleId);
        if (subPrinciple) {
            setEditedContent({ ...editedContent, [editKey]: subPrinciple.name });
        }
    };

    const handleSave = (principleId: number, subPrincipleId: string) => {
        const editKey = `${principleId}-${subPrincipleId}`;
        setEditingState({ ...editingState, [editKey]: false });
        setPrinciples(principles.map(principle =>
            principle.id === principleId.toString()
                ? {
                    ...principle,
                    subPrinciples: principle.subPrinciples.map(sp =>
                        sp.id === subPrincipleId
                            ? { ...sp, name: editedContent[editKey] || sp.name }
                            : sp
                    )
                }
                : principle
        ));
    };

    const handleFinal = () => {
        router.push('/rubrica/createdfinal');
    };
    const handleAtras = () => {
        router.push('/rubrica/created');
    }

    console.log(data);
    return (
        <div className="py-8 px-8">
            <div className="flex justify-between items-center mb-8">
                <p className="text-2xl font-bold title ml-12">Creación de Rubrica</p>
                <div className="flex gap-x-2 mr-20">
                        <AdaptButton texto="Atras" onClick={handleAtras}/>
                        <AdaptButton texto="Siguiente" icon={faCircleRight}  onClick={handleFinal}/>
                </div>
            </div>
            <div className='flex justify-center items-center m-4'>
                <p className='text-xl title'>Agrege o elimine las categorias de evaluación que prefiera para los principios UX</p>
            </div>

            <div className='px-12 mr-8'>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                    {data.selectedP.map((principle) => (
                        <Card key={principle.id} className="w-full">
                            <CardBody>
                                <h3 className="text-lg font-bold mb-2">{principle.label}</h3>
                                {principle.categorias.map((cat) => (
                                    <Card key={cat.categoria} className="mb-2" isHoverable={true}>
                                        <CardBody className="flex justify-between p-3">
                                            <div className='flex justify-between w-full gap-x-8'>
                                                {editingState[`${principle.id}-${cat.categoria}`] ? (
                                                    <Input
                                                        value={editedContent[`${principle.id}-${cat.categoria}`]}
                                                        onChange={(e) => setEditedContent({
                                                            ...editedContent,
                                                            [`${principle.id}-${cat.categoria}`]: e.target.value
                                                        })}
                                                        className="max-w-[70%]"
                                                    />
                                                ) : (
                                                    <span>{cat.categoria}</span>
                                                )}
                                                <div className="flex gap-x-5">
                                                    {editingState[`${principle.id}-${cat.categoria}`] ? (
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="light"
                                                            onClick={() => handleSave(principle.id, cat.categoria)}
                                                        >
                                                            <Check size={18} />
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="light"
                                                            onClick={() => handleEdit(principle.id, cat.categoria)}
                                                        >
                                                            <Edit size={18} />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                        className="text-red-500"
                                                        onClick={() => handleRemove(principle.id, cat.categoria)}
                                                    >
                                                        <FontAwesomeIcon icon={faRectangleXmark} />
                                                    </Button>
                                                </div>
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