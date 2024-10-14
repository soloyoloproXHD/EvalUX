import React from 'react';
import EvaluationCell from './EvaluationCell';
import { Textarea } from "@nextui-org/react";

interface SubcategoryRowProps {
    subcategoryName: string;
    evaluations: (string | null)[];
    unknown: string;
    onChangeEvaluation: (evaluationIndex: number, value: string) => void;
    onChangeUnknown: (value: string) => void;
}

const SubcategoryRow: React.FC<SubcategoryRowProps> = ({
    subcategoryName,
    evaluations,
    unknown,
    onChangeEvaluation,
    onChangeUnknown,
}) => (
    <div className="flex w-full mb-2">
        <div className="w-1/6 flex items-center">{subcategoryName}</div>
        <div className="w-1/6 pr-2">
            <Textarea
                className="w-full h-24 text-sm font-normal"
                placeholder="Ingrese incógnitas"
                value={unknown}
                onChange={(e) => onChangeUnknown(e.target.value)}
            />
        </div>
        {evaluations.map((evaluation, evaluationIndex) => (
            <div key={evaluationIndex} className="w-1/6 mx-2 overflow-hidden">
                <EvaluationCell
                    value={evaluation}
                    onChange={(value) => onChangeEvaluation(evaluationIndex, value)}
                />
            </div>
        ))}
    </div>
);

export default SubcategoryRow;
