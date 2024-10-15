'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import AdaptButton from '../../../components/AdaptButton'; // Import the AdaptButton component
import { faArrowLeft, faArrowRight, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    { label: "Excelente", value: 5, color: "#4CAF50" }, // Green
    { label: "Bueno", value: 4, color: "#8BC34A" }, // Light Green
    { label: "Aceptable", value: 3, color: "#FFEB3B" }, // Yellow
    { label: "Satisfactorio", value: 2, color: "#FFC107" }, // Amber
    { label: "Insatisfactorio", value: 1, color: "#F44336" }, // Red
];

const EvaluationCell: React.FC<{ value: string | null; onChange: (value: string) => void }> = ({ value, onChange }) => (
    <textarea
        placeholder="Ingrese evaluación"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', height: '100px', borderRadius: '8px', padding: '8px' }}
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
        <div style={{ width: '100%', marginBottom: '20px' }}>
            <input
                type="text"
                value={selectedP.label}
                onChange={(e) => handleLabelChange(e.target.value)}
                style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px', width: '100%' }}
            />
            <table border={1} cellPadding={5} cellSpacing={0} style={{ width: '100%', textAlign: 'left', tableLayout: 'fixed' }}>
                <thead>
                    <tr>
                        <th className="rounded-lg p-2 text-center">Categorías</th>
                        <th className="rounded-lg p-2 text-center">Incógnitas de evaluación</th>
                        {evaluationCriteria.map((criteria) => (
                            <th
                                key={criteria.value}
                                className="rounded-lg p-2 text-center"
                                style={{ backgroundColor: criteria.color }}
                            >
                                {criteria.label}
                            </th>
                        ))}
                        <th className="rounded-lg p-2 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedP.categorias.map((categoria, categoriaIndex) => (
                        <tr key={categoria.id}>
                            <td style={{ borderRadius: '8px', padding: '8px' }}>
                                <input
                                    type="text"
                                    value={categoria.contenido}
                                    onChange={(e) => handleCategoryChange(categoriaIndex, e.target.value)}
                                    style={{ width: '100%', borderRadius: '8px', padding: '8px' }}
                                />
                            </td>
                            <td style={{ borderRadius: '8px', padding: '8px' }}>
                                <textarea
                                    placeholder="Ingrese incógnitas"
                                    value={categoria.incognitas || ""}
                                    onChange={(e) => handleUnknownChange(categoriaIndex, e.target.value)}
                                    style={{ width: '100%', height: '100px', borderRadius: '8px', padding: '8px' }}
                                />
                            </td>
                            {evaluationCriteria.map((criteria, evaluationIndex) => (
                                <td key={evaluationIndex} style={{ borderRadius: '8px', padding: '8px' }}>
                                    <div style={{ margin: '5px' }}>
                                        <EvaluationCell
                                            value={categoria.escenarios?.[evaluationIndex]?.contenido || ""}
                                            onChange={(value) => handleCellChange(categoriaIndex, evaluationIndex, value)}
                                        />
                                    </div>
                                </td>
                            ))}
                            <td style={{ borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                                <button onClick={() => handleDeleteCategory(categoriaIndex)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const Header: React.FC<{ handleAtras: () => void; handleNext: () => void }> = ({ handleAtras, handleNext }) => (
    <div className="text-center mb-5">
        <div className="flex justify-between gap-2.5 me-5 ms-10">
            <div>
                <h2 className='text-2xl font-semibold'>Creación de Rubrica</h2>
            </div>
            <div className='flex justify-center items-center gap-2.5'>
                <AdaptButton texto="Atras" icon={faArrowLeft} onPress={handleAtras} />
                <AdaptButton texto="Finalizar" icon={faArrowRight} onPress={handleNext} />
            </div>
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
        const savedData = sessionStorage.getItem('rubricaDefault');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setData(parsedData);
        }
    }, []);

    const notify = () => toast.success('Rubrica creada exitosamente!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });

    const handleNext = () => {
        const userId = sessionStorage.getItem('userId');
        const dataWithUserId = { ...data, userId };
        sessionStorage.setItem('principiosData', JSON.stringify(dataWithUserId));
        notify();

        // axios.post('/api/postJsonR', {
        //     dataWithUserId,
        // })
        //     .then((response) => {
        //         response.data();
        //     })
        //     .catch((error) => {
        //         console.error("Error al obtener las rúbricas: ", error);
        //     });

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

    const handleNombreRChange = (value: string) => {
        setData(prevData => ({
            ...prevData,
            nombreR: value
        }));
    };

    return (
        <div>
            <input
                type="text"
                value={data.nombreR}
                onChange={(e) => handleNombreRChange(e.target.value)}
                style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px', width: '100%' }}
            />
            <Header handleAtras={handleAtras} handleNext={handleNext} />
            {data.selectedP.map((selectedP) => (
                <CategoryMatrix
                    key={selectedP.id}
                    selectedP={selectedP}
                    onUpdateSelectedP={handleUpdateSelectedP}
                />
            ))}
        </div>
    );
}