'use client';
import React, { useEffect, useState } from 'react';
import { Button, ScrollShadow } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { faFilePdf, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import AdaptButton from '../../../components/AdaptButton'; // Import the AdaptButton component

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

const CategoryMatrix: React.FC<{ selectedP: SelectedP }> = ({ selectedP }) => (
    <div className="w-full mb-5 px-5">
        <div className="mt-5 w-1/3 mx-auto flex flex-col p-3">
            <div className="flex">
                <div className="text-center w-4/5 text-xl h-12 flex items-center justify-center">
                    {selectedP.label}
                </div>
            </div>
        </div>
        <table className="w-full text-left border border-separate border-spacing-2 rounded-2xl p-4 tablenombrequeyoquieraponer">
            <thead>
                <tr className="aqui">
                    <th className=" p-2 text-center">Categorías</th>
                    <th className=" p-2 text-center">Incógnitas de evaluación</th>
                    {evaluationCriteria.map((criteria) => (
                        <th
                            key={criteria.value}
                            className=" p-2 text-center rounded-xl"
                            style={{ backgroundColor: criteria.color }}
                        >
                            {criteria.label}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {selectedP.categorias.map((categoria) => (
                    <tr key={categoria.id}>
                        <td className="px-2 rounded-lg">
                            <textarea
                                value={categoria.contenido}
                                disabled
                                className="w-full h-24 rounded-lg p-2 bg-transparent resize-none"
                            />
                        </td>
                        <td className=" p-2">
                            <textarea
                                value={categoria.incognitas || ""}
                                disabled
                                className="w-full h-24 rounded-lg p-2 bg-transparent resize-none"
                            />
                        </td>
                        {evaluationCriteria.map((criteria, evaluationIndex) => (
                            <td key={evaluationIndex} className="">
                                <textarea
                                    value={categoria.escenarios?.[evaluationIndex]?.contenido || ""}
                                    disabled
                                    className="w-full h-24 rounded-lg p-2 bg-transparent resize-none"
                                />
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

function Detalles() {
    const router = useRouter();

    const handleCreateNewRubric = () => {
        router.push("/rubrica/created");
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF({ orientation: "l" });
        doc.setFontSize(18);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight(); // Altura de la página

        // Agregar imagen y texto en el lado izquierdo
        const img = new Image();
        img.src = '/img/Logo.png';
        img.onload = () => {
            const imgWidth = 10;
            const imgHeight = 10;
            const imgX = 10;
            const imgY = 10;
            doc.addImage(img, 'PNG', imgX, imgY, imgWidth, imgHeight);
            doc.text("EvalUX", imgX + imgWidth + 5, imgY + imgHeight / 2 + 3, { align: "left" });
            doc.text("Rúbrica: " + data.nombreR, pageWidth / 2, imgY + imgHeight + 20, { align: "center" });
            doc.setFontSize(10);

            let currentY = imgY + imgHeight + 30;
            const tableColumns = [
                "Categorías",
                "Incógnitas de evaluación",
                "Insatisfactorio (1)",
                "Satisfactorio (2)",
                "Aceptable (3)",
                "Bueno (4)",
                "Excelente (5)",
            ];

            data.selectedP.forEach((principio) => {
                doc.setFontSize(14);
                doc.text(principio.label, pageWidth / 2, currentY, { align: "center" });
                doc.setFontSize(10);

                currentY += 5;

                const tableRows: (string | number)[][] = [];
                principio.categorias.forEach((categoria) => {
                    const row = [
                        categoria.contenido,
                        categoria.incognitas || "",
                        categoria.escenarios?.[0]?.contenido || "",
                        categoria.escenarios?.[1]?.contenido || "",
                        categoria.escenarios?.[2]?.contenido || "",
                        categoria.escenarios?.[3]?.contenido || "",
                        categoria.escenarios?.[4]?.contenido || "",
                    ];
                    tableRows.push(row);
                });

                // Verificar si necesitamos un salto de página
                const rowsHeight = tableRows.length * 10; // Altura estimada de las filas
                if (currentY + rowsHeight > pageHeight - 20) {
                    doc.addPage();
                    currentY = 20; // Reiniciar la posición Y en la nueva página
                }

                // Dibujar la tabla sin repetir encabezados en el salto de página
                autoTable(doc, {
                    head: [tableColumns],
                    body: tableRows,
                    startY: currentY,
                    showHead: 'firstPage', // Muestra los encabezados solo en la primera página de cada tabla
                    headStyles: {
                        fillColor: [41, 128, 185],
                        textColor: [255, 255, 255],
                        fontSize: 12,
                        fontStyle: 'bold',
                        halign: 'center',
                        valign: 'middle',
                    },
                    bodyStyles: {
                        fillColor: [245, 245, 245],
                        textColor: [0, 0, 0],
                        fontSize: 10,
                        halign: 'left',
                        valign: 'middle',
                    },
                    alternateRowStyles: {
                        fillColor: [255, 255, 255],
                    },
                    styles: {
                        cellPadding: 4,
                        lineWidth: 0.1,
                        lineColor: [0, 0, 0],
                    },
                    theme: "grid",
                    didDrawPage: (data) => {
                        if (data.cursor) {
                            currentY = data.cursor.y + 10;
                        }
                    },
                });
            });

            doc.save("Rubrica_de_EvalUX.pdf");
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

    const handleEvaluar = () => {
        router.push("/evaluaciones/evaluarIn");
    }

    useEffect(() => {
        const savedData = sessionStorage.getItem('principiosData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setData(parsedData);
        }
    }, []);

    return (
        <div className="py-8 px-12 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <p className="text-2xl">Creación de Rúbrica</p>
            </div>
            <div className="flex gap-8">

                <div className="w-3/4 p-4 rounded-lg">
                    <p className="text-xl font-semibold mb-4">Vista Previa de Rúbrica</p>

                    <ScrollShadow className="max-h-[600px]">
                        {data.selectedP.map((selectedP) => (
                            <CategoryMatrix
                                key={selectedP.id}
                                selectedP={selectedP}
                            />
                        ))}
                    </ScrollShadow>

                    {/* <div className="max-h-[600px] overflow-y-auto">

                    </div> */}
                </div>
                <div className="w-1/4 h-[70%] bg-gray-300 bg-opacity-5 transition duration-300 rounded-lg my-auto p-5 border shadow-md hover:shadow-lg flex justify-center items-center flex-col">
                    <p className="text-xl font-semibold mb-4"></p>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button color="primary" className="w-full mb-4" onClick={handleEvaluar}>
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

                            <AdaptButton icon={faFilePdf} texto='PDF' onPress={handleDownloadPDF} size='md' />
                            {/* <Button color="danger" className="bg-red-800" onClick={handleDownloadPDF}>
                                <FontAwesomeIcon icon={faFilePdf} />
                                PDF
                            </Button> */}
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >

                            <AdaptButton icon={faFileExcel} texto='Excel' onPress={handleDownloadExcel} size='md' />

                            {/* <Button color="success" onClick={handleDownloadExcel}>
                                <FontAwesomeIcon icon={faFileExcel} />
                                Excel
                            </Button> */}
                        </motion.div>
                    </div>
                </div>
                {/* <ModalPremium show={isModalProOPen} onClose={handleProCloseModal} /> */}
            </div>
        </div>
    );
}

export default Detalles;