'use client';
import React, { useEffect, useState } from 'react';
import { Button } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { NotificationTypewriter } from "../../../components/ui/notificacionwrite";
import { motion } from 'framer-motion';
import { faDownload, faCircleRight, faFilePdf, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { jsPDF } from "jspdf";
import { Card, CardBody, CardHeader, Textarea } from "@nextui-org/react";
import AdaptButton from "@/components/AdaptButton";
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

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

interface UnifiedCategory {
    name: string;
    subcategories: Subcategory[];
}

const initialCategories: UnifiedCategory[] = [
    {
        name: "Usabilidad",
        subcategories: [
            { id: "1", contenido: "Satisfacción del usuario", incognitas: "", escenarios: Array(5).fill({ puntaje: 0, contenido: "" }) },
            { id: "2", contenido: "Claridad de la interfaz", incognitas: "", escenarios: Array(5).fill({ puntaje: 0, contenido: "" }) },
            { id: "3", contenido: "Facilidad de aprendizaje", incognitas: "", escenarios: Array(5).fill({ puntaje: 0, contenido: "" }) },
        ],
    },
    {
        name: "Accesibilidad",
        subcategories: [
            { id: "4", contenido: "Perceptible", incognitas: "", escenarios: Array(5).fill({ puntaje: 0, contenido: "" }) },
            { id: "5", contenido: "Operable", incognitas: "", escenarios: Array(5).fill({ puntaje: 0, contenido: "" }) },
            { id: "6", contenido: "Comprensible", incognitas: "", escenarios: Array(5).fill({ puntaje: 0, contenido: "" }) },
        ],
    },
];

const evaluationCriteria = [
    { label: "Excelente", value: 5, color: "bg-success" },
    { label: "Bueno", value: 4, color: "bg-success-300" },
    { label: "Aceptable", value: 3, color: "bg-primary-100" },
    { label: "Satisfactorio", value: 2, color: "bg-warning" },
    { label: "Insatisfactorio", value: 1, color: "bg-danger" },
];

const EvaluationCell: React.FC<{ value: string | null; onChange: (value: string) => void }> = ({ value, onChange }) => (
    <Textarea
        className="w-full h-24 text-sm font-normal"
        placeholder="Ingrese evaluación"
        disabled
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
            <Card className="w-full mb-4 ">
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
                                    disabled
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
        <p className="text-2xl font-bold">Creación de Rubrica</p>
        <div className="flex gap-x-2 px-4">
            <AdaptButton texto="Atras" onClick={handleAtras} />
            <AdaptButton texto="Siguiente" icon={faCircleRight} onClick={handleNext} />
        </div>
    </div>
);

function Resumen() {
    const router = useRouter();
    const [categories, setCategories] = useState<UnifiedCategory[]>(initialCategories);

    const handleUpdateCategory = (updatedCategory: UnifiedCategory) => {
        setCategories(categories.map(category =>
            category.name === updatedCategory.name ? updatedCategory : category
        ));
    };

    const handleEvaluate = () => {
        console.log("Evaluating...");
    };

    const handleCreateNewRubric = () => {
        router.push("/rubrica/created");
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF({ orientation: "landscape" });
        doc.setFontSize(18);
    
        const pageWidth = doc.internal.pageSize.getWidth();
    
        // Agregar imagen y texto en el lado izquierdo
        const img = new Image();
        img.src = '/img/Logo.png';
        img.onload = () => {
            const imgWidth = 10; // Ancho de la imagen
            const imgHeight = 10; // Alto de la imagen
            const imgX = 10; // Posición X en el lado izquierdo
            const imgY = 10; // Posición Y
            doc.addImage(img, 'PNG', imgX, imgY, imgWidth, imgHeight);
            doc.text("EvalUX", imgX + imgWidth + 5, imgY + imgHeight / 2 + 3, { align: "left" }); // Reducir la separación
            doc.text(data.nombreR, pageWidth / 2, imgY + imgHeight + 10, { align: "center" });
            doc.setFontSize(10); // Reducir tamaño de fuente para la fecha

    
            // Definir las columnas de la tabla
            const tableColumns = [
                "Principio",
                "Categorías",
                "Incógnitas de evaluación",
                "Excelente (5)",
                "Bueno (4)",
                "Aceptable (3)",
                "Satisfactorio (2)",
                "Insatisfactorio (1)",
            ];
    
            // Formatear los datos del JSON para las filas de la tabla
            const tableRows: (string | number)[][] = [];
    
            data.selectedP.forEach((principio) => {
                principio.categorias.forEach((categoria) => {
                    const row = [
                        principio.label, // Columna 'Principio'
                        categoria.contenido, // Columna 'Categorías'
                        categoria.incognitas || "", // Columna 'Incógnitas de evaluación'
                        categoria.escenarios?.[0]?.contenido || "", // Columna '5 Excelente'
                        categoria.escenarios?.[1]?.contenido || "", // Columna '4 Bueno'
                        categoria.escenarios?.[2]?.contenido || "", // Columna '3 Aceptable'
                        categoria.escenarios?.[3]?.contenido || "", // Columna '2 Satisfactorio'
                        categoria.escenarios?.[4]?.contenido || "", // Columna '1 Insatisfactorio'
                    ];
                    tableRows.push(row);
                });
            });
    
            // Generar la tabla en el PDF con autoTable
            autoTable(doc, {
                head: [tableColumns],
                body: tableRows,
                startY: imgY + imgHeight + 20,
                headStyles: {
                    fillColor: [41, 128, 185], // Color de fondo azul
                    textColor: [255, 255, 255], // Color de texto blanco
                    fontSize: 12, // Tamaño de fuente
                    fontStyle: 'bold', // Estilo de fuente
                    halign: 'center', // Alineación horizontal
                    valign: 'middle', // Alineación vertical
                },
                bodyStyles: {
                    fillColor: [245, 245, 245], // Color de fondo gris claro
                    textColor: [0, 0, 0], // Color de texto negro
                    fontSize: 10, // Tamaño de fuente
                    halign: 'left', // Alineación horizontal
                    valign: 'middle', // Alineación vertical
                },
                alternateRowStyles: {
                    fillColor: [255, 255, 255], // Color de fondo blanco para filas alternas
                },
                styles: {
                    cellPadding: 4, // Relleno de celda
                    lineWidth: 0.1, // Ancho de línea
                    lineColor: [0, 0, 0], // Color de línea
                },
                theme: "grid",
            });
    
            // Guardar el archivo PDF
            doc.save("Rubrica_de_AutoUX.pdf");
        };
    };

    const handleDownloadExcel = () => {
        const tableColumns = [
            "Principio",
            "Categorías",
            "Incógnitas de evaluación",
            "5 Excelente",
            "4 Bueno",
            "3 Aceptable",
            "2 Satisfactorio",
            "1 Insatisfactorio",
        ];

        const tableRows: (string | number)[][] = [];

        data.selectedP.forEach((principio) => {
            principio.categorias.forEach((categoria) => {
                const row = [
                    principio.label, // Columna 'Principio'
                    categoria.contenido, // Columna 'Categorías'
                    categoria.incognitas || "", // Columna 'Incógnitas de evaluación'
                    categoria.escenarios?.[0]?.contenido || "", // Columna '5 Excelente'
                    categoria.escenarios?.[1]?.contenido || "", // Columna '4 Bueno'
                    categoria.escenarios?.[2]?.contenido || "", // Columna '3 Aceptable'
                    categoria.escenarios?.[3]?.contenido || "", // Columna '2 Satisfactorio'
                    categoria.escenarios?.[4]?.contenido || "", // Columna '1 Insatisfactorio'
                ];
                tableRows.push(row);
            });
        });

        const worksheet = XLSX.utils.aoa_to_sheet([tableColumns, ...tableRows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Rúbrica");

        XLSX.writeFile(workbook, "Rubrica_de_AutoUX.xlsx");
    };

    const [data, setData] = useState({
        nombreR: "",
        selectedP: [] as SelectedP[]
    });

    useEffect(() => {
        const savedData = sessionStorage.getItem('principiosData');
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
        <div className="py-8 px-12 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <p className="text-2xl">Creación de Rúbrica</p>
            </div>
            <div className="flex gap-8">
                <div className="w-2/3 p-4 rounded-lg">
                    <p className="text-xl font-semibold mb-4">Vista Previa de Rúbrica</p>
                    <div className="max-h-[600px] overflow-y-auto">
                        {data.selectedP.map((selectedP) => (
                            <CategoryMatrix
                                key={selectedP.id}
                                selectedP={selectedP}
                                onUpdateSelectedP={handleUpdateSelectedP}
                            />
                        ))}
                    </div>
                </div>
                <div className="w-1/3 p-10">
                    <p className="text-xl font-semibold mb-4"><NotificationTypewriter /></p>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button color="primary" className="w-full mb-4" onClick={handleEvaluate}>
                            Evaluar
                        </Button>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button className="w-full mb-4 bg-transparent border-1" onClick={handleCreateNewRubric}>
                            Crear otra Rúbrica
                        </Button>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button color="default" className="w-full mb-4 bg-transparent border-1" onClick={() => router.push("/rubrica")}>
                            Volver al Inicio
                        </Button>
                    </motion.div>
                    <h3 className="text-lg font-semibold mt-8 mb-2 flex justify-center items-center">¡Compartir!</h3>
                    <h4 className="text-md mb-2 flex justify-center items-center">Descargar Rúbrica</h4>
                    <div className="flex gap-10 mt-2 justify-center items-center">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Button color="danger" className="bg-red-800" onClick={handleDownloadPDF}>
                                <FontAwesomeIcon icon={faFilePdf} />
                                PDF
                            </Button>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Button color="success" onClick={handleDownloadExcel}>
                                <FontAwesomeIcon icon={faFileExcel} />
                                Excel
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Resumen;