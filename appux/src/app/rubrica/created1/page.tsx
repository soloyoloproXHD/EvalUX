"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tooltip } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion, faPenToSquare, faTrash, faPlus, faArrowRight, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import AdaptButton from "@/components/AdaptButton";
import axios from "axios";
import { toast } from "react-toastify";

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

const evaluationCriteria = [
    { label: "Insatisfactorio", value: 1, color: "#881414" }, // Red
    { label: "Satisfactorio", value: 2, color: "#bd3c11" }, // Amber
    { label: "Aceptable", value: 3, color: "#f26b1d" }, // Yellow
    { label: "Bueno", value: 4, color: "#8BC34A" }, // Light Green
    { label: "Excelente", value: 5, color: "#4CAF50" }, // Green
];

const EvaluationCell: React.FC<{ value: string | null; onChange: (value: string) => void }> = ({ value, onChange }) => (
    <textarea
        placeholder="Ingrese evaluación"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-24 rounded-lg p-2 bg-transparent resize-none"
    />
);

const CategoryMatrix: React.FC<{
    selectedP: SelectedP;
    onUpdateSelectedP: (updatedSelectedP: SelectedP) => void;
    onAddCategory: () => void;
    onDeletePrinciple: () => void;
}> = ({ selectedP, onUpdateSelectedP, onAddCategory, onDeletePrinciple }) => {
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

    const handleCategoryChange = (categoriaIndex: number, value: string) => {
        const updatedSelectedP = { ...selectedP };
        updatedSelectedP.categorias[categoriaIndex].contenido = value;
        onUpdateSelectedP(updatedSelectedP);
    };

    const handleLabelChange = (value: string) => {
        const updatedSelectedP = { ...selectedP, label: value };
        onUpdateSelectedP(updatedSelectedP);
    };

    const handleDeleteCategory = (categoriaIndex: number) => {
        const updatedSelectedP = { ...selectedP };
        updatedSelectedP.categorias.splice(categoriaIndex, 1);
        onUpdateSelectedP(updatedSelectedP);
    };

    return (
        <div className="w-full mb-5 px-5">
            <div className="mt-5 w-1/4 mx-auto flex flex-col p-3">
                <div className="flex justify-between items-center gap-3">
                    <Tooltip placement="left" content="Borrar principio" key="left">
                        <div>
                            <AdaptButton icon={faTrash} onPress={onDeletePrinciple} showSpinner={false} />
                        </div>
                    </Tooltip>
                    <div className='flex justify-center items-center'>
                        <input
                            type="text"
                            value={selectedP.label}
                            onChange={(e) => handleLabelChange(e.target.value)}
                            className="rounded-tl-lg rounded-bl-lg border border-r-0 border-gray-300 text-center font-semibold w-4/5 text-lg h-10 outline-none"
                        />
                        <Tooltip
                            key="right"
                            placement="right"
                            content="Haga click en el texto para cambiar el nombre del principio"
                            color="secondary"
                        >
                            <div className="border p-5 border-gray-300 rounded-tr-lg rounded-br-lg h-10 flex justify-center items-center bg-gray-300 bg-opacity-20">
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </div>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <table className="w-full text-left border border-separate border-spacing-2 rounded-2xl p-4 tablenombrequeyoquieraponer " style={{ borderSpacing: "10px" }}>
                <thead>
                    <tr className="aqui">
                        <th className="p-2 text-center">Categorías</th>
                        <th className="p-2 text-center">Incógnitas de evaluación</th>
                        {evaluationCriteria.map((criteria) => (
                            <th
                                key={criteria.value}
                                className="p-2 text-center rounded-xl"
                                style={{ backgroundColor: criteria.color }}
                            >
                                {criteria.label}
                            </th>
                        ))}
                        <th className="p-3 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedP.categorias.map((categoria, categoriaIndex) => (
                        <tr key={categoria.id}>
                            <td className="px-2 rounded-lg">
                                <textarea
                                    value={categoria.contenido}
                                    onChange={(e) => handleCategoryChange(categoriaIndex, e.target.value)}
                                    className="w-full h-24 rounded-lg p-2 bg-transparent resize-none"
                                    placeholder="Ingrese la categoría"
                                />
                            </td>
                            <td className=" p-2">
                                <textarea
                                    placeholder="Ingrese las incógnitas"
                                    value={categoria.incognitas || ""}
                                    onChange={(e) => handleUnknownChange(categoriaIndex, e.target.value)}
                                    className="w-full h-24 rounded-lg p-2 bg-transparent resize-none"
                                />
                            </td>
                            {evaluationCriteria.map((criteria, evaluationIndex) => (
                                <td key={evaluationIndex} className="border rounded-lg">
                                    <EvaluationCell
                                        value={categoria.escenarios?.[evaluationIndex]?.contenido || ""}
                                        onChange={(value) => handleCellChange(categoriaIndex, evaluationIndex, value)}
                                    />
                                </td>
                            ))}
                            <td className=" p-2 text-center rounded-lg">
                                <AdaptButton icon={faTrash} onPress={() => handleDeleteCategory(categoriaIndex)} showSpinner={false} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-center mt-5">
                <AdaptButton texto="Agregar categoría" icon={faPlus} onPress={onAddCategory} size='md' showSpinner={false} />
            </div>
        </div>
    );
};

