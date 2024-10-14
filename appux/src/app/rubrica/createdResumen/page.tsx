'use client';
import React, { useState } from 'react';
import { Button } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { NotificationTypewriter } from "../../../components/ui/notificacionwrite";
import CategoryMatrix from '../../../components/rubricas/CategoryMatrix';
import { motion } from 'framer-motion';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import html2pdf from 'html2pdf.js';

interface Subcategory {
    name: string;
    evaluations: (string | null)[];
    unknown: string;
}

interface Category {
    name: string;
    subcategories: Subcategory[];
}

async function downloadPDF() {
    const element = document.getElementById("rubric")!;
    const opt = {
        margin: 0,
        filename: 'rubrica.pdf',
        html2canvas: { scale: 10 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
 
    html2pdf().from(element).set(opt).save();
}


const initialCategories: Category[] = [
    {
        name: "Usabilidad",
        subcategories: [
            { name: "Satisfacción del usuario", evaluations: [null, null, null, null, null], unknown: "" },
            { name: "Claridad de la interfaz", evaluations: [null, null, null, null, null], unknown: "" },
            { name: "Facilidad de aprendizaje", evaluations: [null, null, null, null, null], unknown: "" },
        ],
    },
    {
        name: "Accesibilidad",
        subcategories: [
            { name: "Perceptible", evaluations: [null, null, null, null, null], unknown: "" },
            { name: "Operable", evaluations: [null, null, null, null, null], unknown: "" },
            { name: "Comprensible", evaluations: [null, null, null, null, null], unknown: "" },
        ],
    },
];

function Resumen() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>(initialCategories);

    const handleUpdateCategory = (updatedCategory: Category) => {
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
        downloadPDF();
    };

    const handleDownloadExcel = () => {
        console.log("Downloading Excel...");
    };

    return (
        <div className="py-8 px-12 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <p className="text-2xl title">Creación de Rúbrica</p>
            </div>
            <div className="flex gap-8">
                <div className="w-2/3 p-4 rounded-lg" id="rubric">
                    <p className="text-xl font-semibold mb-4">Vista Previa de Rúbrica</p>
                    <div className="max-h-[600px] overflow-y-auto">
                        {categories.map((category) => (
                            <CategoryMatrix
                                key={category.name}
                                category={category}
                                onUpdateCategory={handleUpdateCategory}
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
                                <FontAwesomeIcon icon={faDownload} />
                                PDF</Button>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Button color="success" onClick={handleDownloadExcel}><FontAwesomeIcon icon={faDownload} />Excel</Button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Resumen;
