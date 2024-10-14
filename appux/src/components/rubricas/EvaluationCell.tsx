import React from 'react';
import { Textarea } from "@nextui-org/react";

interface EvaluationCellProps {
    value: string | null;
    onChange: (value: string) => void;
}

const EvaluationCell: React.FC<EvaluationCellProps> = ({ value, onChange }) => (
    <Textarea
        className="w-full h-24 text-sm font-normal"
        placeholder="Ingrese evaluación"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
    />
);

export default EvaluationCell;