export default function UXPrinciplesEvaluator() {
    const router = useRouter();
    const [data, setData] = useState<{
        nombreR: string;
        selectedP: SelectedP[];
    }>({
        nombreR: "",
        selectedP: []
    });

    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    useEffect(() => {
        const savedData = sessionStorage.getItem("principiosData");
        console.log("savedData", savedData);
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            // Agregar una categoría vacía a cada principio si no tiene ninguna
            const updatedSelectedP = parsedData.selectedP.map((principle: SelectedP) => ({
                ...principle,
                categorias: principle.categorias && principle.categorias.length > 0 ? principle.categorias : [{
                    id: `${Date.now()}`,
                    contenido: "",
                    incognitas: "",
                    escenarios: Array(5).fill({ puntaje: 0, contenido: "" })
                }]
            }));
            setData({ ...parsedData, selectedP: updatedSelectedP });
            console.log("parsedData", parsedData);
        }
    }, []);

    const handleNext = () => {
        const userId = sessionStorage.getItem('userId');
        const dataWithUserId = { ...data, userId };
        sessionStorage.setItem('principiosData', JSON.stringify(dataWithUserId));
        toast.success('Rubrica creada exitosamente!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });

        axios.post('/api/postJsonR', {
            dataWithUserId,
        })
            .then((response) => {
                response.data();
            })
            .catch((error) => {
                console.error("Error al obtener las rúbricas: ", error);
            });

        router.push("/rubrica/createdResumen");
    };

    const handleAtras = () => {
        router.push("/rubrica/created");
    };

    const handleUpdateSelectedP = (updatedSelectedP: SelectedP) => {
        setData(prevData => ({
            ...prevData,
            selectedP: prevData.selectedP.map(p =>
                p.id === updatedSelectedP.id ? updatedSelectedP : p
            )
        }));
    };

    const handleAddCategory = (selectedPId: number) => {
        const newCategory: Subcategory = {
            id: `${Date.now()}`,
            contenido: "",
            incognitas: "",
            escenarios: Array(5).fill({ puntaje: 0, contenido: "" })
        };

        setData(prevData => ({
            ...prevData,
            selectedP: prevData.selectedP.map(p =>
                p.id === selectedPId ? { ...p, categorias: [...p.categorias, newCategory] } : p
            )
        }));
    };

    const handleDeletePrinciple = (id: number) => {
        setData(prevData => ({
            ...prevData,
            selectedP: prevData.selectedP.filter(p => p.id !== id)
        }));
    };

    const handleAddPrinciple = () => {
        const newPrinciple: SelectedP = {
            id: Date.now(),
            label: "Nuevo Principio",
            categorias: []
        };
        setData(prevData => ({
            ...prevData,
            selectedP: [...prevData.selectedP, newPrinciple]
        }));
    };

    return (
        <div>
            <div className="mt-5 w-full mx-auto flex p-3 gap-3 justify-between items-center">
                <div className="flex flex-col justify-center gap-3 px-8 items-center">
                    <div className="flex justify-center items-center gap-3">
                        <h2 className="text-2xl font-semibold">Creación de Rubrica</h2>
                        <Tooltip placement='right' content="Puedes manipular toda la rubrica a tu conveniencia">
                            <FontAwesomeIcon icon={faCircleQuestion}></FontAwesomeIcon>
                        </Tooltip>
                    </div>
                    <div className="flex justify-start items-center gap-2 ms-5 mt-5">
                        <p className="text-lg font-semibold">Nombre:</p>
                        <input
                            type="text"
                            value={data.nombreR}
                            onChange={(e) => setData({ ...data, nombreR: e.target.value })}
                            className="border-b-1 border-gray-300 bg-transparent px-5 pb-1 w-full decoration-transparent outline-none"
                        />
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </div>
                </div>
                <div className="flex justify-center items-center gap-2.5 me-5">
                    <AdaptButton texto="Atras" onClick={handleAtras} />
                    <AdaptButton texto="Siguiente" icon={faArrowRight} onClick={handleNext} />
                </div>
            </div>
            {data.selectedP.map((selectedP) => (
                <CategoryMatrix
                    key={selectedP.id}
                    selectedP={selectedP}
                    onUpdateSelectedP={handleUpdateSelectedP}
                    onAddCategory={() => handleAddCategory(selectedP.id)}
                    onDeletePrinciple={() => handleDeletePrinciple(selectedP.id)}
                />
            ))}
            <div className="flex justify-center items-center my-3">
                <AdaptButton texto="Agregar Principio" icon={faPlus} onPress={handleAddPrinciple} size='md' />
            </div>
            {isVisible && (
                <div
                    className='animate__animated animate__fadeInRight fixed bottom-0 right-0 me-7 mb-7 px-5 py-3 border border-gray-400 rounded-xl bg-gray-300 bg-opacity-10 hover:bg-opacity-20
                    transition duration-300 hover:scale-105 z-50'
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <FontAwesomeIcon icon={faArrowUp} />
                </div>
            )}
        </div>
    );
}