'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Textarea } from "@nextui-org/react";
import AdaptButton from "@/components/AdaptButton";
import { faCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

// Importaciones de los componentes separados
import CategoryMatrix from '../../../components/rubricas/CategoryMatrix';


interface Escenario {
    puntaje: number;
    contenido: string;
}

interface Subcategory {
    id: string;
    contenido: string;
    incognitas?: string;
    escenarios?: Escenario[];
}

interface SelectedP {
    id: number;
    label: string;
    categorias: Subcategory[];
}


const EvaluationCell: React.FC<{ value: string | null; onChange: (value: string) => void }> = ({ value, onChange }) => (
    <Textarea
        className="w-full h-24 text-sm font-normal"
        placeholder="Ingrese evaluación"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
    />
);

const CategoryMatrix: React.FC<{
    selectedP: SelectedP;
    onUpdateSelectedP: (updatedSelectedP: SelectedP) => void
}> = ({ selectedP, onUpdateSelectedP }) => {
    const handleCellChange = (categoriaIndex: number, evaluationIndex: number, value: string) => {
        const updatedSelectedP = { ...selectedP };
        if (!updatedSelectedP.categorias[categoriaIndex].escenarios) {
            updatedSelectedP.categorias[categoriaIndex].escenarios = Array(5).fill({ puntaje: 0, contenido: "" });
        }
        updatedSelectedP.categorias[categoriaIndex].escenarios[evaluationIndex] = {
            puntaje: evaluationCriteria[evaluationIndex].value,
            contenido: value
        };
        onUpdateSelectedP(updatedSelectedP);
    };

    const handleUnknownChange = (categoriaIndex: number, value: string) => {
        const updatedSelectedP = { ...selectedP };
        updatedSelectedP.categorias[categoriaIndex].incognitas = value;
        onUpdateSelectedP(updatedSelectedP);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="w-full mb-4 text-white">
                <CardHeader className="flex flex-col px-4 pt-4 pb-0">
                    <h2 className="text-lg font-bold justify-center items-center">{selectedP.label}</h2>
                    <div className="flex w-full justify-between mt-2">
                        <div className="w-1/6">Categorías</div>
                        <div className="w-1/6">Incógnitas de evaluación</div>
                        {evaluationCriteria.map((criteria) => (
                            <div key={criteria.value} className={`w-1/6 text-center rounded-md py-1 mx-2 ${criteria.color}`}>
                                <span className="font-bold">{criteria.value}</span> {criteria.label}
                            </div>
                        ))}
                    </div>
                </CardHeader>
                <CardBody className="px-4">
                    {selectedP.categorias.map((categoria, categoriaIndex) => (
                        <div key={categoria.id} className="flex w-full mb-2">
                            <div className="w-1/6 flex items-center">{categoria.contenido}</div>
                            <div className="w-1/6 pr-2">
                                <Textarea
                                    className="w-full h-24 text-sm font-normal"
                                    placeholder="Ingrese incógnitas"
                                    value={categoria.incognitas || ""}
                                    onChange={(e) => handleUnknownChange(categoriaIndex, e.target.value)}
                                />
                            </div>
                            {evaluationCriteria.map((criteria, evaluationIndex) => (
                                <div key={evaluationIndex} className="w-1/6 mx-2 overflow-hidden">
                                    <EvaluationCell
                                        value={categoria.escenarios?.[evaluationIndex]?.contenido || ""}
                                        onChange={(value) => handleCellChange(categoriaIndex, evaluationIndex, value)}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </CardBody>
            </Card>
        </motion.div>
    );
};

const Header: React.FC<{ handleAtras: () => void; handleNext: () => void }> = ({ handleAtras, handleNext }) => (
    <div className="flex justify-between items-center mb-8">
        <p className="text-2xl font-bold title">Creación de Rubrica</p>
        <div className="flex gap-x-2 px-4">
            <AdaptButton texto="Atras" onClick={handleAtras} />
            <AdaptButton texto="Siguiente" icon={faCircleRight} onClick={handleNext} />
        </div>
    </div>
);

export default function UXEvaluationMatrix() {
    const router = useRouter();
    const [data, setData] = useState({
        nombreR: "",
        selectedP: [] as SelectedP[]
    });

    useEffect(() => {
        const savedData = sessionStorage.getItem('categoriasData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setData(parsedData);
        }
    }, []);

    const handleNext = () => {
        sessionStorage.setItem('principiosData', JSON.stringify(data));
        console.log(sessionStorage.getItem('principiosData'));

        router.push("/rubrica/createdResumen");

    };

    const handleAtras = () => {
        router.push("/rubrica/created1");
    };

    const handleUpdateSelectedP = (updatedSelectedP: SelectedP) => {
        setData(prevData => ({
            ...prevData,
            selectedP: prevData.selectedP.map(p =>
                p.id === updatedSelectedP.id ? updatedSelectedP : p
            )
        }));
    };

    return (
        <div className="p-4 text-white min-h-screen">
            <div className="py-8 px-12">
                <Header handleAtras={handleAtras} handleNext={handleNext} />
                {data.selectedP.map((selectedP) => (
                    <CategoryMatrix
                        key={selectedP.id}
                        selectedP={selectedP}
                        onUpdateSelectedP={handleUpdateSelectedP}
                    />
                ))}
            </div>
        </div>
    );
}