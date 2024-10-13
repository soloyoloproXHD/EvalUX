'use client'
import React from 'react';
import { Card, CardBody, CardHeader, Button } from "@nextui-org/react";
import AdaptButton from "@/components/AdaptButton";
import { faCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

interface Subcategory {
    name: string;
    evaluations: (string | null)[];
}

interface Category {
    name: string;
    subcategories: Subcategory[];
}

const evaluationCriteria = [
    { label: "Excelente", value: 5, color: "bg-success" },
    { label: "Bueno", value: 4, color: "bg-success-300" },
    { label: "Aceptable", value: 3, color: "bg-primary-100" },
    { label: "Satisfactorio", value: 2, color: "bg-warning" },
    { label: "Insatisfactorio", value: 1, color: "bg-danger" },
];

const categories: Category[] = [
    {
        name: "Usabilidad",
        subcategories: [
            { name: "Satisfacción del usuario", evaluations: [null, null, null, null, null] },
            { name: "Claridad de la interfaz", evaluations: [null, null, null, null, null] },
            { name: "Facilidad de aprendizaje", evaluations: [null, null, null, null, null] },
        ],
    },
    {
        name: "Accesibilidad",
        subcategories: [
            { name: "Perceptible", evaluations: [null, null, null, null, null] },
            { name: "Operable", evaluations: [null, null, null, null, null] },
            { name: "Comprensible", evaluations: [null, null, null, null, null] },
        ],
    },
];

const EvaluationCell: React.FC<{ value: string | null; onClick: () => void }> = ({ value, onClick }) => (
    <Button
        className="w-full h-12 text-sm font-normal justify-start px-2"
        color="default"
        variant="bordered"
        onClick={onClick}
    >
        {value || ""}
    </Button>
);

const CategoryMatrix: React.FC<{ category: Category }> = ({ category }) => {
    const handleCellClick = (subcategoryIndex: number, evaluationIndex: number) => {
        // Here you would implement the logic to update the evaluation
        console.log(`Clicked: ${category.name} - ${category.subcategories[subcategoryIndex].name} - Evaluation ${evaluationIndex + 1}`);
    };

   

    return (
        <Card className="w-full mb-4">
            <CardHeader className="flex flex-col  px-4 pt-4 pb-0">
                <h2 className="text-lg font-bold justify-center items-center">{category.name}</h2>
                <div className="flex w-full justify-between mt-2">
                    <div className="w-1/4">Categorías</div>
                    <div className="w-1/4">Incógnitas de evaluación</div>
                    {evaluationCriteria.map((criteria) => (
                        <div key={criteria.value} className={`w-1/6 text-center rounded-md py-1 mx-2 ${criteria.color}`}>
                            <span className="font-bold">{criteria.value}</span> {criteria.label}
                        </div>
                    ))}
                </div>
            </CardHeader>
            <CardBody className="px-4">
                {category.subcategories.map((subcategory, subcategoryIndex) => (
                    <div key={subcategory.name} className="flex w-full mb-2">
                        <div className="w-1/4 flex items-center">{subcategory.name}</div>
                        <div className="w-1/4"></div>
                        {subcategory.evaluations.map((evaluation, evaluationIndex) => (
                            <div key={evaluationIndex} className="w-1/6 mx-2">
                                <EvaluationCell
                                    value={evaluation}
                                    onClick={() => handleCellClick(subcategoryIndex, evaluationIndex)}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </CardBody>
        </Card>
    );
};

export default function UXEvaluationMatrix() {
    const router = useRouter();
    const handleNext = () => {
        router.push("/rubrica");
    }
    return (
        <div className="p-4">
            <div className="py-8 px-12">
                <div className="flex justify-between items-center mb-8">
                    <p className="text-2xl font-bold  title">Creación de Rubrica</p>
                    <div className="flex gap-x-2 px-4">
                            <AdaptButton texto="Siguiente" icon={faCircleRight}  onClick={handleNext}/>
                    </div>
                </div>
                {categories.map((category) => (
                    <CategoryMatrix key={category.name} category={category} />
                ))}
            </div>
        </div>
    );
}