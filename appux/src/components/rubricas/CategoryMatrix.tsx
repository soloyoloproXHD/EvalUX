import React from 'react';
import { motion } from 'framer-motion';
import CategoryHeader from './CategoryHeader';
import SubcategoryRow from './SubcategoryRow';
import { Card, CardBody } from "@nextui-org/react";

interface Category {
    name: string;
    subcategories: {
        name: string;
        evaluations: (string | null)[];
        unknown: string;
    }[];
}

interface CategoryMatrixProps {
    category: Category;
    onUpdateCategory: (updatedCategory: Category) => void;
}

const CategoryMatrix: React.FC<CategoryMatrixProps> = ({ category, onUpdateCategory }) => {
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="w-full mb-4">
                <CategoryHeader categoryName={category.name} />
                <CardBody className="px-4">
                    {category.subcategories.map((subcategory, subcategoryIndex) => (
                        <SubcategoryRow
                            key={subcategory.name}
                            subcategoryName={subcategory.name}
                            evaluations={subcategory.evaluations}
                            unknown={subcategory.unknown}
                            onChangeEvaluation={(evaluationIndex, value) => handleCellChange(subcategoryIndex, evaluationIndex, value)}
                            onChangeUnknown={(value) => handleUnknownChange(subcategoryIndex, value)}
                        />
                    ))}
                </CardBody>
            </Card>
        </motion.div>
    );
};

export default CategoryMatrix;
