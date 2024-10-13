'use client'
import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Textarea } from "@nextui-org/react";
import AdaptButton from "@/components/AdaptButton";
import { faCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

interface Subcategory {
    name: string;
    evaluations: (string | null)[];
    unknown: string;
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

const EvaluationCell: React.FC<{ value: string | null; onChange: (value: string) => void }> = ({ value, onChange }) => (
    <Textarea
        className="w-full h-24 text-sm font-normal"
        placeholder="Ingrese evaluación"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
    />
);

const CategoryMatrix: React.FC<{ 
    category: Category; 
    onUpdateCategory: (updatedCategory: Category) => void 
}> = ({ category, onUpdateCategory }) => {
    const handleCellChange = (subcategoryIndex: number, evaluationIndex: number, value: string) => {
        const updatedCategory = { ...category };
        updatedCategory.subcategories[subcategoryIndex].evaluations[evaluationIndex] = value;
        onUpdateCategory(updatedCategory);
    };

    const handleUnknownChange = (subcategoryIndex: number, value: string) => {
        const updatedCategory = { ...category };
        updatedCategory.subcategories[subcategoryIndex].unknown = value;
        onUpdateCategory(updatedCategory);
    };

    return (
        <Card className="w-full mb-4  text-white">
            <CardHeader className="flex flex-col px-4 pt-4 pb-0">
                <h2 className="text-lg font-bold justify-center items-center">{category.name}</h2>
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
            <CardBody className="px-4 ">
                {category.subcategories.map((subcategory, subcategoryIndex) => (
                    <div key={subcategory.name} className="flex w-full mb-2">
                        <div className="w-1/6 flex items-center">{subcategory.name}</div>
                        <div className="w-1/6 pr-2">
                            <Textarea
                                className="w-full h-24 text-sm font-normal"
                                placeholder="Ingrese incógnitas"
                                value={subcategory.unknown}
                                onChange={(e) => handleUnknownChange(subcategoryIndex, e.target.value)}
                            />
                        </div>
                        {subcategory.evaluations.map((evaluation, evaluationIndex) => (
                            <div key={evaluationIndex} className="w-1/6 mx-2 overflow-hidden">
                                <EvaluationCell
                                    value={evaluation}
                                    onChange={(value) => handleCellChange(subcategoryIndex, evaluationIndex, value)}
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
    const [categories, setCategories] = useState<Category[]>(initialCategories);

    const handleNext = () => {
        router.push("/rubrica");
    }

    const handleUpdateCategory = (updatedCategory: Category) => {
        setCategories(categories.map(category => 
            category.name === updatedCategory.name ? updatedCategory : category
        ));
    }

    return (
        <div className="p-4 text-white min-h-screen">
            <div className="py-8 px-12">
                <div className="flex justify-between items-center mb-8">
                    <p className="text-2xl font-bold title">Creación de Rubrica</p>
                    <div className="flex gap-x-2 px-4">
                        <AdaptButton texto="Siguiente" icon={faCircleRight} onClick={handleNext}/>
                    </div>
                </div>
                {categories.map((category) => (
                    <CategoryMatrix 
                        key={category.name} 
                        category={category} 
                        onUpdateCategory={handleUpdateCategory}
                    />
                ))}
            </div>
        </div>
    );
}