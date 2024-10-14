import React from 'react';

interface CategoryHeaderProps {
    categoryName: string;
}

const evaluationCriteria = [
    { label: "Excelente", value: 5, color: "bg-success" },
    { label: "Bueno", value: 4, color: "bg-success-300" },
    { label: "Aceptable", value: 3, color: "bg-primary-100" },
    { label: "Satisfactorio", value: 2, color: "bg-warning" },
    { label: "Insatisfactorio", value: 1, color: "bg-danger" },
];

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ categoryName }) => (
    <div className="flex flex-col px-4 pt-4 pb-0">
        <p className="text-lg md:text-xl lg:text-2xl font-bold text-center">{categoryName}</p>
        <div className="flex flex-col md:flex-row w-full justify-between mt-2">
            <div className="w-full md:w-1/6 text-center md:text-left mb-2 md:mb-0"> <p>Categorías</p> </div>
            <div className="w-full md:w-1/6 text-center md:text-left mb-2 md:mb-0"> <p>Incógnitas de evaluación</p> </div>
            {evaluationCriteria.map((criteria) => (
                <div key={criteria.value} className={`w-full md:w-1/6 text-center rounded-md py-1 mx-2 mb-2 md:mb-0 ${criteria.color}`}>
                    <p className="font-bold">{criteria.value}</p> {criteria.label}
                </div>
            ))}
        </div>
    </div>
);

export default CategoryHeader;
