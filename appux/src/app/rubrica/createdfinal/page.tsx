'use client'
import React, { useState } from 'react';
import AdaptButton from "@/components/AdaptButton";
import { faCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

// Importaciones de los componentes separados
import CategoryMatrix from '../../../components/rubricas/CategoryMatrix';


interface Subcategory {
    name: string;
    evaluations: (string | null)[];
    unknown: string;
}

interface Category {
    name: string;
    subcategories: Subcategory[];
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

export default function UXEvaluationMatrix() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>(initialCategories);

    const handleNext = () => {
        router.push("/rubrica/createdResumen");
    };
    const handleAtras = () => {
        router.push("/rubrica/created1");
    };

    const handleUpdateCategory = (updatedCategory: Category) => {
        setCategories(categories.map(category =>
            category.name === updatedCategory.name ? updatedCategory : category
        ));
    };

    return (
        <div className="p-4 text-white min-h-screen">
            <div className="py-8 px-12">
                <div className="flex justify-between items-center mb-8">
                    <p className="text-2xl font-bold title">Creación de Rubrica</p>
                    <div className="flex gap-x-2 px-4">
                        <AdaptButton texto="Atras" onClick={handleAtras} />
                        <AdaptButton texto="Siguiente" icon={faCircleRight} onClick={handleNext} />
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
