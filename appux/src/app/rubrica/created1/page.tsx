"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody, Button, Input } from "@nextui-org/react";
import { Edit, Plus, Check } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { faCircleRight } from "@fortawesome/free-solid-svg-icons";
import AdaptButton from "@/components/AdaptButton";

interface Categoria {
    id: number;
    contenido: string;
}

interface Principle {
    id: number;
    label: string;
    categorias: Categoria[];
}

export default function UXPrinciplesEvaluator() {
    const [data, setData] = useState<{
        nombreR: string;
        selectedP: Principle[];
    }>({
        nombreR: "",
        selectedP: []
    });

    const [editingState, setEditingState] = useState<{ [key: string]: boolean }>({});
    const [editedContent, setEditedContent] = useState<{ [key: string]: string }>({});
    const router = useRouter();

    // Cargar la información de sessionStorage
    useEffect(() => {
        const savedData = sessionStorage.getItem("principiosData");
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            // Asegurarse de que cada principio tenga la propiedad 'categorias'
            const normalizedData = parsedData.selectedP.map((principle: Principle) => ({
                ...principle,
                categorias: principle.categorias || [] // Inicializa a un array vacío si es undefined
            }));
            setData({ ...parsedData, selectedP: normalizedData });
        }
    }, []);

    const handleRemove = (principleId: number, categoriaId: number) => {
        setData(prevData => ({
            ...prevData,
            selectedP: prevData.selectedP.map(principle =>
                principle.id === principleId
                    ? { ...principle, categorias: principle.categorias.filter(cat => cat.id !== categoriaId) }
                    : principle
            )
        }));
    };

    const handleAdd = (principleId: number) => {
        setData(prevData => {
            const principle = prevData.selectedP.find(p => p.id === principleId);
            const newId = principle ? principle.categorias.length + 1 : 1; // Asignar un nuevo ID secuencial

            return {
                ...prevData,
                selectedP: prevData.selectedP.map(p =>
                    p.id === principleId
                        ? {
                            ...p,
                            categorias: [
                                ...p.categorias,
                                { id: newId, contenido: "Edite esta categoría" }
                            ]
                        }
                        : p
                )
            };
        });
    };

    const handleEdit = (principleId: number, categoriaId: number) => {
        const editKey = `${principleId}-${categoriaId}`;
        setEditingState({ ...editingState, [editKey]: true });
        const categoria = data.selectedP
            .find(p => p.id === principleId)
            ?.categorias.find(cat => cat.id === categoriaId);
        if (categoria) {
            setEditedContent({ ...editedContent, [editKey]: categoria.contenido });
        }
    };

    const handleSave = (principleId: number, categoriaId: number) => {
        const editKey = `${principleId}-${categoriaId}`;
        setEditingState({ ...editingState, [editKey]: false });
        setData(prevData => ({
            ...prevData,
            selectedP: prevData.selectedP.map(principle =>
                principle.id === principleId
                    ? {
                        ...principle,
                        categorias: principle.categorias.map(cat =>
                            cat.id === categoriaId
                                ? { ...cat, contenido: editedContent[editKey] || cat.contenido }
                                : cat
                        )
                    }
                    : principle
            )
        }));
    };

    const handleFinal = () => {
        //Envio de categorias agregadas
        console.log(data);
        sessionStorage.setItem('categoriasData', JSON.stringify(data));
        router.push('/rubrica/createdfinal');
    };

    const handleAtras = () => {
        router.push("/rubrica/created");
    };

    return (
        <div className="py-8 px-8">
            <div className="flex justify-between items-center mb-8">
                <p className="text-2xl font-bold title ml-12">Creación de Rubrica</p>
                <div className="flex gap-x-2 mr-20">
                    <AdaptButton texto="Atras" onClick={handleAtras} />
                    <AdaptButton texto="Siguiente" icon={faCircleRight} onClick={handleFinal} />
                </div>
            </div>
            <div className='flex justify-center items-center m-4'>
                <p className='text-xl title'>Agrega o elimina las categorías de evaluación para los principios UX seleccionados</p>
            </div>
            <div className='px-12 mr-8 '>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                    {data.selectedP.map((principle) => (
                        <Card key={principle.id} className="w-full">
                            <CardBody>
                                <h3 className="text-lg font-bold mb-2 text-center">{principle.label}</h3>
                                {principle.categorias.map((categoria) => (
                                    <Card key={categoria.id} className="mb-2" isHoverable={true}>
                                        <CardBody className="flex justify-between p-3">
                                            <div className='flex justify-between w-full gap-x-8'>
                                                {editingState[`${principle.id}-${categoria.id}`] ? (
                                                    <Input
                                                        value={editedContent[`${principle.id}-${categoria.id}`]}
                                                        onChange={(e) => setEditedContent({
                                                            ...editedContent,
                                                            [`${principle.id}-${categoria.id}`]: e.target.value
                                                        })}
                                                        className="max-w-[70%]"
                                                    />
                                                ) : (
                                                    <span>{categoria.contenido}</span>
                                                )}
                                                <div className="flex gap-x-5">
                                                    {editingState[`${principle.id}-${categoria.id}`] ? (
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            onClick={() => handleSave(principle.id, categoria.id)}
                                                        >
                                                            <Check size={18} />
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            onClick={() => handleEdit(principle.id, categoria.id)}
                                                        >
                                                            <Edit size={18} />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        className="text-red-500"
                                                        onClick={() => handleRemove(principle.id, categoria.id)}
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
