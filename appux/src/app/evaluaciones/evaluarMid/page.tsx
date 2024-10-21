'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import AdaptButton from '@/components/AdaptButton';
import { faCircleQuestion, faCircleRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Help from '@/components/ui/help';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Loanding from '../loading';

interface Rubrica {
    nombreR: string;
    selectedP: Principio[];
}

interface Principio {
    evaluacionFinal: number | null;
    id: number;
    label: string;
    categorias: Categoria[];
}

interface Categoria {
    id: number;
    contenido: string;
    incognitas: string;
    escenarios: Escenario[];
    evaluacionIndividual: number | null;
}

interface Escenario {
    puntaje: number;
    evaluacion: boolean;
    contenido: string;
}

interface EvaluationCriteria {
    label: string;
    value: number;
    color: string;
}

const evaluationCriteria: EvaluationCriteria[] = [
    { label: 'Insatisfactorio', value: 1, color: 'bg-red-600' },
    { label: 'Satisfactorio', value: 2, color: 'bg-orange-600 ' },
    { label: 'Aceptable', value: 3, color: 'bg-yellow-600 ' },
    { label: 'Bueno', value: 4, color: 'bg-green-600' },
    { label: 'Excelente', value: 5, color: 'bg-green-700' },
];

const EvaluationCell: React.FC<{
    subIdx: string;
    categoryName: string;
    evalIdx: number;
    isSelected: boolean;
    onClick: (subIdx: string, evalIdx: number, categoryName: string) => void;
    name: string;
}> = ({ subIdx, categoryName, evalIdx, isSelected, onClick, name }) => {
    const handleClick = () => {
        onClick(subIdx, evalIdx, categoryName);
    };

    return (
        <div
            className={`w-full h-24 p-4 text-sm font-normal cursor-pointer rounded-lg border transition-all duration-500
            ${isSelected ? 'bg-gray-700' : ''}`}
            onClick={handleClick}
            style={{ overflowY: 'auto' }}
        >
            <span className="w-full flex items-start justify-start break-words">
                {name}
            </span>
        </div>
    );
};


const CategoryMatrix: React.FC<{
    category: {
        name: string;
        subcategories: {
            name: string;
            incognitas: string;
            evaluations: Escenario[];
            evaluacionIndividual: number;
        }[];
    };
    selectedEvaluations: { [subcategory: string]: number };
    onCellClick: (subcategoryName: string, evalIdx: number, categoryName: string) => void;
}> = ({ category, selectedEvaluations, onCellClick }) => (
    <Card className="w-full mb-4">

        <CardHeader className="flex flex-col px-4 pt-4 pb-0">
            <h2 className="text-lg font-bold text-center">{category.name}</h2>
            <div className="flex w-full justify-between mt-2">
                <span className="w-1/4 font-semibold text-xl ">Categorías</span>
                <span className="w-1/4 font-semibold text-xl">Incógnitas</span>
                {evaluationCriteria.map(({ value, label, color }) => (
                    <span key={value} className={`w-1/6 text-center rounded-md py-1 mx-2 ${color}`}>
                        <strong>{value}</strong> {label}
                    </span>
                ))}
            </div>
        </CardHeader>
        <CardBody className="px-4">
            {category.subcategories.map((subcategory, subIdx) => (
                <div key={`${subcategory.name}-${subIdx}`} className="flex w-full mb-2">
                    <span className="w-1/4 flex items-center">{subcategory.name}</span>
                    <span className="w-1/4 flex items-center border rounded-lg p-1">{subcategory.incognitas}</span>
                    {subcategory.evaluations.map((evaluation, evalIdx) => (
                        <div key={evalIdx} className="w-1/6 mx-2 overflow-y-hidden h-24">
                            <EvaluationCell
                                subIdx={subcategory.name}
                                categoryName={category.name}
                                evalIdx={evalIdx}
                                isSelected={selectedEvaluations[subcategory.name] === evalIdx}
                                onClick={onCellClick}
                                name={evaluation.contenido}
                            />
                        </div>
                    ))}
                </div>
            ))}
        </CardBody>
    </Card>
);
const UXEvaluationMatrix: React.FC = () => {
    const router = useRouter();
    const [rubrica, setRubrica] = useState<Rubrica | null>(null);
    const [categories, setCategories] = useState<{
        evaluacionFinal: number | null; name: string; subcategories: {
            name: string;
            incognitas: string;
            evaluations: Escenario[];
            evaluacionIndividual: number;
        }[];
    }[]>([]);
    const [selectedEvaluations, setSelectedEvaluations] = useState<{ [subcategory: string]: number }>({});

    const fetchRubrica = useCallback(async () => {
        try {
            const rubricaData = sessionStorage.getItem('rubricaData');
            if (!rubricaData) throw new Error('No se encontró el ID del usuario');

            const { selectedRubrica } = JSON.parse(rubricaData);
            console.log("La rubrica aqui es:" + selectedRubrica.id);
            const { data, status } = await axios.get('/api/getRubrica', { params: { id: selectedRubrica.id } });
            if (status !== 200) throw new Error('No se pudo obtener la rúbrica.');

            const fetchedRubrica = data;
            fetchedRubrica.selectedP.forEach((principio: Principio) => {
                principio.categorias.forEach((categoria: Categoria) => {
                    categoria.evaluacionIndividual = null;
                });
            });

            setRubrica(fetchedRubrica);
            setCategories(transformCategories(fetchedRubrica));
        } catch (error) {
            console.log(error);
        }
    }, []);

    const transformCategories = (rubrica: Rubrica) =>
        rubrica.selectedP.map(principle => ({
            name: principle.label,
            evaluacionFinal: principle.evaluacionFinal,
            subcategories: principle.categorias.map(categoria => ({
                name: categoria.contenido,
                incognitas: categoria.incognitas,
                evaluations: categoria.escenarios,
                evaluacionIndividual: categoria.evaluacionIndividual ?? 0,
            })),
        }));

    const notify = (text: string, type: string) => {
        if (type === "success") {
            toast.success(text, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else {
            toast.error(text, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    };

    const handleFinish = async () => {
        let totalGeneralEvaluacion = 0;
        const categoryCount = categories.length;

        categories.forEach((category) => {
            let totalEvaluacion = 0;
            const subcategoryCount = category.subcategories.length;

            category.subcategories.forEach((subcategory) => {
                totalEvaluacion += subcategory.evaluacionIndividual;
            });

            category.evaluacionFinal = totalEvaluacion / subcategoryCount;
            totalGeneralEvaluacion += category.evaluacionFinal;
        });

        const evaluacionGeneral = totalGeneralEvaluacion / categoryCount;
        const nombreE = sessionStorage.getItem('tituloEv') || '';
        const descripcion = sessionStorage.getItem('descripcion') || '';
        let id = 1;
        // Transformar de vuelta a la estructura original
        const transformedData = {
            nombreR: rubrica?.nombreR || '',
            evaluacionGeneral,
            nombreE,
            descripcion,
            selectedP: categories.map((category) => ({
                id: id++, // Asigna un ID adecuado si está disponible
                label: category.name,
                evaluacionFinal: category.evaluacionFinal,
                categorias: category.subcategories.map((subcategory) => ({
                    id: subcategory.name, // Asigna un ID adecuado si está disponible
                    contenido: subcategory.name,
                    incognitas: subcategory.incognitas,
                    evaluacionIndividual: subcategory.evaluacionIndividual,
                    escenarios: subcategory.evaluations.map((evaluation: { puntaje: number; contenido: string; }) => ({
                        puntaje: evaluation.puntaje,
                        contenido: evaluation.contenido,
                    })),
                })),
            })),
            userId: sessionStorage.getItem('userId') || '',
        };

        // Almacenar los datos actualizados en el sessionStorage
        sessionStorage.setItem('evaluaciónFinal', JSON.stringify(transformedData));
        try {
            const { data, status } = await axios.post('/api/postJsonEvaluacion', transformedData);

            if (status === 200) {
                const reporteId = data.reporteId;
                console.log(`Reporte ID recibido: ${reporteId}`);
                sessionStorage.setItem('reporteId', reporteId);
                notify('Evaluación insertada correctamente', 'success');
                router.push('/evaluaciones/reporte');
                return reporteId;
            } else {
                console.error(`Error en la solicitud: ${status}`);
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    };


    const handleCellClick = (subcategoryName: string, evalIdx: number, categoryName: string) => {
        categories.forEach((category) => {
            if (category.name === categoryName) {
                category.subcategories.forEach((subcategory) => {
                    if (subcategory.name === subcategoryName) {
                        if (evalIdx == 4) {
                            subcategory.evaluacionIndividual = 5;
                        }
                        if (evalIdx == 3) {
                            subcategory.evaluacionIndividual = 4;
                        }
                        if (evalIdx == 2) {
                            subcategory.evaluacionIndividual = 3;
                        }
                        if (evalIdx == 1) {
                            subcategory.evaluacionIndividual = 2;
                        }
                        if (evalIdx == 0) {
                            subcategory.evaluacionIndividual = 1;
                        }
                    }
                });
            }
        });
        setSelectedEvaluations((prev) => ({
            ...prev,
            [subcategoryName]: evalIdx,
        }));
    };

    useEffect(() => {
        fetchRubrica();
    }, [fetchRubrica]);
    if (!categories) return <div><Loanding /></div>;
    return (
        <div className="p-4">
            <header className="flex justify-between items-center mb-8">
                <p className="text-2xl font-bold">Evaluación<Help text="Para evaluar selecciona una celda" icon={faCircleQuestion} /></p>

                <AdaptButton icon={faCircleRight} texto="Finalizar" onClick={handleFinish} />
            </header>
            {categories.map((category, idx) => (
                <CategoryMatrix
                    key={idx}
                    category={category}
                    selectedEvaluations={selectedEvaluations}
                    onCellClick={handleCellClick}
                />
            ))}
        </div>
    );
};

export default UXEvaluationMatrix;